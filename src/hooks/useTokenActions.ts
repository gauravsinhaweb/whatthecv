import { useCallback, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { reserveTokens, confirmTokenUsage, releaseTokens, getTokenActions } from '../utils/api';
import { TokenAction } from '../types/token';

interface UseTokenActionsReturn {
    getAction: (actionId: string) => TokenAction | null;
    getAmount: (actionId: string) => number;
    executeAction: (actionId: string, serviceFunction: () => Promise<any>) => Promise<any>;
    hasSufficientTokens: (actionId: string, currentBalance: number) => boolean;
    actions: Record<string, TokenAction>;
    isLoading: boolean;
    refreshActions: () => Promise<void>;
}

export const useTokenActions = (): UseTokenActionsReturn => {
    const [actions, setActions] = useState<Record<string, TokenAction>>({});
    const [isLoading, setIsLoading] = useState(true);

    const refreshActions = useCallback(async () => {
        try {
            setIsLoading(true);
            const actionsData = await getTokenActions();
            setActions(actionsData);
        } catch (error) {
            console.error('Failed to fetch token actions:', error);
            toast.error('Failed to load token configurations');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshActions();
    }, [refreshActions]);

    const getAction = useCallback((actionId: string): TokenAction | null => {
        return actions[actionId] || null;
    }, [actions]);

    const getAmount = useCallback((actionId: string): number => {
        const action = getAction(actionId);
        return action?.amount || 0;
    }, [getAction]);

    const hasSufficientTokens = useCallback((actionId: string, currentBalance: number): boolean => {
        const requiredAmount = getAmount(actionId);
        return currentBalance >= requiredAmount;
    }, [getAmount]);

    const executeAction = useCallback(async (
        actionId: string,
        serviceFunction: () => Promise<any>
    ): Promise<any> => {
        const action = getAction(actionId);
        if (!action) {
            throw new Error(`Unknown action: ${actionId}`);
        }

        let reservationId: string | null = null;
        let retryCount = 0;
        const maxRetries = 2;

        try {
            // Phase 1: Reserve tokens
            console.log(`Reserving ${action.amount} tokens for action: ${actionId}`);
            const reservation = await reserveTokens(actionId, action.amount);
            reservationId = reservation.id;
            console.log(`Reservation created: ${reservationId}`);

            // Phase 2: Execute the service
            const result = await serviceFunction();

            // Phase 3: Confirm token usage (with retry for expired reservations)
            console.log(`Confirming token usage for reservation: ${reservationId}`);

            while (retryCount <= maxRetries) {
                try {
                    await confirmTokenUsage(reservationId);
                    console.log(`Token usage confirmed successfully on attempt ${retryCount + 1}`);
                    break; // Success, exit retry loop
                } catch (confirmError) {
                    retryCount++;

                    // Check if the error is due to expired/released reservation
                    const errorMessage = confirmError instanceof Error ? confirmError.message : String(confirmError);
                    const isExpiredError = errorMessage.includes('expired') ||
                        errorMessage.includes('Cannot confirm reservation in status: released') ||
                        errorMessage.includes('released');

                    if (isExpiredError && retryCount <= maxRetries) {
                        console.log(`Reservation expired (attempt ${retryCount}), creating new reservation for confirmation`);

                        // Release the old reservation first
                        try {
                            await releaseTokens(reservationId);
                        } catch (releaseError) {
                            console.warn('Failed to release old reservation:', releaseError);
                        }

                        // Create a new reservation for confirmation
                        const newReservation = await reserveTokens(actionId, action.amount);
                        reservationId = newReservation.id;
                        console.log(`New reservation created for confirmation: ${reservationId}`);

                        continue; // Try again with new reservation
                    } else {
                        // If it's not an expiration error or we've exceeded retries, re-throw
                        throw confirmError;
                    }
                }
            }

            return result;

        } catch (error) {
            console.error(`Error executing ${action.name}:`, error);

            // Release tokens if reservation was made but service failed
            if (reservationId) {
                try {
                    console.log(`Releasing tokens for reservation: ${reservationId}`);
                    await releaseTokens(reservationId);
                    toast.success('Tokens have been refunded due to service failure.');
                } catch (releaseError) {
                    console.error('Failed to release tokens:', releaseError);
                    toast.error('Failed to release tokens. Please contact support.');
                }
            }

            // Re-throw the error for the calling component to handle
            throw error instanceof Error ? error : new Error('Service execution failed');
        }
    }, [getAction]);

    return {
        getAction,
        getAmount,
        executeAction,
        hasSufficientTokens,
        actions,
        isLoading,
        refreshActions
    };
}; 