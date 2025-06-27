import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ResumeData, initialResumeData, ResumeCustomizationOptions, defaultCustomizationOptions } from '../types/resume';
import { saveDraft } from '../utils/api';
import { EnhancedResumeData } from '../utils/types';

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

interface UIState {
    activeSection: string;
    expandedSections: Record<string, boolean>;
    previewScale: number;
    fieldVisibility: Record<string, boolean>;
    isEnhancing: boolean;
    enhancementStage: 'extracting' | 'enhancing' | 'finalizing' | 'error';
}

interface SaveState {
    isSavingDraft: boolean;
    isAutoSaving: boolean;
    lastSavedTime: Date | null;
    lastSavedDraftId: string | null;
}

interface ResumeStore {
    // Documents
    documents: Document[];
    selectedDocument: Document | null;

    // Resume data
    resumeData: ResumeData;
    enhancedResumeData: EnhancedResumeData | null;

    // Customization
    customizationOptions: ResumeCustomizationOptions;

    // UI state
    ui: UIState;

    // Save state
    save: SaveState;

    // Document actions
    setDocuments: (documents: Document[]) => void;
    setSelectedDocument: (document: Document | null) => void;
    addDocument: (document: Document) => void;
    updateDocument: (id: string, document: Partial<Document>) => void;
    deleteDocument: (id: string) => void;

    // Resume data actions
    setResumeData: (data: ResumeData) => void;
    setEnhancedResumeData: (data: EnhancedResumeData | null) => void;
    updatePersonalInfo: (field: string, value: string) => void;
    updateWorkExperience: (id: string, field: string, value: string | boolean) => void;
    updateEducation: (id: string, field: string, value: string) => void;
    updateProject: (id: string, field: string, value: string) => void;
    updateAchievement: (id: string, field: string, value: string) => void;
    updatePublication: (id: string, field: string, value: string) => void;
    updateCertification: (id: string, field: string, value: string) => void;

    // Add/Remove items
    addWorkExperience: () => void;
    addEducation: () => void;
    addProject: () => void;
    addAchievement: () => void;
    addPublication: () => void;
    addCertification: () => void;
    removeWorkExperience: (id: string) => void;
    removeEducation: (id: string) => void;
    removeProject: (id: string) => void;
    removeAchievement: (id: string) => void;
    removePublication: (id: string) => void;
    removeCertification: (id: string) => void;

    // Skills management
    addSkillCategory: (name: string) => void;
    removeSkillCategory: (id: string) => void;
    addSkillToCategory: (categoryId: string, skill: string) => void;
    removeSkillFromCategory: (categoryId: string, skill: string) => void;
    updateSkillCategoryName: (id: string, name: string) => void;

    // Customization actions
    setCustomizationOptions: (options: ResumeCustomizationOptions) => void;

    // UI actions
    setActiveSection: (section: string) => void;
    setExpandedSections: (sections: Record<string, boolean>) => void;
    toggleSection: (section: string) => void;
    editSection: (section: string) => void;
    setPreviewScale: (scale: number) => void;
    handleZoomIn: () => void;
    handleZoomOut: () => void;
    setFieldVisibility: (visibility: Record<string, boolean>) => void;
    toggleFieldVisibility: (fieldKey: string) => void;

    // Enhancement actions
    setIsEnhancing: (isEnhancing: boolean) => void;
    setEnhancementStage: (stage: 'extracting' | 'enhancing' | 'finalizing' | 'error') => void;

    // Save actions
    setSavingState: (state: Partial<SaveState>) => void;
    setLastSavedTime: (time: Date | null) => void;

    // Reset
    resetStore: () => void;
}

// Initial UI state
const initialUIState: UIState = {
    activeSection: 'personalInfo',
    expandedSections: {
        personalInfo: true,
        workExperience: false,
        education: false,
        skills: false,
        projects: false,
        achievements: false,
        publications: false,
        certifications: false,
    },
    previewScale: 0.67,
    fieldVisibility: {
        'personalInfo.phone': true,
        'personalInfo.location': true,
        'personalInfo.socialLinks': true,
        'personalInfo.summary': true,
        'workExperience.experienceLink': true,
        'workExperience.location': true,
        'workExperience.startMonth': true,
        'workExperience.startYear': true,
        'workExperience.endMonth': true,
        'workExperience.endYear': true,
        'workExperience.description': true,
        'education.institutionLink': true,
        'education.location': true,
        'education.startMonth': true,
        'education.startYear': true,
        'education.endMonth': true,
        'education.endYear': true,
        'education.description': true,
        'skills.format': true,
        'projects.link': true,
        'projects.technologies': true,
        'projects.startMonth': true,
        'projects.startYear': true,
        'projects.endMonth': true,
        'projects.endYear': true,
        'achievements.organization': true,
        'achievements.description': true,
        'achievements.link': true,
        'achievements.month': true,
        'achievements.year': true,
        'publications.authors': true,
        'publications.journal': true,
        'publications.doi': true,
        'publications.link': true,
        'publications.description': true,
        'publications.month': true,
        'publications.year': true,
        'certifications.issuer': true,
        'certifications.credentialId': true,
        'certifications.link': true,
        'certifications.description': true,
        'certifications.month': true,
        'certifications.year': true,
        'certifications.expiryMonth': true,
        'certifications.expiryYear': true,
    },
    isEnhancing: false,
    enhancementStage: 'extracting',
};

