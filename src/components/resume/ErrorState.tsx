import { AlertTriangle, UploadCloud, RefreshCw } from 'lucide-react';
import React from 'react';
import Button from '../ui/Button';
import { ResumeCheckResult } from '../../utils/types';

interface ErrorStateProps {
    errorMessage: string;
    clearFile: () => void;
    tryAgain: () => void;
    hasFile: boolean;
    resumeCheckResult?: ResumeCheckResult;
}

const ErrorState: React.FC<ErrorStateProps> = ({
    errorMessage,
    clearFile,
    tryAgain,
    hasFile,
    resumeCheckResult
}) => {
    const isNotResumeError = errorMessage.includes("not a resume") ||
        (resumeCheckResult && !resumeCheckResult.is_resume);

    return (
        <div className="text-center py-8">
            <div className="bg-red-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-red-600 mb-2">Upload Error</h3>
            <p className="text-slate-700 mb-6 max-w-md mx-auto">{errorMessage}</p>

            {isNotResumeError && resumeCheckResult && (
                <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 text-left max-w-md mx-auto">
                    <h4 className="font-medium text-amber-800 mb-2">Document Analysis Results:</h4>
                    <p className="text-sm text-slate-700 mb-2">
                        <span className="font-medium">Confidence:</span> {(resumeCheckResult.confidence * 100).toFixed(0)}%
                    </p>
                    {resumeCheckResult.detected_sections.length > 0 ? (
                        <div className="mb-2">
                            <p className="text-sm text-slate-700 font-medium">Detected sections:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {resumeCheckResult.detected_sections.map(section => (
                                    <span key={section} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                                        {section}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-700 mb-2">No resume sections detected.</p>
                    )}
                    <p className="text-sm text-slate-700">{resumeCheckResult.reasoning}</p>
                </div>
            )}

            <div className="flex gap-4 justify-center">
                <Button
                    variant="outline"
                    onClick={clearFile}
                    leftIcon={<UploadCloud className="h-4 w-4" />}
                >
                    Upload New File
                </Button>
                {hasFile && (
                    <Button
                        onClick={tryAgain}
                        leftIcon={<RefreshCw className="h-4 w-4" />}
                    >
                        Try Again
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ErrorState; 