import { Save, X, AlertCircle, CheckCircle, Info } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import BuyTokenModal from './BuyTokenModal';
import { purchaseStorageSpace } from '../../utils/api';
import { toast } from 'react-hot-toast';

interface Resume {
    id: string;
    title: string;
    created_at: string;
    updated_at: string;
}

interface SaveResumeModalProps {
    isOpen: boolean;
    onClose: () => void;
    saveMode: 'new' | 'replace';
    onSaveModeChange: (mode: 'new' | 'replace') => void;
    resumeTitle: string;
    setResumeTitle: (title: string) => void;
    isSavingDraft: boolean;
    onSaveDraft: () => Promise<void>;
    onReplaceResume: () => void;
    userResumes: Resume[];
    fetchUserResumes: () => void;
    isLoadingResumes: boolean;
    selectedResumeId: string;
    setSelectedResumeId: (id: string) => void;
    tokenAmount?: number;
    hasExistingResume?: boolean;
    canCreateNew?: boolean;
    refetchStorageInfo?: () => void;
    onInsufficientTokens?: (actionId: string, onSuccess?: () => void) => void;
}

const SaveResumeModal: React.FC<SaveResumeModalProps> = ({
    isOpen,
    onClose,
    saveMode,
    fetchUserResumes,
    onSaveModeChange,
    resumeTitle,
    setResumeTitle,
    isSavingDraft,
    onSaveDraft,
    onReplaceResume,
    userResumes,
    isLoadingResumes,
    selectedResumeId,
    setSelectedResumeId,
    tokenAmount,
    hasExistingResume = false,
    canCreateNew = true,
    refetchStorageInfo,
    onInsufficientTokens
}) => {
    const [titleError, setTitleError] = useState<string>('');
    const [isDuplicate, setIsDuplicate] = useState(false);
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
    const [pendingSaveAfterPurchase, setPendingSaveAfterPurchase] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchUserResumes();
            // Refetch storage info to get latest token amounts
            if (refetchStorageInfo) {
                refetchStorageInfo();
            }
        }
    }, [isOpen])

    useEffect(() => {
        if (!resumeTitle.trim()) {
            setTitleError('');
            setIsDuplicate(false);
            return;
        }

        if (resumeTitle.trim().length > 100) {
            setTitleError('Title must be less than 100 characters');
            setIsDuplicate(false);
            return;
        }

        // Check for duplicate titles only for new resumes (not for existing resume updates)
        if (!hasExistingResume) {
            const duplicate = userResumes.some(resume =>
                resume.title.toLowerCase() === resumeTitle.trim().toLowerCase()
            );
            setIsDuplicate(duplicate);
            setTitleError(duplicate ? 'A resume with this title already exists' : '');
        } else {
            setIsDuplicate(false);
            setTitleError('');
        }
    }, [resumeTitle, userResumes, hasExistingResume]);

    // Reset errors when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setTitleError('');
            setIsDuplicate(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (saveMode === 'new') {
            // For new resumes, title is required
            if (!hasExistingResume && !resumeTitle.trim()) {
                setTitleError('Please enter a resume title');
                return;
            }
            if (titleError || isDuplicate) {
                return;
            }

            try {
                // If storage is full, purchase storage before saving
                if (!canCreateNew) {
                    try {
                        await purchaseStorageSpace();
                        if (refetchStorageInfo) await refetchStorageInfo();
                        toast.success('Storage space purchased successfully!');
                    } catch (purchaseError) {
                        toast.error('Failed to purchase storage space. Please try again.');
                        return;
                    }
                }
                // Now proceed to save
                await onSaveDraft();
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to save draft';

                if (errorMessage.includes('Failed to reserve tokens') || errorMessage.includes('Insufficient tokens') || errorMessage === 'Insufficient tokens') {
                    // Handle insufficient tokens by showing BuyTokenModal
                    setPendingSaveAfterPurchase(true);
                    setIsBuyModalOpen(true);
                } else {
                    // Re-throw other errors to be handled by Navigation component
                    throw error;
                }
            }
        } else {
            if (!selectedResumeId) {
                return;
            }
            onReplaceResume();
        }
    };

    const handleInsufficientTokens = (actionId: string, onSuccess?: () => void) => {
        setPendingSaveAfterPurchase(true);
        setIsBuyModalOpen(true);
    };

    const handleTokenPurchaseSuccess = () => {
        setIsBuyModalOpen(false);
        setPendingSaveAfterPurchase(false);
        // Retry the save operation
        setTimeout(() => {
            handleSave();
        }, 500);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isSavingDraft && !titleError && !isDuplicate) {
            handleSave();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    const getTitleValidationStatus = () => {
        if (titleError) return 'error';
        if (isDuplicate) return 'error';
        if (resumeTitle.trim() && !titleError && !isDuplicate) return 'success';
        return 'neutral';
    };

    const getValidationIcon = () => {
        const status = getTitleValidationStatus();
        switch (status) {
            case 'error':
                return <AlertCircle className="w-4 h-4 text-red-500" />;
            case 'success':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            default:
                return <Info className="w-4 h-4 text-slate-400" />;
        }
    };

    return (
        <>
            {/* Buy Token Modal */}
            <BuyTokenModal
                isOpen={isBuyModalOpen}
                onClose={() => setIsBuyModalOpen(false)}
                actionId="resume_storage_space"
                onSuccess={handleTokenPurchaseSuccess}
                title="Insufficient Tokens for Resume Storage"
                description="You need more tokens to save your resume. Purchase tokens to continue."
            />

            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Save className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Save Resume</h3>
                                    <p className="text-blue-100 text-sm">
                                        {hasExistingResume
                                            ? 'Update your existing resume'
                                            : saveMode === 'new'
                                                ? 'Create a new resume version'
                                                : 'Replace an existing resume'
                                        }
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                disabled={isSavingDraft}
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="space-y-6">
                            {(saveMode === 'new' || (saveMode === 'replace' && selectedResumeId)) && (
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                                        {hasExistingResume ? 'Update Title (Optional)' : 'Resume Title'}
                                        {!hasExistingResume && <span className="text-red-500 ml-1">*</span>}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={resumeTitle}
                                            onChange={(e) => setResumeTitle((e.target as HTMLInputElement).value)}
                                            onKeyDown={handleKeyDown}
                                            className={`w-full px-4 py-3 pr-10 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-slate-900 placeholder-slate-400 ${titleError || isDuplicate
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                                : resumeTitle.trim() && !titleError && !isDuplicate
                                                    ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                                                    : 'border-slate-200'
                                                }`}
                                            placeholder={hasExistingResume ? "Leave empty to keep current title" : "e.g., Google Software Engineer v1"}
                                            autoFocus={!hasExistingResume}
                                            disabled={isSavingDraft}
                                            maxLength={100}
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            {getValidationIcon()}
                                        </div>
                                    </div>

                                    {/* Validation messages */}
                                    {titleError && (
                                        <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {titleError}
                                        </p>
                                    )}

                                    {isDuplicate && (
                                        <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            A resume with this title already exists
                                        </p>
                                    )}

                                    {resumeTitle.trim() && !titleError && !isDuplicate && (
                                        <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" />
                                            Title looks good!
                                        </p>
                                    )}

                                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                        <Info className="w-3 h-3" />
                                        Use a descriptive name like company name or target position
                                    </p>
                                    <div className="mt-3 text-xs text-slate-500">
                                        <span className="text-red-500">*</span> Required field
                                    </div>
                                </div>
                            )}

                            {saveMode === 'replace' && (
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                                        Select item to replace
                                    </label>
                                    {isLoadingResumes ? (
                                        <div className="flex items-center justify-center py-4">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                            <span className="ml-2 text-sm text-slate-500">Loading resumes...</span>
                                        </div>
                                    ) : userResumes.length === 0 ? (
                                        <div className="text-center py-4 text-slate-500">
                                            <p className="text-sm">No resumes found</p>
                                            <p className="text-xs mt-1">Create a new resume first</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                            {userResumes.map((resume) => (
                                                <button
                                                    key={resume.id}
                                                    onClick={() => setSelectedResumeId(resume.id)}
                                                    disabled={isSavingDraft}
                                                    className={`w-full p-3 rounded-lg border-2 transition-all text-left ${selectedResumeId === resume.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-slate-200 hover:border-slate-300'
                                                        } ${isSavingDraft ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium text-slate-900">{resume.title}</p>
                                                            <p className="text-xs text-slate-500">
                                                                Updated {new Date(resume.updated_at || resume.created_at).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        {selectedResumeId === resume.id && (
                                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div>
                                {userResumes.length > 0 && !hasExistingResume && (
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            id="replaceExisting"
                                            checked={saveMode === 'replace'}
                                            onChange={(e) => onSaveModeChange((e.target as HTMLInputElement).checked ? 'replace' : 'new')}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                                            disabled={isSavingDraft}
                                        />
                                        <label htmlFor="replaceExisting" className="text-xs font-medium text-slate-700">
                                            {!canCreateNew
                                                ? 'Replace an existing resume (storage limit reached)'
                                                : 'I want to use an existing space'
                                            }
                                        </label>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-center gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        onClose();
                                        setResumeTitle('');
                                        setSelectedResumeId('');
                                        onSaveModeChange('new');
                                    }}
                                    className="flex-1"
                                    size="lg"
                                    disabled={isSavingDraft}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => handleSave()}
                                    disabled={isSavingDraft ||
                                        (saveMode === 'new' && !hasExistingResume && (!resumeTitle.trim() || !!titleError || isDuplicate)) ||
                                        (saveMode === 'replace' && !selectedResumeId)
                                    }
                                    isLoading={isSavingDraft}
                                    tokenAmount={saveMode === 'new' ? tokenAmount : undefined}
                                    size="lg"
                                >
                                    <Save className="h-5 w-5 mr-2" />
                                    {isSavingDraft
                                        ? 'Saving...'
                                        : saveMode === 'new'
                                            ? (hasExistingResume ? 'Update' : 'Save')
                                            : 'Replace'
                                    }
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SaveResumeModal; 