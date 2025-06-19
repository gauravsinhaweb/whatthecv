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
            const minScale = 0.3;

            let newScale;

            if (width < 480) {
                newScale = Math.max(minScale, Math.min(maxScale, (width * 0.45) / 480));
            } else if (width < 640) {
                newScale = Math.max(minScale, Math.min(maxScale, (width * 0.75) / 640));
            } else if (width < 768) {
                newScale = Math.max(minScale, Math.min(maxScale, (width * 0.85) / 768));
            } else {
                newScale = Math.max(minScale, Math.min(maxScale, (width * 0.67) / baseWidth));
            }

            console.log(`Window width: ${width}px, Final scale: ${newScale.toFixed(3)}`);
            setPreviewScaleRef.current(newScale);
        };

        const debouncedHandleResize = () => {
            clearTimeout((window as any).resizeTimeout);
            (window as any).resizeTimeout = setTimeout(handleResize, 30);
        };

        window.addEventListener('resize', debouncedHandleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', debouncedHandleResize);
            clearTimeout((window as any).resizeTimeout);
        };
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