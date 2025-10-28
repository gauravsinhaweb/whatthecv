import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getStorageInfo, purchaseStorageSpace, getStorageActionInfo } from '../utils/api';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryClient';

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
}

export const useStorage = (): UseStorageReturn => {
    const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
    const [actionInfo, setActionInfo] = useState<StorageActionInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPurchasing, setIsPurchasing] = useState(false);

    const queryClient = useQueryClient();

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


        try {
            setIsPurchasing(true);
            const result = await purchaseStorageSpace();

            // Update local state
            await refreshStorageInfo();

            // Update React Query cache to ensure Dashboard shows updated data
            if (result && typeof result === 'object') {
                // The backend returns the updated storage info directly
                queryClient.setQueryData(queryKeys.storage.info(), result);
                // Also invalidate the query to ensure fresh data
                queryClient.invalidateQueries({ queryKey: queryKeys.storage.info() });
            }

            toast.success('Storage space purchased successfully!');
        } catch (error) {
            console.error('Failed to purchase storage space:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to purchase storage space');
        } finally {
            setIsPurchasing(false);
        }
    }, [actionInfo, refreshStorageInfo, queryClient]);

    useEffect(() => {
        refreshStorageInfo();
    }, [refreshStorageInfo]);


    return {
        storageInfo,
        actionInfo,
        isLoading,
        isPurchasing,
        refreshStorageInfo,
        purchaseSpace
    };
}; 