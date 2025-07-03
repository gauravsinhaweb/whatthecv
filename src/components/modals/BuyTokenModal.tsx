import { Coins, X, AlertCircle, CheckCircle, Info, Sparkles, TrendingUp, Shield, Zap, Star } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useBuyTokens } from '../../hooks/queries/useTokenQueries';
import { useTokenActions } from '../../hooks/useTokenActions';
import { useTokens } from '../../hooks/useTokens';
import Button from '../ui/Button';

interface BuyTokenModalProps {
    isOpen: boolean;
    onClose: () => void;
    actionId?: string;
    onSuccess?: () => void;
    title?: string;
    description?: string;
}

const BuyTokenModal: React.FC<BuyTokenModalProps> = ({
    isOpen,
    onClose,
    actionId,
    onSuccess,
    title = 'Insufficient Tokens',
    description = 'You need more tokens to perform this action.'
}) => {
    const [buyAmount, setBuyAmount] = useState(100);
    const [selectedQuickAmount, setSelectedQuickAmount] = useState<number | null>(100);
    const [isHoveringBuyButton, setIsHoveringBuyButton] = useState(false);
    const { tokenBalance, refreshBalance } = useTokens();
    const { getAmount, getAction } = useTokenActions();
    const buyTokensMutation = useBuyTokens();

    const requiredAmount = actionId ? getAmount(actionId) : 0;
    const action = actionId ? getAction(actionId) : null;
    const shortfall = Math.max(0, requiredAmount - tokenBalance);

    useEffect(() => {
        if (isOpen && shortfall > 0) {
            const suggestedAmount = Math.max(100, Math.ceil(shortfall / 50) * 50);
            setBuyAmount(suggestedAmount);
            setSelectedQuickAmount(suggestedAmount);
        }
    }, [isOpen, shortfall]);

    const handleBuyTokens = async () => {
        if (buyAmount < 10) {
            toast.error('Please enter a valid amount (minimum 10 tokens)');
            return;
        }

        try {
            await buyTokensMutation.mutateAsync(buyAmount, onClose);
        } catch (error) {
            console.error('Payment failed:', error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !buyTokensMutation.isPending && buyAmount >= 10) {
            handleBuyTokens();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    const handleQuickAmountSelect = (amount: number) => {
        setBuyAmount(amount);
        setSelectedQuickAmount(amount);
    };

    const handleCustomAmountChange = (value: number) => {
        setBuyAmount(value);
        setSelectedQuickAmount(null);
    };

    const getRecommendedAmount = () => {
        if (shortfall > 0) {
            return Math.max(100, Math.ceil(shortfall / 50) * 50);
        }
        return 100;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-8 py-6 overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full -translate-x-8 -translate-y-8 opacity-50"></div>
                    </div>

                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl ring-1 ring-white/30 shadow-lg hover:bg-white/30 transition-all duration-300">
                                <Coins className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{title}</h3>
                                <p className="text-blue-100 text-sm mt-1">{description}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 group"
                            disabled={buyTokensMutation.isPending}
                        >
                            <X className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 modal-scrollbar max-h-[70vh] overflow-y-auto">
                    <div className="space-y-6">
                        {/* Current Balance & Required Amount */}
                        {actionId && action && (
                            <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="text-left">
                                    <p className="text-sm text-slate-700 leading-relaxed">
                                        Add <span className="font-bold text-amber-600">{shortfall} tokens</span> to continue with <span className="font-semibold text-blue-700">{action.name}</span>.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Purchase Amount */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-4">
                                Purchase Amount (tokens)
                            </label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-lg">₹</span>
                                <input
                                    type="number"
                                    value={buyAmount}
                                    onChange={(e) => handleCustomAmountChange(Number((e.target as HTMLInputElement).value))}
                                    onKeyDown={handleKeyDown}
                                    className="w-full pl-10 pr-4 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 text-slate-900 placeholder-slate-400 text-lg font-medium"
                                    placeholder="Enter amount"
                                    min="10"
                                    step="10"
                                    autoFocus
                                    disabled={buyTokensMutation.isPending}
                                />
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500/5 to-orange-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                            <p className="text-sm text-slate-500 mt-3 flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                You will receive {buyAmount} tokens
                            </p>
                        </div>

                        {/* Quick Amount Buttons */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-4">
                                Quick Select
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {[100, 200, 500].map((amount) => {
                                    const isRecommended = amount === getRecommendedAmount();
                                    return (
                                        <button
                                            key={amount}
                                            onClick={() => handleQuickAmountSelect(amount)}
                                            disabled={buyTokensMutation.isPending}
                                            className={`relative p-4 rounded-2xl border-2 transition-all duration-300 font-medium text-sm group ${selectedQuickAmount === amount
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg shadow-blue-500/25'
                                                : 'border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md'
                                                }`}
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-1">
                                                {amount}
                                                <Coins className="w-3 h-3 text-amber-500" />
                                            </span>
                                            {selectedQuickAmount === amount && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-orange-500/10"></div>
                                            )}
                                            {isRecommended && (
                                                <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full z-20 shadow-lg border border-amber-400">
                                                    Best
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-4 pt-4">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 rounded-2xl border-2 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300"
                                size="lg"
                                disabled={buyTokensMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleBuyTokens}
                                onMouseEnter={() => setIsHoveringBuyButton(true)}
                                onMouseLeave={() => setIsHoveringBuyButton(false)}
                                disabled={buyTokensMutation.isPending || buyAmount < 10}
                                isLoading={buyTokensMutation.isPending}
                                className={`flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] glow-on-hover ${isHoveringBuyButton ? 'shadow-blue-500/25' : ''
                                    }`}
                                size="lg"
                            >
                                <Coins className="h-5 w-5 mr-2" />
                                {buyTokensMutation.isPending ? 'Processing...' : 'Buy Tokens'}
                            </Button>
                        </div>

                        {/* Security Note */}
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                                <Shield className="w-3 h-3" />
                                <span>Secure payment powered by Razorpay</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyTokenModal; 