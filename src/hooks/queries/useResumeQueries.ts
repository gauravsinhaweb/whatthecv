import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { resumeService } from '../../services/resumeService'
import { queryKeys } from '../../lib/queryClient'
import { handleApiError } from '../../services/apiService'
import type { ResumeData } from '../../types/resume'
import { useAuth } from '../useAuth'

// Resume versions queries
export const useResumeVersions = () => {
    const { isAuthenticated } = useAuth()

    return useQuery({
        queryKey: queryKeys.resumes.versions(),
        queryFn: resumeService.getResumeVersions,
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
        enabled: isAuthenticated, // Only run if user is authenticated
        retry: (failureCount, error: any) => {
            // Don't retry on 401 errors (authentication issues)
            if (error?.response?.status === 401) {
                return false
            }
            return failureCount < 3
        },
    })
}

export const useResumeById = (id: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: queryKeys.resumes.detail(id),
        queryFn: () => resumeService.getResumeById(id),
        enabled: enabled && !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    })
}

// Resume mutations
export const useSaveResume = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ resumeData, title, customizationOptions, resumeId }: {
            resumeData: ResumeData
            title: string
            customizationOptions?: any
            resumeId?: string
        }) => {
            if (resumeId) {
                return resumeService.updateResume(resumeId, {
                    resume_data: resumeData,
                    title,
                    customization_options: customizationOptions
                })
            } else {
                return resumeService.saveResumeDraft({
                    resume_data: resumeData,
                    title,
                    customization_options: customizationOptions
                })
            }
        },
        onSuccess: (data, variables) => {
            // Invalidate and refetch resume versions
            queryClient.invalidateQueries({ queryKey: queryKeys.resumes.versions() })

            // Force refetch to ensure we get the latest data
            queryClient.refetchQueries({ queryKey: queryKeys.resumes.versions() })

            // If updating existing resume, invalidate its detail
            if (variables.resumeId) {
                queryClient.invalidateQueries({ queryKey: queryKeys.resumes.detail(variables.resumeId) })
            }

        },
        onError: (error) => {
            handleApiError(error, 'Failed to save resume')
        },
    })
}

export const useDeleteResume = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => resumeService.deleteResumeVersion(id),
        onSuccess: (data, id) => {
            // Remove from cache and invalidate
            queryClient.removeQueries({ queryKey: queryKeys.resumes.detail(id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.resumes.versions() })

            toast.success('Resume deleted successfully')
        },
        onError: (error) => {
            handleApiError(error, 'Failed to delete resume')
        },
    })
}

// Resume analysis queries
export const useCheckResumeFile = (file: File | null, returnText: boolean = false) => {
    return useQuery({
        queryKey: ['resume', 'check-file', file?.name, returnText],
        queryFn: () => resumeService.checkResumeFile(file!, returnText),
        enabled: !!file,
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
    })
}

// Resume analysis mutations
export const useAnalyzeResume = () => {
    return useMutation({
        mutationFn: ({ resumeData, jobDescription }: { resumeData: ResumeData; jobDescription?: string }) =>
            resumeService.analyzeResume(resumeData, jobDescription),
        onError: (error) => {
            handleApiError(error, 'Failed to analyze resume')
        },
    })
}

export const useEnhanceResumeFromFile = () => {
    return useMutation({
        mutationFn: ({ file, onProgress }: { file: File; onProgress?: (progress: number) => void }) =>
            resumeService.enhanceResumeFromFile(file, onProgress),
        onError: (error) => {
            handleApiError(error, 'Failed to enhance resume')
        },
    })
}

export const useEnhanceResume = () => {
    return useMutation({
        mutationFn: ({ resumeData, enhancementType }: { resumeData: ResumeData; enhancementType?: string }) =>
            resumeService.enhanceResume(resumeData, enhancementType),
        onError: (error) => {
            handleApiError(error, 'Failed to enhance resume')
        },
    })
} 