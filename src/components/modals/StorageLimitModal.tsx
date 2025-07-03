import React from 'react';
import { X, HardDrive, Coins, AlertTriangle } from 'lucide-react';
import { useStorage } from '../../hooks/useStorage';
import Button from '../ui/Button';

interface StorageLimitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPurchaseSuccess?: () => void;
}

const StorageLimitModal: React.FC<StorageLimitModalProps> = ({
    isOpen,
    onClose,
    onPurchaseSuccess
}) => {
    const {
        storageInfo,
        actionInfo,
        isPurchasing,
        purchaseSpace,
        hasSufficientTokens,
        requiredTokens
    } = useStorage();

    if (!isOpen) return null;

    const handlePurchase = async () => {
        await purchaseSpace();
        onPurchaseSuccess?.();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Storage Limit Reached
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-slate-600 mb-4">
                            You've reached your storage limit and cannot create more resume versions.
                        </p>

                        {storageInfo && (
                            <div className="bg-slate-50 rounded-lg p-4 mb-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <HardDrive className="w-4 h-4 text-slate-600" />
                                    <span className="font-medium text-slate-700">Current Usage</span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Total Space:</span>
                                        <span className="font-medium">{storageInfo.total_limit}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Used Space:</span>
                                        <span className="font-medium">{storageInfo.used_space}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Available Space:</span>
                                        <span className="font-medium text-red-600">0</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {actionInfo && (
                        <div className="bg-amber-50 rounded-lg p-4 mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Coins className="w-4 h-4 text-amber-600" />
                                <span className="font-medium text-amber-700">Purchase Additional Space</span>
                            </div>
                            <p className="text-sm text-amber-600 mb-3">
                                {actionInfo.description}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-amber-600">Cost:</span>
                                <span className="font-semibold text-amber-700">{actionInfo.amount} tokens</span>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePurchase}
                            disabled={isPurchasing || !hasSufficientTokens}
                            isLoading={isPurchasing}
                            tokenAmount={actionInfo?.amount}
                            className="flex-1"
                        >
                            {isPurchasing ? 'Purchasing...' : 'Purchase Space'}
                        </Button>
                    </div>

                    {!hasSufficientTokens && actionInfo && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-700">
                                Insufficient tokens. You need {requiredTokens} tokens to purchase storage space.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StorageLimitModal; 