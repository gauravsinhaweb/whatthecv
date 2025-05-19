import {
    AlignLeft,
    ArrowDownUp,
    Award,
    BoldIcon,
    Briefcase,
    Check,
    CircleUser,
    Columns,
    Download,
    Eye,
    EyeOff,
    FileText,
    GraduationCap,
    GripVertical,
    LayoutGrid,
    Lightbulb,
    Maximize,
    Move,
    PaintBucket,
    Palette,
    Ruler,
    SlidersHorizontal,
    SquareDot,
    Text,
    TextCursorInput,
    Type,
    ExternalLink,
    ArrowUpRight,
    Link as ChainLink,
    Lock
} from 'lucide-react';
import React, { useEffect, useState, ChangeEvent } from 'react';
import RadioGroup from '../../../../components/ui/RadioGroup';
import Slider from '../../../../components/ui/Slider';
import { ResumeCustomizationOptions } from '../../../../types/resume';

export interface SectionInfo {
    id: string;
    label: string;
    icon: React.ReactNode;
}

const SECTION_MAP: SectionInfo[] = [
    { id: 'personalInfo', label: 'Personal Info', icon: <CircleUser className="w-4 h-4" /> },
    { id: 'workExperience', label: 'Work Experience', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'education', label: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills', icon: <Award className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <Lightbulb className="w-4 h-4" /> },
];

interface ResumeCustomizationPanelProps {
    options: ResumeCustomizationOptions;
    onChange: (options: ResumeCustomizationOptions) => void;
    onSave: () => void;
    onSaveAsDraft: () => void;
}

const ResumeCustomizationPanel: React.FC<ResumeCustomizationPanelProps> = ({
    options,
    onChange,
    onSave,
    onSaveAsDraft,
}) => {
    const [draggedSection, setDraggedSection] = useState<string | null>(null);
    const [dragOverSection, setDragOverSection] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState('layout');
    const [previewFont, setPreviewFont] = useState<string | null>(null);
    const [syncMargins, setSyncMargins] = useState(false);

    // Create intersection observer for scroll spy
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                        // Update URL without page reload
                        window.history.replaceState(null, '', `#${entry.target.id}`);
                    }
                });
            },
            { rootMargin: '-20% 0px -75% 0px' }
        );

        // Observe all section elements
        const sections = document.querySelectorAll('[id="layout"], [id="header"], [id="sectionTitles"], [id="skills"], [id="font"], [id="colors"], [id="spacing"]');
        sections.forEach((section) => {
            observer.observe(section);
        });

        return () => {
            sections.forEach((section) => {
                observer.unobserve(section);
            });
        };
    }, []);

    const handleChange = <T extends keyof ResumeCustomizationOptions>(
        section: T,
        field: keyof ResumeCustomizationOptions[T],
        value: any
    ) => {
        // Special case for columns layout change - adjust font size and line height
        if (section === 'layout' && field === 'columns') {
            const newOptions = {
                ...options,
                [section]: {
                    ...(options[section] as object),
                    [field]: value,
                },
            };

            // Adjust font size and line height based on selected layout
            if (value === 'two') {
                // Two-column layout - increase font size and line height
                newOptions.spacing = {
                    ...options.spacing,
                    fontSize: 11.5,
                    lineHeight: 1.5
                };
            } else {
                // One-column layout - use default font size and line height
                newOptions.spacing = {
                    ...options.spacing,
                    fontSize: 10.5,
                    lineHeight: 1.2
                };
            }

            onChange(newOptions);
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

            // Remove the source section
            newOrder.splice(sourceIndex, 1);

            // Insert at the target position
            newOrder.splice(targetIndex, 0, sourceSectionId);

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
        <div className="bg-white rounded-lg shadow-md border border-slate-200">
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                    Customize
                </h2>
            </div>

            <div className="sticky top-0 z-10 bg-white border-b border-slate-200 p-2">
                <div className="flex flex-wrap gap-1 justify-between sm:justify-center bg-slate-100 rounded-md p-1 overflow-x-auto hide-scrollbar">
                    <a
                        href="#layout"
                        className={`px-2 py-2 sm:px-3 sm:py-2 rounded-md flex items-center gap-1 text-xs sm:text-sm font-medium 
                        ${activeSection === 'layout' ? 'bg-white text-blue-700 shadow-sm' : 'hover:bg-white hover:text-blue-700'} 
                        transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('layout')?.scrollIntoView({ behavior: 'smooth' });
                            window.history.pushState(null, '', '#layout');
                        }}
                    >
                        <LayoutGrid className="w-4 h-4 text-blue-600" />
                        <span className="hidden xs:inline">Layout</span>
                    </a>
                    <a
                        href="#header"
                        className={`px-2 py-2 sm:px-3 sm:py-2 rounded-md flex items-center gap-1 text-xs sm:text-sm font-medium 
                        ${activeSection === 'header' ? 'bg-white text-blue-700 shadow-sm' : 'hover:bg-white hover:text-blue-700'} 
                        transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('header')?.scrollIntoView({ behavior: 'smooth' });
                            window.history.pushState(null, '', '#header');
                        }}
                    >
                        <CircleUser className="w-4 h-4 text-blue-600" />
                        <span className="hidden xs:inline">Header</span>
                    </a>
                    <a
                        href="#sectionTitles"
                        className={`px-2 py-2 sm:px-3 sm:py-2 rounded-md flex items-center gap-1 text-xs sm:text-sm font-medium 
                        ${activeSection === 'sectionTitles' ? 'bg-white text-blue-700 shadow-sm' : 'hover:bg-white hover:text-blue-700'} 
                        transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('sectionTitles')?.scrollIntoView({ behavior: 'smooth' });
                            window.history.pushState(null, '', '#sectionTitles');
                        }}
                    >
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="hidden xs:inline">Sections</span>
                    </a>
                    <a
                        href="#skills"
                        className={`px-2 py-2 sm:px-3 sm:py-2 rounded-md flex items-center gap-1 text-xs sm:text-sm font-medium 
                        ${activeSection === 'skills' ? 'bg-white text-blue-700 shadow-sm' : 'hover:bg-white hover:text-blue-700'} 
                        transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
                            window.history.pushState(null, '', '#skills');
                        }}
                    >
                        <Award className="w-4 h-4 text-blue-600" />
                        <span className="hidden xs:inline">Skills</span>
                    </a>
                    <a
                        href="#font"
                        className={`px-2 py-2 sm:px-3 sm:py-2 rounded-md flex items-center gap-1 text-xs sm:text-sm font-medium 
                        ${activeSection === 'font' ? 'bg-white text-blue-700 shadow-sm' : 'hover:bg-white hover:text-blue-700'} 
                        transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('font')?.scrollIntoView({ behavior: 'smooth' });
                            window.history.pushState(null, '', '#font');
                        }}
                    >
                        <Type className="w-4 h-4 text-blue-600" />
                        <span className="hidden xs:inline">Fonts</span>
                    </a>
                    <a
                        href="#colors"
                        className={`px-2 py-2 sm:px-3 sm:py-2 rounded-md flex items-center gap-1 text-xs sm:text-sm font-medium 
                        ${activeSection === 'colors' ? 'bg-white text-blue-700 shadow-sm' : 'hover:bg-white hover:text-blue-700'} 
                        transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('colors')?.scrollIntoView({ behavior: 'smooth' });
                            window.history.pushState(null, '', '#colors');
                        }}
                    >
                        <Palette className="w-4 h-4 text-blue-600" />
                        <span className="hidden xs:inline">Colors</span>
                    </a>
                    <a
                        href="#spacing"
                        className={`px-2 py-2 sm:px-3 sm:py-2 rounded-md flex items-center gap-1 text-xs sm:text-sm font-medium 
                        ${activeSection === 'spacing' ? 'bg-white text-blue-700 shadow-sm' : 'hover:bg-white hover:text-blue-700'} 
                        transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('spacing')?.scrollIntoView({ behavior: 'smooth' });
                            window.history.pushState(null, '', '#spacing');
                        }}
                    >
                        <Ruler className="w-4 h-4 text-blue-600" />
                        <span className="hidden xs:inline">Spacing</span>
                    </a>
                </div>
            </div>

            <div className="p-4 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div id="layout" className="scroll-mt-16">
                    <div className="space-y-6">
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-slate-800 mb-3 flex items-center gap-2">
                                <Columns className="w-4 h-4 text-blue-600" />
                                Columns
                            </h3>
                            <RadioGroup
                                name="columns"
                                options={[
                                    { value: 'one', label: 'One Column', icon: <AlignLeft className="w-4 h-4" /> },
                                    { value: 'two', label: 'Two Columns', icon: <Columns className="w-4 h-4" /> },
                                ]}
                                value={options.layout.columns}
                                onChange={(value) => handleChange('layout', 'columns', value)}
                                variant="button"
                            />
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-slate-800 mb-3 flex items-center gap-2">
                                <Move className="w-4 h-4 text-blue-600" />
                                Rearrange Sections
                            </h3>
                            <p className="text-sm text-slate-500 mb-3">Drag and drop sections to reorder them, toggle to show/hide</p>
                            <div className="space-y-2">
                                {options.layout.sectionOrder
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
                                                className={`flex items-center justify-between bg-white p-3 rounded-md border ${draggedSection === section
                                                    ? 'opacity-50 border-blue-300'
                                                    : dragOverSection === section
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : isVisible
                                                            ? 'border-slate-200 hover:border-blue-200'
                                                            : 'border-slate-200 bg-slate-50 hover:border-blue-200'
                                                    } hover:shadow-sm transition-all cursor-grab`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <GripVertical className="w-4 h-4 text-slate-400" />
                                                    <span className={`text-sm font-medium flex items-center gap-2 ${isVisible ? 'text-slate-700' : 'text-slate-400'}`}>
                                                        {sectionInfo.icon}
                                                        {sectionInfo.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    {section !== 'personalInfo' && (
                                                        <button
                                                            className={`p-1.5 rounded-full transition-colors ${isVisible ? 'text-slate-500 hover:text-blue-600 hover:bg-blue-50' : 'text-red-400 hover:text-red-600 hover:bg-red-50'}`}
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
                                    })}
                            </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-600" />
                                Summary Section
                            </h3>
                            <div className="flex items-center mt-1">
                                <input
                                    type="checkbox"
                                    id="showSummary"
                                    checked={options.showSummary}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({
                                        ...options,
                                        showSummary: e.currentTarget.checked
                                    })}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="showSummary" className="ml-2 block text-sm text-slate-600">
                                    Show summary section
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="header" className="scroll-mt-16">
                    <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
                            <CircleUser className="w-4 h-4 text-blue-600" />
                            Header Settings
                        </h3>
                        <div className="space-y-5">
                            <RadioGroup
                                name="nameSize"
                                label="Name Size"
                                options={[
                                    { value: 's', label: 'Small' },
                                    { value: 'm', label: 'Medium' },
                                    { value: 'l', label: 'Large' },
                                    { value: 'xl', label: 'X-Large' },
                                ]}
                                value={options.header.nameSize}
                                onChange={(value) => handleChange('header', 'nameSize', value)}
                                orientation="horizontal"
                                variant="segmented"
                                size="sm"
                            />

                            <div className="flex items-center mt-1">
                                <input
                                    type="checkbox"
                                    id="nameBold"
                                    checked={options.header.nameBold}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('header', 'nameBold', e.currentTarget.checked)}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="nameBold" className="ml-2 block text-sm text-slate-600 flex items-center gap-1">
                                    Bold name
                                    <BoldIcon className="w-3.5 h-3.5" />
                                </label>
                            </div>

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
                                size="sm"
                            />

                            <div className="flex items-center mt-4">
                                <input
                                    type="checkbox"
                                    id="showPhoto"
                                    checked={options.header.showPhoto}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('header', 'showPhoto', e.currentTarget.checked)}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="showPhoto" className="ml-2 block text-sm text-slate-600">
                                    Show photo/initials
                                </label>
                            </div>

                            {options.header.showPhoto && (
                                <div className="mt-3 pl-6 space-y-3 border-l-2 border-slate-100">
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
                                        size="sm"
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
                                        size="sm"
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
                                        size="sm"
                                    />
                                </div>
                            )}

                            <div className="mt-5">
                                <h4 className="block text-sm font-medium text-slate-700 mb-2">Social Icons</h4>
                                <div className="space-y-4 ml-2 mt-3">
                                    <RadioGroup
                                        name="socialIconStyle"
                                        label="Style"
                                        options={[
                                            { value: 'outline', label: 'Outline', icon: <ExternalLink className="w-4 h-4" strokeWidth={1.75} /> },
                                            { value: 'filled', label: 'Filled', icon: <ExternalLink className="w-4 h-4" strokeWidth={1.5} data-filled-icon="true" /> },
                                        ]}
                                        value={options.socialIcons.style}
                                        onChange={(value) => handleChange('socialIcons', 'style', value)}
                                        orientation="horizontal"
                                        variant="button"
                                        size="sm"
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
                                        size="sm"
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
                                        size="sm"
                                    />

                                    {options.socialIcons.color === 'custom' && (
                                        <div className="flex items-center gap-2 mt-2">
                                            <input
                                                type="color"
                                                value={options.socialIcons.customColor || '#000000'}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('socialIcons', 'customColor', e.currentTarget.value)}
                                                className="h-8 w-8 p-1 border border-slate-200 rounded"
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
                                                className="w-24 h-8 px-2 py-1 text-sm border border-slate-200 rounded"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="sectionTitles" className="scroll-mt-16">
                    <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
                            <TextCursorInput className="w-4 h-4 text-blue-600" />
                            Section Titles
                        </h3>
                        <div className="space-y-5">
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
                                size="sm"
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
                                size="sm"
                            />

                            <div className="flex items-center mt-1">
                                <input
                                    type="checkbox"
                                    id="sectionTitlesBold"
                                    checked={options.sectionTitles.bold}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('sectionTitles', 'bold', e.currentTarget.checked)}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="sectionTitlesBold" className="ml-2 block text-sm text-slate-600 flex items-center gap-1">
                                    Bold
                                    <BoldIcon className="w-3.5 h-3.5" />
                                </label>
                            </div>

                            <div className="flex items-center mt-1">
                                <input
                                    type="checkbox"
                                    id="sectionTitlesUnderline"
                                    checked={options.sectionTitles.underline}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('sectionTitles', 'underline', e.currentTarget.checked)}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="sectionTitlesUnderline" className="ml-2 block text-sm text-slate-600">
                                    Underline
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="skills" className="scroll-mt-16">
                    <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
                            <Award className="w-4 h-4 text-blue-600" />
                            Skills Format
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { value: 'compact', label: 'Compact', icon: <Text className="w-4 h-4" /> },
                                { value: 'comma', label: 'Comma', icon: <Text className="w-4 h-4" /> },
                                { value: 'bullets', label: 'Bullets', icon: <SquareDot className="w-4 h-4" /> },
                                { value: 'pills', label: 'Pills', icon: <SquareDot className="w-4 h-4" /> },
                                { value: 'bubble', label: 'Bubble', icon: <SquareDot className="w-4 h-4" /> },
                                { value: 'grid', label: 'Grid', icon: <LayoutGrid className="w-4 h-4" /> },
                            ].map(option => (
                                <button
                                    key={option.value}
                                    className={`p-2 border rounded-md flex flex-col items-center gap-1 ${options.skills.format === option.value
                                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                                        : 'bg-white border-slate-200 hover:border-blue-200'
                                        }`}
                                    onClick={() => handleChange('skills', 'format', option.value)}
                                >
                                    {option.icon}
                                    <span className="text-xs">{option.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="mt-4">
                            <RadioGroup
                                name="skillsColumns"
                                label="Columns"
                                options={[
                                    { value: '1', label: '1' },
                                    { value: '2', label: '2' },
                                    { value: '3', label: '3' },
                                ]}
                                value={String(options.skills.columns)}
                                onChange={(value) => handleChange('skills', 'columns', parseInt(value, 10) as 1 | 2 | 3)}
                                orientation="horizontal"
                                variant="segmented"
                                size="sm"
                            />
                        </div>
                    </div>
                </div>

                <div id="font" className="scroll-mt-16">
                    <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
                            <Type className="w-4 h-4 text-blue-600" />
                            Font Settings
                        </h3>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Font Family</label>
                                <RadioGroup
                                    name="fontFamily"
                                    options={[
                                        { value: 'serif', label: 'Serif', icon: <Type className="w-4 h-4" /> },
                                        { value: 'sans', label: 'Sans-serif', icon: <Type className="w-4 h-4" /> },
                                    ]}
                                    value={options.font.family}
                                    onChange={(value) => handleChange('font', 'family', value)}
                                    variant="button"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Specific Font</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {(() => {
                                        let fontOptions = [];
                                        if (options.font.family === 'serif') {
                                            fontOptions = [
                                                'Tinos', 'Volkhov', 'Gelasio', 'Bitter',
                                                'Times New Roman', 'Georgia', 'Merriweather',
                                                'Baskerville', 'Libre Baskerville', 'Playfair Display',
                                                'Source Serif Pro', 'Crimson Text', 'Noto Serif'
                                            ];
                                        } else {
                                            fontOptions = [
                                                'Rubik', 'Arimo', 'Lato', 'Raleway',
                                                'Exo 2', 'Chivo', 'Montserrat', 'Oswald',
                                                'Open Sans', 'Roboto', 'Poppins', 'Nunito',
                                                'Work Sans', 'Inter', 'Calibri', 'Helvetica',
                                                'Source Sans Pro', 'Noto Sans'
                                            ];
                                        }

                                        return fontOptions.map((font) => {
                                            const description =
                                                font === 'Arimo' ? 'Arial-like font' :
                                                    font === 'Tinos' ? 'Times New Roman-like font' :
                                                        font === 'Gelasio' ? 'Georgia-like font' : '';

                                            return (
                                                <button
                                                    key={font}
                                                    className={`p-2 text-sm rounded-md border ${previewFont === font ? 'bg-blue-50 text-blue-700 border-blue-200' : options.font.specificFont === font ? 'bg-white text-slate-800 border-blue-400' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'}`}
                                                    style={{ fontFamily: font }}
                                                    onClick={() => handleChange('font', 'specificFont', font)}
                                                    onMouseEnter={() => handleFontPreview(font)}
                                                    onMouseLeave={() => handleFontPreview(null)}
                                                >
                                                    <div>{font}</div>
                                                    {description && <div className="text-xs text-slate-500">{description}</div>}
                                                </button>
                                            );
                                        });
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="colors" className="scroll-mt-16">
                    <div className="space-y-6">
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
                                <Palette className="w-4 h-4 text-blue-600" />
                                Color Themes
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                                {[
                                    {
                                        name: 'Professional Blue',
                                        accent: '#000000',   // Rich Navy Blue
                                        headings: '#1C4ED8', // Deep Blue
                                        text: '#2E3A59'      // Slate Gray-Blue
                                    },
                                    {
                                        name: 'Modern Teal',
                                        accent: '#128C7E',   // Vibrant Teal
                                        headings: '#035E5B', // Dark Teal
                                        text: '#2F3E46'      // Charcoal Gray
                                    },
                                    {
                                        name: 'Creative Purple',
                                        accent: '#7C3AED',   // Bright Orchid
                                        headings: '#4C1D95', // Royal Purple
                                        text: '#383342'      // Dark Slate
                                    },
                                    {
                                        name: 'Classic Black',
                                        accent: '#222222',   // Soft Black
                                        headings: '#1A1A1A', // Off-Black
                                        text: '#333333'      // Dark Gray
                                    },
                                    {
                                        name: 'Bold Red',
                                        accent: '#B91C1C',   // True Crimson
                                        headings: '#7F1D1D', // Deep Maroon
                                        text: '#3C3434'      // Warm Graphite
                                    },
                                    {
                                        name: 'Earthy Green',
                                        accent: '#587047',   // Olive Green
                                        headings: '#3E5A36', // Forest Green
                                        text: '#3B3F32'      // Brownish Gray
                                    }
                                ]
                                    .map((theme) => (
                                        <button
                                            key={theme.name}
                                            className={`p-3 rounded-md border ${theme.accent === options.colors.accent &&
                                                theme.headings === options.colors.headings &&
                                                theme.text === options.colors.text
                                                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
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
                                            <div className="flex justify-between gap-1 mb-3">
                                                <div className="w-10 h-10 rounded-full" style={{ backgroundColor: theme.accent }}></div>
                                                <div className="flex-1 flex flex-col gap-1">
                                                    <div className="h-3 rounded-sm" style={{ backgroundColor: theme.headings }}></div>
                                                    <div className="h-2 rounded-sm" style={{ backgroundColor: theme.text }}></div>
                                                    <div className="h-2 rounded-sm" style={{ backgroundColor: theme.text, opacity: 0.7 }}></div>
                                                    <div className="h-2 rounded-sm" style={{ backgroundColor: theme.text, opacity: 0.5 }}></div>
                                                </div>
                                            </div>
                                            <span className="text-xs text-slate-600 font-medium">{theme.name}</span>
                                        </button>
                                    ))}
                            </div>

                            <div className="mt-6 space-y-5">
                                <h4 className="text-base font-medium text-slate-700">Custom Colors</h4>

                                <div className="grid grid-cols-1 gap-5">
                                    {/* Accent Color */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <ChainLink className="w-3.5 h-3.5 text-blue-600" />
                                            <label className="block text-sm font-medium text-slate-700">
                                                Accent/Link Color
                                            </label>
                                        </div>

                                        <div className="flex gap-2 items-center">
                                            <input
                                                type="color"
                                                value={options.colors.accent}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('colors', 'accent', e.currentTarget.value)}
                                                className="h-8 w-8 p-1 border border-slate-200 rounded"
                                            />
                                            <input
                                                type="text"
                                                value={options.colors.accent}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const hexColor = e.currentTarget.value;
                                                    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hexColor)) {
                                                        handleChange('colors', 'accent', hexColor);
                                                    } else if (hexColor.startsWith('#') || hexColor.length <= 7) {
                                                        e.currentTarget.value = hexColor;
                                                    }
                                                }}
                                                placeholder="#3B82F6"
                                                className="w-24 h-8 px-2 py-1 text-sm border border-slate-200 rounded"
                                            />
                                            <div className="text-xs text-slate-500 flex-1">
                                                Used for links and highlights
                                            </div>
                                        </div>
                                    </div>

                                    {/* Heading Color */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <TextCursorInput className="w-3.5 h-3.5 text-blue-600" />
                                            <label className="block text-sm font-medium text-slate-700">
                                                Heading Color
                                            </label>
                                        </div>

                                        <div className="flex gap-2 items-center">
                                            <input
                                                type="color"
                                                value={options.colors.headings}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('colors', 'headings', e.currentTarget.value)}
                                                className="h-8 w-8 p-1 border border-slate-200 rounded"
                                            />
                                            <input
                                                type="text"
                                                value={options.colors.headings}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const hexColor = e.currentTarget.value;
                                                    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hexColor)) {
                                                        handleChange('colors', 'headings', hexColor);
                                                    } else if (hexColor.startsWith('#') || hexColor.length <= 7) {
                                                        e.currentTarget.value = hexColor;
                                                    }
                                                }}
                                                placeholder="#1C4ED8"
                                                className="w-24 h-8 px-2 py-1 text-sm border border-slate-200 rounded"
                                            />
                                            <div className="text-xs text-slate-500 flex-1">
                                                Used for section titles and name
                                            </div>
                                        </div>
                                    </div>

                                    {/* Text Color */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Type className="w-3.5 h-3.5 text-blue-600" />
                                            <label className="block text-sm font-medium text-slate-700">
                                                Text Color
                                            </label>
                                        </div>

                                        <div className="flex gap-2 items-center">
                                            <input
                                                type="color"
                                                value={options.colors.text}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('colors', 'text', e.currentTarget.value)}
                                                className="h-8 w-8 p-1 border border-slate-200 rounded"
                                            />
                                            <input
                                                type="text"
                                                value={options.colors.text}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const hexColor = e.currentTarget.value;
                                                    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hexColor)) {
                                                        handleChange('colors', 'text', hexColor);
                                                    } else if (hexColor.startsWith('#') || hexColor.length <= 7) {
                                                        e.currentTarget.value = hexColor;
                                                    }
                                                }}
                                                placeholder="#1A202C"
                                                className="w-24 h-8 px-2 py-1 text-sm border border-slate-200 rounded"
                                            />
                                            <div className="text-xs text-slate-500 flex-1">
                                                Used for main content text
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="spacing" className="scroll-mt-16">
                    <div className="space-y-6">
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-slate-800 mb-3 flex items-center gap-2">
                                <Ruler className="w-4 h-4 text-blue-600" />
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
                            />

                            <Slider
                                min={1}
                                max={2}
                                step={0.1}
                                value={options.spacing.lineHeight}
                                onChange={(value) => handleChange('spacing', 'lineHeight', value)}
                                icon={<Ruler className="w-4 h-4" />}
                                label="Line Height"
                            />
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-slate-800 mb-3 flex items-center gap-2">
                                <Maximize className="w-4 h-4 text-blue-600" />
                                Margins
                            </h3>

                            <div className="flex items-center mb-3">
                                <input
                                    type="checkbox"
                                    id="syncMargins"
                                    checked={syncMargins}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSyncMargins(e.currentTarget.checked)}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="syncMargins" className="ml-2 block text-sm text-slate-600 flex items-center gap-1">
                                    Sync all margins
                                    <Lock className="w-3.5 h-3.5" />
                                </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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