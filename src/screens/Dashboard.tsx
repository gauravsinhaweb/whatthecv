import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '../store/resumeStore'
import { defaultCustomizationOptions, initialResumeData } from '../types/resume'
import { FileText, Plus, Briefcase, Coins, History, RefreshCw, PiggyBank, FileSearch, FileEdit, FileCheck, Sparkles, Wand2, Lightbulb, MessageSquare, BookOpen, Target, GraduationCap, Wallet } from 'lucide-react'
import { getResumeVersions, deleteResumeVersion, saveDraft } from '../utils/api'
import { toast } from 'react-hot-toast'
import type { EnhancedResumeData } from '../utils/types'
import { useTokens } from '../hooks/useTokens'
import { DeleteConfirmModal } from '../components/dashboard/DeleteConfirmModal'
import { ResumeCard, ResumeCardSkeleton } from '../components/dashboard/ResumeCard'
import { StatsCard } from '../components/dashboard/StatsCard'
import Button from '../components/ui/Button'

// Add Razorpay type declaration
declare global {
    interface Window {
        Razorpay: any;
    }
}

const getActionDetails = (actionId: string) => {
    const formatActionText = (text: string) => {
        return text
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    switch (actionId) {
        case 'add_token':
            return {
                text: 'Credited',
                icon: Wallet,
                iconBgColor: 'bg-emerald-50',
                iconColor: 'text-emerald-600'
            };
        case 'resume_enhancement':
            return {
                text: 'Resume Enhancement',
                icon: Sparkles,
                iconBgColor: 'bg-purple-50',
                iconColor: 'text-purple-600'
            };
        case 'job_description_analysis':
            return {
                text: 'Job Description Analysis',
                icon: Target,
                iconBgColor: 'bg-blue-50',
                iconColor: 'text-blue-600'
            };
        case 'career_advice':
            return {
                text: 'Career Advice',
                icon: Lightbulb,
                iconBgColor: 'bg-yellow-50',
                iconColor: 'text-yellow-600'
            };
        case 'interview_prep':
            return {
                text: 'Interview Preparation',
                icon: MessageSquare,
                iconBgColor: 'bg-green-50',
                iconColor: 'text-green-600'
            };
        case 'skill_development':
            return {
                text: 'Skill Development',
                icon: GraduationCap,
                iconBgColor: 'bg-indigo-50',
                iconColor: 'text-indigo-600'
            };
        case 'resume_template':
            return {
                text: 'Resume Template',
                icon: FileEdit,
                iconBgColor: 'bg-pink-50',
                iconColor: 'text-pink-600'
            };
        case 'job_search':
            return {
                text: 'Job Search',
                icon: Briefcase,
                iconBgColor: 'bg-cyan-50',
                iconColor: 'text-cyan-600'
            };
        case 'resume_analysis':
            return {
                text: 'Resume Analysis',
                icon: FileSearch,
                iconBgColor: 'bg-orange-50',
                iconColor: 'text-orange-600'
            };
        default:
            return {
                text: formatActionText(actionId),
                icon: FileCheck,
                iconBgColor: 'bg-slate-50',
                iconColor: 'text-slate-600'
            };
    }
};

const Dashboard = () => {
    const navigate = useNavigate()
    const { documents, setDocuments, setResumeData, setCustomizationOptions, setSelectedDocument, resetStore, updateDocument } = useResumeStore()
    const [activeTab, setActiveTab] = useState<'resumes' | 'cover-letters'>('resumes')
    const [isLoading, setIsLoading] = useState(true)
    const [editingTitle, setEditingTitle] = useState<string | null>(null)
    const [newTitle, setNewTitle] = useState('')
    const [deleteConfirmModal, setDeleteConfirmModal] = useState<{ isOpen: boolean; resumeId: string | null }>({
        isOpen: false,
        resumeId: null
    })

    const {
        tokenBalance,
        isBalanceLoading,
        error,
        transactions,
        historyLoading,
        buyModalOpen,
        setBuyModalOpen,
        buyAmount,
        setBuyAmount,
        buyLoading,
        handleBuyTokens,
        openHistoryModal,
        historyModalOpen,
        setHistoryModalOpen,
        refreshBalance
    } = useTokens()

    useEffect(() => {
        refreshBalance()
    }, [refreshBalance])

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
                                platform: (link.platform.toLowerCase() === 'peerlist' ? 'other' : link.platform.toLowerCase()) as "linkedin" | "github" | "twitter" | "leetcode" | "medium" | "stackoverflow" | "other"
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

    const handleResumeClick = (resumeId: string) => {
        const resume = resumes.find(r => r.id === resumeId)
        if (!resume) return
        setResumeData(resume.resumeData)
        setCustomizationOptions(resume.customizationOptions)
        setSelectedDocument(resume)
        navigate('/create-resume')
    }

    const handleDeleteResume = async (resumeId: string) => {
        try {
            await deleteResumeVersion(resumeId)
            setDocuments(documents.filter(doc => doc.id !== resumeId))
            toast.success('Deleted successfully')
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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
                        value={resumes.length}
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
                    <StatsCard
                        title="Token Balance"
                        value={
                            isBalanceLoading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="animate-pulse h-8 w-20 bg-slate-200 rounded-lg"></div>
                                    <div className="animate-pulse h-4 w-4 bg-slate-200 rounded-full"></div>
                                </div>
                            ) : error ? (
                                <div className="flex items-center space-x-2">
                                    <span className="text-red-500 text-sm font-medium">{error}</span>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="p-1 hover:bg-red-50 rounded-full transition-colors"
                                        title="Retry"
                                    >
                                        <RefreshCw className="h-4 w-4 text-red-500" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-lg bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
                                        {tokenBalance}
                                    </span>
                                    <span className="text-sm text-slate-500">tokens</span>
                                </div>
                            )
                        }
                        icon={Coins}
                        iconBgColor="bg-gradient-to-br from-yellow-100 to-yellow-50"
                        iconColor="text-yellow-600"
                        actions={
                            <div className="flex items-center space-x-2">
                                <Button
                                    onClick={() => setBuyModalOpen(true)}
                                    className="group relative px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2"
                                    rightIcon={<Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />}
                                >
                                    Buy
                                </Button>
                                <Button
                                    onClick={openHistoryModal}
                                    variant="ghost"
                                    className="group p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                    title="Transaction History"
                                    rightIcon={<History className="h-4 w-4 group-hover:scale-110 transition-transform" />}
                                >
                                    <span className="sr-only">Transaction History</span>
                                </Button>
                            </div>
                        }
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
                                {[1, 2, 3].map((index) => (
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
                                onClick={handleCreateResume}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create Letter
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <DeleteConfirmModal
                isOpen={deleteConfirmModal.isOpen}
                onClose={() => setDeleteConfirmModal({ isOpen: false, resumeId: null })}
                onConfirm={() => deleteConfirmModal.resumeId && handleDeleteResume(deleteConfirmModal.resumeId)}
            />

            {/* Buy Tokens Modal */}
            {buyModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-slate-900">Buy Tokens</h3>
                            <button
                                onClick={() => setBuyModalOpen(false)}
                                className="text-slate-400 hover:text-slate-500"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Amount (₹)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                                    <input
                                        type="number"
                                        value={buyAmount}
                                        onChange={(e) => setBuyAmount(Number((e.target as HTMLInputElement).value))}
                                        className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter amount"
                                        min="5"
                                        step={10}
                                        defaultValue={100}
                                    />
                                </div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-lg">
                                <p className="text-sm text-slate-600">You will receive {buyAmount} tokens</p>
                            </div>
                            <button
                                onClick={handleBuyTokens}
                                disabled={buyLoading || !buyAmount}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {buyLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <Coins className="h-5 w-5 mr-2" />
                                        Credit Token
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Transaction History Modal */}
            {historyModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[64vh] flex flex-col">
                        <div className="flex justify-between items-center p-5 border-b border-slate-100">
                            <div className="flex items-center gap-2.5">
                                <div className="flex-shrink-0 bg-blue-50 rounded-xl p-3">
                                    <History className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="text-base font-semibold text-slate-900">Transaction History</h3>
                            </div>
                            <button
                                onClick={() => setHistoryModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-lg"
                            >
                                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-5 overflow-y-auto flex-1">
                            {historyLoading ? (
                                <div className="flex justify-center items-center py-10">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                </div>
                            ) : transactions.length === 0 ? (
                                <div className="text-center py-10">
                                    <div className="flex-shrink-0 bg-slate-50 rounded-xl p-3 inline-block mb-3">
                                        <History className="h-6 w-6 text-slate-600" />
                                    </div>
                                    <p className="text-slate-500 text-base font-medium">No transactions yet</p>
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    {transactions.map((transaction) => {
                                        const actionDetails = getActionDetails(transaction.action_id);
                                        const Icon = actionDetails.icon;
                                        return (
                                            <div
                                                key={transaction.id}
                                                className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl hover:bg-slate-100/50 transition-all duration-200 border border-slate-100 hover:border-slate-200 hover:shadow-sm"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`flex-shrink-0 ${actionDetails.iconBgColor} rounded-xl p-3`}>
                                                        <Icon className={`h-6 w-6 ${actionDetails.iconColor}`} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900 text-base">{actionDetails.text}</p>
                                                        <p className="text-sm text-slate-500 mt-0.5">
                                                            {new Date(transaction.timestamp).toLocaleString()}
                                                        </p>
                                                        <p className="text-xs text-slate-400 mt-0.5">
                                                            Balance: {transaction.available_token || '-'} {transaction.available_token && <Coins className="inline-block h-3 w-3" />}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <div className={`font-semibold text-base ${transaction.action_id === 'add_token' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                        {transaction.action_id === 'add_token' ? '+' : '-'}{Math.abs(transaction.token)} <Coins className="inline-block h-4 w-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div >
    )
}

export default Dashboard 