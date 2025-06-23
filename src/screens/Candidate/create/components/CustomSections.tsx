import React from 'react';
import RichTextEditor from '../../../../components/ui/RichTextEditor';

const CustomSections = ({ customizationOptions, expandedSections, activeSection, onSectionToggle, onCustomizationChange }) => (
    <>
        {customizationOptions?.customSections?.map((customSection, index) => {
            if (customizationOptions.layout.visibleSections?.[customSection.id] === false) {
                return null;
            }
            return (
                <div key={customSection.id} className="border-b border-slate-200">
                    <div
                        className={`flex justify-between items-center p-4 cursor-pointer transition-all duration-200 ${expandedSections[customSection.id] && activeSection === customSection.id
                            ? 'bg-gradient-to-r from-blue-50 to-white shadow-sm rounded-t-md'
                            : 'hover:bg-slate-50/80'
                            }`}
                        onClick={() => onSectionToggle(customSection.id)}
                    >
                        <div className="flex items-center">
                            <span className="font-medium text-blue-900 text-base">
                                {customSection.title}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <button
                                className="mr-2 p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const newTitle = prompt('Edit section title:', customSection.title);
                                    if (newTitle && onCustomizationChange && customizationOptions) {
                                        const updatedSections = customizationOptions.customSections.map(section =>
                                            section.id === customSection.id
                                                ? { ...section, title: newTitle }
                                                : section
                                        );
                                        onCustomizationChange({
                                            ...customizationOptions,
                                            customSections: updatedSections
                                        });
                                    }
                                }}
                            >
                                Edit
                            </button>
                            <button
                                className="mr-2 p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
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
                                title={customizationOptions.layout.visibleSections?.[customSection.id] !== false ? "Hide section" : "Show section"}
                            >
                                {customizationOptions.layout.visibleSections?.[customSection.id] !== false ? 'Hide' : 'Show'}
                            </button>
                            <button
                                className="mr-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm('Are you sure you want to delete this section?') && onCustomizationChange && customizationOptions) {
                                        const updatedSections = customizationOptions.customSections.filter(
                                            section => section.id !== customSection.id
                                        );
                                        onCustomizationChange({
                                            ...customizationOptions,
                                            customSections: updatedSections
                                        });
                                    }
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                    {expandedSections[customSection.id] && activeSection === customSection.id && (
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