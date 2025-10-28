import { Briefcase, FileText, Plus, Timer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { DeleteConfirmModal } from '../components/dashboard/DeleteConfirmModal'
import { ResumeCard, ResumeCardSkeleton } from '../components/dashboard/ResumeCard'
import { StatsCard } from '../components/dashboard/StatsCard'
import { useDeleteResume, useResumeVersions, useSaveResume } from '../hooks/queries/useResumeQueries'
import { useStorageAndActionInfo } from '../hooks/queries/useStorageQueries'
import { useAuth } from '../hooks/useAuth'
import { useResumeStore } from '../store/resumeStore'
import { defaultCustomizationOptions, initialResumeData, ResumeData } from '../types/resume'
import type { EnhancedResumeData } from '../utils/types'

const Dashboard = () => {
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuth()
    const { documents, setDocuments, setResumeData, setCustomizationOptions, setSelectedDocument, resetStore } = useResumeStore()
    const [activeTab, setActiveTab] = useState<'resumes' | 'cover-letters'>('resumes')
    const [editingTitle, setEditingTitle] = useState<string | null>(null)
    const [newTitle, setNewTitle] = useState('')
    const [deleteConfirmModal, setDeleteConfirmModal] = useState<{ isOpen: boolean; resumeId: string | null }>({
        isOpen: false,
        resumeId: null
    })

    // React Query hooks
    const { data: resumeVersions, isLoading: isResumeVersionsLoading, refetch: refetchResumeVersions } = useResumeVersions()
    const { storageInfo, isLoading: isStorageLoading } = useStorageAndActionInfo()
    const deleteResumeMutation = useDeleteResume()
    const saveResumeMutation = useSaveResume()

    const isLoading = isResumeVersionsLoading && isAuthenticated && user

    // Refetch resume versions when component mounts to ensure fresh data
    useEffect(() => {
        if (isAuthenticated && user) {
            refetchResumeVersions()
        }
    }, [isAuthenticated, user, refetchResumeVersions])

    useEffect(() => {
        if (isAuthenticated && user) {
            if (resumeVersions) {
                setDocuments(resumeVersions.map(resume => ({
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
                                platform: (link.platform.toLowerCase() === 'peerlist' ? 'other' : link.platform.toLowerCase()) as "linkedin" | "github" | "twitter" | "leetcode" | "medium" | "stackoverflow" | "other"
                            }))
                        },
                        workExperience: (resume.content?.workExperience || []).map(exp => {
                            const newExp = exp as any
                            return {
                                id: newExp.id || '',
                                position: newExp.position || '',
                                company: newExp.company || '',
                                location: newExp.location || '',
                                startMonth: newExp.startMonth || '',
                                startYear: newExp.startYear || '',
                                endMonth: newExp.endMonth || '',
                                endYear: newExp.endYear || '',
                                current: newExp.current || false,
                                showStartMonth: newExp.showStartMonth !== false,
                                showEndMonth: newExp.showEndMonth !== false,
                                description: newExp.description || '',
                                experienceLink: newExp.experienceLink
                            }
                        }),
                        education: (resume.content?.education || []).map(edu => {
                            const newEdu = edu as any
                            return {
                                id: newEdu.id || '',
                                degree: newEdu.degree || '',
                                institution: newEdu.institution || '',
                                location: newEdu.location || '',
                                startMonth: newEdu.startMonth || '',
                                startYear: newEdu.startYear || '',
                                endMonth: newEdu.endMonth || '',
                                endYear: newEdu.endYear || '',
                                current: newEdu.current || false,
                                showStartMonth: newEdu.showStartMonth !== false,
                                showEndMonth: newEdu.showEndMonth !== false,
                                description: newEdu.description || '',
                                educationLink: newEdu.educationLink
                            }
                        }),
                        skills: (() => {
                            const skillsData = resume.content?.skills;
                            if (!skillsData) return [];

                            if (Array.isArray(skillsData)) {
                                return skillsData
                                    .filter(skill => skill !== null && skill !== undefined)
                                    .map((skill, index) => {
                                        if (typeof skill === 'object' && skill && 'id' in skill && 'name' in skill && 'skills' in skill) {
                                            return skill as any;
                                        }

                                        if (typeof skill === 'string') {
                                            return { id: `skill-${index}`, name: skill, skills: [skill] };
                                        }

                                        if (typeof skill === 'object') {
                                            const skillObj = skill as any;
                                            return {
                                                id: skillObj.id || `skill-${index}`,
                                                name: skillObj.name || 'Technical Skills',
                                                skills: skillObj.skills || [skillObj.name || '']
                                            };
                                        }

                                        return { id: `skill-${index}`, name: 'Technical Skills', skills: [] };
                                    });
                            }

                            return [];
                        })(),
                        projects: (resume.content?.projects || []).map(project => {
                            const newProject = project as any
                            return {
                                id: newProject.id || '',
                                name: newProject.name || '',
                                description: newProject.description || '',
                                technologies: newProject.technologies || '',
                                link: newProject.link || '',
                                startMonth: newProject.startMonth || '',
                                startYear: newProject.startYear || '',
                                endMonth: newProject.endMonth || '',
                                endYear: newProject.endYear || '',
                                current: newProject.current || false,
                                showStartMonth: newProject.showStartMonth !== false,
                                showEndMonth: newProject.showEndMonth !== false
                            }
                        }),
                        achievements: (resume.content as any)?.achievements || [],
                        publications: (resume.content as any)?.publications || [],
                        certifications: (resume.content as any)?.certifications || []
                    },
                    customizationOptions: (() => {
                        const savedOptions = resume.customization_options || {};
                        const mergedOptions = { ...defaultCustomizationOptions };

                        Object.keys(savedOptions).forEach(key => {
                            if (typeof savedOptions[key] === 'object' && savedOptions[key] !== null && !Array.isArray(savedOptions[key])) {
                                mergedOptions[key] = {
                                    ...mergedOptions[key],
                                    ...savedOptions[key]
                                };
                            } else {
                                mergedOptions[key] = savedOptions[key];
                            }
                        });

                        return mergedOptions;
                    })()
                })))
            } else {
                // If authenticated but no resume versions, set empty documents
                setDocuments([])
            }
        } else {
            // If not authenticated, clear documents
            setDocuments([])
        }
    }, [resumeVersions, isAuthenticated, user, setDocuments])

    const resumes = documents.filter(doc => doc.type === 'resume')
    const coverLetters = documents.filter(doc => doc.type === 'coverLetter')

    const handleResumeClick = (resumeId: string) => {
        const resume = resumes.find(r => r.id === resumeId)
        if (!resume) return

        // Convert EnhancedResumeData to ResumeData format
        const resumeData: ResumeData = {
            personalInfo: {
                name: resume.resumeData.personalInfo.name,
                position: resume.resumeData.personalInfo.position,
                email: resume.resumeData.personalInfo.email,
                phone: resume.resumeData.personalInfo.phone,
                location: resume.resumeData.personalInfo.location,
                summary: resume.resumeData.personalInfo.summary,
                profilePicture: resume.resumeData.personalInfo.profilePicture,
                socialLinks: resume.resumeData.personalInfo.socialLinks?.map(link => ({
                    platform: link.platform === 'peerlist' ? 'peerlist' : link.platform,
                    url: link.url,
                    label: link.label
                }))
            },
            workExperience: resume.resumeData.workExperience.map(exp => ({
                id: exp.id,
                position: exp.position,
                company: exp.company,
                location: exp.location,
                startMonth: exp.startMonth,
                startYear: exp.startYear,
                endMonth: exp.endMonth,
                endYear: exp.endYear,
                current: exp.current,
                showStartMonth: exp.showStartMonth,
                showEndMonth: exp.showEndMonth,
                description: exp.description
            })),
            education: resume.resumeData.education.map(edu => ({
                id: edu.id,
                degree: edu.degree,
                institution: edu.institution,
                location: edu.location,
                startMonth: edu.startMonth,
                startYear: edu.startYear,
                endMonth: edu.endMonth,
                endYear: edu.endYear,
                current: edu.current,
                showStartMonth: edu.showStartMonth,
                showEndMonth: edu.showEndMonth,
                description: edu.description
            })),
            skills: (() => {
                const skillsData = resume.resumeData.skills;
                if (!skillsData) return [];

                // Ensure skills have the correct SkillCategory structure
                if (Array.isArray(skillsData)) {
                    return skillsData
                        .filter(skill => skill !== null && skill !== undefined)
                        .map((skill, index) => {
                            // If it's already a SkillCategory object with correct structure
                            if (typeof skill === 'object' && skill && 'id' in skill && 'name' in skill && 'skills' in skill) {
                                return skill as any;
                            }

                            // If it's a string, convert to SkillCategory
                            if (typeof skill === 'string') {
                                return { id: `skill-${index}`, name: skill, skills: [skill] };
                            }

                            // If it's an object but missing required fields, fix it
                            if (typeof skill === 'object') {
                                const skillObj = skill as any;
                                return {
                                    id: skillObj.id || `skill-${index}`,
                                    name: skillObj.name || 'Technical Skills',
                                    skills: skillObj.skills || [skillObj.name || '']
                                };
                            }

                            return { id: `skill-${index}`, name: 'Technical Skills', skills: [] };
                        });
                }

                return [];
            })(),
            projects: resume.resumeData.projects.map(proj => ({
                id: proj.id,
                name: proj.name,
                description: proj.description,
                technologies: proj.technologies,
                link: proj.link,
                startMonth: proj.startMonth,
                startYear: proj.startYear,
                endMonth: proj.endMonth,
                endYear: proj.endYear,
                current: proj.current,
                showStartMonth: proj.showStartMonth,
                showEndMonth: proj.showEndMonth
            })),
            achievements: resume.resumeData.achievements,
            publications: resume.resumeData.publications,
            certifications: resume.resumeData.certifications
        }

        setResumeData(resumeData)
        setCustomizationOptions(resume.customizationOptions)
        setSelectedDocument(resume)
        navigate('/create-resume')
    }

    const handleDeleteResume = async (resumeId: string) => {
        try {
            await deleteResumeMutation.mutateAsync(resumeId)
            setDocuments(documents.filter(doc => doc.id !== resumeId))
        } catch (error) {
            console.error('Failed to delete resume:', error)
            toast.error('Failed to delete resume')
        }
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
        if (!isAuthenticated || !user) {
            toast.error('Please login to update resume titles')
            return
        }

        try {
            const resume = documents.find(doc => doc.id === resumeId)
            if (!resume) return

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
                    startMonth: exp.startMonth,
                    startYear: exp.startYear,
                    endMonth: exp.endMonth,
                    endYear: exp.endYear,
                    current: exp.current,
                    showStartMonth: exp.showStartMonth,
                    showEndMonth: exp.showEndMonth,
                    description: exp.description
                })),
                education: resume.resumeData.education.map(edu => ({
                    id: edu.id,
                    degree: edu.degree,
                    institution: edu.institution,
                    location: edu.location,
                    startMonth: edu.startMonth,
                    startYear: edu.startYear,
                    endMonth: edu.endMonth,
                    endYear: edu.endYear,
                    current: edu.current,
                    showStartMonth: edu.showStartMonth,
                    showEndMonth: edu.showEndMonth,
                    description: edu.description
                })),
                skills: (() => {
                    const skillsData = resume.resumeData.skills;
                    if (!skillsData) return [];

                    if (Array.isArray(skillsData)) {
                        return skillsData
                            .filter(skill => skill !== null && skill !== undefined)
                            .map((skill, index) => {
                                if (typeof skill === 'object' && skill && 'id' in skill && 'name' in skill && 'skills' in skill) {
                                    return skill as any;
                                }

                                if (typeof skill === 'string') {
                                    return { id: `skill-${index}`, name: skill, skills: [skill] };
                                }

                                if (typeof skill === 'object') {
                                    const skillObj = skill as any;
                                    return {
                                        id: skillObj.id || `skill-${index}`,
                                        name: skillObj.name || 'Technical Skills',
                                        skills: skillObj.skills || [skillObj.name || '']
                                    };
                                }

                                return { id: `skill-${index}`, name: 'Technical Skills', skills: [] };
                            });
                    }

                    return [];
                })(),
                projects: resume.resumeData.projects.map(proj => ({
                    id: proj.id,
                    name: proj.name,
                    description: proj.description,
                    technologies: proj.technologies,
                    link: proj.link,
                    startMonth: proj.startMonth,
                    startYear: proj.startYear,
                    endMonth: proj.endMonth,
                    endYear: proj.endYear,
                    current: proj.current,
                    showStartMonth: proj.showStartMonth,
                    showEndMonth: proj.showEndMonth
                })),
                achievements: resume.resumeData.achievements,
                publications: resume.resumeData.publications,
                certifications: resume.resumeData.certifications
            }

            await saveResumeMutation.mutateAsync({
                resumeData: enhancedResumeData,
                title: newTitle,
                customizationOptions: resume.customizationOptions,
                resumeId
            })

            toast.success('Title updated successfully')
        } catch (error) {
            console.error('Failed to update title:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to update title';

            if (errorMessage.includes('Resume version not found') || errorMessage.includes('404')) {
                toast.error('Resume not found. It may have been deleted.');
                // Refresh the resume list to remove the deleted resume
                refetchResumeVersions();
            } else {
                toast.error('Failed to update title');
            }
        } finally {
            setEditingTitle(null)
        }
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {!isAuthenticated || !user ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-lg text-slate-600">Loading dashboard...</p>
                    </div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900">Welcome Back!</h1>
                        <p className="mt-2 text-slate-600">Manage your assets in one place</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                        <StatsCard
                            title="Total Resumes"
                            value={
                                isStorageLoading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-pulse h-8 w-20 bg-slate-200 rounded-lg"></div>
                                        <span className="text-sm text-slate-500">/</span>
                                        <div className="animate-pulse h-8 w-16 bg-slate-200 rounded-lg"></div>
                                    </div>
                                ) : storageInfo ? (
                                    <div className="flex items-center space-x-2">
                                        <span className="font-semibold text-lg text-slate-900">
                                            {resumes.length}
                                        </span>
                                        <span className="text-sm text-slate-500">/</span>
                                        <span className="font-semibold text-lg text-slate-900">
                                            {storageInfo.total_limit}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="font-semibold text-lg text-slate-900">{resumes.length}</span>
                                )
                            }
                            icon={FileText}
                            iconBgColor="bg-blue-100"
                            iconColor="text-blue-600"
                        />
                        <StatsCard
                            title="Cover Letters"
                            value={coverLetters.length}
                            icon={Briefcase}
                            iconBgColor="bg-green-100"
                            iconColor="text-green-600"
                        />
                    </div>

                    {/* Tabs and Create Button */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8">
                        <div className="px-6 py-4">
                            <div className="flex justify-between items-center">
                                <nav className="flex space-x-8">
                                    <button
                                        onClick={() => setActiveTab('resumes')}
                                        className={`${activeTab === 'resumes'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                                    >
                                        Resumes
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('cover-letters')}
                                        className={`${activeTab === 'cover-letters'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                                    >
                                        Cover Letters
                                    </button>
                                </nav>
                                <button
                                    onClick={handleCreateResume}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create New
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        {activeTab === 'resumes' ? (
                            isLoading ? (
                                <div className="flex justify-start items-center flex-wrap gap-6">
                                    {Array.apply(null, Array(3)).map((index) => (
                                        <ResumeCardSkeleton key={index} />
                                    ))}
                                </div>
                            ) : resumes.length === 0 ? (
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                                    <div className="bg-slate-50 rounded-full p-4 inline-flex mb-4">
                                        <FileText className="h-8 w-8 text-slate-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-slate-900 mb-1">No resumes yet</h3>
                                    <p className="text-slate-500 mb-6">Create your first resume to get started</p>
                                    <button
                                        onClick={handleCreateResume}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Resume
                                    </button>
                                </div>
                            ) : (
                                <div className="flex justify-start items-center flex-wrap gap-6">
                                    {resumes.map((resume) => (
                                        <ResumeCard
                                            key={resume.id}
                                            id={resume.id}
                                            title={resume.title}
                                            updatedAt={resume.updatedAt}
                                            resumeData={{
                                                ...resume.resumeData,
                                                personalInfo: {
                                                    ...resume.resumeData.personalInfo,
                                                    profilePicture: resume.resumeData.personalInfo.profilePicture || null,
                                                    socialLinks: resume.resumeData.personalInfo.socialLinks || []
                                                }
                                            }}
                                            customizationOptions={resume.customizationOptions}
                                            onEdit={handleResumeClick}
                                            onDelete={(id) => setDeleteConfirmModal({ isOpen: true, resumeId: id })}
                                            onTitleEdit={handleTitleEdit}
                                            onTitleSave={handleTitleSave}
                                            editingTitle={editingTitle}
                                            newTitle={newTitle}
                                            setNewTitle={setNewTitle}
                                        />
                                    ))}
                                </div>
                            )
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                                <div className="bg-slate-50 rounded-full p-4 inline-flex mb-4">
                                    <FileText className="h-8 w-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-900 mb-1">No Cover Letters yet</h3>
                                <p className="text-slate-500 mb-6">Create your first cover letter to get started</p>
                                <button
                                    disabled
                                    onClick={handleCreateResume}
                                    className="inline-flex cursor-progress items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    <Timer className="h-4 w-4 mr-2" />
                                    Coming soon
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modals */}
            <DeleteConfirmModal
                isOpen={deleteConfirmModal.isOpen}
                onClose={() => setDeleteConfirmModal({ isOpen: false, resumeId: null })}
                onConfirm={async () => {
                    if (deleteConfirmModal.resumeId) {
                        await handleDeleteResume(deleteConfirmModal.resumeId);
                        setDeleteConfirmModal({ isOpen: false, resumeId: null });
                    }
                }}
            />

        </div>
    )
}

export default Dashboard