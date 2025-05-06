import { performDetailedAnalysis as apiPerformDetailedAnalysis } from './api';

export type AnalysisCategory = 'format' | 'content' | 'tailoring' | 'sections';

// Function to generate a prompt for detailed resume analysis based on category
export function generateDetailedAnalysisPrompt(category: AnalysisCategory, resumeText: string): string {
    const basePrompt = `Analyze the following resume text and provide a detailed assessment. Focus specifically on the ${category} aspect. Include strengths, weaknesses, and specific recommendations. For each item, be concise but specific. Assign a score from 0-100 based on the assessment.

Resume Text:
${resumeText}

Please structure your response in JSON format:
{
  "score": number, // 0-100 based on overall assessment
  "details": string[] // Array of detailed observations and recommendations
}`;

    const categorySpecificPrompts = {
        format: `Specifically analyze the resume format, including:
- Layout and visual structure
- Use of white space and margins
- Consistency in formatting
- Section organization and flow
- Font choices and readability
- Use of bullets, bolding, and other formatting elements
- ATS compatibility of the format`,

        content: `Specifically analyze the resume content, including:
- Quality and impact of achievement statements
- Use of metrics and quantifiable results
- Specificity of skills and experiences
- Relevance of included information
- Action verb usage and language effectiveness
- Depth vs. breadth of content
- Absence of important content`,

        tailoring: `Specifically analyze how well the resume is tailored, including:
- Alignment with typical job requirements in their field
- Presence of relevant keywords
- Prioritization of most relevant experiences
- How well the resume speaks to target roles
- Balance of specialized vs. transferable skills
- Personal branding and unique value proposition`,

        sections: `Specifically analyze the resume sections, including:
- Presence and completeness of essential sections (contact, experience, education)
- Appropriate section ordering
- Balance between different sections
- Presence of optional but valuable sections (skills, summary, projects)
- Professional presentation of contact information
- Appropriate detail level in each section`,
    };

    return `${basePrompt}\n\n${categorySpecificPrompts[category]}`;
}

// Function that connects to the API service
export async function performDetailedAnalysis(
    category: AnalysisCategory,
    resumeText: string
): Promise<{ score: number, details: string[] }> {
    return apiPerformDetailedAnalysis(category, resumeText);
} 