import { ResumeData } from '../types/resume';

/**
 * Ensures that bullet points are always on new lines in text
 * It converts any bullet point pattern that doesn't start on a new line to start on a new line
 */
export const formatBulletPoints = (text: string): string => {
    if (!text) return '';

    // Replace bullet points that don't start on a new line with properly formatted ones
    // This regex looks for bullet symbols (•, -, *, etc.) that don't have a preceding newline
    const formattedText = text.replace(/([^\n])([•\-\*])/g, '$1\n$2');

    // Also ensure that if the text starts with a bullet, it has proper spacing
    return formattedText.replace(/^([•\-\*])/g, '$1');
};

/**
 * Apply formatting to all description fields in the resume data
 */
export const formatAllDescriptions = (resumeData: ResumeData): ResumeData => {
    const updatedData = { ...resumeData };

    // Format work experience descriptions
    updatedData.workExperience = updatedData.workExperience.map(job => ({
        ...job,
        description: formatBulletPoints(job.description)
    }));

    // Format education descriptions
    updatedData.education = updatedData.education.map(edu => ({
        ...edu,
        description: formatBulletPoints(edu.description)
    }));

    // Format project descriptions
    updatedData.projects = updatedData.projects.map(project => ({
        ...project,
        description: formatBulletPoints(project.description)
    }));

    return updatedData;
};

/**
 * Validates if a summary meets the requirements for a good resume summary
 */
export const isValidSummary = (summary: string): boolean => {
    if (!summary) return false;

    // Check if summary is between 30 and 500 characters
    const length = summary.length;
    return length >= 30 && length <= 500;
};

/**
 * Returns skills validation information
 */
export const getSkillsValidation = (skills: string[]): {
    isValid: boolean;
    message: string;
} => {
    if (skills.length === 0) {
        return {
            isValid: false,
            message: 'Please add at least one skill'
        };
    }

    if (skills.length > 16) {
        return {
            isValid: false,
            message: 'Maximum 16 skills allowed'
        };
    }

    return {
        isValid: true,
        message: 'Skills are valid'
    };
}; 