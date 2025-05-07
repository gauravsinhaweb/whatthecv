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

export interface EnhancedResumeData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    profilePicture?: string;
  };
  workExperience: {
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }[];
  education: {
    id: string;
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  skills: string[];
  projects: {
    id: string;
    name: string;
    description: string;
    technologies: string;
    link: string;
  }[];
}

export interface ResumeTextResult {
  text: string;
  links: {
    url: string;
    text: string;
    type: 'github' | 'linkedin' | 'portfolio' | 'email' | 'other';
  }[];
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
              const textContent = await page.getTextContent({
                // Enable advanced options to capture hyperlinks
                includeMarkedContent: true,
              });

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

export async function enhanceResume(resumeText: string): Promise<EnhancedResumeData> {
  try {
    // Extract structured information from the resume
    const structure = await extractResumeStructure(resumeText);

    // Calculate total number of work experiences to adjust bullet points
    const totalWorkExperiences = structure.workExperience.length;
    // Calculate total number of projects to adjust description length
    const totalProjects = structure.projects.length;

    console.log("Enhancing resume for ATS optimization...");

    // Process each section in parallel - focus on ATS optimization of existing content
    const [
      enhancedWorkExperience,
      enhancedEducation,
      enhancedSkills,
      enhancedProjects,
      shortSummary
    ] = await Promise.all([
      // Enhance work experience for ATS optimization
      Promise.all(structure.workExperience.map(exp =>
        enhanceResumeSection('experience', exp.description, totalWorkExperiences, totalProjects)
          .then(enhanced => ({ ...exp, description: enhanced }))
      )),
      // Don't process descriptions for education entries
      Promise.all(structure.education.map(edu => ({ ...edu, description: "" }))),
      // Extract and optimize skills for ATS recognition
      enhanceResumeSection('skills', structure.skills.join(', ')).then(skills => {
        // First split by comma (the primary separator we asked for in the prompt)
        const skillsList = skills.split(',')
          .map(skill => skill.trim())
          // Filter out empty strings, non-alphabetic strings, and common non-skill words
          .filter(skill => {
            // Skip if empty or too short
            if (!skill || skill.length < 2) return false;

            // Skip if it's just a non-alphabetic character
            if (!/[a-z]/i.test(skill)) return false;

            // Skip common non-skill words
            const lowerSkill = skill.toLowerCase();
            const nonSkillWords = [
              'and', 'the', 'of', 'in', 'for', 'with', 'on', 'at', 'by', 'to',
              'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
              'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
              'can', 'could', 'may', 'might', 'must', 'shall', 'using', 'leveraging',
              'improving', 'creating', 'developing', 'building', 'working', 'implementing',
              'skills', 'proficient', 'experienced', 'knowledgeable', 'familiar'
            ];

            return !nonSkillWords.includes(lowerSkill);
          })
          // Clean up and format skill names for ATS readability
          .map(skill => {
            // Technical term mappings for common skills
            const technicalTermMap: Record<string, string> = {
              'rest': 'REST',
              'rest-api': 'REST API',
              'restapi': 'REST API',
              'restful': 'RESTful',
              'restful-api': 'RESTful API',
              'node.js': 'Node.js',
              'nodejs': 'Node.js',
              'node-js': 'Node.js',
              'react.js': 'React.js',
              'reactjs': 'React',
              'react-js': 'React',
              'typescript': 'TypeScript',
              'javascript': 'JavaScript',
              'vue.js': 'Vue.js',
              'vuejs': 'Vue',
              'vue-js': 'Vue',
              'angular.js': 'Angular.js',
              'angularjs': 'Angular',
              'angular-js': 'Angular',
              'express.js': 'Express.js',
              'expressjs': 'Express',
              'express-js': 'Express',
              'next.js': 'Next.js',
              'nextjs': 'Next.js',
              'next-js': 'Next.js',
              'nosql': 'NoSQL',
              'mongodb': 'MongoDB',
              'postgresql': 'PostgreSQL',
              'mysql': 'MySQL',
              'mariadb': 'MariaDB',
              'graphql': 'GraphQL',
              'docker': 'Docker',
              'kubernetes': 'Kubernetes',
              'aws': 'AWS',
              'gcp': 'GCP',
              'azure': 'Azure',
              'ci/cd': 'CI/CD',
              'cicd': 'CI/CD',
              'ci-cd': 'CI/CD',
              'react-native': 'React Native',
              'reactnative': 'React Native',
              'machine-learning': 'Machine Learning',
              'machinelearning': 'Machine Learning',
              'deep-learning': 'Deep Learning',
              'deeplearning': 'Deep Learning',
              'data-science': 'Data Science',
              'datascience': 'Data Science',
              'devops': 'DevOps',
              'git': 'Git',
              'github': 'GitHub',
              'gitlab': 'GitLab',
              'bitbucket': 'Bitbucket',
              'python-fastapi': 'Python FastAPI',
              'pythonfastapi': 'Python FastAPI',
              'expo-react-native': 'React Native',
              'exporeactnative': 'React Native',
              'fastapi': 'FastAPI',
              'java-spring': 'Java Spring',
              'javaspring': 'Java Spring',
              'spring-boot': 'Spring Boot',
              'springboot': 'Spring Boot',
            };

            // Handle hyphenated or multi-word skills with proper technical capitalization
            if (skill.includes('-') || skill.includes('.') || skill.includes(' ')) {
              // Convert skill to lowercase for mapping lookup
              const lowerSkill = skill.toLowerCase().replace(/\s+/g, '-');

              // Check if this is a known technical term
              if (technicalTermMap[lowerSkill]) {
                return technicalTermMap[lowerSkill];
              }

              // For two-word combinations, prefer spaces over camelCase/PascalCase
              if (skill.includes('-') || skill.includes(' ')) {
                const words = skill.replace(/-/g, ' ').split(/\s+/);
                if (words.length === 2) {
                  return words.map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  ).join(' ');
                }
              }

              // Otherwise, convert to PascalCase (remove hyphens, spaces, dots and capitalize each word)
              return skill
                .replace(/[-.\s]+(\w)/g, (_, char) => char.toUpperCase())
                .replace(/^(\w)/, (_, char) => char.toUpperCase());
            }

            // Handle known individual skill terms
            if (technicalTermMap[skill.toLowerCase()]) {
              return technicalTermMap[skill.toLowerCase()];
            }

            // Properly capitalize single-word skills (preserve acronyms like AWS, SQL)
            if (skill === skill.toUpperCase() && skill.length <= 5) {
              return skill; // Preserve acronyms
            } else {
              // Capitalize first letter for regular skills
              return skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase();
            }
          })
          // Remove duplicates (case-insensitive)
          .filter((skill, index, self) => {
            return self.findIndex(s => s.toLowerCase() === skill.toLowerCase()) === index;
          })
          // Limit to 16 skills
          .slice(0, 16);

        return skillsList;
      }),
      // Enhance project descriptions for better ATS performance 
      // Only keep the two most important projects
      Promise.all(
        // Sort projects by importance - prioritize those with more technologies/details
        structure.projects
          .sort((a, b) => {
            // Complex projects typically have longer descriptions and more technologies
            const aScore = (a.description?.length || 0) + (a.technologies?.length || 0) * 2;
            const bScore = (b.description?.length || 0) + (b.technologies?.length || 0) * 2;
            return bScore - aScore; // Sort descending by "complexity score"
          })
          // Only keep the top 2 projects
          .slice(0, 2)
          .map(proj =>
            enhanceResumeSection('project', proj.description, undefined, totalProjects)
              .then(enhanced => ({ ...proj, description: enhanced }))
          )
      ),
      // Generate short summary for resumes with <= 2 work experiences
      totalWorkExperiences <= 2 ?
        enhanceResumeSection('summary', structure.personalInfo.summary || '') :
        Promise.resolve("")
    ]);

    console.log("Resume enhanced for ATS optimization successfully");

    // Construct the enhanced resume with ATS-optimized content
    return {
      personalInfo: {
        ...structure.personalInfo,
        // Only include summary if there are not more than 2 work experiences
        summary: totalWorkExperiences <= 2 ? shortSummary : ""
      },
      workExperience: enhancedWorkExperience,
      education: enhancedEducation,
      skills: enhancedSkills,
      projects: enhancedProjects
    };
  } catch (error) {
    console.error('Resume enhancement failed:', error);
    throw new Error('Failed to enhance resume for ATS optimization. Please try again.');
  }
}

