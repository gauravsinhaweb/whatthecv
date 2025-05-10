import React, { useMemo } from 'react';
import { ResumeData, ResumeCustomizationOptions } from '../../../../types/resume';
import { MapPin, Mail, Phone } from 'lucide-react';
import { SafeHTML } from '../../../../utils/html';

interface ResumePreviewProps {
    resumeData: ResumeData;
    customizationOptions: ResumeCustomizationOptions;
    fullScreen?: boolean;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({
    resumeData,
    customizationOptions,
    fullScreen = false,
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
            const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
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

    // Memoize derived data 
    const topSkills = useMemo(() => resumeData.skills.slice(0, 16), [resumeData.skills]);

    const showSummary = useMemo(() => {
        return resumeData.workExperience.filter(exp => exp.position || exp.company).length <= 2
            && resumeData.personalInfo.summary;
    }, [resumeData.workExperience, resumeData.personalInfo.summary]);

    const ensureBulletPoints = (content: string): string => {
        if (!content) return '';

        // If already in HTML format, return as is
        if (content.includes('<ul>') || content.includes('<ol>')) {
            return content;
        }

        // Split by newlines or existing bullet markers
        const lines = content.split(/\n|•|-/).filter(line => line.trim());
        if (lines.length === 0) return content;

        // Format as bullet points
        return `<ul>${lines.map(line => `<li>${line.trim()}</li>`).join('')}</ul>`;
    };

    return (
        <div
            className="bg-white rounded mx-auto border overflow-hidden shadow-lg transition-all w-full print:shadow-none print:border-0 printable-content"
            data-id="resume-root"
            style={{
                maxHeight: fullScreen ? '297mm' : '100%',
                boxShadow: '0 0 8px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.05), 0 8px 16px rgba(0, 0, 0, 0.05)',
                fontFamily: fontStack,
                color: '#1a202c',
                breakInside: 'avoid',
                pageBreakInside: 'avoid',
                width: '210mm',
                minHeight: '297mm',
            }}
        >
            <div
                className="p-8 sm:p-12 print:p-12 hide-scrollbar [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1 [&_li]:leading-relaxed [&_ul_ul]:ml-4 [&_ol_ol]:ml-4 [&_ul_ol]:ml-4 [&_ol_ul]:ml-4"
                data-id="resume-content"
                style={{
                    height: '100%',
                    overflowY: 'auto',
                    position: 'relative',
                    backgroundColor: '#fff'
                }}
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-8" data-id="resume-header">
                    <div className="max-w-2xl">
                        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
                            {resumeData.personalInfo.name || 'YOUR NAME'}
                        </h1>
                        {resumeData.personalInfo.position && (
                            <h2 className="text-lg font-normal mt-1" style={{ color: getAccentColor(1) }}>
                                {resumeData.personalInfo.position}
                            </h2>
                        )}

                        <div className="flex flex-wrap mt-3 text-sm gap-y-2 gap-x-6">
                            {resumeData.personalInfo.phone && (
                                <a
                                    href={`tel:${resumeData.personalInfo.phone}`}
                                    className="flex items-center transition-colors"
                                >
                                    <Phone className="w-4 h-4 mr-1.5" strokeWidth={1.75} />
                                    <span>{resumeData.personalInfo.phone}</span>
                                </a>
                            )}
                            {resumeData.personalInfo.email && (
                                <a
                                    href={`mailto:${resumeData.personalInfo.email}`}
                                    className="flex items-center transition-colors"
                                >
                                    <Mail className="w-4 h-4 mr-1.5" strokeWidth={1.75} />
                                    <span>{resumeData.personalInfo.email}</span>
                                </a>
                            )}
                            {resumeData.personalInfo.location && (
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-1.5" strokeWidth={1.75} />
                                    <span>{resumeData.personalInfo.location}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Profile picture or initials - only show if enabled in customization */}
                    {customizationOptions.header.showPhoto ? (
                        resumeData.personalInfo.profilePicture && resumeData.personalInfo.profilePicture.startsWith('data:image') ? (
                            <div className="w-24 h-24 rounded-full overflow-hidden mt-4 md:mt-0 border-2 shadow-md" style={{ borderColor: getAccentColor(0.3) }}>
                                <img
                                    src={resumeData.personalInfo.profilePicture}
                                    alt={resumeData.personalInfo.name || 'Profile'}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div
                                className="w-24 h-24 rounded-full flex items-center justify-center mt-4 md:mt-0 text-white text-3xl font-bold"
                                style={{
                                    backgroundColor: getAccentColor(1),
                                    flexShrink: 0
                                }}
                            >
                                {getInitials}
                            </div>
                        )
                    ) : null}
                </div>

                <div className="flex flex-col md:flex-row gap-8" data-id="resume-body">
                    {/* Left Column - Main Content */}
                    <div className="flex-1" data-id="resume-main-column">
                        {/* Summary section - only show if it exists and work experience <= 2 */}
                        {showSummary && (
                            <div className="mb-8">
                                <h2 className="text-lg font-bold uppercase mb-2 pb-1 border-b border-gray-900">
                                    SUMMARY
                                </h2>
                                <div className="text-sm">
                                    <SafeHTML html={resumeData.personalInfo.summary} />
                                </div>
                            </div>
                        )}

                        {/* Work Experience */}
                        {resumeData.workExperience.some(exp => exp.position || exp.company || exp.description) && (
                            <div className="mb-8">
                                <h2 className="text-lg font-bold uppercase mb-2 pb-1 border-b border-gray-900">
                                    EXPERIENCE
                                </h2>
                                <div className="space-y-5">
                                    {resumeData.workExperience
                                        .filter(exp => exp.position || exp.company || exp.description)
                                        .map((exp, index) => (
                                            <div key={exp.id || index} className="mb-5">
                                                <div className="flex flex-col">
                                                    <h3 className="font-bold text-base">
                                                        {exp.position || 'Position'} {exp.company && `- ${exp.company}`}
                                                    </h3>
                                                    {(exp.startDate || exp.endDate || exp.location) && (
                                                        <div className="flex items-center text-sm opacity-80 mb-2">
                                                            {exp.startDate && (
                                                                <span className="mr-2">
                                                                    {exp.startDate} - {exp.endDate || 'Present'}
                                                                </span>
                                                            )}
                                                            {exp.location && (
                                                                <span>{exp.location}</span>
                                                            )}
                                                        </div>
                                                    )}
                                                    {exp.description && (
                                                        <SafeHTML
                                                            html={ensureBulletPoints(exp.description)}
                                                            className="text-sm mt-1"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Education */}
                        {resumeData.education.some(edu => edu.degree || edu.institution) && (
                            <div className="mb-8">
                                <h2 className="text-lg font-bold uppercase mb-2 pb-1 border-b border-gray-900">
                                    EDUCATION
                                </h2>
                                <div className="space-y-5">
                                    {resumeData.education
                                        .filter(edu => edu.degree || edu.institution)
                                        .map((edu, index) => (
                                            <div key={edu.id || index} className="mb-5">
                                                <div className="flex flex-col">
                                                    <h3 className="font-bold text-base">
                                                        {edu.degree || 'Degree'} {edu.institution && `| ${edu.institution}`}
                                                    </h3>
                                                    {(edu.startDate || edu.endDate || edu.location) && (
                                                        <div className="flex items-center text-sm opacity-80 mb-2">
                                                            {edu.startDate && (
                                                                <span className="mr-2">
                                                                    {edu.startDate} - {edu.endDate}
                                                                </span>
                                                            )}
                                                            {edu.location && (
                                                                <span>{edu.location}</span>
                                                            )}
                                                        </div>
                                                    )}
                                                    {edu.description && (
                                                        <SafeHTML
                                                            html={edu.description}
                                                            className="text-sm mt-1"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Skills & Projects */}
                    <div className="md:w-2/5" data-id="resume-side-column">
                        {/* Skills - limited to top 16 */}
                        {topSkills.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-lg font-bold uppercase mb-2 pb-1 border-b border-gray-900">
                                    SKILLS
                                </h2>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {topSkills.map((skill, index) => (
                                        <span
                                            key={`${skill}-${index}`}
                                            className="px-3 py-1.5 border text-sm"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Projects */}
                        {resumeData.projects.some(project => project.name || project.description) && (
                            <div className="mb-8">
                                <h2 className="text-lg font-bold uppercase mb-2 pb-1 border-b border-gray-900">
                                    PROJECTS
                                </h2>
                                <div className="space-y-5">
                                    {resumeData.projects
                                        .filter(project => project.name || project.description)
                                        .map((project, index) => (
                                            <div key={project.id || index} className="mb-5">
                                                <h3 className="font-bold text-base">
                                                    {project.name || 'Project Name'}
                                                </h3>
                                                {project.description && (
                                                    <SafeHTML
                                                        html={ensureBulletPoints(project.description)}
                                                        className="text-sm mt-1"
                                                    />
                                                )}
                                                {project.technologies && (
                                                    <div className="text-sm mt-2 text-gray-600">
                                                        {project.technologies}
                                                    </div>
                                                )}
                                                {project.link && (
                                                    <a
                                                        href={project.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm inline-block mt-1 underline"
                                                        style={{ color: getAccentColor(1) }}
                                                    >
                                                        {project.link}
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                {(customizationOptions.footer.showPageNumbers ||
                    customizationOptions.footer.showEmail ||
                    customizationOptions.footer.showName) && (
                        <div
                            className="mt-8 pt-3 text-xs text-center border-t"
                            data-id="resume-footer"
                            style={{
                                borderColor: 'rgba(0, 0, 0, 0.1)',
                                opacity: 0.7
                            }}
                        >
                            {customizationOptions.footer.showName &&
                                <span className="mr-3">{resumeData.personalInfo.name}</span>
                            }
                            {customizationOptions.footer.showEmail &&
                                <span>{resumeData.personalInfo.email}</span>
                            }
                        </div>
                    )}
            </div>
        </div>
    );
};

export default ResumePreview; 