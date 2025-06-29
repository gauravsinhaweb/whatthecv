import { Save, X, AlertCircle, CheckCircle, Info } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';

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
    onSaveDraft: () => void;
    onReplaceResume: () => void;
    userResumes: Resume[];
    isLoadingResumes: boolean;
    selectedResumeId: string;
    setSelectedResumeId: (id: string) => void;
    actionInfo?: { amount: number };
    storageInfo?: { can_create_new: boolean };
}

const SaveResumeModal: React.FC<SaveResumeModalProps> = ({
    isOpen,
    onClose,
    saveMode,
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
    actionInfo,
    storageInfo
}) => {
    const [titleError, setTitleError] = useState<string>('');
    const [isDuplicate, setIsDuplicate] = useState(false);

    // Validate title on change
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

        // Check for duplicate titles (case-insensitive)
        const duplicate = userResumes.some(resume =>
            resume.title.toLowerCase() === resumeTitle.trim().toLowerCase()
        );
        setIsDuplicate(duplicate);
        setTitleError(duplicate ? 'A resume with this title already exists' : '');
    }, [resumeTitle, userResumes]);

    // Reset errors when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setTitleError('');
            setIsDuplicate(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (saveMode === 'new') {
            if (!resumeTitle.trim()) {
                setTitleError('Please enter a resume title');
                return;
            }
            if (titleError || isDuplicate) {
                return;
            }
            onSaveDraft();
        } else {
            if (!selectedResumeId) {
                return;
            }
            onReplaceResume();
        }
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
                                    {saveMode === 'new' ? 'Create a new resume version' : 'Replace an existing resume'}
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
                                    {saveMode === 'new' ? 'Resume Title' : 'New Title (Optional)'}
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
                                        placeholder={saveMode === 'new' ? "e.g., Google Software Engineer v1" : "Leave empty to keep current title"}
                                        autoFocus={saveMode === 'new'}
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
                            {userResumes.length > 0 && (
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
                                        I want to use an existing space
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
                                onClick={handleSave}
                                disabled={isSavingDraft ||
                                    (saveMode === 'new' && (!resumeTitle.trim() || !!titleError || isDuplicate)) ||
                                    (saveMode === 'replace' && !selectedResumeId)
                                }
                                isLoading={isSavingDraft}
                                tokenAmount={saveMode === 'new' && storageInfo && !storageInfo.can_create_new ? actionInfo?.amount : undefined}
                                className="flex-1"
                                size="lg"
                            >
                                <Save className="h-5 w-5 mr-2" />
                                {isSavingDraft
                                    ? 'Saving...'
                                    : saveMode === 'new'
                                        ? 'Save'
                                        : 'Replace'
                                }
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SaveResumeModal; 