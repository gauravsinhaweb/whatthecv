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
    Link as ChainLink
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
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
        const sections = document.querySelectorAll('[id^="layout"], [id^="colors"], [id^="spacing"], [id^="font"], [id^="header"], [id^="sectionTitles"], [id^="skills"]');
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
                        <span className="hidden xs:inline">Font</span>
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
                        <ArrowDownUp className="w-4 h-4 text-blue-600" />
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
                        <Text className="w-4 h-4 text-blue-600" />
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
                        href="#links"
                        className={`px-2 py-2 sm:px-3 sm:py-2 rounded-md flex items-center gap-1 text-xs sm:text-sm font-medium 
                        ${activeSection === 'links' ? 'bg-white text-blue-700 shadow-sm' : 'hover:bg-white hover:text-blue-700'} 
                        transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('links')?.scrollIntoView({ behavior: 'smooth' });
                            window.history.pushState(null, '', '#links');
                        }}
                    >
                        <ExternalLink className="w-4 h-4 text-blue-600" />
                        <span className="hidden xs:inline">Links</span>
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
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                        <PaintBucket className="w-3.5 h-3.5 text-blue-600" />
                                        Accent Color
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            '#2563eb', // Blue
                                            '#0891b2', // Cyan
                                            '#0d9488', // Teal
                                            '#059669', // Green
                                            '#7c3aed', // Violet
                                            '#8b5cf6', // Purple
                                            '#c026d3', // Fuchsia
                                            '#db2777', // Pink
                                            '#e11d48', // Rose
                                            '#dc2626', // Red
                                            '#ea580c', // Orange
                                            '#d97706', // Amber
                                            '#65a30d', // Lime
                                            '#1e3a8a', // Navy
                                            '#000000', // Black
                                        ].map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                className={`w-8 h-8 rounded-full transition-transform ${options.colors.accent === color ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-110 border border-slate-200'}`}
                                                style={{ backgroundColor: color }}
                                                onClick={() => handleChange('colors', 'accent', color)}
                                                aria-label={`Select ${color} as accent color`}
                                            />
                                        ))}
                                        <div className="relative w-8 h-8">
                                            <input
                                                type="color"
                                                value={options.colors.accent}
                                                onChange={(e) => handleChange('colors', 'accent', (e.target as HTMLInputElement).value)}
                                                className="absolute inset-0 w-8 h-8 opacity-0 cursor-pointer"
                                            />
                                            <div className="w-8 h-8 rounded-full border border-slate-300 bg-white flex items-center justify-center hover:border-blue-300 transition-colors">
                                                <span className="text-xs">+</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                                        Headings Color
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            '#1e3a8a', // Navy
                                            '#1e40af', // Dark Blue
                                            '#1d4ed8', // Blue
                                            '#0f172a', // Slate
                                            '#44403c', // Stone
                                            '#3f3f46', // Zinc
                                            '#374151', // Gray
                                            '#064e3b', // Dark Green
                                            '#7e22ce', // Purple
                                            '#831843', // Dark Pink
                                            '#7f1d1d', // Dark Red
                                            '#000000', // Black
                                            '#134e4a', // Dark Teal
                                            '#701a75', // Dark Magenta
                                            '#451a03', // Dark Brown
                                        ].map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                className={`w-8 h-8 rounded-full transition-transform ${options.colors.headings === color ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-110 border border-slate-200'}`}
                                                style={{ backgroundColor: color }}
                                                onClick={() => handleChange('colors', 'headings', color)}
                                                aria-label={`Select ${color} as headings color`}
                                            />
                                        ))}
                                        <div className="relative w-8 h-8">
                                            <input
                                                type="color"
                                                value={options.colors.headings}
                                                onChange={(e) => handleChange('colors', 'headings', (e.target as HTMLInputElement).value)}
                                                className="absolute inset-0 w-8 h-8 opacity-0 cursor-pointer"
                                            />
                                            <div className="w-8 h-8 rounded-full border border-slate-300 bg-white flex items-center justify-center hover:border-blue-300 transition-colors">
                                                <span className="text-xs">+</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                        <Text className="w-3.5 h-3.5 text-blue-600" />
                                        Text Color
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            '#000000', // Black
                                            '#111827', // Gray 900
                                            '#1f2937', // Gray 800
                                            '#374151', // Gray 700
                                            '#4b5563', // Gray 600
                                            '#6b7280', // Gray 500
                                            '#0f172a', // Slate 900
                                            '#1e293b', // Slate 800
                                            '#334155', // Slate 700
                                            '#44403c', // Stone 700
                                            '#3f3f46', // Zinc 700
                                            '#292524', // Stone 800
                                            '#27272a', // Zinc 800
                                            '#064e3b', // Emerald 900
                                            '#1e3a8a', // Blue 900
                                        ].map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                className={`w-8 h-8 rounded-full transition-transform ${options.colors.text === color ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-110 border border-slate-200'}`}
                                                style={{ backgroundColor: color }}
                                                onClick={() => handleChange('colors', 'text', color)}
                                                aria-label={`Select ${color} as text color`}
                                            />
                                        ))}
                                        <div className="relative w-8 h-8">
                                            <input
                                                type="color"
                                                value={options.colors.text}
                                                onChange={(e) => handleChange('colors', 'text', (e.target as HTMLInputElement).value)}
                                                className="absolute inset-0 w-8 h-8 opacity-0 cursor-pointer"
                                            />
                                            <div className="w-8 h-8 rounded-full border border-slate-300 bg-white flex items-center justify-center hover:border-blue-300 transition-colors">
                                                <span className="text-xs">+</span>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Slider
                                    label="Left Margin"
                                    min={5}
                                    max={30}
                                    value={options.spacing.margins.left}
                                    onChange={(value) =>
                                        handleNestedChange('spacing', 'margins', 'left', value)
                                    }
                                    unit="mm"
                                    icon={<SquareDot className="w-4 h-4" />}
                                />
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
                            </div>
                        </div>
                    </div>
                </div>

                <div id="font" className="scroll-mt-16">
                    <div className="space-y-6">
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-slate-800 mb-3 flex items-center gap-2">
                                <Type className="w-4 h-4 text-blue-600" />
                                Font Family
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    className={`p-4 rounded-md flex flex-col items-center justify-center transition-all ${options.font.family === 'serif'
                                        ? 'bg-blue-100 border border-blue-500'
                                        : 'bg-white border border-slate-200 hover:border-blue-300'
                                        }`}
                                    onClick={() => {
                                        onChange({
                                            ...options,
                                            font: {
                                                ...options.font,
                                                family: 'serif',
                                                specificFont: 'Amiri'
                                            }
                                        });
                                    }}
                                >
                                    <span className="text-3xl mb-2" style={{ fontFamily: 'Amiri' }}>Aa</span>
                                    <span className="text-sm text-slate-600">Serif</span>
                                </button>

                                <button
                                    className={`p-4 rounded-md flex flex-col items-center justify-center transition-all ${options.font.family === 'sans'
                                        ? 'bg-blue-100 border border-blue-500'
                                        : 'bg-white border border-slate-200 hover:border-blue-300'
                                        }`}
                                    onClick={() => {
                                        onChange({
                                            ...options,
                                            font: {
                                                ...options.font,
                                                family: 'sans',
                                                specificFont: 'Source Sans Pro'
                                            }
                                        });
                                    }}
                                >
                                    <span className="text-3xl mb-2" style={{ fontFamily: 'Source Sans Pro' }}>Aa</span>
                                    <span className="text-sm text-slate-600">Sans</span>
                                </button>

                                <button
                                    className={`p-4 rounded-md flex flex-col items-center justify-center transition-all ${options.font.family === 'mono'
                                        ? 'bg-blue-100 border border-blue-500'
                                        : 'bg-white border border-slate-200 hover:border-blue-300'
                                        }`}
                                    onClick={() => {
                                        onChange({
                                            ...options,
                                            font: {
                                                ...options.font,
                                                family: 'mono',
                                                specificFont: 'Inconsolata'
                                            }
                                        });
                                    }}
                                >
                                    <span className="text-3xl mb-2" style={{ fontFamily: 'Inconsolata' }}>Aa</span>
                                    <span className="text-sm text-slate-600">Mono</span>
                                </button>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-slate-800 mb-3 flex items-center gap-2">
                                <TextCursorInput className="w-4 h-4 text-blue-600" />
                                Font
                            </h3>

                            {options.font.family === 'sans' && (
                                <>
                                    <div className="text-sm text-slate-500 mb-2 mt-3">Select a font that best suits your professional style:</div>
                                    <div className="mb-4">
                                        <div className="text-xs font-medium text-slate-600 mb-2 uppercase tracking-wider">Modern & Clean</div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { value: 'Inter', label: 'Inter' },
                                                { value: 'Poppins', label: 'Poppins' },
                                                { value: 'Montserrat', label: 'Montserrat' },
                                                { value: 'Raleway', label: 'Raleway' },
                                                { value: 'Work Sans', label: 'Work Sans' },
                                                { value: 'Nunito', label: 'Nunito' },
                                            ].map((font) => (
                                                <button
                                                    key={font.value}
                                                    className={`p-3 border rounded-md transition-all text-center group relative ${options.font.specificFont === font.value
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : previewFont === font.value
                                                            ? 'border-blue-300 bg-blue-50/70'
                                                            : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                                                        }`}
                                                    onClick={() => {
                                                        handleChange('font', 'specificFont', font.value);
                                                        setPreviewFont(null);
                                                    }}
                                                    onMouseEnter={() => handleFontPreview(font.value)}
                                                    onMouseLeave={() => handleFontPreview(null)}
                                                    style={{ fontFamily: font.value }}
                                                >
                                                    <div className="text-2xl mb-1 transition-all group-hover:scale-110 group-hover:text-blue-600">Aa</div>
                                                    <div className="text-xs text-slate-500 truncate">{font.label}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="text-xs font-medium text-slate-600 mb-2 uppercase tracking-wider">Professional</div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { value: 'Source Sans Pro', label: 'Source Sans' },
                                                { value: 'Roboto', label: 'Roboto' },
                                                { value: 'Open Sans', label: 'Open Sans' },
                                                { value: 'Noto Sans', label: 'Noto Sans' },
                                                { value: 'Barlow', label: 'Barlow' },
                                                { value: 'Karla', label: 'Karla' },
                                            ].map((font) => (
                                                <button
                                                    key={font.value}
                                                    className={`p-3 border rounded-md transition-all text-center group relative ${options.font.specificFont === font.value
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : previewFont === font.value
                                                            ? 'border-blue-300 bg-blue-50/70'
                                                            : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                                                        }`}
                                                    onClick={() => {
                                                        handleChange('font', 'specificFont', font.value);
                                                        setPreviewFont(null);
                                                    }}
                                                    onMouseEnter={() => handleFontPreview(font.value)}
                                                    onMouseLeave={() => handleFontPreview(null)}
                                                    style={{ fontFamily: font.value }}
                                                >
                                                    <div className="text-2xl mb-1 transition-all group-hover:scale-110 group-hover:text-blue-600">Aa</div>
                                                    <div className="text-xs text-slate-500 truncate">{font.label}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-xs font-medium text-slate-600 mb-2 uppercase tracking-wider">Versatile</div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { value: 'Lato', label: 'Lato' },
                                                { value: 'Mulish', label: 'Mulish' },
                                                { value: 'Titillium Web', label: 'Titillium' },
                                                { value: 'Fira Sans', label: 'Fira Sans' },
                                                { value: 'Rubik', label: 'Rubik' },
                                                { value: 'Jost', label: 'Jost' },
                                                { value: 'Asap', label: 'Asap' },
                                                { value: 'Cabin', label: 'Cabin' },
                                            ].map((font) => (
                                                <button
                                                    key={font.value}
                                                    className={`p-3 border rounded-md transition-all text-center group relative ${options.font.specificFont === font.value
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : previewFont === font.value
                                                            ? 'border-blue-300 bg-blue-50/70'
                                                            : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                                                        }`}
                                                    onClick={() => {
                                                        handleChange('font', 'specificFont', font.value);
                                                        setPreviewFont(null);
                                                    }}
                                                    onMouseEnter={() => handleFontPreview(font.value)}
                                                    onMouseLeave={() => handleFontPreview(null)}
                                                    style={{ fontFamily: font.value }}
                                                >
                                                    <div className="text-2xl mb-1 transition-all group-hover:scale-110 group-hover:text-blue-600">Aa</div>
                                                    <div className="text-xs text-slate-500 truncate">{font.label}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {options.font.family === 'serif' && (
                                <>
                                    <div className="text-sm text-slate-500 mb-2 mt-3">Select a serif font for a traditional, sophisticated look:</div>
                                    <div className="mb-4">
                                        <div className="text-xs font-medium text-slate-600 mb-2 uppercase tracking-wider">Classic</div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { value: 'Merriweather', label: 'Merriweather' },
                                                { value: 'EB Garamond', label: 'EB Garamond' },
                                                { value: 'Libre Baskerville', label: 'Baskerville' },
                                                { value: 'PT Serif', label: 'PT Serif' },
                                                { value: 'Lora', label: 'Lora' },
                                                { value: 'Crimson Text', label: 'Crimson' },
                                            ].map((font) => (
                                                <button
                                                    key={font.value}
                                                    className={`p-3 border rounded-md transition-all text-center group relative ${options.font.specificFont === font.value
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : previewFont === font.value
                                                            ? 'border-blue-300 bg-blue-50/70'
                                                            : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                                                        }`}
                                                    onClick={() => {
                                                        handleChange('font', 'specificFont', font.value);
                                                        setPreviewFont(null);
                                                    }}
                                                    onMouseEnter={() => handleFontPreview(font.value)}
                                                    onMouseLeave={() => handleFontPreview(null)}
                                                    style={{ fontFamily: font.value }}
                                                >
                                                    <div className="text-2xl mb-1 transition-all group-hover:scale-110 group-hover:text-blue-600">Aa</div>
                                                    <div className="text-xs text-slate-500 truncate">{font.label}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="text-xs font-medium text-slate-600 mb-2 uppercase tracking-wider">Modern Serif</div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { value: 'Playfair Display', label: 'Playfair' },
                                                { value: 'Source Serif Pro', label: 'Source Serif' },
                                                { value: 'Noto Serif', label: 'Noto Serif' },
                                                { value: 'Vollkorn', label: 'Vollkorn' },
                                                { value: 'Bitter', label: 'Bitter' },
                                                { value: 'Arvo', label: 'Arvo' },
                                            ].map((font) => (
                                                <button
                                                    key={font.value}
                                                    className={`p-3 border rounded-md transition-all text-center group relative ${options.font.specificFont === font.value
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : previewFont === font.value
                                                            ? 'border-blue-300 bg-blue-50/70'
                                                            : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                                                        }`}
                                                    onClick={() => {
                                                        handleChange('font', 'specificFont', font.value);
                                                        setPreviewFont(null);
                                                    }}
                                                    onMouseEnter={() => handleFontPreview(font.value)}
                                                    onMouseLeave={() => handleFontPreview(null)}
                                                    style={{ fontFamily: font.value }}
                                                >
                                                    <div className="text-2xl mb-1 transition-all group-hover:scale-110 group-hover:text-blue-600">Aa</div>
                                                    <div className="text-xs text-slate-500 truncate">{font.label}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-xs font-medium text-slate-600 mb-2 uppercase tracking-wider">Decorative</div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { value: 'Alegreya', label: 'Alegreya' },
                                                { value: 'Amiri', label: 'Amiri' },
                                                { value: 'Crimson Pro', label: 'Crimson Pro' },
                                                { value: 'Zilla Slab', label: 'Zilla Slab' },
                                                { value: 'Aleo', label: 'Aleo' },
                                                { value: 'Cormorant Garamond', label: 'Cormorant' },
                                            ].map((font) => (
                                                <button
                                                    key={font.value}
                                                    className={`p-3 border rounded-md transition-all text-center group relative ${options.font.specificFont === font.value
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : previewFont === font.value
                                                            ? 'border-blue-300 bg-blue-50/70'
                                                            : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                                                        }`}
                                                    onClick={() => {
                                                        handleChange('font', 'specificFont', font.value);
                                                        setPreviewFont(null);
                                                    }}
                                                    onMouseEnter={() => handleFontPreview(font.value)}
                                                    onMouseLeave={() => handleFontPreview(null)}
                                                    style={{ fontFamily: font.value }}
                                                >
                                                    <div className="text-2xl mb-1 transition-all group-hover:scale-110 group-hover:text-blue-600">Aa</div>
                                                    <div className="text-xs text-slate-500 truncate">{font.label}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {options.font.family === 'mono' && (
                                <>
                                    <div className="text-sm text-slate-500 mb-2 mt-3">Select a monospace font for a technical, precise appearance:</div>
                                    <div className="mb-4">
                                        <div className="text-xs font-medium text-slate-600 mb-2 uppercase tracking-wider">Modern Monospace</div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { value: 'JetBrains Mono', label: 'JetBrains' },
                                                { value: 'Fira Mono', label: 'Fira Mono' },
                                                { value: 'IBM Plex Mono', label: 'IBM Plex' },
                                                { value: 'Roboto Mono', label: 'Roboto Mono' },
                                                { value: 'Source Code Pro', label: 'Source Code' },
                                                { value: 'Ubuntu Mono', label: 'Ubuntu' },
                                            ].map((font) => (
                                                <button
                                                    key={font.value}
                                                    className={`p-3 border rounded-md transition-all text-center group relative ${options.font.specificFont === font.value
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : previewFont === font.value
                                                            ? 'border-blue-300 bg-blue-50/70'
                                                            : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                                                        }`}
                                                    onClick={() => {
                                                        handleChange('font', 'specificFont', font.value);
                                                        setPreviewFont(null);
                                                    }}
                                                    onMouseEnter={() => handleFontPreview(font.value)}
                                                    onMouseLeave={() => handleFontPreview(null)}
                                                    style={{ fontFamily: font.value }}
                                                >
                                                    <div className="text-2xl mb-1 transition-all group-hover:scale-110 group-hover:text-blue-600">Aa</div>
                                                    <div className="text-xs text-slate-500 truncate">{font.label}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-xs font-medium text-slate-600 mb-2 uppercase tracking-wider">Classic Monospace</div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { value: 'Inconsolata', label: 'Inconsolata' },
                                                { value: 'Overpass Mono', label: 'Overpass' },
                                                { value: 'Space Mono', label: 'Space Mono' },
                                                { value: 'Courier Prime', label: 'Courier' },
                                            ].map((font) => (
                                                <button
                                                    key={font.value}
                                                    className={`p-3 border rounded-md transition-all text-center group relative ${options.font.specificFont === font.value
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : previewFont === font.value
                                                            ? 'border-blue-300 bg-blue-50/70'
                                                            : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                                                        }`}
                                                    onClick={() => {
                                                        handleChange('font', 'specificFont', font.value);
                                                        setPreviewFont(null);
                                                    }}
                                                    onMouseEnter={() => handleFontPreview(font.value)}
                                                    onMouseLeave={() => handleFontPreview(null)}
                                                    style={{ fontFamily: font.value }}
                                                >
                                                    <div className="text-2xl mb-1 transition-all group-hover:scale-110 group-hover:text-blue-600">Aa</div>
                                                    <div className="text-xs text-slate-500 truncate">{font.label}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            <p className="mt-3 text-xs text-slate-500 flex items-center gap-1">
                                <Check className="w-3 h-3 text-green-500" />
                                Selected font will be applied to the resume
                            </p>
                        </div>
                    </div>
                </div>

                <div id="header" className="scroll-mt-16">
                    <div className="space-y-6">
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-slate-800 mb-3 flex items-center gap-2">
                                <Type className="w-4 h-4 text-blue-600" />
                                Name Settings
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                        <Maximize className="w-3.5 h-3.5 text-blue-600" />
                                        Size
                                    </label>
                                    <RadioGroup
                                        name="nameSize"
                                        options={[
                                            { value: 's', label: 'Small' },
                                            { value: 'm', label: 'Medium' },
                                            { value: 'l', label: 'Large' },
                                            { value: 'xl', label: 'Extra Large' },
                                        ]}
                                        value={options.header.nameSize}
                                        onChange={(value) => handleChange('header', 'nameSize', value)}
                                        orientation="horizontal"
                                    />
                                </div>

                                <div className="flex items-center mt-3">
                                    <input
                                        type="checkbox"
                                        id="nameBold"
                                        checked={options.header.nameBold}
                                        onChange={(e) => {
                                            const target = e.target as HTMLInputElement;
                                            handleChange('header', 'nameBold', target.checked);
                                        }}
                                        className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="nameBold" className="ml-2 block text-sm text-slate-700 flex items-center gap-2">
                                        <BoldIcon className="w-3.5 h-3.5 text-blue-600" />
                                        Bold name
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-slate-800 mb-3 flex items-center gap-2">
                                <TextCursorInput className="w-4 h-4 text-blue-600" />
                                Job Title Settings
                            </h3>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                    <Maximize className="w-3.5 h-3.5 text-blue-600" />
                                    Size
                                </label>
                                <RadioGroup
                                    name="jobTitleSize"
                                    options={[
                                        { value: 's', label: 'Small' },
                                        { value: 'm', label: 'Medium' },
                                        { value: 'l', label: 'Large' },
                                    ]}
                                    value={options.header.jobTitleSize}
                                    onChange={(value) => handleChange('header', 'jobTitleSize', value)}
                                    orientation="horizontal"
                                />
                            </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-slate-800 mb-3 flex items-center gap-2">
                                <CircleUser className="w-4 h-4 text-blue-600" />
                                Profile Photo
                            </h3>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="showPhoto"
                                    checked={options.header.showPhoto}
                                    onChange={(e) => {
                                        const target = e.target as HTMLInputElement;
                                        handleChange('header', 'showPhoto', target.checked);
                                    }}
                                    className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="showPhoto" className="ml-2 block text-sm text-slate-700 flex items-center gap-2">
                                    Show profile photo
                                </label>
                            </div>
                            <p className="mt-2 text-xs text-slate-500 flex items-center">
                                <Download className="w-3 h-3 mr-1 text-blue-600" />
                                Upload your profile picture in the Personal Info section
                            </p>

                            <div className="mt-4 border-t pt-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="showSummary"
                                        checked={options.showSummary}
                                        onChange={(e) => {
                                            const target = e.target as HTMLInputElement;
                                            onChange({
                                                ...options,
                                                showSummary: target.checked
                                            });
                                        }}
                                        className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="showSummary" className="ml-2 block text-sm text-slate-700 flex items-center gap-2">
                                        <TextCursorInput className="w-3.5 h-3.5 text-blue-600" />
                                        Show professional summary
                                    </label>
                                </div>
                                <p className="mt-2 text-xs text-slate-500">
                                    Include a concise professional summary at the top of your resume
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="sectionTitles" className="scroll-mt-16">
                    <div className="space-y-6">
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-slate-800 mb-3 flex items-center gap-2">
                                <Type className="w-4 h-4 text-blue-600" />
                                Section Title Styling
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                        <Maximize className="w-3.5 h-3.5 text-blue-600" />
                                        Size
                                    </label>
                                    <RadioGroup
                                        name="sectionTitleSize"
                                        options={[
                                            { value: 's', label: 'Small' },
                                            { value: 'm', label: 'Medium' },
                                            { value: 'l', label: 'Large' },
                                            { value: 'xl', label: 'Extra Large' },
                                        ]}
                                        value={options.sectionTitles.size}
                                        onChange={(value) => handleChange('sectionTitles', 'size', value)}
                                        orientation="horizontal"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                        <Text className="w-3.5 h-3.5 text-blue-600" />
                                        Text Case
                                    </label>
                                    <RadioGroup
                                        name="sectionTitleStyle"
                                        options={[
                                            { value: 'uppercase', label: 'UPPERCASE' },
                                            { value: 'lowercase', label: 'lowercase' },
                                            { value: 'capitalize', label: 'Capitalize' },
                                            { value: 'normal', label: 'Normal' },
                                        ]}
                                        value={options.sectionTitles.style}
                                        onChange={(value) => handleChange('sectionTitles', 'style', value)}
                                        orientation="horizontal"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="sectionTitleBold"
                                            checked={options.sectionTitles.bold}
                                            onChange={(e) => {
                                                const target = e.target as HTMLInputElement;
                                                handleChange('sectionTitles', 'bold', target.checked);
                                            }}
                                            className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="sectionTitleBold" className="ml-2 block text-sm text-slate-700 flex items-center gap-2">
                                            <BoldIcon className="w-3.5 h-3.5 text-blue-600" />
                                            Bold
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="sectionTitleUnderline"
                                            checked={options.sectionTitles.underline}
                                            onChange={(e) => {
                                                const target = e.target as HTMLInputElement;
                                                handleChange('sectionTitles', 'underline', target.checked);
                                            }}
                                            className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="sectionTitleUnderline" className="ml-2 block text-sm text-slate-700 flex items-center gap-2">
                                            Underline
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="skills" className="scroll-mt-16">
                    <div className="space-y-6">
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-slate-800 mb-3 flex items-center gap-2">
                                <Award className="w-4 h-4 text-blue-600" />
                                Skills Layout
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-4">
                                        Format Style
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <button
                                            type="button"
                                            className={`p-3 border rounded-full text-center transition-all ${options.skills.format === 'grid'
                                                ? 'bg-blue-100 border-blue-300 text-blue-700'
                                                : 'bg-white hover:bg-slate-50'
                                                }`}
                                            onClick={() => handleChange('skills', 'format', 'grid')}
                                        >
                                            <span className={`text-sm ${options.skills.format === 'grid' ? 'font-medium' : ''}`}>Grid</span>
                                        </button>

                                        <button
                                            type="button"
                                            className={`p-3 border rounded-full text-center transition-all ${options.skills.format === 'level'
                                                ? 'bg-blue-100 border-blue-300 text-blue-700'
                                                : 'bg-white hover:bg-slate-50'
                                                }`}
                                            onClick={() => handleChange('skills', 'format', 'level')}
                                        >
                                            <span className={`text-sm ${options.skills.format === 'level' ? 'font-medium' : ''}`}>Level</span>
                                        </button>

                                        <button
                                            type="button"
                                            className={`p-3 border rounded-full text-center transition-all ${options.skills.format === 'compact'
                                                ? 'bg-blue-100 border-blue-300 text-blue-700'
                                                : 'bg-white hover:bg-slate-50'
                                                }`}
                                            onClick={() => handleChange('skills', 'format', 'compact')}
                                        >
                                            <span className={`text-sm ${options.skills.format === 'compact' ? 'font-medium' : ''}`}>Compact</span>
                                        </button>

                                        <button
                                            type="button"
                                            className={`p-3 border rounded-full text-center transition-all ${options.skills.format === 'bubble' || options.skills.format === 'pills'
                                                ? 'bg-blue-100 border-blue-300 text-blue-700'
                                                : 'bg-white hover:bg-slate-50'
                                                }`}
                                            onClick={() => handleChange('skills', 'format', 'pills')}
                                        >
                                            <span className={`text-sm ${options.skills.format === 'bubble' || options.skills.format === 'pills' ? 'font-medium' : ''}`}>Bubble</span>
                                        </button>

                                        <button
                                            type="button"
                                            className={`p-3 border rounded-full text-center transition-all ${options.skills.format === 'bullets'
                                                ? 'bg-blue-100 border-blue-300 text-blue-700'
                                                : 'bg-white hover:bg-slate-50'
                                                }`}
                                            onClick={() => handleChange('skills', 'format', 'bullets')}
                                        >
                                            <span className={`text-sm ${options.skills.format === 'bullets' ? 'font-medium' : ''}`}>Bullet</span>
                                        </button>

                                        <button
                                            type="button"
                                            className={`p-3 border rounded-full text-center transition-all ${options.skills.format === 'pipe'
                                                ? 'bg-blue-100 border-blue-300 text-blue-700'
                                                : 'bg-white hover:bg-slate-50'
                                                }`}
                                            onClick={() => handleChange('skills', 'format', 'pipe')}
                                        >
                                            <span className={`text-sm ${options.skills.format === 'pipe' ? 'font-medium' : ''}`}>Pipe</span>
                                        </button>

                                        <button
                                            type="button"
                                            className={`p-3 border rounded-full text-center transition-all ${options.skills.format === 'newline'
                                                ? 'bg-blue-100 border-blue-300 text-blue-700'
                                                : 'bg-white hover:bg-slate-50'
                                                }`}
                                            onClick={() => handleChange('skills', 'format', 'newline')}
                                        >
                                            <span className={`text-sm ${options.skills.format === 'newline' ? 'font-medium' : ''}`}>New Line</span>
                                        </button>

                                        <button
                                            type="button"
                                            className={`p-3 border rounded-full text-center transition-all ${options.skills.format === 'comma'
                                                ? 'bg-blue-100 border-blue-300 text-blue-700'
                                                : 'bg-white hover:bg-slate-50'
                                                }`}
                                            onClick={() => handleChange('skills', 'format', 'comma')}
                                        >
                                            <span className={`text-sm ${options.skills.format === 'comma' ? 'font-medium' : ''}`}>Comma</span>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-3">
                                        Column Layout
                                    </label>
                                    <div className="flex items-center gap-6 justify-between">
                                        <button
                                            type="button"
                                            className={`flex-1 p-4 border rounded-lg shadow-sm transition-all flex flex-col items-center ${options.skills.columns === 1
                                                ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                                                : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'
                                                }`}
                                            onClick={() => handleChange('skills', 'columns', 1)}
                                        >
                                            <div className="mb-2 w-16 h-10 flex justify-center items-center border border-slate-300 bg-white">
                                                <div className="h-8 w-full bg-slate-200 rounded"></div>
                                            </div>
                                            <span className="text-xs font-medium">1 Column</span>
                                        </button>

                                        <button
                                            type="button"
                                            className={`flex-1 p-4 border rounded-lg shadow-sm transition-all flex flex-col items-center ${options.skills.columns === 2
                                                ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                                                : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'
                                                }`}
                                            onClick={() => handleChange('skills', 'columns', 2)}
                                        >
                                            <div className="mb-2 w-16 h-10 flex gap-1 justify-center items-center border border-slate-300 bg-white">
                                                <div className="h-8 w-1/2 bg-slate-200 rounded"></div>
                                                <div className="h-8 w-1/2 bg-slate-200 rounded"></div>
                                            </div>
                                            <span className="text-xs font-medium">2 Columns</span>
                                        </button>

                                        <button
                                            type="button"
                                            className={`flex-1 p-4 border rounded-lg shadow-sm transition-all flex flex-col items-center ${options.skills.columns === 3
                                                ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                                                : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'
                                                }`}
                                            onClick={() => handleChange('skills', 'columns', 3)}
                                        >
                                            <div className="mb-2 w-16 h-10 flex gap-1 justify-center items-center border border-slate-300 bg-white">
                                                <div className="h-8 w-1/3 bg-slate-200 rounded"></div>
                                                <div className="h-8 w-1/3 bg-slate-200 rounded"></div>
                                                <div className="h-8 w-1/3 bg-slate-200 rounded"></div>
                                            </div>
                                            <span className="text-xs font-medium">3 Columns</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="links" className="scroll-mt-16">
                    <div className="space-y-6">
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-slate-800 mb-3 flex items-center gap-2">
                                <ExternalLink className="w-4 h-4 text-blue-600" />
                                Link Settings
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                        Icon Style
                                    </label>
                                    <RadioGroup
                                        name="linkIcon"
                                        options={[
                                            { value: 'external', label: 'External', icon: <ExternalLink className="w-4 h-4" /> },
                                            { value: 'arrow', label: 'Arrow', icon: <ArrowUpRight className="w-4 h-4" /> },
                                            { value: 'chain', label: 'Chain', icon: <ChainLink className="w-4 h-4" /> },
                                            { value: 'none', label: 'None', icon: <EyeOff className="w-4 h-4" /> },
                                        ]}
                                        value={options.links.icon}
                                        onChange={(value) => handleChange('links', 'icon', value)}
                                        orientation="horizontal"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                        Icon Size
                                    </label>
                                    <RadioGroup
                                        name="linkSize"
                                        options={[
                                            { value: 'small', label: 'Small' },
                                            { value: 'medium', label: 'Medium' },
                                            { value: 'large', label: 'Large' },
                                        ]}
                                        value={options.links.size}
                                        onChange={(value) => handleChange('links', 'size', value)}
                                        orientation="horizontal"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ResumeCustomizationPanel; 