async function enhanceResumeSection(sectionType: string, content: string, totalWorkItems?: number, totalProjects?: number): Promise<string> {
  if (!content || content.trim().length === 0) {
    return '';
  }

  // Define section-specific word limits to prevent overflow
  const sectionWordLimits = {
    summary: 50,                 // ~2 sentences (keeping this for backwards compatibility)
    experience: 100,             // ~4-5 bullet points of 20 words each
    project: 60,                 // Short concise paragraph
    education: 60,               // Degree info + 2-3 short bullet points
    skills: 16,                  // Just counting number of skills
    default: 100                 // Default fallback
  };

  // Dynamically adjust experience bullet points based on total experiences
  let maxBulletPoints = 4; // Default
  let maxWordsPerBullet = 20; // Default

  if (sectionType === 'experience' && totalWorkItems) {
    // Adjust max bullet points based on total work experiences
    if (totalWorkItems >= 5) {
      maxBulletPoints = 2; // Fewer bullets for many experiences
      maxWordsPerBullet = 15;
    } else if (totalWorkItems >= 3) {
      maxBulletPoints = 3; // Medium number of bullets for average experiences
      maxWordsPerBullet = 18;
    } else {
      maxBulletPoints = 4; // More bullets for fewer experiences
      maxWordsPerBullet = 20;
    }

    // Cap the total words proportionally
    sectionWordLimits.experience = maxBulletPoints * maxWordsPerBullet;
  }

  // Dynamically adjust project descriptions based on total projects
  if (sectionType === 'project' && totalProjects) {
    // Adjust word limit based on number of projects
    if (totalProjects >= 5) {
      sectionWordLimits.project = 30; // Very short for many projects
    } else if (totalProjects >= 3) {
      sectionWordLimits.project = 45; // Medium length for 3-4 projects
    } else {
      sectionWordLimits.project = 60; // Full length for 1-2 projects
    }
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Create section-specific prompts with layout guidance
    let prompt;

    if (sectionType === 'summary') {
      prompt = `Create a concise professional summary for an early-career professional with limited work experience.

Format requirements:
- Create a SINGLE CONCISE PARAGRAPH (not bullet points)
- STRICT WORD LIMIT: Maximum ${sectionWordLimits.summary} words total
- Focus on candidate's professional identity, core skills, and career objectives
- Emphasize technical proficiency and key qualifications that make them stand out
- Include relevant industry keywords for ATS optimization
- Use strong, confident language with active voice
- Avoid clichés and generic phrases like "team player" or "hard worker"
- Highlight specialized skills, relevant education, and any notable achievements
- Keep tone professional and achievement-focused
- Do NOT use first-person pronouns (I, me, my)
- If the original contains relevant details, maintain them

Original content (if any):
${content || "No existing summary provided."}

If no content is provided, create a professional summary based on general best practices for early-career professionals.

Example format:
"Results-driven Software Engineer with expertise in JavaScript, React, and Node.js. Demonstrates strong problem-solving abilities through development of responsive web applications and API integrations. Excels in collaborative environments with a focus on clean, maintainable code and efficient user experiences."

Respond with ONLY the enhanced summary paragraph - no additional text or explanations.`;
    }
    else if (sectionType === 'skills') {
      prompt = `Extract and enhance professional technical skills from the following resume content for maximum ATS compatibility.
      
Return ONLY a comma-separated list of high-value, ATS-optimized technical skills.

Guidelines:
- PRESERVE ALL TECHNICAL SKILLS mentioned in the original content
- Extract precise technical skills that directly match common job description requirements
- Prioritize in-demand, current industry skills that ATS systems frequently scan for
- Use standard technical capitalization (e.g., JavaScript, TypeScript, React, REST API, MongoDB)
- For multi-word skills, use proper technical formatting (e.g., "React Native" or "React.js")
- Include both specific technologies AND broader competency areas
- Balance programming languages, frameworks, tools, platforms, and methodologies
- Include both technical and domain-specific skills when present
- Do NOT include soft skills, traits, or general terms
- Skills should be separated by commas ONLY
- STRICT LIMIT: Return only up to 16 skills maximum
- Ensure skills appear in industry-standard terminology that an ATS will recognize

For example, high-value skills include: React, JavaScript, TypeScript, Java, Python, AWS, Docker, Kubernetes, MongoDB, PostgreSQL, REST API, GraphQL, MySQL, React Native, Node.js, DevOps, CI/CD, System Design.

Example good output: "JavaScript, React, TypeScript, Python, AWS, Docker, REST API, MongoDB"
Example bad output: "coding, development, programming, etc."

Original content to optimize for ATS:
${content}

Respond with ONLY the comma-separated list of skills - no additional text, bullets, or descriptions.`;
    }
    else if (sectionType === 'experience') {
      prompt = `Enhance the following experience section from a resume to maximize ATS compatibility while preserving the original meaning and key details.

Format requirements:
- Use bullet points starting with "•" (NOT dashes, asterisks, or numbers)
- Each bullet point must start on a new line
- Each bullet point should be a single accomplishment or responsibility (not paragraphs)
- STRICT WORD LIMIT: Maximum ${sectionWordLimits.experience} words total across all bullet points
- ${maxBulletPoints} bullet points total maximum (fewer if needed to stay under word limit)
- Each bullet point should ideally be ${maxWordsPerBullet} words or less
- START EACH BULLET WITH A POWERFUL ACTION VERB in past tense (e.g., "Spearheaded", "Implemented", "Orchestrated")
- PRESERVE the factual information and key achievements from the original content
- MAINTAIN all company names, technologies, and numeric metrics from the original
- Include SPECIFIC QUANTIFIABLE METRICS (numbers, percentages, timeframes, dollar amounts, team sizes)
- Use INDUSTRY-SPECIFIC KEYWORDS and technical terms that ATS systems scan for
- Incorporate relevant HARD SKILLS and TECHNICAL COMPETENCIES
- Avoid first-person pronouns (I, me, my)
- No line breaks within individual bullet points
- Use present tense only for current positions
- Prioritize the most impressive and relevant accomplishments first
- Focus on ACHIEVEMENTS and RESULTS rather than just responsibilities
- Include CONTEXT, ACTION, and RESULT in each bullet point when possible
- Use ATS-friendly language that clearly matches job description keywords
- DO NOT INVENT achievements or metrics not mentioned in the original

Example format:
• Spearheaded development of customer portal increasing user engagement by 45% and reducing bounce rate by 30% through UI/UX improvements.
• Implemented CI/CD pipeline with Jenkins and Docker, reducing deployment time from 2 hours to 15 minutes and increasing release frequency.
• Orchestrated migration of legacy systems to cloud infrastructure, resulting in 40% cost reduction and 99.9% uptime.

Original content to optimize for ATS:
${content}

Respond with ONLY the enhanced bullet points - no additional text.`;
    }
    else if (sectionType === 'project') {
      prompt = `Enhance the following project description for a resume to maximize ATS compatibility and keyword relevance while preserving the original content.

Format requirements:
- Create a SINGLE CONCISE PARAGRAPH (NOT bullet points)
- STRICT WORD LIMIT: Maximum ${sectionWordLimits.project} words total
- No line breaks within the paragraph
- PRESERVE ALL key details, technologies, and achievements from the original content
- Focus on being technical, achievement-oriented, and keyword-rich
- Begin with a STRONG ACTION VERB (e.g., "Developed", "Engineered", "Architected")
- Include ONLY technologies and tools that are actually mentioned in the original
- MAINTAIN all project names, concepts, and metrics from the original
- Emphasize PROBLEM-SOLUTION-RESULT structure when possible
- Highlight technical challenges overcome and engineering decisions
- Include MEASURABLE OUTCOMES or IMPACT only if they appear in the original text
- Use industry-standard technical terminology that ATS systems scan for
- Focus on technical implementation details rather than general descriptions
- DO NOT add any technologies, metrics, or details that aren't present in the original

Example format:
"Developed responsive e-commerce platform using React and Node.js, implementing secure payment processing with Stripe API and optimizing database schema for improved query response times. Engineered Redis caching solution for frequently accessed data, reducing page load time by 40%."

Original content to optimize for ATS:
${content}

IMPORTANT: DO NOT invent details. Only enhance what is already present.
Respond with ONLY the enhanced project paragraph - no additional text or bullet points.`;
    }
    else {
      prompt = `Enhance the following ${sectionType} from a resume for optimal ATS compatibility while preserving all original information. 
    
Format requirements:
- Maintain all factual information
- STRICT WORD LIMIT: Maximum ${sectionWordLimits.default} words total
- Incorporate relevant industry keywords and terms that ATS systems scan for
- Improve grammar and sentence structure
- Use strong action verbs
- Add quantifiable metrics where possible (only if clearly implied)
- Keep a professional, concise tone
- For bullet points, use "•" character and ensure each starts on a new line
- No line breaks within paragraphs or individual bullet points
- DO NOT add information that isn't in the original content

Original content to optimize for ATS:
${content}

Respond with ONLY the enhanced content, no explanations or commentary.`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let enhancedText = response.text().trim();

    // Ensure bullet points are properly formatted for experience and education sections
    if (sectionType === 'experience' || sectionType === 'education') {
      // Replace any non-standard bullet points with standard ones
      enhancedText = enhancedText.replace(/^[-*]\s+/gm, '• ');

      // Ensure there's no extra line breaks within bullet points
      const bulletPoints = enhancedText.split(/\n+/).map(point => point.trim()).filter(point => point);
      enhancedText = bulletPoints.map(point => {
        // Ensure each point starts with a bullet
        if (!point.startsWith('•')) {
          point = '• ' + point;
        }
        return point;
      }).join('\n');
    }

    // For project, ensure it's a single paragraph with no bullets
    if (sectionType === 'project') {
      // Remove any bullet points
      enhancedText = enhancedText.replace(/^[\s•\-*]+|^\d+[\.\)]\s*/gm, '');
      // Remove line breaks
      enhancedText = enhancedText.replace(/\n+/g, ' ');
    }

    // For summary, ensure it's a clean paragraph
    if (sectionType === 'summary') {
      // Remove any bullet points or line numbers
      enhancedText = enhancedText.replace(/^[\s•\-*]+|^\d+[\.\)]\s*/gm, '');
      // Remove line breaks
      enhancedText = enhancedText.replace(/\n+/g, ' ');
    }

    // Apply word count limits to prevent overflow
    const wordLimit = sectionWordLimits[sectionType as keyof typeof sectionWordLimits] || sectionWordLimits.default;

    if (sectionType !== 'skills') { // Skills are already limited by count, not words
      const words = enhancedText.split(/\s+/);
      if (words.length > wordLimit) {
        console.log(`Truncating ${sectionType} from ${words.length} to ${wordLimit} words`);

        if (sectionType === 'project' || sectionType === 'summary') {
          // For project or summary, just truncate to word limit and add a period if needed
          enhancedText = words.slice(0, wordLimit).join(' ');
          if (!enhancedText.endsWith('.')) {
            enhancedText += '.';
          }
        } else {
          // For bullet points, try to keep complete bullets up to the word limit
          const bullets = enhancedText.split('\n');
          let currentWords = 0;
          const keptBullets = [];

          for (const bullet of bullets) {
            const bulletWords = bullet.split(/\s+/).length;
            if (currentWords + bulletWords <= wordLimit) {
              keptBullets.push(bullet);
              currentWords += bulletWords;
            } else {
              // If we can't fit another full bullet, we're done
              break;
            }
          }

          enhancedText = keptBullets.join('\n');
        }
      }
    }

    return enhancedText;
  } catch (error) {
    console.error(`Error enhancing ${sectionType} section for ATS:`, error);
    return content; // Return original content on error
  }
}

