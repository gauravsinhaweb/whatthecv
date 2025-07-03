import React from 'react';
import { LucideIcon, Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: LucideIcon | React.ReactNode;
  rightIcon?: LucideIcon | React.ReactNode;
  fullWidth?: boolean;
  tokenAmount?: number;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
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

  const getIconSize = (): number => {
    switch (size) {
      case 'sm':
        return 12;
      case 'md':
        return 18;
      case 'lg':
        return 20;
      default:
        return 18;
    }
  };

  const renderIcon = (icon: LucideIcon | React.ReactNode, className: string = '') => {
    if (!icon) return null;

    // Check if it's a LucideIcon component (has displayName or name property)
    if (typeof icon === 'function' || (icon as any)?.displayName || (icon as any)?.name) {
      const IconComponent = icon as LucideIcon;
      return <IconComponent className={className} size={getIconSize()} />;
    }

    // Otherwise, render as JSX element
    return <span className={className}>{icon as React.ReactNode}</span>;
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
            <Loader2 className="animate-spin" size={getIconSize()} />
            <span>Processing...</span>
          </div>
        ) : (
          <>
            {renderIcon(LeftIcon, 'mr-2')}
            {children}
            {renderIcon(RightIcon, 'ml-2')}
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