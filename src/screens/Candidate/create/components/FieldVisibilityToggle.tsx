import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FieldVisibilityToggleProps {
    isVisible: boolean;
    onToggle: () => void;
    className?: string;
    variant?: 'default' | 'inline';
}

const FieldVisibilityToggle: React.FC<FieldVisibilityToggleProps> = ({
    isVisible,
    onToggle,
    className = '',
    variant = 'default'
}) => {
    if (variant === 'inline') {
        return (
            <button
                type="button"
                onClick={onToggle}
                className={`p-1.5 rounded-md transition-colors hover:bg-slate-100 ${className}`}
                title={isVisible ? 'Hide from resume preview' : 'Show in resume preview'}
                tabIndex={0}
                style={{ lineHeight: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
                {isVisible ? (
                    <Eye className="w-4 h-4 text-slate-500" />
                ) : (
                    <EyeOff className="w-4 h-4 text-slate-300" />
                )}
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={onToggle}
            className={`ml-1 p-1 rounded-full transition-colors hover:bg-slate-100 ${className}`}
            title={isVisible ? 'Hide from resume preview' : 'Show in resume preview'}
            tabIndex={0}
            style={{ lineHeight: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
            {isVisible ? (
                <Eye className="w-4 h-4 text-slate-500" />
            ) : (
                <EyeOff className="w-4 h-4 text-slate-300" />
            )}
        </button>
    );
};

export default FieldVisibilityToggle; 