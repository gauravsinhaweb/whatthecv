import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { useTokenActions } from '../../hooks/useTokenActions';
import { useTokens } from '../../hooks/useTokens';
import { toast } from 'react-hot-toast';
import { FileText, Download, Users, BarChart3 } from 'lucide-react';
import { TokenAction } from '../../types/token';

interface ActionConfig {
    id: TokenAction['id'];
    name: string;
    description: string;
    icon: React.FC<{ className?: string }>;
    service: () => Promise<any>;
}

const TokenActionExample: React.FC = () => {
    const { tokenBalance, refreshBalance } = useTokens();
    const { getAmount, hasSufficientTokens, executeAction } = useTokenActions();
    const [loading, setLoading] = useState<string | null>(null);

    const handleAction = async (actionId: string, serviceFunction: () => Promise<any>) => {
        if (!hasSufficientTokens(actionId, tokenBalance)) {
            const amount = getAmount(actionId);
            toast.error(`Insufficient tokens. You have ₹${tokenBalance}, but need ₹${amount} to continue.`);
            return;
        }

        setLoading(actionId);
        try {
            await executeAction(actionId, serviceFunction);
            await refreshBalance();
        } catch (error) {
            console.error(`Error executing ${actionId}:`, error);
            toast.error(error instanceof Error ? error.message : 'Failed to execute action');
        } finally {
            setLoading(null);
        }
    };

    const actions: ActionConfig[] = [
        {
            id: 'resume_enhancement',
            name: 'Resume Enhancement',
            description: 'Transform your resume into an ATS-optimized document',
            icon: FileText,
            service: async () => {
                // Example service implementation
                await new Promise(resolve => setTimeout(resolve, 2000));
                return { success: true };
            }
        },
        {
            id: 'template_download',
            name: 'Template Download',
            description: 'Download premium resume template',
            icon: Download,
            service: async () => {
                // Example service implementation
                await new Promise(resolve => setTimeout(resolve, 1000));
                return { success: true };
            }
        },
        {
            id: 'premium_consultation',
            name: 'Premium Consultation',
            description: 'One-on-one career consultation',
            icon: Users,
            service: async () => {
                // Example service implementation
                await new Promise(resolve => setTimeout(resolve, 1500));
                return { success: true };
            }
        }
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Available Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {actions.map((action) => {
                        const Icon = action.icon;
                        const amount = getAmount(action.id);
                        const isDisabled = !hasSufficientTokens(action.id, tokenBalance) || loading === action.id;

                        return (
                            <div
                                key={action.id}
                                className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-slate-300 transition-colors"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-2">
                                        <Icon className="h-5 w-5 text-blue-600" />
                                        <h4 className="font-medium text-slate-900">{action.name}</h4>
                                    </div>
                                    <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                                        ₹{amount}
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600 mb-4">{action.description}</p>
                                <Button
                                    onClick={() => handleAction(action.id, action.service)}
                                    disabled={isDisabled}
                                    isLoading={loading === action.id}
                                    className="w-full"
                                    size="sm"
                                >
                                    {loading === action.id ? 'Processing...' : 'Execute Action'}
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TokenActionExample; 