import { Save, X } from 'lucide-react';
import React from 'react';
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
    if (!isOpen) return null;

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
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !isSavingDraft) {
                                                if (saveMode === 'new') {
                                                    onSaveDraft();
                                                } else {
                                                    onReplaceResume();
                                                }
                                            } else if (e.key === 'Escape') {
                                                onClose();
                                                setResumeTitle('');
                                            }
                                        }}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-slate-900 placeholder-slate-400"
                                        placeholder={saveMode === 'new' ? "e.g., Google v1" : "Leave empty to keep current title"}
                                        autoFocus={saveMode === 'new'}
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
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
                                                className={`w-full p-3 rounded-lg border-2 transition-all text-left ${selectedResumeId === resume.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-slate-200 hover:border-slate-300'
                                                    }`}
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
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="replaceExisting"
                                    checked={saveMode === 'replace'}
                                    onChange={(e) => onSaveModeChange((e.target as HTMLInputElement).checked ? 'replace' : 'new')}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                                />
                                <label htmlFor="replaceExisting" className="text-xs font-medium text-slate-700">
                                    I want to use an existing space
                                </label>
                            </div>
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
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={saveMode === 'new' ? onSaveDraft : onReplaceResume}
                                disabled={
                                    isSavingDraft ||
                                    (saveMode === 'new' && !resumeTitle.trim()) ||
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