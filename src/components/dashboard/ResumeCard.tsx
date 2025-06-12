import { useState } from 'react'
import { MoreVertical, Edit2, Trash2, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import DashboardResumePreview from '../../screens/Candidate/create/components/DashboardResumePreview'
import type { EnhancedResumeData } from '../../utils/types'

interface ResumeCardProps {
    id: string
    title: string
    updatedAt: string
    resumeData: EnhancedResumeData
    customizationOptions: any
    onEdit: (id: string) => void
    onDelete: (id: string) => void
    onTitleEdit: (id: string, title: string) => void
    onTitleSave: (id: string) => void
    editingTitle: string | null
    newTitle: string
    setNewTitle: (title: string) => void
}

const PREVIEW_SCALE = 0.25

export const ResumeCard = ({
    id,
    title,
    updatedAt,
    resumeData,
    customizationOptions,
    onEdit,
    onDelete,
    onTitleEdit,
    onTitleSave,
    editingTitle,
    newTitle,
    setNewTitle
}: ResumeCardProps) => {
    const [hovered, setHovered] = useState(false)

    return (
        <div
            className="group bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
            onClick={() => !hovered && onEdit(id)}
        >
            <div className="px-2 flex items-center justify-center bg-slate-200 group-hover:bg-slate-100 transition-colors duration-200 relative">
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
                        resumeData={resumeData}
                        customizationOptions={customizationOptions}
                        previewScale={100}
                    />
                </div>
            </div>
            <div className="p-4 pb-12 border-t border-slate-100">
                {editingTitle === id ? (
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={newTitle}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => setNewTitle((e.target as HTMLInputElement).value)}
                            className="flex-1 text-sm border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            autoFocus
                            onBlur={() => onTitleSave(id)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    onTitleSave(id)
                                } else if (e.key === 'Escape') {
                                    setHovered(false)
                                }
                            }}
                        />
                    </div>
                ) : (
                    <div className="absolute flex items-center justify-between">
                        <div>
                            <h3
                                className="text-sm font-medium text-slate-900 truncate cursor-pointer hover:text-blue-600 max-w-[180px]"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onTitleEdit(id, title)
                                }}
                            >
                                {title}
                            </h3>
                            <p className="mt-0.5 text-xs text-slate-500">
                                {format(new Date(updatedAt), 'MMM d, yyyy · h:mm a')}
                            </p>
                        </div>
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setHovered(!hovered)
                                }}
                                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <MoreVertical className="h-5 w-5 text-slate-500" />
                            </button>
                            {hovered && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setHovered(false)
                                        }}
                                    />
                                    <div
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-slate-200"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onTitleEdit(id, title)
                                                setHovered(false)
                                            }}
                                            className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                        >
                                            <Edit2 className="h-4 w-4 mr-2" />
                                            Rename
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onDelete(id)
                                                setHovered(false)
                                            }}
                                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-slate-50 transition-colors"
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
    )
} 