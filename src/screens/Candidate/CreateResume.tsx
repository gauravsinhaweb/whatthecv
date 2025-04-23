import { Award, BookOpen, Briefcase, Code, Download, Eye, EyeOff, Layout, Maximize2, Minimize2, Palette, Plus, Save, User, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import ResumeCustomizationPanel, { ResumeCustomizationOptions } from '../../components/resume/ResumeCustomizationPanel';

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
        name: 'Alex Johnson',
        title: 'Senior Software Engineer',
        email: 'alex.johnson@example.com',
        phone: '(555) 123-4567',
        location: 'San Francisco, CA',
        summary: 'Experienced software engineer with over 8 years of expertise in full-stack web development, specializing in React, Node.js, and cloud infrastructure. Passionate about creating scalable, user-friendly applications and mentoring junior developers.',
    },
    workExperience: [
        {
            id: '1',
            title: 'Senior Software Engineer',
            company: 'TechCorp Inc.',
            location: 'San Francisco, CA',
            startDate: 'Jan 2020',
            endDate: 'Present',
            current: true,
            description: '• Led a team of 5 developers to build and maintain a high-traffic SaaS platform\n• Redesigned authentication system, improving security and reducing login time by 40%\n• Implemented CI/CD pipeline using GitHub Actions, reducing deployment time by 60%\n• Mentored junior developers and conducted code reviews',
        },
        {
            id: '2',
            title: 'Software Engineer',
            company: 'WebSolutions LLC',
            location: 'Oakland, CA',
            startDate: 'Mar 2017',
            endDate: 'Dec 2019',
            current: false,
            description: '• Developed and maintained multiple client-facing web applications using React and Node.js\n• Optimized database queries, improving application performance by 35%\n• Collaborated with UX designers to implement responsive and accessible interfaces\n• Participated in agile development processes and daily scrums',
        },
        {
            id: '3',
            title: 'Junior Developer',
            company: 'StartUp Vision',
            location: 'San Jose, CA',
            startDate: 'Jun 2015',
            endDate: 'Feb 2017',
            current: false,
            description: '• Built and maintained features for a customer-facing mobile app\n• Collaborated with the QA team to identify and fix bugs\n• Participated in code reviews and implemented feedback',
        },
    ],
    education: [
        {
            id: '1',
            degree: 'Master of Science in Computer Science',
            institution: 'Stanford University',
            location: 'Stanford, CA',
            startDate: 'Aug 2013',
            endDate: 'May 2015',
            description: 'Specialized in Human-Computer Interaction and Machine Learning. GPA: 3.85',
        },
        {
            id: '2',
            degree: 'Bachelor of Science in Computer Engineering',
            institution: 'University of California, Berkeley',
            location: 'Berkeley, CA',
            startDate: 'Aug 2009',
            endDate: 'May 2013',
            description: 'Minor in Mathematics. Dean\'s List for 6 semesters. GPA: 3.7',
        },
    ],
    skills: [
        'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'GraphQL',
        'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'CI/CD', 'Jest', 'Cypress',
        'Agile Methodology', 'Git', 'RESTful APIs'
    ],
    projects: [
        {
            id: '1',
            name: 'E-commerce Platform',
            description: 'Developed a full-featured e-commerce platform with React, Node.js, and MongoDB. Implemented payment processing, inventory management, and analytics dashboard.',
            technologies: 'React, Redux, Node.js, Express, MongoDB, Stripe API',
            link: 'https://github.com/alexj/ecommerce-platform',
        },
        {
            id: '2',
            name: 'Task Management App',
            description: 'Built a collaborative task management application with real-time updates and notifications. Features include Kanban boards, task assignments, and deadline tracking.',
            technologies: 'React, Firebase, Material-UI, Jest',
            link: 'https://github.com/alexj/task-master',
        },
    ],
};

const defaultCustomizationOptions: ResumeCustomizationOptions = {
    layout: {
        columns: 'one',
        sectionOrder: ['personalInfo', 'workExperience', 'education', 'skills', 'projects'],
    },
    colors: {
        mode: 'basic',
        type: 'single',
        accent: '#2563eb',
        headings: '#1e3a8a',
        text: '#000000',
        background: '#ffffff',
    },
    spacing: {
        fontSize: 9,
        lineHeight: 1.2,
        margins: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
        },
        sectionSpacing: 10,
    },
    font: {
        family: 'sans',
        specificFont: 'Source Sans Pro',
        headingStyle: {
            capitalization: 'capitalize',
            size: 'm',
            icons: 'none',
        },
    },
    header: {
        details: {
            icon: 'bullet',
            shape: 'none',
        },
        nameSize: 'l',
        nameBold: true,
        jobTitleSize: 'm',
        jobTitlePosition: 'same-line',
        jobTitleStyle: 'normal',
        showPhoto: false,
    },
    footer: {
        showPageNumbers: true,
        showEmail: true,
        showName: true,
    },
};

