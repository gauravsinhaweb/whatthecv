export interface ResumeData {
    personalInfo: {
        name: string;
        position: string;
        email: string;
        phone: string;
        location: string;
        summary: string;
        profilePicture?: string;
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
}

export interface Education {
    id: string;
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    technologies: string;
    link: string;
}

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

export const defaultCustomizationOptions: ResumeCustomizationOptions = {
    layout: {
        columns: 'one',
        sectionOrder: ['personalInfo', 'workExperience', 'education', 'skills', 'projects'],
    },
    colors: {
        mode: 'basic',
        type: 'single',
        accent: '#2563eb',
        headings: '#1e3a8a',
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

export const initialResumeData: ResumeData = {
    personalInfo: {
        name: 'Alex Johnson',
        position: 'Senior Software Engineer',
        email: 'alex.johnson@example.com',
        phone: '(555) 123-4567',
        location: 'San Francisco, CA',
        summary: 'Experienced software engineer with over 8 years of expertise in full-stack web development, specializing in React, Node.js, and cloud infrastructure. Passionate about creating scalable, user-friendly applications and mentoring junior developers.',
        profilePicture: '',
    },
    workExperience: [
        {
            id: '1',
            position: 'Senior Software Engineer',
            company: 'TechCorp Inc.',
            location: 'San Francisco, CA',
            startDate: 'Jan 2020',
            endDate: 'Present',
            current: true,
            description: '• Led a team of 5 developers to build and maintain a high-traffic SaaS platform\n• Redesigned authentication system, improving security and reducing login time by 40%\n• Implemented CI/CD pipeline using GitHub Actions, reducing deployment time by 60%\n• Mentored junior developers and conducted code reviews',
        },
        {
            id: '2',
            position: 'Software Engineer',
            company: 'WebSolutions LLC',
            location: 'Oakland, CA',
            startDate: 'Mar 2017',
            endDate: 'Dec 2019',
            current: false,
            description: '• Developed and maintained multiple client-facing web applications using React and Node.js\n• Optimized database queries, improving application performance by 35%\n• Collaborated with UX designers to implement responsive and accessible interfaces\n• Participated in agile development processes and daily scrums',
        },
        {
            id: '3',
            position: 'Junior Developer',
            company: 'StartUp Vision',
            location: 'San Jose, CA',
            startDate: 'Jun 2015',
            endDate: 'Feb 2017',
            current: false,
            description: '• Built and maintained features for a customer-facing mobile app\n• Collaborated with the QA team to identify and fix bugs\n• Participated in code reviews and implemented feedback',
        },
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
        },
        {
            id: '2',
            name: 'Task Management App',
            description: 'Built a collaborative task management application with real-time updates and notifications. Features include Kanban boards, task assignments, and deadline tracking.',
            technologies: 'React, Firebase, Material-UI, Jest',
            link: 'https://github.com/alexj/task-master',
        },
    ],
}; 