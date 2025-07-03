import axios from 'axios';
import supabase from '../lib/supabase';
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

    // Remove Content-Type header for FormData requests to let browser set it automatically
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
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
                    return Promise.reject(new Error('Session expired. Please login again.'));
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // If refresh fails, redirect to login
                // window.location.href = '/auth/login';
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
        const params: any = {
            resume_text: resumeText
        };
        if (jobDescription) {
            params.job_description = jobDescription;
        }

        const response = await api.post('/resume/analyze', null, { params });

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
        // Validate file
        if (!file || !(file instanceof File)) {
            throw new Error('Invalid file provided');
        }

        console.log('Enhancing file:', {
            name: file.name,
            size: file.size,
            type: file.type
        });

        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/resume/enhance-file', formData, {
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
    jobDescription?: string,
    returnText: boolean = false
): Promise<AIAnalysisResult> {
    try {
        // Validate file
        if (!file || !(file instanceof File)) {
            throw new Error('Invalid file provided');
        }

        console.log('Processing file:', {
            name: file.name,
            size: file.size,
            type: file.type
        });

        const formData = new FormData();
        formData.append('file', file);

        if (jobDescription) {
            formData.append('job_description', jobDescription);
        }

        // Add return_text as a query parameter
        const params = new URLSearchParams();
        if (returnText) {
            params.append('return_text', 'true');
        }

        const response = await api.post(`/resume/process-file?${params.toString()}`, formData);

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
        // Validate file
        if (!file || !(file instanceof File)) {
            throw new Error('Invalid file provided');
        }

        console.log('Checking file:', {
            name: file.name,
            size: file.size,
            type: file.type
        });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('return_text', returnText.toString());

        const response = await api.post('/resume/check-file', formData);

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

        const response = await api.put(`/resume/versions/${resumeId}`, formData);
        return response.data;
    } catch (error) {
        console.error('Error updating resume version:', error);
        throw error;
    }
}

/**
 * Delete a specific resume version
 */
