import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { createPaymentOrder, getTokenBalance, getTokenTransactions, verifyPayment } from '../utils/api'
import { COOKIE_KEYS, getCookie } from '../utils/cookies'

interface TokenTransaction {
    id: string
    action_id: string
    token: number
    available_token: number
    timestamp: string
}

interface UseTokensReturn {
    tokenBalance: number
    isBalanceLoading: boolean
    error: string | null
    transactions: TokenTransaction[]
    historyLoading: boolean
    buyModalOpen: boolean
    setBuyModalOpen: (open: boolean) => void
    buyAmount: number
    setBuyAmount: (amount: number) => void
    buyLoading: boolean
    handleBuyTokens: (onSuccess?: () => void) => Promise<void>
    openHistoryModal: () => Promise<void>
    historyModalOpen: boolean
    setHistoryModalOpen: (open: boolean) => void
    refreshBalance: () => Promise<void>
}

export const useTokens = (): UseTokensReturn => {
    const [tokenBalance, setTokenBalance] = useState<number>(0)
    const [isBalanceLoading, setIsBalanceLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [transactions, setTransactions] = useState<TokenTransaction[]>([])
    const [historyLoading, setHistoryLoading] = useState(false)
    const [buyModalOpen, setBuyModalOpen] = useState(false)
    const [buyAmount, setBuyAmount] = useState(100)
    const [buyLoading, setBuyLoading] = useState(false)
    const [historyModalOpen, setHistoryModalOpen] = useState(false)

    const refreshBalance = useCallback(async () => {
        try {
            setIsBalanceLoading(true)
            setError(null)
            const balance = await getTokenBalance()
            setTokenBalance(balance.available_token)
        } catch (e) {
            setError('-')
            console.error('Error fetching token balance:', e)
        } finally {
            setIsBalanceLoading(false)
        }
    }, [])

    // Initialize token balance on component mount
    useEffect(() => {
        refreshBalance()
    }, [refreshBalance])

    const handleBuyTokens = useCallback(async (onSuccess?: () => void) => {
        if (buyAmount < 1) {
            toast.error('Please enter a valid amount')
            return
        }

        setError(null)
        try {
            setBuyLoading(true)
            const { order } = await createPaymentOrder(buyAmount)

            // Load Razorpay SDK
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                order_id: order.id,
                name: "WhatTheCV",
                description: "Token Purchase",
                handler: async function (response: any) {
                    try {
                        await verifyPayment({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        })
                        await refreshBalance()
                        setBuyModalOpen(false)
                        toast.success('Payment successful! Tokens added to your account.')
                        if (onSuccess) {
                            onSuccess()
                        }
                    } catch (error) {
                        console.error('Payment verification failed:', error)
                        toast.error('Payment verification failed. Please contact support.')
                    }
                },
                prefill: {
                    email: getCookie(COOKIE_KEYS.USER_EMAIL) || '',
                },
                theme: { color: '#fbbf24' }
            }

            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.async = true
            script.onload = () => {
                const rzp = new window.Razorpay(options)
                rzp.open()
            }
            script.onerror = () => {
                console.error('Failed to load Razorpay SDK')
                toast.error('Failed to load payment gateway. Please try again.')
                setBuyLoading(false)
            }
            document.body.appendChild(script)
        } catch (e) {
            console.error('Failed to initiate payment:', e)
            toast.error('Failed to initiate payment. Please try again.')
        } finally {
            setBuyLoading(false)
        }
    }, [buyAmount, refreshBalance])

    const openHistoryModal = useCallback(async () => {
        setHistoryLoading(true)
        setError(null)
        setHistoryModalOpen(true)
        try {
            const txs = await getTokenTransactions()
            setTransactions(txs)
        } catch (e) {
            toast.error('Failed to fetch transaction history')
        } finally {
            setHistoryLoading(false)
        }
    }, [])

    return {
        tokenBalance,
        isBalanceLoading,
        error,
        transactions,
        historyLoading,
        buyModalOpen,
        setBuyModalOpen,
        buyAmount,
        setBuyAmount,
        buyLoading,
        handleBuyTokens,
        openHistoryModal,
        historyModalOpen,
        setHistoryModalOpen,
        refreshBalance
    }
} 