const CreateResume: React.FC = () => {
    const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
    const [skillInput, setSkillInput] = useState('');
    const [activeSection, setActiveSection] = useState<string>('personalInfo');
    const [isMobilePreviewVisible, setIsMobilePreviewVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<string>('content');
    const [customizationOptions, setCustomizationOptions] = useState<ResumeCustomizationOptions>(defaultCustomizationOptions);
    const [isFullScreenPreview, setIsFullScreenPreview] = useState(false);
    const [previewScale, setPreviewScale] = useState(100);

    // Handle escape key to close modal
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isFullScreenPreview) {
                setIsFullScreenPreview(false);
            }
        };

        document.addEventListener('keydown', handleEscKey);

        // Lock body scroll when modal is open
        if (isFullScreenPreview) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = '';
        };
    }, [isFullScreenPreview]);

    const handleZoomIn = () => {
        setPreviewScale(prev => Math.min(prev + 10, 150));
    };

    const handleZoomOut = () => {
        setPreviewScale(prev => Math.max(prev - 10, 50));
    };

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

    const saveResumeWithOptions = () => {
        const completeData = {
            resumeData,
            customizationOptions,
        };
        const dataJSON = JSON.stringify(completeData, null, 2);
        const blob = new Blob([dataJSON], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_complete_resume.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const saveAsDraft = () => {
        // In a real app, this would communicate with a backend API
        // For now, we'll simulate by saving to localStorage
        const completeData = {
            resumeData,
            customizationOptions,
            savedAt: new Date().toISOString(),
            isDraft: true,
        };
        localStorage.setItem('resumeDraft', JSON.stringify(completeData));
        alert('Resume saved as draft');
    };

    const renderEditor = () => {
        return (
            <div className="bg-white rounded-lg shadow-md border border-slate-200">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-800">Resume Content</h2>
                    <div className="flex space-x-2">
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

                <div className="flex border-b border-slate-200 bg-slate-50">
                    <button
                        className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeSection === 'personalInfo'
                            ? 'text-blue-600 bg-white border-t-2 border-blue-600'
                            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                            }`}
                        onClick={() => setActiveSection('personalInfo')}
                    >
                        <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            Personal Info
                        </div>
                        {activeSection === 'personalInfo' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
                        )}
                    </button>
                    <button
                        className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeSection === 'workExperience'
                            ? 'text-blue-600 bg-white border-t-2 border-blue-600'
                            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                            }`}
                        onClick={() => setActiveSection('workExperience')}
                    >
                        <div className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-2" />
                            Experience
                        </div>
                        {activeSection === 'workExperience' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
                        )}
                    </button>
                    <button
                        className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeSection === 'education'
                            ? 'text-blue-600 bg-white border-t-2 border-blue-600'
                            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                            }`}
                        onClick={() => setActiveSection('education')}
                    >
                        <div className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Education
                        </div>
                        {activeSection === 'education' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
                        )}
                    </button>
                    <button
                        className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeSection === 'skills'
                            ? 'text-blue-600 bg-white border-t-2 border-blue-600'
                            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                            }`}
                        onClick={() => setActiveSection('skills')}
                    >
                        <div className="flex items-center">
                            <Code className="w-4 h-4 mr-2" />
                            Skills
                        </div>
                        {activeSection === 'skills' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
                        )}
                    </button>
                    <button
                        className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeSection === 'projects'
                            ? 'text-blue-600 bg-white border-t-2 border-blue-600'
                            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                            }`}
                        onClick={() => setActiveSection('projects')}
                    >
                        <div className="flex items-center">
                            <Award className="w-4 h-4 mr-2" />
                            Projects
                        </div>
                        {activeSection === 'projects' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
                        )}
                    </button>
                </div>

                <div className="p-6 max-h-[calc(100vh-240px)] overflow-y-auto">
                    {activeSection === 'personalInfo' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-slate-300 rounded-md"
                                        value={resumeData.personalInfo.name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePersonalInfoChange('name', e.currentTarget.value)}
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-slate-300 rounded-md"
                                        value={resumeData.personalInfo.title}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePersonalInfoChange('title', e.currentTarget.value)}
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
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePersonalInfoChange('email', e.currentTarget.value)}
                                        placeholder="john.doe@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        className="w-full p-2 border border-slate-300 rounded-md"
                                        value={resumeData.personalInfo.phone}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePersonalInfoChange('phone', e.currentTarget.value)}
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
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePersonalInfoChange('location', e.currentTarget.value)}
                                    placeholder="San Francisco, CA"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Professional Summary</label>
                                <textarea
                                    className="w-full p-2 border border-slate-300 rounded-md"
                                    rows={4}
                                    value={resumeData.personalInfo.summary}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handlePersonalInfoChange('summary', e.currentTarget.value)}
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
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleWorkExperienceChange(exp.id, 'title', e.currentTarget.value)}
                                                    placeholder="Software Engineer"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2 border border-slate-300 rounded-md"
                                                    value={exp.company}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleWorkExperienceChange(exp.id, 'company', e.currentTarget.value)}
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
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleWorkExperienceChange(exp.id, 'location', e.currentTarget.value)}
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
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleWorkExperienceChange(exp.id, 'startDate', e.currentTarget.value)}
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
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleWorkExperienceChange(exp.id, 'endDate', e.currentTarget.value)}
                                                        placeholder="Present"
                                                        disabled={exp.current}
                                                    />
                                                    <div className="ml-2 flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            id={`current-job-${exp.id}`}
                                                            checked={exp.current}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                handleWorkExperienceChange(exp.id, 'current', e.currentTarget.checked);
                                                                if (e.currentTarget.checked) {
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
                                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleWorkExperienceChange(exp.id, 'description', e.currentTarget.value)}
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
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEducationChange(edu.id, 'degree', e.currentTarget.value)}
                                                    placeholder="Bachelor of Science in Computer Science"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Institution</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2 border border-slate-300 rounded-md"
                                                    value={edu.institution}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEducationChange(edu.id, 'institution', e.currentTarget.value)}
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
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEducationChange(edu.id, 'location', e.currentTarget.value)}
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
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEducationChange(edu.id, 'startDate', e.currentTarget.value)}
                                                    placeholder="Sep 2014"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2 border border-slate-300 rounded-md"
                                                    value={edu.endDate}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEducationChange(edu.id, 'endDate', e.currentTarget.value)}
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
                                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleEducationChange(edu.id, 'description', e.currentTarget.value)}
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
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSkillInput(e.currentTarget.value)}
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
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleProjectChange(project.id, 'name', e.currentTarget.value)}
                                                placeholder="E-commerce Website"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                            <textarea
                                                className="w-full p-2 border border-slate-300 rounded-md"
                                                rows={3}
                                                value={project.description}
                                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleProjectChange(project.id, 'description', e.currentTarget.value)}
                                                placeholder="Brief description of the project..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Technologies Used</label>
                                            <input
                                                type="text"
                                                className="w-full p-2 border border-slate-300 rounded-md"
                                                value={project.technologies}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleProjectChange(project.id, 'technologies', e.currentTarget.value)}
                                                placeholder="React, Node.js, MongoDB"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Project Link</label>
                                            <input
                                                type="url"
                                                className="w-full p-2 border border-slate-300 rounded-md"
                                                value={project.link}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleProjectChange(project.id, 'link', e.currentTarget.value)}
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
        );
    };

    const renderResumeDocument = (fullScreen = false) => {
        // Generate dynamic styles based on customization options
        const getHeadingStyle = () => {
            let style = {};
            const { headingStyle } = customizationOptions.font;

            // Text transform based on capitalization
            if (headingStyle.capitalization === 'uppercase') {
                style = { ...style, textTransform: 'uppercase' };
            } else if (headingStyle.capitalization === 'capitalize') {
                style = { ...style, textTransform: 'capitalize' };
            }

            // Font size based on size option
            const fontSizeMap = {
                s: '1rem',
                m: '1.125rem',
                l: '1.25rem',
                xl: '1.375rem',
            };
            style = { ...style, fontSize: fontSizeMap[headingStyle.size] };

            // Add color
            style = { ...style, color: customizationOptions.colors.headings };

            return style;
        };

        const getNameStyle = () => {
            let style = {};

            // Font size based on nameSize
            const fontSizeMap = {
                xs: '1.5rem',
                s: '1.75rem',
                m: '2rem',
                l: '2.25rem',
                xl: '2.5rem',
            };
            style = { ...style, fontSize: fontSizeMap[customizationOptions.header.nameSize] };

            // Font weight based on nameBold
            if (customizationOptions.header.nameBold) {
                style = { ...style, fontWeight: 'bold' };
            }

            return style;
        };

        const getTitleStyle = () => {
            let style = {};

            // Font size based on jobTitleSize
            const fontSizeMap = {
                s: '1rem',
                m: '1.125rem',
                l: '1.25rem',
            };
            style = { ...style, fontSize: fontSizeMap[customizationOptions.header.jobTitleSize] };

            // Font style based on jobTitleStyle
            if (customizationOptions.header.jobTitleStyle === 'italic') {
                style = { ...style, fontStyle: 'italic' };
            }

            return style;
        };

        // Get background style
        const getBackgroundStyle = () => {
            if (customizationOptions.colors.type === 'image' && customizationOptions.colors.backgroundImage) {
                return {
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${customizationOptions.colors.backgroundImage})`,
                    backgroundSize: 'cover',
                    color: '#ffffff',
                };
            } else if (customizationOptions.colors.type === 'multi') {
                return {
                    backgroundColor: customizationOptions.colors.background,
                    color: customizationOptions.colors.text,
                };
            }

            return {
                backgroundColor: '#ffffff',
                color: '#000000',
            };
        };

        // Get container style with margins
        const getContainerStyle = () => {
            const { margins } = customizationOptions.spacing;
            return {
                padding: `${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm`,
            };
        };

        // Get section spacing
        const getSectionStyle = () => {
            return {
                marginBottom: `${customizationOptions.spacing.sectionSpacing}mm`,
            };
        };

        // Get content style
        const getContentStyle = () => {
            return {
                fontSize: `${customizationOptions.spacing.fontSize}pt`,
                lineHeight: customizationOptions.spacing.lineHeight,
                fontFamily: customizationOptions.font.specificFont ||
                    (customizationOptions.font.family === 'serif' ? 'Georgia, serif' :
                        customizationOptions.font.family === 'mono' ? 'monospace' :
                            'Helvetica, Arial, sans-serif'),
            };
        };

        // Use existing styling functions
        const scale = fullScreen ? previewScale / 100 : 0.85;

        return (
            <div
                className={`bg-white rounded mx-auto border border-slate-200 overflow-hidden shadow-lg transition-all`}
                style={{
                    ...getBackgroundStyle(),
                    // width: '210mm',
                    // height: '297mm',
                    maxHeight: fullScreen ? 'none' : '80vh',
                    // transform: fullScreen ? `scale(${scale})` : `scale(0.85)`,
                    boxShadow: '0 0 8px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.05), 0 8px 16px rgba(0, 0, 0, 0.05)',
                }}
            >
                <div
                    style={{
                        ...getContainerStyle(),
                        height: '100%',
                        overflowY: 'auto',
                        position: 'relative',
                        backgroundImage: customizationOptions.colors.type !== 'image' ? 'linear-gradient(rgba(0, 0, 0, 0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.01) 1px, transparent 1px)' : undefined,
                        backgroundSize: '10mm 10mm',
                    }}
                >
                    {/* Header */}
                    <div className="mb-6 text-center pb-4 border-b" style={getSectionStyle()}>
                        <h1 style={getNameStyle()}>
                            {resumeData.personalInfo.name || 'Your Name'}
                        </h1>
                        {resumeData.personalInfo.title && (
                            <p style={getTitleStyle()}>
                                {resumeData.personalInfo.title}
                            </p>
                        )}
                        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2 text-sm">
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

                    <div style={getContentStyle()}>
                        {/* Summary */}
                        {resumeData.personalInfo.summary && (
                            <div style={getSectionStyle()}>
                                <h2 style={getHeadingStyle()} className="mb-2 border-b border-slate-200 pb-1">
                                    Professional Summary
                                </h2>
                                <p>{resumeData.personalInfo.summary}</p>
                            </div>
                        )}

                        {/* Work Experience */}
                        {resumeData.workExperience.some(
                            (exp) => exp.title || exp.company || exp.description
                        ) && (
                                <div style={getSectionStyle()}>
                                    <h2 style={getHeadingStyle()} className="mb-2 flex items-center border-b border-slate-200 pb-1">
                                        <Briefcase className="w-5 h-5 mr-1" /> Experience
                                    </h2>
                                    <div className="space-y-4">
                                        {resumeData.workExperience
                                            .filter((exp) => exp.title || exp.company || exp.description)
                                            .map((exp, index) => (
                                                <div key={index} className="ml-1">
                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1">
                                                        <h3 className="font-medium">
                                                            {exp.title ? exp.title : 'Position'}{' '}
                                                            {exp.company && <span>at {exp.company}</span>}
                                                        </h3>
                                                        <div className="text-sm">
                                                            {exp.startDate} - {exp.endDate || 'Present'}
                                                            {exp.location && <span> | {exp.location}</span>}
                                                        </div>
                                                    </div>
                                                    {exp.description && <p className="text-sm whitespace-pre-line">{exp.description}</p>}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                        {/* Education */}
                        {resumeData.education.some(
                            (edu) => edu.degree || edu.institution || edu.description
                        ) && (
                                <div style={getSectionStyle()}>
                                    <h2 style={getHeadingStyle()} className="mb-2 flex items-center border-b border-slate-200 pb-1">
                                        <BookOpen className="w-5 h-5 mr-1" /> Education
                                    </h2>
                                    <div className="space-y-4">
                                        {resumeData.education
                                            .filter((edu) => edu.degree || edu.institution || edu.description)
                                            .map((edu, index) => (
                                                <div key={index} className="ml-1">
                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1">
                                                        <h3 className="font-medium">
                                                            {edu.degree ? edu.degree : 'Degree'}{' '}
                                                            {edu.institution && <span>from {edu.institution}</span>}
                                                        </h3>
                                                        <div className="text-sm">
                                                            {edu.startDate} - {edu.endDate}
                                                            {edu.location && <span> | {edu.location}</span>}
                                                        </div>
                                                    </div>
                                                    {edu.description && <p className="text-sm">{edu.description}</p>}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                        {/* Skills */}
                        {resumeData.skills.length > 0 && (
                            <div style={getSectionStyle()}>
                                <h2 style={getHeadingStyle()} className="mb-2 flex items-center border-b border-slate-200 pb-1">
                                    <Code className="w-5 h-5 mr-1" /> Skills
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {resumeData.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-2 py-1 rounded text-sm"
                                            style={{ backgroundColor: `${customizationOptions.colors.accent}20` }}
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
                                <div style={getSectionStyle()}>
                                    <h2 style={getHeadingStyle()} className="mb-2 flex items-center border-b border-slate-200 pb-1">
                                        <Award className="w-5 h-5 mr-1" /> Projects
                                    </h2>
                                    <div className="space-y-4">
                                        {resumeData.projects
                                            .filter((project) => project.name || project.description)
                                            .map((project, index) => (
                                                <div key={index} className="ml-1">
                                                    <h3 className="font-medium mb-1">
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
                                                        <p className="text-sm mb-1">
                                                            Technologies: {project.technologies}
                                                        </p>
                                                    )}
                                                    {project.description && (
                                                        <p className="text-sm">{project.description}</p>
                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                    </div>

                    {/* Footer if enabled */}
                    {(customizationOptions.footer.showPageNumbers ||
                        customizationOptions.footer.showEmail ||
                        customizationOptions.footer.showName) && (
                            <div className="mt-8 pt-2 border-t border-slate-200 text-xs text-center">
                                {customizationOptions.footer.showName && resumeData.personalInfo.name && (
                                    <span>{resumeData.personalInfo.name}</span>
                                )}
                                {customizationOptions.footer.showEmail && resumeData.personalInfo.email && (
                                    <span>{customizationOptions.footer.showName ? ' • ' : ''}{resumeData.personalInfo.email}</span>
                                )}
                                {customizationOptions.footer.showPageNumbers && (
                                    <span>{(customizationOptions.footer.showName || customizationOptions.footer.showEmail) ? ' • ' : ''}Page 1</span>
                                )}
                            </div>
                        )}
                </div>
            </div>
        );
    };

    const renderPreview = () => {
        return (
            <div className="bg-white rounded-lg shadow-md border border-slate-200">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-800">Preview</h2>
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Maximize2 className="w-4 h-4" />}
                            onClick={() => setIsFullScreenPreview(true)}
                        >
                            Full Screen
                        </Button>
                    </div>
                </div>

                <div
                    className="flex justify-center  bg-slate-100/50 cursor-pointer"
                    onClick={() => setIsFullScreenPreview(true)}
                >
                    {renderResumeDocument()}
                </div>
            </div>
        );
    };

    // Full-screen modal for the preview
    const renderFullScreenModal = () => {
        if (!isFullScreenPreview) return null;

        return (
            <div
                className="fixed inset-0 z-50 flex flex-col items-center justify-start bg-black/85 backdrop-blur-md transition-all"
                style={{ animation: 'fadeIn 0.2s ease-out' }}
            >
                {/* Top control bar */}
                <div className="sticky top-0 w-full bg-gradient-to-b from-black/70 to-transparent py-4 px-4 z-10">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                className="group p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors mr-4"
                                onClick={() => setIsFullScreenPreview(false)}
                                title="Close Preview"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                            <h2 className="text-white text-lg font-medium hidden sm:block">{resumeData.personalInfo.name || 'Resume Preview'}</h2>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                <button
                                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                    onClick={handleZoomOut}
                                    title="Zoom Out"
                                >
                                    <span className="text-white font-medium">-</span>
                                </button>
                                <span className="mx-3 text-white text-sm font-medium">{previewScale}%</span>
                                <button
                                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                    onClick={handleZoomIn}
                                    title="Zoom In"
                                >
                                    <span className="text-white font-medium">+</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content container */}
                <div
                    className="flex-1 w-full flex items-start justify-center pt-4 pb-8 px-4 overflow-auto scrollbar-hide"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setIsFullScreenPreview(false);
                        }
                    }}
                >
                    <div
                        className="w-[60%] transform transition-all duration-300 bg-white rounded-lg shadow-2xl"
                        style={{
                            animation: 'scaleIn 0.3s ease-out',
                            minHeight: '90%',
                            maxWidth: '840px',
                            transform: `scale(${previewScale / 100})`,
                            transformOrigin: 'top center',
                            boxShadow: '0 0 40px rgba(0, 0, 0, 0.2)'
                        }}
                    >
                        {renderResumeDocument(true)}
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes scaleIn {
                        from { transform: scale(0.9); }
                        to { transform: scale(1); }
                    }
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                    .scrollbar-hide {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}} />
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            {renderFullScreenModal()}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Create Your Resume</h1>
                <div className="hidden md:flex space-x-2">
                    <Button variant="outline" onClick={saveAsDraft}>
                        Save as Draft
                    </Button>
                    <Button variant="primary" onClick={saveResumeWithOptions}>
                        Save Resume
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-slate-200 mb-6">
                <div className="flex border-b border-slate-200">
                    <button
                        className={`flex-1 py-4 px-6 font-medium transition-colors relative ${activeTab === 'content'
                            ? 'text-blue-600 border-t-2 border-blue-600'
                            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                            }`}
                        onClick={() => setActiveTab('content')}
                    >
                        <div className="flex items-center justify-center">
                            <Layout className="w-5 h-5 mr-2" />
                            <span>1. Content</span>
                        </div>
                    </button>
                    <button
                        className={`flex-1 py-4 px-6 font-medium transition-colors relative ${activeTab === 'customization'
                            ? 'text-blue-600 border-t-2 border-blue-600'
                            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                            }`}
                        onClick={() => setActiveTab('customization')}
                    >
                        <div className="flex items-center justify-center">
                            <Palette className="w-5 h-5 mr-2" />
                            <span>2. Customization</span>
                        </div>
                    </button>
                </div>
            </div>

            <div className="md:hidden flex mb-6 space-x-2">
                <Button variant="outline" onClick={saveAsDraft} fullWidth>
                    Save as Draft
                </Button>
                <Button variant="primary" onClick={saveResumeWithOptions} fullWidth>
                    Save Resume
                </Button>
            </div>

            {activeTab === 'content' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className={`${isMobilePreviewVisible ? 'hidden' : 'block'} sm:block`}>
                        {renderEditor()}
                    </div>
                    <div className={`${isMobilePreviewVisible ? 'block' : 'hidden'} sm:block`}>
                        {renderPreview()}
                    </div>
                </div>
            )}

            {activeTab === 'customization' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <ResumeCustomizationPanel
                            options={customizationOptions}
                            onChange={setCustomizationOptions}
                            onSave={saveResumeWithOptions}
                            onSaveAsDraft={saveAsDraft}
                        />
                    </div>
                    <div>
                        {renderPreview()}
                    </div>
                </div>
            )}

            <div className="flex justify-center mt-6 text-sm text-slate-500">
                <p>Need help? Check out our <a href="#" className="text-blue-600 hover:underline">resume writing guide</a> or <a href="#" className="text-blue-600 hover:underline">contact support</a>.</p>
            </div>
        </div>
    );
};

export default CreateResume; 