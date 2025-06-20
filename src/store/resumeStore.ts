import { create } from 'zustand';
import type { EnhancedResumeData } from '../utils/types';
import { ResumeData, initialResumeData, ResumeCustomizationOptions, defaultCustomizationOptions } from '../types/resume';
import { saveDraft } from '../utils/api';

interface Document {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    template: string;
    type: 'resume' | 'coverLetter';
    resumeData: ResumeData;
    customizationOptions: ResumeCustomizationOptions;
}

interface ResumeStore {
    documents: Document[];
    selectedDocument: Document | null;
    setDocuments: (documents: Document[]) => void;
    setSelectedDocument: (document: Document | null) => void;
    addDocument: (document: Document) => void;
    updateDocument: (id: string, document: Partial<Document>) => void;
    deleteDocument: (id: string) => void;

    // Resume data
    resumeData: ResumeData;
    setResumeData: (data: ResumeData) => void;
    updatePersonalInfo: (field: string, value: string) => void;
    updateWorkExperience: (id: string, field: string, value: string | boolean) => void;
    updateEducation: (id: string, field: string, value: string) => void;
    updateProject: (id: string, field: string, value: string) => void;
    addWorkExperience: () => void;
    addEducation: () => void;
    addProject: () => void;
    removeWorkExperience: (id: string) => void;
    removeEducation: (id: string) => void;
    removeProject: (id: string) => void;

    // Enhanced resume data
    enhancedResumeData: EnhancedResumeData | null;
    setEnhancedResumeData: (data: EnhancedResumeData | null) => void;

    // Customization options
    customizationOptions: ResumeCustomizationOptions;
    setCustomizationOptions: (options: ResumeCustomizationOptions) => void;

    // UI state
    isEnhancing: boolean;
    setIsEnhancing: (isEnhancing: boolean) => void;
    enhancementStage: 'extracting' | 'enhancing' | 'finalizing' | 'error';
    setEnhancementStage: (stage: 'extracting' | 'enhancing' | 'finalizing' | 'error') => void;

    // UI state previously in useResumeState
    activeSection: string;
    setActiveSection: (section: string) => void;
    expandedSections: Record<string, boolean>;
    setExpandedSections: (sections: Record<string, boolean>) => void;
    toggleSection: (section: string) => void;
    editSection: (section: string) => void;
    previewScale: number;
    setPreviewScale: (scale: number) => void;
    handleZoomIn: () => void;
    handleZoomOut: () => void;

    // Draft saving state
    isSavingDraft: boolean;
    lastSavedDraftId: string | null;
    saveAsDraft: (title?: string) => Promise<void>;

    // Auto-save state
    isAutoSaving: boolean;
    lastSavedTime: Date | null;
    autoSaveDraft: () => Promise<void>;
    setLastSavedTime: (time: Date | null) => void;

    resetStore: () => void;

    addSkillCategory: (name: string) => void;
    removeSkillCategory: (id: string) => void;
    addSkillToCategory: (categoryId: string, skill: string) => void;
    removeSkillFromCategory: (categoryId: string, skill: string) => void;
    updateSkillCategoryName: (id: string, name: string) => void;
}

