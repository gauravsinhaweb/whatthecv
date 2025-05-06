import { AnalysisCategory, generateDetailedAnalysisPrompt } from './analysisService';

interface AnalysisResponse {
    score: number;
    improvements: string[];
    keywords: {
        found: string[];
        missing: string[];
    };
    suggestions: Array<{
        section: string;
        improvements: string[];
    }>;
    isResume: boolean;
}

interface DetailedAnalysisResponse {
    score: number;
    details: string[];
}

export const analyzeResume = async (file: File): Promise<AnalysisResponse> => {
    // This would be a real API call in production
    // For now, simulate an API call with a timeout and mock data
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check if the file is a PDF or DOCX
    const isValidFileType = file.type === 'application/pdf' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    // Mock response based on file type
    if (!isValidFileType) {
        return {
            score: 0,
            improvements: [],
            keywords: { found: [], missing: [] },
            suggestions: [],
            isResume: false
        };
    }

    // Mock a successful analysis
    return {
        score: Math.floor(Math.random() * 30) + 60, // Random score between 60-90
        improvements: [
            "Add more quantifiable achievements",
            "Include industry-specific keywords",
            "Improve formatting for better readability"
        ],
        keywords: {
            found: ["project management", "leadership", "communications", "teamwork"],
            missing: ["data analysis", "strategic planning", "budget management", "agile methodology", "stakeholder management", "risk assessment"]
        },
        suggestions: [
            {
                section: "Professional Experience",
                improvements: [
                    "Add more quantifiable achievements",
                    "Use stronger action verbs",
                    "Focus on results and impact"
                ]
            },
            {
                section: "Skills",
                improvements: [
                    "Group skills by category",
                    "Add proficiency levels",
                    "Include more industry-specific keywords"
                ]
            },
            {
                section: "Education",
                improvements: [
                    "Add relevant coursework",
                    "Include GPA if above 3.5",
                    "Mention academic achievements"
                ]
            },
            {
                section: "Summary",
                improvements: [
                    "Be more specific about your expertise",
                    "Mention your most impressive achievements",
                    "Include your career objectives"
                ]
            }
        ],
        isResume: true
    };
};

export const generateSectionImprovement = async (section: string, resumeText: string): Promise<string[]> => {
    // This would be a real API call to an AI service in production
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock responses for different sections
    const mockResponses: Record<string, string[]> = {
        "Professional Experience": [
            "Start each bullet point with a strong action verb like 'Spearheaded', 'Orchestrated', or 'Transformed'",
            "Include specific metrics such as 'Increased user engagement by 45%' or 'Reduced load time by 2.5 seconds'",
            "Focus on achievements rather than responsibilities, emphasizing the impact of your work"
        ],
        "Skills": [
            "Organize skills into clear categories such as 'Programming Languages', 'Frameworks', and 'Tools'",
            "Prioritize skills that are most relevant to your target positions at the top of each category",
            "Include proficiency levels for technical skills to provide more context to recruiters"
        ],
        "Education": [
            "List relevant coursework that directly relates to your target positions",
            "Include academic projects that demonstrate practical application of your skills",
            "Mention honors, scholarships, or relevant extracurricular activities"
        ],
        "Summary": [
            "Begin with a powerful statement that highlights your years of experience and primary area of expertise",
            "Include 2-3 of your most impressive professional achievements with quantifiable results",
            "Tailor your summary to target specific job titles or industries you're pursuing"
        ]
    };

    // Return mock response or default if section not found
    return mockResponses[section] || [
        "Add more specific details and examples",
        "Include metrics and quantifiable results where possible",
        "Use industry-specific terminology relevant to your target roles"
    ];
};

export const performDetailedAnalysis = async (
    category: AnalysisCategory,
    resumeText: string
): Promise<DetailedAnalysisResponse> => {
    // In a real implementation, this would:
    // 1. Generate the prompt using the function from analysisService
    // 2. Send the prompt to an AI service API
    // 3. Parse the JSON response

    // For now, we're simulating the API call
    const prompt = generateDetailedAnalysisPrompt(category, resumeText);
    console.log(`Sending prompt for ${category} analysis:`, prompt.substring(0, 100) + '...');

    // Simulate API delay - different times for different categories to make it realistic
    const delays: Record<AnalysisCategory, number> = {
        format: 1500,
        content: 2000,
        tailoring: 2500,
        sections: 1800
    };

    await new Promise(resolve => setTimeout(resolve, delays[category]));

    // Mock responses for each category
    const mockResponses: Record<AnalysisCategory, DetailedAnalysisResponse> = {
        format: {
            score: 72,
            details: [
                "The resume uses a clean single-column layout which is good for ATS compatibility.",
                "Section headers are clearly defined, making the document easy to navigate.",
                "Inconsistent spacing between sections creates visual imbalance.",
                "Font size appears too small in some sections, potentially affecting readability.",
                "Bullet points are well-utilized for experience descriptions, improving scannability.",
                "Consider adding more white space between sections to improve visual flow."
            ]
        },
        content: {
            score: 68,
            details: [
                "Achievement statements lack specific metrics and quantifiable results to demonstrate impact.",
                "Technical skills are well-articulated with specific technologies and tools listed.",
                "Job descriptions focus too much on responsibilities rather than accomplishments.",
                "Use more powerful action verbs at the beginning of bullet points to create impact.",
                "Experience descriptions would benefit from more context about project scope and challenges overcome.",
                "Consider adding more industry-specific terminology relevant to target positions."
            ]
        },
        tailoring: {
            score: 64,
            details: [
                "Resume lacks sufficient industry keywords that would appear in job descriptions for target roles.",
                "Professional summary doesn't clearly communicate your unique value proposition for target positions.",
                "Skills section doesn't highlight the most relevant capabilities for your target industry.",
                "Consider reorganizing experience to prioritize most relevant roles first.",
                "Add more terminology that matches the language used in job postings for your target positions.",
                "Your experience descriptions should emphasize outcomes relevant to your target role."
            ]
        },
        sections: {
            score: 78,
            details: [
                "All essential sections (contact info, experience, education) are present and complete.",
                "Consider adding a professional summary or objective section at the top of your resume.",
                "Skills section effectively categorizes technical and soft skills.",
                "Education section is appropriately positioned but could use more details on relevant coursework.",
                "Consider adding a projects section to showcase specific relevant work.",
                "The contact information section is professional and complete, though could benefit from adding LinkedIn profile."
            ]
        }
    };

    return mockResponses[category];
}; 