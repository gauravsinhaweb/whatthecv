import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { tokenService } from '../../services/tokenService'
import { queryKeys } from '../../lib/queryClient'
import { handleApiError } from '../../services/apiService'
import type { PaymentVerification } from '../../services/tokenService'
import { useUserStore } from '../../store/userStore'

// Token queries
export const useTokenBalance = () => {
    const { isAuthenticated } = useUserStore()

    return useQuery({
        queryKey: queryKeys.tokens.balance(),
        queryFn: tokenService.getTokenBalance,
        staleTime: 30 * 1000, // 30 seconds
        gcTime: 2 * 60 * 1000, // 2 minutes
        select: (data) => data.available_token, // Extract just the balance number
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

export const useTokenTransactions = () => {
    const { isAuthenticated } = useUserStore()

    return useQuery({
        queryKey: queryKeys.tokens.transactions(),
        queryFn: tokenService.getTokenTransactions,
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
        select: (data) => data.items, // Extract the items array
        enabled: isAuthenticated, // Only run if user is authenticated
    })
}

export const useTokenActions = () => {
    const { isAuthenticated } = useUserStore()

    return useQuery({
        queryKey: queryKeys.tokens.actions(),
        queryFn: tokenService.getTokenActions,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        select: (data) => Object.values(data), // Convert object to array
        enabled: isAuthenticated, // Only run if user is authenticated
    })
}

// Token mutations
export const useSpendTokens = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ actionId, amount }: { actionId: string; amount: number }) =>
            tokenService.spendTokens(actionId, amount),
        onSuccess: (data) => {
            // Update token balance in cache
            queryClient.setQueryData(queryKeys.tokens.balance(), data)
            // Invalidate transactions to refetch
            queryClient.invalidateQueries({ queryKey: queryKeys.tokens.transactions() })
            toast.success('Tokens spent successfully')
        },
        onError: (error) => {
            handleApiError(error, 'Failed to spend tokens')
        },
    })
}

export const useReserveTokens = () => {
    return useMutation({
        mutationFn: ({ actionId, amount }: { actionId: string; amount: number }) =>
            tokenService.reserveTokens(actionId, amount),
        retry: false, // Disable retries for token reservation
        onError: (error) => {
            handleApiError(error, 'Failed to reserve tokens')
        },
    })
}

export const useConfirmTokenUsage = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (reservationId: string) => tokenService.confirmTokenUsage(reservationId),
        retry: false, // Disable retries for token confirmation
        onSuccess: (data) => {
            // Update token balance in cache
            queryClient.setQueryData(queryKeys.tokens.balance(), data)
            // Invalidate transactions to refetch
            queryClient.invalidateQueries({ queryKey: queryKeys.tokens.transactions() })
            toast.success('Token usage confirmed')
        },
        onError: (error) => {
            handleApiError(error, 'Failed to confirm token usage')
        },
    })
}

export const useReleaseTokens = () => {
    return useMutation({
        mutationFn: (reservationId: string) => tokenService.releaseTokens(reservationId),
        retry: false, // Disable retries for token release
        onSuccess: () => {
            toast.success('Tokens released successfully')
        },
        onError: (error) => {
            handleApiError(error, 'Failed to release tokens')
        },
    })
}

// Payment mutations
export const useCreatePaymentOrder = () => {
    return useMutation({
        mutationFn: (amount: number) => tokenService.createPaymentOrder(amount),
        onError: (error) => {
            handleApiError(error, 'Failed to create payment order')
        },
    })
}

export const useVerifyPayment = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (verification: { payment_id: string; order_id: string; signature: string }) =>
            tokenService.verifyPayment(verification),
        onSuccess: (data) => {
            // Update token balance in cache
            queryClient.setQueryData(queryKeys.tokens.balance(), data)
            // Invalidate transactions to refetch
            queryClient.invalidateQueries({ queryKey: queryKeys.tokens.transactions() })
            toast.success('Payment verified successfully')
        },
        onError: (error) => {
            handleApiError(error, 'Failed to verify payment')
        },
    })
}

