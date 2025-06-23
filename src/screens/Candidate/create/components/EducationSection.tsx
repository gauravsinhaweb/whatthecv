import React from 'react';
import DatePicker from '../../../../components/ui/DatePicker';
import Button from '../../../../components/ui/Button';

const EducationSection = ({ resumeData, onEducationChange, onRemove, onAdd }) => (
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
                                className="w-full p-2.5 border border-slate-300 rounded-md  transition-all bg-white"
                                value={edu.degree}
                                onChange={(e) => onEducationChange(edu.id, 'degree', e.currentTarget.value)}
                                placeholder="Bachelor of Science in Computer Science"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-emerald-700 mb-1.5">Institution</label>
                            <input
                                type="text"
                                className="w-full p-2.5 border border-slate-300 rounded-md  transition-all bg-white"
                                value={edu.institution}
                                onChange={(e) => onEducationChange(edu.id, 'institution', e.currentTarget.value)}
                                placeholder="Stanford University"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-emerald-700 mb-1.5">Education Link (optional)</label>
                        <input
                            type="url"
                            className="w-full p-2.5 border border-slate-300 rounded-md  transition-all bg-white"
                            value={edu.institutionLink || edu.degreeLink || ''}
                            onChange={(e) => {
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
                            className="w-full p-2.5 border border-slate-300 rounded-md  transition-all bg-white"
                            value={edu.location}
                            onChange={(e) => onEducationChange(edu.id, 'location', e.currentTarget.value)}
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
                leftIcon={null}
                className="bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-300"
            >
                Add Education
            </Button>
        </div>
    </div>
);

export default EducationSection; 