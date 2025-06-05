import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardResumePreview from '../screens/Candidate/create/components/DashboardResumePreview.tsx'
import { useResumeStore } from '../store/resumeStore'
import { defaultCustomizationOptions, initialResumeData } from '../types/resume'
import { FileText, Plus, Briefcase, Eye } from 'lucide-react'

const getDemoResume = (id: string, title: string, name: string, position: string) => ({
    id,
    title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    template: 'Standard',
    type: 'resume' as const,
    resumeData: {
        ...initialResumeData,
        personalInfo: {
            ...initialResumeData.personalInfo,
            name,
            position,
        },
    },
    customizationOptions: { ...defaultCustomizationOptions },
})

const Dashboard = () => {
    const navigate = useNavigate()
    const { documents, setDocuments, setResumeData, setCustomizationOptions, setSelectedDocument } = useResumeStore()
    const [activeTab, setActiveTab] = useState<'resumes' | 'cover-letters'>('resumes')
    const [hoveredResume, setHoveredResume] = useState<string | null>(null)

    useEffect(() => {
        if (documents.length === 0) {
            setDocuments([
                getDemoResume('1', 'Standard', 'Alex Johnson', 'Senior Software Engineer'),
                getDemoResume('2', 'Creative', 'Priya Mehta', 'UI/UX Designer'),
                getDemoResume('3', 'Modern', 'Rahul Verma', 'Product Manager'),
            ])
        }
    }, [])

    const resumes = documents.filter(doc => doc.type === 'resume')
    const coverLetters = documents.filter(doc => doc.type === 'coverLetter')

    const PREVIEW_SCALE = 0.25

    const handleResumeClick = (resume: typeof resumes[0]) => {
        setResumeData(resume.resumeData)
        setCustomizationOptions(resume.customizationOptions)
        setSelectedDocument(resume)
        navigate('/create-resume')
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="mt-1 text-sm text-slate-500">Manage your documents</p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-slate-500 truncate">Total Resumes</dt>
                                    <dd className="text-lg font-semibold text-slate-900">{resumes.length}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                <Briefcase className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-slate-500 truncate">Cover Letters</dt>
                                    <dd className="text-lg font-semibold text-slate-900">{coverLetters.length}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-b border-slate-200 mb-8">
                <div className="flex justify-between items-center">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('resumes')}
                            className={`${activeTab === 'resumes'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Resumes
                        </button>
                        <button
                            onClick={() => setActiveTab('cover-letters')}
                            className={`${activeTab === 'cover-letters'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Cover Letters
                        </button>
                    </nav>
                    <button
                        onClick={() => navigate('/create-resume')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create New
                    </button>
                </div>
            </div>
            <div className="w-full flex gap-8 justify-start items-center flex-grow overflow-x-auto">
                {activeTab === 'resumes' ? (
                    resumes.map((resume) => (
                        <div
                            key={resume.id}
                            onClick={() => handleResumeClick(resume)}
                            onMouseEnter={() => setHoveredResume(resume.id)}
                            onMouseLeave={() => setHoveredResume(null)}
                            className="group p-2 relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                        >
                            <div className="w-full px-2 flex items-center justify-center bg-slate-50 rounded-md overflow-hidden">
                                <div
                                    className="bg-white aspect-[210/297] rounded shadow font-sans text-[9pt] leading-[15px] flex flex-col items-center justify-center"
                                    style={{
                                        width: '210px',
                                        minWidth: '210px',
                                        height: '297px',
                                        minHeight: '297px',
                                        transform: `scale(${PREVIEW_SCALE})`,
                                        transformOrigin: '4px center',
                                    }}
                                >
                                    <DashboardResumePreview
                                        resumeData={resume.resumeData}
                                        customizationOptions={resume.customizationOptions}
                                        previewScale={100}
                                    />
                                </div>
                            </div>
                            <div className="mt-3">
                                <h3 className="text-sm font-medium text-slate-900 truncate">{resume.title}</h3>
                                <p className="mt-0.5 text-xs text-slate-500 truncate">
                                    {resume.resumeData.personalInfo.name} • {resume.resumeData.personalInfo.position}
                                </p>
                            </div>
                            <div className={`absolute inset-0 rounded-lg bg-slate-900/50 flex items-center justify-center transition-opacity duration-200 ${hoveredResume === resume.id ? 'opacity-100' : 'opacity-0'}`}>
                                <div className="flex items-center space-x-2 text-white">
                                    <Eye className="h-5 w-5" />
                                    <span className="text-sm font-medium">View Resume</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <Briefcase className="mx-auto h-12 w-12 text-slate-400" />
                        <h3 className="mt-2 text-sm font-medium text-slate-900">No cover letters</h3>
                        <p className="mt-1 text-sm text-slate-500">Get started by creating a new cover letter.</p>
                        <div className="mt-6">
                            <button
                                onClick={() => navigate('/create-resume')}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create Cover Letter
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard 