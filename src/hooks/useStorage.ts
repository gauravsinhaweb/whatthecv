import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getStorageInfo, purchaseStorageSpace, getStorageActionInfo } from '../utils/api';
import { useTokens } from './useTokens';
import { useTokenActions } from './useTokenActions';

interface StorageInfo {
    free_limit: number;
    purchased_limit: number;
    total_limit: number;
    used_space: number;
    available_space: number;
    can_create_new: boolean;
}

interface StorageActionInfo {
    id: string;
    name: string;
    description: string;
    amount: number;
    category: string;
}

interface UseStorageReturn {
    storageInfo: StorageInfo | null;
    actionInfo: StorageActionInfo | null;
    isLoading: boolean;
    isPurchasing: boolean;
    refreshStorageInfo: () => Promise<void>;
    purchaseSpace: () => Promise<void>;
    hasSufficientTokens: boolean;
    requiredTokens: number;
}

export const useStorage = (): UseStorageReturn => {
    const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
    const [actionInfo, setActionInfo] = useState<StorageActionInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPurchasing, setIsPurchasing] = useState(false);

    const { tokenBalance, refreshBalance } = useTokens();
    const { getAmount, hasSufficientTokens: checkSufficientTokens } = useTokenActions();

    const refreshStorageInfo = useCallback(async () => {
        try {
            setIsLoading(true);
            const [storageData, actionData] = await Promise.all([
                getStorageInfo(),
                getStorageActionInfo()
            ]);
            setStorageInfo(storageData);
            setActionInfo(actionData);
        } catch (error) {
            console.error('Failed to fetch storage info:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const purchaseSpace = useCallback(async () => {
        if (!actionInfo) {
            toast.error('Storage action not available');
            return;
        }

        if (!checkSufficientTokens('resume_storage_space', tokenBalance)) {
            toast.error(`Insufficient tokens. You have ₹${tokenBalance}, but need ₹${actionInfo.amount} to purchase storage space.`);
            return;
        }

        try {
            setIsPurchasing(true);
            await purchaseStorageSpace();
            await Promise.all([
                refreshStorageInfo(),
                refreshBalance()
            ]);
            toast.success('Storage space purchased successfully!');
        } catch (error) {
            console.error('Failed to purchase storage space:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to purchase storage space');
        } finally {
            setIsPurchasing(false);
        }
    }, [actionInfo, tokenBalance, checkSufficientTokens, refreshStorageInfo, refreshBalance]);

    useEffect(() => {
        refreshStorageInfo();
    }, [refreshStorageInfo]);

    const requiredTokens = actionInfo?.amount || 0;
    const hasSufficientTokens = checkSufficientTokens('resume_storage_space', tokenBalance);

    return {
        storageInfo,
        actionInfo,
        isLoading,
        isPurchasing,
        refreshStorageInfo,
        purchaseSpace,
        hasSufficientTokens,
        requiredTokens
    };
}; 