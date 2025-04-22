import React, { useState } from 'react';
import { Upload, FileText, Lock, Eye, ListFilter, Download, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import Button from './ui/Button';
import ResumeUpload from './ResumeUpload';

interface Template {
    id: string;
    name: string;
    description: string;
    previewUrl: string;
    tags: string[];
}

const mockTemplates: Template[] = [
    {
        id: 'modern-tech',
        name: 'Modern Tech',
        description: 'Clean, minimalist design optimized for tech roles',
        previewUrl: '/templates/modern-tech.png',
        tags: ['Software', 'Engineering', 'Minimal']
    },
    {
        id: 'executive',
        name: 'Executive Pro',
        description: 'Professional layout for senior positions',
        previewUrl: '/templates/executive.png',
        tags: ['Leadership', 'Management', 'Corporate']
    },
    {
        id: 'creative-dev',
        name: 'Creative Developer',
        description: 'Showcase your creative and technical skills',
        previewUrl: '/templates/creative-dev.png',
        tags: ['Frontend', 'UI/UX', 'Creative']
    },
    {
        id: 'data-analyst',
        name: 'Data Specialist',
        description: 'Highlight your analytical and technical expertise',
        previewUrl: '/templates/data-analyst.png',
        tags: ['Data Science', 'Analytics', 'Technical']
    }
];

const CandidatePortal: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'upload' | 'templates' | 'settings'>('upload');
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [isPrivate, setIsPrivate] = useState(false);
    const [jobRole, setJobRole] = useState('');
    const [jobDescription, setJobDescription] = useState('');

    const handleTemplateSelect = (templateId: string) => {
        setSelectedTemplate(templateId);
    };

    const renderUploadTab = () => {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Target Job Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Target Role
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-slate-300 rounded-md"
                                            placeholder="e.g. Senior Frontend Developer"
                                            value={jobRole}
                                            onChange={(e) => setJobRole(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Job Description (Optional)
                                        </label>
                                        <textarea
                                            className="w-full p-2 border border-slate-300 rounded-md"
                                            rows={6}
                                            placeholder="Paste the job description here for more accurate analysis..."
                                            value={jobDescription}
                                            onChange={(e) => setJobDescription(e.target.value)}
                                        />
                                        <p className="mt-1 text-xs text-slate-500">
                                            Adding the job description will help customize your resume for this specific role
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Privacy Settings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Lock className="h-5 w-5 text-slate-500 mr-2" />
                                        <span className="text-sm font-medium text-slate-700">Keep Resume Private</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isPrivate}
                                            onChange={() => setIsPrivate(!isPrivate)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <p className="mt-3 text-xs text-slate-500">
                                    {isPrivate
                                        ? "Your resume won't be visible to recruiters on our platform."
                                        : "Recruiters with matching job descriptions can discover your resume."
                                    }
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <ResumeUpload jobDescription={jobDescription} />
            </div>
        );
    };

    const renderTemplatesTab = () => {
        return (
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Select a Template</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockTemplates.map((template) => (
                        <Card
                            key={template.id}
                            className={`cursor-pointer transition-all duration-200 ${selectedTemplate === template.id
                                ? 'border-2 border-blue-500 ring-2 ring-blue-200'
                                : 'hover:border-slate-300'
                                }`}
                            onClick={() => handleTemplateSelect(template.id)}
                        >
                            <CardContent className="p-0 overflow-hidden">
                                <div className="h-48 bg-slate-100 flex items-center justify-center">
                                    <FileText className="h-12 w-12 text-slate-400" />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium text-slate-800 mb-1">{template.name}</h3>
                                    <p className="text-sm text-slate-600 mb-3">{template.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {template.tags.map((tag, i) => (
                                            <span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="mt-8 flex justify-end">
                    <Button>Use Selected Template</Button>
                </div>
            </div>
        );
    };

    const renderSettingsTab = () => {
        return (
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-slate-800 mb-3">Privacy Preferences</h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-slate-700">Recruiter Visibility</p>
                                        <p className="text-sm text-slate-500">Allow recruiters to find your profile and resume</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={!isPrivate}
                                            onChange={() => setIsPrivate(!isPrivate)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-slate-800 mb-3">Export Options</h3>
                                <div className="flex items-center space-x-4">
                                    <Button variant="outline" leftIcon={<Download className="h-4 w-4 mr-2" />}>
                                        Export as PDF
                                    </Button>
                                    <Button variant="outline" leftIcon={<Download className="h-4 w-4 mr-2" />}>
                                        Export as DOCX
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Candidate Dashboard</h1>
                <Button
                    leftIcon={<Plus className="h-4 w-4" />}
                    onClick={() => onNavigate && onNavigate('create-resume')}
                >
                    Create Resume
                </Button>
            </div>

            <div className="border-b border-slate-200 mb-8">
                <div className="flex space-x-8">
                    <button
                        className={`pb-4 font-medium text-sm ${activeTab === 'upload'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-slate-600 hover:text-slate-800'
                            }`}
                        onClick={() => setActiveTab('upload')}
                    >
                        Upload & Analyze
                    </button>
                    <button
                        className={`pb-4 font-medium text-sm ${activeTab === 'templates'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-slate-600 hover:text-slate-800'
                            }`}
                        onClick={() => setActiveTab('templates')}
                    >
                        Resume Templates
                    </button>
                    <button
                        className={`pb-4 font-medium text-sm ${activeTab === 'settings'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-slate-600 hover:text-slate-800'
                            }`}
                        onClick={() => setActiveTab('settings')}
                    >
                        Settings
                    </button>
                </div>
            </div>

            {activeTab === 'upload' && renderUploadTab()}
            {activeTab === 'templates' && renderTemplatesTab()}
            {activeTab === 'settings' && renderSettingsTab()}
        </div>
    );
};

export default CandidatePortal; 