import { apiService } from './apiService'

// Token API types
export interface TokenBalance {
    id: string
    user_id: string
    available_token: number
    updated_at?: string
}

export interface TokenTransaction {
    id: string
    user_id: string
    action_id: string
    token: number
    available_token?: number
    reservation_id?: string
    timestamp?: string
}

export interface TokenTransactionListResponse {
    items: TokenTransaction[]
    total: number
}

export interface TokenAction {
    id: string
    amount: number
    name: string
    description: string
    category: string
    locked: boolean
    created_at?: string
    updated_at?: string
}

export interface PaymentOrder {
    order: {
        id: string
        amount: number
        currency: string
        receipt: string
    }
}

export interface PaymentVerification {
    payment_id: string
    order_id: string
    signature: string
}

export interface TokenReservation {
    id: string
    user_id: string
    action_id: string
    token_amount: number
    status: string
    expires_at: string
    created_at: string
    confirmed_at?: string
    extra_metadata?: any
}

// Token Service class
class TokenService {
    // Token balance and transactions
    async getTokenBalance(): Promise<TokenBalance> {
        return apiService.get<TokenBalance>('/token/balance')
    }

    async getTokenTransactions(): Promise<TokenTransactionListResponse> {
        return apiService.get<TokenTransactionListResponse>('/token/transactions')
    }

    async getTokenActions(): Promise<Record<string, TokenAction>> {
        return apiService.get<Record<string, TokenAction>>('/token/actions')
    }

    // Token operations
    async spendTokens(actionId: string, amount: number): Promise<TokenBalance> {
        return apiService.post<TokenBalance>('/token/spend', null, {
            params: { action_id: actionId, token: amount }
        })
    }

    async reserveTokens(actionId: string, amount: number): Promise<TokenReservation> {
        return apiService.post<TokenReservation>('/token/reserve', null, {
            params: { action_id: actionId, token_amount: amount }
        })
    }

    async confirmTokenUsage(reservationId: string): Promise<TokenBalance> {
        return apiService.post<TokenBalance>('/token/confirm', null, {
            params: { reservation_id: reservationId }
        })
    }

    async releaseTokens(reservationId: string): Promise<{ success: boolean; message: string }> {
        return apiService.post<{ success: boolean; message: string }>('/token/release', null, {
            params: { reservation_id: reservationId }
        })
    }

    // Payment operations
    async createPaymentOrder(amount: number): Promise<PaymentOrder> {
        return apiService.post<PaymentOrder>('/token/create-payment-order', { amount })
    }

    async verifyPayment(verification: PaymentVerification): Promise<TokenBalance> {
        return apiService.post<TokenBalance>('/token/verify-payment', verification)
    }

    // Admin operations (for super users)
    async updateTokenAmount(actionId: string, amount: number): Promise<TokenAction> {
        return apiService.put<TokenAction>(`/token/actions/${actionId}/amount`, null, {
            params: { amount }
        })
    }

    async createTokenAction(
        actionId: string,
        amount: number,
        name: string,
        description: string,
        category: string,
        locked: boolean = true
    ): Promise<TokenAction> {
        return apiService.post<TokenAction>('/token/actions', null, {
            params: { action_id: actionId, amount, name, description, category, locked }
        })
    }

    async deleteTokenAction(actionId: string): Promise<{ success: boolean; message: string }> {
        return apiService.delete<{ success: boolean; message: string }>(`/token/actions/${actionId}`)
    }

    async toggleActionLock(actionId: string): Promise<TokenAction> {
        return apiService.post<TokenAction>(`/token/actions/${actionId}/toggle-lock`)
    }

    async getActionLockStatus(actionId: string): Promise<{ locked: boolean }> {
        return apiService.get<{ locked: boolean }>(`/token/actions/${actionId}/lock-status`)
    }
}

export const tokenService = new TokenService() 