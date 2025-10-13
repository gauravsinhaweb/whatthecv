import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { toast } from 'react-hot-toast'
import supabase from '../lib/supabase'
import { getToken, setToken } from '../utils/storage'

// API Response types
export interface ApiResponse<T = any> {
    data: T
    message?: string
    success: boolean
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    total: number
    page: number
    limit: number
    hasMore: boolean
}

// Error types
export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public code?: string,
        public details?: any
    ) {
        super(message)
        this.name = 'ApiError'
    }
}

// API Service class
class ApiService {
    private api: AxiosInstance
    private isRefreshing = false
    private failedQueue: Array<{
        resolve: (value?: any) => void
        reject: (error?: any) => void
    }> = []

    constructor() {
        this.api = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        })

        this.setupInterceptors()
    }

    private setupInterceptors() {
        // Request interceptor
        this.api.interceptors.request.use(
            async (config) => {
                const token = getToken()
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
                return config
            },
            (error) => Promise.reject(error)
        )

        // Response interceptor
        this.api.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error) => {
                const originalRequest = error.config

                if (error.response?.status === 401 && !originalRequest._retry) {
                    if (this.isRefreshing) {
                        return new Promise((resolve, reject) => {
                            this.failedQueue.push({ resolve, reject })
                        }).then(() => this.api(originalRequest))
                    }

                    originalRequest._retry = true
                    this.isRefreshing = true

                    try {
                        const { data: { session: newSession } } = await supabase.auth.refreshSession()

                        if (newSession) {
                            setToken(newSession.access_token)
                            originalRequest.headers.Authorization = `Bearer ${newSession.access_token}`

                            this.failedQueue.forEach(({ resolve }) => resolve())
                            this.failedQueue = []

                            return this.api(originalRequest)
                        } else {
                            throw new Error('Session refresh failed')
                        }
                    } catch (refreshError) {
                        this.failedQueue.forEach(({ reject }) => reject(refreshError))
                        this.failedQueue = []
                        throw new ApiError('Authentication failed', 401)
                    } finally {
                        this.isRefreshing = false
                    }
                }

                return Promise.reject(this.handleError(error))
            }
        )
    }

    private handleError(error: any): ApiError {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500
            const message = error.response?.data?.detail || error.message || 'An unexpected error occurred'
            const code = error.code
            const details = error.response?.data

            return new ApiError(message, status, code, details)
        }

        return new ApiError(error.message || 'An unexpected error occurred', 500)
    }

    // Generic request methods
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.api.get<T>(url, config)
        return response.data
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.api.post<T>(url, data, config)
        return response.data
    }

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.api.put<T>(url, data, config)
        return response.data
    }

    async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.api.patch<T>(url, data, config)
        return response.data
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.api.delete<T>(url, config)
        return response.data
    }

    // File upload helper
    async uploadFile<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
        const formData = new FormData()
        formData.append('file', file)

        const response = await this.api.post<T>(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    onProgress(progress)
                }
            },
        })

        return response.data
    }
}

// Export singleton instance
export const apiService = new ApiService()

// Export error handler for global use
export const handleApiError = (error: unknown, customMessage?: string) => {
    if (error instanceof ApiError) {
        const message = customMessage || error.message
        toast.error(message)
        return error
    }

    const message = customMessage || 'An unexpected error occurred'
    toast.error(message)
    return new ApiError(message, 500)
} 