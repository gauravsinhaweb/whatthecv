import {
    AlignCenter,
    AlignLeft,
    ArrowUpDown,
    Award,
    BoldIcon,
    BookOpen,
    Briefcase,
    Check,
    ChevronDown,
    ChevronUp,
    CircleUser,
    Code,
    Columns,
    ExternalLink,
    Eye,
    EyeOff,
    FileText,
    GraduationCap,
    GripVertical,
    Lightbulb,
    Lock,
    Maximize,
    Minus,
    Move,
    Palette,
    Ruler,
    SquareDot,
    Text,
    TextCursorInput,
    Trophy,
    Type
} from 'lucide-react';
import React, { useState } from 'react';
import RadioGroup from '../../../../components/ui/RadioGroup';
import Slider from '../../../../components/ui/Slider';
import TemplateSelector from '../../../../components/resume/TemplateSelector';
import { ResumeCustomizationOptions, templatePresets } from '../../../../types/resume';
import { COLOR_PRESETS, ACCENT_COLORS, HEADING_COLORS, TEXT_COLORS } from '../../../../config/colors';
import { getFontOptions } from '../../../../config/fonts';

export interface SectionInfo {
    id: string;
    label: string;
    icon: React.ReactNode;
}

const SECTION_MAP: SectionInfo[] = [
    { id: 'personalInfo', label: 'Personal Info', icon: <CircleUser className="w-4 h-4" /> },
    { id: 'workExperience', label: 'Work Experience', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'education', label: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills', icon: <Code className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-4 h-4" /> },
    { id: 'publications', label: 'Publications', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'certifications', label: 'Certifications', icon: <Award className="w-4 h-4" /> },
];

interface ResumeCustomizationPanelProps {
    options: ResumeCustomizationOptions;
    onChange: (options: ResumeCustomizationOptions) => void;
}

const ResumeCustomizationPanel: React.FC<ResumeCustomizationPanelProps> = ({
    options,
    onChange,
}) => {
    const [draggedSection, setDraggedSection] = useState<string | null>(null);
    const [dragOverSection, setDragOverSection] = useState<string | null>(null);
    const [previewFont, setPreviewFont] = useState<string | null>(null);
    const [syncMargins, setSyncMargins] = useState(false);

    const handleChange = <T extends keyof ResumeCustomizationOptions>(
        section: T,
        field: keyof ResumeCustomizationOptions[T],
        value: any
    ) => {
        // Special case for templates layout change - apply template preset
        if (section === 'layout' && field === 'templates') {
            const templatePreset = templatePresets[value];
            if (templatePreset) {
                // Apply the template preset - this only affects customization options, not resume data
                // The resume data should remain intact when changing templates
                onChange({
                    ...options,
                    ...templatePreset
                });
            } else {
                // Fallback to default behavior
                onChange({
                    ...options,
                    [section]: {
                        ...(options[section] as object),
                        [field]: value,
                    },
                });
            }
            return;
        }

        // Default behavior for other changes
        onChange({
            ...options,
            [section]: {
                ...(options[section] as object),
                [field]: value,
            },
        });
    };

    const handleFontPreview = (fontName: string | null) => {
        // Only update the preview state, don't change the actual selection
        setPreviewFont(fontName);
    };

    const handleNestedChange = <
        T extends keyof ResumeCustomizationOptions,
        U extends keyof ResumeCustomizationOptions[T]
    >(
        section: T,
        subSection: U,
        field: keyof ResumeCustomizationOptions[T][U],
        value: any
    ) => {
        // Special handling when margins are synced
        if (syncMargins && section === 'spacing' && subSection === 'margins') {
            onChange({
                ...options,
                [section]: {
                    ...(options[section] as object),
                    [subSection]: {
                        ...(options[section][subSection] as object),
                        left: value,
                        right: value,
                        top: value,
                        bottom: value,
                    } as any,
                },
            });
            return;
        }

        // Default behavior for other changes
        onChange({
            ...options,
            [section]: {
                ...(options[section] as object),
                [subSection]: {
                    ...(options[section][subSection] as object),
                    [field]: value,
                } as any,
            },
        });
    };

    const getSectionById = (id: string): SectionInfo => {
        // Check if it's a custom section
        if (id.startsWith('custom_')) {
            const customSection = options.customSections?.find(section => section.id === id);
            if (customSection) {
                return {
                    id: customSection.id,
                    label: customSection.title,
                    icon: <FileText className="w-4 h-4" />
                };
            }
        }

        // Return predefined section or default
        return SECTION_MAP.find(section => section.id === id) || SECTION_MAP[0];
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, sectionId: string) => {
        e.dataTransfer.setData('text/plain', sectionId);
        setDraggedSection(sectionId);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, sectionId: string) => {
        e.preventDefault();
        if (draggedSection !== sectionId) {
            setDragOverSection(sectionId);
        }
    };

    const handleDragEnd = () => {
        setDraggedSection(null);
        setDragOverSection(null);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetSectionId: string) => {
        e.preventDefault();
        const sourceSectionId = e.dataTransfer.getData('text/plain');

        if (sourceSectionId !== targetSectionId) {
            const sourceIndex = options.layout.sectionOrder.indexOf(sourceSectionId);
            const targetIndex = options.layout.sectionOrder.indexOf(targetSectionId);

            // Create a new order array without modifying the original
            const newOrder = [...options.layout.sectionOrder];

            // If source section is not in sectionOrder (custom section), add it
            if (sourceIndex === -1) {
                newOrder.push(sourceSectionId);
            } else {
                // Remove the source section
                newOrder.splice(sourceIndex, 1);
            }

            // If target section is not in sectionOrder (custom section), add it
            if (targetIndex === -1) {
                newOrder.push(targetSectionId);
            }

            // Get the final target index
            const finalTargetIndex = newOrder.indexOf(targetSectionId);

            // Insert at the target position
            if (sourceIndex === -1) {
                // If source was not in original order, insert at target position
                newOrder.splice(finalTargetIndex, 0, sourceSectionId);
            } else {
                // If source was in original order, insert at target position
                newOrder.splice(finalTargetIndex, 0, sourceSectionId);
            }

            // Make sure personalInfo is always the first section
            const personalInfoIndex = newOrder.indexOf('personalInfo');
            if (personalInfoIndex > 0) {
                // If personalInfo exists and isn't already first, move it to the front
                newOrder.splice(personalInfoIndex, 1);
                newOrder.unshift('personalInfo');
            } else if (personalInfoIndex === -1 && options.layout.sectionOrder.includes('personalInfo')) {
                // If personalInfo was in the original but not in new order, add it back at the front
                newOrder.unshift('personalInfo');
            }

            handleChange('layout', 'sectionOrder', newOrder);
        }

        setDraggedSection(null);
        setDragOverSection(null);
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200">
            {/* <div className="flex justify-between items-center p-4 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                    Customize
                </h2>
            </div> */}
            <div className="p-6 space-y-10 hide-scrollbar overflow-y-auto">
                <div id="layout" className="scroll-mt-16">
                    <div className="space-y-8">
                        <div className="bg-slate-50 p-5 rounded-xl">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <Columns className="w-5 h-5 text-blue-600" />
                                Templates
                            </h3>
                            <TemplateSelector
                                selectedTemplate={options.layout.templates}
                                onTemplateSelect={(templateId) => handleChange('layout', 'templates', templateId)}
                            />
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl">
                            <h3 className="text-base font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                <Move className="w-4 h-4 text-blue-600" />
                                Rearrange Sections
                            </h3>
                            <p className="text-xs text-slate-500 mb-3">Drag and drop to reorder, or toggle visibility.</p>
                            <div className="space-y-2">
                                {/* Get all sections including custom ones */}
                                {(() => {
                                    // Get all section IDs from sectionOrder
                                    const sectionIds = [...options.layout.sectionOrder];

                                    // Add custom sections that aren't already in sectionOrder
                                    options.customSections?.forEach(customSection => {
                                        if (!sectionIds.includes(customSection.id)) {
                                            sectionIds.push(customSection.id);
                                        }
                                    });

                                    return sectionIds
                                        .filter(section => section !== 'personalInfo')
                                        .map((section) => {
                                            const sectionInfo = getSectionById(section);
                                            const isVisible = options.layout.visibleSections?.[section] !== false;

                                            return (
                                                <div
                                                    key={section}
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, section)}
                                                    onDragOver={(e) => handleDragOver(e, section)}
                                                    onDragEnd={handleDragEnd}
                                                    onDrop={(e) => handleDrop(e, section)}
                                                    className={`flex items-center justify-between bg-white p-3 rounded-lg border ${draggedSection === section
                                                        ? 'opacity-50 border-blue-400 shadow-md'
                                                        : dragOverSection === section
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : isVisible
                                                                ? 'border-slate-200 hover:border-blue-300'
                                                                : 'border-slate-200 bg-slate-100/70 hover:border-slate-300'
                                                        } hover:shadow-sm transition-all cursor-grab active:cursor-grabbing`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <GripVertical className="w-4 h-4 text-slate-400" />
                                                        <span className={`text-sm font-medium flex items-center gap-2 ${isVisible ? 'text-slate-800' : 'text-slate-500'}`}>
                                                            {React.cloneElement(sectionInfo.icon as React.ReactElement, { className: "w-4 h-4" })}
                                                            {sectionInfo.label}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        {/* Up/Down movement buttons */}
                                                        <div className="flex flex-col mr-1">
                                                            <button
                                                                className={`p-0.5 rounded transition-colors ${section === options.layout.sectionOrder[1] ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-100'}`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (section !== options.layout.sectionOrder[1]) {
                                                                        const currentIndex = options.layout.sectionOrder.indexOf(section);
                                                                        if (currentIndex > 1) { // Don't move above personalInfo
                                                                            const newOrder = [...options.layout.sectionOrder];
                                                                            const temp = newOrder[currentIndex];
                                                                            newOrder[currentIndex] = newOrder[currentIndex - 1];
                                                                            newOrder[currentIndex - 1] = temp;
                                                                            handleChange('layout', 'sectionOrder', newOrder);
                                                                        }
                                                                    }
                                                                }}
                                                                title="Move up"
                                                                disabled={section === options.layout.sectionOrder[1]}
                                                            >
                                                                <ChevronUp className="w-3 h-3" />
                                                            </button>
                                                            <button
                                                                className={`p-0.5 rounded transition-colors ${section === options.layout.sectionOrder[options.layout.sectionOrder.length - 1] ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-100'}`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (section !== options.layout.sectionOrder[options.layout.sectionOrder.length - 1]) {
                                                                        const currentIndex = options.layout.sectionOrder.indexOf(section);
                                                                        if (currentIndex !== -1 && currentIndex < options.layout.sectionOrder.length - 1) {
                                                                            const newOrder = [...options.layout.sectionOrder];
                                                                            const temp = newOrder[currentIndex];
                                                                            newOrder[currentIndex] = newOrder[currentIndex + 1];
                                                                            newOrder[currentIndex + 1] = temp;
                                                                            handleChange('layout', 'sectionOrder', newOrder);
                                                                        }
                                                                    }
                                                                }}
                                                                title="Move down"
                                                                disabled={section === options.layout.sectionOrder[options.layout.sectionOrder.length - 1]}
                                                            >
                                                                <ChevronDown className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                        {section !== 'personalInfo' && (
                                                            <button
                                                                className={`p-1.5 rounded-full transition-colors ${isVisible ? 'text-slate-500 hover:text-blue-600 hover:bg-blue-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200'}`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleChange('layout', 'visibleSections', {
                                                                        ...options.layout.visibleSections,
                                                                        [section]: !isVisible
                                                                    });
                                                                }}
                                                                title={isVisible ? "Hide section" : "Show section"}
                                                            >
                                                                {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        });
                                })()}
                            </div>
                        </div>

                        <div className="bg-slate-50 p-5 rounded-xl">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                Summary Section
                            </h3>
                            <div className="flex items-center mt-2">
                                <input
                                    type="checkbox"
                                    id="showSummary"
                                    checked={options.showSummary}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({
                                        ...options,
                                        showSummary: e.currentTarget.checked
                                    })}
                                    className="h-5 w-5 rounded border-slate-400 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="showSummary" className="ml-3 block text-base text-slate-700">
                                    Show summary section
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="header" className="scroll-mt-16">
                    <div className="bg-slate-50 p-5 rounded-xl">
                        <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                            <CircleUser className="w-5 h-5 text-blue-600" />
                            Header Settings
                        </h3>
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <RadioGroup
                                        name="nameSize"
                                        label="Name Size"
                                        options={[
                                            { value: 's', label: 'S' },
                                            { value: 'm', label: 'M' },
                                            { value: 'l', label: 'L' },
                                            { value: 'xl', label: 'XL' },
                                        ]}
                                        value={options.header.nameSize}
                                        onChange={(value) => handleChange('header', 'nameSize', value)}
                                        orientation="horizontal"
                                        variant="segmented"
                                        size="md"
                                    />
                                    <div className="flex items-center mt-4">
                                        <input
                                            type="checkbox"
                                            id="nameBold"
                                            checked={options.header.nameBold}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('header', 'nameBold', e.currentTarget.checked)}
                                            className="h-5 w-5 rounded border-slate-400 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="nameBold" className="ml-3 block text-base text-slate-700 flex items-center gap-1.5">
                                            Bold name
                                            <BoldIcon className="w-4 h-4" />
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <RadioGroup
                                        name="jobTitleSize"
                                        label="Job Title Size"
                                        options={[
                                            { value: 's', label: 'Small' },
                                            { value: 'm', label: 'Medium' },
                                            { value: 'l', label: 'Large' },
                                        ]}
                                        value={options.header.jobTitleSize}
                                        onChange={(value) => handleChange('header', 'jobTitleSize', value)}
                                        orientation="horizontal"
                                        variant="segmented"
                                        size="md"
                                    />
                                </div>
                            </div>

                            <RadioGroup
                                name="headerAlignment"
                                label="Header Alignment"
                                options={[
                                    { value: 'left', label: 'Left', icon: <AlignLeft className="w-5 h-5" /> },
                                    { value: 'center', label: 'Center', icon: <AlignCenter className="w-5 h-5" /> },
                                ]}
                                value={options.header.alignment || 'left'}
                                onChange={(value) => handleChange('header', 'alignment', value)}
                                orientation="horizontal"
                                variant="button"
                                size="md"
                            />

                            {/* <div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="showPhoto"
                                        checked={options.header.showPhoto}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('header', 'showPhoto', e.currentTarget.checked)}
                                        className="h-5 w-5 rounded border-slate-400 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="showPhoto" className="ml-3 block text-base text-slate-700">
                                        Show photo/initials
                                    </label>
                                </div>

                                {options.header.showPhoto && (
                                    <div className="mt-6 pl-5 space-y-6 border-l-2 border-slate-200">
                                        <RadioGroup
                                            name="photoSize"
                                            label="Size"
                                            options={[
                                                { value: 'small', label: 'Small' },
                                                { value: 'medium', label: 'Medium' },
                                                { value: 'large', label: 'Large' },
                                            ]}
                                            value={options.header.photoSize || 'medium'}
                                            onChange={(value) => handleChange('header', 'photoSize', value)}
                                            orientation="horizontal"
                                            variant="segmented"
                                            size="md"
                                        />

                                        <RadioGroup
                                            name="photoBorder"
                                            label="Border Style"
                                            options={[
                                                { value: 'none', label: 'None' },
                                                { value: 'thin', label: 'Thin' },
                                                { value: 'medium', label: 'Medium' },
                                                { value: 'thick', label: 'Thick' },
                                            ]}
                                            value={options.header.photoBorder || 'thin'}
                                            onChange={(value) => handleChange('header', 'photoBorder', value)}
                                            orientation="horizontal"
                                            variant="segmented"
                                            size="md"
                                        />

                                        <RadioGroup
                                            name="photoStyle"
                                            label="Color Accent"
                                            options={[
                                                { value: 'accent', label: 'Accent' },
                                                { value: 'headings', label: 'Heading' },
                                                { value: 'border', label: 'Border' },
                                                { value: 'none', label: 'None' },
                                            ]}
                                            value={options.header.photoStyle || 'accent'}
                                            onChange={(value) => handleChange('header', 'photoStyle', value)}
                                            orientation="horizontal"
                                            variant="segmented"
                                            size="md"
                                        />
                                    </div>
                                )}
                            </div> */}

                            <div>
                                <h4 className="block text-base font-medium text-slate-700">Social Icons</h4>
                                <div className="space-y-6 mt-4 pl-5 border-l-2 border-slate-200">
                                    <RadioGroup
                                        name="socialIconStyle"
                                        label="Style"
                                        options={[
                                            { value: 'outline', label: 'Outline', icon: <ExternalLink className="w-5 h-5" strokeWidth={1.75} /> },
                                            { value: 'filled', label: 'Filled', icon: <ExternalLink className="w-5 h-5" strokeWidth={1.5} data-filled-icon="true" /> },
                                        ]}
                                        value={options.socialIcons.style}
                                        onChange={(value) => handleChange('socialIcons', 'style', value)}
                                        orientation="horizontal"
                                        variant="button"
                                        size="md"
                                    />

                                    <RadioGroup
                                        name="socialIconSize"
                                        label="Size"
                                        options={[
                                            { value: 'small', label: 'Small' },
                                            { value: 'medium', label: 'Medium' },
                                            { value: 'large', label: 'Large' },
                                        ]}
                                        value={options.socialIcons.size}
                                        onChange={(value) => handleChange('socialIcons', 'size', value)}
                                        orientation="horizontal"
                                        variant="segmented"
                                        size="md"
                                    />

                                    <RadioGroup
                                        name="socialIconColor"
                                        label="Color"
                                        options={[
                                            { value: 'accent', label: 'Accent' },
                                            { value: 'headings', label: 'Heading' },
                                            { value: 'text', label: 'Text' },
                                            { value: 'custom', label: 'Custom' },
                                        ]}
                                        value={options.socialIcons.color}
                                        onChange={(value) => handleChange('socialIcons', 'color', value)}
                                        orientation="horizontal"
                                        variant="segmented"
                                        size="md"
                                    />

                                    {options.socialIcons.color === 'custom' && (
                                        <div className="flex items-center gap-3 mt-2">
                                            <input
                                                type="color"
                                                value={options.socialIcons.customColor || '#000000'}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('socialIcons', 'customColor', e.currentTarget.value)}
                                                className="h-10 w-10 p-1 border border-slate-300 rounded-md"
                                            />
                                            <input
                                                type="text"
                                                value={options.socialIcons.customColor || '#000000'}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const hexColor = e.currentTarget.value;
                                                    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hexColor)) {
                                                        handleChange('socialIcons', 'customColor', hexColor);
                                                    } else if (hexColor.startsWith('#') || hexColor.length <= 7) {
                                                        e.currentTarget.value = hexColor;
                                                    }
                                                }}
                                                placeholder="#000000"
                                                className="w-28 h-10 px-3 py-1 text-sm border border-slate-300 rounded-md"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="sectionTitles" className="scroll-mt-16">
                    <div className="bg-slate-50 p-5 rounded-xl">
                        <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                            <TextCursorInput className="w-5 h-5 text-blue-600" />
                            Section Titles
                        </h3>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <RadioGroup
                                    name="sectionTitleSize"
                                    label="Size"
                                    options={[
                                        { value: 's', label: 'Small' },
                                        { value: 'm', label: 'Medium' },
                                        { value: 'l', label: 'Large' },
                                        { value: 'xl', label: 'X-Large' },
                                    ]}
                                    value={options.sectionTitles.size}
                                    onChange={(value) => handleChange('sectionTitles', 'size', value)}
                                    orientation="horizontal"
                                    variant="segmented"
                                    size="md"
                                />

                                <RadioGroup
                                    name="sectionTitleStyle"
                                    label="Style"
                                    options={[
                                        { value: 'uppercase', label: 'UPPERCASE' },
                                        { value: 'capitalize', label: 'Capitalize' },
                                        { value: 'normal', label: 'Normal' },
                                    ]}
                                    value={options.sectionTitles.style}
                                    onChange={(value) => handleChange('sectionTitles', 'style', value)}
                                    orientation="horizontal"
                                    variant="segmented"
                                    size="md"
                                />
                            </div>

                            <div className="flex items-center gap-8 pt-2">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="sectionTitlesBold"
                                        checked={options.sectionTitles.bold}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('sectionTitles', 'bold', e.currentTarget.checked)}
                                        className="h-5 w-5 rounded border-slate-400 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="sectionTitlesBold" className="ml-3 block text-base text-slate-700 flex items-center gap-1.5">
                                        Bold
                                        <BoldIcon className="w-4 h-4" />
                                    </label>
                                </div>
                            </div>
                            <div className='pt-4'>
                                <RadioGroup
                                    name="sectionTitleDecoration"
                                    label="Decoration"
                                    options={[
                                        { value: 'clean', label: 'Clean', icon: <Text className="w-5 h-5" /> },
                                        { value: 'underline', label: 'Underline', icon: <Minus className="w-5 h-5" /> },
                                        { value: 'bottomBorder', label: 'Bottom Border', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 18.5H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg> },
                                        { value: 'fullBorder', label: 'Full Border', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.25H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M2.5 14.75H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg> },
                                    ]}
                                    value={options.sectionTitles.decoration}
                                    onChange={(value) => handleChange('sectionTitles', 'decoration', value)}
                                    orientation="horizontal"
                                    variant="button"
                                    size="md"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div id="font" className="scroll-mt-16">
                    <div className="bg-slate-50 p-5 rounded-xl">
                        <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                            <Type className="w-5 h-5 text-blue-600" />
                            Font Settings
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-base font-medium text-slate-700 mb-3">Font Family</label>
                                <RadioGroup
                                    name="fontFamily"
                                    options={[
                                        { value: 'serif', label: 'Serif', icon: <Type className="w-5 h-5" /> },
                                        { value: 'sans', label: 'Sans-serif', icon: <Type className="w-5 h-5" /> },
                                    ]}
                                    value={options.font.family}
                                    onChange={(value) => handleChange('font', 'family', value)}
                                    variant="button"
                                    size="md"
                                />
                            </div>

                            <div>
                                <label className="block text-base font-medium text-slate-700 mb-3">Specific Font</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {getFontOptions(options.font.family).map((font) => (
                                        <button
                                            key={font.name}
                                            className={`flex items-center justify-between w-full p-3 text-sm rounded-lg border ${previewFont === font.name ? 'bg-blue-50 text-blue-700 border-blue-200' : options.font.specificFont === font.name ? 'bg-white text-slate-800 border-blue-400 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'}`}
                                            style={{ fontFamily: font.name }}
                                            onClick={() => handleChange('font', 'specificFont', font.name)}
                                            onMouseEnter={() => handleFontPreview(font.name)}
                                            onMouseLeave={() => handleFontPreview(null)}
                                        >
                                            <div className="flex-col items-start text-left">
                                                <div>{font.name}</div>
                                                {font.description && <div className="text-xs text-slate-500">{font.description}</div>}
                                            </div>
                                            {options.font.specificFont === font.name && <Check className="w-4 h-4 text-blue-600" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="colors" className="scroll-mt-16">
                    <div className="space-y-8">
                        <div className="bg-slate-50 p-5 rounded-xl">
                            <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                                <Palette className="w-5 h-5 text-blue-600" />
                                Color Themes
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                                {COLOR_PRESETS.map((theme) => (
                                    <button
                                        key={theme.name}
                                        className={`p-4 rounded-xl border-2 ${theme.accent === options.colors.accent &&
                                            theme.headings === options.colors.headings &&
                                            theme.text === options.colors.text
                                            ? 'border-blue-400 bg-blue-50'
                                            : 'border-slate-200 bg-white hover:border-blue-300'
                                            } transition-all flex flex-col`}
                                        onClick={() => {
                                            onChange({
                                                ...options,
                                                colors: {
                                                    accent: theme.accent,
                                                    headings: theme.headings,
                                                    text: theme.text
                                                }
                                            });
                                        }}
                                    >
                                        <div className="flex justify-between gap-2 mb-4">
                                            <div className="w-12 h-12 rounded-full" style={{ backgroundColor: theme.accent }}></div>
                                            <div className="flex-1 flex flex-col gap-1.5">
                                                <div className="h-4 rounded" style={{ backgroundColor: theme.headings }}></div>
                                                <div className="h-3 rounded-sm" style={{ backgroundColor: theme.text }}></div>
                                                <div className="h-3 rounded-sm" style={{ backgroundColor: theme.text, opacity: 0.7 }}></div>
                                                <div className="h-3 rounded-sm" style={{ backgroundColor: theme.text, opacity: 0.5 }}></div>
                                            </div>
                                        </div>
                                        <span className="text-sm text-slate-700 font-medium">{theme.name}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8 space-y-8">
                                <h4 className="text-base font-semibold text-slate-700">Custom Colors</h4>

                                <div className="space-y-6">
                                    {/* Accent Color */}
                                    <div>
                                        <label className="block text-base font-medium text-slate-700 mb-3">Accent</label>
                                        <div className="flex flex-wrap gap-3 items-center">
                                            {ACCENT_COLORS.map((color) => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    className={`w-10 h-10 rounded-lg border-2 transition-all ${options.colors.accent === color ? 'border-blue-500 scale-110' : 'border-white hover:border-slate-300'}`}
                                                    style={{ backgroundColor: color }}
                                                    onClick={() => handleChange('colors', 'accent', color)}
                                                />
                                            ))}
                                            <div className="relative w-10 h-10">
                                                <input
                                                    type="color"
                                                    value={options.colors.accent}
                                                    onChange={(e) => handleChange('colors', 'accent', (e.target as HTMLInputElement).value)}
                                                    className="w-full h-full rounded-lg border-2 opacity-0 absolute inset-0 cursor-pointer"
                                                />
                                                <div
                                                    className={`w-full h-full rounded-lg border-2 ${!ACCENT_COLORS.includes(options.colors.accent) ? 'border-blue-500 scale-110' : 'border-gray-300'}`}
                                                    style={{ background: 'conic-gradient(from 180deg at 50% 50%, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)' }}
                                                />
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-500 mt-2">Links, highlights</p>
                                    </div>

                                    {/* Heading Color */}
                                    <div>
                                        <label className="block text-base font-medium text-slate-700 mb-3">Headings</label>
                                        <div className="flex flex-wrap gap-3 items-center">
                                            {HEADING_COLORS.map((color) => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    className={`w-10 h-10 rounded-lg border-2 transition-all ${options.colors.headings === color ? 'border-blue-500 scale-110' : 'border-white hover:border-slate-300'}`}
                                                    style={{ backgroundColor: color }}
                                                    onClick={() => handleChange('colors', 'headings', color)}
                                                />
                                            ))}
                                            <div className="relative w-10 h-10">
                                                <input
                                                    type="color"
                                                    value={options.colors.headings}
                                                    onChange={(e) => handleChange('colors', 'headings', (e.target as HTMLInputElement).value)}
                                                    className="w-full h-full rounded-lg border-2 opacity-0 absolute inset-0 cursor-pointer"
                                                />
                                                <div
                                                    className={`w-full h-full rounded-lg border-2 ${!HEADING_COLORS.includes(options.colors.headings) ? 'border-blue-500 scale-110' : 'border-gray-300'}`}
                                                    style={{ background: 'conic-gradient(from 180deg at 50% 50%, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)' }}
                                                />
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-500 mt-2">Name, section titles</p>
                                    </div>

                                    {/* Text Color */}
                                    <div>
                                        <label className="block text-base font-medium text-slate-700 mb-3">Body Text</label>
                                        <div className="flex flex-wrap gap-3 items-center">
                                            {TEXT_COLORS.map((color) => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    className={`w-10 h-10 rounded-lg border-2 transition-all ${options.colors.text === color ? 'border-blue-500 scale-110' : 'border-white hover:border-slate-300'}`}
                                                    style={{ backgroundColor: color }}
                                                    onClick={() => handleChange('colors', 'text', color)}
                                                />
                                            ))}
                                            <div className="relative w-10 h-10">
                                                <input
                                                    type="color"
                                                    value={options.colors.text}
                                                    onChange={(e) => handleChange('colors', 'text', (e.target as HTMLInputElement).value)}
                                                    className="w-full h-full rounded-lg border-2 opacity-0 absolute inset-0 cursor-pointer"
                                                />
                                                <div
                                                    className={`w-full h-full rounded-lg border-2 ${!TEXT_COLORS.includes(options.colors.text) ? 'border-blue-500 scale-110' : 'border-gray-300'}`}
                                                    style={{ background: 'conic-gradient(from 180deg at 50% 50%, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)' }}
                                                />
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-500 mt-2">Main content</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="spacing" className="scroll-mt-16">
                    <div className="space-y-8">
                        <div className="bg-slate-50 p-5 rounded-xl">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <Ruler className="w-5 h-5 text-blue-600" />
                                Text Sizing
                            </h3>
                            <Slider
                                min={8}
                                max={14}
                                step={0.5}
                                value={options.spacing.fontSize}
                                onChange={(value) => handleChange('spacing', 'fontSize', value)}
                                unit="pt"
                                icon={<TextCursorInput className="w-4 h-4" />}
                                label="Font Size"
                                recommendedValue={10.5}
                            />

                            <Slider
                                min={1}
                                max={2}
                                step={0.05}
                                value={options.spacing.lineHeight}
                                onChange={(value) => handleChange('spacing', 'lineHeight', value)}
                                icon={<Ruler className="w-4 h-4" />}
                                label="Line Height"
                                recommendedValue={1.25}
                            />
                            <Slider
                                min={16}
                                max={48}
                                step={2}
                                value={options.spacing.sectionGap}
                                onChange={(value) => handleChange('spacing', 'sectionGap', value)}
                                unit="px"
                                icon={<ArrowUpDown className="w-4 h-4" />}
                                label="Section Gap"
                            />
                        </div>

                        <div className="bg-slate-50 p-5 rounded-xl">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <Maximize className="w-5 h-5 text-blue-600" />
                                Margins
                            </h3>

                            <div className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    id="syncMargins"
                                    checked={syncMargins}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSyncMargins(e.currentTarget.checked)}
                                    className="h-5 w-5 rounded border-slate-400 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="syncMargins" className="ml-3 block text-base text-slate-700 flex items-center gap-1.5">
                                    Sync all margins
                                    <Lock className="w-4 h-4" />
                                </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Slider
                                    label={syncMargins ? "All Margins" : "Left Margin"}
                                    min={5}
                                    max={30}
                                    value={options.spacing.margins.left}
                                    onChange={(value) =>
                                        handleNestedChange('spacing', 'margins', 'left', value)
                                    }
                                    unit="mm"
                                    icon={<SquareDot className="w-4 h-4" />}
                                />
                                {!syncMargins && (
                                    <>
                                        <Slider
                                            label="Right Margin"
                                            min={5}
                                            max={30}
                                            value={options.spacing.margins.right}
                                            onChange={(value) =>
                                                handleNestedChange('spacing', 'margins', 'right', value)
                                            }
                                            unit="mm"
                                            icon={<SquareDot className="w-4 h-4" />}
                                        />
                                        <Slider
                                            label="Top Margin"
                                            min={5}
                                            max={30}
                                            value={options.spacing.margins.top}
                                            onChange={(value) =>
                                                handleNestedChange('spacing', 'margins', 'top', value)
                                            }
                                            unit="mm"
                                            icon={<SquareDot className="w-4 h-4" />}
                                        />
                                        <Slider
                                            label="Bottom Margin"
                                            min={5}
                                            max={30}
                                            value={options.spacing.margins.bottom}
                                            onChange={(value) =>
                                                handleNestedChange('spacing', 'margins', 'bottom', value)
                                            }
                                            unit="mm"
                                            icon={<SquareDot className="w-4 h-4" />}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeCustomizationPanel; 