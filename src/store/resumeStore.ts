import { create } from 'zustand';
import type { EnhancedResumeData } from '../utils/types';
import { ResumeData, initialResumeData, ResumeCustomizationOptions, defaultCustomizationOptions } from '../types/resume';

interface ResumeStore {
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
    addSkill: (skill: string) => void;
    removeSkill: (skill: string) => void;

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
}

export const useResumeStore = create<ResumeStore>((set) => ({
    // Initial resume data
    resumeData: initialResumeData,
    setResumeData: (data) => set({ resumeData: data }),

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

    addSkill: (skill) => set((state) => {
        // Extract the first word only
        const firstWord = skill.trim().split(/\s+/)[0];

        // Enforce max 16 skills limit
        if (state.resumeData.skills.length >= 16) {
            return state;
        }

        // Only add if it's not empty and not already in the skills list
        if (firstWord && !state.resumeData.skills.includes(firstWord)) {
            return {
                resumeData: {
                    ...state.resumeData,
                    skills: [...state.resumeData.skills, firstWord],
                }
            };
        }
        return state;
    }),

    removeSkill: (skill) => set((state) => ({
        resumeData: {
            ...state.resumeData,
            skills: state.resumeData.skills.filter((s) => s !== skill),
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
    setEnhancementStage: (enhancementStage) => set({ enhancementStage }),

    // UI state previously in useResumeState
    activeSection: 'personalInfo',
    setActiveSection: (activeSection) => set({ activeSection }),

    expandedSections: {
        personalInfo: true,
        workExperience: false,
        education: false,
        skills: false,
        projects: false,
    },
    setExpandedSections: (expandedSections) => set({ expandedSections }),

    toggleSection: (section) => set((state) => {
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

    editSection: (section) => set((state) => ({
        activeSection: section,
        expandedSections: {
            ...state.expandedSections,
            [section]: true
        }
    })),

    previewScale: 70,
    setPreviewScale: (previewScale) => set({ previewScale }),

    handleZoomIn: () => set((state) => ({
        previewScale: Math.min(state.previewScale + 10, 150)
    })),

    handleZoomOut: () => set((state) => ({
        previewScale: Math.max(state.previewScale - 10, 50)
    })),
})); 