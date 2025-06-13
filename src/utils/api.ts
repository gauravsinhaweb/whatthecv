import axios from 'axios';
import { supabase } from '../lib/supabase';
import { getToken, setToken } from './storage';
import { AIAnalysisResult, EnhancedResumeData, ResumeCheckResult, ResumeResponse } from './types.ts';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';


// Create axios instance with base configuration
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use(async (config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor for handling common error patterns and token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is due to an expired token and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the session
                const { data: { session: newSession } } = await supabase.auth.refreshSession();

                if (newSession) {
                    // Update the authorization header with the new token
                    originalRequest.headers.Authorization = `Bearer ${newSession.access_token}`;
                    setToken(newSession.access_token);

                    // Retry the original request
                    return api(originalRequest);
                } else {
                    // If refresh fails, redirect to login
                    window.location.href = '/auth/login';
                    return Promise.reject(new Error('Session expired. Please login again.'));
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // If refresh fails, redirect to login
                window.location.href = '/auth/login';
                return Promise.reject(new Error('Authentication failed. Please login again.'));
            }
        }

        // Handle other errors
        const errorMessage = error.response?.data?.detail || 'An unexpected error occurred';
        console.error('API request failed:', errorMessage);
        return Promise.reject(new Error(errorMessage));
    }
);

// Resume analysis API functions

/**
 * Check if a text is a resume with enhanced detection
 */
export async function checkIfResume(text: string): Promise<ResumeCheckResult> {
    try {
        const response = await api.post('/resume/check', null, {
            params: {
                text: text,
                return_text: false
            }
        });
        return response.data;
    } catch (error) {
        console.error('Resume detection error:', error);
        // Default fallback if the API fails
        return {
            is_resume: true, // Default to true to avoid blocking user flow
            confidence: 0.5,
            detected_sections: [],
            reasoning: "Detection failed, assuming document is a resume"
        };
    }
}

/**
 * Analyze resume text with optional job description
 */
export async function analyzeResume(
    resumeText: string,
    jobDescription?: string
): Promise<AIAnalysisResult> {
    try {
        const response = await api.post('/resume/analyze', null, {
            params: {
                resume_text: resumeText,
                job_description: jobDescription
            }
        });

        return response.data;
    } catch (error) {
        console.error('Resume analysis error:', error);
        throw error;
    }
}

/**
 * Get improvement suggestions for a specific resume section
 */
export async function getSectionSuggestions(
    section: string,
    content: string,
    jobDescription?: string
): Promise<string[]> {
    try {
        const response = await api.post('/resume/improve-section', {
            section,
            content,
            job_description_id: null  // Using null as we don't have job description ID in the frontend
        });

        return response.data;
    } catch (error) {
        console.error('Section suggestions error:', error);
        throw error;
    }
}

/**
 * Enhance resume for ATS optimization
 */
export async function enhanceResumeFromFile(
    file: File
): Promise<EnhancedResumeData> {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/resume/enhance-file', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 120000, // Increase timeout to 2 minutes
            validateStatus: status => true, // Don't throw on error status codes
            signal: undefined, // Remove any existing signal to prevent cancellation
        });

        if (response.status === 499) {
            throw new Error('Request was cancelled');
        }

        if (response.status !== 200) {
            throw new Error(`Server responded with status ${response.status}: ${response.statusText}`);
        }

        if (!response.data) {
            throw new Error('Received empty response from enhance-file endpoint');
        }

        // Verify we have the basic structure needed
        const requiredFields = ['personalInfo', 'workExperience', 'education', 'skills'];
        const missingFields = requiredFields.filter(field => !response.data[field]);

        if (missingFields.length > 0) {
            console.error('Response missing required fields:', missingFields);
            throw new Error(`Incomplete response data: missing ${missingFields.join(', ')}`);
        }

        // Process and validate the response data
        const processedData = response.data;

        return processedData;
    } catch (error) {
        console.error('Resume file enhancement error:', error);

        // Enhanced error logging
        if (axios.isAxiosError(error)) {
            console.error('Axios error details:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                headers: error.response?.headers,
                code: error.code,
                message: error.message,
            });

            // Handle specific error cases
            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timed out. Please try again.');
            }
            if (error.code === 'ERR_CANCELED') {
                throw new Error('Request was cancelled. Please try again.');
            }
            if (error.response?.status === 413) {
                throw new Error('File size too large. Please upload a smaller file.');
            }
            if (error.response?.status === 415) {
                throw new Error('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
            }
        }

        throw error;
    }
}

