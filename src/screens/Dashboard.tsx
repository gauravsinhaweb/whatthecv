import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '../store/resumeStore'
import { defaultCustomizationOptions, initialResumeData } from '../types/resume'
import { FileText, Plus, Briefcase, Coins, History } from 'lucide-react'
import { getResumeVersions, deleteResumeVersion, saveDraft } from '../utils/api'
import { toast } from 'react-hot-toast'
import type { EnhancedResumeData } from '../utils/types'
import { useTokens } from '../hooks/useTokens'
import { DeleteConfirmModal } from '../components/dashboard/DeleteConfirmModal'
import { ResumeCard } from '../components/dashboard/ResumeCard'
import { StatsCard } from '../components/dashboard/StatsCard'

// Add Razorpay type declaration
declare global {
    interface Window {
        Razorpay: any;
    }
}

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
                                <div className="animate-pulse h-8 w-20 bg-slate-200 rounded"></div>
                            ) : error ? (
                                <span className="text-red-500 text-sm">{error}</span>
                            ) : (
                                <div className="flex items-center">
                                    <Coins className="h-5 w-5 mr-2 text-yellow-600" />
                                    <span className="font-medium">{tokenBalance}</span>
                                </div>
                            )
                        }
                        icon={Coins}
                        iconBgColor="bg-yellow-100"
                        iconColor="text-yellow-600"
                        actions={
                            <>
                                <button
                                    onClick={() => setBuyModalOpen(true)}
                                    className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm font-medium transition-colors shadow-sm hover:shadow"
                                >
                                    Buy Tokens
                                </button>
                                <button
                                    onClick={openHistoryModal}
                                    className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-sm font-medium transition-colors shadow-sm hover:shadow"
                                >
                                    <History className="h-4 w-4" />
                                </button>
                            </>
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

                {/* Content Area */}
                <div className="w-full">
                    {activeTab === 'resumes' ? (
                        isLoading ? (
                            <div className="w-full flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
                                        min="1"
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
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-slate-900">Transaction History</h3>
                            <button
                                onClick={() => setHistoryModalOpen(false)}
                                className="text-slate-400 hover:text-slate-500"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-4">
                            {historyLoading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : transactions.length === 0 ? (
                                <div className="text-center py-8">
                                    <History className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-500">No transactions yet</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {transactions.map((transaction) => (
                                        <div
                                            key={transaction.id}
                                            className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                                        >
                                            <div>
                                                <p className="font-medium text-slate-900">{transaction.action_id}</p>
                                                <p className="text-sm text-slate-500">
                                                    {new Date(transaction.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className={`font-medium ${transaction.token > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {transaction.token > 0 ? '+' : ''}{transaction.token}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard 