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
            <label className="block text-base text-slate-900 mb-2">
                {label}
            </label>
            <div className="relative">
                <textarea
                    rows={rows}
                    className={`w-full px-4 py-3 text-base pr-14 border border-slate-200 rounded-lg transition-all bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 resize-none ${disabled ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                    value={value}
                    onChange={(e) => onChange(e.currentTarget.value)}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                />
                <div className="absolute right-3 top-3 border-l border-slate-200 pl-2">
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