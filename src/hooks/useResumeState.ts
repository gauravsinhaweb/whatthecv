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
        updateAchievement,
        updatePublication,
        updateCertification,
        addWorkExperience,
        addEducation,
        addProject,
        addAchievement,
        addPublication,
        addCertification,
        removeWorkExperience,
        removeEducation,
        removeProject,
        removeAchievement,
        removePublication,
        removeCertification,
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

        // Field visibility
        fieldVisibility,
        toggleFieldVisibility,

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
                // Only auto-save existing resumes with a title (not new ones)
                const isExistingResume = selectedDocument?.title;

                if (isExistingResume) {
                    console.log('Triggering auto-save for existing resume with title:', selectedDocument.title);
                    await autoSaveDraft();
                } else {
                    console.log('Auto-save skipped: This is a new resume that needs manual save first');
                }
            } catch (error) {
                console.error('Auto-save failed:', error);
            }
        }, 2000);
    }, [autoSaveDraft, selectedDocument]);

    // Auto-format bullet points when editing descriptions
    useEffect(() => {
        const formattedData = formatAllDescriptions(resumeData);
        if (JSON.stringify(formattedData) !== JSON.stringify(resumeData)) {
            setResumeData(formattedData);
        }
    }, [resumeData, setResumeData]);

    // Trigger auto-save when resume data changes (but only for existing resumes with titles)
    useEffect(() => {
        // Only trigger auto-save for existing resumes with titles
        const isExistingResume = selectedDocument?.title;

        if (isExistingResume && resumeData && Object.keys(resumeData).length > 0) {
            console.log('Resume data changed, triggering auto-save...');
            triggerAutoSave();
        }

        return () => {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, [resumeData, triggerAutoSave, selectedDocument]);

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

    const handleAchievementChange = useCallback((id: string, field: string, value: string) => {
        // Apply formatting to description fields
        if (field === 'description') {
            value = formatBulletPoints(value);
        }
        updateAchievement(id, field, value);
    }, [updateAchievement]);

    const handlePublicationChange = useCallback((id: string, field: string, value: string) => {
        // Apply formatting to description fields
        if (field === 'description') {
            value = formatBulletPoints(value);
        }
        updatePublication(id, field, value);
    }, [updatePublication]);

    const handleCertificationChange = useCallback((id: string, field: string, value: string) => {
        // Apply formatting to description fields
        if (field === 'description') {
            value = formatBulletPoints(value);
        }
        updateCertification(id, field, value);
    }, [updateCertification]);

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
            skills: formattedData.skills, // Preserve structured format
            projects: formattedData.projects,
            achievements: formattedData.achievements,
            publications: formattedData.publications,
            certifications: formattedData.certifications
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
        fieldVisibility,
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
            handleAchievementChange,
            handlePublicationChange,
            handleCertificationChange,
            addWorkExperience,
            addEducation,
            addProject,
            addAchievement,
            addPublication,
            addCertification,
            removeWorkExperience,
            removeEducation,
            removeProject,
            removeAchievement,
            removePublication,
            removeCertification,
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
            toggleFieldVisibility,
        }
    };
}; 