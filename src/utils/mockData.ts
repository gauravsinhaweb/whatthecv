import { Resume, Template, ATSFeedback } from '../types';

export const mockTemplates: Template[] = [
  {
    id: 'template-1',
    name: 'Professional Classic',
    thumbnail: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Professional',
    description: 'A clean, professional template perfect for traditional industries.',
    popularity: 4.8,
    tags: ['corporate', 'traditional', 'clean'],
  },
  {
    id: 'template-2',
    name: 'Modern Minimal',
    thumbnail: 'https://images.pexels.com/photos/5863401/pexels-photo-5863401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Modern',
    description: 'A sleek, minimal design with a modern touch.',
    popularity: 4.7,
    tags: ['minimal', 'modern', 'clean'],
  },
  {
    id: 'template-3',
    name: 'Creative Portfolio',
    thumbnail: 'https://images.pexels.com/photos/6893889/pexels-photo-6893889.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Creative',
    description: 'Stand out with this creative template, ideal for design roles.',
    popularity: 4.6,
    tags: ['creative', 'design', 'colorful'],
  },
  {
    id: 'template-4',
    name: 'Executive Suite',
    thumbnail: 'https://images.pexels.com/photos/6444/pencil-typography-black-design.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Executive',
    description: 'Sophisticated template for senior positions and executives.',
    popularity: 4.9,
    tags: ['executive', 'leadership', 'elegant'],
  },
  {
    id: 'template-5',
    name: 'Simple Effective',
    thumbnail: 'https://images.pexels.com/photos/4065891/pexels-photo-4065891.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Simple',
    description: 'A straightforward, effective template that gets the job done.',
    popularity: 4.5,
    tags: ['simple', 'effective', 'clean'],
  },
  {
    id: 'template-6',
    name: 'Tech Innovator',
    thumbnail: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Modern',
    description: 'Perfect for tech roles, showing innovation and technical skills.',
    popularity: 4.7,
    tags: ['tech', 'innovative', 'modern'],
  },
];

export const mockResume: Resume = {
  id: 'resume-1',
  name: 'My Software Engineer Resume',
  created: new Date('2023-04-15'),
  lastModified: new Date('2023-06-22'),
  atsScore: 72,
  templateId: 'template-1',
  content: {
    personalInfo: {
      firstName: 'Alex',
      lastName: 'Johnson',
      email: 'alex.johnson@example.com',
      phone: '(555) 123-4567',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/alexjohnson',
      github: 'github.com/alexjohnson',
      website: 'alexjohnson.dev'
    },
    summary: 'Software Engineer with 5 years of experience specializing in frontend development with React and TypeScript. Passionate about creating intuitive user experiences and scalable applications.',
    experience: [
      {
        id: 'exp-1',
        company: 'Tech Solutions Inc.',
        position: 'Senior Frontend Developer',
        startDate: '2021-03',
        endDate: null,
        current: true,
        location: 'San Francisco, CA',
        description: 'Lead frontend development for enterprise SaaS platform.',
        achievements: [
          'Reduced load time by 40% through code optimization and lazy loading techniques.',
          'Implemented component library used across 5 different products.',
          'Led team of 4 developers to deliver major platform redesign on time and under budget.'
        ]
      },
      {
        id: 'exp-2',
        company: 'Digital Innovators',
        position: 'Frontend Developer',
        startDate: '2018-06',
        endDate: '2021-02',
        current: false,
        location: 'San Jose, CA',
        description: 'Developed responsive web applications using React and TypeScript.',
        achievements: [
          'Created reusable component system that improved developer productivity by 25%.',
          'Implemented automated testing that increased code coverage from 65% to 90%.',
          'Collaborated with design team to implement new design system across platform.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2014-09',
        endDate: '2018-05',
        current: false,
        location: 'Berkeley, CA',
        gpa: '3.8',
        achievements: [
          'Dean\'s List: 6 semesters',
          'Senior thesis: "Machine Learning Applications in Web Development"',
          'Computer Science Student Association, Vice President'
        ]
      }
    ],
    skills: [
      'JavaScript', 'TypeScript', 'React', 'Redux', 'HTML5', 'CSS3', 'Tailwind CSS', 
      'Node.js', 'Express', 'MongoDB', 'GraphQL', 'REST APIs', 'Jest', 'Testing Library',
      'Git', 'CI/CD', 'Agile Methodologies', 'AWS'
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'AWS Certified Developer - Associate',
        issuer: 'Amazon Web Services',
        date: '2022-04',
        expiration: '2025-04',
        url: 'https://www.certmetrics.com/amazon/public/certification.aspx'
      },
      {
        id: 'cert-2',
        name: 'Professional Scrum Master I',
        issuer: 'Scrum.org',
        date: '2021-11',
        url: 'https://www.scrum.org/certificates/verify'
      }
    ],
    languages: [
      {
        name: 'English',
        proficiency: 'Native'
      },
      {
        name: 'Spanish',
        proficiency: 'Professional'
      }
    ],
    projects: [
      {
        id: 'proj-1',
        name: 'E-Commerce Platform',
        description: 'Built a full-stack e-commerce platform with React, Node.js, and MongoDB.',
        url: 'https://github.com/alexjohnson/ecommerce-platform',
        startDate: '2020-06',
        endDate: '2020-12',
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Redux', 'Stripe API'],
        achievements: [
          'Implemented secure payment processing with Stripe',
          'Built responsive design that works across all devices',
          'Created admin dashboard for inventory management'
        ]
      }
    ]
  }
};

export const mockATSFeedback: ATSFeedback = {
  score: 72,
  summary: "Your resume shows good experience, but there are several areas for improvement to increase your ATS compatibility and overall impact.",
  suggestions: [
    {
      section: 'summary',
      severity: 'medium',
      issue: 'Your summary lacks specific achievements and metrics',
      suggestion: 'Include 1-2 quantifiable achievements in your summary to immediately showcase your impact.'
    },
    {
      section: 'experience',
      severity: 'high',
      issue: 'Job descriptions use generic language without enough metrics',
      suggestion: 'Add more specific metrics and numbers to quantify your achievements (e.g., "increased conversion by 25%" instead of "increased conversion").'
    },
    {
      section: 'skills',
      severity: 'medium',
      issue: 'Skills section lacks organization and prioritization',
      suggestion: 'Group skills by category and prioritize those most relevant to your target role. Consider removing outdated skills.'
    },
    {
      section: 'overall',
      severity: 'low',
      issue: 'Resume exceeds one page',
      suggestion: 'Consider condensing content to fit a single page for roles requiring less than 10 years of experience.'
    }
  ],
  keywordMatch: {
    matched: ['React', 'TypeScript', 'JavaScript', 'frontend', 'component', 'testing'],
    missing: ['user experience', 'UI/UX', 'accessibility', 'performance optimization', 'SEO']
  }
};