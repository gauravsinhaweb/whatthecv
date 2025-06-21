import React from 'react';
import FieldVisibilityToggle from './FieldVisibilityToggle';

interface InputFieldWithToggleProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    isVisible: boolean;
    onToggleVisibility: () => void;
    className?: string;
    required?: boolean;
    disabled?: boolean;
}

const InputFieldWithToggle: React.FC<InputFieldWithToggleProps> = ({
    label,
    value,
    onChange,
    placeholder,
    type = 'text',
    isVisible,
    onToggleVisibility,
    className = '',
    required = false,
    disabled = false
}) => {
    return (
        <div className={`relative ${className}`}>
            <label className="block text-sm font-medium text-indigo-700 mb-1.5">
                {label}
            </label>
            <div className="relative">
                <input
                    type={type}
                    className={`w-full p-2.5 pr-14 border border-slate-300 rounded-md transition-all bg-white hover:border-slate-400 ${disabled ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                    value={value}
                    onChange={(e) => onChange(e.currentTarget.value)}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 border-l border-slate-200 pl-2">
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

export default InputFieldWithToggle; 