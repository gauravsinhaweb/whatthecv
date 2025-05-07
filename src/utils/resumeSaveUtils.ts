import { ResumeData, ResumeCustomizationOptions } from '../types/resume';

export const saveAsJson = (
    data: any,
    filename: string
) => {
    const dataJSON = JSON.stringify(data, null, 2);
    const blob = new Blob([dataJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const saveResumeData = (resumeData: ResumeData) => {
    const filename = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_resume.json`;
    saveAsJson(resumeData, filename);
};

export const saveCompleteResumeData = (
    resumeData: ResumeData,
    customizationOptions: ResumeCustomizationOptions
) => {
    const completeData = { resumeData, customizationOptions };
    const filename = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_complete_resume.json`;
    saveAsJson(completeData, filename);
};

export const saveResumeDraft = (
    resumeData: ResumeData,
    customizationOptions: ResumeCustomizationOptions
) => {
    const completeData = {
        resumeData,
        customizationOptions,
        savedAt: new Date().toISOString(),
        isDraft: true,
    };
    localStorage.setItem('resumeDraft', JSON.stringify(completeData));
    return completeData;
}; 