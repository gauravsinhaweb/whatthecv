import React from 'react';
import { TEMPLATE_CONFIG, TEMPLATE_ORDER, TemplateConfig } from '../../config/templates';

interface TemplateSelectorProps {
    selectedTemplate: string;
    onTemplateSelect: (templateId: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
    selectedTemplate,
    onTemplateSelect
}) => {
    const renderTemplateButton = (templateId: string) => {
        const template: TemplateConfig = TEMPLATE_CONFIG[templateId];
        const IconComponent = template.icon;
        const isSelected = selectedTemplate === templateId;

        return (
            <button
                key={templateId}
                onClick={() => onTemplateSelect(templateId)}
                className={`relative flex-shrink-0 max-w-56 bg-white rounded-lg border-2 transition-all ${isSelected
                        ? 'border-blue-200 shadow-lg'
                        : 'border-slate-200 hover:border-blue-200 hover:shadow-md'
                    }`}
            >
                <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between p-2 border-b border-slate-100">
                        <IconComponent className="w-4 h-4 text-slate-600" />
                        <span className="text-xs font-medium text-slate-700">{template.name}</span>
                    </div>
                    <div className="flex-1 relative">
                        <img
                            src={template.preview}
                            alt={`${template.name} Template`}
                            className="w-full h-full aspect-[210/297] object-cover rounded-b"
                        />
                    </div>
                </div>
                {template.badge && (
                    <span
                        className={`absolute bottom-2 right-2 bg-gradient-to-r ${template.badge.gradient} text-white text-[10px] font-semibold px-3 py-1 shadow-md z-10`}
                        style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 10% 100%, 0% 80%)' }}
                    >
                        {template.badge.text}
                    </span>
                )}
            </button>
        );
    };

    return (
        <div className="relative">
            <div className="flex gap-4 overflow-x-auto p-4 hide-scrollbar">
                {TEMPLATE_ORDER.map(renderTemplateButton)}
            </div>
        </div>
    );
};

export default TemplateSelector; 