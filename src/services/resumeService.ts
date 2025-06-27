import { ResumeData, AIAnalysisResult, ResumeCheckResult } from '../types/resume'
import { apiService } from './apiService'
import { handleApiError } from './apiService'

// Resume API types
export interface SaveResumeRequest {
    resume_data: ResumeData
    title: string
    customization_options?: any
}

export interface SaveResumeResponse {
    success: boolean
    message: string
    resume_id?: string
}

export interface ResumeEnhancementRequest {
    resumeData: ResumeData
    enhancement_type?: string
}

export interface ResumeEnhancementResponse {
    success: boolean
    message: string
    enhanced_resume?: ResumeData
}

// Resume Service class
class ResumeService {
    // Save resume draft
    async saveResumeDraft(request: SaveResumeRequest): Promise<SaveResumeResponse> {
        return apiService.post<SaveResumeResponse>('/resume/save', request)
    }

    // Update existing resume
    async updateResume(resumeId: string, request: SaveResumeRequest): Promise<SaveResumeResponse> {
        return apiService.put<SaveResumeResponse>(`/resume/versions/${resumeId}`, request)
    }

    // Get resume versions
    async getResumeVersions(): Promise<any[]> {
        return apiService.get<any[]>('/resume/versions')
    }

    // Delete resume version
    async deleteResumeVersion(resumeId: string): Promise<{ success: boolean; message: string }> {
        return apiService.delete<{ success: boolean; message: string }>(`/resume/versions/${resumeId}`)
    }

    // Get resume by ID
    async getResumeById(resumeId: string): Promise<any> {
        return apiService.get<any>(`/resume/versions/${resumeId}`)
    }

    // Analyze resume
    async analyzeResume(resumeData: ResumeData, jobDescription?: string): Promise<AIAnalysisResult> {
        return apiService.post<AIAnalysisResult>('/resume/analyze', {
            resume_data: resumeData,
            job_description: jobDescription
        })
    }

    // Check if file is a resume
    async checkResumeFile(file: File, returnText: boolean = false): Promise<ResumeCheckResult> {
        return apiService.uploadFile<ResumeCheckResult>('/resume/check-file', file, undefined, {
            params: { return_text: returnText }
        })
    }

    // Extract text from resume file
    async extractTextFromFile(file: File): Promise<{ text: string }> {
        return apiService.uploadFile<{ text: string }>('/resume/extract-text', file)
    }

    // Enhance resume from file
    async enhanceResumeFromFile(file: File, onProgress?: (progress: number) => void): Promise<ResumeData> {
        return apiService.uploadFile<ResumeData>('/resume/enhance-file', file, onProgress)
    }

    // Enhance existing resume
    async enhanceResume(resumeData: ResumeData, enhancementType: string = 'general'): Promise<ResumeData> {
        return apiService.post<ResumeData>('/resume/enhance', {
            resume_data: resumeData,
            enhancement_type: enhancementType
        })
    }

    // Get resume suggestions
    async getResumeSuggestions(resumeData: ResumeData, suggestionType: string = 'general'): Promise<any> {
        return apiService.post<any>('/resume/suggestions', {
            resume_data: resumeData,
            suggestion_type: suggestionType
        })
    }

    // Compare resume with job description
    async compareWithJobDescription(resumeData: ResumeData, jobDescription: string): Promise<any> {
        return apiService.post<any>('/resume/compare', {
            resume_data: resumeData,
            job_description: jobDescription
        })
    }

    // Generate cover letter
    async generateCoverLetter(resumeData: ResumeData, jobDescription: string, companyName?: string): Promise<any> {
        return apiService.post<any>('/resume/generate-cover-letter', {
            resume_data: resumeData,
            job_description: jobDescription,
            company_name: companyName
        })
    }

    // Get resume templates
    async getResumeTemplates(): Promise<any[]> {
        return apiService.get<any[]>('/resume/templates')
    }

    // Apply template to resume
    async applyTemplate(resumeData: ResumeData, templateId: string): Promise<ResumeData> {
        return apiService.post<ResumeData>('/resume/apply-template', {
            resume_data: resumeData,
            template_id: templateId
        })
    }

    // Export resume to different formats
    async exportResume(resumeData: ResumeData, format: 'pdf' | 'docx' | 'txt' = 'pdf', customizationOptions?: any): Promise<Blob> {
        const response = await apiService.post<Blob>('/resume/export', {
            resume_data: resumeData,
            format,
            customization_options: customizationOptions
        }, undefined, { responseType: 'blob' })
        return response
    }

    // Get resume statistics
    async getResumeStats(): Promise<any> {
        return apiService.get<any>('/resume/stats')
    }

    // Share resume
    async shareResume(resumeId: string, shareSettings: any): Promise<any> {
        return apiService.post<any>(`/resume/versions/${resumeId}/share`, shareSettings)
    }

    // Get shared resume
    async getSharedResume(shareToken: string): Promise<any> {
        return apiService.get<any>(`/resume/shared/${shareToken}`)
    }

    // Duplicate resume
    async duplicateResume(resumeId: string, newTitle?: string): Promise<any> {
        return apiService.post<any>(`/resume/versions/${resumeId}/duplicate`, {
            new_title: newTitle
        })
    }

    // Archive resume
    async archiveResume(resumeId: string): Promise<any> {
        return apiService.post<any>(`/resume/versions/${resumeId}/archive`)
    }

    // Restore archived resume
    async restoreResume(resumeId: string): Promise<any> {
        return apiService.post<any>(`/resume/versions/${resumeId}/restore`)
    }

    // Get archived resumes
    async getArchivedResumes(): Promise<any[]> {
        return apiService.get<any[]>('/resume/archived')
    }

    // Search resumes
    async searchResumes(query: string, filters?: any): Promise<any[]> {
        return apiService.get<any[]>('/resume/search', { params: { q: query, ...filters } })
    }

    // Bulk operations
    async bulkDeleteResumes(resumeIds: string[]): Promise<any> {
        return apiService.post<any>('/resume/bulk-delete', { resume_ids: resumeIds })
    }

    async bulkArchiveResumes(resumeIds: string[]): Promise<any> {
        return apiService.post<any>('/resume/bulk-archive', { resume_ids: resumeIds })
    }

    async bulkRestoreResumes(resumeIds: string[]): Promise<any> {
        return apiService.post<any>('/resume/bulk-restore', { resume_ids: resumeIds })
    }

    // Resume validation
    async validateResume(resumeData: ResumeData): Promise<any> {
        return apiService.post<any>('/resume/validate', { resume_data: resumeData })
    }

    // Get resume feedback
    async getResumeFeedback(resumeId: string): Promise<any> {
        return apiService.get<any>(`/resume/versions/${resumeId}/feedback`)
    }

    // Submit resume feedback
    async submitResumeFeedback(resumeId: string, feedback: any): Promise<any> {
        return apiService.post<any>(`/resume/versions/${resumeId}/feedback`, feedback)
    }
}

export const resumeService = new ResumeService() 