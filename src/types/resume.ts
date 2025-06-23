export interface ResumeData {
    personalInfo: {
        name: string;
        position: string;
        email: string;
        phone: string;
        location: string;
        summary: string;
        profilePicture?: string;
        socialLinks?: {
            platform: 'linkedin' | 'github' | 'twitter' | 'leetcode' | 'medium' | 'stackoverflow' | 'peerlist' | 'other';
            url: string;
            label?: string;
        }[];
    };
    workExperience: WorkExperience[];
    education: Education[];
    skills: SkillCategory[];
    projects: Project[];
}

export interface WorkExperience {
    id: string;
    position: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    experienceLink?: string;
}

export interface Education {
    id: string;
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
    degreeLink?: string;
    institutionLink?: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    technologies: string;
    link: string;
    startDate?: string;
    endDate?: string;
}

export interface SkillCategory {
    id: string;
    name: string;
    skills: string[];
}

export interface ResumeCustomizationOptions {
    layout: {
        templates: 'classic' | 'modern' | 'minimal' | 'professional' | 'creative' | 'executive';
        sectionOrder: string[];
        sectionTitles: Record<string, string>;
        visibleSections: Record<string, boolean>;
    };
    colors: {
        accent: string;
        text: string;
        headings: string;
    };
    spacing: {
        fontSize: number;
        lineHeight: number;
        sectionGap: number;
        margins: {
            left: number;
            right: number;
            top: number;
            bottom: number;
        };
    };
    font: {
        family: 'serif' | 'sans' | 'mono';
        specificFont: string;
    };
    header: {
        nameSize: 's' | 'm' | 'l' | 'xl';
        nameBold: boolean;
        jobTitleSize: 's' | 'm' | 'l';
        showPhoto: boolean;
        headerFont: string;
        photoSize?: 'small' | 'medium' | 'large';
        photoBorder?: 'none' | 'thin' | 'medium' | 'thick';
        photoStyle?: 'accent' | 'headings' | 'border' | 'none';
        alignment?: 'left' | 'center';
    };
    sectionTitles: {
        size: 's' | 'm' | 'l' | 'xl';
        style: 'uppercase' | 'lowercase' | 'capitalize' | 'normal';
        bold: boolean;
        decoration: 'underline' | 'fullBorder' | 'bottomBorder' | 'clean';
    };
    skills: {
        format: 'compact' | 'comma' | 'bullets' | 'pills' | 'bubble' | 'grid' | 'level' | 'pipe' | 'newline';
        templates: 1 | 2 | 3;
    };
    links: {
        icon: 'external' | 'arrow' | 'chain' | 'none';
        size: 'small' | 'medium' | 'large';
    };
    socialIcons: {
        style: 'outline' | 'filled';
        size: 'small' | 'medium' | 'large';
        color: 'accent' | 'headings' | 'text' | 'custom';
        customColor?: string;
    };
    showSummary: boolean;
    customSections: {
        id: string;
        title: string;
        content: string;
    }[];
}

export const defaultCustomizationOptions: ResumeCustomizationOptions = {
    layout: {
        templates: 'classic',
        sectionOrder: ['personalInfo', 'workExperience', 'education', 'skills', 'projects'],
        sectionTitles: {
            personalInfo: 'Personal Info',
            workExperience: 'Work Experience',
            education: 'Education',
            skills: 'Technical Skills',
            projects: 'Projects'
        },
        visibleSections: {
            personalInfo: true,
            workExperience: true,
            education: true,
            skills: true,
            projects: true
        }
    },
    colors: {
        accent: '#000000',
        text: '#000000',
        headings: '#000000',
    },
    spacing: {
        fontSize: 10.5,
        lineHeight: 1.25,
        sectionGap: 24,
        margins: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
        },
    },
    font: {
        family: 'serif',
        specificFont: 'Times New Roman',
    },
    header: {
        nameSize: 'l',
        nameBold: false,
        jobTitleSize: 'm',
        showPhoto: false,
        headerFont: 'Times New Roman',
        photoSize: 'medium',
        photoBorder: 'thin',
        photoStyle: 'accent',
        alignment: 'center',
    },
    sectionTitles: {
        size: 'm',
        style: 'uppercase',
        bold: true,
        decoration: 'underline',
    },
    skills: {
        format: 'compact',
        templates: 2
    },
    links: {
        icon: 'external',
        size: 'medium',
    },
    socialIcons: {
        style: 'outline',
        size: 'medium',
        color: 'accent',
    },
    showSummary: false,
    customSections: []
};

