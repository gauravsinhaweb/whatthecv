import React from 'react';
import FieldVisibilityToggle from './FieldVisibilityToggle';

interface TextAreaWithToggleProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    isVisible: boolean;
    onToggleVisibility: () => void;
    className?: string;
    required?: boolean;
    disabled?: boolean;
    rows?: number;
}

const TextAreaWithToggle: React.FC<TextAreaWithToggleProps> = ({
    label,
    value,
    onChange,
    placeholder,
    isVisible,
    onToggleVisibility,
    className = '',
    required = false,
    disabled = false,
    rows = 3
}) => {
    return (
        <div className={`relative ${className}`}>
            <label className="block text-sm font-medium text-indigo-700 mb-1.5">
                {label}
            </label>
            <div className="relative">
                <textarea
                    rows={rows}
                    className={`w-full p-2.5 pr-14 border border-slate-300 rounded-md transition-all bg-white hover:border-slate-400 resize-none ${disabled ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                    value={value}
                    onChange={(e) => onChange(e.currentTarget.value)}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                />
                <div className="absolute right-2 top-2 border-l border-slate-200 pl-2">
                    <FieldVisibilityToggle
                        isVisible={isVisible}
                        onToggle={onToggleVisibility}
                        variant="inline"
                    />
                </div>
            </div>
        </div>
    );
};

export default TextAreaWithToggle; 