import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);

export interface AIAnalysisResult {
  score: number;
  isResume: boolean;
  suggestions: {
    section: string;
    improvements: string[];
  }[];
  keywords: {
    matched: string[];
    missing: string[];
  };
}

export async function isResumeDocument(text: string): Promise<boolean> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a document classifier specializing in resume identification. 
Analyze the following text and determine if it is a resume/CV document.

Look for key resume elements:
- Contact information 
- Work experience/professional history
- Education/qualifications
- Skills section
- Career objective or summary

Answer with ONLY "true" if this is a resume/CV or "false" if it's not a resume/CV.

Text to analyze:
${text.slice(0, 2000)}`; // Only analyze first 2000 chars for efficiency

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const prediction = response.text().toLowerCase().trim();

    return prediction.includes('true');
  } catch (error) {
    console.error('Resume detection error:', error);
    return true; 
  }
}

export async function analyzeResume(
  resumeText: string,
  jobDescription?: string
): Promise<AIAnalysisResult> {
  try {
    const isResume = await isResumeDocument(resumeText);

    if (!isResume) {
      return {
        score: 0,
        isResume: false,
        suggestions: [
          {
            section: "Document Type",
            improvements: [
              "The uploaded document doesn't appear to be a resume or CV.",
              "Please upload a resume document for proper analysis.",
              "A resume should include work experience, education, and skills sections."
            ]
          }
        ],
        keywords: {
          matched: [],
          missing: []
        }
      };
    }

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
        isResume: true,
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
          isResume: true,
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
          isResume: true,
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

export async function extractText(file: File): Promise<string> {
  const startTime = performance.now();

  try {
    const fileType = file.name.split('.').pop()?.toLowerCase();

    // Handle different file types
    if (fileType === 'pdf') {
      // Use a multi-strategy approach with fallbacks
      return await extractPdfWithFallbacks(file);
    }
    else if (fileType === 'doc' || fileType === 'docx') {
      try {
        const mammoth = await import('mammoth');
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value.trim() || 'No text content extracted from document';
      } catch (error) {
        console.error('Mammoth extraction failed:', error);
        throw new Error('Failed to extract text from the document. The file might be corrupted or password-protected.');
      }
    }
    else if (fileType === 'txt') {
      const text = await file.text();
      return text || 'No text content found in file';
    }
    else {
      throw new Error(`Unsupported file type: ${fileType}. Please upload a PDF, DOC, DOCX, or TXT file.`);
    }
  } catch (error) {
    console.error('Text extraction error:', error);
    const endTime = performance.now();

    // More user-friendly error message
    if (error instanceof Error) {
      throw error; // Preserve the original error message
    } else {
      throw new Error('Failed to extract text from the resume. Please try a different file or format.');
    }
  } 
}

// PDF extraction with multiple fallback strategies
async function extractPdfWithFallbacks(file: File): Promise<string> {

  try {
    const pdfjs = await import('pdfjs-dist');

    // Configure PDF.js with fallback for worker
    try {
      // Try dynamic import first
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
      ).toString();
    } catch (workerError) {
      console.warn('Failed to load PDF.js worker dynamically, using fallback', workerError);
      // Fallback to public folder worker
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    }

    // Create array buffer from file
    const arrayBuffer = await file.arrayBuffer();

    // Load the PDF document
    const pdf = await pdfjs.getDocument({
      data: arrayBuffer,
      // Enable better CMap support for special characters
      cMapUrl: 'https://unpkg.com/pdfjs-dist@5.1.91/cmaps/',
      cMapPacked: true,
      // Ignore custom fonts to improve performance
      disableFontFace: true,
    }).promise;

    const numPages = pdf.numPages;

    // For very large PDFs, only process first 2 pages
    const pagesToProcess = Math.min(numPages, 2);

    // Extract text with concurrency control
    const textByPage: string[] = [];
    const concurrencyLimit = 3; // Process 3 pages at a time

    for (let pageRange = 0; pageRange < pagesToProcess; pageRange += concurrencyLimit) {
      const pagePromises: Promise<{ pageNum: number, text: string }>[] = [];

      // Build batch of promises
      for (let i = pageRange; i < pageRange + concurrencyLimit && i < pagesToProcess; i++) {
        const pageNum = i + 1;
        pagePromises.push(
          (async () => {
            try {
              const page = await pdf.getPage(pageNum);
              const textContent = await page.getTextContent();

              // Extract text content from each item
              const text = textContent.items
                .filter(item => (item as any).str !== undefined)
                .map(item => (item as any).str)
                .join(' ');

              // Clean up page to free memory
              page.cleanup();

              return { pageNum, text };
            } catch (error) {
              console.error(`Error extracting text from page ${pageNum}:`, error);
              return { pageNum, text: '' };
            }
          })()
        );
      }

      // Wait for current batch to complete
      const results = await Promise.all(pagePromises);

      // Sort results by page number and add to text collection
      results
        .sort((a, b) => a.pageNum - b.pageNum)
        .forEach(result => {
          textByPage[result.pageNum - 1] = result.text;
        });
    }

    // Join all pages with line breaks
    const extractedText = textByPage.join('\n\n').trim();
    const textLength = extractedText.length;


    if (textLength < 50 && numPages > 0) {
      console.warn('Extracted text is very short, PDF may be image-based or protected');
      return "Text extraction yielded very little content. The PDF appears to be image-based or protected.";
    }

    return extractedText;
  } catch (error) {
    console.error('PDF extraction failed with error:', error);

    // Attempt a last-ditch simplified extraction if the main one fails
    try {
      return await extractPdfSimplified(file);
    } catch (fallbackError) {
      console.error('Simplified extraction also failed:', fallbackError);
      return "PDF text extraction failed. The file may be corrupted, password-protected, or contain only images.";
    }
  }
}

// Ultra-simplified extraction as last resort
async function extractPdfSimplified(file: File): Promise<string> {
  const pdfjs = await import('pdfjs-dist');

  // Configure worker with fallback
  try {
    // Try dynamic import first
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  } catch (workerError) {
    console.warn('Failed to load PDF.js worker in simplified mode, using fallback', workerError);
    // Fallback to public folder worker
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

  // Only try first 2 pages
  const maxPages = Math.min(pdf.numPages, 2);
  let text = '';

  for (let i = 1; i <= maxPages; i++) {
    try {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => item.str || '')
        .join(' ');
      text += pageText + '\n\n';
      page.cleanup();
    } catch (e) {
      console.warn(`Error in simplified extraction for page ${i}:`, e);
    }
  }

  return text.trim() || "No text could be extracted from this PDF.";
}

export async function extractResumeText(file: File): Promise<string> {
  const startTime = performance.now();

  try {
    // Enforce maximum size limit
    const MAX_SIZE_MB = 10;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    if (file.size > MAX_SIZE_BYTES) {
      throw new Error(`File size exceeds ${MAX_SIZE_MB}MB limit. Please upload a smaller file.`);
    }

    const text = await extractText(file);

    // Verify we have some meaningful text content
    if (!text || text.trim().length < 50) {
      console.warn('Extracted text is too short or empty, might indicate extraction problem');
    }

    // Clean and normalize the extracted text more efficiently
    const normalized = text
      .replace(/\s+/g, ' ')         // Replace multiple spaces with a single space
      .replace(/\n{3,}/g, '\n\n')   // Replace multiple line breaks with double line breaks
      .replace(/[^\S\r\n]+/g, ' ')  // Replace multiple horizontal whitespace with single space
      .replace(/^\s+|\s+$/gm, '')   // Trim leading/trailing whitespace from all lines
      .trim();                      // Remove leading/trailing whitespace from the entire text


    // Make sure we're returning at least something meaningful
    if (normalized.length < 20) {
      return "Could not extract meaningful text from the document. The file may be image-based, protected, or corrupted.";
    }

    return normalized;
  } catch (error) {
    console.error('Resume text extraction failed:', error);
    throw error;
  } 
}