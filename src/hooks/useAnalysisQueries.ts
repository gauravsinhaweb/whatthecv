import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { queryKeys, mutationKeys } from '../lib/queryClient'

// Hook for uploading a resume for analysis
export const useUploadResume = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: mutationKeys.analysis.upload(),
        mutationFn: async (file: File) => {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/analysis/upload', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Failed to upload resume')
            }

            return response.json()
        },
        onSuccess: (data) => {
            toast.success('Resume uploaded successfully')
            // Invalidate analysis queries to refetch results
            queryClient.invalidateQueries({ queryKey: queryKeys.analysis.all })
        },
        onError: (error: any) => {
            const errorMessage = error instanceof Error ? error.message : 'Failed to upload resume'
            toast.error(errorMessage)
        },
    })
}

// Hook for processing analysis
export const useProcessAnalysis = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: mutationKeys.analysis.process(),
        mutationFn: async (analysisId: string) => {
            const response = await fetch(`/api/analysis/${analysisId}/process`, {
                method: 'POST',
            })

            if (!response.ok) {
                throw new Error('Failed to process analysis')
            }

            return response.json()
        },
        onSuccess: (data, variables) => {
            toast.success('Analysis processing started')
            // Invalidate specific analysis results
            queryClient.invalidateQueries({ queryKey: queryKeys.analysis.results(variables) })
        },
        onError: (error: any) => {
            const errorMessage = error instanceof Error ? error.message : 'Failed to process analysis'
            toast.error(errorMessage)
        },
    })
}

// Hook for fetching analysis results
export const useAnalysisResults = (analysisId: string | null) => {
    return useQuery({
        queryKey: queryKeys.analysis.results(analysisId!),
        queryFn: async () => {
            const response = await fetch(`/api/analysis/${analysisId}/results`)

            if (!response.ok) {
                throw new Error('Failed to fetch analysis results')
            }

            return response.json()
        },
        enabled: !!analysisId, // Only run query if analysisId is provided
        staleTime: 30 * 1000, // 30 seconds - analysis results can change frequently
        gcTime: 2 * 60 * 1000, // 2 minutes
        refetchInterval: (data) => {
            // Refetch every 5 seconds if analysis is still processing
            return data?.status === 'processing' ? 5000 : false
        },
    })
}

// Hook for fetching analysis status
export const useAnalysisStatus = (analysisId: string | null) => {
    return useQuery({
        queryKey: [...queryKeys.analysis.all, 'status', analysisId],
        queryFn: async () => {
            const response = await fetch(`/api/analysis/${analysisId}/status`)

            if (!response.ok) {
                throw new Error('Failed to fetch analysis status')
            }

            return response.json()
        },
        enabled: !!analysisId,
        staleTime: 10 * 1000, // 10 seconds
        gcTime: 1 * 60 * 1000, // 1 minute
        refetchInterval: (data) => {
            // Refetch every 3 seconds if analysis is still processing
            return data?.status === 'processing' ? 3000 : false
        },
    })
} 