import { CheckCircle, Sparkles, Upload } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import AnalysisDashboard from '../../../components/resume/AnalysisDashboard';
import ErrorState from '../../../components/resume/ErrorState';
import HowItWorks from '../../../components/resume/HowItWorks';
import ProgressStatus from '../../../components/resume/ProgressStatus';
import Button from '../../../components/ui/Button';
import { analyzeResume, extractResumeText } from '../../../utils/ai';
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

  const processResume = async (selectedFile: File) => {
    setIsUploading(true);

    try {
      const resumeText = await extractResumeText(selectedFile);

      console.log('Extracted upload:', resumeText);

      if (!resumeText || resumeText.trim().length < 50) {
        throw new Error('Could not extract sufficient text from the resume. Please try a different file.');
      }

      setExtractedText(resumeText);
      setIsUploading(false);
      setIsAnalyzing(true);

      const analysis = await analyzeResume(resumeText, jobDescription || undefined);

      if (!analysis) {
        throw new Error('Failed to analyze the resume. Please try again.');
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

    processResume(selectedFile);
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
      processResume(file);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Our advanced AI analyzes your resume for ATS compatibility, keyword optimization,
          and provides tailored recommendations to help you land more interviews
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Job Description Section */}
        {!externalJobDescription && !file && (
          <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200 mb-6 backdrop-blur-sm bg-white/50">
            <div className="flex items-center mb-4">
              <input
                id="has-job-description"
                type="checkbox"
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                checked={hasJobDescription}
                onChange={() => setHasJobDescription(!hasJobDescription)}
                disabled={isUploading || isAnalyzing}
              />
              <label htmlFor="has-job-description" className="ml-3 text-base font-medium text-slate-700">
                I have a job description I'd like to tailor my resume for
              </label>
            </div>

            {hasJobDescription && (
              <div className="transition-all duration-500 ease-in-out">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4 border border-blue-100">
                  <p className="text-sm text-blue-700 mb-1 flex items-center font-medium">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Recommended for best results
                  </p>
                  <p className="text-sm text-slate-600">
                    Adding a job description helps our AI tailor the analysis specifically to the role you're applying for,
                    increasing your chances of getting past ATS systems.
                  </p>
                </div>
                <textarea
                  className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base shadow-inner transition-all duration-300"
                  rows={4}
                  placeholder="Paste the job description here for more accurate analysis..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription((e.target as HTMLTextAreaElement).value)}
                  disabled={isUploading || isAnalyzing}
                ></textarea>
              </div>
            )}
          </div>
        )}

        {/* Upload Area */}
        {!file && uploadStatus === 'idle' && (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200 transition-all duration-300 hover:shadow-lg">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-white/20 rounded-lg mr-3">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold">Resume Analyzer</h2>
                </div>
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-medium backdrop-blur-sm">
                  AI-Powered
                </span>
              </div>
            </div>

            <div className="p-0">
              <div
                className={`border-4 border-dashed transition-all duration-300 ease-in-out rounded-xl m-6 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50'
                  }`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                <div className="py-12 px-4 flex flex-col items-center justify-center">
                  <div className={`w-20 h-20 mb-4 rounded-full flex items-center justify-center ${isDragging ? 'bg-blue-100' : 'bg-slate-100'
                    }`}>
                    <Upload className={`h-8 w-8 ${isDragging ? 'text-blue-600' : 'text-slate-400'}`} />
                  </div>
                  <h3 className="text-xl font-medium text-slate-700 mb-2">Drag & Drop Your Resume</h3>
                  <p className="text-slate-500 text-center mb-6 max-w-md">
                    Drop your resume file here, or click the button below to select a file from your computer.
                  </p>
                  <Button
                    onClick={triggerFileInput}
                    size="lg"
                    className="px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md"
                  >
                    Select File
                  </Button>
                  <p className="mt-4 text-xs text-slate-400">
                    Supported formats: PDF, DOC, DOCX, TXT (Max size: 5MB)
                  </p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        )}

        {/* Processing State */}
        {(isUploading || isAnalyzing) && (
          <div className="bg-white rounded-xl p-8 shadow-xl border border-slate-200 transition-all duration-300">
            <ProgressStatus
              isUploading={isUploading}
              isAnalyzing={isAnalyzing}
              file={file}
            />
          </div>
        )}

        {/* Error State */}
        {uploadStatus === 'error' && (
          <div className="bg-white rounded-xl p-8 shadow-xl border border-slate-200 transition-all duration-300">
            <ErrorState
              errorMessage={errorMessage}
              clearFile={clearFile}
              tryAgain={tryAgain}
              hasFile={!!file}
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
            />
          </div>
        )}

        <HowItWorks />
      </div>
    </div>
  );
};

export default ResumeUpload;