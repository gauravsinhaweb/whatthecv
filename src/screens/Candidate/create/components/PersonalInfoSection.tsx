import React, { useRef, useState, useEffect } from 'react';
import ProfilePictureUploader from '../../../../components/ui/ProfilePictureUploader';
import RichTextEditor from '../../../../components/ui/RichTextEditor';
import InputFieldWithToggle from './InputFieldWithToggle';
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

const PersonalInfoSection = ({
    resumeData,
    customizationOptions,
    onPersonalInfoChange,
    showProfileUploader,
    setShowProfileUploader,
    fileInputRef,
    socialLinkErrors,
    socialLinkTouched,
    setSocialLinkTouched,
    onCustomizationChange,
    fieldVisibility,
    toggleFieldVisibility
}) => {
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

    return (
        <div className="space-y-5">
            {/* <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="show-profile-pic"
                        className="mr-2 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                        checked={showProfileUploader || hasValidProfilePic}
                        onChange={(e) => {
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
            </div> */}
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
            {/* {(showProfileUploader || hasValidProfilePic) && (
                <div className="flex justify-center mb-6">
                    <ProfilePictureUploader
                        value={resumeData.personalInfo.profilePicture || ''}
                        onChange={(value) => {
                            onPersonalInfoChange('profilePicture', value);
                            setShowProfileUploader(!!value);
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
            )} */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-medium text-indigo-700 mb-1.5">Full Name</label>
                    <input
                        type="text"
                        className="w-full p-2.5 border border-slate-300 rounded-md transition-all bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={resumeData.personalInfo.name}
                        onChange={(e) => onPersonalInfoChange('name', e.currentTarget.value)}
                        placeholder="John Doe"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-indigo-700 mb-1.5">Position</label>
                    <input
                        type="text"
                        className="w-full p-2.5 border border-slate-300 rounded-md transition-all bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={resumeData.personalInfo.position}
                        onChange={(e) => onPersonalInfoChange('position', e.currentTarget.value)}
                        placeholder="Senior Software Engineer"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputFieldWithToggle
                    label="Email"
                    value={resumeData.personalInfo.email}
                    onChange={(value) => onPersonalInfoChange('email', value)}
                    placeholder="john.doe@example.com"
                    type="email"
                    isVisible={true}
                    onToggleVisibility={() => { }}
                />
                <InputFieldWithToggle
                    label="Phone"
                    value={resumeData.personalInfo.phone}
                    onChange={(value) => onPersonalInfoChange('phone', value)}
                    placeholder="(123) 456-7890"
                    type="tel"
                    isVisible={fieldVisibility['personalInfo.phone']}
                    onToggleVisibility={() => toggleFieldVisibility('personalInfo.phone')}
                />
            </div>
            <InputFieldWithToggle
                label="Location"
                value={resumeData.personalInfo.location}
                onChange={(value) => onPersonalInfoChange('location', value)}
                placeholder="Country (e.g., United States)"
                isVisible={fieldVisibility['personalInfo.location']}
                onToggleVisibility={() => toggleFieldVisibility('personalInfo.location')}
            />
            <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1.5 flex items-center justify-between">
                    <span>Social Links</span>
                    <FieldVisibilityToggle
                        isVisible={fieldVisibility['personalInfo.socialLinks']}
                        onToggle={() => toggleFieldVisibility('personalInfo.socialLinks')}
                    />
                </label>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-3 text-sm">
                    <span className="font-semibold">Tip:</span> Add your professional social profiles to enhance your resume. Links will appear in the header.
                </div>
                <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-indigo-300 shadow-sm text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
                    onClick={() => {
                        const newLinks = [...(resumeData.personalInfo.socialLinks || []), {
                            platform: 'linkedin',
                            url: '',
                            label: ''
                        }];
                        onPersonalInfoChange('socialLinks', JSON.stringify(newLinks));
                    }}
                >
                    Add Social Link
                </button>
                {(resumeData.personalInfo.socialLinks && resumeData.personalInfo.socialLinks.length > 0) && (
                    <div className="space-y-3 mt-4">
                        {resumeData.personalInfo.socialLinks.map((link, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <select
                                    className={`p-2.5 border border-slate-300 rounded-md transition-all bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500${socialLinkErrors[index]?.label && link.platform === 'other' ? ' border-red-500' : ''}`}
                                    value={link.platform}
                                    onChange={(e) => {
                                        const newLinks = [...(resumeData.personalInfo.socialLinks || [])];
                                        newLinks[index] = { ...newLinks[index], platform: e.currentTarget.value };
                                        onPersonalInfoChange('socialLinks', JSON.stringify(newLinks));
                                    }}
                                >
                                    <option value="linkedin">LinkedIn</option>
                                    <option value="peerlist">Peerlist</option>
                                    <option value="github">GitHub</option>
                                    <option value="twitter">Twitter/X</option>
                                    <option value="leetcode">LeetCode</option>
                                    <option value="medium">Medium</option>
                                    <option value="stackoverflow">Stack Overflow</option>
                                    <option value="other">Other</option>
                                </select>
                                <input
                                    type="url"
                                    className={`flex-1 p-2.5 border border-slate-300 rounded-md transition-all bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500${socialLinkErrors[index]?.url && socialLinkTouched[index]?.url ? ' border-red-500' : ''}`}
                                    value={link.url}
                                    onChange={(e) => {
                                        const newLinks = [...(resumeData.personalInfo.socialLinks || [])];
                                        newLinks[index] = { ...newLinks[index], url: e.currentTarget.value };
                                        onPersonalInfoChange('socialLinks', JSON.stringify(newLinks));
                                    }}
                                    onBlur={() => {
                                        setSocialLinkTouched((prev) => {
                                            const next = [...prev];
                                            next[index] = { ...next[index], url: true };
                                            return next;
                                        });
                                    }}
                                    placeholder="https://yourprofile.com"
                                />
                                {link.platform === 'other' && (
                                    <input
                                        type="text"
                                        className={`w-24 p-2.5 border border-slate-300 rounded-md transition-all bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500${socialLinkErrors[index]?.label && socialLinkTouched[index]?.label ? ' border-red-500' : ''}`}
                                        value={link.label || ''}
                                        onChange={(e) => {
                                            const newLinks = [...(resumeData.personalInfo.socialLinks || [])];
                                            newLinks[index] = { ...newLinks[index], label: e.currentTarget.value };
                                            onPersonalInfoChange('socialLinks', JSON.stringify(newLinks));
                                        }}
                                        onBlur={() => {
                                            setSocialLinkTouched((prev) => {
                                                const next = [...prev];
                                                next[index] = { ...next[index], label: true };
                                                return next;
                                            });
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
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {customizationOptions?.showSummary && (
                <div>
                    <label className="block text-sm font-medium text-indigo-700 mb-1.5 flex items-center justify-between">
                        <span>Professional Summary</span>
                        <FieldVisibilityToggle
                            isVisible={fieldVisibility['personalInfo.summary']}
                            onToggle={() => toggleFieldVisibility('personalInfo.summary')}
                        />
                    </label>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-3 text-sm">
                        <span className="font-semibold">Pro tip:</span> A concise, impactful summary is essential. Keep it to 2-3 sentences highlighting your expertise and career focus.
                    </div>
                    <RichTextEditor
                        value={resumeData.personalInfo.summary}
                        onChange={(value) => onPersonalInfoChange('summary', value)}
                        placeholder="A brief summary of your professional background and goals..."
                        rows={5}
                    />
                </div>
            )}
        </div>
    );
};

export default PersonalInfoSection; 