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
        profilePicture: string | null;
        socialLinks: {
            platform: "linkedin" | "github" | "twitter" | "leetcode" | "medium" | "stackoverflow" | "peerlist" | "other";
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

export interface ResumeResponse {
    id: string;
    filename: string;
    title?: string;
    is_resume: boolean;
    score?: number;
    ats_score?: number;
    content_score?: number;
    format_score?: number;
    content?: {
        personalInfo?: {
            name?: string;
            position?: string;
            email?: string;
            phone?: string;
            location?: string;
            summary?: string;
            socialLinks?: Array<{
                platform: string;
                url: string;
                label?: string;
            }>;
        };
        workExperience?: Array<{
            id: string;
            position: string;
            company: string;
            location?: string;
            startDate?: string;
            endDate?: string;
            current?: boolean;
            description?: string;
        }>;
        education?: Array<{
            id: string;
            degree: string;
            institution: string;
            location?: string;
            startDate?: string;
            endDate?: string;
            description?: string;
        }>;
        skills?: string[];
        projects?: Array<{
            id: string;
            name: string;
            description?: string;
            technologies?: string;
            link?: string;
            startDate?: string;
            endDate?: string;
        }>;
    };
    feedback?: {
        [key: string]: string[];
    };
    sections_analysis?: Array<{
        [key: string]: any;
    }>;
    keywords?: {
        [key: string]: string[];
    };
    suggestions?: Array<{
        [key: string]: any;
    }>;
    created_at: string;
    updated_at?: string;
    extracted_text?: string;
    meta_data?: {
        person_name?: string;
        position?: string;
        [key: string]: any;
    };
    customization_options?: {
        [key: string]: any;
    };
}

export interface UserProfile {
    id: string;
    email: string;
    name?: string;
    avatar_url?: string;
    created_at?: string;
    updated_at?: string;
} 