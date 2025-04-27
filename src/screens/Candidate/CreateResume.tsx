import { Eye, EyeOff, Layout, Maximize2, Palette, Save, FileDown } from 'lucide-react';
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
            className="transform origin-top transition-transform duration-200 ease-in-out print-container"
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

    // Add useEffect for print handling
    useEffect(() => {
        globalThis?.addEventListener('beforeprint', () => {
            globalThis.document.title = `Resume_Builder_${Date.now()}`;
        });

        globalThis?.addEventListener('afterprint', () => {
            globalThis.document.title = 'Single Page Resume Builder';
        });
    }, []);

    // Add export handler
    const handleExportPDF = useCallback(() => {
        // Create a temporary print-only iframe to avoid affecting the main layout
        const printFrame = document.createElement('iframe');
        printFrame.style.position = 'fixed';
        printFrame.style.right = '0';
        printFrame.style.bottom = '0';
        printFrame.style.width = '0';
        printFrame.style.height = '0';
        printFrame.style.border = 'none';
        printFrame.style.zIndex = '-9999';
        printFrame.setAttribute('aria-hidden', 'true');
        printFrame.setAttribute('tabindex', '-1');

        document.body.appendChild(printFrame);

        // Wait for iframe to load before manipulating its contents
        printFrame.onload = () => {
            const frameDoc = printFrame.contentDocument || printFrame.contentWindow?.document;

            if (!frameDoc) {
                document.body.removeChild(printFrame);
                return;
            }

            // Get the resume element and confirm it exists
            const resumeElement = document.querySelector('.printable-content');
            if (!resumeElement) {
                document.body.removeChild(printFrame);
                return;
            }

            // First create the frame document structure
            frameDoc.open();
            frameDoc.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Resume_${resumeData.personalInfo.name || 'Export'}_${Date.now()}</title>
                    <meta charset="utf-8">
                    <style>
                        @page {
                            size: 210mm 297mm;
                            margin: 0;
                        }
                        body, html {
                            margin: 0;
                            padding: 0;
                            width: 210mm;
                            height: 297mm;
                            overflow: hidden;
                        }
                        .print-container {
                            position: relative;
                            width: 210mm;
                            height: 297mm;
                            margin: 0 auto;
                            padding: 0;
                            overflow: hidden;
                            background-color: white;
                        }
                        /* Ensure flexbox layout works properly */
                        .resume-body {
                            display: flex !important;
                            flex-direction: row !important;
                            gap: 1.5rem !important;
                            height: 297mm !important;
                            max-height: 297mm !important;
                            overflow: hidden !important;
                        }
                        .resume-main-column {
                            flex: 1 1 auto !important;
                            max-height: 297mm !important; /* Prevent overflow */
                            overflow: hidden !important;
                            padding-bottom: 10mm !important;
                        }
                        .resume-side-column {
                            width: 40% !important;
                            flex-shrink: 0 !important;
                            max-height: 297mm !important; /* Prevent overflow */
                            overflow: hidden !important;
                            padding-bottom: 10mm !important;
                        }
                        /* Adjust spacing for sections to fit better */
                        .resume-section {
                            margin-bottom: 0.75rem !important;
                        }
                        /* Slightly reduce font size for print */
                        .resume-content {
                            font-size: 0.95em !important;
                        }
                        /* Ensure text doesn't overflow */
                        p, li, div {
                            text-overflow: ellipsis !important;
                            overflow: hidden !important;
                        }
                        /* Fix font weights */
                        h1, h2, h3, h4, h5, h6 {
                            font-weight: inherit !important;
                        }
                        .font-black {
                            font-weight: 800 !important;
                        }
                        .font-bold {
                            font-weight: 700 !important;
                        }
                        .font-medium {
                            font-weight: 500 !important;
                        }
                        .font-normal {
                            font-weight: 400 !important;
                        }
                        /* Adjust spacing for education section */
                        .mb-8 {
                            margin-bottom: 2rem !important;
                        }
                        .mb-5 {
                            margin-bottom: 1.25rem !important;
                        }
                        /* Ensure media queries are properly applied */
                        @media (min-width: 768px) {
                            .md\\:flex-row {
                                flex-direction: row !important;
                            }
                            .md\\:w-2\\/5 {
                                width: 40% !important;
                            }
                        }
                        /* Specific section fixes */
                        .work-experience-item, .education-item, .project-item {
                            margin-bottom: 0.75rem !important;
                        }
                        /* Adjust work experience descriptions */
                        .work-description, .education-description, .project-description {
                            max-height: none !important;
                            overflow: hidden !important;
                            line-height: 1.4 !important;
                        }
                        /* Set maximum height for sections with scrolling */
                        .skills-list, .project-list {
                            max-height: none !important;
                            overflow: hidden !important;
                        }
                        /* Adjust spacing between items */
                        .mb-8 {
                            margin-bottom: 1rem !important;
                        }
                        .mb-5 {
                            margin-bottom: 0.75rem !important;
                        }
                        .mb-3 {
                            margin-bottom: 0.5rem !important;
                        }
                        /* Add a small bottom margin to the whole page */
                        .print-container {
                            padding-bottom: 10mm !important;
                        }
                    </style>
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
                </head>
                <body>
                    <div class="print-container"></div>
                </body>
                </html>
            `);
            frameDoc.close();

            // Copy all stylesheets to the iframe
            const stylesheets = Array.from(document.styleSheets);
            stylesheets.forEach(stylesheet => {
                try {
                    // For same-origin stylesheets, copy all rules
                    if (stylesheet.href && new URL(stylesheet.href).origin !== window.location.origin) {
                        // External stylesheet, create a link to it
                        const link = frameDoc.createElement('link');
                        link.rel = 'stylesheet';
                        link.href = stylesheet.href;
                        frameDoc.head.appendChild(link);
                    } else {
                        // Internal stylesheet, copy the rules
                        const style = frameDoc.createElement('style');
                        try {
                            const cssRules = stylesheet.cssRules || stylesheet.rules;
                            if (cssRules) {
                                let cssText = '';
                                for (let i = 0; i < cssRules.length; i++) {
                                    cssText += cssRules[i].cssText + '\n';
                                }
                                style.textContent = cssText;
                                frameDoc.head.appendChild(style);
                            }
                        } catch (e) {
                            console.warn('Could not access stylesheet rules', e);
                        }
                    }
                } catch (e) {
                    console.warn('Error copying styles', e);
                }
            });

            // Deep clone the resume content
            const printContent = resumeElement.cloneNode(true) as HTMLElement;

            // Apply specific print styles to the cloned content
            printContent.style.width = '210mm';
            printContent.style.height = '297mm';
            printContent.style.maxHeight = '297mm';
            printContent.style.margin = '0 auto';
            printContent.style.boxShadow = 'none';
            printContent.style.border = 'none';
            printContent.style.borderRadius = '0';
            printContent.style.position = 'relative';
            printContent.style.overflow = 'hidden';
            printContent.style.pageBreakInside = 'avoid';
            printContent.style.breakInside = 'avoid';

            // Fix title font weight
            const nameTitle = printContent.querySelector('h1');
            if (nameTitle) {
                nameTitle.style.fontWeight = '800';
            }

            // Adjust education section to prevent overflow
            const educationSection = printContent.querySelectorAll('.mb-8');
            educationSection.forEach(section => {
                (section as HTMLElement).style.marginBottom = '1.5rem';
            });

            const educationItems = printContent.querySelectorAll('.mb-5');
            educationItems.forEach(item => {
                (item as HTMLElement).style.marginBottom = '1rem';
            });

            // Fix column layout issue - explicitly force the layout in the cloned content
            const resumeBody = printContent.querySelector('[data-id="resume-body"]') as HTMLElement;
            if (resumeBody) {
                resumeBody.style.display = 'flex';
                resumeBody.style.flexDirection = 'row';
                resumeBody.style.gap = '2rem';

                const mainColumn = resumeBody.querySelector('[data-id="resume-main-column"]') as HTMLElement;
                if (mainColumn) {
                    mainColumn.style.flex = '1 1 auto';
                    mainColumn.style.maxHeight = '297mm';
                    mainColumn.style.overflow = 'hidden';
                }

                const sideColumn = resumeBody.querySelector('[data-id="resume-side-column"]') as HTMLElement;
                if (sideColumn) {
                    sideColumn.style.width = '40%';
                    sideColumn.style.flexShrink = '0';
                    sideColumn.style.maxHeight = '297mm';
                    sideColumn.style.overflow = 'hidden';
                }
            }

            // Add the content to the iframe
            const container = frameDoc.querySelector('.print-container');
            if (container) {
                container.appendChild(printContent);

                // Additional style fixes for the print container
                const containerStyle = container as HTMLElement;
                containerStyle.style.width = '210mm';
                containerStyle.style.height = '297mm';
                containerStyle.style.margin = '0 auto';
                containerStyle.style.overflow = 'hidden';
                containerStyle.style.position = 'relative';
            }

            // Add a small inline script to ensure layout is fixed after render
            const fixScript = frameDoc.createElement('script');
            fixScript.innerHTML = `
                document.addEventListener('DOMContentLoaded', function() {
                    // Force the column layout
                    const resumeBody = document.querySelector('[data-id="resume-body"]');
                    if (resumeBody) {
                        resumeBody.style.display = 'flex';
                        resumeBody.style.flexDirection = 'row';
                        
                        const mainColumn = document.querySelector('[data-id="resume-main-column"]');
                        if (mainColumn) {
                            mainColumn.style.maxHeight = '297mm';
                            mainColumn.style.overflow = 'hidden';
                        }
                        
                        const sideColumn = document.querySelector('[data-id="resume-side-column"]');
                        if (sideColumn) {
                            sideColumn.style.width = '40%';
                            sideColumn.style.maxHeight = '297mm';
                            sideColumn.style.overflow = 'hidden';
                        }
                    }
                    
                    // Fix font weights
                    const nameTitle = document.querySelector('h1');
                    if (nameTitle) {
                        nameTitle.style.fontWeight = '800';
                    }
                    
                    // Fix education section spacing
                    const educationSection = document.querySelectorAll('.mb-8');
                    educationSection.forEach(section => {
                        section.style.marginBottom = '1.5rem';
                    });
                    
                    const educationItems = document.querySelectorAll('.mb-5');
                    educationItems.forEach(item => {
                        item.style.marginBottom = '1rem';
                    });
                });
            `;
            frameDoc.body.appendChild(fixScript);

            // Adjust sections to prevent overflow
            const workItems = printContent.querySelectorAll('[data-section="work-experience"] > div');
            workItems.forEach(item => {
                (item as HTMLElement).style.marginBottom = '0.75rem';
            });

            const descriptions = printContent.querySelectorAll('p');
            descriptions.forEach(desc => {
                (desc as HTMLElement).style.lineHeight = '1.4';
                (desc as HTMLElement).style.maxHeight = 'none';
                (desc as HTMLElement).style.overflow = 'hidden';
            });

            // Fix spacing for all margin elements
            const marginElements = printContent.querySelectorAll('.mb-8, .mb-5, .mb-3');
            marginElements.forEach(el => {
                const element = el as HTMLElement;
                if (element.classList.contains('mb-8')) {
                    element.style.marginBottom = '1rem';
                } else if (element.classList.contains('mb-5')) {
                    element.style.marginBottom = '0.75rem';
                } else if (element.classList.contains('mb-3')) {
                    element.style.marginBottom = '0.5rem';
                }
            });

            // Add a small font-size reduction for better fit
            const contentElement = printContent.querySelector('.resume-content');
            if (contentElement) {
                (contentElement as HTMLElement).style.fontSize = '0.95em';
            }

            // Trigger print after a delay to ensure content is loaded and rendered
            setTimeout(() => {
                try {
                    // Final check to ensure layout is correct
                    const resumeBody = frameDoc.querySelector('[data-id="resume-body"]') as HTMLElement;
                    if (resumeBody) {
                        resumeBody.style.display = 'flex';
                        resumeBody.style.flexDirection = 'row';

                        const mainColumn = frameDoc.querySelector('[data-id="resume-main-column"]') as HTMLElement;
                        if (mainColumn) {
                            mainColumn.style.maxHeight = '297mm';
                            mainColumn.style.overflow = 'hidden';
                        }

                        const sideColumn = frameDoc.querySelector('[data-id="resume-side-column"]') as HTMLElement;
                        if (sideColumn) {
                            sideColumn.style.width = '40%';
                            sideColumn.style.maxHeight = '297mm';
                            sideColumn.style.overflow = 'hidden';
                        }
                    }

                    // Fix font weights one more time
                    const nameTitle = frameDoc.querySelector('h1');
                    if (nameTitle) {
                        (nameTitle as HTMLElement).style.fontWeight = '800';
                    }

                    // Fix education section spacing one more time
                    const educationSection = frameDoc.querySelectorAll('.mb-8');
                    educationSection.forEach(section => {
                        (section as HTMLElement).style.marginBottom = '1.5rem';
                    });

                    const educationItems = frameDoc.querySelectorAll('.mb-5');
                    educationItems.forEach(item => {
                        (item as HTMLElement).style.marginBottom = '1rem';
                    });

                    printFrame.contentWindow?.focus();
                    printFrame.contentWindow?.print();
                } catch (e) {
                    console.error('Print failed:', e);
                }

                // Remove the frame after printing is done
                setTimeout(() => {
                    document.body.removeChild(printFrame);
                }, 1000);
            }, 1000);
        };

        // Set iframe source to trigger load event
        printFrame.src = 'about:blank';
    }, [resumeData.personalInfo.name]);

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