import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardResumePreview from '../screens/Candidate/create/components/DashboardResumePreview.tsx'
import { useResumeStore } from '../store/resumeStore'
import { defaultCustomizationOptions, initialResumeData } from '../types/resume'
import { FileText, Plus, Briefcase, Eye, Trash2, Edit2 } from 'lucide-react'
import { getResumeVersions, deleteResumeVersion } from '../utils/api'
import { toast } from 'react-hot-toast'

const Dashboard = () => {
    const navigate = useNavigate()
    const { documents, setDocuments, setResumeData, setCustomizationOptions, setSelectedDocument, resetStore } = useResumeStore()
    const [activeTab, setActiveTab] = useState<'resumes' | 'cover-letters'>('resumes')
    const [hoveredResume, setHoveredResume] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const resumes = await getResumeVersions()
                setDocuments(resumes.map(resume => ({
                    id: resume.id,
                    title: resume.title || resume.filename,
                    createdAt: resume.created_at,
                    updatedAt: resume.updated_at || resume.created_at,
                    template: 'Standard',
                    type: 'resume' as const,
                    resumeData: {
                        ...initialResumeData,
                        personalInfo: {
                            ...initialResumeData.personalInfo,
                            name: resume.content?.personalInfo?.name || resume.meta_data?.person_name || '',
                            position: resume.content?.personalInfo?.position || resume.meta_data?.position || '',
                            email: resume.content?.personalInfo?.email || '',
                            phone: resume.content?.personalInfo?.phone || '',
                            location: resume.content?.personalInfo?.location || '',
                            summary: resume.content?.personalInfo?.summary || '',
                            socialLinks: (resume.content?.personalInfo?.socialLinks || []).map(link => ({
                                ...link,
                                platform: (link.platform.toLowerCase() as "linkedin" | "github" | "twitter" | "leetcode" | "medium" | "stackoverflow" | "peerlist" | "other") || "other"
                            }))
                        },
                        workExperience: (resume.content?.workExperience || []).map(exp => ({
                            ...exp,
                            location: exp.location || '',
                            startDate: exp.startDate || '',
                            endDate: exp.endDate || '',
                            description: exp.description || '',
                            current: exp.current || false
                        })),
                        education: (resume.content?.education || []).map(edu => ({
                            ...edu,
                            location: edu.location || '',
                            startDate: edu.startDate || '',
                            endDate: edu.endDate || '',
                            description: edu.description || ''
                        })),
                        skills: resume.content?.skills || [],
                        projects: (resume.content?.projects || []).map(project => ({
                            ...project,
                            description: project.description || '',
                            technologies: project.technologies || '',
                            link: project.link || '',
                            startDate: project.startDate || '',
                            endDate: project.endDate || ''
                        }))
                    },
                    customizationOptions: {
                        ...defaultCustomizationOptions,
                        ...(resume.customization_options || {})
                    }
                })))
            } catch (error) {
                console.error('Failed to fetch resumes:', error)
                toast.error('Failed to load resumes')
            } finally {
                setIsLoading(false)
            }
        }

        fetchResumes()
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

    const handleDeleteResume = async (resumeId: string, e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        try {
            await deleteResumeVersion(resumeId)
            setDocuments(documents.filter(doc => doc.id !== resumeId))
            toast.success('Resume deleted successfully')
        } catch (error) {
            console.error('Failed to delete resume:', error)
            toast.error('Failed to delete resume')
        }
    }

    const handleEditResume = (resume: typeof resumes[0], e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        handleResumeClick(resume)
    }

    const handleCreateResume = () => {
        resetStore()
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
                        onClick={handleCreateResume}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create New
                    </button>
                </div>
            </div>
            <div className="w-full flex gap-8 justify-start items-center flex-grow overflow-x-auto">
                {activeTab === 'resumes' ? (
                    isLoading ? (
                        <div className="w-full flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : resumes.length === 0 ? (
                        <div className="w-full flex flex-col items-center justify-center py-12">
                            <div className="bg-slate-50 rounded-full p-4 mb-4">
                                <FileText className="h-8 w-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 mb-1">No resumes yet</h3>
                            <p className="text-slate-500 mb-4">Upload your first resume to get started</p>
                            <button
                                onClick={handleCreateResume}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create Resume
                            </button>
                        </div>
                    ) : (
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
                                    <div className="flex items-center space-x-4 text-white">
                                        <button
                                            onClick={(e) => handleEditResume(resume, e)}
                                            className="flex items-center space-x-1 hover:text-amber-400 transition-colors"
                                        >
                                            <Edit2 className="h-5 w-5" />
                                            <span className="text-sm font-medium">Edit</span>
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteResume(resume.id, e)}
                                            className="flex items-center space-x-1 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                            <span className="text-sm font-medium">Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )
                ) : (
                    <div className="w-full flex flex-col items-center justify-center py-12">
                        <div className="bg-slate-50 rounded-full p-4 mb-4">
                            <FileText className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-1">No Cover Letter yet</h3>
                        <p className="text-slate-500 mb-4">Upload your first cover Letter to get started</p>
                        <button
                            onClick={handleCreateResume}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Letter
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard 