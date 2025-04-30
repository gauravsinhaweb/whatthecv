import { AlertCircle, CheckCircle, Clock, Eye, FileText, Gauge, Laptop, Loader, Sparkles, Upload } from 'lucide-react';
import React, { useCallback, useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { analyzeResume, extractResumeText, suggestImprovements } from '../../../utils/ai';
import AnalysisResults from '../../../components/resume/AnalysisResults';
import ProgressStatus from '../../../components/resume/ProgressStatus';
import ErrorState from '../../../components/resume/ErrorState';
import UploadArea from '../../../components/resume/UploadArea';

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
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isGeneratingImprovements, setIsGeneratingImprovements] = useState(false);
  const [sectionImprovements, setSectionImprovements] = useState<{ [key: string]: string[] }>({});
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
    setSectionImprovements({});

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
    setSectionImprovements({});
  };

  const generateSectionImprovement = async (section: string) => {
    if (!extractedText || isGeneratingImprovements) return;

    setIsGeneratingImprovements(true);

    try {
      const improvements = await suggestImprovements(section, extractedText, jobDescription || undefined);

      setSectionImprovements(prev => ({
        ...prev,
        [section]: improvements
      }));
    } catch (error) {
      console.error('Error generating improvements:', error);
    } finally {
      setIsGeneratingImprovements(false);
    }
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
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">AI Resume Analysis</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Our advanced AI analyzes your resume for ATS compatibility, keyword optimization,
          and provides tailored recommendations to help you land more interviews
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg rounded-xl overflow-hidden bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Resume Analyzer
                </CardTitle>
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-medium">
                  AI-Powered
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {!externalJobDescription && (
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center mb-4">
                    <input
                      id="has-job-description"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      checked={hasJobDescription}
                      onChange={() => setHasJobDescription(!hasJobDescription)}
                      disabled={isUploading || isAnalyzing}
                    />
                    <label htmlFor="has-job-description" className="ml-2 text-sm font-medium text-slate-700">
                      I have a job description I'd like to tailor my resume for
                    </label>
                  </div>

                  {hasJobDescription && (
                    <div className="transition-all duration-300 ease-in-out">
                      <div className="bg-blue-50 rounded-lg p-4 mb-3">
                        <p className="text-xs text-blue-700 mb-1 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Recommended for best results
                        </p>
                        <p className="text-sm text-slate-600">
                          Adding a job description helps our AI tailor the analysis specifically to the role you're applying for,
                          increasing your chances of getting past ATS systems.
                        </p>
                      </div>
                      <textarea
                        className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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

              <div
                className={`transition-colors duration-200`}
              >
                {!file && uploadStatus === 'idle' && (
                  <>
                    <UploadArea
                      isDragging={isDragging}
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                      triggerFileInput={triggerFileInput}
                    />
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleInputChange}
                    />
                  </>
                )}

                {(isUploading || isAnalyzing) && (
                  <div className="px-6 py-8">
                    <ProgressStatus
                      isUploading={isUploading}
                      isAnalyzing={isAnalyzing}
                      file={file}
                    />
                  </div>
                )}

                {uploadStatus === 'error' && (
                  <div className="px-6 py-8">
                    <ErrorState
                      errorMessage={errorMessage}
                      clearFile={clearFile}
                      tryAgain={tryAgain}
                      hasFile={!!file}
                    />
                  </div>
                )}

                {uploadStatus === 'success' && analysisResult && (
                  <div className="px-6 py-8">
                    <AnalysisResults
                      analysisResult={analysisResult}
                      extractedText={extractedText}
                      file={file}
                      isGeneratingImprovements={isGeneratingImprovements}
                      sectionImprovements={sectionImprovements}
                      generateSectionImprovement={generateSectionImprovement}
                      clearFile={clearFile}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-0 shadow-lg rounded-xl overflow-hidden bg-white">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-5">
              <CardTitle className="text-white flex items-center">
                <Gauge className="h-5 w-5 mr-2" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-6">
                <li className="flex">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
                    <Upload className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-1">Upload & Extract</h4>
                    <p className="text-sm text-slate-600">
                      Upload your resume in PDF, DOC, DOCX, or TXT format. Our system extracts and processes the text content.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mr-4">
                    <Laptop className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-1">AI Analysis</h4>
                    <p className="text-sm text-slate-600">
                      Advanced AI evaluates your resume against ATS systems and industry standards for optimal formatting.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mr-4">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-1">Get Feedback</h4>
                    <p className="text-sm text-slate-600">
                      Receive instant feedback with actionable suggestions to improve your resume's effectiveness.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center mr-4">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-1">Fast & Secure</h4>
                    <p className="text-sm text-slate-600">
                      Results in seconds with privacy protection. Your data is never shared or permanently stored.
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;