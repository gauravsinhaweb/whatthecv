import { Eye, EyeOff, FileDown, Layout, Maximize2, Palette } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import ResumeCustomizationPanel from './components/ResumeCustomizationPanel';
import ResumeEditor from './components/ResumeEditor';
import ResumeFullScreenModal from './components/ResumeFullScreenModal';
import Button from '../../../components/ui/Button';
import { useResumeState } from '../../../hooks/useResumeState';
import { exportResumeToPDF } from '../../../utils/resumeExport';
import { getEditorProps, renderPreviewContainer, setupPrintHandlers } from '../../../utils/resumeUI';
import { EnhancedResumeData } from '../../../utils/ai';
import { ResumeData } from '../../../types/resume';
import { useResumeStore } from '../../../store/resumeStore';

const CreateResume: React.FC = () => {
    const {
        resumeData,
        skillInput,
        activeSection,
        expandedSections,
        customizationOptions,
        previewScale,
        handlers
    } = useResumeState();

    // Get enhanced resume data and setResumeData from Zustand store
    const { enhancedResumeData, setEnhancedResumeData, setResumeData } = useResumeStore();

    const [isMobilePreviewVisible, setIsMobilePreviewVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<string>('content');
    const [isFullScreenPreview, setIsFullScreenPreview] = useState(false);

    useEffect(() => {
        // Check for enhanced resume data in the store
        if (enhancedResumeData) {
            try {
                console.log('Found enhanced resume data:', enhancedResumeData);

                // Convert EnhancedResumeData to ResumeData format
                const convertedData: ResumeData = {
                    personalInfo: enhancedResumeData.personalInfo,
                    workExperience: enhancedResumeData.workExperience,
                    education: enhancedResumeData.education,
                    skills: enhancedResumeData.skills,
                    projects: enhancedResumeData.projects
                };

                // Update resume data with the enhanced content
                setResumeData(convertedData);

                // Clear enhanced data from store
                setEnhancedResumeData(null);
            } catch (error) {
                console.error('Error loading enhanced resume data:', error);
            }
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
        exportResumeToPDF(resumeData);
    };

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            <ResumeFullScreenModal
                isOpen={isFullScreenPreview}
                onClose={() => setIsFullScreenPreview(false)}
                resumeData={resumeData}
                customizationOptions={customizationOptions}
                previewScale={previewScale}
                onZoomIn={handlers.handleZoomIn}
                onZoomOut={handlers.handleZoomOut}
            />

            <div className="md:hidden flex mb-6 space-x-2">
                <Button variant="outline" onClick={handlers.saveAsDraft} fullWidth>
                    Save as Draft
                </Button>
                <Button variant="primary" onClick={handlers.saveResumeWithOptions} fullWidth>
                    Save Resume
                </Button>
            </div>

            <div className="flex">
                {/* Vertical tab navigation */}
                <div className="bg-white rounded-l-lg shadow-md border border-slate-200 mr-6 flex-shrink-0 self-start sticky top-6">
                    <div className="flex flex-col border-r border-slate-200">
                        <button
                            className={`p-4 font-medium transition-colors relative ${activeTab === 'content'
                                ? 'text-blue-600 border-r-2 border-blue-600 bg-white'
                                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                                }`}
                            onClick={() => setActiveTab('content')}
                        >
                            <div className="flex flex-col items-center">
                                <Layout className="w-5 h-5 mb-1" />
                                <span className="text-xs">Content</span>
                            </div>
                        </button>
                        <button
                            className={`p-4 font-medium transition-colors relative ${activeTab === 'customization'
                                ? 'text-blue-600 border-r-2 border-blue-600 bg-white'
                                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                                }`}
                            onClick={() => setActiveTab('customization')}
                        >
                            <div className="flex flex-col items-center">
                                <Palette className="w-5 h-5 mb-1" />
                                <span className="text-xs">Design</span>
                            </div>
                        </button>
                        <button
                            className="p-4 font-medium transition-colors relative text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                            onClick={handleExportPDF}
                        >
                            <div className="flex flex-col items-center">
                                <FileDown className="w-5 h-5 mb-1" />
                                <span className="text-xs">Export</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Content area */}
                <div className="flex-1">
                    {activeTab === 'content' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
                            <div className={`${isMobilePreviewVisible ? 'hidden' : 'block'} sm:block`}>
                                <ResumeEditor {...editorProps} />
                            </div>
                            <div className={`${isMobilePreviewVisible ? 'block' : 'hidden'} sm:block`}>
                                <div className="lg:sticky top-24 hide-scrollbar" style={{ maxHeight: 'calc(100vh - 6rem)', overflowY: 'auto' }}>
                                    <div className="flex justify-center items-center">
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
                    )}

                    {activeTab === 'customization' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
                            <div>
                                <ResumeCustomizationPanel
                                    options={customizationOptions}
                                    onChange={handlers.setCustomizationOptions}
                                    onSave={handlers.saveResumeWithOptions}
                                    onSaveAsDraft={handlers.saveAsDraft}
                                />
                            </div>
                            <div>
                                <div className="lg:sticky top-24 hide-scrollbar" style={{ maxHeight: 'calc(100vh - 6rem)', overflowY: 'auto' }}>
                                    <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                                        <h2 className="text-lg font-bold text-slate-800">Preview</h2>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setIsFullScreenPreview(true)}
                                                leftIcon={<Maximize2 className="w-4 h-4" />}
                                            >
                                                Full Screen
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex justify-center items-center">
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
                    )}

                    <div className="mt-6 sm:hidden flex justify-center items-center">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsMobilePreviewVisible(!isMobilePreviewVisible)}
                            leftIcon={isMobilePreviewVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            className="w-full max-w-xs"
                        >
                            {isMobilePreviewVisible ? 'Edit Content' : 'Show Preview'}
                        </Button>
                    </div>

                    <div className="flex justify-center mt-6 text-sm text-slate-500">
                        <p>Need help? Check out our <a href="#" className="text-blue-600 hover:underline">resume writing guide</a> or <a href="#" className="text-blue-600 hover:underline">contact support</a>.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateResume; 