import { Award, BookOpen, Briefcase, Code, Plus, User, Trophy, FileText, GraduationCap, Eye, EyeOff, Edit3 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import Button from '../../../../components/ui/Button';
import { useResumeStore } from '../../../../store/resumeStore';
import { ResumeCustomizationOptions, ResumeData } from '../../../../types/resume';
import AchievementsSection from './AchievementsSection';
import CertificationsSection from './CertificationsSection';
import CustomSections from './CustomSections';
import EducationSection from './EducationSection';
import PersonalInfoSection from './PersonalInfoSection';
import ProjectsSection from './ProjectsSection';
import PublicationsSection from './PublicationsSection';
import SkillsSection from './SkillsSection';
import WorkExperienceSection from './WorkExperienceSection';
import FieldVisibilityToggle from './FieldVisibilityToggle';

const styles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}
`;

interface SectionConfig {
    id: string;
    title: string;
    icon: React.ComponentType<any>;
    color: {
        bg: string;
        text: string;
        icon: string;
    };
    component: React.ComponentType<any>;
}

const sectionConfigs: SectionConfig[] = [
    {
        id: 'personalInfo',
        title: 'Personal Info',
        icon: User,
        color: { bg: 'from-blue-50 to-white', text: 'text-blue-800', icon: 'text-indigo-600' },
        component: PersonalInfoSection
    },
    {
        id: 'workExperience',
        title: 'Work Experience',
        icon: Briefcase,
        color: { bg: 'from-indigo-50 to-white', text: 'text-indigo-900', icon: 'text-indigo-600' },
        component: WorkExperienceSection
    },
    {
        id: 'education',
        title: 'Education',
        icon: BookOpen,
        color: { bg: 'from-emerald-50 to-white', text: 'text-emerald-900', icon: 'text-emerald-600' },
        component: EducationSection
    },
    {
        id: 'skills',
        title: 'Skills',
        icon: Code,
        color: { bg: 'from-amber-50 to-white', text: 'text-amber-900', icon: 'text-amber-600' },
        component: SkillsSection
    },
    {
        id: 'projects',
        title: 'Projects',
        icon: Award,
        color: { bg: 'from-purple-50 to-white', text: 'text-purple-900', icon: 'text-purple-600' },
        component: ProjectsSection
    },
    {
        id: 'achievements',
        title: 'Achievements',
        icon: Trophy,
        color: { bg: 'from-emerald-50 to-white', text: 'text-emerald-900', icon: 'text-emerald-600' },
        component: AchievementsSection
    },
    {
        id: 'publications',
        title: 'Publications',
        icon: FileText,
        color: { bg: 'from-blue-50 to-white', text: 'text-blue-900', icon: 'text-blue-600' },
        component: PublicationsSection
    },
    {
        id: 'certifications',
        title: 'Certifications',
        icon: GraduationCap,
        color: { bg: 'from-purple-50 to-white', text: 'text-purple-900', icon: 'text-purple-600' },
        component: CertificationsSection
    }
];

const ResumeEditor: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showProfileUploader, setShowProfileUploader] = useState(false);
    const [socialLinkErrors, setSocialLinkErrors] = useState<{ url?: string; label?: string }[]>([]);
    const [socialLinkTouched, setSocialLinkTouched] = useState<{ url?: boolean; label?: boolean }[]>([]);

    const {
        resumeData,
        activeSection,
        expandedSections,
        customizationOptions,
        fieldVisibility,
        toggleSection,
        updatePersonalInfo,
        updateWorkExperience,
        updateEducation,
        updateProject,
        updateAchievement,
        updatePublication,
        updateCertification,
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
        addSkillCategory,
        removeSkillCategory,
        addSkillToCategory,
        removeSkillFromCategory,
        updateSkillCategoryName,
        setCustomizationOptions,
        toggleFieldVisibility
    } = useResumeStore();

    const hasValidProfilePic = resumeData.personalInfo.profilePicture &&
        resumeData.personalInfo.profilePicture.startsWith('data:image');

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

    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const validatePlatformUrl = (platform: string, url: string) => {
        if (!url) return false;

        const domainChecks = {
            linkedin: /linkedin\.com/i,
            peerlist: /peerlist\.io/i,
            github: /github\.com/i,
            twitter: /(?:twitter\.com|x\.com)/i,
            leetcode: /leetcode\.com/i,
            medium: /medium\.com/i,
            stackoverflow: /stackoverflow\.com/i
        };

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

        const pattern = patterns[platform as keyof typeof patterns];
        return pattern ? pattern.test(url) : isValidUrl(url);
    };

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

    useEffect(() => {
        setSocialLinkTouched((prev) => {
            const links = resumeData.personalInfo.socialLinks || [];
            if (prev.length === links.length) return prev;
            return links.map((_, i) => prev[i] || {});
        });
    }, [resumeData.personalInfo.socialLinks]);

    const handleCustomizationChange = (options: ResumeCustomizationOptions) => {
        setCustomizationOptions(options);
    };

    const handlePersonalInfoChange = (field: string, value: string) => {
        if (field === 'socialLinks') {
            try {
                const parsedLinks = JSON.parse(value);
                updatePersonalInfo(field, parsedLinks);
            } catch (error) {
                console.error('Error parsing social links:', error);
            }
        } else {
            updatePersonalInfo(field, value);
        }
    };

    const renderSection = (config: SectionConfig) => {
        const isExpanded = expandedSections[config.id];
        const isActive = activeSection === config.id;
        const isVisible = customizationOptions?.layout?.visibleSections?.[config.id] !== false;
        const sectionTitle = customizationOptions?.layout?.sectionTitles?.[config.id] || config.title;

        const sectionProps = {
            resumeData,
            customizationOptions,
            fieldVisibility,
            toggleFieldVisibility,
            onAdd: {
                addWorkExperience,
                addEducation,
                addProject,
                addAchievement,
                addPublication,
                addCertification
            },
            onRemove: {
                removeWorkExperience,
                removeEducation,
                removeProject,
                removeAchievement,
                removePublication,
                removeCertification
            }
        };

        const specificProps = {
            personalInfo: {
                onPersonalInfoChange: handlePersonalInfoChange,
                showProfileUploader,
                setShowProfileUploader,
                fileInputRef,
                socialLinkErrors,
                socialLinkTouched,
                setSocialLinkTouched,
                onCustomizationChange: handleCustomizationChange
            },
            workExperience: {
                onWorkExperienceChange: updateWorkExperience
            },
            education: {
                onEducationChange: updateEducation
            },
            skills: {
                onSkillCategoryChange: {
                    addCategory: addSkillCategory,
                    removeCategory: removeSkillCategory,
                    addSkill: addSkillToCategory,
                    removeSkill: removeSkillFromCategory,
                    renameCategory: updateSkillCategoryName
                }
            },
            projects: {
                onProjectChange: updateProject
            },
            achievements: {
                onAchievementChange: updateAchievement,
                onAdd: addAchievement,
                onRemove: removeAchievement
            },
            publications: {
                onPublicationChange: updatePublication,
                onAdd: addPublication,
                onRemove: removePublication
            },
            certifications: {
                onCertificationChange: updateCertification,
                onAdd: addCertification,
                onRemove: removeCertification
            }
        };

        const Component = config.component;
        const props = { ...sectionProps, ...(specificProps[config.id as keyof typeof specificProps] || {}) };

        return (
            <div key={config.id} className="border-b border-slate-200">
                <div
                    className={`flex justify-between items-center p-4 cursor-pointer transition-all duration-200 ${isExpanded && isActive
                        ? `bg-gradient-to-r ${config.color.bg} shadow-sm rounded-t-md`
                        : 'hover:bg-slate-50/80'
                        }`}
                    onClick={() => toggleSection(config.id)}
                >
                    <div className="flex items-center">
                        <config.icon className={`w-5 h-5 mr-3 ${config.color.icon}`} />
                        <span className={`font-medium ${config.color.text} text-base`}>
                            {sectionTitle}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        {config.id !== 'personalInfo' && (
                            <>
                                <button
                                    className="p-1 text-slate-500 hover:text-slate-700 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const newTitle = prompt('Edit section title:', sectionTitle);
                                        if (newTitle && newTitle.trim() && handleCustomizationChange && customizationOptions) {
                                            handleCustomizationChange({
                                                ...customizationOptions,
                                                layout: {
                                                    ...customizationOptions.layout,
                                                    sectionTitles: {
                                                        ...customizationOptions.layout.sectionTitles,
                                                        [config.id]: newTitle.trim()
                                                    }
                                                }
                                            });
                                        }
                                    }}
                                    title="Edit section title"
                                >
                                    <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                    className="p-1 text-slate-500 hover:text-slate-700 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (handleCustomizationChange && customizationOptions) {
                                            handleCustomizationChange({
                                                ...customizationOptions,
                                                layout: {
                                                    ...customizationOptions.layout,
                                                    visibleSections: {
                                                        ...customizationOptions.layout.visibleSections,
                                                        [config.id]: !isVisible
                                                    }
                                                }
                                            });
                                        }
                                    }}
                                    title={isVisible ? "Hide section" : "Show section"}
                                >
                                    {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                            </>
                        )}
                    </div>
                </div>
                {isExpanded && isActive && (
                    <div className="p-6 bg-white border-t border-slate-100 animate-fadeIn">
                        <Component {...props} />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-md border border-slate-200">
            <style>{styles}</style>
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
                <h2 className="text-xl font-bold text-blue-800">Content</h2>
            </div>
            <div className="divide-y divide-slate-200">
                {sectionConfigs.map(renderSection)}
                <CustomSections
                    customizationOptions={customizationOptions}
                    expandedSections={expandedSections}
                    activeSection={activeSection}
                    onSectionToggle={toggleSection}
                    onCustomizationChange={handleCustomizationChange}
                />
                <div className="p-4 flex justify-center">
                    <Button
                        variant="outline"
                        onClick={() => {
                            if (handleCustomizationChange && customizationOptions) {
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
                                    handleCustomizationChange({
                                        ...customizationOptions,
                                        customSections: [...(customizationOptions.customSections || []), newSection],
                                        layout: {
                                            ...customizationOptions.layout,
                                            visibleSections: updatedVisibleSections
                                        }
                                    });
                                    toggleSection(newSection.id);
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