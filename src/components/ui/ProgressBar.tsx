import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  showValue = false,
  size = 'md',
  variant = 'default',
  className = '',
  label,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const getVariantClasses = (): string => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-500';
      case 'warning':
        return 'bg-amber-500';
      case 'danger':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };
  
  const getSizeClasses = (): string => {
    switch (size) {
      case 'sm':
        return 'h-1.5';
      case 'md':
        return 'h-2.5';
      case 'lg':
        return 'h-4';
      default:
        return 'h-2.5';
    }
  };
  
  const getColorsBasedOnValue = (): string => {
    if (percentage >= 80) return 'bg-emerald-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  const barColor = variant === 'default' ? getColorsBasedOnValue() : getVariantClasses();
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          {showValue && (
            <span className="text-sm font-medium text-slate-700">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-slate-200 rounded-full overflow-hidden ${getSizeClasses()}`}>
        <div
          className={`${barColor} transition-all duration-300 ease-in-out rounded-full ${getSizeClasses()}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        ></div>
      </div>
      {!label && showValue && (
        <span className="text-sm font-medium text-slate-500 mt-1">{Math.round(percentage)}%</span>
      )}
    </div>
  );
};

export default ProgressBar;