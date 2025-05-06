import React, { useState, ChangeEvent } from 'react';
import {
    ArrowDownUp,
    Columns,
    LayoutGrid,
    PaintBucket,
    Palette,
    Ruler,
    Type,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../components/ui/Tabs';
import RadioGroup from '../../../../components/ui/RadioGroup';
import ColorPicker from '../../../../components/ui/ColorPicker';
import Slider from '../../../../components/ui/Slider';
import Button from '../../../../components/ui/Button';

export interface ResumeCustomizationOptions {
    layout: {
        columns: 'one' | 'two' | 'mix';
        sectionOrder: string[];
    };
    colors: {
        mode: 'basic' | 'advanced';
        type: 'single' | 'multi' | 'image';
        accent: string;
        headings: string;
        text: string;
        background: string;
        backgroundImage?: string;
    };
    spacing: {
        fontSize: number;
        lineHeight: number;
        margins: {
            left: number;
            right: number;
            top: number;
            bottom: number;
        };
        sectionSpacing: number;
    };
    font: {
        family: 'serif' | 'sans' | 'mono';
        specificFont: string;
        headingStyle: {
            capitalization: 'capitalize' | 'uppercase' | 'normal';
            size: 's' | 'm' | 'l' | 'xl';
            icons: 'none' | 'outline' | 'filled';
        };
    };
    header: {
        details: {
            icon: 'bullet' | 'bar' | 'none';
            shape: 'none' | 'rounded' | 'square' | 'circle';
        };
        nameSize: 'xs' | 's' | 'm' | 'l' | 'xl';
        nameBold: boolean;
        jobTitleSize: 's' | 'm' | 'l';
        jobTitlePosition: 'same-line' | 'below';
        jobTitleStyle: 'normal' | 'italic';
        showPhoto: boolean;
    };
    footer: {
        showPageNumbers: boolean;
        showEmail: boolean;
        showName: boolean;
    };
}

const defaultCustomizationOptions: ResumeCustomizationOptions = {
    layout: {
        columns: 'one',
        sectionOrder: ['personalInfo', 'workExperience', 'education', 'skills', 'projects'],
    },
    colors: {
        mode: 'basic',
        type: 'single',
        accent: '#2563eb', // blue-600
        headings: '#1e3a8a', // blue-900
        text: '#000000',
        background: '#ffffff',
    },
    spacing: {
        fontSize: 9,
        lineHeight: 1.2,
        margins: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
        },
        sectionSpacing: 10,
    },
    font: {
        family: 'sans',
        specificFont: 'Source Sans Pro',
        headingStyle: {
            capitalization: 'capitalize',
            size: 'm',
            icons: 'none',
        },
    },
    header: {
        details: {
            icon: 'bullet',
            shape: 'none',
        },
        nameSize: 'l',
        nameBold: true,
        jobTitleSize: 'm',
        jobTitlePosition: 'same-line',
        jobTitleStyle: 'normal',
        showPhoto: false,
    },
    footer: {
        showPageNumbers: true,
        showEmail: true,
        showName: true,
    },
};

