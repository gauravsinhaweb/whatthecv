import { ResumeData, ResumeCustomizationOptions } from '../types/resume';
import ResumePreview from '../components/create-resume/ResumePreview';
import React from 'react';

export const setupPrintHandlers = () => {
    globalThis?.addEventListener('beforeprint', () => {
        globalThis.document.title = `Resume_Builder_${Date.now()}`;
    });

    globalThis?.addEventListener('afterprint', () => {
        globalThis.document.title = 'Single Page Resume Builder';
    });
};

export const getEditorProps = (
    resumeData: ResumeData,
    activeSection: string,
    expandedSections: Record<string, boolean>,
    handlers: any
) => {
    return {
        resumeData,
        activeSection,
        expandedSections,
        onPersonalInfoChange: handlers.handlePersonalInfoChange,
        onWorkExperienceChange: handlers.handleWorkExperienceChange,
        onEducationChange: handlers.handleEducationChange,
        onProjectChange: handlers.handleProjectChange,
        onSkillChange: {
            addSkill: handlers.addSkill,
            removeSkill: handlers.removeSkill,
            setSkillInput: handlers.setSkillInput,
            skillInput: handlers.skillInput,
        },
        onSectionToggle: handlers.toggleSection,
        onSectionEdit: handlers.editSection,
        onAdd: {
            addWorkExperience: handlers.addWorkExperience,
            addEducation: handlers.addEducation,
            addProject: handlers.addProject,
        },
        onRemove: {
            removeWorkExperience: handlers.removeWorkExperience,
            removeEducation: handlers.removeEducation,
            removeProject: handlers.removeProject,
        },
        onSkillInputKeyDown: handlers.handleSkillInputKeyDown,
    };
};

export const renderPreviewContainer = (
    resumeData: ResumeData,
    customizationOptions: ResumeCustomizationOptions,
    previewScale: number,
    setIsFullScreenPreview: (isFullScreen: boolean) => void
) => {
    return React.createElement(
        'div',
        {
            className: "transform origin-top transition-transform duration-200 ease-in-out print-container",
            onClick: () => setIsFullScreenPreview(true),
            style: {
                transform: `scale(${previewScale / 100})`,
                maxWidth: '210mm',
                minHeight: '297mm',
                aspectRatio: '1 / 1.414',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }
        },
        React.createElement(ResumePreview, {
            resumeData,
            customizationOptions,
            previewScale
        })
    );
}; 