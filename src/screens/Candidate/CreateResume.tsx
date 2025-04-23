import { Eye, EyeOff, Layout, Maximize2, Palette, Save } from 'lucide-react';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Button from '../../components/ui/Button';
import ResumeCustomizationPanel from '../../components/resume/ResumeCustomizationPanel';
import { ResumeData, ResumeCustomizationOptions, defaultCustomizationOptions, initialResumeData } from '../../types/resume';
import ResumeEditor from '../../components/resume/ResumeEditor';
import ResumePreview from '../../components/resume/ResumePreview';
import ResumeFullScreenModal from '../../components/resume/ResumeFullScreenModal';

const CreateResume: React.FC = () => {
    const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
    const [skillInput, setSkillInput] = useState('');
    const [activeSection, setActiveSection] = useState<string>('personalInfo');
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        personalInfo: true,
        workExperience: false,
        education: false,
        skills: false,
        projects: false,
    });
    const [isMobilePreviewVisible, setIsMobilePreviewVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<string>('content');
    const [customizationOptions, setCustomizationOptions] = useState<ResumeCustomizationOptions>(defaultCustomizationOptions);
    const [isFullScreenPreview, setIsFullScreenPreview] = useState(false);
    const [previewScale, setPreviewScale] = useState(70);

    // Handle escape key to close modal
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isFullScreenPreview) {
                setIsFullScreenPreview(false);
            }
        };

        document.addEventListener('keydown', handleEscKey);

        // Lock body scroll when modal is open
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

    const handleZoomIn = useCallback(() => {
        setPreviewScale(prev => Math.min(prev + 10, 150));
    }, []);

    const handleZoomOut = useCallback(() => {
        setPreviewScale(prev => Math.max(prev - 10, 50));
    }, []);

    const handlePersonalInfoChange = useCallback((field: string, value: string) => {
        setResumeData(prev => ({
            ...prev,
            personalInfo: {
                ...prev.personalInfo,
                [field]: value,
            },
        }));
    }, []);

    const handleWorkExperienceChange = useCallback((id: string, field: string, value: string | boolean) => {
        setResumeData(prev => ({
            ...prev,
            workExperience: prev.workExperience.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            ),
        }));
    }, []);

    const handleEducationChange = useCallback((id: string, field: string, value: string) => {
        setResumeData(prev => ({
            ...prev,
            education: prev.education.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            ),
        }));
    }, []);

    const handleProjectChange = useCallback((id: string, field: string, value: string) => {
        setResumeData(prev => ({
            ...prev,
            projects: prev.projects.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            ),
        }));
    }, []);

    const addWorkExperience = useCallback(() => {
        setResumeData(prev => {
            const newId = String(prev.workExperience.length + 1);
            return {
                ...prev,
                workExperience: [
                    ...prev.workExperience,
                    {
                        id: newId,
                        title: '',
                        company: '',
                        location: '',
                        startDate: '',
                        endDate: '',
                        current: false,
                        description: '',
                    },
                ],
            };
        });
    }, []);

    const addEducation = useCallback(() => {
        setResumeData(prev => {
            const newId = String(prev.education.length + 1);
            return {
                ...prev,
                education: [
                    ...prev.education,
                    {
                        id: newId,
                        degree: '',
                        institution: '',
                        location: '',
                        startDate: '',
                        endDate: '',
                        description: '',
                    },
                ],
            };
        });
    }, []);

    const addProject = useCallback(() => {
        setResumeData(prev => {
            const newId = String(prev.projects.length + 1);
            return {
                ...prev,
                projects: [
                    ...prev.projects,
                    {
                        id: newId,
                        name: '',
                        description: '',
                        technologies: '',
                        link: '',
                    },
                ],
            };
        });
    }, []);

    const removeWorkExperience = useCallback((id: string) => {
        setResumeData(prev => ({
            ...prev,
            workExperience: prev.workExperience.filter((item) => item.id !== id),
        }));
    }, []);

    const removeEducation = useCallback((id: string) => {
        setResumeData(prev => ({
            ...prev,
            education: prev.education.filter((item) => item.id !== id),
        }));
    }, []);

    const removeProject = useCallback((id: string) => {
        setResumeData(prev => ({
            ...prev,
            projects: prev.projects.filter((item) => item.id !== id),
        }));
    }, []);

    const addSkill = useCallback(() => {
        if (skillInput.trim() && !resumeData.skills.includes(skillInput.trim())) {
            setResumeData(prev => ({
                ...prev,
                skills: [...prev.skills, skillInput.trim()],
            }));
            setSkillInput('');
        }
    }, [skillInput, resumeData.skills]);

    const removeSkill = useCallback((skill: string) => {
        setResumeData(prev => ({
            ...prev,
            skills: prev.skills.filter((s) => s !== skill),
        }));
    }, []);

    const handleSkillInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    }, [addSkill]);

    const saveResume = useCallback(() => {
        const resumeJSON = JSON.stringify(resumeData, null, 2);
        const blob = new Blob([resumeJSON], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_resume.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [resumeData]);

    const saveResumeWithOptions = useCallback(() => {
        const completeData = {
            resumeData,
            customizationOptions,
        };
        const dataJSON = JSON.stringify(completeData, null, 2);
        const blob = new Blob([dataJSON], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_complete_resume.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [resumeData, customizationOptions]);

    const saveAsDraft = useCallback(() => {
        const completeData = {
            resumeData,
            customizationOptions,
            savedAt: new Date().toISOString(),
            isDraft: true,
        };
        localStorage.setItem('resumeDraft', JSON.stringify(completeData));
        alert('Resume saved as draft');
    }, [resumeData, customizationOptions]);

    const toggleSection = useCallback((section: string) => {
        setExpandedSections(prev => {
            const newState = {
                ...prev,
                [section]: !prev[section]
            };

            // If expanding the section, set it as active
            if (!prev[section]) {
                setActiveSection(section);
            }

            return newState;
        });
    }, []);

    const editSection = useCallback((section: string) => {
        setActiveSection(section);
        setExpandedSections(prev => ({
            ...prev,
            [section]: true
        }));
    }, []);

    const editorProps = useMemo(() => ({
        resumeData,
        activeSection,
        expandedSections,
        onPersonalInfoChange: handlePersonalInfoChange,
        onWorkExperienceChange: handleWorkExperienceChange,
        onEducationChange: handleEducationChange,
        onProjectChange: handleProjectChange,
        onSkillChange: {
            addSkill,
            removeSkill,
            setSkillInput,
            skillInput,
        },
        onSectionToggle: toggleSection,
        onSectionEdit: editSection,
        onAdd: {
            addWorkExperience,
            addEducation,
            addProject,
        },
        onRemove: {
            removeWorkExperience,
            removeEducation,
            removeProject,
        },
        onSkillInputKeyDown: handleSkillInputKeyDown,
    }), [
        resumeData,
        activeSection,
        expandedSections,
        handlePersonalInfoChange,
        handleWorkExperienceChange,
        handleEducationChange,
        handleProjectChange,
        addSkill,
        removeSkill,
        skillInput,
        toggleSection,
        editSection,
        addWorkExperience,
        addEducation,
        addProject,
        removeWorkExperience,
        removeEducation,
        removeProject,
        handleSkillInputKeyDown,
    ]);

    const renderPreviewContainer = () => (

        <div
            className="transform origin-top transition-transform duration-200 ease-in-out"
            onClick={() => setIsFullScreenPreview(true)}
            style={{
                transform: `scale(${previewScale / 100})`,
                maxWidth: '210mm',
                minHeight: '297mm',
                aspectRatio: '1 / 1.414',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
        >
            <ResumePreview
                resumeData={resumeData}
                customizationOptions={customizationOptions}
                previewScale={previewScale}
            />
        </div>
    );

    // Auto-enable profile photo display in customization when a valid profile picture is added
    useEffect(() => {
        const hasValidProfilePic = resumeData.personalInfo.profilePicture &&
            resumeData.personalInfo.profilePicture.startsWith('data:image');

        if (hasValidProfilePic && !customizationOptions.header.showPhoto) {
            setCustomizationOptions(prev => ({
                ...prev,
                header: {
                    ...prev.header,
                    showPhoto: true
                }
            }));
        }
    }, [resumeData.personalInfo.profilePicture, customizationOptions.header.showPhoto]);

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            <ResumeFullScreenModal
                isOpen={isFullScreenPreview}
                onClose={() => setIsFullScreenPreview(false)}
                resumeData={resumeData}
                customizationOptions={customizationOptions}
                previewScale={previewScale}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
            />

            <div className="md:hidden flex mb-6 space-x-2">
                <Button variant="outline" onClick={saveAsDraft} fullWidth>
                    Save as Draft
                </Button>
                <Button variant="primary" onClick={saveResumeWithOptions} fullWidth>
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
                                <div className="lg:sticky top-24" style={{ maxHeight: 'calc(100vh - 6rem)', overflowY: 'auto' }}>
                                    <div className="flex justify-center items-center">
                                        {renderPreviewContainer()}
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
                                    onChange={setCustomizationOptions}
                                    onSave={saveResumeWithOptions}
                                    onSaveAsDraft={saveAsDraft}
                                />
                            </div>
                            <div>
                                <div className="lg:sticky top-24" style={{ maxHeight: 'calc(100vh - 6rem)', overflowY: 'auto' }}>
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
                                        {renderPreviewContainer()}
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