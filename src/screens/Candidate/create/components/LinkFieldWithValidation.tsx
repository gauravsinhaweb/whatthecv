import React, { useState, useEffect } from 'react';
import { ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';

interface LinkFieldWithValidationProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    isVisible: boolean;
    onToggleVisibility: () => void;
    className?: string;
}

const LinkFieldWithValidation: React.FC<LinkFieldWithValidationProps> = ({
    label,
    value,
    onChange,
    placeholder = 'https://...',
    isVisible,
    onToggleVisibility,
    className = ''
}) => {
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [isTouched, setIsTouched] = useState(false);

    const validateUrl = (url: string): boolean => {
        if (!url) return true; // Empty URLs are considered valid (optional field)

        try {
            const urlObj = new URL(url);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch {
            return false;
        }
    };

    useEffect(() => {
        if (isTouched) {
            setIsValid(validateUrl(value));
        }
    }, [value, isTouched]);

    const handleChange = (newValue: string) => {
        if (!isTouched) setIsTouched(true);
        onChange(newValue);
    };

    const handleBlur = () => {
        setIsTouched(true);
    };

    const getValidationIcon = () => {
        if (!isTouched || !value) return null;

        if (isValid) {
            return <CheckCircle className="w-4 h-4 text-green-500" />;
        } else {
            return <AlertCircle className="w-4 h-4 text-red-500" />;
        }
    };

    const getValidationMessage = () => {
        if (!isTouched || !value) return null;

        if (!isValid) {
            return <span className="text-xs text-red-500 mt-1">Please enter a valid URL (e.g., https://example.com)</span>;
        }
        return null;
    };

    return (
        <div className={`relative ${className}`}>
            <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-indigo-700">
                    {label}
                </label>
                <button
                    onClick={onToggleVisibility}
                    className={`p-1 rounded transition-colors ${isVisible
                            ? 'text-blue-600 hover:text-blue-800'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                    title={isVisible ? "Hide field" : "Show field"}
                >
                    {isVisible ? (
                        <ExternalLink className="w-4 h-4" />
                    ) : (
                        <div className="w-4 h-4 border border-slate-400 rounded" />
                    )}
                </button>
            </div>

            {isVisible && (
                <div className="relative">
                    <input
                        type="url"
                        value={value}
                        onChange={(e) => handleChange(e.target.value)}
                        onBlur={handleBlur}
                        placeholder={placeholder}
                        className={`w-full p-2.5 pr-10 border rounded-md transition-all bg-white hover:border-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isTouched && value && !isValid
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-slate-300'
                            }`}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {getValidationIcon()}
                    </div>
                </div>
            )}

            {getValidationMessage()}
        </div>
    );
};

export default LinkFieldWithValidation; 