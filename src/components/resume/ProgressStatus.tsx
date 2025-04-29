import React from 'react';
import { Check, FileText, Loader } from 'lucide-react';

interface ProgressStatusProps {
    isUploading: boolean;
    isAnalyzing: boolean;
    file: File | null;
}

const ProgressStatus: React.FC<ProgressStatusProps> = ({
    isUploading,
    isAnalyzing,
    file
}) => {
    const getProgress = (): number => {
        if (isUploading) return 33;
        if (isAnalyzing) return 66;
        return 0;
    };

    return (
        <div className="w-full space-y-6">
            <div className="relative">
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500 transition-all duration-500 ease-out"
                        style={{ width: `${getProgress()}%` }}
                    ></div>
                </div>

                <div className="absolute top-0 left-0 right-0 flex justify-between -mt-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center 
            ${isUploading || isAnalyzing ? 'bg-blue-500 text-white' : 'bg-slate-300'}`}>
                        <span className="text-sm">1</span>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center 
            ${isAnalyzing ? 'bg-blue-500 text-white' : 'bg-slate-300'}`}>
                        <span className="text-sm">2</span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center">
                        <span className="text-sm">3</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center space-x-8">
                <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2
            ${isUploading ? 'bg-blue-100' : isAnalyzing || getProgress() > 33 ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                        {isUploading ? (
                            <Loader className="h-6 w-6 text-blue-600 animate-spin" />
                        ) : isAnalyzing || getProgress() > 33 ? (
                            <Check className="h-6 w-6 text-emerald-600" />
                        ) : (
                            <FileText className="h-6 w-6 text-slate-400" />
                        )}
                    </div>
                    <p className={`text-sm font-medium ${isUploading ? 'text-blue-600' : isAnalyzing || getProgress() > 33 ? 'text-emerald-600' : 'text-slate-400'}`}>
                        Extracting Text
                    </p>
                </div>

                <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2
            ${isAnalyzing ? 'bg-blue-100' : getProgress() > 66 ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                        {isAnalyzing ? (
                            <Loader className="h-6 w-6 text-blue-600 animate-spin" />
                        ) : getProgress() > 66 ? (
                            <Check className="h-6 w-6 text-emerald-600" />
                        ) : (
                            <FileText className="h-6 w-6 text-slate-400" />
                        )}
                    </div>
                    <p className={`text-sm font-medium ${isAnalyzing ? 'text-blue-600' : getProgress() > 66 ? 'text-emerald-600' : 'text-slate-400'}`}>
                        AI Analysis
                    </p>
                </div>

                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                        <FileText className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-400">Results Ready</p>
                </div>
            </div>

            {file && (
                <div className="max-w-md mx-auto mt-4">
                    <div className="flex items-center justify-between p-3 bg-white rounded border border-slate-200">
                        <div className="flex items-center">
                            <div className="p-2 rounded bg-blue-100">
                                <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-3 text-left">
                                <div className="text-sm font-medium text-slate-800">{file.name}</div>
                                <div className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                            </div>
                        </div>
                        <div>
                            {(isUploading || isAnalyzing) && (
                                <div className="text-xs text-slate-500">
                                    {isUploading ? 'Extracting text...' : 'Analyzing...'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProgressStatus; 