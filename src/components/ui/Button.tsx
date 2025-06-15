import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  tokenAmount?: number;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  tokenAmount,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantClasses = (): string => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm';
      case 'secondary':
        return 'bg-slate-600 hover:bg-slate-700 text-white shadow-sm';
      case 'outline':
        return 'bg-transparent border border-slate-300 hover:bg-slate-50 text-slate-700';
      case 'ghost':
        return 'bg-transparent hover:bg-slate-100 text-slate-700';
      case 'success':
        return 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm';
      case 'warning':
        return 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white shadow-sm';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm';
    }
  };

  const getSizeClasses = (): string => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-base';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <div className="group relative inline-flex">
      <button
        className={`${baseClasses} ${getVariantClasses()} ${getSizeClasses()} ${widthClass} ${className} ${isLoading ? 'cursor-wait' : ''}`}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Processing...</span>
          </div>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </button>
      {!isLoading && tokenAmount !== undefined && (
        <div className="absolute -top-2 -right-2 bg-slate-800 text-white text-xs px-2 py-1 rounded-full shadow-lg transform transition-transform group-hover:scale-105">
          {tokenAmount} tokens
        </div>
      )}
    </div>
  );
};

export default Button; 