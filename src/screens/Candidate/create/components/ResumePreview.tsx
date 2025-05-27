import React, { useMemo, useEffect } from 'react';
import { ResumeData, ResumeCustomizationOptions } from '../../../../types/resume';
import { MapPin, Mail, Phone, User, ExternalLink, ArrowUpRight, Link as ChainLink, Linkedin, Github, Twitter, FileCode, BookOpen, MessageSquare } from 'lucide-react';
import { createMarkup, SafeHTML } from '../../../../utils/html';
import { formatBulletPoints } from '../../../../utils/resumeFormatUtils';

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
            className="printable-content bg-white shadow-lg rounded-lg overflow-hidden"
            role="article"
            aria-label="Resume Preview"
        >
            <div
                className="resume-body"
                data-id="resume-body"
                role="document"
                aria-label="Resume Content"
            >
                <div
                    className="resume-main-column"
                    data-id="resume-main-column"
                    role="region"
                    aria-label="Main Content"
                >
                    {/* Main content sections */}
                </div>
                <div
                    className="resume-side-column"
                    data-id="resume-side-column"
                    role="complementary"
                    aria-label="Additional Information"
                >
                    {/* Side content sections */}
                </div>
            </div>
        </div>
    );
};

export default ResumePreview; 