export async function deleteResumeVersion(resumeId: string): Promise<{ message: string; storage_info: any }> {
    try {
        const response = await api.delete(`/resume/versions/${resumeId}`);
        return response.data;
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

export const updateResumeDraft = async (resumeId: string, resumeData: EnhancedResumeData, title: string, customizationOptions?: any) => {
    try {
        const response = await api.put(`/resume/versions/${resumeId}`, {
            resume_data: resumeData,
            title,
            customization_options: customizationOptions
        });

        return response.data;
    } catch (error) {
        console.error('Error updating resume draft:', error);
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

export const verifyPayment = async ({ razorpay_payment_id, razorpay_order_id, razorpay_signature }: { razorpay_payment_id: string, razorpay_order_id: string, razorpay_signature: string }) => {
    try {
        const res = await api.post('/token/verify-payment', {
            payment_id: razorpay_payment_id,
            order_id: razorpay_order_id,
            signature: razorpay_signature
        })
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

export const reserveTokens = async (action_id: string, token_amount: number) => {
    try {
        const res = await api.post('/token/reserve', null, {
            params: { action_id, token_amount }
        });
        return res.data;
    } catch (error) {
        console.error('Error reserving tokens:', error);
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
            const message = error.response?.data?.detail || 'Failed to reserve tokens';
            throw new Error(message);
        }
        throw new Error('Failed to reserve tokens. Please try again.');
    }
};

export const confirmTokenUsage = async (reservation_id: string) => {
    try {
        const res = await api.post('/token/confirm', {}, {
            params: { reservation_id }
        });
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.detail || 'Failed to confirm token usage';

            // Handle specific error cases
            if (error.response?.status === 400) {
                if (message.includes('expired') || message.includes('released')) {
                    throw new Error('Token reservation expired. Please try again.');
                } else if (message.includes('already been confirmed')) {
                    throw new Error('Token reservation already confirmed.');
                } else if (message.includes('Insufficient tokens')) {
                    throw new Error(message);
                }
            }

            throw new Error(message);
        }
        throw new Error('Failed to confirm token usage. Please try again.');
    }
};

export const releaseTokens = async (reservation_id: string) => {
    try {
        const res = await api.post('/token/release', null, {
            params: { reservation_id }
        });
        return res.data;
    } catch (error) {
        console.error('Error releasing tokens:', error);
        throw new Error('Failed to release tokens. Please try again.');
    }
};

export const getTokenActions = async () => {
    try {
        const res = await api.get('/token/actions');
        return res.data;
    } catch (error) {
        console.error('Error fetching token actions:', error);
        throw new Error('Failed to fetch token actions. Please try again.');
    }
};

export const updateTokenAmount = async (action_id: string, amount: number) => {
    try {
        const res = await api.put(`/token/actions/${action_id}/amount`, null, {
            params: { amount }
        });
        return res.data;
    } catch (error) {
        console.error('Error updating token amount:', error);
        throw new Error('Failed to update token amount. Please try again.');
    }
};

export const createTokenAction = async (action_id: string, amount: number, name: string, description: string, category: string, locked: boolean = true) => {
    try {
        const res = await api.post('/token/actions', null, {
            params: { action_id, amount, name, description, category, locked }
        });
        return res.data;
    } catch (error) {
        console.error('Error creating token action:', error);
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 400) {
                throw new Error(error.response.data.detail || 'Invalid token action data.');
            }
            if (error.response?.status === 401) {
                throw new Error('Please login to continue.');
            }
        }
        throw new Error('Failed to create token action. Please try again.');
    }
};

export const deleteTokenAction = async (action_id: string) => {
    try {
        const res = await api.delete(`/token/actions/${action_id}`);
        return res.data;
    } catch (error) {
        console.error('Error deleting token action:', error);
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 400) {
                throw new Error(error.response.data.detail || 'Cannot delete this token action.');
            }
            if (error.response?.status === 404) {
                throw new Error('Token action not found.');
            }
            if (error.response?.status === 401) {
                throw new Error('Please login to continue.');
            }
        }
        throw new Error('Failed to delete token action. Please try again.');
    }
};

export const toggleActionLock = async (action_id: string) => {
    try {
        const res = await api.post(`/token/actions/${action_id}/toggle-lock`);
        return res.data;
    } catch (error) {
        console.error('Error toggling action lock:', error);
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 400) {
                throw new Error(error.response.data.detail || 'Cannot toggle lock for this action.');
            }
            if (error.response?.status === 404) {
                throw new Error('Token action not found.');
            }
            if (error.response?.status === 401) {
                throw new Error('Please login to continue.');
            }
        }
        throw new Error('Failed to toggle action lock. Please try again.');
    }
};

export const getActionLockStatus = async (action_id: string) => {
    try {
        const res = await api.get(`/token/actions/${action_id}/lock-status`);
        return res.data;
    } catch (error) {
        console.error('Error getting action lock status:', error);
        throw new Error('Failed to get action lock status. Please try again.');
    }
};

/**
 * Get user's storage information
 */
export async function getStorageInfo(): Promise<any> {
    try {
        const response = await api.get('/resume/storage/info');
        return response.data;
    } catch (error) {
        console.error('Error fetching storage info:', error);
        throw error;
    }
}

/**
 * Purchase additional storage space
 */
export async function purchaseStorageSpace(): Promise<any> {
    try {
        const response = await api.post('/resume/storage/purchase');
        return response.data;
    } catch (error) {
        console.error('Error purchasing storage space:', error);
        throw error;
    }
}

/**
 * Get storage action information
 */
export async function getStorageActionInfo(): Promise<any> {
    try {
        const response = await api.get('/resume/storage/action-info');
        return response.data;
    } catch (error) {
        console.error('Error fetching storage action info:', error);
        throw error;
    }
}

export default api; 