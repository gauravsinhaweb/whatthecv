import { useState, useCallback } from 'react';
import { useTokenActions } from './useTokenActions';
import { useTokens } from './useTokens';

interface UseInsufficientTokensReturn {
    isBuyModalOpen: boolean;
    openBuyModal: (actionId: string, onSuccess?: () => void) => void;
    closeBuyModal: () => void;
    checkAndHandleInsufficientTokens: (actionId: string, onSuccess?: () => void) => boolean;
    currentActionId: string | null;
    onSuccessCallback: (() => void) | null;
}

export const useInsufficientTokens = (): UseInsufficientTokensReturn => {
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
    const [currentActionId, setCurrentActionId] = useState<string | null>(null);
    const [onSuccessCallback, setOnSuccessCallback] = useState<(() => void) | null>(null);

    const { tokenBalance } = useTokens();
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

    const checkAndHandleInsufficientTokens = useCallback((actionId: string, onSuccess?: () => void): boolean => {
        if (!hasSufficientTokens(actionId, tokenBalance)) {
            openBuyModal(actionId, onSuccess);
            return false; // Insufficient tokens
        }
        return true; // Sufficient tokens
    }, [hasSufficientTokens, tokenBalance, openBuyModal]);

    return {
        isBuyModalOpen,
        openBuyModal,
        closeBuyModal,
        checkAndHandleInsufficientTokens,
        currentActionId,
        onSuccessCallback
    };
}; 