export const initialResumeData: ResumeData = {
    personalInfo: {
        name: 'Alex Johnson',
        position: 'Senior Software Engineer',
        email: 'alex.johnson@example.com',
        phone: '(555) 123-4567',
        location: 'San Francisco, CA',
        summary: 'Experienced software engineer with over 8 years of expertise in full-stack web development, specializing in React, Node.js, and cloud infrastructure. Passionate about creating scalable, user-friendly applications and mentoring junior developers.',
        profilePicture: '',
        socialLinks: [
            {
                platform: 'linkedin',
                url: 'https://www.linkedin.com/in/johnson',
                label: 'linkedin.com/johnson'
            }]
    },
    workExperience: [
        {
            id: "work-1",
            position: "Senior Software Engineer",
            company: "TechCorp Inc.",
            location: "San Francisco, CA",
            startDate: "Jan 2020",
            endDate: "Present",
            current: true,
            description: "<p>StartUp Vision is a fast-paced mobile-first startup delivering innovative digital tools for small businesses and entrepreneurs.</p><ul><li>Built cross-platform features using <strong>React Native</strong> and Firebase, increasing user engagement by over <strong>20%</strong>.</li><li>Resolved 100+ bugs through rigorous testing and debugging, enhancing app stability and user experience.</li><li>Implemented A/B testing strategies that improved feature adoption rates by <strong>15%</strong>.</li></ul>",
            experienceLink: null
        },
        {
            id: "work-2",
            position: "Software Engineer",
            company: "WebSolutions LLC",
            location: "Oakland, CA",
            startDate: "Mar 2017",
            endDate: "Dec 2019",
            current: false,
            description: "<p>A boutique development agency delivering responsive, high-performance web applications for mid-sized businesses.</p><ul><li>Developed scalable web apps using <strong>React</strong> and <strong>Node.js</strong> for over <strong>10 enterprise clients</strong>, ensuring responsive performance and clean architecture.</li><li>Optimized complex database queries, boosting overall app performance by <strong>35%</strong> and reducing server load.</li><li>Worked closely with designers to deliver <strong>accessible, WCAG-compliant interfaces</strong>, improving usability and client satisfaction.</li></ul>",
            experienceLink: null
        }
    ],
    education: [
        {
            id: '1',
            degree: 'Master of Science in Computer Science',
            institution: 'Stanford University',
            location: 'Stanford, CA',
            startDate: 'Aug 2013',
            endDate: 'May 2015',
            description: 'Specialized in Human-Computer Interaction and Machine Learning. GPA: 3.85',
        },
        {
            id: '2',
            degree: 'Bachelor of Science in Computer Engineering',
            institution: 'University of California, Berkeley',
            location: 'Berkeley, CA',
            startDate: 'Aug 2009',
            endDate: 'May 2013',
            description: 'Minor in Mathematics. Dean\'s List for 6 semesters. GPA: 3.7',
        },
    ],
    skills: [
        {
            id: '1',
            name: 'Frontend Development',
            skills: ['JavaScript', 'TypeScript', 'Next.js', 'React.js', 'Redux Toolkit']
        },
        {
            id: '2',
            name: 'Backend Integration',
            skills: ['Node.js', 'MongoDB', 'RESTful API', 'GraphQL']
        },
        {
            id: '3',
            name: 'Testing and Debugging',
            skills: ['Jest', 'A/B Testing']
        },
        {
            id: '4',
            name: 'Version Control',
            skills: ['Git', 'CI/CD', 'Jenkins']
        },
        {
            id: '5',
            name: 'Design and Prototyping',
            skills: ['Figma', 'Expo - React Native']
        }
    ],
    projects: [
        {
            id: '1',
            name: 'E-commerce Platform',
            description: 'Built a full-stack e-commerce platform with React frontend and Node.js backend. Implemented user authentication, payment processing, and inventory management.',
            technologies: 'React, Node.js, MongoDB, Stripe',
            link: 'https://github.com/example/ecommerce',
        },
        {
            id: '2',
            name: 'Task Management App',
            description: 'Developed a collaborative task management application with real-time updates and team collaboration features.',
            technologies: 'React, Socket.io, Express.js',
            link: 'https://github.com/example/taskapp',
        },
    ],
};

