import { useState, useCallback, useEffect } from 'react';
import { ResumeData, ResumeCustomizationOptions, defaultCustomizationOptions, initialResumeData } from '../types/resume';

export const useResumeState = () => {
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
    const [customizationOptions, setCustomizationOptions] = useState<ResumeCustomizationOptions>(defaultCustomizationOptions);
    const [previewScale, setPreviewScale] = useState(70);

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

    return {
        resumeData,
        skillInput,
        activeSection,
        expandedSections,
        customizationOptions,
        previewScale,
        handlers: {
            setResumeData,
            setSkillInput,
            setActiveSection,
            setExpandedSections,
            setCustomizationOptions,
            setPreviewScale,
            handleZoomIn,
            handleZoomOut,
            handlePersonalInfoChange,
            handleWorkExperienceChange,
            handleEducationChange,
            handleProjectChange,
            addWorkExperience,
            addEducation,
            addProject,
            removeWorkExperience,
            removeEducation,
            removeProject,
            addSkill,
            removeSkill,
            handleSkillInputKeyDown,
            saveResume,
            saveResumeWithOptions,
            saveAsDraft,
            toggleSection,
            editSection,
        }
    };
}; 