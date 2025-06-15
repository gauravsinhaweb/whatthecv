import axios from 'axios';
import { AIAnalysisResult, EnhancedResumeData, ResumeCheckResult, ResumeResponse } from './types.ts';
import { supabase, refreshSession } from '../lib/supabase';
import { getToken, setToken } from './storage';
import { ResumeData, ResumeCustomizationOptions } from '../types/resume';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

interface DraftResponse {
    success: boolean;
    draftId: string;
    message: string;
}

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
                // Get current Supabase session
                const { data: { session } } = await supabase.auth.getSession();

                if (session) {
                    // Update the authorization header with the new token
                    originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
                    setToken(session.access_token);

                    // Retry the original request
                    return api(originalRequest);
                } else {
                    // If no session, try to refresh it
                    const { data: { session: newSession } } = await supabase.auth.refreshSession();

                    if (newSession) {
                        // Update the authorization header with the new token
                        originalRequest.headers.Authorization = `Bearer ${newSession.access_token}`;
                        setToken(newSession.access_token);

                        // Retry the original request
                        return api(originalRequest);
                    } else {
                        // If refresh fails, redirect to login
                        window.location.href = '/login';
                        return Promise.reject(new Error('Session expired. Please login again.'));
                    }
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // If refresh fails, redirect to login
                window.location.href = '/login';
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
export async function enhanceResume(
    resumeText: string,
    includeExtractedText: boolean = false
): Promise<EnhancedResumeData> {
    try {
        const response = await api.post('/resume/enhance', null, {
            params: {
                resume_text: resumeText,
                include_extracted_text: includeExtractedText
            }
        });

        return response.data;
    } catch (error) {
        console.error('Resume enhancement error:', error);
        throw error;
    }
}

/**
 * Enhance resume from file directly (newer approach that processes file on backend)
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
        const processedData = processEnhancedResumeData(response.data);

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

/**
 * Process and validate enhanced resume data from backend
 */
function processEnhancedResumeData(data: any): EnhancedResumeData {
    // Separate name from position if they're combined
    let name = data.personalInfo?.name || '';
    let position = data.personalInfo?.position || data.personalInfo?.title || '';

    // Position keywords that might appear in the name field
    const positionKeywords = [
        "fullstack", "full stack", "full-stack",
        "frontend", "front end", "front-end",
        "backend", "back end", "back-end",
        "software", "developer", "engineer",
        "manager", "director", "lead",
        "designer", "ui", "ux",
        "data", "product", "analyst",
        "senior", "junior", "architect"
    ];

    // Clean the name if it contains position keywords
    if (name) {
        const nameParts = name.split(' ');
        const cleanNameParts = [];
        const positionParts = [];

        for (const part of nameParts) {
            if (positionKeywords.some(keyword =>
                part.toLowerCase().includes(keyword) ||
                part.toLowerCase() === keyword
            )) {
                positionParts.push(part);
            } else {
                cleanNameParts.push(part);
            }
        }

        if (positionParts.length > 0) {
            name = cleanNameParts.join(' ');
            const extractedPosition = positionParts.join(' ');

            // Only update position if it would add new information
            if (!position) {
                position = extractedPosition;
            } else if (!position.toLowerCase().includes(extractedPosition.toLowerCase())) {
                position = `${extractedPosition} ${position}`;
            }
        }
    }

    // Ensure personal info has all required fields
    const personalInfo = {
        name: name || '',
        position: position || '',
        email: data.personalInfo?.email || '',
        phone: data.personalInfo?.phone || '',
        location: data.personalInfo?.location || '',
        summary: data.personalInfo?.summary || '',
        profilePicture: data.personalInfo?.profilePicture || null
    };

    // Process work experience
    const workExperience = Array.isArray(data.workExperience)
        ? data.workExperience.map((exp, index) => ({
            id: exp.id || `work-${index + 1}`,
            position: exp.position || exp.title || '',
            company: exp.company || '',
            location: exp.location || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            current: !!exp.current,
            description: exp.description || ''
        }))
        : [];

    // Process education
    const education = Array.isArray(data.education)
        ? data.education.map((edu, index) => ({
            id: edu.id || `edu-${index + 1}`,
            degree: edu.degree || '',
            institution: edu.institution || '',
            location: edu.location || '',
            startDate: edu.startDate || '',
            endDate: edu.endDate || '',
            description: edu.description || ''
        }))
        : [];

    // Process skills (ensure it's an array of strings)
    const skills = Array.isArray(data.skills)
        ? data.skills
            .filter(skill => typeof skill === 'string' && skill.trim() !== '')
            .map(skill => skill.trim()) // Clean up skills
        : [];

    // Process projects
    const projects = Array.isArray(data.projects)
        ? data.projects.map((proj, index) => ({
            id: proj.id || `proj-${index + 1}`,
            name: proj.name || '',
            description: proj.description || '',
            technologies: proj.technologies || '',
            link: proj.link || ''
        }))
        : [];

    // Construct the validated data
    const validatedData: EnhancedResumeData = {
        personalInfo,
        workExperience,
        education,
        skills,
        projects
    };

    return validatedData;
}

/**
 * Process a resume file entirely on the backend - extraction and analysis
 */
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

export default api; 