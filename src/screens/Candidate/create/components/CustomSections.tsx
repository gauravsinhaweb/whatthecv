import React from 'react';
import { Edit3, Eye, EyeOff, Trash2, FileText } from 'lucide-react';
import RichTextEditor from '../../../../components/ui/RichTextEditor';

const CustomSections = ({ customizationOptions, expandedSections, activeSection, onSectionToggle, onCustomizationChange }) => (
    <>
        {customizationOptions?.customSections?.map((customSection, index) => {
            const isVisible = customizationOptions.layout.visibleSections?.[customSection.id] !== false;
            const isExpanded = expandedSections[customSection.id];
            const isActive = activeSection === customSection.id;

            return (
                <div key={customSection.id} className="border-b border-slate-200">
                    <div
                        className={`flex justify-between items-center p-4 cursor-pointer transition-all duration-200 ${isExpanded && isActive
                            ? 'bg-gradient-to-r from-slate-50 to-white shadow-sm rounded-t-md'
                            : 'hover:bg-slate-50/80'
                            }`}
                        onClick={() => onSectionToggle(customSection.id)}
                    >
                        <div className="flex items-center">
                            <FileText className={`w-5 h-5 mr-3 ${isVisible ? 'text-slate-600' : 'text-slate-400'}`} />
                            <span className={`font-medium text-base ${isVisible ? 'text-slate-900' : 'text-slate-500'}`}>
                                {customSection.title}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                className="p-1 text-slate-500 hover:text-slate-700 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const newTitle = prompt('Edit section title:', customSection.title);
                                    if (newTitle && newTitle.trim() && onCustomizationChange && customizationOptions) {
                                        const updatedSections = customizationOptions.customSections.map(section =>
                                            section.id === customSection.id
                                                ? { ...section, title: newTitle.trim() }
                                                : section
                                        );
                                        onCustomizationChange({
                                            ...customizationOptions,
                                            customSections: updatedSections
                                        });
                                    }
                                }}
                                title="Edit section title"
                            >
                                <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                                className="p-1 text-slate-500 hover:text-slate-700 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (onCustomizationChange && customizationOptions) {
                                        const isCurrentlyVisible = customizationOptions.layout.visibleSections?.[customSection.id] !== false;
                                        onCustomizationChange({
                                            ...customizationOptions,
                                            layout: {
                                                ...customizationOptions.layout,
                                                visibleSections: {
                                                    ...customizationOptions.layout.visibleSections,
                                                    [customSection.id]: !isCurrentlyVisible,
                                                    personalInfo: true
                                                }
                                            }
                                        });
                                    }
                                }}
                                title={isVisible ? "Hide section" : "Show section"}
                            >
                                {isVisible ?
                                    <Eye className="w-4 h-4" /> :
                                    <EyeOff className="w-4 h-4" />
                                }
                            </button>
                            <button
                                className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm('Are you sure you want to delete this section?') && onCustomizationChange && customizationOptions) {
                                        const updatedSections = customizationOptions.customSections.filter(
                                            section => section.id !== customSection.id
                                        );
                                        // Also remove from sectionOrder if it exists there
                                        const updatedSectionOrder = customizationOptions.layout.sectionOrder.filter(
                                            sectionId => sectionId !== customSection.id
                                        );
                                        // Remove from visibleSections
                                        const updatedVisibleSections = { ...customizationOptions.layout.visibleSections };
                                        delete updatedVisibleSections[customSection.id];

                                        onCustomizationChange({
                                            ...customizationOptions,
                                            customSections: updatedSections,
                                            layout: {
                                                ...customizationOptions.layout,
                                                sectionOrder: updatedSectionOrder,
                                                visibleSections: updatedVisibleSections
                                            }
                                        });
                                    }
                                }}
                                title="Delete section"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    {isExpanded && isActive && (
                        <div className="p-6 bg-white border-t border-slate-100 animate-fadeIn">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1.5">Content</label>
                                    <RichTextEditor
                                        value={customSection.content}
                                        onChange={(value) => {
                                            if (onCustomizationChange && customizationOptions) {
                                                const updatedSections = customizationOptions.customSections.map(section =>
                                                    section.id === customSection.id
                                                        ? { ...section, content: value }
                                                        : section
                                                );
                                                onCustomizationChange({
                                                    ...customizationOptions,
                                                    customSections: updatedSections
                                                });
                                            }
                                        }}
                                        placeholder="Add your custom content here..."
                                        rows={6}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        })}
    </>
);

export default CustomSections; 