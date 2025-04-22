/**
 * API utility functions for communicating with the backend
 */

export interface AIAnalysisResult {
    score: number;
    summary: string;
    suggestions: {
        section: string;
        severity: string;
        issue: string;
        suggestion: string;
    }[];
    keywordMatch: {
        matched: string[];
        missing: string[];
    };
}

/**
 * Analyze a resume against a job description
 */
export async function analyzeResume(
    resumeText: string,
    jobDescription?: string
): Promise<AIAnalysisResult> {
    try {
        const response = await fetch('/api/analyze/resume', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                resume_text: resumeText,
                job_description: jobDescription,
            }),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();
        return {
            score: result.score,
            summary: result.summary,
            suggestions: result.suggestions,
            keywordMatch: result.keywordMatch,
        };
    } catch (error) {
        console.error('Resume analysis error:', error);
        throw new Error('Failed to analyze resume. Please try again later.');
    }
}

/**
 * Extract text from a resume file
 */
export async function extractResumeText(file: File): Promise<string> {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/resume/extract', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();
        return result.text;
    } catch (error) {
        console.error('Text extraction error:', error);
        throw new Error('Failed to extract text from resume. Please try again later.');
    }
}

/**
 * Get improvement suggestions for a specific section
 */
export async function suggestImprovements(
    section: string,
    resumeText: string,
    jobDescription?: string
): Promise<string[]> {
    try {
        const formData = new FormData();
        formData.append('section', section);
        formData.append('resume_text', resumeText);

        if (jobDescription) {
            formData.append('job_description', jobDescription);
        }

        const response = await fetch('/api/resume/suggest', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Suggestion generation error:', error);
        throw new Error('Failed to generate suggestions. Please try again later.');
    }
} 