// Combined buy tokens hook
export const useBuyTokens = () => {
    const createOrderMutation = useCreatePaymentOrder()
    const verifyPaymentMutation = useVerifyPayment()

    const buyTokens = async (amount: number, onSuccess?: () => void) => {
        try {
            // Create payment order
            const orderResponse = await createOrderMutation.mutateAsync(amount)

            // Initialize Razorpay payment
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderResponse.order.amount,
                currency: orderResponse.order.currency,
                order_id: orderResponse.order.id,
                name: "WhatTheCV",
                description: "Token Purchase",
                handler: async function (response: any) {
                    try {
                        await verifyPaymentMutation.mutateAsync({
                            payment_id: response.razorpay_payment_id,
                            order_id: response.razorpay_order_id,
                            signature: response.razorpay_signature
                        })
                        // Call the success callback to close modal
                        if (onSuccess) {
                            onSuccess()
                        }
                    } catch (error) {
                        console.error('Payment verification failed:', error)
                        toast.error('Payment verification failed. Please contact support.')
                        throw error
                    }
                },
                prefill: {
                    email: "user@example.com",
                },
                theme: { color: '#fbbf24' }
            }

            // Load Razorpay SDK
            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.async = true
            script.onload = () => {
                const rzp = new (window as any).Razorpay(options)
                rzp.open()
            }
            script.onerror = () => {
                console.error('Failed to load Razorpay SDK')
                toast.error('Failed to load payment gateway. Please try again.')
                throw new Error('Failed to load Razorpay SDK')
            }
            document.body.appendChild(script)

        } catch (error) {
            console.error('Buy tokens failed:', error)
            throw error
        }
    }

    return {
        mutateAsync: buyTokens,
        isPending: createOrderMutation.isPending || verifyPaymentMutation.isPending,
        error: createOrderMutation.error || verifyPaymentMutation.error
    }
}

// Admin mutations (for super users)
export const useUpdateTokenAmount = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ actionId, amount }: { actionId: string; amount: number }) =>
            tokenService.updateTokenAmount(actionId, amount),
        onSuccess: () => {
            // Invalidate token actions
            queryClient.invalidateQueries({ queryKey: queryKeys.tokens.actions() })

            toast.success('Token amount updated successfully')
        },
        onError: (error) => {
            handleApiError(error, 'Failed to update token amount')
        },
    })
}

export const useCreateTokenAction = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            actionId,
            amount,
            name,
            description,
            category,
            locked
        }: {
            actionId: string
            amount: number
            name: string
            description: string
            category: string
            locked: boolean
        }) => tokenService.createTokenAction(actionId, amount, name, description, category, locked),
        onSuccess: () => {
            // Invalidate token actions
            queryClient.invalidateQueries({ queryKey: queryKeys.tokens.actions() })

            toast.success('Token action created successfully')
        },
        onError: (error) => {
            handleApiError(error, 'Failed to create token action')
        },
    })
}

export const useDeleteTokenAction = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (actionId: string) => tokenService.deleteTokenAction(actionId),
        onSuccess: () => {
            // Invalidate token actions
            queryClient.invalidateQueries({ queryKey: queryKeys.tokens.actions() })

            toast.success('Token action deleted successfully')
        },
        onError: (error) => {
            handleApiError(error, 'Failed to delete token action')
        },
    })
}

export const useToggleActionLock = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (actionId: string) => tokenService.toggleActionLock(actionId),
        onSuccess: () => {
            // Invalidate token actions
            queryClient.invalidateQueries({ queryKey: queryKeys.tokens.actions() })

            toast.success('Action lock toggled successfully')
        },
        onError: (error) => {
            handleApiError(error, 'Failed to toggle action lock')
        },
    })
}

export const useGetActionLockStatus = (actionId: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['tokens', 'actions', actionId, 'lock-status'],
        queryFn: () => tokenService.getActionLockStatus(actionId),
        enabled: enabled && !!actionId,
        staleTime: 1 * 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
    })
} 