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

        try {
            // Phase 1: Reserve tokens
            const reservation = await reserveTokens(actionId, action.amount);
            reservationId = reservation.id;

            // Phase 2: Execute the service
            const result = await serviceFunction();

            // Phase 3: Confirm token usage (skip for resume_storage_space as backend handles it)
            if (actionId !== 'resume_storage_space') {
                await confirmTokenUsage(reservationId);
            }
            return result;

        } catch (error) {
            console.error(`Error executing ${action.name}:`, error);

            // Release tokens if reservation was made but service failed
            if (reservationId) {
                try {
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