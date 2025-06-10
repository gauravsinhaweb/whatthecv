import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardResumePreview from '../screens/Candidate/create/components/DashboardResumePreview.tsx'
import { useResumeStore } from '../store/resumeStore'
import { defaultCustomizationOptions, initialResumeData } from '../types/resume'
import { FileText, Plus, Briefcase, Eye, Trash2, Edit2, MoreVertical, X, ArrowBigRight, ArrowRight } from 'lucide-react'
import { getResumeVersions, deleteResumeVersion, saveDraft } from '../utils/api'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'
import type { EnhancedResumeData } from '../utils/types'

const Dashboard = () => {
    const navigate = useNavigate()
    const { documents, setDocuments, setResumeData, setCustomizationOptions, setSelectedDocument, resetStore, updateDocument } = useResumeStore()
    const [activeTab, setActiveTab] = useState<'resumes' | 'cover-letters'>('resumes')
    const [hoveredResume, setHoveredResume] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [editingTitle, setEditingTitle] = useState<string | null>(null)
    const [newTitle, setNewTitle] = useState('')
    const [deleteConfirmModal, setDeleteConfirmModal] = useState<{ isOpen: boolean; resumeId: string | null }>({
        isOpen: false,
        resumeId: null
    })

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
            toast.success('Deleted successfully')
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

    const handleTitleEdit = async (resumeId: string, currentTitle: string) => {
        setEditingTitle(resumeId)
        setNewTitle(currentTitle)
    }

    const handleTitleSave = async (resumeId: string) => {
        try {
            const resume = documents.find(doc => doc.id === resumeId)
            if (!resume) return

            // Convert ResumeData to EnhancedResumeData
            const enhancedResumeData: EnhancedResumeData = {
                personalInfo: {
                    name: resume.resumeData.personalInfo.name,
                    position: resume.resumeData.personalInfo.position,
                    email: resume.resumeData.personalInfo.email,
                    phone: resume.resumeData.personalInfo.phone,
                    location: resume.resumeData.personalInfo.location,
                    summary: resume.resumeData.personalInfo.summary,
                    profilePicture: resume.resumeData.personalInfo.profilePicture || null,
                    socialLinks: resume.resumeData.personalInfo.socialLinks?.map(link => ({
                        platform: link.platform === 'peerlist' ? 'other' : link.platform,
                        url: link.url,
                        label: link.label
                    }))
                },
                workExperience: resume.resumeData.workExperience.map(exp => ({
                    id: exp.id,
                    position: exp.position,
                    company: exp.company,
                    location: exp.location,
                    startDate: exp.startDate,
                    endDate: exp.endDate,
                    current: exp.current,
                    description: exp.description
                })),
                education: resume.resumeData.education.map(edu => ({
                    id: edu.id,
                    degree: edu.degree,
                    institution: edu.institution,
                    location: edu.location,
                    startDate: edu.startDate,
                    endDate: edu.endDate,
                    description: edu.description
                })),
                skills: resume.resumeData.skills,
                projects: resume.resumeData.projects.map(proj => ({
                    id: proj.id,
                    name: proj.name,
                    description: proj.description,
                    technologies: proj.technologies,
                    link: proj.link
                }))
            }

            await saveDraft(enhancedResumeData, newTitle, resume.customizationOptions, resumeId)

            updateDocument(resumeId, { title: newTitle })
            toast.success('Title updated successfully')
        } catch (error) {
            console.error('Failed to update title:', error)
            toast.error('Failed to update title')
        } finally {
            setEditingTitle(null)
        }
    }

    const handleDeleteConfirm = async (resumeId: string) => {
        try {
            await deleteResumeVersion(resumeId)
            setDocuments(documents.filter(doc => doc.id !== resumeId))
            toast.success('Resume deleted successfully')
        } catch (error) {
            console.error('Failed to delete resume:', error)
            toast.error('Failed to delete resume')
        } finally {
            setDeleteConfirmModal({ isOpen: false, resumeId: null })
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
            <div className="mb-8">
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
            <div className="w-full flex gap-8 justify-start items-center flex-grow">
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
                                className="group p-2 relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                                onClick={(e) => {
                                    if (!hoveredResume) {
                                        handleResumeClick(resume)
                                    }
                                }}
                            >
                                <div className="w-full px-2 flex items-center justify-center bg-slate-50 rounded-md overflow-hidden group-hover:bg-slate-100 transition-colors duration-200 relative">
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-10">
                                        <div className="flex flex-row items-center gap-2">
                                            <ArrowRight className="h-6 w-6 text-white" />
                                            <span className="text-white font-medium">View</span>
                                        </div>
                                    </div>
                                    <div
                                        className="bg-white aspect-[210/297] rounded shadow font-sans text-[9pt] leading-[15px] flex flex-col items-center justify-center transform transition-transform duration-200 group-hover:scale-[1.02]"
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
                                <div className="mt-3 px-2">
                                    {editingTitle === resume.id ? (
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={newTitle}
                                                onClick={e => e.stopPropagation()}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTitle(e.target.value)}
                                                className="flex-1 text-sm border rounded px-2 py-1"
                                                autoFocus
                                                onBlur={() => handleTitleSave(resume.id)}
                                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                                    if (e.key === 'Enter') {
                                                        handleTitleSave(resume.id)
                                                    } else if (e.key === 'Escape') {
                                                        setEditingTitle(null)
                                                    }
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3
                                                    className="text-sm font-medium text-slate-900 truncate cursor-pointer hover:text-blue-600 max-w-[180px]"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleTitleEdit(resume.id, resume.title)
                                                    }}
                                                >
                                                    {resume.title}
                                                </h3>
                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    {format(new Date(resume.updatedAt), 'MMM d, yyyy · h:mm a')}
                                                </p>
                                            </div>
                                            <div className="relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setHoveredResume(hoveredResume === resume.id ? null : resume.id)
                                                    }}
                                                    className="p-1 hover:bg-slate-100 rounded-full"
                                                >
                                                    <MoreVertical className="h-5 w-5 text-slate-500" />
                                                </button>
                                                {hoveredResume === resume.id && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 z-40"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setHoveredResume(null)
                                                            }}
                                                        />
                                                        <div
                                                            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    handleTitleEdit(resume.id, resume.title)
                                                                    setHoveredResume(null)
                                                                }}
                                                                className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                                            >
                                                                <Edit2 className="h-4 w-4 mr-2" />
                                                                Rename
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    setDeleteConfirmModal({ isOpen: true, resumeId: resume.id })
                                                                    setHoveredResume(null)
                                                                }}
                                                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-slate-100"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
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
            {deleteConfirmModal.isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={() => setDeleteConfirmModal({ isOpen: false, resumeId: null })}
                    />
                    {/* Modal */}
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-[400px]">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-slate-900">Delete Resume</h3>
                                <button
                                    onClick={() => setDeleteConfirmModal({ isOpen: false, resumeId: null })}
                                    className="p-1 hover:bg-slate-100 rounded-full"
                                >
                                    <X className="h-5 w-5 text-slate-500" />
                                </button>
                            </div>
                            <p className="text-slate-600 mb-6">
                                Are you sure you want to delete this resume? This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setDeleteConfirmModal({ isOpen: false, resumeId: null })}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => deleteConfirmModal.resumeId && handleDeleteConfirm(deleteConfirmModal.resumeId)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Dashboard 