import { toast } from 'react-hot-toast';
import { useTokenActions } from '../hooks/useTokenActions';
import { useTokens } from '../hooks/useTokens';

/**
 * Utility function to check if user has sufficient tokens for an action
 * @param actionId - The action ID to check
 * @param currentBalance - Current token balance
 * @param getAmount - Function to get required amount for action
 * @returns Object with hasSufficientTokens boolean and required amount
 */
export const checkTokenSufficiency = (
    actionId: string,
    currentBalance: number,
    getAmount: (actionId: string) => number
) => {
    const requiredAmount = getAmount(actionId);
    const hasSufficientTokens = currentBalance >= requiredAmount;
    const shortfall = Math.max(0, requiredAmount - currentBalance);

    return {
        hasSufficientTokens,
        requiredAmount,
        shortfall,
        currentBalance
    };
};

/**
 * Utility function to handle insufficient tokens with toast notification
 * @param actionId - The action ID
 * @param currentBalance - Current token balance
 * @param getAmount - Function to get required amount for action
 * @param actionName - Human readable action name (optional)
 * @returns Object with hasSufficientTokens boolean and required amount
 */
export const handleInsufficientTokens = (
    actionId: string,
    currentBalance: number,
    getAmount: (actionId: string) => number,
    actionName?: string
) => {
    const { hasSufficientTokens, requiredAmount, shortfall } = checkTokenSufficiency(actionId, currentBalance, getAmount);

    if (!hasSufficientTokens) {
        const actionDisplayName = actionName || actionId.replace(/_/g, ' ');
        toast.error(
            `Insufficient tokens for ${actionDisplayName}. You have ₹${currentBalance}, but need ₹${requiredAmount}.`,
            { duration: 5000 }
        );
    }

    return {
        hasSufficientTokens,
        requiredAmount,
        shortfall,
        currentBalance
    };
};

/**
 * Hook to get token sufficiency information
 * @param actionId - The action ID to check
 * @returns Object with token sufficiency information
 */
export const useTokenSufficiency = (actionId: string) => {
    const { tokenBalance } = useTokens();
    const { getAmount } = useTokenActions();

    return checkTokenSufficiency(actionId, tokenBalance, getAmount);
};

/**
 * Hook to handle insufficient tokens with automatic toast notification
 * @param actionId - The action ID to check
 * @param actionName - Human readable action name (optional)
 * @returns Object with token sufficiency information and handler
 */
export const useInsufficientTokenHandler = (actionId: string, actionName?: string) => {
    const { tokenBalance } = useTokens();
    const { getAmount } = useTokenActions();

    const checkSufficiency = () => {
        return handleInsufficientTokens(actionId, tokenBalance, getAmount, actionName);
    };

    return {
        ...checkTokenSufficiency(actionId, tokenBalance, getAmount),
        checkSufficiency
    };
}; 