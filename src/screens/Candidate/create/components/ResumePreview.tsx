import { ArrowUpRight, BookOpen, Link as ChainLink, ExternalLink, FileCode, Github, Linkedin, Mail, MapPin, MessageSquare, Phone, Twitter } from 'lucide-react';
import React, { useEffect, useMemo } from 'react';
import { ResumeCustomizationOptions, ResumeData } from '../../../../types/resume';
import { SafeHTML } from '../../../../utils/html';

interface ResumePreviewProps {
    resumeData: ResumeData;
    customizationOptions: ResumeCustomizationOptions;
    fullScreen?: boolean;
    previewScale?: number;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({
    resumeData,
    customizationOptions,
    fullScreen = false,
    previewScale = 100,
}) => {
    const fontStack = 'Inter, Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif';

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

    // Memoize derived data 
    const topSkills = useMemo(() => resumeData.skills.slice(0, 16), [resumeData.skills]);

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

    // Process text with bullet points to create proper list items
    const preprocessBulletPoints = (text: string): string[] => {
        if (!text) return [];

        // First check if there are any bullet points
        if (text.includes('•')) {
            // Split by bullet points, but keep the first segment if it's not empty
            const parts = text.split('•').map(part => part.trim());
            const result: string[] = [];

            // The first segment might be regular text, not a bullet point
            if (parts[0]) {
                result.push(parts[0]);
            }

            // Add remaining parts as bullet points
            for (let i = 1; i < parts.length; i++) {
                if (parts[i]) {
                    result.push(parts[i]);
                }
            }

            return result;
        }

        // If no bullet points, return the whole text as a single item
        return [text];
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
        const weightClass = customizationOptions.sectionTitles.bold ? 'font-bold' : 'font-normal';
        const caseClass =
            customizationOptions.sectionTitles.style === 'uppercase' ? 'uppercase' :
                customizationOptions.sectionTitles.style === 'lowercase' ? 'lowercase' :
                    customizationOptions.sectionTitles.style === 'capitalize' ? 'capitalize' : 'normal-case';
        const borderClass = customizationOptions.sectionTitles.underline ? 'border-b pb-1' : '';

        return `${sizeClass} ${weightClass} ${caseClass} ${borderClass} mb-1.5 section-title`;
    };

    // Get style object for section titles
    const getSectionTitleStyle = () => {
        return {
            color: getHeadingColor(),
            borderColor: customizationOptions.sectionTitles.underline ? getHeadingColor() : 'transparent'
        };
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

    // Add Google Fonts
    useEffect(() => {
        // Create a link element for Google Fonts
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = 'https://fonts.googleapis.com/css2?family=Tinos&family=Volkhov&family=Gelasio&family=PT+Serif&family=Alegreya&family=Aleo&family=Crimson+Pro&family=EB+Garamond&family=Zilla+Slab&family=Cormorant+Garamond&family=Crimson+Text&family=Source+Serif+Pro&family=Playfair+Display&family=Noto+Serif&family=Bitter&family=Arvo&family=Source+Sans+Pro&family=Karla&family=Mulish&family=Lato&family=Titillium+Web&family=Work+Sans&family=Barlow&family=Jost&family=Fira+Sans&family=Roboto&family=Rubik&family=Asap&family=Nunito&family=Open+Sans&family=Montserrat&family=Poppins&family=Inter&family=Raleway&family=Noto+Sans&family=Cabin&family=Exo+2&family=Chivo&family=Oswald&display=swap';

        // Add to the document head
        document.head.appendChild(linkElement);

        // Clean up function
        return () => {
            document.head.removeChild(linkElement);
        };
    }, []);

    return (
        <div
            className="bg-white rounded mx-auto border overflow-hidden shadow-lg transition-all w-full print:shadow-none print:border-0 printable-content"
            data-id="resume-root"
            style={{
                maxHeight: fullScreen ? '297mm' : '100%',
                boxShadow: '0 0 8px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.05), 0 8px 16px rgba(0, 0, 0, 0.05)',
                fontFamily: customizationOptions.font.specificFont || fontStack,
                color: customizationOptions.colors.text || '#1a202c',
                backgroundColor: '#ffffff',
                breakInside: 'avoid',
                pageBreakInside: 'avoid',
                width: '210mm',
                minHeight: '297mm',
            }}
        >
            {/* Load Google Fonts */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Tinos&family=Volkhov&family=Gelasio&family=PT+Serif&family=Alegreya&family=Aleo&family=Crimson+Pro&family=EB+Garamond&family=Zilla+Slab&family=Cormorant+Garamond&family=Crimson+Text&family=Source+Serif+Pro&family=Playfair+Display&family=Noto+Serif&family=Bitter&family=Arvo&family=Source+Sans+Pro&family=Karla&family=Mulish&family=Lato&family=Titillium+Web&family=Work+Sans&family=Barlow&family=Jost&family=Fira+Sans&family=Roboto&family=Rubik&family=Asap&family=Nunito&family=Open+Sans&family=Montserrat&family=Poppins&family=Inter&family=Raleway&family=Noto+Sans&family=Cabin&family=Exo+2&family=Chivo&family=Oswald&display=swap');
            `}</style>

            {/* Inject a style tag with important rules to override any conflicting styles */}
            <style>{`
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
                        font-weight: ${customizationOptions.header.nameBold ? '700' : '500'} !important;
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
                        font-weight: ${customizationOptions.sectionTitles.bold ? '700' : '400'} !important;
                        text-transform: ${customizationOptions.sectionTitles.style} !important;
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
                        font-weight: 800 !important;
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
                className="p-8 sm:p-12 print:p-12 hide-scrollbar [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-0.5 [&_li>*]:leading-tight [&_ul_ul]:ml-4 [&_ol_ol]:ml-4 [&_ul_ol]:ml-4 [&_ol_ul]:ml-4 [&_b]:font-extrabold [&_strong]:font-extrabold [&_i]:italic [&_em]:italic [&_u]:underline"
                data-id="resume-content"
                style={{
                    height: '100%',
                    overflowY: 'auto',
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
                        <h1 className={`${getNameFontSize()} font-${customizationOptions.header.nameBold ? 'bold' : 'medium'} uppercase tracking-tight`} style={{ color: getHeadingColor() }}>
                            {resumeData.personalInfo.name || 'YOUR NAME'}
                        </h1>
                        {resumeData.personalInfo.position && (
                            <h2 className={`${getJobTitleFontSize()} font-normal mt-1`} style={{ color: getAccentColor(1) }}>
                                {resumeData.personalInfo.position}
                            </h2>
                        )}

                        <div className={`flex flex-wrap mt-3 text-sm gap-y-2 gap-x-6 ${customizationOptions.header.alignment === 'center' ? 'justify-center' : ''}`}>
                            {resumeData.personalInfo.phone && (
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
                            {resumeData.personalInfo.email && (
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
                            {resumeData.personalInfo.location && (
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
                            {resumeData.personalInfo.socialLinks && resumeData.personalInfo.socialLinks.map((link, index) => {
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
                                            src="/assets/peerlist.svg"
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
                    {customizationOptions.header.showPhoto ? (
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
                                className={`flex items-center justify-center mt-4 md:mt-0 text-white font-bold ${customizationOptions.header.photoSize === 'small' ? 'w-16 h-16 text-xl' :
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
                    ) : null}
                </div>

                <div className={`flex flex-col ${customizationOptions.layout.templates === 'two' ? 'md:flex-row gap-6' : ''}`} data-id="resume-body">
                    {/* Left Column - Main Content */}
                    <div className={`${customizationOptions.layout.templates === 'two' ? 'md:w-3/5' : 'w-full'}`} data-id="resume-main-column">
                        {/* Render sections according to custom order */}
                        {customizationOptions.layout.sectionOrder.map((sectionKey) => {
                            // Skip hidden sections (except Personal Info, which should always be shown)
                            if (customizationOptions.layout.visibleSections?.[sectionKey] === false && sectionKey !== 'personalInfo') {
                                return null;
                            }

                            // Summary
                            if (sectionKey === 'personalInfo' && showSummary) {
                                return (
                                    <div key={sectionKey} className="mb-6">
                                        <h2 className={getSectionTitleClasses()} style={getSectionTitleStyle()}>
                                            {'SUMMARY'}
                                        </h2>
                                        <div className="text-sm">
                                            <SafeHTML html={resumeData.personalInfo.summary} />
                                        </div>
                                    </div>
                                );
                            }

                            // Work Experience
                            if (sectionKey === 'workExperience' && resumeData.workExperience.some(exp => exp.position || exp.company || exp.description)) {
                                return (
                                    <div key={sectionKey} className="mb-6">
                                        <h2 className={getSectionTitleClasses()} style={getSectionTitleStyle()}>
                                            {customizationOptions.layout.sectionTitles[sectionKey]?.toUpperCase() || 'EXPERIENCE'}
                                        </h2>
                                        <div className="space-y-4">
                                            {resumeData.workExperience
                                                .filter(exp => exp.position || exp.company || exp.description)
                                                .map((exp, index) => (
                                                    <div key={exp.id || index} className="mb-4">
                                                        <div className={`${customizationOptions.layout.templates === 'one' ? 'flex flex-row justify-between items-start' : 'flex flex-col'}`}>
                                                            <div className="flex-1">
                                                                <div className="flex flex-col">
                                                                    <div className="flex items-baseline">
                                                                        <h3 className="font-bold text-base" style={getSectionTitleStyle()}>
                                                                            {exp.company || 'Company'}
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
                                                                    <div>
                                                                        {exp.company && (
                                                                            <span className="text-base italic text-gray-700">
                                                                                {exp.position}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {customizationOptions.layout.templates !== 'one' && (exp.startDate || exp.endDate || exp.location) && (
                                                                    <div className="flex items-center text-sm opacity-80 mb-1">
                                                                        {exp.startDate && (
                                                                            <span className="italic">
                                                                                {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                                                                            </span>
                                                                        )}
                                                                        {exp.location && <span className='px-1'>{"|"}</span>}
                                                                        {exp.location && (
                                                                            <span className="italic">{exp.location || ''}</span>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                {exp.description && (
                                                                    isHTML(exp.description) ? (
                                                                        <SafeHTML
                                                                            html={exp.description}
                                                                            className={`text-sm ${getLineHeightClass(exp.description)}`}
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

                                                            {customizationOptions.layout.templates === 'one' && (exp.startDate || exp.endDate || exp.location) && (
                                                                <div className="text-sm opacity-80 text-right ml-4 whitespace-nowrap">
                                                                    {exp.startDate && (
                                                                        <div className="italic">
                                                                            {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
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
                                    <div key={sectionKey} className="mb-6">
                                        <h2 className={getSectionTitleClasses()} style={getSectionTitleStyle()}>
                                            {customizationOptions.layout.sectionTitles[sectionKey]?.toUpperCase() || 'EDUCATION'}
                                        </h2>
                                        <div className="space-y-4">
                                            {resumeData.education
                                                .filter((edu) => edu.degree || edu.institution)
                                                .map((edu, index) => (
                                                    <div key={index} className="mb-3">
                                                        <div className={`${customizationOptions.layout.templates === 'one' ? 'flex flex-row justify-between items-start' : 'flex flex-col'}`}>
                                                            <div className="flex-1">
                                                                <h3 className="font-bold text-base" style={getSectionTitleStyle()}>
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
                                                                {customizationOptions.layout.templates !== 'one' && (edu.startDate || edu.endDate || edu.location) && (
                                                                    <div className="flex items-center text-sm opacity-80">
                                                                        {edu.startDate && edu.endDate && (
                                                                            <span className="italic">
                                                                                {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                                                                            </span>
                                                                        )}
                                                                        {(edu.startDate || edu.endDate) && edu.location && (
                                                                            <span className='px-1'>{"|"}</span>
                                                                        )}
                                                                        {edu.location && (
                                                                            <span className="italic">{edu.location}</span>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {customizationOptions.layout.templates === 'one' && (edu.startDate || edu.endDate || edu.location) && (
                                                                <div className="text-sm opacity-80 text-right ml-4 whitespace-nowrap">
                                                                    {edu.startDate && edu.endDate && (
                                                                        <div className="italic">
                                                                            {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
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

                            // Skills - only in one column layout
                            if (sectionKey === 'skills' && customizationOptions.layout.templates === 'one' && topSkills.length > 0) {
                                return (
                                    <div key={sectionKey} className="mb-6">
                                        <h2 className={getSectionTitleClasses()} style={getSectionTitleStyle()}>
                                            {customizationOptions.layout.sectionTitles[sectionKey]?.toUpperCase() || 'SKILLS'}
                                        </h2>

                                        {/* Pills/Bubble Format */}
                                        {(customizationOptions.skills.format === 'pills' || customizationOptions.skills.format === 'bubble') && (
                                            <div
                                                className={`flex flex-wrap gap-1.5 mt-2 ${customizationOptions.skills.templates > 1 ? `columns-${customizationOptions.skills.templates}` : ''
                                                    }`}
                                            >
                                                {topSkills.map((skill) => (
                                                    <span
                                                        key={skill}
                                                        className="px-2.5 py-1 rounded-full border text-sm"
                                                        style={{
                                                            borderColor: getAccentColor(0.3),
                                                            backgroundColor: `${getAccentColor(0.1)}`
                                                        }}
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Grid Format */}
                                        {customizationOptions.skills.format === 'grid' && (
                                            <div
                                                className={`grid gap-2 mt-2 ${customizationOptions.skills.templates === 1 ? 'grid-cols-1' :
                                                    customizationOptions.skills.templates === 2 ? 'grid-cols-2' :
                                                        'grid-cols-3'
                                                    }`}
                                            >
                                                {topSkills.map((skill) => (
                                                    <div
                                                        key={skill}
                                                        className="p-2 border rounded text-sm"
                                                        style={{
                                                            borderColor: getAccentColor(0.3),
                                                            backgroundColor: 'white'
                                                        }}
                                                    >
                                                        {skill}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Level Format */}
                                        {customizationOptions.skills.format === 'level' && (
                                            <div
                                                className={`grid gap-2 mt-2 ${customizationOptions.skills.templates === 1 ? 'grid-cols-1' :
                                                    customizationOptions.skills.templates === 2 ? 'grid-cols-2' :
                                                        'grid-cols-3'
                                                    }`}
                                            >
                                                {topSkills.map((skill) => (
                                                    <div
                                                        key={skill}
                                                        className="flex justify-between items-center text-sm border-b pb-1 mb-1"
                                                        style={{ borderColor: getAccentColor(0.2) }}
                                                    >
                                                        <span>{skill}</span>
                                                        <div className="flex">
                                                            {[1, 2, 3, 4, 5].map((i) => (
                                                                <div
                                                                    key={i}
                                                                    className="w-1.5 h-1.5 rounded-full ml-0.5"
                                                                    style={{
                                                                        backgroundColor: i <= Math.floor(Math.random() * 3) + 3
                                                                            ? getAccentColor(1)
                                                                            : '#e5e7eb'
                                                                    }}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Compact Format */}
                                        {customizationOptions.skills.format === 'compact' && (
                                            <div
                                                className={`flex flex-wrap gap-1 mt-2 ${customizationOptions.skills.templates > 1 ? `columns-${customizationOptions.skills.templates}` : ''
                                                    }`}
                                            >
                                                {topSkills.map((skill) => (
                                                    <span
                                                        key={skill}
                                                        className="px-1.5 py-0.5 text-xs border border-transparent mr-1"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Comma-separated List */}
                                        {customizationOptions.skills.format === 'comma' && (
                                            <div className={customizationOptions.skills.templates > 1 ? `columns-${customizationOptions.skills.templates} mt-2 gap-x-6` : 'mt-2'}>
                                                <p className="text-sm">
                                                    {topSkills.join(', ')}
                                                </p>
                                            </div>
                                        )}

                                        {/* Pipe Format */}
                                        {customizationOptions.skills.format === 'pipe' && (
                                            <div className={customizationOptions.skills.templates > 1 ? `columns-${customizationOptions.skills.templates} mt-2 gap-x-6` : 'mt-2'}>
                                                <p className="text-sm">
                                                    {topSkills.join('  |  ')}
                                                </p>
                                            </div>
                                        )}

                                        {/* Newline Format */}
                                        {customizationOptions.skills.format === 'newline' && (
                                            <div className={customizationOptions.skills.templates > 1 ? `columns-${customizationOptions.skills.templates} mt-2 gap-x-6` : 'mt-2'}>
                                                {topSkills.map((skill) => (
                                                    <div key={skill} className="text-sm mb-1">
                                                        {skill}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Bullet Points */}
                                        {customizationOptions.skills.format === 'bullets' && (
                                            <div className={customizationOptions.skills.templates > 1 ? `columns-${customizationOptions.skills.templates} mt-2 gap-x-6` : 'mt-2'}>
                                                {topSkills.map((skill) => (
                                                    <div key={skill} className="flex items-center text-sm mb-1">
                                                        <span className="mr-2" style={{ color: getAccentColor(1) }}>•</span>
                                                        <span>{skill}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            // Projects - only in one column layout
                            if (sectionKey === 'projects' && customizationOptions.layout.templates === 'one' && resumeData.projects.some((project) => project.name || project.description)) {
                                return (
                                    <div key={sectionKey} className="mb-6">
                                        <h2 className={getSectionTitleClasses()} style={getSectionTitleStyle()}>
                                            {customizationOptions.layout.sectionTitles[sectionKey]?.toUpperCase() || 'PROJECTS'}
                                        </h2>
                                        <div className="space-y-4">
                                            {resumeData.projects?.slice(0, 3)
                                                .map((project, index) => (
                                                    <div key={index} className="mb-3">
                                                        <h3 className="font-bold text-base" style={getSectionTitleStyle()}>
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
                                                        {project.description && (
                                                            <SafeHTML
                                                                html={project.description}
                                                                className="text-sm"
                                                            />
                                                        )}
                                                        {project.technologies && (
                                                            <div className="text-sm mt-1 italic text-gray-600">
                                                                {project.technologies}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
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
                                <div key={customSection.id} className="mb-6">
                                    <h2 className={getSectionTitleClasses()} style={getSectionTitleStyle()}>
                                        {customSection.title.toUpperCase()}
                                    </h2>
                                    <div className="space-y-4 text-sm">
                                        <SafeHTML html={customSection.content} />
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* Right Column - Skills & Projects - only in 2-column layout */}
                    {customizationOptions.layout.templates === 'two' && (
                        <div className="md:w-2/5" data-id="resume-side-column">
                            {/* Skills */}
                            {topSkills.length > 0 && customizationOptions.layout.visibleSections?.skills !== false && (
                                <div className="mb-6">
                                    <h2 className={getSectionTitleClasses()} style={getSectionTitleStyle()}>
                                        {customizationOptions.layout.sectionTitles['skills']?.toUpperCase() || 'SKILLS'}
                                    </h2>

                                    {/* Pills/Bubble Format */}
                                    {(customizationOptions.skills.format === 'pills' || customizationOptions.skills.format === 'bubble') && (
                                        <div
                                            className={`flex flex-wrap gap-1.5 mt-2 ${customizationOptions.skills.templates > 1 ? `columns-${customizationOptions.skills.templates}` : ''
                                                }`}
                                        >
                                            {topSkills.map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="px-2.5 py-1 rounded-full border text-sm"
                                                    style={{
                                                        borderColor: getAccentColor(0.3),
                                                        backgroundColor: `${getAccentColor(0.1)}`
                                                    }}
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Grid Format */}
                                    {customizationOptions.skills.format === 'grid' && (
                                        <div
                                            className={`grid gap-2 mt-2 ${customizationOptions.skills.templates === 1 ? 'grid-cols-1' :
                                                customizationOptions.skills.templates === 2 ? 'grid-cols-2' :
                                                    'grid-cols-3'
                                                }`}
                                        >
                                            {topSkills.map((skill) => (
                                                <div
                                                    key={skill}
                                                    className="p-2 border rounded text-sm"
                                                    style={{
                                                        borderColor: getAccentColor(0.3),
                                                        backgroundColor: 'white'
                                                    }}
                                                >
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Level Format */}
                                    {customizationOptions.skills.format === 'level' && (
                                        <div
                                            className={`grid gap-2 mt-2 ${customizationOptions.skills.templates === 1 ? 'grid-cols-1' :
                                                customizationOptions.skills.templates === 2 ? 'grid-cols-2' :
                                                    'grid-cols-3'
                                                }`}
                                        >
                                            {topSkills.map((skill) => (
                                                <div
                                                    key={skill}
                                                    className="flex justify-between items-center text-sm border-b pb-1 mb-1"
                                                    style={{ borderColor: getAccentColor(0.2) }}
                                                >
                                                    <span>{skill}</span>
                                                    <div className="flex">
                                                        {[1, 2, 3, 4, 5].map((i) => (
                                                            <div
                                                                key={i}
                                                                className="w-1.5 h-1.5 rounded-full ml-0.5"
                                                                style={{
                                                                    backgroundColor: i <= Math.floor(Math.random() * 3) + 3
                                                                        ? getAccentColor(1)
                                                                        : '#e5e7eb'
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Compact Format */}
                                    {customizationOptions.skills.format === 'compact' && (
                                        <div
                                            className={`flex flex-wrap gap-1 mt-2 ${customizationOptions.skills.templates > 1 ? `columns-${customizationOptions.skills.templates}` : ''
                                                }`}
                                        >
                                            {topSkills.map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="px-1.5 py-0.5 text-xs border border-transparent mr-1"
                                                    style={{ color: getAccentColor(1) }}
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Comma-separated List */}
                                    {customizationOptions.skills.format === 'comma' && (
                                        <div className={customizationOptions.skills.templates > 1 ? `columns-${customizationOptions.skills.templates} mt-2 gap-x-6` : 'mt-2'}>
                                            <p className="text-sm">
                                                {topSkills.join(', ')}
                                            </p>
                                        </div>
                                    )}

                                    {/* Pipe Format */}
                                    {customizationOptions.skills.format === 'pipe' && (
                                        <div className={customizationOptions.skills.templates > 1 ? `columns-${customizationOptions.skills.templates} mt-2 gap-x-6` : 'mt-2'}>
                                            <p className="text-sm">
                                                {topSkills.join('  |  ')}
                                            </p>
                                        </div>
                                    )}

                                    {/* Newline Format */}
                                    {customizationOptions.skills.format === 'newline' && (
                                        <div className={customizationOptions.skills.templates > 1 ? `columns-${customizationOptions.skills.templates} mt-2 gap-x-6` : 'mt-2'}>
                                            {topSkills.map((skill) => (
                                                <div key={skill} className="text-sm mb-1">
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Bullet Points */}
                                    {customizationOptions.skills.format === 'bullets' && (
                                        <div className={customizationOptions.skills.templates > 1 ? `columns-${customizationOptions.skills.templates} mt-2 gap-x-6` : 'mt-2'}>
                                            {topSkills.map((skill) => (
                                                <div key={skill} className="flex items-center text-sm mb-1">
                                                    <span className="mr-2" style={{ color: getAccentColor(1) }}>•</span>
                                                    <span>{skill}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Projects */}
                            {resumeData.projects.some(
                                (project) => project.name || project.description
                            ) && customizationOptions.layout.visibleSections?.projects !== false && (
                                    <div className="mb-6">
                                        <h2 className={getSectionTitleClasses()} style={getSectionTitleStyle()}>
                                            {customizationOptions.layout.sectionTitles['projects']?.toUpperCase() || 'PROJECTS'}
                                        </h2>
                                        <div className="space-y-4">
                                            {resumeData.projects?.slice(0, 2)
                                                .filter((project) => project.name || project.description)
                                                .map((project, index) => (
                                                    <div key={index} className="mb-3">
                                                        <h3 className="font-bold text-base" style={getSectionTitleStyle()}>
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
                                                        {(project.startDate || project.endDate) && (
                                                            <div className="text-sm opacity-80 mb-1">
                                                                {project.startDate && project.endDate && (
                                                                    <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
                                                                )}
                                                                {project.startDate && !project.endDate && (
                                                                    <span>{formatDate(project.startDate)}</span>
                                                                )}
                                                            </div>
                                                        )}
                                                        {project.description && (
                                                            <SafeHTML
                                                                html={project.description}
                                                                className="text-sm"
                                                            />
                                                        )}
                                                        {project.technologies && (
                                                            <div className="text-sm mt-1 text-gray-600">
                                                                {project.technologies}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}

                            {/* Custom Sections - only in right column if layout is two columns */}
                            {customizationOptions.customSections
                                ?.filter(customSection => customizationOptions.layout.visibleSections?.[customSection.id] !== false)
                                ?.map((customSection) => (
                                    <div key={customSection.id} className="mb-6">
                                        <h2 className={getSectionTitleClasses()} style={getSectionTitleStyle()}>
                                            {customSection.title.toUpperCase()}
                                        </h2>
                                        <div className="space-y-4 text-sm">
                                            <SafeHTML html={customSection.content} />
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumePreview; 