import React from 'react';

interface TabsProps {
    tabs: { id: string; label: string; icon?: React.ReactNode }[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    className?: string;
}

const Tabs: React.FC<TabsProps> = ({
    tabs,
    activeTab,
    onTabChange,
    className = '',
}) => {
    return (
        <div className={`border-b border-slate-200 mb-4 ${className}`}>
            <div className="flex space-x-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`pb-4 font-medium text-sm ${activeTab === tab.id
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-slate-600 hover:text-slate-800'
                            }`}
                        onClick={() => onTabChange(tab.id)}
                    >
                        <div className="flex items-center">
                            {tab.icon && <span className="mr-2">{tab.icon}</span>}
                            {tab.label}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Tabs; 