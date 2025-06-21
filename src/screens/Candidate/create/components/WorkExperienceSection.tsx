import React from 'react';
import RichTextEditor from '../../../../components/ui/RichTextEditor';
import Button from '../../../../components/ui/Button';
import InputFieldWithToggle from './InputFieldWithToggle';
import DateFieldWithToggle from './DateFieldWithToggle';

const WorkExperienceSection = ({ resumeData, onWorkExperienceChange, onRemove, onAdd, fieldVisibility, toggleFieldVisibility }) => (
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
                                className="w-full p-2.5 border border-slate-300 rounded-md transition-all bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={exp.position}
                                onChange={(e) => onWorkExperienceChange(exp.id, 'position', e.currentTarget.value)}
                                placeholder="Software Engineer"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-indigo-700 mb-1.5">Company</label>
                            <input
                                type="text"
                                className="w-full p-2.5 border border-slate-300 rounded-md transition-all bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={exp.company}
                                onChange={(e) => onWorkExperienceChange(exp.id, 'company', e.currentTarget.value)}
                                placeholder="Company Name"
                            />
                        </div>
                    </div>
                    <InputFieldWithToggle
                        label="Experience Link (optional)"
                        value={exp.experienceLink || ''}
                        onChange={(value) => onWorkExperienceChange(exp.id, 'experienceLink', value)}
                        placeholder="https://company-website.com or https://example.com/job-position"
                        type="url"
                        isVisible={fieldVisibility['workExperience.experienceLink']}
                        onToggleVisibility={() => toggleFieldVisibility('workExperience.experienceLink')}
                    />
                    <InputFieldWithToggle
                        label="Location"
                        value={exp.location}
                        onChange={(value) => onWorkExperienceChange(exp.id, 'location', value)}
                        placeholder="Country (e.g., United States)"
                        isVisible={fieldVisibility['workExperience.location']}
                        onToggleVisibility={() => toggleFieldVisibility('workExperience.location')}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <DateFieldWithToggle
                                label="Start Date"
                                month={exp.startMonth}
                                year={exp.startYear}
                                onMonthChange={(value) => onWorkExperienceChange(exp.id, 'startMonth', value)}
                                onYearChange={(value) => onWorkExperienceChange(exp.id, 'startYear', value)}
                                isVisible={exp.showStartMonth}
                                onToggleVisibility={() => onWorkExperienceChange(exp.id, 'showStartMonth', !exp.showStartMonth)}
                            />
                        </div>
                        <div>
                            <DateFieldWithToggle
                                label="End Date"
                                month={exp.endMonth}
                                year={exp.endYear}
                                onMonthChange={(value) => onWorkExperienceChange(exp.id, 'endMonth', value)}
                                onYearChange={(value) => onWorkExperienceChange(exp.id, 'endYear', value)}
                                isVisible={exp.showEndMonth}
                                onToggleVisibility={() => onWorkExperienceChange(exp.id, 'showEndMonth', !exp.showEndMonth)}
                                isCurrent={exp.current}
                                onCurrentChange={(isCurrent) => onWorkExperienceChange(exp.id, 'current', isCurrent)}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-sm font-medium text-indigo-700">Description</label>
                            <button
                                onClick={() => toggleFieldVisibility('workExperience.description')}
                                className={`p-1 rounded transition-colors ${fieldVisibility['workExperience.description']
                                    ? 'text-blue-600 hover:text-blue-800'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                title={fieldVisibility['workExperience.description'] ? "Hide field" : "Show field"}
                            >
                                {fieldVisibility['workExperience.description'] ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {fieldVisibility['workExperience.description'] && (
                            <>
                                <div className="bg-indigo-50 border-l-4 border-indigo-500 p-2 mb-2 text-xs">
                                    <span className="font-semibold">Tip:</span> Use bullet points (•) for achievements. Each bullet point will appear on its own line. Select text and use the link button to add hyperlinks to your projects or references.
                                </div>
                                <RichTextEditor
                                    value={exp.description}
                                    onChange={(value) => onWorkExperienceChange(exp.id, 'description', value)}
                                    placeholder="• Led a team of 5 developers to build a high-traffic platform\n• Redesigned authentication system, improving security by 40%\n• Implemented CI/CD pipeline using GitHub Actions\n• Mentored junior developers and conducted code reviews"
                                    rows={6}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        ))}
        <div className="flex justify-center mt-5">
            <Button
                variant="outline"
                onClick={onAdd.addWorkExperience}
                leftIcon={null}
                className="bg-white hover:bg-indigo-50 text-indigo-700 border-indigo-300"
            >
                Add Work Experience
            </Button>
        </div>
    </div>
);

export default WorkExperienceSection; 