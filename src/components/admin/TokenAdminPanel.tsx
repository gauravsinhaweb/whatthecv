import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { useTokenActions } from '../../hooks/useTokenActions';
import { tokenService } from '../../services/tokenService';
import { toast } from 'react-hot-toast';
import { Edit, Save, X, Plus, Trash2, Lock, Unlock, Settings, AlertTriangle, Coins } from 'lucide-react';
import CreateTokenActionModal from './CreateTokenActionModal';
import { TokenAction } from '../../types/token';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    actionName: string;
    actionId: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    actionName,
    actionId
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-red-100 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">
                            Delete Token Action
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                            This action cannot be undone
                        </p>
                    </div>
                </div>

                <div className="mb-6">
                    <p className="text-slate-700 mb-2">
                        Are you sure you want to delete the token action:
                    </p>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                        <p className="font-semibold text-slate-900">{actionName}</p>
                        <p className="text-sm text-slate-500 font-mono">ID: {actionId}</p>
                    </div>
                </div>

                <div className="flex space-x-3">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Action
                    </Button>
                </div>
            </div>
        </div>
    );
};

const TokenAdminPanel: React.FC = () => {
    const { actions, isLoading, refreshActions } = useTokenActions();
    const [editingAction, setEditingAction] = useState<string | null>(null);
    const [newAmount, setNewAmount] = useState<number>(0);
    const [updating, setUpdating] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [locking, setLocking] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [actionToDelete, setActionToDelete] = useState<{ id: string; name: string } | null>(null);

    const handleEdit = (actionId: string, currentAmount: number) => {
        setEditingAction(actionId);
        setNewAmount(currentAmount);
    };

    const handleSave = async (actionId: string) => {
        if (newAmount <= 0) {
            toast.error('Token amount must be greater than 0');
            return;
        }

        setUpdating(actionId);
        try {
            await tokenService.updateTokenAmount(actionId, newAmount);
            await refreshActions();
            setEditingAction(null);
            toast.success(`Token amount updated for ${actionId}`);
        } catch (error) {
            console.error('Error updating token amount:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to update token amount');
        } finally {
            setUpdating(null);
        }
    };

    const handleCancel = () => {
        setEditingAction(null);
        setNewAmount(0);
    };

    const handleDeleteClick = (actionId: string, actionName: string) => {
        const action = actions[actionId];
        if (!action) return;

        if (action.locked) {
            toast.error(`Cannot delete locked action "${actionId}". Please unlock it first.`);
            return;
        }

        setActionToDelete({ id: actionId, name: actionName });
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!actionToDelete) return;

        setDeleting(actionToDelete.id);
        setShowDeleteModal(false);

        try {
            await tokenService.deleteTokenAction(actionToDelete.id);
            await refreshActions();
            toast.success(`Token action "${actionToDelete.name}" deleted successfully`);
        } catch (error) {
            console.error('Error deleting token action:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to delete token action');
        } finally {
            setDeleting(null);
            setActionToDelete(null);
        }
    };

    const handleToggleLock = async (actionId: string) => {
        setLocking(actionId);
        try {
            const result = await tokenService.toggleActionLock(actionId);
            await refreshActions();
            const status = result.locked ? 'locked' : 'unlocked';
            toast.success(`Action "${actionId}" ${status} successfully`);
        } catch (error) {
            console.error('Error toggling action lock:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to toggle action lock');
        } finally {
            setLocking(null);
        }
    };

    const handleCreateSuccess = () => {
        refreshActions();
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
                <div className="animate-pulse">
                    {/* Header Skeleton */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                            <div>
                                <div className="h-6 bg-slate-200 rounded w-48 mb-2"></div>
                                <div className="h-4 bg-slate-200 rounded w-64"></div>
                            </div>
                        </div>
                        <div className="w-32 h-10 bg-slate-200 rounded-lg"></div>
                    </div>

                    {/* Actions Skeleton */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="h-6 bg-slate-200 rounded w-32"></div>
                        </div>

                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-6 rounded-xl border border-slate-200 bg-slate-50">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 pr-8">
                                        <div className="h-6 bg-slate-200 rounded w-48 mb-3"></div>
                                        <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                                        <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                                        <div className="flex space-x-4">
                                            <div className="h-6 bg-slate-200 rounded w-20"></div>
                                            <div className="h-6 bg-slate-200 rounded w-32"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-20 h-12 bg-slate-200 rounded-lg"></div>
                                        <div className="flex space-x-2">
                                            <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                                            <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Settings className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">
                            Token Action Management
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                            Manage and configure token-based services
                        </p>
                    </div>
                </div>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Action
                </Button>
            </div>

            {/* Actions List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-slate-900">Token Actions</h4>
                </div>

                {Object.entries(actions).map(([actionId, action]) => (
                    <div
                        key={actionId}
                        className={`relative p-6 rounded-xl border transition-all duration-200 ${action.locked
                            ? 'bg-gradient-to-r from-amber-50 to-amber-25 border-amber-200 shadow-sm'
                            : 'bg-gradient-to-r from-slate-50 to-white border-slate-200 hover:shadow-md'
                            }`}
                    >

                        <div className="flex items-start justify-between">
                            {/* Action Details */}
                            <div className="flex-1 pr-8">
                                <div className="flex items-center space-x-3 mb-3">
                                    <h5 className="text-lg font-semibold text-slate-900">{action.name}</h5>
                                </div>

                                <p className="text-slate-600 mb-4 leading-relaxed">{action.description}</p>

                                <div className="flex items-center space-x-4">
                                    <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                                        {action.category}
                                    </span>
                                    <span className="text-sm text-slate-500 font-mono">
                                        ID: {action.id}
                                    </span>
                                </div>
                            </div>

                            {/* Action Controls */}
                            <div className="flex items-start space-x-3">
                                {editingAction === actionId ? (
                                    <div className="flex items-center space-x-3">
                                        <div className="text-center">
                                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                                Token Amount
                                            </label>
                                            <input
                                                type="number"
                                                value={newAmount}
                                                onChange={(e) => {
                                                    const input = e.target as HTMLInputElement;
                                                    setNewAmount(Number(input.value));
                                                }}
                                                className="w-24 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="1"
                                            />
                                        </div>
                                        <Button
                                            onClick={() => handleSave(actionId)}
                                            isLoading={updating === actionId}
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            <Save className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            onClick={handleCancel}
                                            size="sm"
                                            variant="outline"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex gap-2 items-center rounded-lg p-3">
                                            <div className="text-lg font-bold text-amber-600">{action.amount}</div>
                                            <Coins className="h-6 w-6 text-amber-600" />
                                        </div>
                                        {/* Action Buttons */}
                                        <div className="flex mt-2 items-start space-x-2">
                                            {!action.locked && (
                                                <Button
                                                    onClick={() => handleEdit(actionId, action.amount)}
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    title="Edit token amount"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            )}

                                            <Button
                                                onClick={() => handleToggleLock(actionId)}
                                                isLoading={locking === actionId}
                                                size="sm"
                                                variant="outline"
                                                className={action.locked
                                                    ? "text-amber-500 hover:text-amber-600 hover:bg-amber-50 border-amber-200"
                                                    : "text-gray-500 hover:text-gray-600 hover:bg-gray-50 border-gray-200"
                                                }
                                                title={action.locked ? "Unlock action" : "Lock action"}
                                            >
                                                {action.locked ? (
                                                    <Lock className="h-4 w-4" />
                                                ) : (
                                                    <Unlock className="h-4 w-4" />
                                                )}
                                            </Button>

                                            {!action.locked && (
                                                <Button
                                                    onClick={() => handleDeleteClick(actionId, action.name)}
                                                    isLoading={deleting === actionId}
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                                    title="Delete action"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <CreateTokenActionModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={handleCreateSuccess}
            />

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setActionToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
                actionName={actionToDelete?.name || ''}
                actionId={actionToDelete?.id || ''}
            />
        </div>
    );
};

export default TokenAdminPanel; 