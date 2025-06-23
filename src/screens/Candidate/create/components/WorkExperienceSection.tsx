import React from 'react';
import DatePicker from '../../../../components/ui/DatePicker';
import RichTextEditor from '../../../../components/ui/RichTextEditor';
import Button from '../../../../components/ui/Button';

const WorkExperienceSection = ({ resumeData, onWorkExperienceChange, onRemove, onAdd }) => (
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
                                className="w-full p-2.5 border border-slate-300  bg-white"
                                value={exp.position}
                                onChange={(e) => onWorkExperienceChange(exp.id, 'position', e.currentTarget.value)}
                                placeholder="Software Engineer"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-indigo-700 mb-1.5">Company</label>
                            <input
                                type="text"
                                className="w-full p-2.5 border border-slate-300  bg-white"
                                value={exp.company}
                                onChange={(e) => onWorkExperienceChange(exp.id, 'company', e.currentTarget.value)}
                                placeholder="Company Name"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-indigo-700 mb-1.5">Experience Link (optional)</label>
                        <input
                            type="url"
                            className="w-full p-2.5 border border-slate-300  bg-white"
                            value={exp.experienceLink || ''}
                            onChange={(e) => onWorkExperienceChange(exp.id, 'experienceLink', e.currentTarget.value)}
                            placeholder="https://company-website.com or https://example.com/job-position"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-indigo-700 mb-1.5">Location</label>
                        <input
                            type="text"
                            className="w-full p-2.5 border border-slate-300  bg-white"
                            value={exp.location}
                            onChange={(e) => onWorkExperienceChange(exp.id, 'location', e.currentTarget.value)}
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
                                        onChange={(e) => {
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
                            placeholder="• Led a team of 5 developers to build a high-traffic platform\n• Redesigned authentication system, improving security by 40%\n• Implemented CI/CD pipeline using GitHub Actions\n• Mentored junior developers and conducted code reviews"
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
                leftIcon={null}
                className="bg-white hover:bg-indigo-50 text-indigo-700 border-indigo-300"
            >
                Add Work Experience
            </Button>
        </div>
    </div>
);

export default WorkExperienceSection; 