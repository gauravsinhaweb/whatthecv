import { useState, useCallback, useEffect } from 'react'
import { createPaymentOrder, verifyPayment, getTokenBalance, getTokenTransactions } from '../utils/api'
import { toast } from 'react-hot-toast'

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
    handleBuyTokens: () => Promise<void>
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
            console.log('Token balance response:', balance)
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

    const handleBuyTokens = useCallback(async () => {
        if (buyAmount < 1) {
            toast.error('Please enter a valid amount')
            return
        }

        setBuyLoading(true)
        setError(null)
        try {
            const { order } = await createPaymentOrder(buyAmount)

            // Load Razorpay SDK
            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.async = true
            script.onload = () => {
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                    amount: order.amount,
                    currency: order.currency,
                    order_id: order.id,
                    name: "WhatTheCV",
                    description: "Token Purchase",
                    image: "https://pbs.twimg.com/profile_images/1932405175387598849/nF4oOesm_400x400.jpg",
                    handler: async function (response: any) {
                        console.log('Razorpay handler called', response)
                        try {
                            console.log('Calling verifyPayment with:', {
                                payment_id: response.razorpay_payment_id,
                                order_id: response.razorpay_order_id,
                                signature: response.razorpay_signature
                            })
                            await verifyPayment(
                                response.razorpay_payment_id,
                                response.razorpay_order_id,
                                response.razorpay_signature
                            )
                            toast.success('Tokens credited successfully!')
                            setBuyModalOpen(false)
                            // Refresh balance
                            await refreshBalance()
                        } catch (e) {
                            console.error('Payment verification error:', e)
                        }
                    },
                    prefill: {
                        email: localStorage.getItem('user_email') || '',
                    },
                    theme: { color: '#fbbf24' }
                }
                console.log('Opening Razorpay modal')
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