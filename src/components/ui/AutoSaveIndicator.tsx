import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface AutoSaveIndicatorProps {
    isAutoSaving: boolean;
    lastSavedTime: Date | null;
}

const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({ isAutoSaving, lastSavedTime }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const getTimeAgo = (date: Date): string => {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds} sec ago`;
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} min ago`;
        } else {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        }
    };

    const getStatusText = (): string => {
        if (isAutoSaving) {
            return 'Saving...';
        }
        if (lastSavedTime) {
            return `Last saved: ${getTimeAgo(lastSavedTime)}`;
        }
        return 'Not saved yet';
    };

    return (
        <div className="relative inline-block">
            <div
                className="flex items-center space-x-2 text-sm text-slate-500 cursor-help"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                <div className="relative">
                    <RefreshCw
                        className={`w-4 h-4 ${isAutoSaving ? 'animate-spin' : ''}`}
                        style={{
                            animationDuration: '1s',
                            color: isAutoSaving ? '#3B82F6' : lastSavedTime ? '#10B981' : '#6B7280'
                        }}
                    />
                    {isAutoSaving && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
                <span className="text-xs">
                    {isAutoSaving ? 'Saving...' : 'Auto-saved'}
                </span>
            </div>

            {showTooltip && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-50">
                    <div className="flex items-center space-x-1">
                        <RefreshCw className="w-3 h-3" />
                        <span>{getStatusText()}</span>
                    </div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-slate-900"></div>
                </div>
            )}
        </div>
    );
};

export default AutoSaveIndicator; 