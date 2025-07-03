import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { storageService } from '../../services/storageService'
import { queryKeys } from '../../lib/queryClient'
import { handleApiError } from '../../services/apiService'
import { useUserStore } from '../../store/userStore'

// Storage info query
export const useStorageInfo = () => {
    const { isAuthenticated } = useUserStore()

    return useQuery({
        queryKey: queryKeys.storage.info(),
        queryFn: storageService.getStorageInfo,
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
        enabled: isAuthenticated, // Only run if user is authenticated
    })
}

// Storage action info query
export const useStorageActionInfo = () => {
    const { isAuthenticated } = useUserStore()

    return useQuery({
        queryKey: queryKeys.storage.actionInfo(),
        queryFn: storageService.getStorageActionInfo,
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        enabled: isAuthenticated, // Only run if user is authenticated
    })
}

// Combined storage and action info query
export const useStorageAndActionInfo = () => {
    const storageInfoQuery = useStorageInfo()
    const actionInfoQuery = useStorageActionInfo()

    return {
        storageInfo: storageInfoQuery.data,
        actionInfo: actionInfoQuery.data, // Return the object directly, not as array
        isLoading: storageInfoQuery.isLoading || actionInfoQuery.isLoading,
        error: storageInfoQuery.error || actionInfoQuery.error,
        refetch: () => {
            storageInfoQuery.refetch()
            actionInfoQuery.refetch()
        }
    }
}

// Purchase storage space mutation
export const usePurchaseStorageSpace = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (request: { amount: number; payment_method?: string }) =>
            storageService.purchaseStorageSpace(request),
        onSuccess: (data) => {
            // Update storage info in cache
            queryClient.setQueryData(queryKeys.storage.info(), data.storage_info)
            toast.success(data.message || 'Storage space purchased successfully')
        },
        onError: (error) => {
            handleApiError(error, 'Failed to purchase storage space')
        },
    })
} 