async function extractResumeStructure(resumeText: string): Promise<EnhancedResumeData> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Extract structured information from this resume text, optimizing for ATS compatibility.
    
Format the response as a valid JSON object with the following structure:
{
  "personalInfo": {
    "name": "extracted name",
    "title": "job title (use standardized industry title)",
    "email": "email address",
    "phone": "phone number",
    "location": "country name only",
    "summary": "professional summary"
  },
  "workExperience": [
    {
      "id": "1",
      "title": "job title (use standardized industry title)",
      "company": "company name",
      "location": "country name only",
      "startDate": "start date (e.g., 'Jan 2020')",
      "endDate": "end date or 'Present'",
      "current": true/false,
      "description": "job description with bullet points"
    }
  ],
  "education": [
    {
      "id": "1",
      "degree": "degree name (use standard format like 'Bachelor of Science')",
      "institution": "school name",
      "location": "country name only",
      "startDate": "start date",
      "endDate": "end date",
      "description": "additional details"
    }
  ],
  "skills": ["skill1", "skill2", "skill3", ...],
  "projects": [
    {
      "id": "1",
      "name": "project name",
      "description": "project description",
      "technologies": "technologies used (comma-separated technical skills)",
      "link": "project link (if available, otherwise empty string)"
    }
  ]
}

