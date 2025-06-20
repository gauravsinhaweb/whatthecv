import { useState, useCallback, useEffect, useRef } from 'react';
import { useResumeStore } from '../store/resumeStore';
import { saveResumeData, saveCompleteResumeData } from '../utils/resumeSaveUtils';
import { formatBulletPoints, formatAllDescriptions } from '../utils/resumeFormatUtils';
import { ResumeCustomizationOptions } from '../types/resume';
import { saveDraft } from '../utils/api';

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
        addSkillCategory,
        removeSkillCategory,
        addSkillToCategory,
        removeSkillFromCategory,
        updateSkillCategoryName,

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

        // Auto-save state
        isAutoSaving,
        lastSavedTime,
        autoSaveDraft,
        setLastSavedTime,

        // Draft state
        selectedDocument,
        lastSavedDraftId,
    } = useResumeStore();

    // Local state for skill input (keep this in component level as it's purely UI input state)
    const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-save functionality
    const triggerAutoSave = useCallback(() => {
        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current);
        }

        autoSaveTimeoutRef.current = setTimeout(async () => {
            try {
                // Only auto-save existing resumes (not new ones)
                const isExistingResume = selectedDocument || lastSavedDraftId;

                if (isExistingResume) {
                    await autoSaveDraft();
                }
            } catch (error) {
                console.error('Auto-save failed:', error);
            }
        }, 2000);
    }, [autoSaveDraft, selectedDocument, lastSavedDraftId]);

    // Auto-format bullet points when editing descriptions
    useEffect(() => {
        const formattedData = formatAllDescriptions(resumeData);
        if (JSON.stringify(formattedData) !== JSON.stringify(resumeData)) {
            setResumeData(formattedData);
        }
    }, [resumeData, setResumeData]);

    // Trigger auto-save when resume data changes (but only for existing resumes)
    useEffect(() => {
        // Only trigger auto-save for existing resumes
        const isExistingResume = selectedDocument || lastSavedDraftId;

        if (isExistingResume && resumeData && Object.keys(resumeData).length > 0) {
            triggerAutoSave();
        }

        return () => {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, [resumeData, triggerAutoSave, selectedDocument, lastSavedDraftId]);

    const handlePersonalInfoChange = useCallback((field: string, value: string) => {
        // Handle socialLinks as a special case since it comes as a JSON string
        if (field === 'socialLinks') {
            try {
                const parsedLinks = JSON.parse(value);
                updatePersonalInfo(field, parsedLinks);
            } catch (error) {
                console.error('Error parsing social links:', error);
            }
        } else {
            updatePersonalInfo(field, value);
        }
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

        // Convert ResumeData to EnhancedResumeData format
        const enhancedData = {
            personalInfo: {
                ...formattedData.personalInfo,
                profilePicture: formattedData.personalInfo.profilePicture || null,
                socialLinks: formattedData.personalInfo.socialLinks?.map(link => ({
                    ...link,
                    platform: link.platform === 'peerlist' ? 'other' : link.platform
                })) || []
            },
            workExperience: formattedData.workExperience,
            education: formattedData.education,
            skills: formattedData.skills.flatMap(category => category.skills), // Convert SkillCategory[] to string[]
            projects: formattedData.projects
        };

        saveDraft(enhancedData, `Draft ${new Date().toLocaleString()}`, customizationOptions);
        alert('Resume saved as draft');
    }, [resumeData, customizationOptions]);

    // Update customization options with a fresh object reference to trigger re-renders
    const handleCustomizationChange = useCallback((newOptions: ResumeCustomizationOptions) => {
        // Create a completely new object to ensure reference changes
        setCustomizationOptions({ ...newOptions });
    }, [setCustomizationOptions]);

    return {
        resumeData,
        activeSection,
        expandedSections,
        customizationOptions,
        previewScale,
        isAutoSaving,
        lastSavedTime,
        handlers: {
            setResumeData,
            setActiveSection,
            setExpandedSections,
            setCustomizationOptions: handleCustomizationChange,
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
            addSkillCategory,
            removeSkillCategory,
            addSkillToCategory,
            removeSkillFromCategory,
            updateSkillCategoryName,
            saveResume,
            saveResumeWithOptions,
            saveAsDraft: handleSaveAsDraft,
            toggleSection,
            editSection,
        }
    };
}; 