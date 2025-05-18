import { Check, FileText, Loader, ScanSearch } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ProgressStatusProps {
    isUploading: boolean;
    isAnalyzing: boolean;
    isCheckingResume?: boolean;
    file: File | null;
}

const ProgressStatus: React.FC<ProgressStatusProps> = ({
    isUploading,
    isAnalyzing,
    isCheckingResume = false,
    file
}) => {
    const [progressPercent, setProgressPercent] = useState(0);

    useEffect(() => {
        let targetPercent = 0;

        if (isCheckingResume) {
            targetPercent = 33;
        } else if (isUploading) {
            targetPercent = 66;
        } else if (isAnalyzing) {
            targetPercent = 100;
        }

        const interval = setInterval(() => {
            setProgressPercent(prev => {
                if (prev < targetPercent) {
                    return Math.min(prev + 2, targetPercent);
                }
                return prev;
            });
        }, 100);

        return () => {
            clearInterval(interval);
        };
    }, [isUploading, isAnalyzing, isCheckingResume]);

    return (
        <div className="w-full space-y-8">
            <div className="relative">
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out"
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>

                <div className="absolute top-0 left-0 right-0 flex justify-between -mt-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all duration-300
            ${isCheckingResume || isUploading || isAnalyzing ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white scale-110' : 'bg-slate-200'}`}>
                        <span className="text-sm font-bold">1</span>
                    </div>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all duration-300
            ${isUploading || isAnalyzing ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white scale-110' : 'bg-slate-200'}`}>
                        <span className="text-sm font-bold">2</span>
                    </div>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all duration-300
            ${isAnalyzing ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white scale-110' : 'bg-slate-200'}`}>
                        <span className="text-sm font-bold">3</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center space-x-12">
                <div className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-3 transition-all duration-500
            ${isCheckingResume ? 'bg-blue-100 scale-110' : (!isCheckingResume && (isUploading || isAnalyzing)) ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                        {isCheckingResume ? (
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                                <ScanSearch className="h-6 w-6 text-white animate-pulse" />
                            </div>
                        ) : (!isCheckingResume && (isUploading || isAnalyzing)) ? (
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center">
                                <Check className="h-6 w-6 text-white" />
                            </div>
                        ) : (
                            <ScanSearch className="h-8 w-8 text-slate-400" />
                        )}
                    </div>
                    <p className={`text-sm font-medium ${isCheckingResume ? 'text-blue-600' : (!isCheckingResume && (isUploading || isAnalyzing)) ? 'text-emerald-600' : 'text-slate-400'}`}>
                        Resume Check
                    </p>
                </div>

                <div className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-3 transition-all duration-500
            ${isUploading ? 'bg-blue-100 scale-110' : (!isCheckingResume && isAnalyzing) ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                        {isUploading ? (
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                                <Loader className="h-6 w-6 text-white animate-spin" />
                            </div>
                        ) : (!isCheckingResume && isAnalyzing) ? (
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center">
                                <Check className="h-6 w-6 text-white" />
                            </div>
                        ) : (
                            <FileText className="h-8 w-8 text-slate-400" />
                        )}
                    </div>
                    <p className={`text-sm font-medium ${isUploading ? 'text-blue-600' : (!isCheckingResume && isAnalyzing) ? 'text-emerald-600' : 'text-slate-400'}`}>
                        Extracting Text
                    </p>
                </div>

                <div className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-3 transition-all duration-500
            ${isAnalyzing ? 'bg-blue-100 scale-110' : 'bg-slate-100'}`}>
                        {isAnalyzing ? (
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                                <Loader className="h-6 w-6 text-white animate-spin" />
                            </div>
                        ) : (
                            <FileText className="h-8 w-8 text-slate-400" />
                        )}
                    </div>
                    <p className={`text-sm font-medium ${isAnalyzing ? 'text-blue-600' : 'text-slate-400'}`}>
                        AI Analysis
                    </p>
                </div>
            </div>

            {file && (
                <div className="max-w-md mx-auto mt-6">
                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-md">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                                <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-4 text-left">
                                <div className="text-sm font-medium text-slate-800">{file.name}</div>
                                <div className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                            </div>
                        </div>
                        <div>
                            {(isCheckingResume || isUploading || isAnalyzing) && (
                                <div className="px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
                                    <span className="text-xs font-medium text-blue-600 flex items-center">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
                                        {isCheckingResume ? 'Checking...' : isUploading ? 'Extracting...' : 'Analyzing...'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {isAnalyzing && (
                <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <div className="flex items-start">
                        <div className="mt-0.5 mr-3 flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <Loader className="h-4 w-4 text-blue-600 animate-spin" />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-blue-800 mb-1">AI Analysis In Progress</h4>
                            <p className="text-xs text-blue-600">Our AI is carefully analyzing your resume to provide actionable recommendations. This may take up to 30 seconds.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProgressStatus; 