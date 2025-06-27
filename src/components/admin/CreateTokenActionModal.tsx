import React, { useState } from 'react';
import Button from '../ui/Button';
import { tokenService } from '../../services/tokenService';
import { toast } from 'react-hot-toast';
import { Plus, X, Lock } from 'lucide-react';
import { TokenAction, TokenActionCategory, TOKEN_ACTION_CATEGORIES } from '../../types/token';

interface CreateTokenActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface TokenActionFormData {
    action_id: string;
    amount: number;
    name: string;
    description: string;
    category: TokenActionCategory;
    locked: boolean;
}

const initialFormData: TokenActionFormData = {
    action_id: '',
    amount: 1,
    name: '',
    description: '',
    category: 'custom',
    locked: true
};

const CreateTokenActionModal: React.FC<CreateTokenActionModalProps> = ({
    isOpen,
    onClose,
    onSuccess
}) => {
    const [formData, setFormData] = useState<TokenActionFormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = TOKEN_ACTION_CATEGORIES.map(value => ({
        value,
        label: value.charAt(0).toUpperCase() + value.slice(1)
    }));

    const handleInputChange = (field: keyof TokenActionFormData, value: string | number | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validateForm = (): boolean => {
        if (!formData.action_id.trim() || !formData.name.trim() || !formData.description.trim()) {
            toast.error('Please fill in all required fields');
            return false;
        }

        if (formData.amount <= 0) {
            toast.error('Token amount must be greater than 0');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await tokenService.createTokenAction(
                formData.action_id,
                formData.amount,
                formData.name,
                formData.description,
                formData.category,
                formData.locked
            );

            toast.success('Token action created successfully');
            setFormData(initialFormData);
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error creating token action:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to create token action');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Plus className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">
                                Create New Token Action
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">
                                Add a new token-based service
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Action ID *
                        </label>
                        <input
                            type="text"
                            value={formData.action_id}
                            onChange={(e) => handleInputChange('action_id', e.target.value)}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="e.g., custom_analysis"
                            required
                        />
                        <p className="text-xs text-slate-500 mt-2">
                            Unique identifier for the action (lowercase, underscores only)
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Name *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="e.g., Custom Analysis"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                            placeholder="Describe what this action does..."
                            rows={3}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Category
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => handleInputChange('category', e.target.value as TokenActionCategory)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                                {categories.map(category => (
                                    <option key={category.value} value={category.value}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Token Amount *
                            </label>
                            <input
                                type="number"
                                value={formData.amount}
                                onChange={(e) => handleInputChange('amount', parseInt(e.target.value) || 1)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                min="1"
                                required
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                Amount in rupees (₹)
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <input
                            type="checkbox"
                            id="locked"
                            checked={formData.locked}
                            onChange={(e) => handleInputChange('locked', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                        />
                        <label htmlFor="locked" className="flex items-center space-x-2 text-sm text-slate-700 cursor-pointer">
                            <Lock className="h-4 w-4" />
                            <span>Lock this action (prevents modifications)</span>
                        </label>
                    </div>

                    <div className="flex space-x-4 pt-6 border-t border-slate-200">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="outline"
                            className="flex-1 py-3"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Action
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTokenActionModal; 