import { Brush, Laptop, Pen } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ExportConfirmationModal from '../../../components/ui/ExportConfirmationModal';
import { useResumeState } from '../../../hooks/useResumeState';
import { useResumeStore } from '../../../store/resumeStore';
import { ResumeData } from '../../../types/resume';
import { exportResumeToPDF } from '../../../utils/resumeExport';
import { getEditorProps, renderPreviewContainer, setupPrintHandlers } from '../../../utils/resumeUI';
import ResumeCustomizationPanel from './components/ResumeCustomizationPanel';
import ResumeEditor from './components/ResumeEditor';
import ResumeFullScreenModal from './components/ResumeFullScreenModal';

const CreateResume: React.FC = () => {
    const navigate = useNavigate();
    const {
        resumeData,
        skillInput,
        activeSection,
        expandedSections,
        customizationOptions,
        handlers,
        previewScale
    } = useResumeState();
    const { enhancedResumeData, setEnhancedResumeData, setResumeData, isSavingDraft, saveAsDraft } = useResumeStore();
    const [activeTab, setActiveTab] = useState<string>('content');
    const [isFullScreenPreview, setIsFullScreenPreview] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const setPreviewScaleRef = useRef(handlers.setPreviewScale);
    setPreviewScaleRef.current = handlers.setPreviewScale;

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setScreenWidth(width);

            const baseWidth = 1200;
            const maxScale = 1;

            let newScale;
            if (width < 768) {
                const minScale = 0.8;
                newScale = Math.max(minScale, Math.min(maxScale, (width * 0.85) / baseWidth));
            } else {
                const minScale = 0.4;
                newScale = Math.max(minScale, Math.min(maxScale, (width * 0.67) / baseWidth));
            }

            setPreviewScaleRef.current(newScale);
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Track unsaved changes when resume data changes
    useEffect(() => {
        if (resumeData) {
            setHasUnsavedChanges(true);
        }
    }, [resumeData]);

    // Push a dummy state to the history when component mounts
    useEffect(() => {
        window.history.pushState(null, '', window.location.pathname);
    }, []);

    // Handle back button and history navigation
    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            if (hasUnsavedChanges && !isSavingDraft) {
                // Prevent the default back action
                event.preventDefault();
                // Push another state to prevent back navigation
                window.history.pushState(null, '', window.location.pathname);

                // Show confirmation dialog
                const shouldLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');

                if (shouldLeave) {
                    setHasUnsavedChanges(false);
                    navigate(-1); // Navigate back if user confirms
                }
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [hasUnsavedChanges, isSavingDraft, navigate]);

    // Handle beforeunload event to show confirmation dialog
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges && !isSavingDraft) {
                const message = 'You have unsaved changes. Are you sure you want to leave?';
                e.preventDefault();
                e.returnValue = message;
                return message;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasUnsavedChanges, isSavingDraft]);

    useEffect(() => {
        // Check for enhanced resume data in the store
        if (!enhancedResumeData) return;

        try {
            // Convert EnhancedResumeData to ResumeData format
            const convertedData: ResumeData = {
                personalInfo: {
                    ...enhancedResumeData.personalInfo,
                    // Move summary from top level to personalInfo if it exists
                    summary: enhancedResumeData.personalInfo.summary || ''
                },
                workExperience: enhancedResumeData.workExperience,
                education: enhancedResumeData.education,
                skills: enhancedResumeData.skills,
                projects: enhancedResumeData.projects,
            };

            // Update resume data with the enhanced content
            setResumeData(convertedData);

            // Clear enhanced data from store
            setEnhancedResumeData(null);
        } catch (error) {
            console.error('Error loading enhanced resume data:', error);
        }
    }, [enhancedResumeData, setResumeData, setEnhancedResumeData]);

    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isFullScreenPreview) {
                setIsFullScreenPreview(false);
            }
        };

        document.addEventListener('keydown', handleEscKey);

        if (isFullScreenPreview) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = '';
        };
    }, [isFullScreenPreview]);

    useEffect(() => {
        setupPrintHandlers();
    }, []);

    const editorProps = useMemo(() =>
        getEditorProps(
            resumeData,
            activeSection,
            expandedSections,
            {
                ...handlers,
                skillInput
            }
        ),
        [resumeData, activeSection, expandedSections, handlers, skillInput]
    );

    const handleExportPDF = () => {
        setIsExportModalOpen(true);
    };

    const handleConfirmExport = () => {
        setIsExportModalOpen(false);
        exportResumeToPDF(resumeData);
    };

    const handleSaveDraft = async () => {
        try {
            await saveAsDraft();
            setHasUnsavedChanges(false);
            toast.success('Draft saved successfully');
        } catch (error) {
            toast.error('Failed to save draft');
        }
    };

    // Screen too small message
    if (screenWidth < 450) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <div className="flex justify-center mb-6">
                        <Laptop className="w-16 h-16 text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Screen Too Small</h2>
                    <p className="text-gray-600 mb-6">
                        The resume builder requires a minimum screen width of 450px for the best experience.
                        Please use a larger device or rotate your device to landscape mode.
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <p className="text-sm text-blue-700">
                            For the best experience, we recommend using a desktop or tablet device with a screen width of at least 768px.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen overflow-visible md:overflow-hidden flex flex-col">
            <ResumeFullScreenModal
                isOpen={isFullScreenPreview}
                onClose={() => setIsFullScreenPreview(false)}
                resumeData={resumeData}
                customizationOptions={customizationOptions}
                previewScale={previewScale}
                onZoomIn={handlers.handleZoomIn}
                onZoomOut={handlers.handleZoomOut}
            />
            <ExportConfirmationModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                onConfirm={handleConfirmExport}
            />

            <div className="flex-1 p-6 overflow-visible md:overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 h-full overflow-hidden">
                    <div className="md:col-span-6 flex flex-col h-full max-h-[calc(100dvh-6rem)] overflow-scroll">
                        <div className="flex-shrink-0 mb-4">
                            <div className="flex bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                                <button
                                    className={`flex-1 px-4 py-3 font-medium transition-colors relative ${activeTab === 'content'
                                        ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                                        }`}
                                    onClick={() => setActiveTab('content')}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <Pen className="w-4 h-4" />
                                        <span className="text-sm">Content</span>
                                    </div>
                                </button>
                                <button
                                    className={`flex-1 px-4 py-3 font-medium transition-colors relative ${activeTab === 'customization'
                                        ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                                        }`}
                                    onClick={() => setActiveTab('customization')}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <Brush className="w-4 h-4" />
                                        <span className="text-sm">Customize</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                            <div className="h-full overflow-y-auto">
                                {activeTab === 'content' ? (
                                    <ResumeEditor
                                        {...editorProps}
                                        customizationOptions={customizationOptions}
                                        onCustomizationChange={handlers.setCustomizationOptions}
                                    />
                                ) : (
                                    <ResumeCustomizationPanel
                                        options={customizationOptions}
                                        onChange={handlers.setCustomizationOptions}
                                        onSave={handlers.saveResumeWithOptions}
                                        onSaveAsDraft={handlers.saveAsDraft}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-6 flex flex-col h-full">
                        <div className="h-full max-h-[calc(100dvh-6rem)] hide-scrollbar overflow-y-scroll overflow-x-hidden bg-slate-200 border border-slate-200 flex justify-center">
                            {renderPreviewContainer(
                                resumeData,
                                customizationOptions,
                                previewScale,
                                setIsFullScreenPreview
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateResume; 