export async function processResumeFile(
    file: File,
    jobDescription?: string
): Promise<AIAnalysisResult> {
    try {
        const formData = new FormData();
        formData.append('file', file);

        if (jobDescription) {
            formData.append('job_description', jobDescription);
        }

        const response = await api.post('/resume/process-file', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Resume file processing error:', error);
        throw error;
    }
}

/**
 * Check if a file is a resume before processing
 */
export async function checkResumeFile(
    file: File,
    returnText: boolean = false
): Promise<ResumeCheckResult> {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('return_text', returnText.toString());

        const response = await api.post('/resume/check-file', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Resume file check error:', error);
        // Default fallback if the API fails
        return {
            is_resume: true, // Default to true to avoid blocking user flow
            confidence: 0.5,
            detected_sections: [],
            reasoning: "Detection failed, assuming document is a resume",
            extracted_text: returnText ? "Error extracting text" : undefined
        };
    }
}

/**
 * Get all resume versions for the current user
 */
export async function getResumeVersions(): Promise<ResumeResponse[]> {
    try {
        const response = await api.get('/resume/versions');
        return response.data;
    } catch (error) {
        console.error('Error fetching resume versions:', error);
        throw error;
    }
}

/**
 * Update a specific resume version
 */
export async function updateResumeVersion(resumeId: string, file: File): Promise<ResumeResponse> {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.put(`/resume/versions/${resumeId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating resume version:', error);
        throw error;
    }
}

/**
 * Delete a specific resume version
 */
export async function deleteResumeVersion(resumeId: string): Promise<void> {
    try {
        await api.delete(`/resume/versions/${resumeId}`);
    } catch (error) {
        console.error('Error deleting resume version:', error);
        throw error;
    }
}

export const saveDraft = async (resumeData: EnhancedResumeData, title: string, customizationOptions?: any, id?: string) => {
    try {
        const response = await api.post('/resume/save', {
            resume_data: resumeData,
            title,
            customization_options: customizationOptions,
            id
        });

        return response.data;
    } catch (error) {
        console.error('Error saving draft:', error);
        throw error;
    }
};

export const createPaymentOrder = async (amount: number) => {
    try {
        const res = await api.post('/token/create-payment-order', { amount });
        return res.data;
    } catch (error) {
        console.error('Error creating payment order:', error);
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 400) {
                throw new Error('Invalid amount. Please enter a valid amount greater than 0.');
            }
            if (error.response?.status === 401) {
                throw new Error('Please login to continue.');
            }
            if (error.response?.status === 500) {
                throw new Error('Failed to create payment order. Please try again later.');
            }
        }
        throw new Error('Failed to create payment order. Please try again.');
    }
};

export const verifyPayment = async (payment_id: string, order_id: string, signature: string, log_id: string) => {
    console.log('verifyPayment called with:', { payment_id, order_id, signature, log_id })
    try {
        const res = await api.post('/token/verify-payment', {
            payment_id,
            order_id,
            signature,
            log_id
        })
        console.log('verifyPayment response:', res.data)
        return res.data
    } catch (error) {
        console.error('verifyPayment error:', error)
        throw error
    }
};

export const getTokenBalance = async () => {
    try {
        const res = await api.get('/token/balance');
        return res.data;
    } catch (error) {
        console.error('Error fetching token balance:', error);
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                throw new Error('Please login to view your token balance.');
            }
        }
        throw new Error('Failed to fetch token balance. Please try again.');
    }
};

export const getTokenTransactions = async () => {
    try {
        const res = await api.get('/token/transactions');
        return res.data.items;
    } catch (error) {
        console.error('Error fetching token transactions:', error);
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                throw new Error('Please login to view your transaction history.');
            }
        }
        throw new Error('Failed to fetch token transactions. Please try again.');
    }
};

export const spendTokens = async (action_id: string, token: number) => {
    try {
        const res = await api.post(`/token/spend?action_id=${action_id}&token=${token}`);
        return res.data;
    } catch (error) {
        console.error('Error spending tokens:', error);
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 402) {
                throw new Error('Insufficient tokens. Please purchase more tokens to continue.');
            }
            if (error.response?.status === 401) {
                throw new Error('Please login to continue.');
            }
            if (error.response?.status === 422) {
                throw new Error('Invalid token amount or action. Please try again.');
            }
        }
        throw new Error('Failed to spend tokens. Please try again.');
    }
};

export default api; 