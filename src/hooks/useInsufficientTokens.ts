import { useState, useCallback } from 'react';
import { useTokenActions } from './useTokenActions';

interface UseInsufficientTokensReturn {
    isBuyModalOpen: boolean;
    openBuyModal: (actionId: string, onSuccess?: () => void) => void;
    closeBuyModal: () => void;
    checkAndHandleInsufficientTokens: (actionId: string, onSuccess?: () => void, currentBalance?: number) => boolean;
    currentActionId: string | null;
    onSuccessCallback: (() => void) | null;
}

export const useInsufficientTokens = (): UseInsufficientTokensReturn => {
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
    const [currentActionId, setCurrentActionId] = useState<string | null>(null);
    const [onSuccessCallback, setOnSuccessCallback] = useState<(() => void) | null>(null);

    const { hasSufficientTokens } = useTokenActions();

    const openBuyModal = useCallback((actionId: string, onSuccess?: () => void) => {
        setCurrentActionId(actionId);
        setOnSuccessCallback(() => onSuccess || null);
        setIsBuyModalOpen(true);
    }, []);

    const closeBuyModal = useCallback(() => {
        setIsBuyModalOpen(false);
        setCurrentActionId(null);
        setOnSuccessCallback(null);
    }, []);

    const checkAndHandleInsufficientTokens = useCallback((actionId: string, onSuccess?: () => void, currentBalance?: number): boolean => {
        // Use provided balance if available, otherwise default to 0
        const balanceToCheck = currentBalance !== undefined ? currentBalance : 0;

        if (!hasSufficientTokens(actionId, balanceToCheck)) {
            openBuyModal(actionId, onSuccess);
            return false; // Insufficient tokens
        }
        return true; // Sufficient tokens
    }, [hasSufficientTokens, openBuyModal]);

    return {
        isBuyModalOpen,
        openBuyModal,
        closeBuyModal,
        checkAndHandleInsufficientTokens,
        currentActionId,
        onSuccessCallback
    };
}; 