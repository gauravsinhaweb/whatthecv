export interface AIAnalysisResult {
    score: number;
    feedback?: {
        strengths: string[];
        weaknesses: string[];
        improvements: string[];
    };
    sections?: {
        [key: string]: {
            score: number;
            feedback: string;
        };
    };
    keywords?: {
        matched?: string[];
        missing: string[];
        present?: string[];
    };
    atsCompatibility?: {
        score: number;
        issues: string[];
    };
    personal_info?: {
        name?: string;
        email?: string;
        phone?: string;
        address?: string;
        profile_summary?: string;
    };
    [key: string]: any; // Allow for additional properties
}

export interface ResumeCheckResult {
    is_resume: boolean;
    confidence: number;
    detected_sections: string[];
    reasoning: string;
    extracted_text?: string;
}

export interface EnhancedResumeData {
    personalInfo: {
        name: string;
        position: string;
        email: string;
        phone: string;
        location: string;
        summary: string;
        profilePicture?: string | null;
        socialLinks?: {
            platform: 'linkedin' | 'github' | 'twitter' | 'leetcode' | 'medium' | 'stackoverflow' | 'other';
            url: string;
            label?: string;
        }[];
    };
    workExperience: Array<{
        id: string;
        position: string;
        company: string;
        location: string;
        startDate: string;
        endDate: string;
        current: boolean;
        description: string;
        experienceLink?: string;
    }>;
    education: Array<{
        id: string;
        degree: string;
        institution: string;
        location: string;
        startDate: string;
        endDate: string;
        description: string;
        degreeLink?: string;
        institutionLink?: string;
    }>;
    skills: string[];
    projects: Array<{
        id: string;
        name: string;
        description: string;
        technologies: string;
        link: string;
    }>;
}

export interface ResumeTextResult {
    text: string;
} 