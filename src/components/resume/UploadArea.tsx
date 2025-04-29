import React from 'react';
import { ArrowDown, FilePlus, FileText, FileUp, Shield, Sparkles, Upload } from 'lucide-react';
import Button from '../ui/Button';

interface UploadAreaProps {
    isDragging: boolean;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    triggerFileInput: () => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({
    isDragging,
    onDragOver,
    onDragLeave,
    onDrop,
    triggerFileInput
}) => {
    return (
        <div className="py-6">
            <div className="mb-8 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
                <div className="text-center mb-4">
                    <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        AI-Powered Resume Analysis
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800 mt-2">
                        Get Instant Feedback on Your Resume
                    </h2>
                    <p className="text-slate-600 max-w-xl mx-auto mt-2">
                        Our AI analyzes your resume against industry standards and provides actionable improvements
                    </p>
                </div>
            </div>

            <div
                className={`relative border-3 border-dashed rounded-xl overflow-hidden transition-all duration-300 ease-in-out 
          ${isDragging ? 'border-blue-500 bg-blue-50 scale-102 shadow-lg' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-blue-100 rounded-full opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 -ml-12 -mb-12 bg-indigo-100 rounded-full opacity-50"></div>

                <div className="relative p-8 md:p-10">
                    <div className="flex flex-col items-center space-y-6">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center animate-pulse-slow shadow-lg">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center">
                                <Upload className="h-8 w-8 md:h-10 md:w-10 text-blue-600" />
                            </div>
                        </div>

                        <div className="text-center space-y-3">
                            <h3 className="text-xl md:text-2xl font-bold text-slate-800">
                                Upload Your Resume
                            </h3>
                            <p className="text-slate-500 max-w-md mx-auto">
                                Drag & drop your resume file here or click to browse
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <Button
                                size="lg"
                                onClick={triggerFileInput}
                                leftIcon={<FileUp className="h-5 w-5" />}
                                className="px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md w-full sm:w-auto"
                            >
                                Browse Files
                            </Button>

                            <div className="flex items-center justify-center text-sm text-slate-500">
                                <ArrowDown className="h-4 w-4 mr-2 text-blue-500 animate-bounce" />
                                <span>Or drag files here</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                            <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium flex items-center">
                                <FileText className="h-3 w-3 mr-1 text-emerald-500" />
                                PDF
                            </div>
                            <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium flex items-center">
                                <FileText className="h-3 w-3 mr-1 text-blue-500" />
                                DOC
                            </div>
                            <div className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium flex items-center">
                                <FileText className="h-3 w-3 mr-1 text-purple-500" />
                                DOCX
                            </div>
                            <div className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium flex items-center">
                                <FileText className="h-3 w-3 mr-1 text-slate-500" />
                                TXT
                            </div>
                            <div className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium flex items-center">
                                <FileText className="h-3 w-3 mr-1 text-red-500" />
                                Max 5MB
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h4 className="text-base font-semibold text-slate-700 mb-4 flex items-center">
                    <Sparkles className="h-4 w-4 text-blue-500 mr-2" />
                    Features & Benefits
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200 shadow-sm transition-transform hover:scale-[1.02] duration-300">
                        <div className="flex items-start">
                            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center mr-4 mt-1 shadow-sm">
                                <FilePlus className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-800 mb-1">ATS Compatibility</h4>
                                <p className="text-sm text-slate-600">
                                    Get scored on how well your resume performs with Applicant Tracking Systems
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200 shadow-sm transition-transform hover:scale-[1.02] duration-300">
                        <div className="flex items-start">
                            <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center mr-4 mt-1 shadow-sm">
                                <FileText className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-800 mb-1">Intelligent Suggestions</h4>
                                <p className="text-sm text-slate-600">
                                    Receive personalized recommendations to improve each section of your resume
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-5 rounded-xl border border-emerald-200 shadow-sm transition-transform hover:scale-[1.02] duration-300">
                        <div className="flex items-start">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center mr-4 mt-1 shadow-sm">
                                <Shield className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-800 mb-1">Privacy Protected</h4>
                                <p className="text-sm text-slate-600">
                                    Your resume data is processed securely and never shared or stored permanently
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadArea; 