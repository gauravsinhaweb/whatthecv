import React, { useRef, useState, useEffect } from 'react';
import ProfilePictureUploader from '../../../../components/ui/ProfilePictureUploader';
import RichTextEditor from '../../../../components/ui/RichTextEditor';

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
    onCustomizationChange
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
            {(showProfileUploader || hasValidProfilePic) && (
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
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-medium text-indigo-700 mb-1.5">Full Name</label>
                    <input
                        type="text"
                        className="w-full p-2.5 border border-slate-300  bg-white"
                        value={resumeData.personalInfo.name}
                        onChange={(e) => onPersonalInfoChange('name', e.currentTarget.value)}
                        placeholder="John Doe"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-indigo-700 mb-1.5">Position</label>
                    <input
                        type="text"
                        className="w-full p-2.5 border border-slate-300  bg-white"
                        value={resumeData.personalInfo.position}
                        onChange={(e) => onPersonalInfoChange('position', e.currentTarget.value)}
                        placeholder="Senior Software Engineer"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-medium text-indigo-700 mb-1.5">Email</label>
                    <input
                        type="email"
                        className="w-full p-2.5 border border-slate-300  bg-white"
                        value={resumeData.personalInfo.email}
                        onChange={(e) => onPersonalInfoChange('email', e.currentTarget.value)}
                        placeholder="john.doe@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-indigo-700 mb-1.5">Phone</label>
                    <input
                        type="tel"
                        className="w-full p-2.5 border border-slate-300  bg-white"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) => onPersonalInfoChange('phone', e.currentTarget.value)}
                        placeholder="(123) 456-7890"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1.5">Location</label>
                <input
                    type="text"
                    className="w-full p-2.5 border border-slate-300  bg-white"
                    value={resumeData.personalInfo.location}
                    onChange={(e) => onPersonalInfoChange('location', e.currentTarget.value)}
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
                                    className={`p-2.5 border  bg-white${socialLinkErrors[index]?.label && link.platform === 'other' ? ' border-red-500' : ''}`}
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
                                    className={`flex-1 p-2.5 border  bg-white${socialLinkErrors[index]?.url && socialLinkTouched[index]?.url ? ' border-red-500' : ''}`}
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
                                        className={`w-24 p-2.5 border  bg-white${socialLinkErrors[index]?.label && socialLinkTouched[index]?.label ? ' border-red-500' : ''}`}
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
    );
};

export default PersonalInfoSection; 