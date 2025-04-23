import React from 'react';

interface RadioGroupOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
}

interface RadioGroupProps {
    options: RadioGroupOption[];
    value: string;
    onChange: (value: string) => void;
    name: string;
    label?: string;
    orientation?: 'horizontal' | 'vertical';
}

const RadioGroup: React.FC<RadioGroupProps> = ({
    options,
    value,
    onChange,
    name,
    label,
    orientation = 'vertical',
}) => {
    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-slate-700">{label}</label>
            )}
            <div
                className={`flex ${orientation === 'horizontal' ? 'flex-row gap-4' : 'flex-col gap-2'
                    }`}
            >
                {options.map((option) => (
                    <label
                        key={option.value}
                        className={`flex items-center cursor-pointer ${orientation === 'horizontal' ? 'mr-4' : ''
                            }`}
                    >
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={value === option.value}
                            onChange={() => onChange(option.value)}
                            className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                        />
                        <div className="ml-2 flex items-center">
                            {option.icon && <span className="mr-2">{option.icon}</span>}
                            <span className="text-sm text-slate-700">{option.label}</span>
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default RadioGroup; 