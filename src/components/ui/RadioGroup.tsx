import React from 'react';

interface RadioGroupOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
}

interface OptionGroup {
    groupLabel?: string;
    options: RadioGroupOption[];
}

interface RadioGroupProps {
    options: RadioGroupOption[] | OptionGroup[];
    value: string;
    onChange: (value: string) => void;
    name: string;
    label?: string;
    orientation?: 'horizontal' | 'vertical';
    variant?: 'default' | 'button' | 'segmented' | 'colorPicker';
    size?: 'sm' | 'md' | 'lg';
}

const RadioGroup: React.FC<RadioGroupProps> = ({
    options,
    value,
    onChange,
    name,
    label,
    orientation = 'vertical',
    variant = 'default',
    size = 'md',
}) => {
    // Check if options is an array of option groups
    const hasGroups = options.length > 0 && 'groupLabel' in options[0] && 'options' in options[0];

    // Size classes
    const sizeClasses = {
        sm: 'text-xs py-1 px-2',
        md: 'text-sm py-1.5 px-3',
        lg: 'text-base py-2 px-4',
    };

    // Determine if we're rendering buttons or traditional radio inputs
    const renderAsButtons = variant === 'button' || variant === 'segmented' || variant === 'colorPicker';

    // Render segmented control style
    if (variant === 'segmented') {
        return (
            <div className="space-y-2">
                {label && (
                    <label className="block text-sm font-medium text-slate-700">{label}</label>
                )}
                <div className={`inline-flex rounded-md bg-slate-100 p-1 ${orientation === 'vertical' ? 'flex-col' : 'flex-row'}`}>
                    {(hasGroups ? [] : options as RadioGroupOption[]).map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange(option.value)}
                            disabled={option.disabled}
                            className={`${sizeClasses[size]} rounded-md flex items-center justify-center gap-2 transition-all
                                ${value === option.value
                                    ? 'bg-white text-blue-700 shadow-sm font-medium'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                } ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            {option.icon}
                            <span>{option.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // Render color picker style
    if (variant === 'colorPicker') {
        return (
            <div className="space-y-2">
                {label && (
                    <label className="block text-sm font-medium text-slate-700">{label}</label>
                )}
                <div className={`flex flex-wrap gap-2 ${orientation === 'horizontal' ? 'flex-row' : 'flex-col'}`}>
                    {(hasGroups ? [] : options as RadioGroupOption[]).map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange(option.value)}
                            disabled={option.disabled}
                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                                ${value === option.value
                                    ? 'border-slate-900 scale-110'
                                    : 'border-transparent hover:border-slate-300'
                                } ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            style={{ backgroundColor: option.value }}
                            title={option.label}
                        >
                            {value === option.value && (
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // Render button style
    if (variant === 'button') {
        return (
            <div className="space-y-2">
                {label && (
                    <label className="block text-sm font-medium text-slate-700">{label}</label>
                )}
                <div className={`flex gap-2 ${orientation === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col'}`}>
                    {(hasGroups ? [] : options as RadioGroupOption[]).map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange(option.value)}
                            disabled={option.disabled}
                            className={`${sizeClasses[size]} rounded border flex items-center justify-center gap-1.5 transition-all
                                ${value === option.value
                                    ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
                                    : 'bg-white border-slate-200 text-slate-700 hover:border-blue-200'
                                } ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            {option.icon}
                            <span>{option.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // Default radio style - now with groups support
    return (
        <div className="space-y-3">
            {label && (
                <label className="block text-sm font-medium text-slate-700">{label}</label>
            )}

            {/* Render groups or flat options */}
            {hasGroups ? (
                <div className="space-y-4">
                    {(options as OptionGroup[]).map((group, groupIndex) => (
                        <div key={groupIndex} className="space-y-2">
                            {group.groupLabel && (
                                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    {group.groupLabel}
                                </div>
                            )}
                            <div
                                className={`flex ${orientation === 'horizontal' ? 'flex-row flex-wrap gap-4' : 'flex-col gap-2'}`}
                            >
                                {group.options.map((option) => (
                                    <label
                                        key={option.value}
                                        className={`flex items-center cursor-pointer ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name={name}
                                            value={option.value}
                                            checked={value === option.value}
                                            onChange={() => !option.disabled && onChange(option.value)}
                                            disabled={option.disabled}
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
                    ))}
                </div>
            ) : (
                <div
                    className={`flex ${orientation === 'horizontal' ? 'flex-row flex-wrap gap-4' : 'flex-col gap-2'}`}
                >
                    {(options as RadioGroupOption[]).map((option) => (
                        <label
                            key={option.value}
                            className={`flex items-center ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            <input
                                type="radio"
                                name={name}
                                value={option.value}
                                checked={value === option.value}
                                onChange={() => !option.disabled && onChange(option.value)}
                                disabled={option.disabled}
                                className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                            />
                            <div className="ml-2 flex items-center">
                                {option.icon && <span className="mr-2">{option.icon}</span>}
                                <span className="text-sm text-slate-700">{option.label}</span>
                            </div>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RadioGroup; 