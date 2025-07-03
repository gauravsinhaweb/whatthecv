import { useCallback, useEffect, useRef } from 'react'
import { useResumeStore } from '../store/resumeStore'
import { useSaveResume, useDeleteResume, useResumeVersions } from './queries/useResumeQueries'
import { useTokenActions } from './useTokenActions'
import { useStorageAndActionInfo } from './queries/useStorageQueries'
import { useTokens } from './useTokens'
import { toast } from 'react-hot-toast'
import { EnhancedResumeData } from '../utils/types'

export const useResumeState = () => {
    const {
        // Store state
        resumeData,
        enhancedResumeData,
        selectedDocument,
        customizationOptions,
        ui,
        save,

        // Store actions
        setResumeData,
        setEnhancedResumeData,
        setSelectedDocument,
        setCustomizationOptions,
        setSavingState,
        setLastSavedTime,
        resetStore,

        // Resume data actions
        updatePersonalInfo,
        updateWorkExperience,
        updateEducation,
        updateProject,
        updateAchievement,
        updatePublication,
        updateCertification,

        // Add/Remove actions
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

        // Skills actions
        addSkillCategory,
        removeSkillCategory,
        addSkillToCategory,
        removeSkillFromCategory,
        updateSkillCategoryName,

        // UI actions
        setActiveSection,
        setExpandedSections,
        toggleSection,
        editSection,
        setPreviewScale,
        handleZoomIn,
        handleZoomOut,
        setFieldVisibility,
        toggleFieldVisibility,

        // Enhancement actions
        setIsEnhancing,
        setEnhancementStage,
        setShouldShowSaveModal,
    } = useResumeStore()

    // React Query hooks
    const saveResumeMutation = useSaveResume()
    const deleteResumeMutation = useDeleteResume()
    const { data: resumeVersions, isLoading: isLoadingVersions } = useResumeVersions()

    // Token and storage hooks
    const { getAmount, hasSufficientTokens, executeAction } = useTokenActions()
    const { storageInfo, actionInfo } = useStorageAndActionInfo()
    const { tokenBalance } = useTokens()

    // Auto-save refs
    const autoSaveTimeoutRef = useRef<NodeJS.Timeout>()
    const lastSaveDataRef = useRef<string>('')

    // Check if data has changed for auto-save
    const hasDataChanged = useCallback(() => {
        const currentData = JSON.stringify({ resumeData, customizationOptions })
        return currentData !== lastSaveDataRef.current
    }, [resumeData, customizationOptions])

    // Auto-save function
    const autoSave = useCallback(async () => {
        if (!hasDataChanged() || !selectedDocument?.title || save.isAutoSaving) {
            console.log('Auto-save skipped:', {
                hasDataChanged: hasDataChanged(),
                hasTitle: !!selectedDocument?.title,
                isAutoSaving: save.isAutoSaving
            });
            return
        }

        console.log('Auto-save triggered for resume:', selectedDocument.title);
        try {
            setSavingState({ isAutoSaving: true })

            const enhancedData: EnhancedResumeData = {
                personalInfo: {
                    ...resumeData.personalInfo,
                    summary: resumeData.personalInfo.summary || '',
                    profilePicture: resumeData.personalInfo.profilePicture || null,
                    socialLinks: resumeData.personalInfo.socialLinks?.map(link => ({
                        ...link,
                        platform: link.platform === 'peerlist' ? 'other' : link.platform
                    })) as EnhancedResumeData['personalInfo']['socialLinks']
                },
                workExperience: resumeData.workExperience,
                education: resumeData.education,
                skills: resumeData.skills,
                projects: resumeData.projects,
                achievements: resumeData.achievements,
                publications: resumeData.publications,
                certifications: resumeData.certifications
            }

            await saveResumeMutation.mutateAsync({
                resumeData: enhancedData,
                title: selectedDocument.title,
                customizationOptions,
                resumeId: selectedDocument.id,
            })

            setLastSavedTime(new Date())
            lastSaveDataRef.current = JSON.stringify({ resumeData, customizationOptions })
            console.log('Auto-save completed successfully');

        } catch (error) {
            console.error('Auto-save failed:', error)
            // Don't show toast for auto-save failures to avoid spam
            // But handle specific errors that require state cleanup
            const errorMessage = error instanceof Error ? error.message : '';
            if (errorMessage.includes('Resume version not found') || errorMessage.includes('404')) {
                // Clear the selected document since it doesn't exist
                setSelectedDocument(null);
            }
        } finally {
            setSavingState({ isAutoSaving: false })
        }
    }, [
        hasDataChanged,
        selectedDocument,
        save.isAutoSaving,
        resumeData,
        customizationOptions,
        saveResumeMutation,
        setSavingState,
        setLastSavedTime,
    ])

    // Setup auto-save effect
    useEffect(() => {
        if (selectedDocument?.title && hasDataChanged()) {
            console.log('Setting up auto-save timeout for:', selectedDocument.title);
            // Clear existing timeout
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current)
            }

            // Set new timeout for auto-save
            autoSaveTimeoutRef.current = setTimeout(autoSave, 5000) // 5 second delay
        }

        return () => {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current)
            }
        }
    }, [resumeData, customizationOptions, selectedDocument, autoSave, hasDataChanged])

    // Manual save function
    const saveResume = useCallback(async (title?: string, resumeId?: string) => {
        if (!title && !selectedDocument?.title) {
            toast.error('Please provide a title for the resume')
            return
        }

        try {
            setSavingState({ isSavingDraft: true })

            const enhancedData: EnhancedResumeData = {
                personalInfo: {
                    ...resumeData.personalInfo,
                    summary: resumeData.personalInfo.summary || '',
                    profilePicture: resumeData.personalInfo.profilePicture || null,
                    socialLinks: resumeData.personalInfo.socialLinks?.map(link => ({
                        ...link,
                        platform: link.platform === 'peerlist' ? 'other' : link.platform
                    })) as EnhancedResumeData['personalInfo']['socialLinks']
                },
                workExperience: resumeData.workExperience,
                education: resumeData.education,
                skills: resumeData.skills,
                projects: resumeData.projects,
                achievements: resumeData.achievements,
                publications: resumeData.publications,
                certifications: resumeData.certifications
            }

            const response = await saveResumeMutation.mutateAsync({
                resumeData: enhancedData,
                title: title || selectedDocument?.title || 'Untitled Resume',
                customizationOptions,
                resumeId: resumeId || selectedDocument?.id,
            })

            setLastSavedTime(new Date())
            lastSaveDataRef.current = JSON.stringify({ resumeData, customizationOptions })

            return response
        } catch (error) {
            console.error('Save failed:', error)
            // Handle specific errors that require state cleanup
            const errorMessage = error instanceof Error ? error.message : '';
            if (errorMessage.includes('Resume version not found') || errorMessage.includes('404')) {
                // Clear the selected document since it doesn't exist
                setSelectedDocument(null);
            }
            throw error
        } finally {
            setSavingState({ isSavingDraft: false })
        }
    }, [
        selectedDocument,
        resumeData,
        customizationOptions,
        saveResumeMutation,
        setSavingState,
        setLastSavedTime,
    ])

    // Delete resume function
    const deleteResume = useCallback(async (id: string) => {
        try {
            await deleteResumeMutation.mutateAsync(id)

            // If deleting the currently selected document, clear selection
            if (selectedDocument?.id === id) {
                setSelectedDocument(null)
            }
        } catch (error) {
            console.error('Delete failed:', error)
            throw error
        }
    }, [deleteResumeMutation, selectedDocument, setSelectedDocument])

    // Load resume function
    const loadResume = useCallback((resume: any) => {
        setResumeData(resume.resume_data)
        setCustomizationOptions(resume.customization_options || {})
        setSelectedDocument({
            id: resume.id,
            title: resume.title,
            createdAt: resume.created_at,
            updatedAt: resume.updated_at,
            template: 'default',
            type: 'resume',
            resumeData: resume.resume_data,
            customizationOptions: resume.customization_options || {},
        })
        setLastSavedTime(new Date(resume.updated_at))
        lastSaveDataRef.current = JSON.stringify({
            resumeData: resume.resume_data,
            customizationOptions: resume.customization_options || {}
        })
    }, [setResumeData, setCustomizationOptions, setSelectedDocument, setLastSavedTime])

    // Check if user can save (has sufficient tokens and storage)
    const canSave = useCallback(() => {
        if (!storageInfo?.can_create_new && !selectedDocument) {
            return { canSave: false, reason: 'Storage limit reached' }
        }

        const tokenAmount = getAmount('resume_storage_space')
        if (!hasSufficientTokens('resume_storage_space', tokenBalance)) {
            return { canSave: false, reason: 'Insufficient tokens', required: tokenAmount }
        }

        return { canSave: true }
    }, [storageInfo, selectedDocument, getAmount, hasSufficientTokens, tokenBalance])

    return {
        // State
        resumeData,
        enhancedResumeData,
        selectedDocument,
        customizationOptions,
        ui,
        save,
        resumeVersions,
        isLoadingVersions,
        storageInfo,
        actionInfo,

        // Actions
        setResumeData,
        setEnhancedResumeData,
        setSelectedDocument,
        setCustomizationOptions,
        resetStore,

        // Resume data actions
        updatePersonalInfo,
        updateWorkExperience,
        updateEducation,
        updateProject,
        updateAchievement,
        updatePublication,
        updateCertification,

        // Add/Remove actions
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

        // Skills actions
        addSkillCategory,
        removeSkillCategory,
        addSkillToCategory,
        removeSkillFromCategory,
        updateSkillCategoryName,

        // UI actions
        setActiveSection,
        setExpandedSections,
        toggleSection,
        editSection,
        setPreviewScale,
        handleZoomIn,
        handleZoomOut,
        setFieldVisibility,
        toggleFieldVisibility,

        // Enhancement actions
        setIsEnhancing,
        setEnhancementStage,
        setShouldShowSaveModal,

        // Save/Delete actions
        saveResume,
        deleteResume,
        loadResume,
        canSave,

        // Mutations
        saveResumeMutation,
        deleteResumeMutation,
    }
} 