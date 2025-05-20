import { Eye, EyeOff, FileDown, Layout, Palette, Laptop } from 'lucide-react';
import React, { useEffect, useMemo, useState, ReactElement } from 'react';
import Button from '../../../components/ui/Button';
import { useResumeState } from '../../../hooks/useResumeState';
import { useResumeStore } from '../../../store/resumeStore';
import { ResumeData } from '../../../types/resume';
import { exportResumeToPDF } from '../../../utils/resumeExport';
import { getEditorProps, renderPreviewContainer, setupPrintHandlers } from '../../../utils/resumeUI';
import ResumeCustomizationPanel from './components/ResumeCustomizationPanel';
import ResumeEditor from './components/ResumeEditor';
import ResumeFullScreenModal from './components/ResumeFullScreenModal';
import ExportConfirmationModal from '../../../components/ui/ExportConfirmationModal';

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
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    const renderTabButton = (tab: string, icon: ReactElement, label: string) => {
        const isActive = activeTab === tab;
        return (
            <button
                className={`transition-colors relative flex flex-col items-center justify-center 
                    ${isActive
                        ? 'text-blue-600'
                        : 'text-slate-600 hover:text-slate-800'}`}
                onClick={() => setActiveTab(tab)}
            >
                <div className="flex flex-col items-center">
                    {icon}
                    <span className="text-xs mt-1">{label}</span>
                </div>
                {isActive && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 md:hidden"></div>}
                {isActive && <div className="absolute right-0 top-0 h-full w-0.5 bg-blue-600 hidden md:block"></div>}
            </button>
        );
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
        <div className="container mx-auto px-2 md:px-4 py-4 md:py-6 max-w-7xl">
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

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-md border-t border-slate-200 z-10">
                <div className="flex justify-around items-center h-16">
                    {renderTabButton('content', <Layout className="w-5 h-5" />, 'Content')}
                    {renderTabButton('customization', <Palette className="w-5 h-5" />, 'Design')}
                    <button
                        className="flex flex-col items-center justify-center text-slate-600 hover:text-slate-800"
                        onClick={handleExportPDF}
                    >
                        <FileDown className="w-5 h-5" />
                        <span className="text-xs mt-1">Export</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row pb-20 md:pb-0">
                {/* Desktop Sidebar Navigation - hidden on mobile */}
                <div className="hidden md:block bg-white rounded-lg shadow-md border border-slate-200 mr-6 flex-shrink-0 self-start sticky top-6">
                    <div className="flex flex-col border-r border-slate-200">
                        {renderTabButton('content', <Layout className="w-5 h-5 mb-1" />, 'Content')}
                        {renderTabButton('customization', <Palette className="w-5 h-5 mb-1" />, 'Design')}
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
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 relative">
                            <div className={`${isMobilePreviewVisible ? 'hidden' : 'block'} sm:block`}>
                                <ResumeEditor
                                    {...editorProps}
                                    customizationOptions={customizationOptions}
                                    onCustomizationChange={handlers.setCustomizationOptions}
                                />
                            </div>
                            <div className={`${isMobilePreviewVisible ? 'block' : 'hidden'} sm:block`}>
                                <div className="lg:sticky top-20 hide-scrollbar overflow-x-auto" style={{ maxHeight: 'calc(100vh - 8rem)', overflowY: 'auto' }}>
                                    <div className="flex justify-center items-center min-w-full">
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
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 relative">
                            <div className={`${isMobilePreviewVisible ? 'hidden' : 'block'} sm:block`}>
                                <ResumeCustomizationPanel
                                    options={customizationOptions}
                                    onChange={handlers.setCustomizationOptions}
                                    onSave={handlers.saveResumeWithOptions}
                                    onSaveAsDraft={handlers.saveAsDraft}
                                />
                            </div>
                            <div className={`${isMobilePreviewVisible ? 'block' : 'hidden'} sm:block`}>
                                <div className="lg:sticky top-24 hide-scrollbar overflow-x-auto" style={{ maxHeight: 'calc(100vh - 8rem)', overflowY: 'auto' }}>
                                    <div className="flex justify-center items-center min-w-full">
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
                </div>
            </div>
        </div>
    );
};

export default CreateResume; 