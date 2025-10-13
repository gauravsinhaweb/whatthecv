import { Brush, Pen } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExportConfirmationModal from '../../../components/ui/ExportConfirmationModal';
import { useResumeState } from '../../../hooks/useResumeState';
import { ResumeData, initialResumeData } from '../../../types/resume';
import { exportResumeToPDF } from '../../../utils/resumeExport';
import { getEditorProps, renderPreviewContainer, setupPrintHandlers } from '../../../utils/resumeUI';
import ResumeCustomizationPanel from './components/ResumeCustomizationPanel';
import ResumeEditor from './components/ResumeEditor';
import ResumeFullScreenModal from './components/ResumeFullScreenModal';

const CreateResume: React.FC = () => {
    const navigate = useNavigate();
    const {
        resumeData,
        ui: { activeSection, expandedSections, previewScale },
        customizationOptions,
        ui: { fieldVisibility },
        save: { isAutoSaving, lastSavedTime },
        selectedDocument,
        enhancedResumeData,
        setResumeData,
        setCustomizationOptions,
        setActiveSection,
        setExpandedSections,
        setPreviewScale,
        setFieldVisibility,
        setEnhancedResumeData,
        setShouldShowSaveModal,
        setSelectedDocument,
        save: { isSavingDraft }
    } = useResumeState();
    const [activeTab, setActiveTab] = useState<string>('content');
    const [isFullScreenPreview, setIsFullScreenPreview] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Check if this is an existing resume (has been saved before with a title)
    const isExistingResume = selectedDocument?.title;

    // Ensure new resumes start with initialResumeData
    useEffect(() => {
        if (!selectedDocument && (!resumeData || Object.keys(resumeData).length === 0)) {
            setResumeData(initialResumeData);
        }
    }, [selectedDocument, resumeData, setResumeData]);




    // Create handlers object from store actions
    const handlers = {
        setPreviewScale,
        setActiveSection,
        setExpandedSections,
        setCustomizationOptions,
        handleZoomIn: () => setPreviewScale(Math.min(previewScale + 0.1, 1)),
        handleZoomOut: () => setPreviewScale(Math.max(previewScale - 0.1, 0.3)),
        handlePersonalInfoChange: (field: string, value: string) => {
            setResumeData({
                ...resumeData,
                personalInfo: { ...resumeData.personalInfo, [field]: value }
            });
        },
        handleWorkExperienceChange: (id: string, field: string, value: string | boolean) => {
            setResumeData({
                ...resumeData,
                workExperience: resumeData.workExperience.map(exp =>
                    exp.id === id ? { ...exp, [field]: value } : exp
                )
            });
        },
        handleEducationChange: (id: string, field: string, value: string) => {
            setResumeData({
                ...resumeData,
                education: resumeData.education.map(edu =>
                    edu.id === id ? { ...edu, [field]: value } : edu
                )
            });
        },
        handleProjectChange: (id: string, field: string, value: string) => {
            setResumeData({
                ...resumeData,
                projects: resumeData.projects.map(proj =>
                    proj.id === id ? { ...proj, [field]: value } : proj
                )
            });
        },
        handleAchievementChange: (id: string, field: string, value: string) => {
            setResumeData({
                ...resumeData,
                achievements: resumeData.achievements.map(ach =>
                    ach.id === id ? { ...ach, [field]: value } : ach
                )
            });
        },
        handlePublicationChange: (id: string, field: string, value: string) => {
            setResumeData({
                ...resumeData,
                publications: resumeData.publications.map(pub =>
                    pub.id === id ? { ...pub, [field]: value } : pub
                )
            });
        },
        handleCertificationChange: (id: string, field: string, value: string) => {
            setResumeData({
                ...resumeData,
                certifications: resumeData.certifications.map(cert =>
                    cert.id === id ? { ...cert, [field]: value } : cert
                )
            });
        },
        addWorkExperience: () => {
            const newExp = {
                id: `work-${Date.now()}`,
                position: '',
                company: '',
                location: '',
                startMonth: '',
                startYear: '',
                endMonth: '',
                endYear: '',
                current: false,
                showStartMonth: true,
                showEndMonth: true,
                description: ''
            };
            setResumeData({
                ...resumeData,
                workExperience: [...resumeData.workExperience, newExp]
            });
        },
        addEducation: () => {
            const newEdu = {
                id: `edu-${Date.now()}`,
                degree: '',
                institution: '',
                location: '',
                startMonth: '',
                startYear: '',
                endMonth: '',
                endYear: '',
                current: false,
                showStartMonth: true,
                showEndMonth: true,
                description: ''
            };
            setResumeData({
                ...resumeData,
                education: [...resumeData.education, newEdu]
            });
        },
        addProject: () => {
            const newProj = {
                id: `proj-${Date.now()}`,
                name: '',
                description: '',
                technologies: '',
                link: '',
                startMonth: '',
                startYear: '',
                endMonth: '',
                endYear: '',
                current: false,
                showStartMonth: true,
                showEndMonth: true
            };
            setResumeData({
                ...resumeData,
                projects: [...resumeData.projects, newProj]
            });
        },
        addAchievement: () => {
            const newAch = {
                id: `ach-${Date.now()}`,
                title: '',
                organization: '',
                description: '',
                link: '',
                month: '',
                year: ''
            };
            setResumeData({
                ...resumeData,
                achievements: [...resumeData.achievements, newAch]
            });
        },
        addPublication: () => {
            const newPub = {
                id: `pub-${Date.now()}`,
                title: '',
                authors: '',
                journal: '',
                doi: '',
                link: '',
                description: '',
                month: '',
                year: ''
            };
            setResumeData({
                ...resumeData,
                publications: [...resumeData.publications, newPub]
            });
        },
        addCertification: () => {
            const newCert = {
                id: `cert-${Date.now()}`,
                name: '',
                issuer: '',
                credentialId: '',
                link: '',
                description: '',
                month: '',
                year: '',
                expiryMonth: '',
                expiryYear: ''
            };
            setResumeData({
                ...resumeData,
                certifications: [...resumeData.certifications, newCert]
            });
        },
        removeWorkExperience: (id: string) => {
            setResumeData({
                ...resumeData,
                workExperience: resumeData.workExperience.filter(exp => exp.id !== id)
            });
        },
        removeEducation: (id: string) => {
            setResumeData({
                ...resumeData,
                education: resumeData.education.filter(edu => edu.id !== id)
            });
        },
        removeProject: (id: string) => {
            setResumeData({
                ...resumeData,
                projects: resumeData.projects.filter(proj => proj.id !== id)
            });
        },
        removeAchievement: (id: string) => {
            setResumeData({
                ...resumeData,
                achievements: resumeData.achievements.filter(ach => ach.id !== id)
            });
        },
        removePublication: (id: string) => {
            setResumeData({
                ...resumeData,
                publications: resumeData.publications.filter(pub => pub.id !== id)
            });
        },
        removeCertification: (id: string) => {
            setResumeData({
                ...resumeData,
                certifications: resumeData.certifications.filter(cert => cert.id !== id)
            });
        },
        addSkillCategory: (name: string) => {
            const newCategory = {
                id: `skill-${Date.now()}`,
                name,
                skills: []
            };
            setResumeData({
                ...resumeData,
                skills: [...resumeData.skills, newCategory]
            });
        },
        removeSkillCategory: (id: string) => {
            setResumeData({
                ...resumeData,
                skills: resumeData.skills.filter(skill => skill.id !== id)
            });
        },
        addSkillToCategory: (categoryId: string, skill: string) => {
            setResumeData({
                ...resumeData,
                skills: resumeData.skills.map(skillCategory =>
                    skillCategory.id === categoryId
                        ? { ...skillCategory, skills: [...skillCategory.skills, skill] }
                        : skillCategory
                )
            });
        },
        removeSkillFromCategory: (categoryId: string, skillToRemove: string) => {
            setResumeData({
                ...resumeData,
                skills: resumeData.skills.map(skillCategory =>
                    skillCategory.id === categoryId
                        ? { ...skillCategory, skills: skillCategory.skills.filter(s => s !== skillToRemove) }
                        : skillCategory
                )
            });
        },
        updateSkillCategoryName: (id: string, name: string) => {
            setResumeData({
                ...resumeData,
                skills: resumeData.skills.map(skill =>
                    skill.id === id ? { ...skill, name } : skill
                )
            });
        },
        toggleSection: (section: string) => {
            setExpandedSections({
                ...expandedSections,
                [section]: !expandedSections[section]
            });
        },
        editSection: (section: string) => {
            setActiveSection(section);
        },
        toggleFieldVisibility: (fieldKey: string) => {
            setFieldVisibility({
                ...fieldVisibility,
                [fieldKey]: !fieldVisibility[fieldKey]
            });
        }
    };

    const setPreviewScaleRef = useRef(handlers.setPreviewScale);
    setPreviewScaleRef.current = handlers.setPreviewScale;

    // Add loading state check
    const isLoading = !resumeData || !handlers;

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-lg text-slate-600">Loading resume editor...</p>
                </div>
            </div>
        );
    }

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

    // Track unsaved changes when resume data changes (only for existing resumes)
    useEffect(() => {
        if (resumeData && isExistingResume) {
            setHasUnsavedChanges(true);
        }
    }, [resumeData, isExistingResume]);

    // Reset unsaved changes when auto-save occurs (only for existing resumes)
    useEffect(() => {
        if (lastSavedTime && isExistingResume) {
            setHasUnsavedChanges(false);
        }
    }, [lastSavedTime, isExistingResume]);

    // Check if there are actually unsaved changes (more recent than last save) - only for existing resumes
    const hasActualUnsavedChanges = isExistingResume && hasUnsavedChanges && (!lastSavedTime ||
        new Date().getTime() - lastSavedTime.getTime() > 5000); // 5 seconds buffer

    // Push a dummy state to the history when component mounts
    useEffect(() => {
        window.history.pushState(null, '', window.location.pathname);
    }, []);

    // Handle back button and history navigation (only for existing resumes)
    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            if (hasActualUnsavedChanges && !isSavingDraft) {
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
    }, [hasActualUnsavedChanges, isSavingDraft, navigate]);

    // Handle beforeunload event to show confirmation dialog (only for existing resumes)
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasActualUnsavedChanges && !isSavingDraft) {
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
    }, [hasActualUnsavedChanges, isSavingDraft]);

    useEffect(() => {
        // Check for enhanced resume data in the store
        if (!enhancedResumeData) return;

        try {
            // Convert EnhancedResumeData to ResumeData format
            const convertedData: ResumeData = {
                personalInfo: {
                    ...enhancedResumeData.personalInfo,
                    summary: enhancedResumeData.personalInfo.summary || ''
                },
                workExperience: enhancedResumeData.workExperience,
                education: enhancedResumeData.education,
                skills: (() => {
                    if (!enhancedResumeData.skills || enhancedResumeData.skills.length === 0) {
                        return [];
                    }
                    const firstSkill = enhancedResumeData.skills[0];
                    if (firstSkill !== null && firstSkill !== undefined && typeof firstSkill === 'object' && 'skills' in (firstSkill as object) && Array.isArray((firstSkill as any).skills)) {
                        return enhancedResumeData.skills as unknown as { id: string; name: string; skills: string[] }[];
                    } else {
                        return [{ id: '1', name: 'Technical Skills', skills: enhancedResumeData.skills as unknown as string[] }];
                    }
                })(),
                projects: enhancedResumeData.projects,
                achievements: [],
                publications: [],
                certifications: [],
            };

            // Clear selected document to treat this as a new resume
            setSelectedDocument(null);

            // Update resume data with the enhanced content
            setResumeData(convertedData);

            // Clear enhanced data from store
            setEnhancedResumeData(null);
        } catch (error) {
            console.error('Error loading enhanced resume data:', error);
        }
    }, [enhancedResumeData, setResumeData, setEnhancedResumeData, setSelectedDocument]);

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
            }
        ),
        [resumeData, activeSection, expandedSections, handlers]
    );

    const handleConfirmExport = () => {
        setIsExportModalOpen(false);
        exportResumeToPDF(resumeData, customizationOptions);
    };

    return (
        <div className="h-full flex flex-col overflow-hidden">
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

            <div className="flex-1 p-6 pb-0 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 h-full overflow-hidden">
                    <div className="md:col-span-6 flex flex-col h-full overflow-hidden">
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
                                    <ResumeEditor />
                                ) : (
                                    <ResumeCustomizationPanel
                                        options={customizationOptions}
                                        onChange={handlers.setCustomizationOptions}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-6 flex flex-col h-full overflow-hidden">
                        <div className="h-full pt-4 hide-scrollbar overflow-y-scroll overflow-x-hidden bg-slate-200 border border-slate-200 flex justify-center">
                            {renderPreviewContainer(
                                resumeData,
                                customizationOptions,
                                previewScale,
                                setIsFullScreenPreview,
                                { fieldVisibility }
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateResume; 