import { ArrowUpRight, BookOpen, Link as ChainLink, ExternalLink, FileCode, Github, Linkedin, Mail, MapPin, MessageSquare, Phone, Twitter } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ResumeCustomizationOptions, ResumeData } from '../../../../types/resume';
import peerlistIconUrl from '../../../../assets/peerlist.svg';
import { SafeHTML } from '../../../../utils/html';

interface ResumePreviewProps {
    resumeData: ResumeData;
    customizationOptions: ResumeCustomizationOptions;
    fullScreen?: boolean;
    previewScale?: number;
    fieldVisibility?: Record<string, boolean>;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({
    resumeData,
    customizationOptions,
    fullScreen = false,
    fieldVisibility = {},
}) => {
    const fontStack = 'Inter, Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif';
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState<number>(0);

    // Memoize expensive computations
    const getInitials = useMemo(() => {
        const name = resumeData.personalInfo.name;
        if (!name) return 'YN';
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }, [resumeData.personalInfo.name]);

    const getAccentColor = (opacity = 1) => {
        const hexToRgb = (hex) => {
            const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i;
            const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : { r: 0, g: 0, b: 0 };
        };

        if (customizationOptions.colors.accent) {
            const rgb = hexToRgb(customizationOptions.colors.accent);
            return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
        }

        return `rgba(59, 130, 246, ${opacity})`;
    };

    const getHeadingColor = () => {
        return customizationOptions.colors.headings || '#1e3a8a';
    };

    // Helper function to determine if template uses single column layout
    const isSingleColumnLayout = () => {
        return ['classic', 'minimal', 'professional', 'executive'].includes(customizationOptions.layout.templates);
    };

    // Helper function to determine if template uses two column layout
    const isTwoColumnLayout = () => {
        return ['modern', 'creative'].includes(customizationOptions.layout.templates);
    };

    // Memoize derived data 
    const topSkills = useMemo(() => {
        // Flatten all skills from all categories
        const allSkills = resumeData.skills.flatMap(category => category.skills);
        return allSkills.slice(0, 16);
    }, [resumeData.skills]);

    const showSummary = useMemo(() => {
        return customizationOptions.showSummary && resumeData.personalInfo.summary;
    }, [customizationOptions.showSummary, resumeData.personalInfo.summary]);

    // Format dates from YYYY-MM to Month YYYY
    const formatDate = (dateStr: string): string => {
        if (!dateStr) return '';

        // If already in Month YYYY format or says "Present", return as is
        if (dateStr.match(/^[A-Za-z]{3,}\s+\d{4}$/) || dateStr.toLowerCase() === 'present') {
            return dateStr;
        }

        // Check if in YYYY-MM format
        const match = dateStr.match(/^(\d{4})-(\d{2})$/);
        if (match) {
            const year = match[1];
            const month = parseInt(match[2], 10);

            // Convert month number to name
            const monthNames = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ];

            if (month >= 1 && month <= 12) {
                return `${monthNames[month - 1]} ${year}`;
            }
        }

        // Return original if not in expected format
        return dateStr;
    };

    // Format dates from separate month and year fields
    const formatDateFromFields = (month?: string, year?: string, showMonth: boolean = true, isCurrent: boolean = false): string => {
        if (isCurrent) return 'Present';
        if (!year) return '';

        if (!month || !showMonth) {
            return year;
        }

        // If month is already a month name (like "Jan", "Feb"), use it directly
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        // Check if month is already a month name
        if (monthNames.includes(month)) {
            return `${month} ${year}`;
        }

        // Try to parse as number (for backward compatibility)
        const monthIndex = parseInt(month, 10) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
            return `${monthNames[monthIndex]} ${year}`;
        }

