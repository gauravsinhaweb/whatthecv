import { useState, useCallback, useEffect } from 'react';
import { useResumeStore } from '../store/resumeStore';
import { saveResumeData, saveCompleteResumeData, saveResumeDraft } from '../utils/resumeSaveUtils';
import { formatBulletPoints, formatAllDescriptions } from '../utils/resumeFormatUtils';

export const useResumeState = () => {
    const {
        // Resume data
        resumeData,
        setResumeData,
        updatePersonalInfo,
        updateWorkExperience,
        updateEducation,
        updateProject,
        addWorkExperience,
        addEducation,
        addProject,
        removeWorkExperience,
        removeEducation,
        removeProject,
        addSkill,
        removeSkill,

        // UI state
        activeSection,
        expandedSections,
        previewScale,
        setActiveSection,
        setExpandedSections,
        toggleSection,
        editSection,
        setPreviewScale,
        handleZoomIn,
        handleZoomOut,

        // Customization
        customizationOptions,
        setCustomizationOptions,
    } = useResumeStore();

    // Local state for skill input (keep this in component level as it's purely UI input state)
    const [skillInput, setSkillInput] = useState('');

    // Auto-format bullet points when editing descriptions
    useEffect(() => {
        const formattedData = formatAllDescriptions(resumeData);
        if (JSON.stringify(formattedData) !== JSON.stringify(resumeData)) {
            setResumeData(formattedData);
        }
    }, [resumeData, setResumeData]);

    const handleSkillInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill(skillInput);
            setSkillInput('');
        }
    }, [addSkill, skillInput]);

    const handlePersonalInfoChange = useCallback((field: string, value: string) => {
        updatePersonalInfo(field, value);
    }, [updatePersonalInfo]);

    const handleWorkExperienceChange = useCallback((id: string, field: string, value: string | boolean) => {
        // Apply formatting to description fields
        if (field === 'description' && typeof value === 'string') {
            value = formatBulletPoints(value);
        }
        updateWorkExperience(id, field, value);
    }, [updateWorkExperience]);

    const handleEducationChange = useCallback((id: string, field: string, value: string) => {
        // Apply formatting to description fields
        if (field === 'description') {
            value = formatBulletPoints(value);
        }
        updateEducation(id, field, value);
    }, [updateEducation]);

    const handleProjectChange = useCallback((id: string, field: string, value: string) => {
        // Apply formatting to description fields
        if (field === 'description') {
            value = formatBulletPoints(value);
        }
        updateProject(id, field, value);
    }, [updateProject]);

    const handleAddSkill = useCallback(() => {
        if (skillInput.trim()) {
            addSkill(skillInput);
            setSkillInput('');
        }
    }, [skillInput, addSkill]);

    const saveResume = useCallback(() => {
        // Format all descriptions before saving
        const formattedData = formatAllDescriptions(resumeData);
        saveResumeData(formattedData);
    }, [resumeData]);

    const saveResumeWithOptions = useCallback(() => {
        // Format all descriptions before saving
        const formattedData = formatAllDescriptions(resumeData);
        saveCompleteResumeData(formattedData, customizationOptions);
    }, [resumeData, customizationOptions]);

    const handleSaveAsDraft = useCallback(() => {
        // Format all descriptions before saving
        const formattedData = formatAllDescriptions(resumeData);
        saveResumeDraft(formattedData, customizationOptions);
        alert('Resume saved as draft');
    }, [resumeData, customizationOptions]);

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
            addSkill: handleAddSkill,
            removeSkill,
            handleSkillInputKeyDown,
            saveResume,
            saveResumeWithOptions,
            saveAsDraft: handleSaveAsDraft,
            toggleSection,
            editSection,
        }
    };
}; 