import { Award, BookOpen, Briefcase, ChevronDownIcon, Code, Edit, Eye, EyeOff, FileText, Plus, Trash2, User, Link2, Linkedin, Github, Twitter, Globe, ExternalLink } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react';
import Button from '../../../../components/ui/Button';
import DatePicker from '../../../../components/ui/DatePicker';
import ProfilePictureUploader from '../../../../components/ui/ProfilePictureUploader';
import RichTextEditor from '../../../../components/ui/RichTextEditor';
import { ResumeCustomizationOptions, ResumeData } from '../../../../types/resume';

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

    return (
        <div className="bg-white rounded-lg shadow-md border border-slate-200">
            <style>{styles}</style>
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
                <h2 className="text-xl font-bold text-blue-800">Content</h2>
            </div>

            <div className="divide-y divide-slate-200">
                {/* Personal Info Accordion */}
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
                        <div className="flex items-center">
                            <button
                                className="mr-2 p-1 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-full transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const newTitle = prompt('Edit section title:', customizationOptions?.layout?.sectionTitles?.personalInfo || 'Personal Info');
                                    if (newTitle && onCustomizationChange && customizationOptions) {
                                        onCustomizationChange({
                                            ...customizationOptions,
                                            layout: {
                                                ...customizationOptions.layout,
                                                sectionTitles: {
                                                    ...customizationOptions.layout.sectionTitles,
                                                    personalInfo: newTitle
                                                }
                                            }
                                        });
                                    }
                                }}
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            <span className="transform transition-transform duration-300" style={{
                                transform: expandedSections.personalInfo ? 'rotate(180deg)' : 'rotate(0)'
                            }}>
                                <ChevronDownIcon className="text-indigo-600 w-5 h-5" />
                            </span>
                        </div>
                    </div>
                    {expandedSections.personalInfo && activeSection === 'personalInfo' && (
                        <div className="p-6 bg-white border-t border-slate-100 animate-fadeIn">
                            <div className="space-y-5">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="show-profile-pic"
                                            className="mr-2 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                            checked={showProfileUploader || hasValidProfilePic}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                if (!e.currentTarget.checked) {
                                                    onPersonalInfoChange('profilePicture', '');
                                                    setShowProfileUploader(false);
                                                } else {
                                                    setShowProfileUploader(true);
                                                    setTimeout(() => {
                                                        if (fileInputRef.current) {
                                                            fileInputRef.current.click();
                                                        }
                                                    }, 100);
                                                }
                                            }}
                                        />
                                        <label htmlFor="show-profile-pic" className="text-sm font-medium text-indigo-700">
                                            Include Profile Picture
                                        </label>
                                    </div>
                                </div>

                                <div className="flex items-center mt-2">
                                    <input
                                        type="checkbox"
                                        id="showSummary"
                                        checked={customizationOptions?.showSummary || false}
                                        onChange={(e) => {
                                            if (onCustomizationChange && customizationOptions) {
                                                onCustomizationChange({
                                                    ...customizationOptions,
                                                    showSummary: (e.target as HTMLInputElement).checked
                                                });
                                            }
                                        }}
                                        className="mr-2 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                    />
                                    <label htmlFor="showSummary" className="text-sm font-medium text-indigo-700">
                                        Include Professional Summary
                                    </label>
                                </div>
                                <p className="text-xs text-slate-500 ml-6 mb-3">
                                    Show your professional summary at the top of your resume
                                </p>

                                {(showProfileUploader || hasValidProfilePic) && (
                                    <div className="flex justify-center mb-6">
                                        <ProfilePictureUploader
                                            value={resumeData.personalInfo.profilePicture || ''}
                                            onChange={(value) => {
                                                onPersonalInfoChange('profilePicture', value);
                                                setShowProfileUploader(!!value);

                                                // Automatically enable profile photo display in customization options when an image is uploaded
                                                if (value && onCustomizationChange && customizationOptions && !customizationOptions.header.showPhoto) {
                                                    onCustomizationChange({
                                                        ...customizationOptions,
                                                        header: {
                                                            ...customizationOptions.header,
                                                            showPhoto: true
                                                        }
                                                    });
                                                }
                                            }}
                                            ref={fileInputRef}
                                        />
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-indigo-700 mb-1.5">Full Name</label>
                                        <input
                                            type="text"
                                            className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                                            value={resumeData.personalInfo.name}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onPersonalInfoChange('name', e.currentTarget.value)}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-indigo-700 mb-1.5">Position</label>
                                        <input
                                            type="text"
                                            className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                                            value={resumeData.personalInfo.position}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onPersonalInfoChange('position', e.currentTarget.value)}
                                            placeholder="Senior Software Engineer"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-indigo-700 mb-1.5">Email</label>
                                        <input
                                            type="email"
                                            className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                                            value={resumeData.personalInfo.email}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onPersonalInfoChange('email', e.currentTarget.value)}
                                            placeholder="john.doe@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-indigo-700 mb-1.5">Phone</label>
                                        <input
                                            type="tel"
                                            className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                                            value={resumeData.personalInfo.phone}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onPersonalInfoChange('phone', e.currentTarget.value)}
                                            placeholder="(123) 456-7890"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-indigo-700 mb-1.5">Location</label>
                                    <input
                                        type="text"
                                        className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                                        value={resumeData.personalInfo.location}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onPersonalInfoChange('location', e.currentTarget.value)}
                                        placeholder="Country (e.g., United States)"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-indigo-700 mb-1.5">Social Links</label>
                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-3 text-sm">
                                        <span className="font-semibold">Tip:</span> Add your professional social profiles to enhance your resume. Links will appear in the header.
                                    </div>

                                    <button
                                        type="button"
                                        className="inline-flex items-center px-3 py-2 border border-indigo-300 shadow-sm text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
                                        onClick={() => {
                                            const newLinks = [...(resumeData.personalInfo.socialLinks || []), {
                                                platform: 'linkedin' as const,
                                                url: '',
                                                label: ''
                                            }];
                                            onPersonalInfoChange('socialLinks', JSON.stringify(newLinks));
                                        }}
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> Add Social Link
                                    </button>

                                    {(resumeData.personalInfo.socialLinks && resumeData.personalInfo.socialLinks.length > 0) && (
                                        <div className="space-y-3 mt-4">
                                            {resumeData.personalInfo.socialLinks.map((link, index) => (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <select
                                                        className="p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                                                        value={link.platform}
                                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                            const newLinks = [...(resumeData.personalInfo.socialLinks || [])];
                                                            newLinks[index] = { ...newLinks[index], platform: e.currentTarget.value as any };
                                                            onPersonalInfoChange('socialLinks', JSON.stringify(newLinks));
                                                        }}
                                                    >
                                                        <option value="linkedin">LinkedIn</option>
                                                        <option value="github">GitHub</option>
                                                        <option value="twitter">Twitter/X</option>
                                                        <option value="leetcode">LeetCode</option>
                                                        <option value="medium">Medium</option>
                                                        <option value="stackoverflow">Stack Overflow</option>
                                                        <option value="other">Other</option>
                                                    </select>

                                                    <input
                                                        type="url"
                                                        className="flex-1 p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                                                        value={link.url}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                            const newLinks = [...(resumeData.personalInfo.socialLinks || [])];
                                                            newLinks[index] = { ...newLinks[index], url: e.currentTarget.value };
                                                            onPersonalInfoChange('socialLinks', JSON.stringify(newLinks));
                                                        }}
                                                        placeholder="https://yourprofile.com"
                                                    />

                                                    {link.platform === 'other' && (
                                                        <input
                                                            type="text"
                                                            className="w-24 p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                                                            value={link.label || ''}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                const newLinks = [...(resumeData.personalInfo.socialLinks || [])];
                                                                newLinks[index] = { ...newLinks[index], label: e.currentTarget.value };
                                                                onPersonalInfoChange('socialLinks', JSON.stringify(newLinks));
                                                            }}
                                                            placeholder="Label"
                                                        />
                                                    )}

                                                    <button
                                                        type="button"
                                                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                                                        onClick={() => {
                                                            const newLinks = [...(resumeData.personalInfo.socialLinks || [])];
                                                            newLinks.splice(index, 1);
                                                            onPersonalInfoChange('socialLinks', JSON.stringify(newLinks));
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {customizationOptions?.showSummary && <div>
                                    <label className="block text-sm font-medium text-indigo-700 mb-1.5">Professional Summary</label>
                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-3 text-sm">
                                        <span className="font-semibold">Pro tip:</span> A concise, impactful summary is essential. Keep it to 2-3 sentences highlighting your expertise and career focus.
                                    </div>
                                    <RichTextEditor
                                        value={resumeData.personalInfo.summary}
                                        onChange={(value) => onPersonalInfoChange('summary', value)}
                                        placeholder="A brief summary of your professional background and goals..."
                                        rows={5}
                                    />
                                </div>}
                            </div>
                        </div>
                    )}
                </div>

                {/* Work Experience Accordion */}
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
                        <div className="flex items-center">
                            <button
                                className="mr-2 p-1 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-full transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const newTitle = prompt('Edit section title:', customizationOptions?.layout?.sectionTitles?.workExperience || 'Work Experience');
                                    if (newTitle && onCustomizationChange && customizationOptions) {
                                        onCustomizationChange({
                                            ...customizationOptions,
                                            layout: {
                                                ...customizationOptions.layout,
                                                sectionTitles: {
                                                    ...customizationOptions.layout.sectionTitles,
                                                    workExperience: newTitle
                                                }
                                            }
                                        });
                                    }
                                }}
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            <span className="transform transition-transform duration-300" style={{
                                transform: expandedSections.workExperience ? 'rotate(180deg)' : 'rotate(0)'
                            }}>
                                <ChevronDownIcon className="text-indigo-600 w-5 h-5" />
                            </span>
                        </div>
                    </div>
                    {expandedSections.workExperience && activeSection === 'workExperience' && (
                        <div className="p-6 bg-white border-t border-slate-100 animate-fadeIn">
                            <div className="space-y-6">
                                {resumeData.workExperience.map((exp, index) => (
                                    <div key={exp.id} className="border border-indigo-100 rounded-md p-5 relative bg-indigo-50/30 hover:bg-indigo-50/50 transition-colors shadow-sm">
                                        {resumeData.workExperience.length > 1 && (
                                            <button
                                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors text-sm"
                                                onClick={() => onRemove.removeWorkExperience(exp.id)}
                                            >
                                                Remove
                                            </button>
                                        )}
                                        <h3 className="font-medium text-indigo-800 mb-4 pb-2 border-b border-indigo-100">
                                            Work Experience {index + 1}
                                        </h3>
                                        <div className="space-y-5">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-sm font-medium text-indigo-700 mb-1.5">Job Title</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                                                        value={exp.position}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onWorkExperienceChange(exp.id, 'position', e.currentTarget.value)}
                                                        placeholder="Software Engineer"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-indigo-700 mb-1.5">Company</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                                                        value={exp.company}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onWorkExperienceChange(exp.id, 'company', e.currentTarget.value)}
                                                        placeholder="Company Name"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-indigo-700 mb-1.5">Experience Link (optional)</label>
                                                <input
                                                    type="url"
                                                    className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                                                    value={exp.experienceLink || ''}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onWorkExperienceChange(exp.id, 'experienceLink', e.currentTarget.value)}
                                                    placeholder="https://company-website.com or https://example.com/job-position"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-indigo-700 mb-1.5">Location</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                                                    value={exp.location}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onWorkExperienceChange(exp.id, 'location', e.currentTarget.value)}
                                                    placeholder="Country (e.g., United States)"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-sm font-medium text-indigo-700 mb-1.5">Start Date</label>
                                                    <DatePicker
                                                        value={exp.startDate}
                                                        onChange={(value) => onWorkExperienceChange(exp.id, 'startDate', value)}
                                                        placeholder="Select start date"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-indigo-700 mb-1.5">End Date</label>
                                                    <div className="flex items-center space-x-2">
                                                        <DatePicker
                                                            value={exp.endDate}
                                                            onChange={(value) => onWorkExperienceChange(exp.id, 'endDate', value)}
                                                            placeholder="Select end date"
                                                            disabled={exp.current}
                                                            includePresent={true}
                                                        />
                                                        <div className="flex items-center whitespace-nowrap">
                                                            <input
                                                                type="checkbox"
                                                                id={`current-job-${exp.id}`}
                                                                checked={exp.current}
                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                    onWorkExperienceChange(exp.id, 'current', e.currentTarget.checked);
                                                                    if (e.currentTarget.checked) {
                                                                        onWorkExperienceChange(exp.id, 'endDate', 'Present');
                                                                    }
                                                                }}
                                                                className="mr-1.5 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                                            />
                                                            <label htmlFor={`current-job-${exp.id}`} className="text-sm text-indigo-700">
                                                                Current
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-indigo-700 mb-1.5">Description</label>
                                                <div className="bg-indigo-50 border-l-4 border-indigo-500 p-2 mb-2 text-xs">
                                                    <span className="font-semibold">Tip:</span> Use bullet points (•) for achievements. Each bullet point will appear on its own line. Select text and use the link button to add hyperlinks to your projects or references.
                                                </div>
                                                <RichTextEditor
                                                    value={exp.description}
                                                    onChange={(value) => onWorkExperienceChange(exp.id, 'description', value)}
                                                    placeholder="• Led a team of 5 developers to build a high-traffic platform
• Redesigned authentication system, improving security by 40%
• Implemented CI/CD pipeline using GitHub Actions
• Mentored junior developers and conducted code reviews"
                                                    rows={6}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex justify-center mt-5">
                                    <Button
                                        variant="outline"
                                        onClick={onAdd.addWorkExperience}
                                        leftIcon={<Plus className="h-4 w-4" />}
                                        className="bg-white hover:bg-indigo-50 text-indigo-700 border-indigo-300"
                                    >
                                        Add Work Experience
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Education Accordion */}
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
                        <div className="flex items-center">
                            <button
                                className="mr-2 p-1 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const newTitle = prompt('Edit section title:', customizationOptions?.layout?.sectionTitles?.education || 'Education');
                                    if (newTitle && onCustomizationChange && customizationOptions) {
                                        onCustomizationChange({
                                            ...customizationOptions,
                                            layout: {
                                                ...customizationOptions.layout,
                                                sectionTitles: {
                                                    ...customizationOptions.layout.sectionTitles,
                                                    education: newTitle
                                                }
                                            }
                                        });
                                    }
                                }}
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            <span className="transform transition-transform duration-300" style={{
                                transform: expandedSections.education ? 'rotate(180deg)' : 'rotate(0)'
                            }}>
                                <ChevronDownIcon className="text-emerald-600 w-5 h-5" />
                            </span>
                        </div>
                    </div>
                    {expandedSections.education && activeSection === 'education' && (
                        <div className="p-6 bg-white border-t border-slate-100 animate-fadeIn">
                            <div className="space-y-6">
                                {resumeData.education.map((edu, index) => (
                                    <div key={edu.id} className="border border-emerald-100 rounded-md p-5 relative bg-emerald-50/30 hover:bg-emerald-50/50 transition-colors shadow-sm">
                                        {resumeData.education.length > 1 && (
                                            <button
                                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors text-sm"
                                                onClick={() => onRemove.removeEducation(edu.id)}
                                            >
                                                Remove
                                            </button>
                                        )}
                                        <h3 className="font-medium text-emerald-800 mb-4 pb-2 border-b border-emerald-100">
                                            Education {index + 1}
                                        </h3>
                                        <div className="space-y-5">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-sm font-medium text-emerald-700 mb-1.5">Degree</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white"
                                                        value={edu.degree}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onEducationChange(edu.id, 'degree', e.currentTarget.value)}
                                                        placeholder="Bachelor of Science in Computer Science"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-emerald-700 mb-1.5">Institution</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white"
                                                        value={edu.institution}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onEducationChange(edu.id, 'institution', e.currentTarget.value)}
                                                        placeholder="Stanford University"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-emerald-700 mb-1.5">Education Link (optional)</label>
                                                <input
                                                    type="url"
                                                    className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white"
                                                    value={edu.institutionLink || edu.degreeLink || ''}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        onEducationChange(edu.id, 'institutionLink', e.currentTarget.value);
                                                        onEducationChange(edu.id, 'degreeLink', '');
                                                    }}
                                                    placeholder="https://university.edu"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-emerald-700 mb-1.5">Location</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white"
                                                    value={edu.location}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onEducationChange(edu.id, 'location', e.currentTarget.value)}
                                                    placeholder="Country (e.g., United States)"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-sm font-medium text-emerald-700 mb-1.5">Start Date</label>
                                                    <DatePicker
                                                        value={edu.startDate}
                                                        onChange={(value) => onEducationChange(edu.id, 'startDate', value)}
                                                        placeholder="Select start date"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-emerald-700 mb-1.5">End Date</label>
                                                    <DatePicker
                                                        value={edu.endDate}
                                                        onChange={(value) => onEducationChange(edu.id, 'endDate', value)}
                                                        placeholder="Select end date"
                                                        includePresent={true}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex justify-center mt-5">
                                    <Button
                                        variant="outline"
                                        onClick={onAdd.addEducation}
                                        leftIcon={<Plus className="h-4 w-4" />}
                                        className="bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-300"
                                    >
                                        Add Education
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Skills Accordion */}
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
                        <div className="flex items-center">
                            <button
                                className="mr-2 p-1 text-amber-500 hover:text-amber-700 hover:bg-amber-50 rounded-full transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const newTitle = prompt('Edit section title:', customizationOptions?.layout?.sectionTitles?.skills || 'Skills');
                                    if (newTitle && onCustomizationChange && customizationOptions) {
                                        onCustomizationChange({
                                            ...customizationOptions,
                                            layout: {
                                                ...customizationOptions.layout,
                                                sectionTitles: {
                                                    ...customizationOptions.layout.sectionTitles,
                                                    skills: newTitle
                                                }
                                            }
                                        });
                                    }
                                }}
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            <span className="transform transition-transform duration-300" style={{
                                transform: expandedSections.skills ? 'rotate(180deg)' : 'rotate(0)'
                            }}>
                                <ChevronDownIcon className="text-amber-600 w-5 h-5" />
                            </span>
                        </div>
                    </div>
                    {expandedSections.skills && activeSection === 'skills' && (
                        <div className="p-6 bg-white border-t border-slate-100 animate-fadeIn">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-amber-700 mb-1.5">Add Skills</label>
                                    <div className="bg-amber-50 border-l-4 border-amber-500 p-3 mb-3 text-sm">
                                        <span className="font-semibold">Important:</span> Enter only one-word skills. Maximum 16 skills allowed. For multi-word skills, use hyphens (e.g. ReactJS, Machine-Learning).
                                    </div>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            className="flex-1 p-2.5 border border-slate-300 rounded-l-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                                            value={onSkillChange.skillInput}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSkillChange.setSkillInput(e.currentTarget.value)}
                                            onKeyDown={onSkillInputKeyDown}
                                            placeholder="E.g., JavaScript, React, TypeScript"
                                        />
                                        <Button
                                            onClick={onSkillChange.addSkill}
                                            className="rounded-l-none bg-amber-600 hover:bg-amber-700 transition-colors"
                                            disabled={resumeData.skills.length >= 16}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                    <p className="mt-2 text-xs text-slate-500">Press Enter to add multiple skills ({resumeData.skills.length}/16 used)</p>
                                </div>

                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-amber-700 mb-2">Your Skills</label>
                                    <div className="p-4 bg-amber-50/30 rounded-md min-h-[100px] border border-amber-100">
                                        <div className="flex flex-wrap gap-2">
                                            {resumeData.skills.length > 0 ? (
                                                resumeData.skills.map((skill) => (
                                                    <div
                                                        key={skill}
                                                        className="bg-amber-100 text-amber-800 px-3.5 py-1.5 rounded-full text-sm flex items-center shadow-sm"
                                                    >
                                                        {skill}
                                                        <button
                                                            className="ml-2 text-amber-600 hover:text-amber-800 transition-colors"
                                                            onClick={() => onSkillChange.removeSkill(skill)}
                                                        >
                                                            &times;
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-slate-500 text-sm">No skills added yet.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Projects Accordion */}
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
                        <div className="flex items-center">
                            <button
                                className="mr-2 p-1 text-purple-500 hover:text-purple-700 hover:bg-purple-50 rounded-full transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const newTitle = prompt('Edit section title:', customizationOptions?.layout?.sectionTitles?.projects || 'Projects');
                                    if (newTitle && onCustomizationChange && customizationOptions) {
                                        onCustomizationChange({
                                            ...customizationOptions,
                                            layout: {
                                                ...customizationOptions.layout,
                                                sectionTitles: {
                                                    ...customizationOptions.layout.sectionTitles,
                                                    projects: newTitle
                                                }
                                            }
                                        });
                                    }
                                }}
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            <span className="transform transition-transform duration-300" style={{
                                transform: expandedSections.projects ? 'rotate(180deg)' : 'rotate(0)'
                            }}>
                                <ChevronDownIcon className="text-purple-600 w-5 h-5" />
                            </span>
                        </div>
                    </div>
                    {expandedSections.projects && activeSection === 'projects' && (
                        <div className="p-6 bg-white border-t border-slate-100 animate-fadeIn">
                            <div className="space-y-6">
                                {resumeData.projects.map((project, index) => (
                                    <div key={project.id} className="border border-purple-100 rounded-md p-5 relative bg-purple-50/30 hover:bg-purple-50/50 transition-colors shadow-sm">
                                        {resumeData.projects.length > 1 && (
                                            <button
                                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors text-sm"
                                                onClick={() => onRemove.removeProject(project.id)}
                                            >
                                                Remove
                                            </button>
                                        )}
                                        <h3 className="font-medium text-purple-800 mb-4 pb-2 border-b border-purple-100">
                                            Project {index + 1}
                                        </h3>
                                        <div className="space-y-5">
                                            <div>
                                                <label className="block text-sm font-medium text-purple-700 mb-1.5">Project Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                                                    value={project.name}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onProjectChange(project.id, 'name', e.currentTarget.value)}
                                                    placeholder="E-commerce Website"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-purple-700 mb-1.5">Description</label>
                                                <div className="bg-purple-50 border-l-4 border-purple-500 p-2 mb-2 text-xs">
                                                    <span className="font-semibold">Tip:</span> Use bullet points (•) for achievements. Each bullet point will appear on its own line. Select text and use the link button to add hyperlinks to your projects or references.
                                                </div>
                                                <RichTextEditor
                                                    value={project.description}
                                                    onChange={(value) => onProjectChange(project.id, 'description', value)}
                                                    placeholder="• Developed a full-featured e-commerce platform
• Implemented payment processing with Stripe
• Created responsive UI with React and Material-UI
• Added analytics dashboard to track customer behavior"
                                                    rows={5}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-purple-700 mb-1.5">Technologies Used</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                                                    value={project.technologies}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onProjectChange(project.id, 'technologies', e.currentTarget.value)}
                                                    placeholder="React, Node.js, MongoDB"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-sm font-medium text-purple-700 mb-1.5">Start Date</label>
                                                    <DatePicker
                                                        value={project.startDate || ''}
                                                        onChange={(value) => onProjectChange(project.id, 'startDate', value)}
                                                        placeholder="Select start date"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-purple-700 mb-1.5">End Date</label>
                                                    <DatePicker
                                                        value={project.endDate || ''}
                                                        onChange={(value) => onProjectChange(project.id, 'endDate', value)}
                                                        placeholder="Select end date"
                                                        includePresent={true}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-purple-700 mb-1.5">Project Link</label>
                                                <input
                                                    type="url"
                                                    className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                                                    value={project.link}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onProjectChange(project.id, 'link', e.currentTarget.value)}
                                                    placeholder="https://github.com/yourusername/project"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex justify-center mt-5">
                                    <Button
                                        variant="outline"
                                        onClick={onAdd.addProject}
                                        leftIcon={<Plus className="h-4 w-4" />}
                                        className="bg-white hover:bg-purple-50 text-purple-700 border-purple-300"
                                    >
                                        Add Project
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Custom Sections */}
                {customizationOptions?.customSections?.map((customSection, index) => {
                    // Skip hidden sections in the editor
                    if (customizationOptions.layout.visibleSections?.[customSection.id] === false) {
                        return null;
                    }

                    return (
                        <div key={customSection.id} className="border-b border-slate-200">
                            <div
                                className={`flex justify-between items-center p-4 cursor-pointer transition-all duration-200 ${expandedSections[customSection.id] && activeSection === customSection.id
                                    ? 'bg-gradient-to-r from-blue-50 to-white shadow-sm rounded-t-md'
                                    : 'hover:bg-slate-50/80'
                                    }`}
                                onClick={() => onSectionToggle(customSection.id)}
                            >
                                <div className="flex items-center">
                                    <FileText className="w-5 h-5 mr-3 text-blue-600" />
                                    <span className="font-medium text-blue-900 text-base">
                                        {customSection.title}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <button
                                        className="mr-2 p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const newTitle = prompt('Edit section title:', customSection.title);
                                            if (newTitle && onCustomizationChange && customizationOptions) {
                                                const updatedSections = customizationOptions.customSections.map(section =>
                                                    section.id === customSection.id
                                                        ? { ...section, title: newTitle }
                                                        : section
                                                );
                                                onCustomizationChange({
                                                    ...customizationOptions,
                                                    customSections: updatedSections
                                                });
                                            }
                                        }}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        className="mr-2 p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (onCustomizationChange && customizationOptions) {
                                                const isCurrentlyVisible = customizationOptions.layout.visibleSections?.[customSection.id] !== false;
                                                onCustomizationChange({
                                                    ...customizationOptions,
                                                    layout: {
                                                        ...customizationOptions.layout,
                                                        visibleSections: {
                                                            ...customizationOptions.layout.visibleSections,
                                                            [customSection.id]: !isCurrentlyVisible,
                                                            // Ensure Personal Info remains visible
                                                            personalInfo: true
                                                        }
                                                    }
                                                });
                                            }
                                        }}
                                        title={customizationOptions.layout.visibleSections?.[customSection.id] !== false ? "Hide section" : "Show section"}
                                    >
                                        {customizationOptions.layout.visibleSections?.[customSection.id] !== false ?
                                            <Eye className="w-4 h-4" /> :
                                            <EyeOff className="w-4 h-4" />
                                        }
                                    </button>
                                    <button
                                        className="mr-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm('Are you sure you want to delete this section?') && onCustomizationChange && customizationOptions) {
                                                const updatedSections = customizationOptions.customSections.filter(
                                                    section => section.id !== customSection.id
                                                );
                                                onCustomizationChange({
                                                    ...customizationOptions,
                                                    customSections: updatedSections
                                                });
                                            }
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <span className="transform transition-transform duration-300" style={{
                                        transform: expandedSections[customSection.id] ? 'rotate(180deg)' : 'rotate(0)'
                                    }}>
                                        <ChevronDownIcon className="text-blue-600 w-5 h-5" />
                                    </span>
                                </div>
                            </div>
                            {expandedSections[customSection.id] && activeSection === customSection.id && (
                                <div className="p-6 bg-white border-t border-slate-100 animate-fadeIn">
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-blue-700 mb-1.5">Content</label>
                                            <RichTextEditor
                                                value={customSection.content}
                                                onChange={(value) => {
                                                    if (onCustomizationChange && customizationOptions) {
                                                        const updatedSections = customizationOptions.customSections.map(section =>
                                                            section.id === customSection.id
                                                                ? { ...section, content: value }
                                                                : section
                                                        );
                                                        onCustomizationChange({
                                                            ...customizationOptions,
                                                            customSections: updatedSections
                                                        });
                                                    }
                                                }}
                                                placeholder="Add your custom content here..."
                                                rows={6}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Add Custom Section Button */}
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

                                    // Also add to visible sections
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

                                    // Add to expanded sections
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