const FONT_OPTIONS = [
    { value: 'Source Sans Pro', label: 'Source Sans Pro' },
    { value: 'Karla', label: 'Karla' },
    { value: 'Mulish', label: 'Mulish' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Titillium Web', label: 'Titillium Web' },
    { value: 'Work Sans', label: 'Work Sans' },
    { value: 'Barlow', label: 'Barlow' },
    { value: 'Jost', label: 'Jost' },
    { value: 'Fira Sans', label: 'Fira Sans' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Rubik', label: 'Rubik' },
    { value: 'Asap', label: 'Asap' },
    { value: 'Nunito', label: 'Nunito' },
    { value: 'Open Sans', label: 'Open Sans' },
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
    const [activeTab, setActiveTab] = useState('layout');

    const handleChange = <T extends keyof ResumeCustomizationOptions>(
        section: T,
        field: keyof ResumeCustomizationOptions[T],
        value: any
    ) => {
        onChange({
            ...options,
            [section]: {
                ...options[section],
                [field]: value,
            },
        });
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
                ...options[section],
                [subSection]: {
                    ...options[section][subSection],
                    [field]: value,
                } as any,
            },
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Customize Resume</h2>
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onSaveAsDraft}
                    >
                        Save as Draft
                    </Button>
                    <Button size="sm" onClick={onSave}>
                        Save Resume
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="layout">
                        <LayoutGrid className="w-4 h-4 mr-2" />
                        Layout
                    </TabsTrigger>
                    <TabsTrigger value="colors">
                        <Palette className="w-4 h-4 mr-2" />
                        Colors
                    </TabsTrigger>
                    <TabsTrigger value="spacing">
                        <Ruler className="w-4 h-4 mr-2" />
                        Spacing
                    </TabsTrigger>
                    <TabsTrigger value="font">
                        <Type className="w-4 h-4 mr-2" />
                        Font
                    </TabsTrigger>
                    <TabsTrigger value="header">
                        <ArrowDownUp className="w-4 h-4 mr-2" />
                        Header
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="layout">
                    <div className="space-y-6 bg-white rounded-lg shadow p-4 mt-4">
                        <div>
                            <h3 className="text-lg font-medium text-slate-800 mb-3">Columns</h3>
                            <RadioGroup
                                name="columns"
                                options={[
                                    { value: 'one', label: 'One Column', icon: <Columns className="w-4 h-4" /> },
                                    { value: 'two', label: 'Two Columns', icon: <Columns className="w-4 h-4" /> },
                                    { value: 'mix', label: 'Mixed Layout', icon: <Columns className="w-4 h-4" /> },
                                ]}
                                value={options.layout.columns}
                                onChange={(value) => handleChange('layout', 'columns', value)}
                            />
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-slate-800 mb-3">Rearrange Sections</h3>
                            <div className="space-y-2 border rounded-md p-3">
                                <p className="text-sm text-slate-600 mb-2">
                                    Drag sections to reorder them in your resume
                                </p>
                                {/* This would be implemented with a drag and drop library in a real application */}
                                <div className="flex flex-col space-y-2">
                                    {options.layout.sectionOrder.map((section, index) => (
                                        <div
                                            key={section}
                                            className="flex items-center justify-between bg-slate-50 p-2 rounded-md border border-slate-200"
                                        >
                                            <span className="text-sm font-medium text-slate-700">
                                                {section === 'personalInfo'
                                                    ? 'Personal Info'
                                                    : section === 'workExperience'
                                                        ? 'Work Experience'
                                                        : section === 'education'
                                                            ? 'Education'
                                                            : section === 'skills'
                                                                ? 'Skills'
                                                                : 'Projects'}
                                            </span>
                                            <div className="flex space-x-1">
                                                <button
                                                    disabled={index === 0}
                                                    className="p-1 text-slate-500 hover:text-slate-700 disabled:opacity-30"
                                                    onClick={() => {
                                                        if (index > 0) {
                                                            const newOrder = [...options.layout.sectionOrder];
                                                            [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
                                                            handleChange('layout', 'sectionOrder', newOrder);
                                                        }
                                                    }}
                                                >
                                                    ↑
                                                </button>
                                                <button
                                                    disabled={index === options.layout.sectionOrder.length - 1}
                                                    className="p-1 text-slate-500 hover:text-slate-700 disabled:opacity-30"
                                                    onClick={() => {
                                                        if (index < options.layout.sectionOrder.length - 1) {
                                                            const newOrder = [...options.layout.sectionOrder];
                                                            [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
                                                            handleChange('layout', 'sectionOrder', newOrder);
                                                        }
                                                    }}
                                                >
                                                    ↓
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="colors">
                    <div className="space-y-6 bg-white rounded-lg shadow p-4 mt-4">
                        <div>
                            <h3 className="text-lg font-medium text-slate-800 mb-3">Colors Mode</h3>
                            <RadioGroup
                                name="colorMode"
                                options={[
                                    { value: 'basic', label: 'Basic' },
                                    { value: 'advanced', label: 'Advanced' },
                                ]}
                                value={options.colors.mode}
                                onChange={(value) => handleChange('colors', 'mode', value)}
                                orientation="horizontal"
                            />
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-slate-800 mb-3">Color Type</h3>
                            <RadioGroup
                                name="colorType"
                                options={[
                                    { value: 'single', label: 'Single Color', icon: <PaintBucket className="w-4 h-4" /> },
                                    { value: 'multi', label: 'Multi Color', icon: <Palette className="w-4 h-4" /> },
                                    { value: 'image', label: 'Image Background', icon: <Palette className="w-4 h-4" /> },
                                ]}
                                value={options.colors.type}
                                onChange={(value) => handleChange('colors', 'type', value)}
                            />
                        </div>

                        {options.colors.type === 'single' && (
                            <div>
                                <h3 className="text-lg font-medium text-slate-800 mb-3">Accent Color</h3>
                                <ColorPicker
                                    value={options.colors.accent}
                                    onChange={(color) => handleChange('colors', 'accent', color)}
                                />
                            </div>
                        )}

                        {options.colors.type === 'multi' && (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-medium text-slate-800 mb-3">Colors</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <ColorPicker
                                            label="Accent"
                                            value={options.colors.accent}
                                            onChange={(color) => handleChange('colors', 'accent', color)}
                                        />
                                        <ColorPicker
                                            label="Headings"
                                            value={options.colors.headings}
                                            onChange={(color) => handleChange('colors', 'headings', color)}
                                        />
                                        <ColorPicker
                                            label="Text"
                                            value={options.colors.text}
                                            onChange={(color) => handleChange('colors', 'text', color)}
                                        />
                                        <ColorPicker
                                            label="Background"
                                            value={options.colors.background}
                                            onChange={(color) => handleChange('colors', 'background', color)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {options.colors.type === 'image' && (
                            <div>
                                <h3 className="text-lg font-medium text-slate-800 mb-3">Background Image</h3>
                                <p className="text-sm text-slate-600 mb-3">
                                    Upload an image to use as the background for your resume.
                                </p>
                                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        id="background-image-upload"
                                        onChange={(e) => {
                                            const target = e.target as HTMLInputElement;
                                            const file = target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (event) => {
                                                    const target = event.target as FileReader;
                                                    handleChange('colors', 'backgroundImage', target.result);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    <label
                                        htmlFor="background-image-upload"
                                        className="cursor-pointer text-blue-600 hover:text-blue-500"
                                    >
                                        Click to upload an image
                                    </label>
                                    <p className="text-xs text-slate-500 mt-1">or drag and drop</p>
                                </div>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="spacing">
                    <div className="space-y-6 bg-white rounded-lg shadow p-4 mt-4">
                        <div>
                            <h3 className="text-lg font-medium text-slate-800 mb-3">Font Size</h3>
                            <Slider
                                min={8}
                                max={14}
                                step={0.5}
                                value={options.spacing.fontSize}
                                onChange={(value) => handleChange('spacing', 'fontSize', value)}
                                unit="pt"
                            />
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-slate-800 mb-3">Line Height</h3>
                            <Slider
                                min={1}
                                max={2}
                                step={0.1}
                                value={options.spacing.lineHeight}
                                onChange={(value) => handleChange('spacing', 'lineHeight', value)}
                            />
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-slate-800 mb-3">Margins</h3>
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
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-slate-800 mb-3">Space between Sections</h3>
                            <Slider
                                min={5}
                                max={20}
                                value={options.spacing.sectionSpacing}
                                onChange={(value) => handleChange('spacing', 'sectionSpacing', value)}
                                unit="mm"
                            />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="font">
                    <div className="space-y-6 bg-white rounded-lg shadow p-4 mt-4">
                        <div>
                            <h3 className="text-lg font-medium text-slate-800 mb-3">Font Family</h3>
                            <RadioGroup
                                name="fontFamily"
                                options={[
                                    { value: 'serif', label: 'Serif' },
                                    { value: 'sans', label: 'Sans' },
                                    { value: 'mono', label: 'Mono' },
                                ]}
                                value={options.font.family}
                                onChange={(value) => handleChange('font', 'family', value)}
                                orientation="horizontal"
                            />
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-slate-800 mb-3">Specific Font</h3>
                            <select
                                value={options.font.specificFont}
                                onChange={(e) => {
                                    const target = e.target as HTMLSelectElement;
                                    handleChange('font', 'specificFont', target.value);
                                }}
                                className="w-full p-2 border border-slate-300 rounded-md"
                            >
                                {FONT_OPTIONS.map((font) => (
                                    <option key={font.value} value={font.value}>
                                        {font.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-slate-800 mb-3">Heading Style</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Capitalization
                                    </label>
                                    <RadioGroup
                                        name="headingCapitalization"
                                        options={[
                                            { value: 'capitalize', label: 'Capitalize' },
                                            { value: 'uppercase', label: 'UPPERCASE' },
                                            { value: 'normal', label: 'Normal' },
                                        ]}
                                        value={options.font.headingStyle.capitalization}
                                        onChange={(value) =>
                                            handleNestedChange('font', 'headingStyle', 'capitalization', value)
                                        }
                                        orientation="horizontal"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Size
                                    </label>
                                    <RadioGroup
                                        name="headingSize"
                                        options={[
                                            { value: 's', label: 'Small' },
                                            { value: 'm', label: 'Medium' },
                                            { value: 'l', label: 'Large' },
                                            { value: 'xl', label: 'Extra Large' },
                                        ]}
                                        value={options.font.headingStyle.size}
                                        onChange={(value) =>
                                            handleNestedChange('font', 'headingStyle', 'size', value)
                                        }
                                        orientation="horizontal"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Icons
                                    </label>
                                    <RadioGroup
                                        name="headingIcons"
                                        options={[
                                            { value: 'none', label: 'None' },
                                            { value: 'outline', label: 'Outline' },
                                            { value: 'filled', label: 'Filled' },
                                        ]}
                                        value={options.font.headingStyle.icons}
                                        onChange={(value) =>
                                            handleNestedChange('font', 'headingStyle', 'icons', value)
                                        }
                                        orientation="horizontal"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="header">
                    <div className="space-y-6 bg-white rounded-lg shadow p-4 mt-4">
                        <div>
                            <h3 className="text-lg font-medium text-slate-800 mb-3">Header Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Icon Style
                                    </label>
                                    <RadioGroup
                                        name="headerIcon"
                                        options={[
                                            { value: 'bullet', label: 'Bullet' },
                                            { value: 'bar', label: 'Bar' },
                                            { value: 'none', label: 'None' },
                                        ]}
                                        value={options.header.details.icon}
                                        onChange={(value) =>
                                            handleNestedChange('header', 'details', 'icon', value)
                                        }
                                        orientation="horizontal"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Shape
                                    </label>
                                    <RadioGroup
                                        name="headerShape"
                                        options={[
                                            { value: 'none', label: 'None' },
                                            { value: 'rounded', label: 'Rounded' },
                                            { value: 'square', label: 'Square' },
                                            { value: 'circle', label: 'Circle' },
                                        ]}
                                        value={options.header.details.shape}
                                        onChange={(value) =>
                                            handleNestedChange('header', 'details', 'shape', value)
                                        }
                                        orientation="horizontal"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-slate-800 mb-3">Name Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Size
                                    </label>
                                    <RadioGroup
                                        name="nameSize"
                                        options={[
                                            { value: 'xs', label: 'XS' },
                                            { value: 's', label: 'S' },
                                            { value: 'm', label: 'M' },
                                            { value: 'l', label: 'L' },
                                            { value: 'xl', label: 'XL' },
                                        ]}
                                        value={options.header.nameSize}
                                        onChange={(value) => handleChange('header', 'nameSize', value)}
                                        orientation="horizontal"
                                    />
                                </div>

                                <div className="flex items-center">
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
                                    <label htmlFor="nameBold" className="ml-2 block text-sm text-slate-700">
                                        Bold name
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-slate-800 mb-3">Job Title Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
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

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Position
                                    </label>
                                    <RadioGroup
                                        name="jobTitlePosition"
                                        options={[
                                            { value: 'same-line', label: 'Same Line' },
                                            { value: 'below', label: 'Below Name' },
                                        ]}
                                        value={options.header.jobTitlePosition}
                                        onChange={(value) => handleChange('header', 'jobTitlePosition', value)}
                                        orientation="horizontal"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Style
                                    </label>
                                    <RadioGroup
                                        name="jobTitleStyle"
                                        options={[
                                            { value: 'normal', label: 'Normal' },
                                            { value: 'italic', label: 'Italic' },
                                        ]}
                                        value={options.header.jobTitleStyle}
                                        onChange={(value) => handleChange('header', 'jobTitleStyle', value)}
                                        orientation="horizontal"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-slate-800 mb-3">Photo</h3>
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
                                <label htmlFor="showPhoto" className="ml-2 block text-sm text-slate-700">
                                    Show profile picture in resume
                                </label>
                            </div>
                            <p className="mt-2 text-xs text-slate-500">
                                Note: Upload your profile picture in the "Personal Info" section of the Content tab.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-slate-800 mb-3">Footer</h3>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="showPageNumbers"
                                        checked={options.footer.showPageNumbers}
                                        onChange={(e) => {
                                            const target = e.target as HTMLInputElement;
                                            handleChange('footer', 'showPageNumbers', target.checked);
                                        }}
                                        className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="showPageNumbers" className="ml-2 block text-sm text-slate-700">
                                        Show page numbers
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="showEmail"
                                        checked={options.footer.showEmail}
                                        onChange={(e) => {
                                            const target = e.target as HTMLInputElement;
                                            handleChange('footer', 'showEmail', target.checked);
                                        }}
                                        className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="showEmail" className="ml-2 block text-sm text-slate-700">
                                        Show email in footer
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="showName"
                                        checked={options.footer.showName}
                                        onChange={(e) => {
                                            const target = e.target as HTMLInputElement;
                                            handleChange('footer', 'showName', target.checked);
                                        }}
                                        className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="showName" className="ml-2 block text-sm text-slate-700">
                                        Show name in footer
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ResumeCustomizationPanel; 