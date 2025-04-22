import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import Button from './ui/Button';
import { Plus, Save, Download, EyeOff, Eye, Briefcase, BookOpen, Award, Code } from 'lucide-react';

interface ResumeData {
    personalInfo: {
        name: string;
        title: string;
        email: string;
        phone: string;
        location: string;
        summary: string;
    };
    workExperience: {
        id: string;
        title: string;
        company: string;
        location: string;
        startDate: string;
        endDate: string;
        current: boolean;
        description: string;
    }[];
    education: {
        id: string;
        degree: string;
        institution: string;
        location: string;
        startDate: string;
        endDate: string;
        description: string;
    }[];
    skills: string[];
    projects: {
        id: string;
        name: string;
        description: string;
        technologies: string;
        link: string;
    }[];
}

const initialResumeData: ResumeData = {
    personalInfo: {
        name: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
    },
    workExperience: [
        {
            id: '1',
            title: '',
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: '',
        },
    ],
    education: [
        {
            id: '1',
            degree: '',
            institution: '',
            location: '',
            startDate: '',
            endDate: '',
            description: '',
        },
    ],
    skills: [],
    projects: [
        {
            id: '1',
            name: '',
            description: '',
            technologies: '',
            link: '',
        },
    ],
};

const CreateResume: React.FC = () => {
    const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
    const [skillInput, setSkillInput] = useState('');
    const [activeSection, setActiveSection] = useState<string>('personalInfo');
    const [isMobilePreviewVisible, setIsMobilePreviewVisible] = useState(false);

    const handlePersonalInfoChange = (field: string, value: string) => {
        setResumeData({
            ...resumeData,
            personalInfo: {
                ...resumeData.personalInfo,
                [field]: value,
            },
        });
    };

    const handleWorkExperienceChange = (id: string, field: string, value: string | boolean) => {
        setResumeData({
            ...resumeData,
            workExperience: resumeData.workExperience.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            ),
        });
    };

    const handleEducationChange = (id: string, field: string, value: string) => {
        setResumeData({
            ...resumeData,
            education: resumeData.education.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            ),
        });
    };

    const handleProjectChange = (id: string, field: string, value: string) => {
        setResumeData({
            ...resumeData,
            projects: resumeData.projects.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            ),
        });
    };

    const addWorkExperience = () => {
        const newId = String(resumeData.workExperience.length + 1);
        setResumeData({
            ...resumeData,
            workExperience: [
                ...resumeData.workExperience,
                {
                    id: newId,
                    title: '',
                    company: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    current: false,
                    description: '',
                },
            ],
        });
    };

    const addEducation = () => {
        const newId = String(resumeData.education.length + 1);
        setResumeData({
            ...resumeData,
            education: [
                ...resumeData.education,
                {
                    id: newId,
                    degree: '',
                    institution: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                },
            ],
        });
    };

    const addProject = () => {
        const newId = String(resumeData.projects.length + 1);
        setResumeData({
            ...resumeData,
            projects: [
                ...resumeData.projects,
                {
                    id: newId,
                    name: '',
                    description: '',
                    technologies: '',
                    link: '',
                },
            ],
        });
    };

    const removeWorkExperience = (id: string) => {
        setResumeData({
            ...resumeData,
            workExperience: resumeData.workExperience.filter((item) => item.id !== id),
        });
    };

    const removeEducation = (id: string) => {
        setResumeData({
            ...resumeData,
            education: resumeData.education.filter((item) => item.id !== id),
        });
    };

    const removeProject = (id: string) => {
        setResumeData({
            ...resumeData,
            projects: resumeData.projects.filter((item) => item.id !== id),
        });
    };

    const addSkill = () => {
        if (skillInput.trim() && !resumeData.skills.includes(skillInput.trim())) {
            setResumeData({
                ...resumeData,
                skills: [...resumeData.skills, skillInput.trim()],
            });
            setSkillInput('');
        }
    };

    const removeSkill = (skill: string) => {
        setResumeData({
            ...resumeData,
            skills: resumeData.skills.filter((s) => s !== skill),
        });
    };

    const handleSkillInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    };

    const saveResume = () => {
        const resumeJSON = JSON.stringify(resumeData, null, 2);
        const blob = new Blob([resumeJSON], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_resume.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const renderEditor = () => {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Resume Editor</h2>
                    <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={saveResume} leftIcon={<Save className="w-4 h-4" />}>
                            Save
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsMobilePreviewVisible(!isMobilePreviewVisible)}
                            leftIcon={isMobilePreviewVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            className="sm:hidden"
                        >
                            {isMobilePreviewVisible ? 'Hide Preview' : 'Show Preview'}
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <div className="flex border-b">
                        <button
                            className={`px-4 py-2 text-sm font-medium ${activeSection === 'personalInfo'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-slate-600 hover:text-slate-800'
                                }`}
                            onClick={() => setActiveSection('personalInfo')}
                        >
                            Personal Info
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium ${activeSection === 'workExperience'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-slate-600 hover:text-slate-800'
                                }`}
                            onClick={() => setActiveSection('workExperience')}
                        >
                            Experience
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium ${activeSection === 'education'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-slate-600 hover:text-slate-800'
                                }`}
                            onClick={() => setActiveSection('education')}
                        >
                            Education
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium ${activeSection === 'skills'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-slate-600 hover:text-slate-800'
                                }`}
                            onClick={() => setActiveSection('skills')}
                        >
                            Skills
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium ${activeSection === 'projects'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-slate-600 hover:text-slate-800'
                                }`}
                            onClick={() => setActiveSection('projects')}
                        >
                            Projects
                        </button>
                    </div>

                    <div className="p-4">
                        {activeSection === 'personalInfo' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-slate-300 rounded-md"
                                            value={resumeData.personalInfo.name}
                                            onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-slate-300 rounded-md"
                                            value={resumeData.personalInfo.title}
                                            onChange={(e) => handlePersonalInfoChange('title', e.target.value)}
                                            placeholder="Senior Software Engineer"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            className="w-full p-2 border border-slate-300 rounded-md"
                                            value={resumeData.personalInfo.email}
                                            onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                                            placeholder="john.doe@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            className="w-full p-2 border border-slate-300 rounded-md"
                                            value={resumeData.personalInfo.phone}
                                            onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                                            placeholder="(123) 456-7890"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-slate-300 rounded-md"
                                        value={resumeData.personalInfo.location}
                                        onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                                        placeholder="San Francisco, CA"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Professional Summary</label>
                                    <textarea
                                        className="w-full p-2 border border-slate-300 rounded-md"
                                        rows={4}
                                        value={resumeData.personalInfo.summary}
                                        onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
                                        placeholder="A brief summary of your professional background and goals..."
                                    />
                                </div>
                            </div>
                        )}

                        {activeSection === 'workExperience' && (
                            <div className="space-y-6">
                                {resumeData.workExperience.map((exp, index) => (
                                    <div key={exp.id} className="border rounded-md p-4 relative">
                                        {resumeData.workExperience.length > 1 && (
                                            <button
                                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                                onClick={() => removeWorkExperience(exp.id)}
                                            >
                                                Remove
                                            </button>
                                        )}
                                        <h3 className="font-medium text-slate-800 mb-3">
                                            Work Experience {index + 1}
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-2 border border-slate-300 rounded-md"
                                                        value={exp.title}
                                                        onChange={(e) => handleWorkExperienceChange(exp.id, 'title', e.target.value)}
                                                        placeholder="Software Engineer"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-2 border border-slate-300 rounded-md"
                                                        value={exp.company}
                                                        onChange={(e) => handleWorkExperienceChange(exp.id, 'company', e.target.value)}
                                                        placeholder="Company Name"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2 border border-slate-300 rounded-md"
                                                    value={exp.location}
                                                    onChange={(e) => handleWorkExperienceChange(exp.id, 'location', e.target.value)}
                                                    placeholder="San Francisco, CA"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-2 border border-slate-300 rounded-md"
                                                        value={exp.startDate}
                                                        onChange={(e) => handleWorkExperienceChange(exp.id, 'startDate', e.target.value)}
                                                        placeholder="Jun 2018"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                                                    <div className="flex items-center justify-between">
                                                        <input
                                                            type="text"
                                                            className="w-full p-2 border border-slate-300 rounded-md"
                                                            value={exp.endDate}
                                                            onChange={(e) => handleWorkExperienceChange(exp.id, 'endDate', e.target.value)}
                                                            placeholder="Present"
                                                            disabled={exp.current}
                                                        />
                                                        <div className="ml-2 flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                id={`current-job-${exp.id}`}
                                                                checked={exp.current}
                                                                onChange={(e) => {
                                                                    handleWorkExperienceChange(exp.id, 'current', e.target.checked);
                                                                    if (e.target.checked) {
                                                                        handleWorkExperienceChange(exp.id, 'endDate', 'Present');
                                                                    }
                                                                }}
                                                                className="mr-1"
                                                            />
                                                            <label htmlFor={`current-job-${exp.id}`} className="text-sm text-slate-700">
                                                                Current
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                                <textarea
                                                    className="w-full p-2 border border-slate-300 rounded-md"
                                                    rows={4}
                                                    value={exp.description}
                                                    onChange={(e) => handleWorkExperienceChange(exp.id, 'description', e.target.value)}
                                                    placeholder="Describe your responsibilities and achievements..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex justify-center">
                                    <Button
                                        variant="outline"
                                        onClick={addWorkExperience}
                                        leftIcon={<Plus className="h-4 w-4" />}
                                    >
                                        Add Work Experience
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeSection === 'education' && (
                            <div className="space-y-6">
                                {resumeData.education.map((edu, index) => (
                                    <div key={edu.id} className="border rounded-md p-4 relative">
                                        {resumeData.education.length > 1 && (
                                            <button
                                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                                onClick={() => removeEducation(edu.id)}
                                            >
                                                Remove
                                            </button>
                                        )}
                                        <h3 className="font-medium text-slate-800 mb-3">
                                            Education {index + 1}
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Degree</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-2 border border-slate-300 rounded-md"
                                                        value={edu.degree}
                                                        onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                                                        placeholder="Bachelor of Science in Computer Science"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Institution</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-2 border border-slate-300 rounded-md"
                                                        value={edu.institution}
                                                        onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)}
                                                        placeholder="University Name"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2 border border-slate-300 rounded-md"
                                                    value={edu.location}
                                                    onChange={(e) => handleEducationChange(edu.id, 'location', e.target.value)}
                                                    placeholder="City, State"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-2 border border-slate-300 rounded-md"
                                                        value={edu.startDate}
                                                        onChange={(e) => handleEducationChange(edu.id, 'startDate', e.target.value)}
                                                        placeholder="Sep 2014"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-2 border border-slate-300 rounded-md"
                                                        value={edu.endDate}
                                                        onChange={(e) => handleEducationChange(edu.id, 'endDate', e.target.value)}
                                                        placeholder="May 2018"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                                <textarea
                                                    className="w-full p-2 border border-slate-300 rounded-md"
                                                    rows={3}
                                                    value={edu.description}
                                                    onChange={(e) => handleEducationChange(edu.id, 'description', e.target.value)}
                                                    placeholder="Relevant coursework, achievements, etc..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex justify-center">
                                    <Button
                                        variant="outline"
                                        onClick={addEducation}
                                        leftIcon={<Plus className="h-4 w-4" />}
                                    >
                                        Add Education
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeSection === 'skills' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Add Skills</label>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            className="flex-1 p-2 border border-slate-300 rounded-l-md"
                                            value={skillInput}
                                            onChange={(e) => setSkillInput(e.target.value)}
                                            onKeyDown={handleSkillInputKeyDown}
                                            placeholder="E.g., JavaScript, React, TypeScript"
                                        />
                                        <Button
                                            onClick={addSkill}
                                            className="rounded-l-none"
                                        >
                                            Add
                                        </Button>
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500">Press Enter to add multiple skills</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Your Skills</label>
                                    <div className="flex flex-wrap gap-2">
                                        {resumeData.skills.length > 0 ? (
                                            resumeData.skills.map((skill) => (
                                                <div
                                                    key={skill}
                                                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center"
                                                >
                                                    {skill}
                                                    <button
                                                        className="ml-1.5 text-blue-500 hover:text-blue-700"
                                                        onClick={() => removeSkill(skill)}
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
                        )}

                        {activeSection === 'projects' && (
                            <div className="space-y-6">
                                {resumeData.projects.map((project, index) => (
                                    <div key={project.id} className="border rounded-md p-4 relative">
                                        {resumeData.projects.length > 1 && (
                                            <button
                                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                                onClick={() => removeProject(project.id)}
                                            >
                                                Remove
                                            </button>
                                        )}
                                        <h3 className="font-medium text-slate-800 mb-3">
                                            Project {index + 1}
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2 border border-slate-300 rounded-md"
                                                    value={project.name}
                                                    onChange={(e) => handleProjectChange(project.id, 'name', e.target.value)}
                                                    placeholder="E-commerce Website"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                                <textarea
                                                    className="w-full p-2 border border-slate-300 rounded-md"
                                                    rows={3}
                                                    value={project.description}
                                                    onChange={(e) => handleProjectChange(project.id, 'description', e.target.value)}
                                                    placeholder="Brief description of the project..."
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Technologies Used</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2 border border-slate-300 rounded-md"
                                                    value={project.technologies}
                                                    onChange={(e) => handleProjectChange(project.id, 'technologies', e.target.value)}
                                                    placeholder="React, Node.js, MongoDB"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Project Link</label>
                                                <input
                                                    type="url"
                                                    className="w-full p-2 border border-slate-300 rounded-md"
                                                    value={project.link}
                                                    onChange={(e) => handleProjectChange(project.id, 'link', e.target.value)}
                                                    placeholder="https://github.com/yourusername/project"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex justify-center">
                                    <Button
                                        variant="outline"
                                        onClick={addProject}
                                        leftIcon={<Plus className="h-4 w-4" />}
                                    >
                                        Add Project
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderPreview = () => {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Live Preview</h2>
                    <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                        Download PDF
                    </Button>
                </div>

                <div className="bg-white rounded-lg shadow p-6 max-w-[800px] mx-auto border border-slate-200">
                    {/* Header */}
                    <div className="mb-6 text-center pb-4 border-b border-slate-200">
                        <h1 className="text-2xl font-bold text-slate-900 mb-1">
                            {resumeData.personalInfo.name || 'Your Name'}
                        </h1>
                        {resumeData.personalInfo.title && (
                            <p className="text-lg text-slate-600">{resumeData.personalInfo.title}</p>
                        )}
                        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2 text-sm text-slate-600">
                            {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                            {resumeData.personalInfo.phone && (
                                <>
                                    <span className="hidden sm:inline">•</span>
                                    <span>{resumeData.personalInfo.phone}</span>
                                </>
                            )}
                            {resumeData.personalInfo.location && (
                                <>
                                    <span className="hidden sm:inline">•</span>
                                    <span>{resumeData.personalInfo.location}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Summary */}
                    {resumeData.personalInfo.summary && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-slate-800 mb-2 border-b border-slate-200 pb-1">
                                Professional Summary
                            </h2>
                            <p className="text-slate-700">{resumeData.personalInfo.summary}</p>
                        </div>
                    )}

                    {/* Work Experience */}
                    {resumeData.workExperience.some(
                        (exp) => exp.title || exp.company || exp.description
                    ) && (
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-slate-800 mb-2 flex items-center border-b border-slate-200 pb-1">
                                    <Briefcase className="w-5 h-5 mr-1" /> Experience
                                </h2>
                                <div className="space-y-4">
                                    {resumeData.workExperience
                                        .filter((exp) => exp.title || exp.company || exp.description)
                                        .map((exp, index) => (
                                            <div key={index} className="ml-1">
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1">
                                                    <h3 className="font-medium text-slate-800">
                                                        {exp.title ? exp.title : 'Position'}{' '}
                                                        {exp.company && <span className="text-slate-700">at {exp.company}</span>}
                                                    </h3>
                                                    <div className="text-sm text-slate-600">
                                                        {exp.startDate} - {exp.endDate || 'Present'}
                                                        {exp.location && <span> | {exp.location}</span>}
                                                    </div>
                                                </div>
                                                {exp.description && <p className="text-slate-700 text-sm whitespace-pre-line">{exp.description}</p>}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                    {/* Education */}
                    {resumeData.education.some(
                        (edu) => edu.degree || edu.institution || edu.description
                    ) && (
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-slate-800 mb-2 flex items-center border-b border-slate-200 pb-1">
                                    <BookOpen className="w-5 h-5 mr-1" /> Education
                                </h2>
                                <div className="space-y-4">
                                    {resumeData.education
                                        .filter((edu) => edu.degree || edu.institution || edu.description)
                                        .map((edu, index) => (
                                            <div key={index} className="ml-1">
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1">
                                                    <h3 className="font-medium text-slate-800">
                                                        {edu.degree ? edu.degree : 'Degree'}{' '}
                                                        {edu.institution && <span className="text-slate-700">from {edu.institution}</span>}
                                                    </h3>
                                                    <div className="text-sm text-slate-600">
                                                        {edu.startDate} - {edu.endDate}
                                                        {edu.location && <span> | {edu.location}</span>}
                                                    </div>
                                                </div>
                                                {edu.description && <p className="text-slate-700 text-sm">{edu.description}</p>}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                    {/* Skills */}
                    {resumeData.skills.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-slate-800 mb-2 flex items-center border-b border-slate-200 pb-1">
                                <Code className="w-5 h-5 mr-1" /> Skills
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {resumeData.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-sm"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Projects */}
                    {resumeData.projects.some(
                        (project) => project.name || project.description
                    ) && (
                            <div>
                                <h2 className="text-lg font-semibold text-slate-800 mb-2 flex items-center border-b border-slate-200 pb-1">
                                    <Award className="w-5 h-5 mr-1" /> Projects
                                </h2>
                                <div className="space-y-4">
                                    {resumeData.projects
                                        .filter((project) => project.name || project.description)
                                        .map((project, index) => (
                                            <div key={index} className="ml-1">
                                                <h3 className="font-medium text-slate-800 mb-1">
                                                    {project.name || 'Project Name'}
                                                    {project.link && (
                                                        <a
                                                            href={project.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                                                        >
                                                            View Project
                                                        </a>
                                                    )}
                                                </h3>
                                                {project.technologies && (
                                                    <p className="text-sm text-slate-600 mb-1">
                                                        Technologies: {project.technologies}
                                                    </p>
                                                )}
                                                {project.description && (
                                                    <p className="text-slate-700 text-sm">{project.description}</p>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Create Your Resume</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`${isMobilePreviewVisible ? 'hidden' : 'block'} sm:block`}>
                    {renderEditor()}
                </div>
                <div className={`${isMobilePreviewVisible ? 'block' : 'hidden'} sm:block`}>
                    {renderPreview()}
                </div>
            </div>
        </div>
    );
};

export default CreateResume; 