// Initial save state
const initialSaveState: SaveState = {
    isSavingDraft: false,
    isAutoSaving: false,
    lastSavedTime: null,
    lastSavedDraftId: null,
};

export const useResumeStore = create<ResumeStore>()(
    subscribeWithSelector(
        persist(
            (set, get) => ({
                // Initial state
                documents: [],
                selectedDocument: null,
                resumeData: initialResumeData,
                enhancedResumeData: null,
                customizationOptions: defaultCustomizationOptions,
                ui: initialUIState,
                save: initialSaveState,

                // Document actions
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

                // Resume data actions
                setResumeData: (data) => {
                    const currentState = get();
                    if (data?.personalInfo?.name === 'Alex Johnson' &&
                        data?.personalInfo?.email === 'alex.johnson@example.com' &&
                        currentState.enhancedResumeData &&
                        currentState.selectedDocument) {
                        return;
                    }
                    set({ resumeData: data });
                },
                setEnhancedResumeData: (data) => set({ enhancedResumeData: data }),

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

                updateAchievement: (id, field, value) => set((state) => ({
                    resumeData: {
                        ...state.resumeData,
                        achievements: state.resumeData.achievements.map((item) =>
                            item.id === id ? { ...item, [field]: value } : item
                        ),
                    },
                })),

                updatePublication: (id, field, value) => set((state) => ({
                    resumeData: {
                        ...state.resumeData,
                        publications: state.resumeData.publications.map((item) =>
                            item.id === id ? { ...item, [field]: value } : item
                        ),
                    },
                })),

                updateCertification: (id, field, value) => set((state) => ({
                    resumeData: {
                        ...state.resumeData,
                        certifications: state.resumeData.certifications.map((item) =>
                            item.id === id ? { ...item, [field]: value } : item
                        ),
                    },
                })),

                // Add/Remove items
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
                                    startMonth: '',
                                    startYear: '',
                                    endMonth: '',
                                    endYear: '',
                                    current: false,
                                    showStartMonth: true,
                                    showEndMonth: true,
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
                                    startMonth: '',
                                    startYear: '',
                                    endMonth: '',
                                    endYear: '',
                                    current: false,
                                    showStartMonth: true,
                                    showEndMonth: true,
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
                                    startMonth: '',
                                    startYear: '',
                                    endMonth: '',
                                    endYear: '',
                                    current: false,
                                    showStartMonth: true,
                                    showEndMonth: true,
                                },
                            ],
                        },
                    };
                }),

                addAchievement: () => set((state) => {
                    const newId = String(state.resumeData.achievements.length + 1);
                    return {
                        resumeData: {
                            ...state.resumeData,
                            achievements: [
                                ...state.resumeData.achievements,
                                {
                                    id: newId,
                                    title: '',
                                    description: '',
                                    month: '',
                                    year: '',
                                    current: false,
                                    showMonth: true,
                                    organization: '',
                                    link: '',
                                    showOrganization: true,
                                    showDescription: true,
                                    showLink: true,
                                },
                            ],
                        },
                    };
                }),

                addPublication: () => set((state) => {
                    const newId = String(state.resumeData.publications.length + 1);
                    return {
                        resumeData: {
                            ...state.resumeData,
                            publications: [
                                ...state.resumeData.publications,
                                {
                                    id: newId,
                                    title: '',
                                    authors: '',
                                    journal: '',
                                    month: '',
                                    year: '',
                                    current: false,
                                    showMonth: true,
                                    doi: '',
                                    link: '',
                                    description: '',
                                    showAuthors: true,
                                    showJournal: true,
                                    showDoi: true,
                                    showLink: true,
                                    showDescription: true,
                                },
                            ],
                        },
                    };
                }),

                addCertification: () => set((state) => {
                    const newId = String(state.resumeData.certifications.length + 1);
                    return {
                        resumeData: {
                            ...state.resumeData,
                            certifications: [
                                ...state.resumeData.certifications,
                                {
                                    id: newId,
                                    name: '',
                                    issuer: '',
                                    month: '',
                                    year: '',
                                    current: false,
                                    showMonth: true,
                                    expiryMonth: '',
                                    expiryYear: '',
                                    showExpiryMonth: true,
                                    credentialId: '',
                                    link: '',
                                    description: '',
                                    showIssuer: true,
                                    showCredentialId: true,
                                    showLink: true,
                                    showDescription: true,
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

                removeAchievement: (id) => set((state) => ({
                    resumeData: {
                        ...state.resumeData,
                        achievements: state.resumeData.achievements.filter((item) => item.id !== id),
                    },
                })),

                removePublication: (id) => set((state) => ({
                    resumeData: {
                        ...state.resumeData,
                        publications: state.resumeData.publications.filter((item) => item.id !== id),
                    },
                })),

                removeCertification: (id) => set((state) => ({
                    resumeData: {
                        ...state.resumeData,
                        certifications: state.resumeData.certifications.filter((item) => item.id !== id),
                    },
                })),

                // Skills management
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

                // Customization actions
                setCustomizationOptions: (options) => set({ customizationOptions: options }),

                // UI actions
                setActiveSection: (section) => set((state) => ({
                    ui: { ...state.ui, activeSection: section }
                })),

                setExpandedSections: (sections) => set((state) => ({
                    ui: { ...state.ui, expandedSections: sections }
                })),

                toggleSection: (section) => set((state) => {
                    const newExpandedSections = {
                        ...state.ui.expandedSections,
                        [section]: !state.ui.expandedSections[section]
                    };
                    return {
                        ui: {
                            ...state.ui,
                            expandedSections: newExpandedSections,
                            activeSection: !state.ui.expandedSections[section] ? section : state.ui.activeSection
                        }
                    };
                }),

                editSection: (section) => set((state) => ({
                    ui: {
                        ...state.ui,
                        activeSection: section,
                        expandedSections: {
                            ...state.ui.expandedSections,
                            [section]: true
                        }
                    }
                })),

                setPreviewScale: (scale) => set((state) => ({
                    ui: { ...state.ui, previewScale: scale }
                })),

                handleZoomIn: () => set((state) => ({
                    ui: {
                        ...state.ui,
                        previewScale: Math.min(state.ui.previewScale + 10, 150)
                    }
                })),

                handleZoomOut: () => set((state) => ({
                    ui: {
                        ...state.ui,
                        previewScale: Math.max(state.ui.previewScale - 10, 50)
                    }
                })),

                setFieldVisibility: (visibility) => set((state) => ({
                    ui: { ...state.ui, fieldVisibility: visibility }
                })),

                toggleFieldVisibility: (fieldKey) => set((state) => ({
                    ui: {
                        ...state.ui,
                        fieldVisibility: {
                            ...state.ui.fieldVisibility,
                            [fieldKey]: !state.ui.fieldVisibility[fieldKey]
                        }
                    }
                })),

                // Enhancement actions
                setIsEnhancing: (isEnhancing) => set((state) => ({
                    ui: { ...state.ui, isEnhancing }
                })),

                setEnhancementStage: (stage) => set((state) => ({
                    ui: { ...state.ui, enhancementStage: stage }
                })),

                // Save actions
                setSavingState: (state) => set((currentState) => ({
                    save: { ...currentState.save, ...state }
                })),

                setLastSavedTime: (time) => set((state) => ({
                    save: { ...state.save, lastSavedTime: time }
                })),

                // Reset
                resetStore: () => set({
                    documents: [],
                    selectedDocument: null,
                    enhancedResumeData: null,
                    resumeData: {
                        ...initialResumeData,
                        skills: (initialResumeData.skills as any[]).map((cat) => ({
                            id: cat.id,
                            name: cat.name,
                            skills: [...cat.skills]
                        }))
                    },
                    customizationOptions: defaultCustomizationOptions,
                    ui: initialUIState,
                    save: initialSaveState,
                }),
            }),
            {
                name: 'resume-store',
                storage: createJSONStorage(() => localStorage),
                partialize: (state) => ({
                    documents: state.documents,
                    selectedDocument: state.selectedDocument,
                    resumeData: state.resumeData,
                    enhancedResumeData: state.enhancedResumeData,
                    customizationOptions: state.customizationOptions,
                    ui: {
                        ...state.ui,
                        isEnhancing: false, // Don't persist enhancement state
                        enhancementStage: 'extracting',
                    },
                    save: {
                        ...state.save,
                        isSavingDraft: false, // Don't persist saving state
                        isAutoSaving: false,
                    },
                }),
            }
        )
    )
); 