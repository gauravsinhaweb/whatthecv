import React from 'react';
import { ChevronDown } from 'lucide-react';

interface DateFieldWithOptionsProps {
    label: string;
    month: string;
    year: string;
    onMonthChange: (value: string) => void;
    onYearChange: (value: string) => void;
    displayMode: 'full' | 'year' | 'hidden';
    onDisplayModeChange: (mode: 'full' | 'year' | 'hidden') => void;
    placeholder?: string;
    className?: string;
}

const DateFieldWithOptions: React.FC<DateFieldWithOptionsProps> = ({
    label,
    month,
    year,
    onMonthChange,
    onYearChange,
    displayMode,
    onDisplayModeChange,
    placeholder = 'e.g., Dec 2023',
    className = ''
}) => {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    return (
        <div className={`relative ${className}`}>
            <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-indigo-700">
                    {label}
                </label>
                <div className="relative">
                    <select
                        value={displayMode}
                        onChange={(e) => onDisplayModeChange(e.target.value as 'full' | 'year' | 'hidden')}
                        className="text-xs border border-slate-300 rounded px-2 py-1 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="full">Show Full Date</option>
                        <option value="year">Show Year Only</option>
                        <option value="hidden">Hide Date</option>
                    </select>
                    <ChevronDown className="absolute right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                </div>
            </div>

            {displayMode !== 'hidden' && (
                <div className="grid grid-cols-2 gap-2">
                    {displayMode === 'full' && (
                        <div>
                            <select
                                value={month}
                                onChange={(e) => onMonthChange(e.target.value)}
                                className="w-full p-2.5 border border-slate-300 rounded-md transition-all bg-white hover:border-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Month</option>
                                {months.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div>
                        <input
                            type="text"
                            value={year}
                            onChange={(e) => onYearChange(e.target.value)}
                            placeholder={displayMode === 'year' ? '2023' : '2023'}
                            className="w-full p-2.5 border border-slate-300 rounded-md transition-all bg-white hover:border-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateFieldWithOptions; 