Important ATS optimization notes:
- Extract job titles using standardized industry terminology that ATS systems recognize
- For skills, prioritize hard technical skills and industry-specific competencies
- Use proper capitalization for technical terms (e.g., JavaScript not javascript)
- For missing information, use empty strings, don't make up information
- Extract exactly what's in the resume
- All locations should be country names only (e.g., "United States", "Canada", "Germany") - do not include cities or states
- If a location is mentioned with city/state (e.g., "San Francisco, CA"), extract only the country (e.g., "United States")
- If sections are missing entirely, include them as empty arrays
- Preserve formatting in descriptions (especially bullet points)
- For job titles, use standardized formats likely to be recognized by ATS (e.g., "Software Engineer" not "Code Ninja")
- Ensure education degrees use standard formats (e.g., "Bachelor of Science in Computer Science")

Resume text:
${resumeText}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      // Try to parse the response as JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : text;
      const resumeData = JSON.parse(jsonText);

      // Ensure all required fields are present
      return {
        personalInfo: {
          name: resumeData.personalInfo?.name || '',
          title: resumeData.personalInfo?.title || '',
          email: resumeData.personalInfo?.email || '',
          phone: resumeData.personalInfo?.phone || '',
          location: resumeData.personalInfo?.location || '',
          summary: resumeData.personalInfo?.summary || ''
        },
        workExperience: Array.isArray(resumeData.workExperience)
          ? resumeData.workExperience.map((exp, index) => ({
            id: exp.id || String(index + 1),
            title: exp.title || '',
            company: exp.company || '',
            location: exp.location || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            current: exp.current || false,
            description: exp.description || ''
          }))
          : [],
        education: Array.isArray(resumeData.education)
          ? resumeData.education.map((edu, index) => ({
            id: edu.id || String(index + 1),
            degree: edu.degree || '',
            institution: edu.institution || '',
            location: edu.location || '',
            startDate: edu.startDate || '',
            endDate: edu.endDate || '',
            description: edu.description || ''
          }))
          : [],
        skills: Array.isArray(resumeData.skills) ? resumeData.skills : [],
        projects: Array.isArray(resumeData.projects)
          ? resumeData.projects.map((proj, index) => ({
            id: proj.id || String(index + 1),
            name: proj.name || '',
            description: proj.description || '',
            technologies: proj.technologies || '',
            link: proj.link || ''
          }))
          : []
      };
    } catch (error) {
      console.error('Failed to parse resume structure:', error);

      // Return default structure on error
      return {
        personalInfo: {
          name: '',
          title: '',
          email: '',
          phone: '',
          location: '',
          summary: resumeText.substring(0, 300)
        },
        workExperience: [],
        education: [],
        skills: [],
        projects: []
      };
    }
  } catch (error) {
    console.error('Resume structure extraction failed:', error);
    throw new Error('Failed to extract resume structure');
  }
}