import React from 'react';
import Button from '../../../../components/ui/Button';
import InputFieldWithToggle from './InputFieldWithToggle';
import DateFieldWithToggle from './DateFieldWithToggle';

const EducationSection = ({ resumeData, onEducationChange, onRemove, onAdd, fieldVisibility, toggleFieldVisibility }) => (
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
                                className="w-full p-2.5 border border-slate-300 rounded-md transition-all bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={edu.degree}
                                onChange={(e) => onEducationChange(edu.id, 'degree', e.currentTarget.value)}
                                placeholder="Bachelor of Science in Computer Science"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-emerald-700 mb-1.5">Institution</label>
                            <input
                                type="text"
                                className="w-full p-2.5 border border-slate-300 rounded-md transition-all bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={edu.institution}
                                onChange={(e) => onEducationChange(edu.id, 'institution', e.currentTarget.value)}
                                placeholder="University Name"
                            />
                        </div>
                    </div>
                    <InputFieldWithToggle
                        label="Institution Link (optional)"
                        value={edu.institutionLink || ''}
                        onChange={(value) => onEducationChange(edu.id, 'institutionLink', value)}
                        placeholder="https://university-website.com"
                        type="url"
                        isVisible={fieldVisibility['education.institutionLink']}
                        onToggleVisibility={() => toggleFieldVisibility('education.institutionLink')}
                    />
                    <InputFieldWithToggle
                        label="Location"
                        value={edu.location}
                        onChange={(value) => onEducationChange(edu.id, 'location', value)}
                        placeholder="City, Country"
                        isVisible={fieldVisibility['education.location']}
                        onToggleVisibility={() => toggleFieldVisibility('education.location')}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <DateFieldWithToggle
                                label="Start Date"
                                month={edu.startMonth}
                                year={edu.startYear}
                                onMonthChange={(value) => onEducationChange(edu.id, 'startMonth', value)}
                                onYearChange={(value) => onEducationChange(edu.id, 'startYear', value)}
                                isVisible={edu.showStartMonth}
                                onToggleVisibility={() => onEducationChange(edu.id, 'showStartMonth', !edu.showStartMonth)}
                            />
                        </div>
                        <div>
                            <DateFieldWithToggle
                                label="End Date"
                                month={edu.endMonth}
                                year={edu.endYear}
                                onMonthChange={(value) => onEducationChange(edu.id, 'endMonth', value)}
                                onYearChange={(value) => onEducationChange(edu.id, 'endYear', value)}
                                isVisible={edu.showEndMonth}
                                onToggleVisibility={() => onEducationChange(edu.id, 'showEndMonth', !edu.showEndMonth)}
                                isCurrent={edu.current}
                                onCurrentChange={(isCurrent) => onEducationChange(edu.id, 'current', isCurrent)}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-sm font-medium text-emerald-700">Description</label>
                            <button
                                onClick={() => toggleFieldVisibility('education.description')}
                                className={`p-1 rounded transition-colors ${fieldVisibility['education.description']
                                    ? 'text-blue-600 hover:text-blue-800'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                title={fieldVisibility['education.description'] ? "Hide field" : "Show field"}
                            >
                                {fieldVisibility['education.description'] ? (
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
                        {fieldVisibility['education.description'] && (
                            <textarea
                                value={edu.description}
                                onChange={(e) => onEducationChange(edu.id, 'description', e.currentTarget.value)}
                                placeholder="Describe your education, achievements, GPA, relevant coursework..."
                                rows={4}
                                className="w-full p-2.5 border border-slate-300 rounded-md transition-all bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        )}
                    </div>
                </div>
            </div>
        ))}
        <div className="flex justify-center mt-5">
            <Button
                variant="outline"
                onClick={onAdd.addEducation}
                leftIcon={null}
                className="bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-300"
            >
                Add Education
            </Button>
        </div>
    </div>
);

export default EducationSection; 