// Template presets with different default customization options
export const templatePresets: Record<string, Partial<ResumeCustomizationOptions>> = {
    classic: {
        layout: {
            templates: 'classic',
            sectionOrder: ['personalInfo', 'workExperience', 'education', 'skills', 'projects'],
            sectionTitles: {
                personalInfo: 'Personal Info',
                workExperience: 'Work Experience',
                education: 'Education',
                skills: 'Technical Skills',
                projects: 'Projects'
            },
            visibleSections: {
                personalInfo: true,
                workExperience: true,
                education: true,
                skills: true,
                projects: true
            }
        },
        colors: {
            accent: '#000000',
            text: '#000000',
            headings: '#000000',
        },
        spacing: {
            fontSize: 10.5,
            lineHeight: 1.25,
            sectionGap: 24,
            margins: { left: 10, right: 10, top: 10, bottom: 10 }
        },
        font: {
            family: 'serif',
            specificFont: 'Times New Roman',
        },
        header: {
            nameSize: 'l',
            nameBold: false,
            jobTitleSize: 'm',
            showPhoto: false,
            headerFont: 'Times New Roman',
            alignment: 'center',
        },
        sectionTitles: {
            size: 'm',
            style: 'uppercase',
            bold: true,
            decoration: 'underline',
        },
        showSummary: false,
    },
    modern: {
        layout: {
            templates: 'modern',
            sectionOrder: ['personalInfo', 'workExperience', 'education', 'skills', 'projects'],
            sectionTitles: {
                personalInfo: 'About',
                workExperience: 'Experience',
                education: 'Education',
                skills: 'Skills',
                projects: 'Projects'
            },
            visibleSections: {
                personalInfo: true,
                workExperience: true,
                education: true,
                skills: true,
                projects: true
            }
        },
        colors: {
            accent: '#0074E3',
            text: '#2E3A59',
            headings: '#1c398e',
        },
        spacing: {
            fontSize: 10.5,
            lineHeight: 1.3,
            sectionGap: 20,
            margins: { left: 12, right: 12, top: 12, bottom: 12 }
        },
        font: {
            family: 'sans',
            specificFont: 'Inter',
        },
        header: {
            nameSize: 'xl',
            nameBold: true,
            jobTitleSize: 'l',
            showPhoto: true,
            photoSize: 'medium',
            headerFont: 'Times New Roman',
            alignment: 'left',
        },
        sectionTitles: {
            size: 'l',
            style: 'normal',
            bold: true,
            decoration: 'bottomBorder',
        },
        showSummary: true,
    },
    minimal: {
        layout: {
            templates: 'minimal',
            sectionOrder: ['personalInfo', 'projects', 'education', 'skills'],
            sectionTitles: {
                personalInfo: 'Contact',
                projects: 'Projects',
                education: 'Education',
                skills: 'Skills'
            },
            visibleSections: {
                personalInfo: true,
                workExperience: false,
                education: true,
                skills: true,
                projects: true
            }
        },
        colors: {
            accent: '#666666',
            text: '#333333',
            headings: '#000000',
        },
        spacing: {
            fontSize: 10,
            lineHeight: 1.3,
            sectionGap: 16,
            margins: { left: 15, right: 15, top: 15, bottom: 15 }
        },
        font: {
            family: 'sans',
            specificFont: 'Helvetica',
        },
        header: {
            nameSize: 'm',
            nameBold: false,
            jobTitleSize: 's',
            showPhoto: false,
            headerFont: 'Times New Roman',
            alignment: 'left',
        },
        sectionTitles: {
            size: 's',
            style: 'uppercase',
            bold: false,
            decoration: 'clean',
        },
        showSummary: true,
    },
    professional: {
        layout: {
            templates: 'professional',
            sectionOrder: ['personalInfo', 'workExperience', 'education', 'skills', 'projects'],
            sectionTitles: {
                personalInfo: 'Professional Summary',
                workExperience: 'Professional Experience',
                education: 'Education',
                skills: 'Core Competencies',
                projects: 'Key Projects'
            },
            visibleSections: {
                personalInfo: true,
                workExperience: true,
                education: true,
                skills: true,
                projects: true
            }
        },
        colors: {
            accent: '#000000',
            text: '#495057',
            headings: '#1c398e',
        },
        spacing: {
            fontSize: 10,
            lineHeight: 1.15,
            sectionGap: 22,
            margins: { left: 12, right: 12, top: 12, bottom: 12 }
        },
        font: {
            family: 'serif',
            specificFont: 'Georgia',
        },
        header: {
            nameSize: 'l',
            nameBold: true,
            jobTitleSize: 'm',
            showPhoto: false,
            headerFont: 'Times New Roman',
            alignment: 'center',
        },
        sectionTitles: {
            size: 'm',
            style: 'uppercase',
            bold: true,
            decoration: 'underline',
        },
        showSummary: true,
    },
    creative: {
        layout: {
            templates: 'creative',
            sectionOrder: ['personalInfo', 'workExperience', 'education', 'skills', 'projects'],
            sectionTitles: {
                personalInfo: 'About Me',
                workExperience: 'Work History',
                education: 'Academic Background',
                skills: 'Expertise',
                projects: 'Portfolio'
            },
            visibleSections: {
                personalInfo: true,
                workExperience: true,
                education: true,
                skills: true,
                projects: true
            }
        },
        colors: {
            accent: '#e83e8c',
            text: '#495057',
            headings: '#343a40',
        },
        spacing: {
            fontSize: 10.5,
            lineHeight: 1.3,
            sectionGap: 28,
            margins: { left: 14, right: 14, top: 14, bottom: 14 }
        },
        font: {
            family: 'sans',
            specificFont: 'Poppins',
        },
        header: {
            nameSize: 'xl',
            nameBold: true,
            jobTitleSize: 'l',
            showPhoto: true,
            photoSize: 'large',
            headerFont: 'Times New Roman',
            alignment: 'center',
        },
        sectionTitles: {
            size: 'l',
            style: 'capitalize',
            bold: true,
            decoration: 'fullBorder',
        },
        showSummary: true,
    },
}; 