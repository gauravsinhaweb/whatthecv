import React from 'react';
import { Loader2 } from 'lucide-react';

interface GoogleSignInButtonProps {
    onClick: () => Promise<void>;
    isLoading?: boolean;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    className?: string;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
    onClick,
    isLoading = false,
    disabled = false,
    size = 'lg',
    fullWidth = true,
    className = ''
}) => {
    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'px-4 py-2 text-sm';
            case 'md':
                return 'px-5 py-2.5 text-base';
            case 'lg':
                return 'px-6 py-3 text-lg';
            default:
                return 'px-6 py-3 text-lg';
        }
    };

    const getIconSize = () => {
        switch (size) {
            case 'sm':
                return 16;
            case 'md':
                return 18;
            case 'lg':
                return 20;
            default:
                return 20;
        }
    };

    const baseClasses = `
    relative inline-flex items-center justify-center 
    rounded-lg font-medium transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    border border-gray-300 bg-white text-gray-700
    hover:bg-gray-50 hover:border-gray-400 hover:shadow-md
    active:bg-gray-100 active:shadow-sm
    ${fullWidth ? 'w-full' : ''}
    ${isLoading ? 'cursor-wait' : 'cursor-pointer'}
  `;

    return (
        <button
            onClick={onClick}
            disabled={isLoading || disabled}
            className={`${baseClasses} ${getSizeClasses()} ${className}`}
            type="button"
            aria-label={isLoading ? 'Signing in with Google...' : 'Sign in with Google'}
        >
            {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin text-blue-600" size={getIconSize()} />
                    <span className="text-gray-600">Signing in...</span>
                </div>
            ) : (
                <div className="flex items-center justify-center gap-3">
                    <GoogleIcon size={getIconSize()} />
                    <span className="text-gray-700 font-medium">Continue with Google</span>
                </div>
            )}
        </button>
    );
};

const GoogleIcon: React.FC<{ size: number }> = ({ size }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className="flex-shrink-0"
        aria-hidden="true"
    >
        <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
    </svg>
);

export default GoogleSignInButton;
