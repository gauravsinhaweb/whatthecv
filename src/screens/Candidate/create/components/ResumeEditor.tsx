import { Award, BookOpen, Briefcase, Code, Plus, User } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import Button from '../../../../components/ui/Button';
import { ResumeCustomizationOptions, ResumeData } from '../../../../types/resume';
import CustomSections from './CustomSections';
import EducationSection from './EducationSection';
import PersonalInfoSection from './PersonalInfoSection';
import ProjectsSection from './ProjectsSection';
import SkillsSection from './SkillsSection';
import WorkExperienceSection from './WorkExperienceSection';

const styles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}
`;

interface ResumeEditorProps {
    resumeData: ResumeData;
    activeSection: string;
    expandedSections: Record<string, boolean>;
    onPersonalInfoChange: (field: string, value: string) => void;
    onWorkExperienceChange: (id: string, field: string, value: string | boolean) => void;
    onEducationChange: (id: string, field: string, value: string) => void;
    onProjectChange: (id: string, field: string, value: string) => void;
    onSkillChange: {
        addSkill: () => void;
        removeSkill: (skill: string) => void;
        setSkillInput: (value: string) => void;
        skillInput: string;
    };
    onSectionToggle: (section: string) => void;
    onSectionEdit: (section: string) => void;
    onAdd: {
        addWorkExperience: () => void;
        addEducation: () => void;
        addProject: () => void;
    };
    onRemove: {
        removeWorkExperience: (id: string) => void;
        removeEducation: (id: string) => void;
        removeProject: (id: string) => void;
    };
    onSkillInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    customizationOptions?: ResumeCustomizationOptions;
    onCustomizationChange?: (options: ResumeCustomizationOptions) => void;
}

const ResumeEditor: React.FC<ResumeEditorProps> = ({
    resumeData,
    activeSection,
    expandedSections,
    onPersonalInfoChange,
    onWorkExperienceChange,
    onEducationChange,
    onProjectChange,
    onSkillChange,
    onSectionToggle,
    onSectionEdit,
    onAdd,
    onRemove,
    onSkillInputKeyDown,
    customizationOptions,
    onCustomizationChange,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showProfileUploader, setShowProfileUploader] = useState(false);
    const [socialLinkErrors, setSocialLinkErrors] = useState<{ url?: string; label?: string }[]>([]);
    const [socialLinkTouched, setSocialLinkTouched] = useState<{ url?: boolean; label?: boolean }[]>([]);

    const hasValidProfilePic = resumeData.personalInfo.profilePicture &&
        resumeData.personalInfo.profilePicture.startsWith('data:image');

    // Update showProfileUploader when customization options change
    useEffect(() => {
        if (customizationOptions?.header.showPhoto && !showProfileUploader && !hasValidProfilePic) {
            setShowProfileUploader(true);
            setTimeout(() => {
                if (fileInputRef.current) {
                    fileInputRef.current.click();
                }
            }, 100);
        }
    }, [customizationOptions?.header.showPhoto, showProfileUploader, hasValidProfilePic]);

    // Helper to validate URL
    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    // Platform-specific URL validation
    const validatePlatformUrl = (platform: string, url: string) => {
        if (!url) return false;

        // First check if the URL contains any other platform's domain
        const domainChecks = {
            linkedin: /linkedin\.com/i,
            peerlist: /peerlist\.io/i,
            github: /github\.com/i,
            twitter: /(?:twitter\.com|x\.com)/i,
            leetcode: /leetcode\.com/i,
            medium: /medium\.com/i,
            stackoverflow: /stackoverflow\.com/i
        };

        // Check if URL contains any other platform's domain
        for (const [otherPlatform, pattern] of Object.entries(domainChecks)) {
            if (otherPlatform !== platform && pattern.test(url)) {
                return false;
            }
        }

        const patterns = {
            linkedin: /^https?:\/\/(?:www\.)?linkedin\.com\/in\/[\w\-]+(?:\/)?$/i,
            peerlist: /^https?:\/\/(?:www\.)?peerlist\.io\/[\w\-]+(?:\/)?$/i,
            github: /^https?:\/\/(?:www\.)?github\.com\/[\w\-]+(?:\/)?$/i,
            twitter: /^https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/[\w\-]+(?:\/)?$/i,
            leetcode: /^https?:\/\/(?:www\.)?leetcode\.com\/u\/[\w\-]+(?:\/)?$/i,
            medium: /^https?:\/\/(?:www\.)?medium\.com\/@[\w\-]+(?:\/)?$/i,
            stackoverflow: /^https?:\/\/(?:www\.)?stackoverflow\.com\/users\/[\w\-]+(?:\/)?$/i
        };

        // Then validate against the correct platform pattern
        const pattern = patterns[platform as keyof typeof patterns];
        return pattern ? pattern.test(url) : isValidUrl(url);
    };

    // Validate all social links on change
    useEffect(() => {
        const errors = (resumeData.personalInfo.socialLinks || []).map((link) => {
            const error: { url?: string; label?: string } = {};
            if (!link.url || !validatePlatformUrl(link.platform, link.url)) {
                switch (link.platform) {
                    case 'linkedin':
                        error.url = 'Enter a valid LinkedIn URL (e.g., https://linkedin.com/in/username)';
                        break;
                    case 'peerlist':
                        error.url = 'Enter a valid Peerlist URL (e.g., https://peerlist.io/username)';
                        break;
                    case 'github':
                        error.url = 'Enter a valid GitHub URL (e.g., https://github.com/username)';
                        break;
                    case 'twitter':
                        error.url = 'Enter a valid Twitter/X URL (e.g., https://twitter.com/username)';
                        break;
                    case 'leetcode':
                        error.url = 'Enter a valid LeetCode URL (e.g., https://leetcode.com/u/username)';
                        break;
                    case 'medium':
                        error.url = 'Enter a valid Medium URL (e.g., https://medium.com/@username)';
                        break;
                    case 'stackoverflow':
                        error.url = 'Enter a valid Stack Overflow URL (e.g., https://stackoverflow.com/users/username)';
                        break;
                    default:
                        error.url = 'Enter a valid URL (https://...)';
                }
            }
            if (link.platform === 'other' && (!link.label || !link.label.trim())) {
                error.label = 'Label required for Other';
            }
            return error;
        });
        setSocialLinkErrors(errors);
    }, [resumeData.personalInfo.socialLinks]);

    // Update touched state array if number of links changes
    useEffect(() => {
        setSocialLinkTouched((prev) => {
            const links = resumeData.personalInfo.socialLinks || [];
            if (prev.length === links.length) return prev;
            return links.map((_, i) => prev[i] || {});
        });
    }, [resumeData.personalInfo.socialLinks]);

    return (
        <div className="bg-white rounded-lg shadow-md border border-slate-200">
            <style>{styles}</style>
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
                <h2 className="text-xl font-bold text-blue-800">Content</h2>
            </div>
            <div className="divide-y divide-slate-200">
                <div className="border-b border-slate-200">
                    <div
                        className={`flex justify-between items-center p-4 cursor-pointer transition-all duration-200 ${expandedSections.personalInfo && activeSection === 'personalInfo'
                            ? 'bg-gradient-to-r from-blue-50 to-white shadow-sm rounded-t-md'
                            : 'hover:bg-slate-50/80'
                            }`}
                        onClick={() => onSectionToggle('personalInfo')}
                    >
                        <div className="flex items-center">
                            <User className="w-5 h-5 mr-3 text-indigo-600" />
                            <span className="font-medium text-indigo-900 text-base">
                                {customizationOptions?.layout?.sectionTitles?.personalInfo || 'Personal Info'}
                            </span>
                        </div>
                    </div>
                    {expandedSections.personalInfo && activeSection === 'personalInfo' && (
                        <div className="p-6 bg-white border-t border-slate-100 animate-fadeIn">
                            <PersonalInfoSection
                                resumeData={resumeData}
                                customizationOptions={customizationOptions}
                                onPersonalInfoChange={onPersonalInfoChange}
                                showProfileUploader={showProfileUploader}
                                setShowProfileUploader={setShowProfileUploader}
                                fileInputRef={fileInputRef}
                                socialLinkErrors={socialLinkErrors}
                                socialLinkTouched={socialLinkTouched}
                                setSocialLinkTouched={setSocialLinkTouched}
                                onCustomizationChange={onCustomizationChange}
                            />
                        </div>
                    )}
                </div>
                <div className="border-b border-slate-200">
                    <div
                        className={`flex justify-between items-center p-4 cursor-pointer transition-all duration-200 ${expandedSections.workExperience && activeSection === 'workExperience'
                            ? 'bg-gradient-to-r from-indigo-50 to-white shadow-sm rounded-t-md'
                            : 'hover:bg-slate-50/80'
                            }`}
                        onClick={() => onSectionToggle('workExperience')}
                    >
                        <div className="flex items-center">
                            <Briefcase className="w-5 h-5 mr-3 text-indigo-600" />
                            <span className="font-medium text-indigo-900 text-base">
                                {customizationOptions?.layout?.sectionTitles?.workExperience || 'Work Experience'}
                            </span>
                        </div>
                    </div>
                    {expandedSections.workExperience && activeSection === 'workExperience' && (
                        <div className="p-6 bg-white border-t border-slate-100 animate-fadeIn">
                            <WorkExperienceSection
                                resumeData={resumeData}
                                onWorkExperienceChange={onWorkExperienceChange}
                                onRemove={onRemove}
                                onAdd={onAdd}
                            />
                        </div>
                    )}
                </div>
                <div className="border-b border-slate-200">
                    <div
                        className={`flex justify-between items-center p-4 cursor-pointer transition-all duration-200 ${expandedSections.education && activeSection === 'education'
                            ? 'bg-gradient-to-r from-emerald-50 to-white shadow-sm rounded-t-md'
                            : 'hover:bg-slate-50/80'
                            }`}
                        onClick={() => onSectionToggle('education')}
                    >
                        <div className="flex items-center">
                            <BookOpen className="w-5 h-5 mr-3 text-emerald-600" />
                            <span className="font-medium text-emerald-900 text-base">
                                {customizationOptions?.layout?.sectionTitles?.education || 'Education'}
                            </span>
                        </div>
                    </div>
                    {expandedSections.education && activeSection === 'education' && (
                        <div className="p-6 bg-white border-t border-slate-100 animate-fadeIn">
                            <EducationSection
                                resumeData={resumeData}
                                onEducationChange={onEducationChange}
                                onRemove={onRemove}
                                onAdd={onAdd}
                            />
                        </div>
                    )}
                </div>
                <div className="border-b border-slate-200">
                    <div
                        className={`flex justify-between items-center p-4 cursor-pointer transition-all duration-200 ${expandedSections.skills && activeSection === 'skills'
                            ? 'bg-gradient-to-r from-amber-50 to-white shadow-sm rounded-t-md'
                            : 'hover:bg-slate-50/80'
                            }`}
                        onClick={() => onSectionToggle('skills')}
                    >
                        <div className="flex items-center">
                            <Code className="w-5 h-5 mr-3 text-amber-600" />
                            <span className="font-medium text-amber-900 text-base">
                                {customizationOptions?.layout?.sectionTitles?.skills || 'Skills'}
                            </span>
                        </div>
                    </div>
                    {expandedSections.skills && activeSection === 'skills' && (
                        <div className="p-6 bg-white border-t border-slate-100 animate-fadeIn">
                            <SkillsSection
                                resumeData={resumeData}
                                onSkillChange={onSkillChange}
                                onSkillInputKeyDown={onSkillInputKeyDown}
                            />
                        </div>
                    )}
                </div>
                <div className="border-b border-slate-200">
                    <div
                        className={`flex justify-between items-center p-4 cursor-pointer transition-all duration-200 ${expandedSections.projects && activeSection === 'projects'
                            ? 'bg-gradient-to-r from-purple-50 to-white shadow-sm rounded-t-md'
                            : 'hover:bg-slate-50/80'
                            }`}
                        onClick={() => onSectionToggle('projects')}
                    >
                        <div className="flex items-center">
                            <Award className="w-5 h-5 mr-3 text-purple-600" />
                            <span className="font-medium text-purple-900 text-base">
                                {customizationOptions?.layout?.sectionTitles?.projects || 'Projects'}
                            </span>
                        </div>
                    </div>
                    {expandedSections.projects && activeSection === 'projects' && (
                        <div className="p-6 bg-white border-t border-slate-100 animate-fadeIn">
                            <ProjectsSection
                                resumeData={resumeData}
                                onProjectChange={onProjectChange}
                                onRemove={onRemove}
                                onAdd={onAdd}
                            />
                        </div>
                    )}
                </div>
                <CustomSections
                    customizationOptions={customizationOptions}
                    expandedSections={expandedSections}
                    activeSection={activeSection}
                    onSectionToggle={onSectionToggle}
                    onCustomizationChange={onCustomizationChange}
                />
                <div className="p-4 flex justify-center">
                    <Button
                        variant="outline"
                        onClick={() => {
                            if (onCustomizationChange && customizationOptions) {
                                const title = prompt('Enter section title:');
                                if (title) {
                                    const newSection = {
                                        id: `custom_${Date.now()}`,
                                        title,
                                        content: ''
                                    };
                                    const updatedVisibleSections = {
                                        ...customizationOptions.layout.visibleSections,
                                        [newSection.id]: true
                                    };
                                    onCustomizationChange({
                                        ...customizationOptions,
                                        customSections: [...(customizationOptions.customSections || []), newSection],
                                        layout: {
                                            ...customizationOptions.layout,
                                            visibleSections: updatedVisibleSections
                                        }
                                    });
                                    if (onSectionToggle) {
                                        onSectionToggle(newSection.id);
                                    }
                                }
                            }
                        }}
                        className="hover:bg-blue-50 text-blue-700 border-blue-300"
                        leftIcon={<Plus className="h-4 w-4" />}
                    >
                        Add Custom Section
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ResumeEditor; 