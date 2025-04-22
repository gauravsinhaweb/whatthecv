import { GoogleGenerativeAI } from '@google/generative-ai';
import { extractTextFromDocument } from './documentParser';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);

export interface AIAnalysisResult {
  score: number;
  suggestions: {
    section: string;
    improvements: string[];
  }[];
  keywords: {
    matched: string[];
    missing: string[];
  };
}

export async function analyzeResume(
  resumeText: string,
  jobDescription?: string
): Promise<AIAnalysisResult> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let prompt = `You are an expert ATS and resume analyzer. Analyze this resume ${jobDescription ? 'for the following job description' : 'in general'} and provide a detailed response in the following JSON format:
{
  "score": <number between 0-100>,
  "suggestions": [
    {
      "section": "<section name>",
      "improvements": ["<improvement 1>", "<improvement 2>", ...]
    }
  ],
  "keywords": {
    "matched": ["<keyword 1>", "<keyword 2>", ...],
    "missing": ["<keyword 1>", "<keyword 2>", ...]
  }
}

Consider:
1. ATS compatibility and keyword optimization
2. Industry-standard formatting
3. Impact metrics and quantifiable achievements
4. Professional language and clarity
5. Modern resume best practices
`;

    if (jobDescription) {
      prompt += `\nJob Description:\n${jobDescription}\n`;
    }

    prompt += `\nResume:\n${resumeText}`;

    // First attempt
    let result = await model.generateContent(prompt);
    let response = await result.response;
    let text = response.text();

    try {
      // Parse the JSON response
      const analysis = JSON.parse(text);
      return {
        score: analysis.score,
        suggestions: analysis.suggestions,
        keywords: analysis.keywords
      };
    } catch (parseError) {
      console.error('Failed to parse AI response, retrying with structured format:', parseError);

      // Retry with more explicit formatting instructions
      prompt = `${prompt}\n\nIMPORTANT: Your response MUST be valid JSON without any additional text before or after. Follow this EXACT format without deviation:
{
  "score": <number>,
  "suggestions": [{"section": "string", "improvements": ["string"]}],
  "keywords": {"matched": ["string"], "missing": ["string"]}
}`;

      try {
        // Second attempt with clearer instructions
        result = await model.generateContent(prompt);
        response = await result.response;
        text = response.text();

        // Try to extract JSON if there's surrounding text
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonText = jsonMatch ? jsonMatch[0] : text;

        const analysis = JSON.parse(jsonText);
        return {
          score: analysis.score,
          suggestions: analysis.suggestions,
          keywords: analysis.keywords
        };
      } catch (retryError) {
        console.error('Failed second parse attempt, analyzing manually:', retryError);

        // Final attempt - using a simpler approach to extract structure
        const simplePrompt = `Analyze this resume${jobDescription ? ' for the following job:' + jobDescription : ''}. 
Return ONLY:
1. A score from 0-100
2. Three key improvement areas
3. Five keywords that are present
4. Five keywords that are missing

Resume:
${resumeText}`;

        result = await model.generateContent(simplePrompt);
        response = await result.response;
        text = response.text();

        // Extract information using regex patterns
        const scoreMatch = text.match(/(\d{1,3})/);
        const score = scoreMatch ? Math.min(100, Math.max(0, parseInt(scoreMatch[0]))) : 75;

        const improvements = text.match(/improvement|enhance|add|include|missing|lack/gi) ?
          text.split(/\n|\d\./).filter(line =>
            line.match(/improvement|enhance|add|include|missing|lack/gi)
          ).map(i => i.trim()).filter(i => i.length > 10).slice(0, 5) :
          ["Add more quantifiable achievements", "Improve formatting", "Enhance skill descriptions"];

        const matchedKeywords = text.match(/present|match|found|include|contain/i) ?
          text.split(/\n|\d\./).filter(line =>
            line.match(/present|match|found|include|contain/i)
          ).slice(0, 1).join(' ').match(/\b\w+\b/g) || ["skills", "experience"] :
          ["skills", "experience"];

        const missingKeywords = text.match(/missing|lack|need|should have|could use/i) ?
          text.split(/\n|\d\./).filter(line =>
            line.match(/missing|lack|need|should have|could use/i)
          ).slice(0, 1).join(' ').match(/\b\w+\b/g) || ["metrics", "achievements"] :
          ["metrics", "achievements"];

        return {
          score,
          suggestions: [
            {
              section: "General",
              improvements: improvements.slice(0, 3)
            }
          ],
          keywords: {
            matched: matchedKeywords.slice(0, 5),
            missing: missingKeywords.slice(0, 5)
          }
        };
      }
    }
  } catch (error) {
    console.error('AI Analysis Error:', error);
    throw new Error('Failed to analyze resume. Please try again later.');
  }
}

export async function suggestImprovements(
  section: string,
  content: string,
  jobDescription?: string
): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let prompt = `You are an expert resume writer. Analyze this ${section} section ${jobDescription ? 'for this specific job' : ''} and provide specific improvements in JSON format:
{
  "improvements": [
    {
      "type": "enhancement",
      "suggestion": "<specific improvement>",
      "reason": "<why this improvement matters>"
    }
  ]
}

Focus on:
1. ATS optimization
2. Impact metrics and quantifiable results
3. Industry-specific keywords
4. Action verbs and achievement focus
5. Modern resume best practices`;

    if (jobDescription) {
      prompt += `\n\nJob Description:\n${jobDescription}`;
    }

    prompt += `\n\nContent:\n${content}`;

    // First attempt
    let result = await model.generateContent(prompt);
    let response = await result.response;
    let text = response.text();

    try {
      const parsed = JSON.parse(text);
      return parsed.improvements.map((imp: any) => imp.suggestion);
    } catch (parseError) {
      console.error('Failed to parse AI suggestions, retrying with clearer format:', parseError);

      // Try to extract JSON if there's surrounding text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.improvements) {
            return parsed.improvements.map((imp: any) =>
              typeof imp === 'string' ? imp : imp.suggestion || imp.text || JSON.stringify(imp)
            );
          }
        } catch (e) {
          console.error('JSON extraction failed:', e);
        }
      }

      // Second attempt with simpler prompt
      const simplePrompt = `Improve this ${section} section of a resume ${jobDescription ? 'for this job:\n' + jobDescription + '\n\n' : ''}. 
Give me exactly 3-5 clear, specific improvements.
Each improvement should be on a separate line.
DO NOT number the improvements.
DO NOT include explanations.
Keep each suggestion under 20 words.

Section content:
${content}`;

      result = await model.generateContent(simplePrompt);
      response = await result.response;
      text = response.text();

      // Extract each line as a suggestion
      const improvements = text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 5 && line.length < 150)
        .filter(line => !line.match(/^(here are|some suggestions|improvements|enhance)/i));

      return improvements.length > 0
        ? improvements.slice(0, 5)
        : [
          "Add more quantifiable achievements",
          "Use stronger action verbs",
          "Include industry-specific keywords"
        ];
    }
  } catch (error) {
    console.error('AI Suggestions Error:', error);
    throw new Error('Failed to generate suggestions');
  }
}

export async function extractResumeText(file: File): Promise<string> {
  try {
    return await extractTextFromDocument(file);
  } catch (error: unknown) {
    console.error('Text extraction error:', error);
    const errorMessage = error instanceof Error
      ? error.message
      : 'Unknown error during text extraction';
    throw new Error(`Failed to extract text from resume: ${errorMessage}`);
  }
}