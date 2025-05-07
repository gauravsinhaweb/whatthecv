import React from 'react';
import { Wand2, FileText, Upload, Check, Sparkles } from 'lucide-react';
import { Progress } from '../ui/Progress';

interface EnhancingLoaderProps {
    stage: 'extracting' | 'enhancing' | 'finalizing';
}

const EnhancingLoader: React.FC<EnhancingLoaderProps> = ({ stage }) => {
    const getProgress = () => {
        switch (stage) {
            case 'extracting':
                return 25;
            case 'enhancing':
                return 65;
            case 'finalizing':
                return 95;
            default:
                return 0;
        }
    };

    return (
        <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200 transition-all duration-300">
            <div className="flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl">
                    <Wand2 className="h-10 w-10 text-white" />
                </div>

                <h2 className="text-2xl font-bold text-slate-800">Enhancing Your Resume</h2>
                <p className="text-slate-600 max-w-md">
                    We're using AI to improve your resume's content and make it more effective for job applications.
                </p>

                <div className="w-full max-w-md">
                    <Progress value={getProgress()} className="h-2" />
                </div>

                <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
                    <div className={`flex flex-col items-center p-4 rounded-lg ${stage === 'extracting' ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50 border border-slate-200'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${stage === 'extracting' ? 'bg-blue-100' : 'bg-slate-100'}`}>
                            <FileText className={`h-5 w-5 ${stage === 'extracting' ? 'text-blue-600' : 'text-slate-400'}`} />
                        </div>
                        <span className="text-sm font-medium text-center">Extracting Content</span>
                        {stage !== 'extracting' && (
                            <div className="mt-1 bg-emerald-100 rounded-full p-0.5">
                                <Check className="h-3 w-3 text-emerald-600" />
                            </div>
                        )}
                    </div>

                    <div className={`flex flex-col items-center p-4 rounded-lg ${stage === 'enhancing' ? 'bg-indigo-50 border border-indigo-200' : 'bg-slate-50 border border-slate-200'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${stage === 'enhancing' ? 'bg-indigo-100' : 'bg-slate-100'}`}>
                            <Sparkles className={`h-5 w-5 ${stage === 'enhancing' ? 'text-indigo-600' : 'text-slate-400'}`} />
                        </div>
                        <span className="text-sm font-medium text-center">Improving Language</span>
                        {stage !== 'extracting' && stage !== 'enhancing' && (
                            <div className="mt-1 bg-emerald-100 rounded-full p-0.5">
                                <Check className="h-3 w-3 text-emerald-600" />
                            </div>
                        )}
                    </div>

                    <div className={`flex flex-col items-center p-4 rounded-lg ${stage === 'finalizing' ? 'bg-purple-50 border border-purple-200' : 'bg-slate-50 border border-slate-200'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${stage === 'finalizing' ? 'bg-purple-100' : 'bg-slate-100'}`}>
                            <Upload className={`h-5 w-5 ${stage === 'finalizing' ? 'text-purple-600' : 'text-slate-400'}`} />
                        </div>
                        <span className="text-sm font-medium text-center">Finalizing Resume</span>
                    </div>
                </div>

                <p className="text-sm text-slate-500 mt-4">
                    {stage === 'extracting' && "Analyzing your resume structure..."}
                    {stage === 'enhancing' && "Enhancing work experiences and skills..."}
                    {stage === 'finalizing' && "Preparing your enhanced resume..."}
                </p>
            </div>
        </div>
    );
};

export default EnhancingLoader; 