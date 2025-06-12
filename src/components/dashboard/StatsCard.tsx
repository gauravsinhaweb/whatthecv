import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
    title: string
    value: number | string | React.ReactNode
    icon: LucideIcon
    iconBgColor: string
    iconColor: string
    actions?: React.ReactNode
}

export const StatsCard = ({
    title,
    value,
    icon: Icon,
    iconBgColor,
    iconColor,
    actions
}: StatsCardProps) => {
    return (
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200">
            <div className="p-6">
                <div className="flex items-center">
                    <div className={`flex-shrink-0 ${iconBgColor} rounded-xl p-3`}>
                        <Icon className={`h-6 w-6 ${iconColor}`} />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-slate-500 truncate">{title}</dt>
                            <dd className="text-2xl font-semibold text-slate-900">{value}</dd>
                        </dl>
                    </div>
                    {actions && (
                        <div className="flex space-x-2">
                            {actions}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
} 