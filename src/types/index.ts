export interface Resume {
  id: string;
  name: string;
  created: Date;
  lastModified: Date;
  atsScore?: number;
  content: ResumeContent;
  templateId: string;
}

export interface ResumeContent {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  certifications: Certification[];
  languages: Language[];
  projects: Project[];
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  github?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  location: string;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  location: string;
  gpa?: string;
  achievements: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiration?: string;
  url?: string;
}

export interface Language {
  name: string;
  proficiency: 'Native' | 'Fluent' | 'Professional' | 'Intermediate' | 'Basic';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url?: string;
  startDate: string;
  endDate: string | null;
  technologies: string[];
  achievements: string[];
}

export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  category: 'Professional' | 'Creative' | 'Simple' | 'Modern' | 'Executive';
  description: string;
  popularity: number;
  tags: string[];
}

export interface ATSFeedback {
  score: number;
  summary: string;
  suggestions: ATSSuggestion[];
  keywordMatch: {
    matched: string[];
    missing: string[];
  };
}

export interface ATSSuggestion {
  section: 'summary' | 'experience' | 'education' | 'skills' | 'overall';
  severity: 'high' | 'medium' | 'low';
  issue: string;
  suggestion: string;
}