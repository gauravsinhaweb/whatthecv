import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';

interface DatePickerProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    includePresent?: boolean;
    className?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
    value,
    onChange,
    placeholder = 'Select date',
    disabled = false,
    includePresent = false,
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [yearView, setYearView] = useState(false);
    const [viewDate, setViewDate] = useState(() => {
        if (value && value.match(/^\d{4}-\d{2}$/)) {
            const [year, month] = value.split('-');
            return { year: parseInt(year), month: parseInt(month) - 1 };
        }
        const now = new Date();
        return { year: now.getFullYear(), month: now.getMonth() };
    });

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

    const formatDisplayDate = (dateStr: string): string => {
        if (!dateStr) return '';
        if (dateStr.toLowerCase() === 'present') return 'Present';

        const match = dateStr.match(/^(\d{4})-(\d{2})$/);
        if (match) {
            const year = match[1];
            const month = parseInt(match[2], 10);
            return `${monthNames[month - 1]} ${year}`;
        }

        return dateStr;
    };

    const handleSelectMonth = (month: number) => {
        const formattedDate = `${viewDate.year}-${(month + 1).toString().padStart(2, '0')}`;
        onChange(formattedDate);
        setIsOpen(false);
    };

    const handleSelectYear = (year: number) => {
        setViewDate(prev => ({ ...prev, year }));
        setYearView(false);
    };

    const handlePresentSelection = () => {
        onChange('Present');
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <div className="relative">
                <input
                    type="text"
                    className={`w-full p-2.5 pr-10 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'cursor-pointer'}`}
                    value={formatDisplayDate(value)}
                    placeholder={placeholder}
                    readOnly
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {!disabled && <Calendar className="w-5 h-5 text-slate-400" />}
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg">
                    <div className="p-2 border-b border-slate-200">
                        <button
                            type="button"
                            className="w-full flex items-center justify-between p-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                            onClick={() => setYearView(!yearView)}
                        >
                            {yearView ? 'Select Year' : `${monthNames[viewDate.month]} ${viewDate.year}`}
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>

                    {yearView ? (
                        <div className="max-h-60 overflow-y-auto p-2 grid grid-cols-4 gap-1">
                            {years.map(year => (
                                <button
                                    key={year}
                                    type="button"
                                    className={`p-2 text-sm rounded-md hover:bg-blue-100 ${year === viewDate.year ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700'
                                        }`}
                                    onClick={() => handleSelectYear(year)}
                                >
                                    {year}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-2 grid grid-cols-3 gap-1">
                            {monthNames.map((month, index) => (
                                <button
                                    key={month}
                                    type="button"
                                    className={`p-2 text-sm rounded-md hover:bg-blue-100 ${index === viewDate.month ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700'
                                        }`}
                                    onClick={() => handleSelectMonth(index)}
                                >
                                    {month}
                                </button>
                            ))}
                        </div>
                    )}

                    {includePresent && (
                        <div className="p-2 border-t border-slate-200">
                            <button
                                type="button"
                                className="w-full p-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors text-left"
                                onClick={handlePresentSelection}
                            >
                                Present
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DatePicker; 