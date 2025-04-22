import React, { useState, useCallback } from 'react';
import { Upload, FileText, X, AlertCircle, Check, Loader, FileDown, FileUp, Eye } from 'lucide-react';
import Button from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { analyzeResume, extractResumeText, suggestImprovements } from '../utils/ai';

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
  const [showRawText, setShowRawText] = useState(false);
  const [isGeneratingImprovements, setIsGeneratingImprovements] = useState(false);
  const [sectionImprovements, setSectionImprovements] = useState<{ [key: string]: string[] }>({});
  const [jobDescription, setJobDescription] = useState<string>(externalJobDescription || '');

  // Use external job description when it changes
  React.useEffect(() => {
    if (externalJobDescription) {
      setJobDescription(externalJobDescription);
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

  const handleFile = (selectedFile: File) => {
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

    if (fileExtension && ['pdf', 'doc', 'docx', 'txt'].includes(fileExtension)) {
      setFile(selectedFile);
      setUploadStatus('idle');
      setErrorMessage('');
      setAnalysisResult(null);
      setExtractedText('');
      setSectionImprovements({});
      setShowRawText(false);
    } else {
      setErrorMessage('Please upload a PDF, DOC, DOCX, or TXT file.');
      setUploadStatus('error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
    setUploadStatus('idle');
    setAnalysisResult(null);
    setExtractedText('');
    setSectionImprovements({});
    setShowRawText(false);
  };

  const uploadFile = async () => {
    if (!file) return;

    setIsUploading(true);

    try {
      const resumeText = await extractResumeText(file);
      setExtractedText(resumeText);

      setIsAnalyzing(true);
      const analysis = await analyzeResume(resumeText, jobDescription || undefined);

      setAnalysisResult(analysis);
      setUploadStatus('success');
    } catch (error) {
      console.error('Upload Error:', error);
      setErrorMessage('Failed to analyze resume. Please try again.');
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  const generateSectionImprovement = async (section: string) => {
    if (!extractedText || isGeneratingImprovements) return;

    setIsGeneratingImprovements(true);

    try {
      // For simplicity, we'll use the entire resume text
      // In a real app, you'd extract just the relevant section
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

  const toggleShowRawText = () => {
    setShowRawText(prev => !prev);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-8">Upload Your Resume</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload Resume</CardTitle>
            </CardHeader>
            <CardContent>
              {!externalJobDescription && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Job Description (Optional)
                  </label>
                  <textarea
                    className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="Paste the job description here for more accurate analysis..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  ></textarea>
                  <p className="mt-1 text-xs text-slate-500">Adding a job description will tailor the analysis to the specific role</p>
                </div>
              )}

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300'
                  } ${uploadStatus === 'error' ? 'border-red-300 bg-red-50' : ''} ${uploadStatus === 'success' ? 'border-emerald-300 bg-emerald-50' : ''
                  } transition-colors duration-200`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                {!file && uploadStatus === 'idle' && (
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                      <Upload className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800">
                      Drag & drop your resume here
                    </h3>
                    <p className="text-slate-500">
                      Supported formats: PDF, DOC, DOCX, TXT (Max size: 5MB)
                    </p>
                    <div>
                      <Button
                        variant="outline"
                        onClick={triggerFileInput}
                        className="cursor-pointer"
                      >
                        Browse Files
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}

                {file && uploadStatus === 'idle' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded border border-slate-200">
                      <div className="flex items-center">
                        <div className="p-2 rounded bg-blue-100">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-3 text-left">
                          <p className="text-sm font-medium text-slate-800">{file.name}</p>
                          <p className="text-xs text-slate-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        className="p-1 rounded-full hover:bg-slate-100"
                        onClick={clearFile}
                      >
                        <X className="h-5 w-5 text-slate-500" />
                      </button>
                    </div>
                    <Button
                      onClick={uploadFile}
                      isLoading={isUploading || isAnalyzing}
                      leftIcon={!isUploading && !isAnalyzing ? <FileUp className="h-5 w-5" /> : undefined}
                    >
                      {isUploading ? 'Extracting Text...' : isAnalyzing ? 'Analyzing with AI...' : 'Parse & Analyze Resume'}
                    </Button>
                  </div>
                )}

                {uploadStatus === 'error' && (
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                      <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-medium text-red-800">Analysis Failed</h3>
                    <p className="text-red-600">{errorMessage}</p>
                    <Button
                      variant="outline"
                      onClick={() => setUploadStatus('idle')}
                    >
                      Try Again
                    </Button>
                  </div>
                )}

                {uploadStatus === 'success' && analysisResult && (
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                      <Check className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-medium text-emerald-800">Analysis Complete!</h3>

                    {extractedText && (
                      <div className="flex justify-end mb-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleShowRawText}
                          leftIcon={<Eye className="h-4 w-4" />}
                        >
                          {showRawText ? "Hide Extracted Text" : "Show Extracted Text"}
                        </Button>
                      </div>
                    )}

                    {showRawText && extractedText && (
                      <div className="bg-slate-50 p-4 rounded border border-slate-200 mb-4 max-h-60 overflow-y-auto">
                        <pre className="text-xs text-slate-700 whitespace-pre-wrap">{extractedText}</pre>
                      </div>
                    )}

                    <div className="text-left bg-white p-4 rounded-lg border border-slate-200">
                      <p className="text-slate-600 mb-4">
                        ATS Compatibility Score: <span className="font-semibold text-emerald-600">{analysisResult.score}%</span>
                      </p>

                      <div className="mb-6">
                        <h4 className="font-medium text-slate-800 mb-2">Keyword Analysis</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm font-medium text-emerald-700 mb-1">Matched Keywords</h5>
                            <div className="flex flex-wrap gap-2">
                              {analysisResult.keywords.matched.map((keyword: string, i: number) => (
                                <span key={i} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-red-700 mb-1">Missing Keywords</h5>
                            <div className="flex flex-wrap gap-2">
                              {analysisResult.keywords.missing.map((keyword: string, i: number) => (
                                <span key={i} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-slate-800">Improvement Suggestions</h4>
                        {analysisResult.suggestions.map((suggestion: any, index: number) => (
                          <div key={index} className="border-l-4 border-blue-500 pl-4">
                            <div className="flex justify-between items-center">
                              <h5 className="font-medium text-slate-800">{suggestion.section}</h5>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => generateSectionImprovement(suggestion.section)}
                                leftIcon={<Loader className={`h-4 w-4 ${isGeneratingImprovements ? 'animate-spin' : ''}`} />}
                                disabled={isGeneratingImprovements}
                              >
                                Detailed Suggestions
                              </Button>
                            </div>
                            <ul className="mt-2 space-y-2">
                              {suggestion.improvements.map((improvement: string, i: number) => (
                                <li key={i} className="text-sm text-slate-600">• {improvement}</li>
                              ))}
                            </ul>

                            {sectionImprovements[suggestion.section] && (
                              <div className="mt-4 bg-blue-50 p-3 rounded">
                                <h6 className="text-sm font-medium text-blue-700 mb-2">AI-Generated Improvements</h6>
                                <ul className="space-y-2">
                                  {sectionImprovements[suggestion.section].map((improvement, i) => (
                                    <li key={i} className="text-sm text-blue-800">• {improvement}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-center space-x-3">
                      <Button
                        variant="outline"
                        onClick={clearFile}
                      >
                        Upload Another
                      </Button>
                      <Button>
                        View Full Analysis
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Why Upload Your Resume?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">AI-Powered Analysis</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Get instant AI-driven feedback on how well your resume will perform with Applicant Tracking Systems.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">Smart Suggestions</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Receive AI-generated recommendations to improve your resume's content and structure.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">Advanced Document Parsing</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Our system accurately extracts text from PDF, DOC, DOCX, and other document formats.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-sm font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">Keyword Optimization</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Identify matched and missing keywords to better target your desired position.
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