import axios from 'axios';
import { AIAnalysisResult, EnhancedResumeData, ResumeCheckResult } from './types.ts';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor for handling common error patterns
api.interceptors.response.use(
    (response) => response,
    (error) => {
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

        console.log('Sending enhance-file request with:', {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
        });

        const response = await api.post('/resume/enhance-file', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 60000, // 60 second timeout for longer processing
            validateStatus: status => true, // Don't throw on error status codes
        });

        console.log('Received enhance-file response:', {
            status: response.status,
            statusText: response.statusText,
        });

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

        // Additional validation to ensure name is not mixed with position
        if (processedData.personalInfo.name && processedData.personalInfo.name.includes('Fullstack')) {
            // Attempt to fix the name by removing the position part
            const nameParts = processedData.personalInfo.name.split(' ');
            const positionIndex = nameParts.findIndex(part =>
                part.toLowerCase().includes('fullstack') ||
                part.toLowerCase().includes('developer') ||
                part.toLowerCase().includes('engineer')
            );

            if (positionIndex > 0) {
                // Extract name and position parts
                const cleanName = nameParts.slice(0, positionIndex).join(' ');
                const positionPart = nameParts.slice(positionIndex).join(' ');

                // Update the data
                processedData.personalInfo.name = cleanName;

                // Only update position if it's not already set or if we can meaningfully combine them
                if (!processedData.personalInfo.position) {
                    processedData.personalInfo.position = positionPart;
                } else if (!processedData.personalInfo.position.toLowerCase().includes(positionPart.toLowerCase())) {
                    processedData.personalInfo.position = `${positionPart} ${processedData.personalInfo.position}`;
                }
            }
        }

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
            });
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

export default api; 