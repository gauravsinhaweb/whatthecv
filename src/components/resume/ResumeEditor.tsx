import React from 'react';
import { ResumeData } from '../../types/resume';
import { ArrowDown, Award, BookOpen, Briefcase, ChevronDownIcon, Code, Plus, User } from 'lucide-react';
import Button from '../ui/Button';
import RichTextEditor from '../ui/RichTextEditor';

// Add these styles at the top of the file
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
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md border border-slate-200">
            <style>{styles}</style>
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
                <h2 className="text-xl font-bold text-blue-800">Resume Content</h2>
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
                            <span className="font-medium text-indigo-900 text-base">Personal Info</span>
                        </div>
                        <div className="flex items-center">
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
                                        <label className="block text-sm font-medium text-indigo-700 mb-1.5">Title</label>
                                        <input
                                            type="text"
                                            className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                                            value={resumeData.personalInfo.title}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onPersonalInfoChange('title', e.currentTarget.value)}
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
                                        placeholder="San Francisco, CA"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-indigo-700 mb-1.5">Professional Summary</label>
                                    <RichTextEditor
                                        value={resumeData.personalInfo.summary}
                                        onChange={(value) => onPersonalInfoChange('summary', value)}
                                        placeholder="A brief summary of your professional background and goals..."
                                        rows={4}
                                    />
                                </div>
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
                            <span className="font-medium text-indigo-900 text-base">Work Experience</span>
                        </div>
                        <div className="flex items-center">
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
                                                        value={exp.title}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onWorkExperienceChange(exp.id, 'title', e.currentTarget.value)}
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
                                                <label className="block text-sm font-medium text-indigo-700 mb-1.5">Location</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                                                    value={exp.location}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onWorkExperienceChange(exp.id, 'location', e.currentTarget.value)}
                                                    placeholder="San Francisco, CA"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-sm font-medium text-indigo-700 mb-1.5">Start Date</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                                                        value={exp.startDate}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onWorkExperienceChange(exp.id, 'startDate', e.currentTarget.value)}
                                                        placeholder="Jun 2018"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-indigo-700 mb-1.5">End Date</label>
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="text"
                                                            className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white disabled:bg-slate-100 disabled:text-slate-500"
                                                            value={exp.endDate}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onWorkExperienceChange(exp.id, 'endDate', e.currentTarget.value)}
                                                            placeholder="Present"
                                                            disabled={exp.current}
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
                                                <RichTextEditor
                                                    value={exp.description}
                                                    onChange={(value) => onWorkExperienceChange(exp.id, 'description', value)}
                                                    placeholder="Describe your responsibilities and achievements..."
                                                    rows={4}
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
                            <span className="font-medium text-emerald-900 text-base">Education</span>
                        </div>
                        <div className="flex items-center">
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
                                                        placeholder="University Name"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-emerald-700 mb-1.5">Location</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white"
                                                    value={edu.location}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onEducationChange(edu.id, 'location', e.currentTarget.value)}
                                                    placeholder="City, State"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-sm font-medium text-emerald-700 mb-1.5">Start Date</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white"
                                                        value={edu.startDate}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onEducationChange(edu.id, 'startDate', e.currentTarget.value)}
                                                        placeholder="Sep 2014"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-emerald-700 mb-1.5">End Date</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white"
                                                        value={edu.endDate}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onEducationChange(edu.id, 'endDate', e.currentTarget.value)}
                                                        placeholder="May 2018"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-emerald-700 mb-1.5">Description</label>
                                                <RichTextEditor
                                                    value={edu.description}
                                                    onChange={(value) => onEducationChange(edu.id, 'description', value)}
                                                    placeholder="Relevant coursework, achievements, etc..."
                                                    rows={3}
                                                />
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
                            <span className="font-medium text-amber-900 text-base">Skills</span>
                        </div>
                        <div className="flex items-center">
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
                                        >
                                            Add
                                        </Button>
                                    </div>
                                    <p className="mt-2 text-xs text-slate-500">Press Enter to add multiple skills</p>
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
                            <span className="font-medium text-purple-900 text-base">Projects</span>
                        </div>
                        <div className="flex items-center">
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
                                                <RichTextEditor
                                                    value={project.description}
                                                    onChange={(value) => onProjectChange(project.id, 'description', value)}
                                                    placeholder="Brief description of the project..."
                                                    rows={3}
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
            </div>
        </div>
    );
};

export default ResumeEditor; 