        return year;
    };

    // Process text with bullet points to create proper list items
    const preprocessBulletPoints = (text: string): string[] => {
        if (!text) return [];

        const normalized = text
            .replace(/\r\n/g, '\n')
            .replace(/\u00a0/g, ' ')
            .replace(/[ \t]+\n/g, '\n')
            .trim();
        if (!normalized) return [];

        const explicitBullets =
            /(?:^|\n)\s*(?:[•◦▪‣●\-*]|(?:\d{1,2}[.)]))\s+/.test(normalized) ||
            normalized.includes('•');

        if (explicitBullets) {
            const chunks = normalized
                .split(/\n(?=\s*(?:[•◦▪‣●\-*]|(?:\d{1,2}[.)]))\s+)/)
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line) => line.replace(/^(?:[•◦▪‣●\-*]|(?:\d{1,2}[.)]))\s+/, '').trim())
                .filter(Boolean);
            if (chunks.length > 0) return chunks;
        }

        const byLines = normalized
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0);
        if (byLines.length > 1) return byLines;

        return [normalized];
    };

    const normalizeWorkDescriptionHtml = (html: string): string => {
        if (!html) return '';
        const lower = html.toLowerCase();
        if (lower.includes('<ul') || lower.includes('<ol') || lower.includes('<li')) {
            return html;
        }

        const plain = html
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/div>/gi, '\n')
            .replace(/<\/p>/gi, '\n')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\u00a0/g, ' ')
            .replace(/\s+\n/g, '\n')
            .replace(/\n{2,}/g, '\n')
            .trim();

        const points = preprocessBulletPoints(plain)
            .map((p) => p.trim())
            .filter(Boolean);

        if (points.length <= 1) {
            return html;
        }

        const toEscaped = (s: string) =>
            s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `<ul>${points.map((p) => `<li>${toEscaped(p)}</li>`).join('')}</ul>`;
    };

    const ensureBulletPoints = (text: string): string => {
        return text.replace(/•/g, '<br/>•');
    };

    // Calculate appropriate line height for bullet points based on content
    const getLineHeightClass = (content?: string): string => {
        if (!content) return 'leading-[1.25]';

        // Count the total number of bullet points by checking for <li> tags
        const bulletPointsCount = (content.match(/<li>/g) || []).length;

        // If it has many bullet points, use tighter line spacing
        if (bulletPointsCount > 4) {
            return 'leading-tight'; // 1.15
        } else if (bulletPointsCount > 2) {
            return 'leading-snug'; // 1.375
        } else {
            return 'leading-normal'; // 1.5
        }
    };

    // Get font size based on name size setting
    const getNameFontSize = () => {
        switch (customizationOptions.header.nameSize) {
            case 's': return 'text-2xl';
            case 'm': return 'text-3xl';
            case 'l': return 'text-4xl';
            case 'xl': return 'text-5xl';
            default: return 'text-4xl';
        }
    };

    // Get job title font size based on setting
    const getJobTitleFontSize = () => {
        switch (customizationOptions.header.jobTitleSize) {
            case 's': return 'text-base';
            case 'm': return 'text-lg';
            case 'l': return 'text-xl';
            default: return 'text-lg';
        }
    };

    // Get section title size based on setting
    const getSectionTitleSize = () => {
        switch (customizationOptions.sectionTitles.size) {
            case 's': return 'text-sm';
            case 'm': return 'text-base';
            case 'l': return 'text-lg';
            case 'xl': return 'text-xl';
            default: return 'text-lg';
        }
    };

    // Get section title style classes
    const getSectionTitleClasses = () => {
        const sizeClass = getSectionTitleSize();
        const weightClass = customizationOptions.sectionTitles.bold ? 'font-semibold' : 'font-normal';
        const caseClass =
            customizationOptions.sectionTitles.style === 'uppercase' ? 'uppercase' :
                customizationOptions.sectionTitles.style === 'lowercase' ? 'lowercase' :
                    customizationOptions.sectionTitles.style === 'capitalize' ? 'capitalize' : 'normal-case';
        const borderClass = customizationOptions.sectionTitles.decoration === 'underline' ? 'border-b pb-1' : '';

        return `${sizeClass} ${weightClass} ${caseClass} ${borderClass} section-title`;
    };

    // Get style object for section titles
    const getSectionTitleStyle = () => {
        return {
            color: getHeadingColor(),
            borderColor: customizationOptions.sectionTitles.decoration === 'underline' ? getHeadingColor() : 'transparent'
        };
    };

    // Render section title with decoration
    const renderSectionTitle = (title: string) => {
        const headingColor = getHeadingColor();

        switch (customizationOptions.sectionTitles.decoration) {
            case 'fullBorder':
                return (
                    <div className="text-center mb-3">
                        <div className="border-t" style={{ borderColor: headingColor }}></div>
                        <h2 className={`${getSectionTitleClasses()} py-1.5`} style={getSectionTitleStyle()}>
                            {title}
                        </h2>
                        <div className="border-t" style={{ borderColor: headingColor }}></div>
                    </div>
                );
            case 'bottomBorder':
                return (
                    <div className="mb-2">
                        <h2 className={getSectionTitleClasses()} style={getSectionTitleStyle()}>
                            <span className="pb-1 border-b" style={{ borderColor: getHeadingColor() }}>
                                {title}
                            </span>
                        </h2>
                    </div>
                );
            case 'clean':
                return (
                    <h2 className={`${getSectionTitleClasses()} mb-2`} style={getSectionTitleStyle()}>
                        {title}
                    </h2>
                );
            case 'underline':
            default:
                return (
                    <h2 className={`${getSectionTitleClasses()} mb-2`} style={getSectionTitleStyle()}>
                        {title}
                    </h2>
                );
        }
    };

    // Get the appropriate link icon based on customization options
    const renderLinkIcon = () => {
        if (customizationOptions.links.icon === 'none') return null;

        const size = {
            'small': 'w-3 h-3',
            'medium': 'w-3.5 h-3.5',
            'large': 'w-4 h-4'
        }[customizationOptions.links.size];

        const Icon = (() => {
            switch (customizationOptions.links.icon) {
                case 'arrow': return ArrowUpRight;
                case 'chain': return ChainLink;
                case 'external':
                default: return ExternalLink;
            }
        })();

        return <Icon className={`${size} ml-1`} />;
    };

    // Utility to detect if a string is HTML
    const isHTML = (str: string) => /<[a-z][\s\S]*>/i.test(str);

    useEffect(() => {
        const fontFamilies = [
            'Tinos', 'Volkhov', 'Gelasio', 'PT+Serif', 'Alegreya', 'Aleo',
            'Crimson+Pro', 'EB+Garamond', 'Zilla+Slab', 'Cormorant+Garamond',
            'Crimson+Text', 'Source+Serif+Pro', 'Playfair+Display', 'Noto+Serif',
            'Bitter', 'Arvo', 'Source+Sans+Pro', 'Karla', 'Mulish', 'Lato',
            'Titillium+Web', 'Work+Sans', 'Barlow', 'Jost', 'Fira+Sans', 'Roboto',
            'Rubik', 'Asap', 'Nunito', 'Open+Sans', 'Montserrat', 'Poppins', 'Inter',
            'Raleway', 'Noto+Sans', 'Cabin', 'Exo+2', 'Chivo', 'Oswald'
        ];
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';

        const familiesParam = fontFamilies
            .map(f => `family=${f.replace(/ /g, '+')}:wght@100..900`)
            .join('&');

        linkElement.href = `https://fonts.googleapis.com/css2?${familiesParam}&display=swap`;
        document.head.appendChild(linkElement);

        return () => {
            document.head.removeChild(linkElement);
        };
    }, []);

    useEffect(() => {
        const updateContentHeight = () => {
            if (contentRef.current) {
                requestAnimationFrame(() => {
                    if (contentRef.current) {
                        const computedStyle = window.getComputedStyle(contentRef.current);
                        const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
                        const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
                        const height = contentRef.current.scrollHeight - paddingTop - paddingBottom;
                        setContentHeight(height);
                    }
                });
            }
        };

        const timeoutId = setTimeout(updateContentHeight, 100);

        const resizeObserver = new ResizeObserver(() => {
            updateContentHeight();
        });

        if (contentRef.current) {
            resizeObserver.observe(contentRef.current);
        }

        const mutationObserver = new MutationObserver(() => {
            updateContentHeight();
        });

        if (contentRef.current) {
            mutationObserver.observe(contentRef.current, {
                childList: true,
                subtree: true,
                attributes: true,
                characterData: true,
                attributeFilter: ['style', 'class']
            });
        }

        return () => {
            clearTimeout(timeoutId);
            resizeObserver.disconnect();
            mutationObserver.disconnect();
        };
    }, [resumeData, customizationOptions, fieldVisibility]);

    return (
        <div
            className="resume-pages-container"
            data-id="resume-root"
            style={{
                fontFamily: customizationOptions.font.specificFont || fontStack,
                color: customizationOptions.colors.text || '#1a202c',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility',
            }}
        >
            {/* Load Google Fonts */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Tinos:wght@100..900&family=Volkhov:wght@100..900&family=Gelasio:wght@100..900&family=PT+Serif:wght@100..900&family=Alegreya:wght@100..900&family=Aleo:wght@100..900&family=Crimson+Pro:wght@100..900&family=EB+Garamond:wght@100..900&family=Zilla+Slab:wght@100..900&family=Cormorant+Garamond:wght@100..900&family=Crimson+Text:wght@100..900&family=Source+Serif+Pro:wght@100..900&family=Playfair+Display:wght@100..900&family=Noto+Serif:wght@100..900&family=Bitter:wght@100..900&family=Arvo:wght@100..900&family=Source+Sans+Pro:wght@100..900&family=Karla:wght@100..900&family=Mulish:wght@100..900&family=Lato:wght@100..900&family=Titillium+Web:wght@100..900&family=Work+Sans:wght@100..900&family=Barlow:wght@100..900&family=Jost:wght@100..900&family=Fira+Sans:wght@100..900&family=Roboto:wght@100..900&family=Rubik:wght@100..900&family=Asap:wght@100..900&family=Nunito:wght@100..900&family=Open+Sans:wght@100..900&family=Montserrat:wght@100..900&family=Poppins:wght@100..900&family=Inter:wght@100..900&family=Raleway:wght@100..900&family=Noto+Sans:wght@100..900&family=Cabin:wght@100..900&family=Exo+2:wght@100..900&family=Chivo:wght@100..900&family=Oswald:wght@100..900&display=swap');
            `}</style>

            {/* Inject a style tag with important rules to override any conflicting styles */}
            <style>{`
                    .resume-pages-container {
                        position: relative;
                        width: 210mm;
                        padding: 0;
                        background-color: #ffffff;
                        min-height: 297mm;
                    }
                    .resume-pages-container::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        pointer-events: none;
                        background-color: #ffffff;
                        z-index: 0;
                    }
                    .resume-pages-container::after {
                        content: '';
                        position: absolute;
                        top: 297mm;
                        left: 0;
                        right: 0;
                        height: 0;
                        border-top: 2px dashed #d1d5db;
                        pointer-events: none;
                        z-index: 100;
                    }
                    .resume-pages-container [data-id="resume-content"] {
                        position: relative;
                        z-index: 2;
                        background-color: transparent;
                    }
                    .resume-pages-container [data-id="resume-content"] > * {
                        position: relative;
                        z-index: 2;
                    }
                    @media print {
                        .resume-pages-container::before,
                        .resume-pages-container::after {
                            display: none;
                        }
                        .resume-pages-container {
                            padding: 0;
                            background-color: transparent;
                        }
                        .resume-pages-container [data-id="resume-content"] {
                            box-shadow: none;
                            border: none;
                            border-radius: 0;
                        }
                    }
                    [data-id="resume-content"] {
                        font-size: ${customizationOptions.spacing.fontSize}pt !important;
                        line-height: ${customizationOptions.spacing.lineHeight} !important;
                    }
                    [data-id="resume-content"] * {
                        font-size: inherit;
                        line-height: inherit;
                    }
                    
                    /* Header-specific styling */
                    [data-id="resume-header"] h1 {
                        font-weight: ${customizationOptions.header.nameBold ? '600' : '500'} !important;
                        letter-spacing: 0.01em;
                    }
                    
                    /* Header name size */
                    [data-id="resume-header"] h1.text-2xl { font-size: 1.25rem !important; }
                    [data-id="resume-header"] h1.text-3xl { font-size: 1.75rem !important; }
                    [data-id="resume-header"] h1.text-4xl { font-size: 2.25rem !important; }
                    [data-id="resume-header"] h1.text-5xl { font-size: 2.75rem !important; }
                    
                    /* Job title size */
                    [data-id="resume-header"] h2.text-base { font-size: 1rem !important; }
                    [data-id="resume-header"] h2.text-lg { font-size: 1.125rem !important; }
                    [data-id="resume-header"] h2.text-xl { font-size: 1.25rem !important; }
                    
                    /* Section title styling */
                    .section-title {
                        transition: all 0.2s ease-in-out;
                        font-weight: ${customizationOptions.sectionTitles.bold ? '600' : '500'} !important;
                        text-transform: ${customizationOptions.sectionTitles.style} !important;
                        letter-spacing: 0.025em;
                    }
                    .section-title.text-sm { font-size: 0.875rem !important; }
                    .section-title.text-base { font-size: 1rem !important; }
                    .section-title.text-lg { font-size: 1.125rem !important; }
                    .section-title.text-xl { font-size: 1.25rem !important; }
                    
                    /* Hyperlink styling for rich text content - excluding personal info */
                    [data-id="resume-body"] a {
                        color: ${getAccentColor(1)} !important;
                        text-decoration: none !important;
                        transition: all 0.2s ease-in-out !important;
                    }
                    
                    [data-id="resume-body"] a:hover {
                        color: ${getAccentColor(0.8)} !important;
                    }
                    
                    /* Lucide icon filled style */
                    .lucide-icon-filled {
                        fill: currentColor;
                        stroke-width: 1.5;
                    }
                    
                    /* Better approach for filled icons */
                    [data-filled-icon="true"] {
                        fill-opacity: 0.2;
                    }
                    
                    /* Target specific icon paths to fill, not the entire box */
                    [data-filled-icon="true"] path {
                        fill: currentColor;
                        fill-opacity: 0.15;
                    }
                    
                    /* Special handling for icon types that need specific styling */
                    [data-filled-icon="true"].phone-icon path,
                    [data-filled-icon="true"].mail-icon path,
                    [data-filled-icon="true"].map-pin-icon path {
                        fill-opacity: 0.12;
                    }
                    
                    /* Enhanced bold styling for all fonts */
                    [data-id="resume-content"] b,
                    [data-id="resume-content"] strong {
                        font-weight: 600 !important;
                        letter-spacing: -0.01em;
                    }
                    
                    /* Print-friendly link styling */
                    @media print {
                        [data-id="resume-body"] a {
                            color: ${getAccentColor(1)} !important;
                            text-decoration: none !important;
                        }
                    }
                `}</style>

            <div
                ref={contentRef}
                className="p-8 sm:p-12 print:p-12 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-0.5 [&_li>*]:leading-tight [&_ul_ul]:ml-4 [&_ol_ol]:ml-4 [&_ul_ol]:ml-4 [&_ol_ul]:ml-4 [&_b]:font-extrabold [&_strong]:font-extrabold [&_i]:italic [&_em]:italic [&_u]:underline printable-content"
                data-id="resume-content"
                data-content-height={contentHeight}
                style={{
                    position: 'relative',
                    paddingLeft: `${customizationOptions.spacing.margins.left}mm`,
                    paddingRight: `${customizationOptions.spacing.margins.right}mm`,
                    paddingTop: `${customizationOptions.spacing.margins.top}mm`,
                    paddingBottom: `${customizationOptions.spacing.margins.bottom}mm`,
                }}
            >
                {/* Header */}
                <div className={`flex flex-col md:flex-row ${customizationOptions.header.alignment === 'center' ? 'md:justify-center' : 'md:justify-between'} md:items-start mb-8`} data-id="resume-header">
                    <div className={`${customizationOptions.header.alignment === 'center' ? 'text-center w-full' : ''}`}>
                        <h1 className={`${getNameFontSize()} font-${customizationOptions.header.nameBold ? 'semibold' : 'medium'} uppercase tracking-tight`} style={{ color: getHeadingColor() }}>
                            {resumeData.personalInfo.name || 'YOUR NAME'}
                        </h1>
                        {resumeData.personalInfo.position && (
                            <h2 className={`${getJobTitleFontSize()} font-normal`} style={{ color: getAccentColor(1) }}>
                                {resumeData.personalInfo.position}
                            </h2>
                        )}

                        <div className={`flex flex-wrap mt-1 text-sm gap-y-2 gap-x-6 ${customizationOptions.header.alignment === 'center' ? 'justify-center' : ''}`}>
                            {fieldVisibility['personalInfo.phone'] !== false && resumeData.personalInfo.phone && (
                                <a
                                    href={`tel:${resumeData.personalInfo.phone}`}
                                    className="flex items-center transition-colors"
                                >
                                    <Phone
                                        className={`${customizationOptions.socialIcons?.style === 'filled' ? 'lucide-icon-filled' : ''} ${(() => {
                                            switch (customizationOptions.socialIcons?.size || 'medium') {
                                                case 'small': return 'w-3.5 h-3.5 mr-1';
                                                case 'large': return 'w-5 h-5 mr-2';
                                                case 'medium':
                                                default: return 'w-4 h-4 mr-1.5';
                                            }
                                        })()}`}
                                        strokeWidth={customizationOptions.socialIcons?.style === 'filled' ? 1.5 : 1.75}
                                        style={{
                                            color: (() => {
                                                switch (customizationOptions.socialIcons?.color || 'accent') {
                                                    case 'headings': return getHeadingColor();
                                                    case 'text': return customizationOptions.colors.text;
                                                    case 'custom': return customizationOptions.socialIcons?.customColor || getAccentColor(1);
                                                    case 'accent':
                                                    default: return getAccentColor(1);
                                                }
                                            })()
                                        }}
                                        data-filled-icon={customizationOptions.socialIcons?.style === 'filled' ? 'true' : 'false'}
                                    />
                                    <span>{resumeData.personalInfo.phone}</span>
                                </a>
                            )}
                            {fieldVisibility['personalInfo.email'] !== false && resumeData.personalInfo.email && (
                                <a
                                    href={`mailto:${resumeData.personalInfo.email}`}
                                    className="flex items-center transition-colors"
                                >
                                    <Mail
                                        className={`${customizationOptions.socialIcons?.style === 'filled' ? 'lucide-icon-filled' : ''} ${(() => {
                                            switch (customizationOptions.socialIcons?.size || 'medium') {
                                                case 'small': return 'w-3.5 h-3.5 mr-1';
                                                case 'large': return 'w-5 h-5 mr-2';
                                                case 'medium':
                                                default: return 'w-4 h-4 mr-1.5';
                                            }
                                        })()}`}
                                        strokeWidth={customizationOptions.socialIcons?.style === 'filled' ? 1.5 : 1.75}
                                        style={{
                                            color: (() => {
                                                switch (customizationOptions.socialIcons?.color || 'accent') {
                                                    case 'headings': return getHeadingColor();
                                                    case 'text': return customizationOptions.colors.text;
                                                    case 'custom': return customizationOptions.socialIcons?.customColor || getAccentColor(1);
                                                    case 'accent':
                                                    default: return getAccentColor(1);
                                                }
                                            })()
                                        }}
                                        data-filled-icon={customizationOptions.socialIcons?.style === 'filled' ? 'true' : 'false'}
                                    />
                                    <span>{resumeData.personalInfo.email}</span>
                                </a>
                            )}
                            {fieldVisibility['personalInfo.location'] !== false && resumeData.personalInfo.location && (
                                <div className="flex items-center">
                                    <MapPin
                                        className={`${customizationOptions.socialIcons?.style === 'filled' ? 'lucide-icon-filled' : ''} ${(() => {
                                            switch (customizationOptions.socialIcons?.size || 'medium') {
                                                case 'small': return 'w-3.5 h-3.5 mr-1';
                                                case 'large': return 'w-5 h-5 mr-2';
                                                case 'medium':
                                                default: return 'w-4 h-4 mr-1.5';
                                            }
                                        })()}`}
                                        strokeWidth={customizationOptions.socialIcons?.style === 'filled' ? 1.5 : 1.75}
                                        style={{
                                            color: (() => {
                                                switch (customizationOptions.socialIcons?.color || 'accent') {
                                                    case 'headings': return getHeadingColor();
                                                    case 'text': return customizationOptions.colors.text;
                                                    case 'custom': return customizationOptions.socialIcons?.customColor || getAccentColor(1);
                                                    case 'accent':
                                                    default: return getAccentColor(1);
                                                }
                                            })()
                                        }}
                                        data-filled-icon={customizationOptions.socialIcons?.style === 'filled' ? 'true' : 'false'}
                                    />
                                    <span>{resumeData.personalInfo.location}</span>
                                </div>
                            )}
                            {fieldVisibility['personalInfo.socialLinks'] !== false && resumeData.personalInfo.socialLinks && resumeData.personalInfo.socialLinks.map((link, index) => {
                                if (!link.url || !link.url.startsWith('http')) return null;

                                // Platform-specific URL validation
                                const validatePlatformUrl = (platform: string, url: string) => {
                                    if (!url) return false;

                                    const patterns = {
                                        linkedin: /^https?:\/\/(?:www\.)?linkedin\.com\/in\/[\w\-]+(?:\/)?$/i,
                                        peerlist: /^https?:\/\/(?:www\.)?peerlist\.io\/[\w\-]+(?:\/)?$/i,
                                        github: /^https?:\/\/(?:www\.)?github\.com\/[\w\-]+(?:\/)?$/i,
                                        twitter: /^https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/[\w\-]+(?:\/)?$/i,
                                        leetcode: /^https?:\/\/(?:www\.)?leetcode\.com\/u\/[\w\-]+(?:\/)?$/i,
                                        medium: /^https?:\/\/(?:www\.)?medium\.com\/@[\w\-]+(?:\/)?$/i,
                                        stackoverflow: /^https?:\/\/(?:www\.)?stackoverflow\.com\/users\/[\w\-]+(?:\/)?$/i
                                    };

                                    const pattern = patterns[platform as keyof typeof patterns];
                                    return pattern ? pattern.test(url) : false;
                                };

                                // Skip if URL doesn't match the platform pattern
                                if (!validatePlatformUrl(link.platform, link.url)) return null;

                                let icon;
                                let label = '';

                                // Calculate icon size based on socialIcons.size setting
                                const iconSize = (() => {
                                    switch (customizationOptions.socialIcons?.size || 'medium') {
                                        case 'small': return 'w-3.5 h-3.5 mr-1';
                                        case 'large': return 'w-5 h-5 mr-2';
                                        case 'medium':
                                        default: return 'w-4 h-4 mr-1.5';
                                    }
                                })();

                                // For filled style we use stroke width 1.5, for outline 1.75
                                const strokeWidth = customizationOptions.socialIcons?.style === 'filled' ? 1.5 : 1.75;

                                // Get icon color based on settings
                                const iconColor = (() => {
                                    switch (customizationOptions.socialIcons?.color || 'accent') {
                                        case 'headings': return getHeadingColor();
                                        case 'text': return customizationOptions.colors.text;
                                        case 'custom': return customizationOptions.socialIcons?.customColor || getAccentColor(1);
                                        case 'accent':
                                        default: return getAccentColor(1);
                                    }
                                })();

                                // We use data attributes for filled style and style for color
                                const iconProps = {
                                    className: iconSize,
                                    strokeWidth,
                                    style: { color: iconColor },
                                    'data-filled-icon': customizationOptions.socialIcons?.style === 'filled' ? 'true' : 'false'
                                };

                                switch (link.platform) {
                                    case 'linkedin':
                                        icon = <Linkedin {...iconProps} />;
                                        label = link.label || 'LinkedIn';
                                        break;
                                    case 'github':
                                        icon = <Github {...iconProps} />;
                                        label = link.label || 'GitHub';
                                        break;
                                    case 'twitter':
                                        icon = <Twitter {...iconProps} />;
                                        label = link.label || 'Twitter';
                                        break;
                                    case 'leetcode':
                                        icon = <FileCode {...iconProps} />;
                                        label = link.label || 'LeetCode';
                                        break;
                                    case 'medium':
                                        icon = <BookOpen {...iconProps} />;
                                        label = link.label || 'Medium';
                                        break;
                                    case 'stackoverflow':
                                        icon = <MessageSquare {...iconProps} />;
                                        label = link.label || 'Stack Overflow';
                                        break;
                                    case 'peerlist':
                                        icon = <img
                                            src={peerlistIconUrl}
                                            alt="Peerlist"
                                            className={iconSize}
                                            style={{
                                                color: iconColor,
                                                filter: customizationOptions.socialIcons?.style === 'filled' ? 'none' : 'brightness(0)',
                                                backgroundColor: customizationOptions.socialIcons?.style === 'filled' ? '#D9D9D9' : undefined,
                                                borderRadius: customizationOptions.socialIcons?.style === 'filled' ? '8px' : undefined
                                            }}
                                        />;
                                        label = link.label || 'Peerlist';
                                        break;
                                    default:
                                        icon = <ExternalLink {...iconProps} />;
                                        label = link.label || 'Website';
                                }

                                return (
                                    <a
                                        key={index}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {icon}
                                        <span>{label}</span>
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Profile picture or initials - only show if enabled in customization */}
                    {/* {customizationOptions.header.showPhoto ? (
                        resumeData.personalInfo.profilePicture && resumeData.personalInfo.profilePicture.startsWith('data:image') ? (
                            <div
                                className={`overflow-hidden mt-4 md:mt-0 ${customizationOptions.header.photoSize === 'small' ? 'w-16 h-16' :
                                    customizationOptions.header.photoSize === 'large' ? 'w-32 h-32' :
                                        'w-24 h-24'
                                    } rounded-full ${customizationOptions.header.photoBorder === 'none' ? '' : 'shadow-md border'
                                    } ${customizationOptions.header.photoBorder === 'thin' ? 'border-2' :
                                        customizationOptions.header.photoBorder === 'medium' ? 'border-4' :
                                            customizationOptions.header.photoBorder === 'thick' ? 'border-6' : ''
                                    }`}
                                style={{
                                    borderColor: customizationOptions.header.photoStyle === 'accent' ? getAccentColor(0.3) :
                                        customizationOptions.header.photoStyle === 'headings' ? getHeadingColor() :
                                            customizationOptions.header.photoStyle === 'border' ? '#e2e8f0' : 'transparent',
                                }}
                            >
                                <img
                                    src={resumeData.personalInfo.profilePicture}
                                    alt={resumeData.personalInfo.name || 'Profile'}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div
                                className={`flex items-center justify-center mt-4 md:mt-0 text-white font-semibold ${customizationOptions.header.photoSize === 'small' ? 'w-16 h-16 text-xl' :
                                    customizationOptions.header.photoSize === 'large' ? 'w-32 h-32 text-4xl' :
                                        'w-24 h-24 text-3xl'
                                    } rounded-full ${customizationOptions.header.photoBorder === 'none' ? '' : 'shadow-md border'
                                    } ${customizationOptions.header.photoBorder === 'thin' ? 'border-2' :
                                        customizationOptions.header.photoBorder === 'medium' ? 'border-4' :
                                            customizationOptions.header.photoBorder === 'thick' ? 'border-6' : ''
                                    }`}
                                style={{
                                    backgroundColor: getAccentColor(1),
                                    borderColor: customizationOptions.header.photoStyle === 'accent' ? getAccentColor(0.3) :
                                        customizationOptions.header.photoStyle === 'headings' ? getHeadingColor() :
                                            customizationOptions.header.photoStyle === 'border' ? '#e2e8f0' : 'transparent',
                                    flexShrink: 0
                                }}
                            >
                                {getInitials}
                            </div>
                        )
                    ) : null} */}
                </div>

                <div className={`flex flex-col ${isTwoColumnLayout() ? 'md:flex-row gap-6' : ''}`} data-id="resume-body">
                    {/* Left Column - Main Content */}
                    <div className={`${isTwoColumnLayout() ? 'md:w-3/5' : 'w-full'}`} data-id="resume-main-column">
                        {/* Render sections according to custom order */}
                        {customizationOptions.layout.sectionOrder.map((sectionKey) => {
                            // Skip hidden sections (except Personal Info, which should always be shown)
                            if (customizationOptions.layout.visibleSections?.[sectionKey] === false && sectionKey !== 'personalInfo') {
                                return null;
                            }

                            // Skip Skills and Projects in main column for two-column layouts (they're rendered in right column)
                            if (isTwoColumnLayout() && (sectionKey === 'skills' || sectionKey === 'projects')) {
                                return null;
                            }

                            // Summary
                            if (sectionKey === 'personalInfo' && fieldVisibility['personalInfo.summary'] !== false && showSummary) {
                                return (
                                    <div key={sectionKey} className="resume-section" style={{ marginBottom: `${customizationOptions.spacing.sectionGap}px`, pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                        {renderSectionTitle('SUMMARY')}
                                        <div className="text-sm">
                                            <SafeHTML html={resumeData.personalInfo.summary} />
                                        </div>
                                    </div>
                                );
                            }

                            // Work Experience
                            if (sectionKey === 'workExperience' && resumeData.workExperience.some(exp => exp.position || exp.company || exp.description)) {
                                return (
                                    <div key={sectionKey} className="resume-section" style={{ marginBottom: `${customizationOptions.spacing.sectionGap}px`, pageBreakAfter: 'auto', breakAfter: 'auto' }}>
                                        {renderSectionTitle(customizationOptions.layout.sectionTitles[sectionKey]?.toUpperCase() || 'EXPERIENCE')}
                                        <div className="space-y-4">
                                            {resumeData.workExperience
                                                .filter(exp => exp.position || exp.company || exp.description)
                                                .map((exp, index) => (
                                                    <div key={exp.id || index} className="mb-4" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                                        <div className={`${isSingleColumnLayout() ? 'flex flex-row justify-between items-start gap-4' : 'flex flex-col'}`}>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-baseline flex-wrap">
                                                                    <h3 className="font-semibold text-base" style={{ fontWeight: 600 }}>
                                                                        {exp.position || 'Position'}
                                                                    </h3>
                                                                    {exp.experienceLink && exp.experienceLink.startsWith('http') && (
                                                                        <a
                                                                            href={exp.experienceLink}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="flex items-center ml-2 hover:text-blue-600 transition-colors"
                                                                            style={{ color: getAccentColor(0.9) }}
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        >
                                                                            {renderLinkIcon()}
                                                                        </a>
                                                                    )}
                                                                </div>
                                                                {exp.company && (
                                                                    <div className="text-base italic text-gray-700">
                                                                        {exp.company}
                                                                    </div>
                                                                )}
                                                                {!isSingleColumnLayout() && (exp.startYear || exp.endYear || exp.location) && (
                                                                    <div className="flex items-center text-sm opacity-80 mb-1 flex-wrap">
                                                                        {exp.startYear && (
                                                                            <span className="italic">
                                                                                {formatDateFromFields(exp.startMonth, exp.startYear, exp.showStartMonth)} - {exp.current ? 'Present' : (exp.endYear ? formatDateFromFields(exp.endMonth, exp.endYear, exp.showEndMonth) : '')}
                                                                            </span>
                                                                        )}
                                                                        {exp.startYear && exp.location && <span className='px-1'>{"|"}</span>}
                                                                        {exp.location && (
                                                                            <span className="italic">{exp.location || ''}</span>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                {exp.description && (
                                                                    isHTML(exp.description) ? (
                                                                        <SafeHTML
                                                                            html={normalizeWorkDescriptionHtml(exp.description)}
                                                                            className={`text-sm mt-1 pl-2 ${getLineHeightClass(exp.description)}`}
                                                                        />
                                                                    ) : (
                                                                        <ul className="list-disc pl-5 space-y-1">
                                                                            {preprocessBulletPoints(exp.description).map((point, idx) => (
                                                                                <li key={idx} className={`text-sm ${getLineHeightClass(exp.description)}`}>
                                                                                    {point}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    )
                                                                )}
                                                            </div>

                                                            {isSingleColumnLayout() && (exp.startYear || exp.endYear || exp.location) && (
                                                                <div className="text-sm opacity-80 text-right whitespace-nowrap shrink-0">
                                                                    {exp.startYear && (
                                                                        <div className="italic">
                                                                            {formatDateFromFields(exp.startMonth, exp.startYear, exp.showStartMonth)} - {exp.current ? 'Present' : (exp.endYear ? formatDateFromFields(exp.endMonth, exp.endYear, exp.showEndMonth) : '')}
                                                                        </div>
                                                                    )}
                                                                    {exp.location && (
                                                                        <div className="mt-0.5 italic">{exp.location}</div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                );
                            }

                            // Education
                            if (sectionKey === 'education' && resumeData.education.some((edu) => edu.degree || edu.institution)) {
                                return (
                                    <div key={sectionKey} className="resume-section" style={{ marginBottom: `${customizationOptions.spacing.sectionGap}px`, pageBreakAfter: 'auto', breakAfter: 'auto' }}>
                                        {renderSectionTitle(customizationOptions.layout.sectionTitles[sectionKey]?.toUpperCase() || 'EDUCATION')}
                                        <div className="space-y-4">
                                            {resumeData.education
                                                .filter((edu) => edu.degree || edu.institution)
                                                .map((edu, index) => (
                                                    <div key={index} className="mb-3" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                                        <div className={`${isSingleColumnLayout() ? 'flex flex-row justify-between items-start' : 'flex flex-col'}`}>
                                                            <div className="flex-1">
                                                                <h3 className="font-semibold text-base">
                                                                    {edu.degree || 'Degree'}
                                                                    {(edu.institutionLink || edu.degreeLink) &&
                                                                        (edu.institutionLink?.startsWith('http') || edu.degreeLink?.startsWith('http')) && (
                                                                            <a
                                                                                href={edu.institutionLink || edu.degreeLink}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="inline-flex items-center ml-2"
                                                                                onClick={(e) => e.stopPropagation()}
                                                                                aria-label="View education details"
                                                                            >
                                                                                {renderLinkIcon()}
                                                                            </a>
                                                                        )}
                                                                </h3>
                                                                {edu.institution && (
                                                                    <div className="text-base italic text-gray-700">
                                                                        {edu.institution}
                                                                    </div>
                                                                )}
                                                                {!isSingleColumnLayout() && (edu.startYear || edu.endYear || edu.location) && (
                                                                    <div className="flex items-center text-sm opacity-80 pl-4">
                                                                        {edu.startYear && edu.endYear && (
                                                                            <span className="italic">
                                                                                {formatDateFromFields(edu.startMonth, edu.startYear, edu.showStartMonth)} - {edu.current ? 'Present' : formatDateFromFields(edu.endMonth, edu.endYear, edu.showEndMonth)}
                                                                            </span>
                                                                        )}
                                                                        {(edu.startYear || edu.endYear) && edu.location && (
                                                                            <span className='px-1'>{"|"}</span>
                                                                        )}
                                                                        {edu.location && (
                                                                            <span className="italic">{edu.location}</span>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {isSingleColumnLayout() && (edu.startYear || edu.endYear || edu.location) && (
                                                                <div className="text-sm opacity-80 text-right ml-4 whitespace-nowrap">
                                                                    {edu.startYear && edu.endYear && (
                                                                        <div className="italic">
                                                                            {formatDateFromFields(edu.startMonth, edu.startYear, edu.showStartMonth)} - {edu.current ? 'Present' : formatDateFromFields(edu.endMonth, edu.endYear, edu.showEndMonth)}
                                                                        </div>
                                                                    )}
                                                                    {edu.location && (
                                                                        <div className="mt-0.5 italic">{edu.location}</div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                );
                            }

                            // Skills
                            if (sectionKey === 'skills' && resumeData.skills.length > 0) {
                                // Check if any skill category has skills
                                const hasSkills = resumeData.skills.some(category =>
                                    category.skills && category.skills.length > 0
                                );

                                if (!hasSkills) return null;

                                return (
                                    <div key={sectionKey} className="resume-section" style={{ marginBottom: `${customizationOptions.spacing.sectionGap}px`, pageBreakAfter: 'auto', breakAfter: 'auto' }}>
                                        {renderSectionTitle(customizationOptions.layout.sectionTitles[sectionKey]?.toUpperCase() || 'SKILLS')}
                                        <div className="space-y-1 mt-2">
                                            {resumeData.skills
                                                .filter(category => category.skills && category.skills.length > 0)
                                                .map((category) => (
                                                    <div key={category.id} className="flex items-start text-sm">
                                                        <div className="pr-2 shrink-0">
                                                            <h3 className="font-semibold" style={{ fontWeight: 600 }}>
                                                                {`${category.name}:`}
                                                            </h3>
                                                        </div>
                                                        <div>
                                                            <p>
                                                                {Array.isArray(category.skills) ? category.skills.join(', ') : ''}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                );
                            }

                            // Projects
                            if (sectionKey === 'projects' && resumeData.projects.some((project) => project.name || project.description)) {
                                return (
                                    <div key={sectionKey} className="resume-section" style={{ marginBottom: `${customizationOptions.spacing.sectionGap}px`, pageBreakAfter: 'auto', breakAfter: 'auto' }}>
                                        {renderSectionTitle(customizationOptions.layout.sectionTitles[sectionKey]?.toUpperCase() || 'PROJECTS')}
                                        <div className="space-y-4">
                                            {resumeData.projects?.slice(0, 3)
                                                .filter((project) => project.name || project.description)
                                                .map((project, index) => (
                                                    <div key={index} className="mb-3" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                                        <div className={`${isSingleColumnLayout() ? 'flex flex-row justify-between items-start' : 'flex flex-col'}`}>
                                                            <div className="flex-1">
                                                                <h3 className="font-semibold text-base" style={{ fontWeight: 600 }}>
                                                                    {project.name || 'Project Name'}
                                                                    {project.link && project.link.startsWith('http') && (
                                                                        <a
                                                                            href={project.link}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="inline-flex items-center ml-2 hover:text-blue-600 transition-colors"
                                                                            style={{ color: getAccentColor(0.9) }}
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        >
                                                                            {renderLinkIcon()}
                                                                        </a>
                                                                    )}
                                                                </h3>
                                                                <div className="pl-4">
                                                                    {
                                                                        project.description && (
                                                                            <SafeHTML
                                                                                html={project.description}
                                                                                className="text-sm mt-1"
                                                                            />
                                                                        )
                                                                    }
                                                                    {
                                                                        project.technologies && (
                                                                            <div className="text-sm mt-1 italic text-gray-600">
                                                                                {project.technologies}
                                                                            </div>
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
                                                            {isSingleColumnLayout() && (project.startYear || project.endYear) && (
                                                                <div className="text-sm opacity-80 text-right ml-4 whitespace-nowrap">
                                                                    <div className="italic">
                                                                        {formatDateFromFields(project.startMonth, project.startYear, project.showStartMonth)} - {project.current ? 'Present' : (project.endYear ? formatDateFromFields(project.endMonth, project.endYear, project.showEndMonth) : '')}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                );
                            }

                            // Achievements
                            if (sectionKey === 'achievements') {
                                const hasAny = resumeData.achievements.some(a => a.title || a.description || a.organization || a.year || a.link);
                                if (!hasAny) return null;

                                return (
                                    <div key={sectionKey} className="resume-section" style={{ marginBottom: `${customizationOptions.spacing.sectionGap}px`, pageBreakAfter: 'auto', breakAfter: 'auto' }}>
                                        {renderSectionTitle(customizationOptions.layout.sectionTitles[sectionKey]?.toUpperCase() || 'ACHIEVEMENTS')}
                                        <div className="space-y-4">
                                            {resumeData.achievements
                                                .filter(achievement => achievement.title || achievement.description || achievement.organization || achievement.year || achievement.link)
                                                .map((achievement, index) => (
                                                    <div key={achievement.id || index} className="mb-3" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                                        <div className={`${isSingleColumnLayout() ? 'flex flex-row justify-between items-start' : 'flex flex-col'}`}>
                                                            <div className="flex-1">
                                                                <h3 className="font-semibold text-base" style={{ fontWeight: 600 }}>
                                                                    {achievement.title || 'Achievement Title'}
                                                                    {achievement.showLink && achievement.link && achievement.link.startsWith('http') && (
                                                                        <a
                                                                            href={achievement.link}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="inline-flex items-center ml-2 hover:text-blue-600 transition-colors"
                                                                            style={{ color: getAccentColor(0.9) }}
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        >
                                                                            {renderLinkIcon()}
                                                                        </a>
                                                                    )}
                                                                </h3>
                                                                {achievement.showOrganization && achievement.organization && (
                                                                    <div className="text-base italic text-gray-700">
                                                                        {achievement.organization}
                                                                    </div>
                                                                )}
                                                                {!isSingleColumnLayout() && achievement.year && (
                                                                    <div className="text-sm opacity-80 mt-1">
                                                                        <span className="italic">{formatDateFromFields(achievement.month, achievement.year, achievement.showMonth, achievement.current)}</span>
                                                                    </div>
                                                                )}
                                                                {achievement.showDescription && achievement.description && (
                                                                    <div className="text-sm mt-1">
                                                                        {achievement.description}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {isSingleColumnLayout() && achievement.year && (
                                                                <div className="text-sm opacity-80 text-right ml-4 whitespace-nowrap">
                                                                    <div className="italic">{formatDateFromFields(achievement.month, achievement.year, achievement.showMonth, achievement.current)}</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                );
                            }

                            // Publications
                            if (sectionKey === 'publications') {
                                const hasAny = resumeData.publications.some(p => p.title || p.authors || p.journal || p.year || p.doi || p.link || p.description);
                                if (!hasAny) return null;

                                return (
                                    <div key={sectionKey} className="resume-section" style={{ marginBottom: `${customizationOptions.spacing.sectionGap}px`, pageBreakAfter: 'auto', breakAfter: 'auto' }}>
                                        {renderSectionTitle(customizationOptions.layout.sectionTitles[sectionKey]?.toUpperCase() || 'PUBLICATIONS')}
                                        <div className="space-y-4">
                                            {resumeData.publications
                                                .filter(publication => publication.title || publication.authors || publication.journal || publication.year || publication.doi || publication.link || publication.description)
                                                .map((publication, index) => (
                                                    <div key={publication.id || index} className="mb-3" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                                        <div className={`${isSingleColumnLayout() ? 'flex flex-row justify-between items-start' : 'flex flex-col'}`}>
                                                            <div className="flex-1">
                                                                <h3 className="font-semibold text-base" style={{ fontWeight: 600 }}>
                                                                    {publication.title || 'Publication Title'}
                                                                    {((publication.showLink && publication.link) || (publication.showDoi && publication.doi)) && (
                                                                        <a
                                                                            href={publication.link || `https://doi.org/${publication.doi}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="inline-flex items-center ml-2 hover:text-blue-600 transition-colors"
                                                                            style={{ color: getAccentColor(0.9) }}
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        >
                                                                            {renderLinkIcon()}
                                                                        </a>
                                                                    )}
                                                                </h3>
                                                                {publication.showAuthors && publication.authors && (
                                                                    <div className="text-base italic text-gray-700">
                                                                        {publication.authors}
                                                                    </div>
                                                                )}
                                                                {publication.showJournal && publication.journal && (
                                                                    <div className="text-sm text-gray-600">
                                                                        {publication.journal}
                                                                    </div>
                                                                )}
                                                                {!isSingleColumnLayout() && publication.year && (
                                                                    <div className="text-sm opacity-80 mt-1">
                                                                        <span className="italic">{formatDateFromFields(publication.month, publication.year, publication.showMonth, publication.current)}</span>
                                                                    </div>
                                                                )}
                                                                {publication.showDescription && publication.description && (
                                                                    <div className="text-sm mt-1">
                                                                        {publication.description}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {isSingleColumnLayout() && publication.year && (
                                                                <div className="text-sm opacity-80 text-right ml-4 whitespace-nowrap">
                                                                    <div className="italic">{formatDateFromFields(publication.month, publication.year, publication.showMonth, publication.current)}</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                );
                            }

                            // Certifications
                            if (sectionKey === 'certifications') {
                                const hasAny = resumeData.certifications.some(c => c.name || c.issuer || c.year || c.expiryYear || c.credentialId || c.link || c.description);
                                if (!hasAny) return null;

                                return (
                                    <div key={sectionKey} className="resume-section" style={{ marginBottom: `${customizationOptions.spacing.sectionGap}px`, pageBreakAfter: 'auto', breakAfter: 'auto' }}>
                                        {renderSectionTitle(customizationOptions.layout.sectionTitles[sectionKey]?.toUpperCase() || 'CERTIFICATIONS')}
                                        <div className="space-y-4">
                                            {resumeData.certifications
                                                .filter(certification => certification.name || certification.issuer || certification.year || certification.expiryYear || certification.credentialId || certification.link || certification.description)
                                                .map((certification, index) => (
                                                    <div key={certification.id || index} className="mb-3" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                                        <div className={`${isSingleColumnLayout() ? 'flex flex-row justify-between items-start' : 'flex flex-col'}`}>
                                                            <div className="flex-1">
                                                                <h3 className="font-semibold text-base" style={{ fontWeight: 600 }}>
                                                                    {certification.name || 'Certification Name'}
                                                                    {certification.showLink && certification.link && certification.link.startsWith('http') && (
                                                                        <a
                                                                            href={certification.link}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="inline-flex items-center ml-2 hover:text-blue-600 transition-colors"
                                                                            style={{ color: getAccentColor(0.9) }}
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        >
                                                                            {renderLinkIcon()}
                                                                        </a>
                                                                    )}
                                                                </h3>
                                                                {certification.showIssuer && certification.issuer && (
                                                                    <div className="text-base italic text-gray-700">
                                                                        {certification.issuer}
                                                                    </div>
                                                                )}
                                                                {!isSingleColumnLayout() && (certification.year || certification.expiryYear) && (
                                                                    <div className="text-sm opacity-80 mt-1">
                                                                        <div className="italic">{formatDateFromFields(certification.month, certification.year, certification.showMonth, certification.current)}</div>
                                                                        {certification.expiryYear && (
                                                                            <div className="italic text-xs">Expires: {formatDateFromFields(certification.expiryMonth, certification.expiryYear, certification.showExpiryMonth)}</div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                {certification.showCredentialId && certification.credentialId && (
                                                                    <div className="text-sm text-gray-600">
                                                                        ID: {certification.credentialId}
                                                                    </div>
                                                                )}
                                                                {certification.showDescription && certification.description && (
                                                                    <div className="text-sm mt-1">
                                                                        {certification.description}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {isSingleColumnLayout() && (certification.year || certification.expiryYear) && (
                                                                <div className="text-sm opacity-80 text-right ml-4 whitespace-nowrap">
                                                                    <div className="italic">{formatDateFromFields(certification.month, certification.year, certification.showMonth, certification.current)}</div>
                                                                    {certification.expiryYear && (
                                                                        <div className="italic text-xs">Expires: {formatDateFromFields(certification.expiryMonth, certification.expiryYear, certification.showExpiryMonth)}</div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                );
                            }

                            return null;
                        })}

                        {/* Render Custom Sections */}
                        {customizationOptions.customSections
                            ?.filter(customSection => customizationOptions.layout.visibleSections?.[customSection.id] !== false)
                            ?.map((customSection) => (
                                <div key={customSection.id} className="resume-section" style={{ marginBottom: `${customizationOptions.spacing.sectionGap}px`, pageBreakAfter: 'auto', breakAfter: 'auto' }}>
                                    {renderSectionTitle(customSection.title.toUpperCase())}
                                    <div className="space-y-4 text-sm">
                                        <SafeHTML html={customSection.content} />
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* Right Column - Skills & Projects - only in 2-column layout */}
                    {
                        isTwoColumnLayout() && (
                            <div className="md:w-2/5" data-id="resume-side-column">
                                {/* Skills */}
                                {resumeData.skills.length > 0 && customizationOptions.layout.visibleSections?.skills !== false && (() => {
                                    const hasSkills = resumeData.skills.some(category =>
                                        category.skills && category.skills.length > 0
                                    );
                                    if (!hasSkills) return null;

                                    return (
                                        <div className="resume-section" style={{ marginBottom: `${customizationOptions.spacing.sectionGap}px`, pageBreakAfter: 'auto', breakAfter: 'auto' }}>
                                            {renderSectionTitle(customizationOptions.layout.sectionTitles['skills']?.toUpperCase() || 'SKILLS')}
                                            <div className="space-y-1 mt-2">
                                                {resumeData.skills
                                                    .filter(category => category.skills && category.skills.length > 0)
                                                    .map((category) => (
                                                        <div key={category.id} className="flex items-start text-sm py-1" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                                            <div className="w-2/5 pr-2 shrink-0">
                                                                <h3 className="font-semibold" style={{ fontWeight: 600 }}>
                                                                    {category.name}
                                                                </h3>
                                                            </div>
                                                            <div className="w-3/5">
                                                                <p>
                                                                    {Array.isArray(category.skills) ? category.skills.join(', ') : ''}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Projects */}
                                {resumeData.projects.some(
                                    (project) => project.name || project.description
                                ) && customizationOptions.layout.visibleSections?.projects !== false && (
                                        <div className="resume-section" style={{ marginBottom: `${customizationOptions.spacing.sectionGap}px`, pageBreakAfter: 'auto', breakAfter: 'auto' }}>
                                            {renderSectionTitle(customizationOptions.layout.sectionTitles['projects']?.toUpperCase() || 'PROJECTS')}
                                            <div className="space-y-4">
                                                {resumeData.projects?.slice(0, 2)
                                                    .filter((project) => project.name || project.description)
                                                    .map((project, index) => (
                                                        <div key={index} className="mb-3" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                                            <h3 className="font-semibold text-base" style={{ fontWeight: 600 }}>
                                                                {project.name || 'Project Name'}
                                                                {project.link && project.link.startsWith('http') && (
                                                                    <a
                                                                        href={project.link}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="inline-flex items-center ml-2 hover:text-blue-600 transition-colors"
                                                                        style={{ color: getAccentColor(0.9) }}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        {renderLinkIcon()}
                                                                    </a>
                                                                )}
                                                            </h3>
                                                            <div className="pl-4">
                                                                {
                                                                    project.description && (
                                                                        <SafeHTML
                                                                            html={project.description}
                                                                            className="text-sm mt-1"
                                                                        />
                                                                    )
                                                                }
                                                                {
                                                                    project.technologies && (
                                                                        <div className="text-sm mt-1 italic text-gray-600">
                                                                            {project.technologies}
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )
                                }

                                {/* Custom Sections - only in right column if layout is two columns */}
                                {
                                    customizationOptions.customSections
                                        ?.filter(customSection =>
                                            customizationOptions.layout.visibleSections?.[customSection.id] !== false &&
                                            customSection.content && customSection.content.trim() !== ''
                                        )
                                        ?.map((customSection) => (
                                            <div key={customSection.id} className="resume-section" style={{ marginBottom: `${customizationOptions.spacing.sectionGap}px`, pageBreakAfter: 'auto', breakAfter: 'auto' }}>
                                                {renderSectionTitle(customSection.title.toUpperCase())}
                                                <div className="space-y-4 text-sm">
                                                    <SafeHTML html={customSection.content} />
                                                </div>
                                            </div>
                                        ))
                                }
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
};

export default ResumePreview; 