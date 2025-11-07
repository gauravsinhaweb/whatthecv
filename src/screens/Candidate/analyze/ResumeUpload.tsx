import { CheckCircle, Sparkles, Upload } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import AnalysisDashboard from '../../../components/resume/AnalysisDashboard';
import ErrorState from '../../../components/resume/ErrorState';
import HowItWorks from '../../../components/resume/HowItWorks';
import ProgressStatus from '../../../components/resume/ProgressStatus';
import Button from '../../../components/ui/Button';
import { analyzeResume, processResume, checkFileIsResume } from '../../../utils/resumeService';
import type { AIAnalysisResult, ResumeCheckResult } from '../../../utils/types';
import './styles.css';

export interface AnalysisResult {
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
  [key: string]: any; // Allow for additional properties
}

interface ResumeUploadProps {
  jobDescription?: string;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ jobDescription: externalJobDescription }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [jobDescription, setJobDescription] = useState<string>(externalJobDescription || '');
  const [hasJobDescription, setHasJobDescription] = useState<boolean>(!!externalJobDescription);
  const [resumeCheckResult, setResumeCheckResult] = useState<ResumeCheckResult | null>(null);
  const [isCheckingResume, setIsCheckingResume] = useState<boolean>(false);

  useEffect(() => {
    if (externalJobDescription) {
      setJobDescription(externalJobDescription);
      setHasJobDescription(true);
    }
  }, [externalJobDescription]);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFile(droppedFile);
    }
  }, []);

  const processResumeFile = async (selectedFile: File) => {
    setIsUploading(true);
    setIsAnalyzing(false);
    setIsCheckingResume(true);

    try {
      // First, check if the file is actually a resume
      const checkResult = await checkFileIsResume(selectedFile, false);
      setResumeCheckResult(checkResult);

      if (!checkResult.is_resume) {
        throw new Error('The uploaded document does not appear to be a resume. Please upload a resume document.');
      }

      setIsCheckingResume(false);
      setIsUploading(false);
      setIsAnalyzing(true);

      // Process the file using the backend endpoint
      const analysis = await processResume(selectedFile, jobDescription || undefined);

      if (!analysis) {
        throw new Error('Failed to analyze the resume. Please try again.');
      }

      // Set extracted text if available in the response
      if (analysis.extracted_text) {
        setExtractedText(analysis.extracted_text);
      }

      setAnalysisResult(analysis);
      setUploadStatus('success');
    } catch (error) {
      console.error('Resume processing error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to analyze resume. Please try again.');
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
      setIsCheckingResume(false);
    }
  };

  const handleFile = (selectedFile: File) => {
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

    if (!fileExtension || !['pdf', 'doc', 'docx', 'txt'].includes(fileExtension)) {
      setErrorMessage('Please upload a PDF, DOC, DOCX, or TXT file.');
      setUploadStatus('error');
      return;
    }

    if (selectedFile.size > maxSizeInBytes) {
      setErrorMessage('File size exceeds 5MB limit. Please upload a smaller file.');
      setUploadStatus('error');
      return;
    }

    setFile(selectedFile);
    setUploadStatus('idle');
    setErrorMessage('');
    setAnalysisResult(null);
    setExtractedText('');

    processResumeFile(selectedFile);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = (e.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
    setUploadStatus('idle');
    setAnalysisResult(null);
    setExtractedText('');
  };

  const triggerFileInput = () => {
    document.getElementById('file-upload')?.click();
  };

  const tryAgain = () => {
    setUploadStatus('idle');
    if (file) {
      processResumeFile(file);
    }
  };

  return (
    <div className="min-h-screen animated-gradient-bg flex items-center">
      <div className="container mx-auto px-4 py-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main Content Box */}
          {!file && uploadStatus === 'idle' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8">
              <div className="text-center mb-6">
                <h1 className="font-display text-3xl lg:text-4xl font-medium text-slate-900 mb-2">
                  Analyse my resume
                </h1>
                <p className="text-base text-slate-600 max-w-2xl mx-auto">
                  Our advanced AI analyzes your resume for ATS compatibility, keyword optimization, and provides tailored recommendations
                </p>
              </div>

              {/* Upload Area */}
              <div
                className={`border-2 border-dashed transition-all duration-300 ease-in-out rounded-2xl mb-5 ${isDragging ? 'border-slate-900 bg-slate-50' : 'border-slate-200 bg-slate-50'
                  }`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                <div className="py-12 px-6 flex flex-col items-center justify-center">
                  <div className={`w-16 h-16 mb-5 rounded-2xl flex items-center justify-center ${isDragging ? 'bg-slate-900' : 'bg-slate-100'
                    }`}>
                    <Upload className={`h-8 w-8 ${isDragging ? 'text-white' : 'text-slate-600'}`} />
                  </div>
                  <p className="text-lg text-slate-900 text-center mb-2 font-medium">
                    Choose a file or drag & drop it here
                  </p>
                  <p className="text-sm text-slate-500 text-center mb-6">
                    PDF, DOC, DOCX and TXT formats, upto 5MB
                  </p>
                  <button
                    onClick={triggerFileInput}
                    className="inline-flex items-center justify-center px-7 py-3 text-base font-semibold text-slate-900 bg-white border-2 border-slate-300 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
                  >
                    Browse File
                  </button>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleInputChange}
                />
              </div>

              {/* Job Description Section */}
              {!externalJobDescription && (
                <div className="bg-slate-50 rounded-2xl p-5">
                  <div className="flex items-start">
                    <input
                      id="has-job-description"
                      type="checkbox"
                      className="w-5 h-5 mt-1 text-slate-900 bg-white border-slate-300 rounded focus:ring-slate-900 focus:ring-2"
                      checked={hasJobDescription}
                      onChange={() => setHasJobDescription(!hasJobDescription)}
                      disabled={isUploading || isAnalyzing}
                    />
                    <label htmlFor="has-job-description" className="ml-3 text-base font-medium text-slate-900 cursor-pointer">
                      I have a job description I'd like to tailor my resume for
                    </label>
                  </div>

                  {hasJobDescription && (
                    <div className="transition-all duration-500 ease-in-out mt-5">
                      <div className="bg-slate-100 rounded-xl p-5 mb-4">
                        <p className="text-sm text-slate-900 mb-2 flex items-center font-semibold">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Recommended for best results
                        </p>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          Adding a job description helps our AI tailor the analysis specifically to the role you're applying for,
                          increasing your chances of getting past ATS systems.
                        </p>
                      </div>
                      <textarea
                        className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-base bg-white transition-all duration-200 resize-none"
                        rows={3}
                        placeholder="Paste the job description here for more accurate analysis..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription((e.target as HTMLTextAreaElement).value)}
                        disabled={isUploading || isAnalyzing}
                      ></textarea>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Processing State */}
          {(isUploading || isAnalyzing || isCheckingResume) && (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 transition-all duration-300">
              <ProgressStatus
                isUploading={isUploading}
                isAnalyzing={isAnalyzing}
                isCheckingResume={isCheckingResume}
                file={file}
              />
            </div>
          )}

          {/* Error State */}
          {uploadStatus === 'error' && (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 transition-all duration-300">
              <ErrorState
                errorMessage={errorMessage}
                clearFile={clearFile}
                tryAgain={tryAgain}
                hasFile={!!file}
                resumeCheckResult={resumeCheckResult}
              />
            </div>
          )}

          {/* Analysis Results */}
          {uploadStatus === 'success' && analysisResult && (
            <div>
              <AnalysisDashboard
                analysisResult={analysisResult}
                extractedText={extractedText}
                file={file}
                clearFile={clearFile}
                onFileSelect={handleFile}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;