export const useResumeStore = create<ResumeStore>((set, get) => ({
    documents: [],
    selectedDocument: null,
    setDocuments: (documents) => set({ documents }),
    setSelectedDocument: (document) => set({ selectedDocument: document }),
    addDocument: (document) => set((state) => ({ documents: [...state.documents, document] })),
    updateDocument: (id, document) =>
        set((state) => ({
            documents: state.documents.map((d) => (d.id === id ? { ...d, ...document } : d)),
        })),
    deleteDocument: (id) =>
        set((state) => ({
            documents: state.documents.filter((d) => d.id !== id),
        })),

    // Initial resume data
    resumeData: initialResumeData,
    setResumeData: (data) => {
        // Prevent setting default "Alex Johnson" data if we have enhanced data
        const currentState = get();
        if (data?.personalInfo?.name === 'Alex Johnson' &&
            data?.personalInfo?.email === 'alex.johnson@example.com' &&
            currentState.enhancedResumeData) {
            console.log('Preventing resume data reset to default values - enhanced data exists');
            return;
        }
        set({ resumeData: data });
    },

    updatePersonalInfo: (field, value) => set((state) => ({
        resumeData: {
            ...state.resumeData,
            personalInfo: {
                ...state.resumeData.personalInfo,
                [field]: value,
            },
        },
    })),

    updateWorkExperience: (id, field, value) => set((state) => ({
        resumeData: {
            ...state.resumeData,
            workExperience: state.resumeData.workExperience.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            ),
        },
    })),

    updateEducation: (id, field, value) => set((state) => ({
        resumeData: {
            ...state.resumeData,
            education: state.resumeData.education.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            ),
        },
    })),

    updateProject: (id, field, value) => set((state) => ({
        resumeData: {
            ...state.resumeData,
            projects: state.resumeData.projects.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            ),
        },
    })),

    addWorkExperience: () => set((state) => {
        const newId = String(state.resumeData.workExperience.length + 1);
        return {
            resumeData: {
                ...state.resumeData,
                workExperience: [
                    ...state.resumeData.workExperience,
                    {
                        id: newId,
                        position: '',
                        company: '',
                        location: '',
                        startDate: '',
                        endDate: '',
                        current: false,
                        description: '',
                        experienceLink: '',
                    },
                ],
            },
        };
    }),

    addEducation: () => set((state) => {
        const newId = String(state.resumeData.education.length + 1);
        return {
            resumeData: {
                ...state.resumeData,
                education: [
                    ...state.resumeData.education,
                    {
                        id: newId,
                        degree: '',
                        institution: '',
                        location: '',
                        startDate: '',
                        endDate: '',
                        description: '',
                        degreeLink: '',
                        institutionLink: '',
                    },
                ],
            },
        };
    }),

    addProject: () => set((state) => {
        const newId = String(state.resumeData.projects.length + 1);
        return {
            resumeData: {
                ...state.resumeData,
                projects: [
                    ...state.resumeData.projects,
                    {
                        id: newId,
                        name: '',
                        description: '',
                        technologies: '',
                        link: '',
                    },
                ],
            },
        };
    }),

    removeWorkExperience: (id) => set((state) => ({
        resumeData: {
            ...state.resumeData,
            workExperience: state.resumeData.workExperience.filter((item) => item.id !== id),
        },
    })),

    removeEducation: (id) => set((state) => ({
        resumeData: {
            ...state.resumeData,
            education: state.resumeData.education.filter((item) => item.id !== id),
        },
    })),

    removeProject: (id) => set((state) => ({
        resumeData: {
            ...state.resumeData,
            projects: state.resumeData.projects.filter((item) => item.id !== id),
        },
    })),

    // Enhanced resume data
    enhancedResumeData: null,
    setEnhancedResumeData: (data) => set({ enhancedResumeData: data }),

    // Customization options
    customizationOptions: defaultCustomizationOptions,
    setCustomizationOptions: (options) => set({ customizationOptions: options }),

    // UI state for enhancement process
    isEnhancing: false,
    setIsEnhancing: (isEnhancing) => set({ isEnhancing }),
    enhancementStage: 'extracting',
    setEnhancementStage: (stage: 'extracting' | 'enhancing' | 'finalizing' | 'error') => set({ enhancementStage: stage }),

    // UI state previously in useResumeState
    activeSection: 'personalInfo',
    setActiveSection: (section: string) => set({ activeSection: section }),

    expandedSections: {
        personalInfo: true,
        workExperience: false,
        education: false,
        skills: false,
        projects: false,
    },
    setExpandedSections: (sections: Record<string, boolean>) => set({ expandedSections: sections }),

    toggleSection: (section: string) => set((state) => {
        const newExpandedSections = {
            ...state.expandedSections,
            [section]: !state.expandedSections[section]
        };

        // Set active section if expanding
        return {
            expandedSections: newExpandedSections,
            activeSection: !state.expandedSections[section] ? section : state.activeSection
        };
    }),

    editSection: (section: string) => set((state) => ({
        activeSection: section,
        expandedSections: {
            ...state.expandedSections,
            [section]: true
        }
    })),

    previewScale: 0.67,
    setPreviewScale: (scale: number) => set({ previewScale: scale }),

    handleZoomIn: () => set((state) => ({
        previewScale: Math.min(state.previewScale + 10, 150)
    })),

    handleZoomOut: () => set((state) => ({
        previewScale: Math.max(state.previewScale - 10, 50)
    })),

    // Draft saving state
    isSavingDraft: false,
    lastSavedDraftId: null,
    saveAsDraft: async (title?: string) => {
        const { resumeData, selectedDocument } = get();
        set({ isSavingDraft: true });
        try {
            // Convert ResumeData to EnhancedResumeData format
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
                skills: resumeData.skills.flatMap(category => category.skills),
                projects: resumeData.projects
            };

            // Use provided title or generate a default one
            const resumeTitle = title || `Draft ${new Date().toLocaleString()}`;

            const response = await saveDraft(enhancedData, resumeTitle, get().customizationOptions, selectedDocument?.id);
            set({ lastSavedDraftId: response.id });
        } catch (error) {
            console.error('Error saving draft:', error);
            throw error;
        } finally {
            set({ isSavingDraft: false });
        }
    },

    // Auto-save state
    isAutoSaving: false,
    lastSavedTime: null,
    autoSaveDraft: async () => {
        const { resumeData, selectedDocument, lastSavedDraftId } = get();
        set({ isAutoSaving: true });
        try {
            // Convert ResumeData to EnhancedResumeData format
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
                skills: resumeData.skills.flatMap(category => category.skills),
                projects: resumeData.projects
            };

            // Use existing document ID for auto-save (update existing resume)
            const documentId = selectedDocument?.id || lastSavedDraftId;

            // Use existing title or create a simple auto-save title
            const resumeTitle = selectedDocument?.title || `Auto-saved ${new Date().toLocaleString()}`;

            const response = await saveDraft(enhancedData, resumeTitle, get().customizationOptions, documentId);
            set({ lastSavedDraftId: response.id, lastSavedTime: new Date() });
        } catch (error) {
            console.error('Error auto-saving draft:', error);
            throw error;
        } finally {
            set({ isAutoSaving: false });
        }
    },

    setLastSavedTime: (time: Date | null) => set({ lastSavedTime: time }),

    resetStore: () => set({
        documents: [],
        selectedDocument: null,
        resumeData: {
            ...initialResumeData,
            skills: (initialResumeData.skills as any[]).map((cat) => ({
                id: cat.id,
                name: cat.name,
                skills: [...cat.skills]
            }))
        },
        enhancedResumeData: null,
        customizationOptions: defaultCustomizationOptions,
        isEnhancing: false,
        enhancementStage: 'extracting',
        activeSection: 'personalInfo',
        expandedSections: {
            personalInfo: true,
            workExperience: false,
            education: false,
            skills: false,
            projects: false,
        },
        previewScale: 70,
        isSavingDraft: false,
        lastSavedDraftId: null,
        isAutoSaving: false,
        lastSavedTime: null
    }),

    addSkillCategory: (name) => set((state) => {
        const newId = (Date.now() + Math.random()).toString();
        return {
            resumeData: {
                ...state.resumeData,
                skills: [
                    ...state.resumeData.skills,
                    { id: newId, name, skills: [] }
                ]
            }
        };
    }),

    removeSkillCategory: (id) => set((state) => ({
        resumeData: {
            ...state.resumeData,
            skills: state.resumeData.skills.filter((cat) => cat.id !== id)
        }
    })),

    addSkillToCategory: (categoryId, skill) => set((state) => ({
        resumeData: {
            ...state.resumeData,
            skills: state.resumeData.skills.map((cat) =>
                cat.id === categoryId && !cat.skills.includes(skill)
                    ? { ...cat, skills: [...cat.skills, skill] }
                    : cat
            )
        }
    })),

    removeSkillFromCategory: (categoryId, skill) => set((state) => ({
        resumeData: {
            ...state.resumeData,
            skills: state.resumeData.skills.map((cat) =>
                cat.id === categoryId
                    ? { ...cat, skills: cat.skills.filter((s) => s !== skill) }
                    : cat
            )
        }
    })),

    updateSkillCategoryName: (id, name) => set((state) => ({
        resumeData: {
            ...state.resumeData,
            skills: state.resumeData.skills.map((cat) =>
                cat.id === id ? { ...cat, name } : cat
            )
        }
    })),
})); 