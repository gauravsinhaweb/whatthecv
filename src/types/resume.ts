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
    skills: string[];
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

export interface ResumeCustomizationOptions {
    layout: {
        templates: 'one' | 'two';
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
        underline: boolean;
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
        templates: 'one',
        sectionOrder: ['personalInfo', 'workExperience', 'education', 'skills', 'projects'],
        sectionTitles: {
            personalInfo: 'Personal Info',
            workExperience: 'Work Experience',
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
        accent: '#000000',
        text: '#000000',
        headings: '#000000',
    },
    spacing: {
        fontSize: 11.5,
        lineHeight: 1.2,
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
        headerFont: 'Source Sans Pro',
        photoSize: 'medium',
        photoBorder: 'thin',
        photoStyle: 'accent',
        alignment: 'center',
    },
    sectionTitles: {
        size: 'l',
        style: 'uppercase',
        bold: false,
        underline: true,
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
            description: "<ul><li>Led a team of <strong>5</strong> developers to build and maintain a high-traffic SaaS platform.</li><li>Redesigned authentication system, improving security and reducing login time by <strong>40%</strong>.</li><li>Implemented CI/CD pipeline using GitHub Actions, reducing deployment time by <strong>60%</strong>.</li><li>Mentored junior developers and conducted code reviews.</li></ul>",
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
            description: "<ul><li>Developed and maintained multiple client-facing web applications using React and Node.js.</li><li>Optimized database queries, improving application performance by <strong>35%</strong>.</li><li>Collaborated with UX designers to implement responsive and accessible interfaces.</li><li>Participated in agile development processes and daily scrums.</li></ul>",
            experienceLink: null
        },
        {
            id: "work-3",
            position: "Junior Developer",
            company: "StartUp Vision",
            location: "San Jose, CA",
            startDate: "Jun 2015",
            endDate: "Feb 2017",
            current: false,
            description: "<ul><li>Built and maintained features for a customer-facing mobile app.</li><li>Collaborated with the QA team to identify and fix bugs.</li><li>Participated in code reviews and implemented feedback.</li></ul>",
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
        'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'GraphQL',
        'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'CI/CD', 'Jest', 'Cypress',
        'Agile Methodology', 'Git', 'RESTful APIs'
    ],
    projects: [
        {
            id: '1',
            name: 'E-commerce Platform',
            description: 'Developed a full-featured e-commerce platform with React, Node.js, and MongoDB. Implemented payment processing, inventory management, and analytics dashboard.',
            technologies: 'React, Redux, Node.js, Express, MongoDB, Stripe API',
            link: 'https://github.com/alexj/ecommerce-platform',
            startDate: '2019-06',
            endDate: '2019-12'
        },
        {
            id: '2',
            name: 'Task Management App',
            description: 'Built a collaborative task management application with real-time updates and notifications. Features include Kanban boards, task assignments, and deadline tracking.',
            technologies: 'React, Firebase, Material-UI, Jest',
            link: 'https://github.com/alexj/task-master',
            startDate: '2018-10',
            endDate: '2019-03'
        },
    ],
}; 