import { ResumeData } from '../types/resume';

/**
 * Ensures that bullet points are always on new lines in text
 * It converts any bullet point pattern that doesn't start on a new line to start on a new line
 * and ensures proper spacing between bullet points
 */
export const formatBulletPoints = (text: string): string => {
    if (!text) return '';

    // First, normalize all line breaks to \n
    let formattedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // Replace any bullet point with a newline and bullet point
    formattedText = formattedText.replace(/[•\*]/g, '\n•');

    // Remove any double newlines
    formattedText = formattedText.replace(/\n\n+/g, '\n');

    // Remove leading/trailing whitespace and newlines
    formattedText = formattedText.trim();

    return formattedText;
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