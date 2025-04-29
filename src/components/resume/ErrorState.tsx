import React from 'react';
import { AlertCircle, RefreshCw, Upload } from 'lucide-react';
import Button from '../ui/Button';

interface ErrorStateProps {
    errorMessage: string;
    clearFile: () => void;
    tryAgain: () => void;
    hasFile: boolean;
}

const ErrorState: React.FC<ErrorStateProps> = ({
    errorMessage,
    clearFile,
    tryAgain,
    hasFile
}) => {
    return (
        <div className="py-6">
            <div className="flex flex-col items-center space-y-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-red-800">Analysis Failed</h3>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                        <h4 className="font-medium text-red-800 mb-1">Error Details</h4>
                        <p className="text-sm text-red-700">{errorMessage}</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-slate-800 mb-3">Troubleshooting Tips</h4>
                <ul className="space-y-2">
                    <li className="text-sm text-slate-700 flex items-start">
                        <span className="inline-block w-4 h-4 rounded-full bg-slate-200 text-center text-xs font-bold mr-2 mt-0.5">•</span>
                        Check if your file is in a supported format (PDF, DOC, DOCX, TXT)
                    </li>
                    <li className="text-sm text-slate-700 flex items-start">
                        <span className="inline-block w-4 h-4 rounded-full bg-slate-200 text-center text-xs font-bold mr-2 mt-0.5">•</span>
                        Ensure your file isn't password protected or encrypted
                    </li>
                    <li className="text-sm text-slate-700 flex items-start">
                        <span className="inline-block w-4 h-4 rounded-full bg-slate-200 text-center text-xs font-bold mr-2 mt-0.5">•</span>
                        Verify that the file size is under 5MB
                    </li>
                    <li className="text-sm text-slate-700 flex items-start">
                        <span className="inline-block w-4 h-4 rounded-full bg-slate-200 text-center text-xs font-bold mr-2 mt-0.5">•</span>
                        Try uploading a different version of your resume
                    </li>
                </ul>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-center space-y-3 md:space-y-0 md:space-x-4">
                <Button
                    variant="outline"
                    onClick={clearFile}
                    leftIcon={<Upload className="h-4 w-4" />}
                    className="w-full md:w-auto"
                >
                    Upload Different File
                </Button>
                {hasFile && (
                    <Button
                        onClick={tryAgain}
                        leftIcon={<RefreshCw className="h-4 w-4" />}
                        className="w-full md:w-auto"
                    >
                        Try Again
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ErrorState; 