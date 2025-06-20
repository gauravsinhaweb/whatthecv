import { ResumeData, ResumeCustomizationOptions } from '../types/resume';
import ResumePreview from '../screens/Candidate/create/components/ResumePreview';
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
        onSkillCategoryChange: {
            addCategory: handlers.addSkillCategory,
            removeCategory: handlers.removeSkillCategory,
            addSkill: handlers.addSkillToCategory,
            removeSkill: handlers.removeSkillFromCategory,
            renameCategory: handlers.updateSkillCategoryName,
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
    };
};

export const renderPreviewContainer = (
    resumeData: ResumeData,
    customizationOptions: ResumeCustomizationOptions,
    previewScale: number,
    setIsFullScreenPreview: (isFullScreen: boolean) => void
) => {
    const customizationKey = JSON.stringify({
        ...customizationOptions,
        header: {
            nameSize: customizationOptions.header.nameSize,
            nameBold: customizationOptions.header.nameBold,
            jobTitleSize: customizationOptions.header.jobTitleSize,
            showPhoto: customizationOptions.header.showPhoto
        }
    });

    return React.createElement(
        'div',
        {
            className: "transform origin-top transition-transform duration-200 ease-in-out print-container preview-scale-container",
            onClick: () => setIsFullScreenPreview(true),
            style: {
                maxWidth: '210mm',
                minHeight: '297mm',
                aspectRatio: '1 / 1.414',
                transform: `scale(${previewScale})`,
                transformOrigin: 'top center',
                willChange: 'transform',
            }
        },
        React.createElement(ResumePreview, {
            key: customizationKey,
            resumeData,
            customizationOptions,
            previewScale
        })
    );
}; 