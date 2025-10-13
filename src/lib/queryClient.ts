import { QueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Time before data is considered stale (5 minutes)
            staleTime: 5 * 60 * 1000,
            // Time before inactive queries are garbage collected (10 minutes)
            gcTime: 10 * 60 * 1000,
            // Retry failed requests 3 times with exponential backoff
            retry: (failureCount, error: any) => {
                // Don't retry on 4xx errors (client errors)
                if (error?.response?.status >= 400 && error?.response?.status < 500) {
                    return false
                }
                return failureCount < 3
            },
            // Retry delay with exponential backoff
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Refetch on window focus (useful for keeping data fresh)
            refetchOnWindowFocus: false,
            // Refetch on reconnect
            refetchOnReconnect: true,
            // Refetch on mount if data is stale
            refetchOnMount: true,
        },
        mutations: {
            // Retry failed mutations once
            retry: 1,
            // Retry delay for mutations
            retryDelay: 1000,
            // Global error handler for mutations
            onError: (error: any) => {
                const message = error?.response?.data?.detail || error?.message || 'An error occurred'
                toast.error(message)
            },
        },
    },
})

// Query keys factory for better type safety and consistency
export const queryKeys = {
    // User related queries
    user: {
        all: ['user'] as const,
        profile: () => [...queryKeys.user.all, 'profile'] as const,
        balance: () => [...queryKeys.user.all, 'balance'] as const,
    },
    // Token related queries
    tokens: {
        all: ['tokens'] as const,
        balance: () => [...queryKeys.tokens.all, 'balance'] as const,
        transactions: () => [...queryKeys.tokens.all, 'transactions'] as const,
        actions: () => [...queryKeys.tokens.all, 'actions'] as const,
    },
    // Resume related queries
    resumes: {
        all: ['resumes'] as const,
        list: () => [...queryKeys.resumes.all, 'list'] as const,
        detail: (id: string) => [...queryKeys.resumes.all, 'detail', id] as const,
        versions: () => [...queryKeys.resumes.all, 'versions'] as const,
    },
    // Analysis related queries
    analysis: {
        all: ['analysis'] as const,
        results: (id: string) => [...queryKeys.analysis.all, 'results', id] as const,
    },
    // Storage related queries
    storage: {
        all: ['storage'] as const,
        info: () => [...queryKeys.storage.all, 'info'] as const,
        actionInfo: () => [...queryKeys.storage.all, 'actionInfo'] as const,
        actions: () => [...queryKeys.storage.all, 'actions'] as const,
    },
} as const

// Mutation keys factory
export const mutationKeys = {
    tokens: {
        buy: () => ['tokens', 'buy'] as const,
        spend: () => ['tokens', 'spend'] as const,
        reserve: () => ['tokens', 'reserve'] as const,
    },
    resumes: {
        save: () => ['resumes', 'save'] as const,
        update: () => ['resumes', 'update'] as const,
        delete: () => ['resumes', 'delete'] as const,
    },
    analysis: {
        upload: () => ['analysis', 'upload'] as const,
        process: () => ['analysis', 'process'] as const,
    },
} as const 