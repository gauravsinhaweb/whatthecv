import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface DateFieldWithToggleProps {
    label: string;
    month: string;
    year: string;
    onMonthChange: (value: string) => void;
    onYearChange: (value: string) => void;
    isVisible: boolean;
    onToggleVisibility: () => void;
    isCurrent?: boolean;
    onCurrentChange?: (isCurrent: boolean) => void;
    className?: string;
}

const DateFieldWithToggle: React.FC<DateFieldWithToggleProps> = ({
    label,
    month,
    year,
    onMonthChange,
    onYearChange,
    isVisible,
    onToggleVisibility,
    isCurrent = false,
    onCurrentChange,
    className = ''
}) => {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

    return (
        <div className={`relative ${className}`}>
            <label className="block text-sm font-medium text-indigo-700 mb-1.5">
                {label}
            </label>

            <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                    {isVisible ? (
                        <div className="relative">
                            <select
                                value={month}
                                onChange={(e) => onMonthChange((e.target as HTMLSelectElement).value)}
                                disabled={isCurrent}
                                className={`w-full p-2.5 pr-12 border border-slate-300 rounded-md transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isCurrent
                                    ? 'bg-slate-50 text-slate-500 cursor-not-allowed'
                                    : 'bg-white hover:border-slate-400'
                                    }`}
                            >
                                <option value="">Month</option>
                                {months.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                            <button
                                onClick={onToggleVisibility}
                                className="absolute right-2.5 top-1/2 transform -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-700 transition-colors"
                                title="Hide month field"
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="w-full p-2.5 pr-12 border border-slate-300 rounded-md bg-slate-50 text-slate-500">
                                Month
                            </div>
                            <button
                                onClick={onToggleVisibility}
                                className="absolute right-2.5 top-1/2 transform -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                                title="Show month field"
                            >
                                <EyeOff className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <div>
                        <select
                            value={year}
                            onChange={(e) => onYearChange((e.target as HTMLSelectElement).value)}
                            disabled={isCurrent}
                            className={`w-full p-2.5 border border-slate-300 rounded-md transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isCurrent
                                ? 'bg-slate-50 text-slate-500 cursor-not-allowed'
                                : 'bg-white hover:border-slate-400'
                                }`}
                        >
                            <option value="">Year</option>
                            {years.map((y) => (
                                <option key={y} value={y.toString()}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {onCurrentChange && (
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id={`current-${label.toLowerCase().replace(/\s+/g, '-')}`}
                            checked={isCurrent}
                            onChange={(e) => onCurrentChange((e.target as HTMLInputElement).checked)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <label htmlFor={`current-${label.toLowerCase().replace(/\s+/g, '-')}`} className="ml-2 text-sm text-gray-700">
                            Current
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DateFieldWithToggle; 