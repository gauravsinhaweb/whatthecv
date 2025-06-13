import { analyzeResume as analyzeResumeAPI, checkIfResume, checkResumeFile, getSectionSuggestions, processResumeFile } from './api';
import type { AIAnalysisResult, EnhancedResumeData, ResumeCheckResult, ResumeTextResult } from './types';

export type { AIAnalysisResult, EnhancedResumeData, ResumeCheckResult, ResumeTextResult };

export async function isResumeDocument(text: string): Promise<boolean> {
  const result = await checkIfResume(text);
  return result.is_resume;
}

export async function analyzeResume(
  resumeText: string,
  jobDescription?: string
): Promise<AIAnalysisResult> {
  return analyzeResumeAPI(resumeText, jobDescription);
}

export async function suggestImprovements(
  section: string,
  content: string,
  jobDescription?: string
): Promise<string[]> {
  return getSectionSuggestions(section, content, jobDescription);
}

export async function processResume(
  file: File,
  jobDescription?: string
): Promise<AIAnalysisResult> {
  try {
    // Enforce maximum size limit
    const MAX_SIZE_MB = 10;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    if (file.size > MAX_SIZE_BYTES) {
      throw new Error(`File size exceeds ${MAX_SIZE_MB}MB limit. Please upload a smaller file.`);
    }

    // Send file directly to backend for processing
    return processResumeFile(file, jobDescription);
  } catch (error) {
    console.error('Resume processing failed:', error);
    throw error;
  }
}

/**
 * Check if a file is a resume before processing
 * This function sends the binary file to the backend to extract text and check if it's a resume
 */
export async function checkFileIsResume(file: File, returnText: boolean = false): Promise<ResumeCheckResult> {
  try {
    // Enforce maximum size limit
    const MAX_SIZE_MB = 10;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    if (file.size > MAX_SIZE_BYTES) {
      throw new Error(`File size exceeds ${MAX_SIZE_MB}MB limit. Please upload a smaller file.`);
    }

    // Send file to backend for resume detection
    return checkResumeFile(file, returnText);
  } catch (error) {
    console.error('Resume check failed:', error);
    throw error;
  }
}