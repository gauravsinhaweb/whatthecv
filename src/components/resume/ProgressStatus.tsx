import React, { useState, useEffect } from 'react';
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
    const [progressPercent, setProgressPercent] = useState(0);
    const [funnyText, setFunnyText] = useState('');

    // Funny loading messages that appear while analyzing
    const funnyMessages = [
        "Persuading AI to work on weekends...",
        "Bribing the algorithms with virtual cookies...",
        "Teaching robots to understand your career choices...",
        "Asking ChatGPT if your resume passes the vibe check...",
        "Comparing your skills to what aliens would want...",
        "Calculating how many coffees your resume is worth...",
        "Determining if your resume could survive a zombie apocalypse...",
        "Checking if your resume would swipe right on this job...",
        "Translating your achievements to boss language...",
        "Measuring your resume against 17 others (they're losing, btw)...",
        "Judging your font choices silently...",
        "Converting corporate jargon to human speak...",
        "Scanning for hidden talents between the lines...",
        "Comparing your resume to your LinkedIn stalking habits..."
    ];

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        let messageTimer: ReturnType<typeof setTimeout>;

        if (isUploading) {
            setProgressPercent(0);
            timer = setInterval(() => {
                setProgressPercent(prev => Math.min(prev + 5, 90));
            }, 150);
        } else if (isAnalyzing) {
            setProgressPercent(90);
            timer = setInterval(() => {
                setProgressPercent(prev => {
                    const increment = Math.random() * 0.8;
                    return Math.min(prev + increment, 98);
                });
            }, 800);

            // Set initial funny message
            setFunnyText(funnyMessages[Math.floor(Math.random() * funnyMessages.length)]);

            // Change funny message every 4 seconds
            messageTimer = setInterval(() => {
                const randomIndex = Math.floor(Math.random() * funnyMessages.length);
                setFunnyText(funnyMessages[randomIndex]);
            }, 6000);
        }

        return () => {
            clearInterval(timer);
            if (messageTimer) clearInterval(messageTimer);
        };
    }, [isUploading, isAnalyzing]);

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
            ${isUploading || isAnalyzing ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white scale-110' : 'bg-slate-200'}`}>
                        <span className="text-sm font-bold">1</span>
                    </div>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all duration-300
            ${isAnalyzing ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white scale-110' : 'bg-slate-200'}`}>
                        <span className="text-sm font-bold">2</span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shadow-md">
                        <span className="text-sm font-bold">3</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center space-x-12">
                <div className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-3 transition-all duration-500
            ${isUploading ? 'bg-blue-100 scale-110' : isAnalyzing || progressPercent > 33 ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                        {isUploading ? (
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                                <Loader className="h-6 w-6 text-white animate-spin" />
                            </div>
                        ) : isAnalyzing || progressPercent > 33 ? (
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center">
                                <Check className="h-6 w-6 text-white" />
                            </div>
                        ) : (
                            <FileText className="h-8 w-8 text-slate-400" />
                        )}
                    </div>
                    <p className={`text-sm font-medium ${isUploading ? 'text-blue-600' : isAnalyzing || progressPercent > 33 ? 'text-emerald-600' : 'text-slate-400'}`}>
                        Extracting Text
                    </p>
                </div>

                <div className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-3 transition-all duration-500
            ${isAnalyzing ? 'bg-blue-100 scale-110' : progressPercent > 66 ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                        {isAnalyzing ? (
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                                <Loader className="h-6 w-6 text-white animate-spin" />
                            </div>
                        ) : progressPercent > 66 ? (
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center">
                                <Check className="h-6 w-6 text-white" />
                            </div>
                        ) : (
                            <FileText className="h-8 w-8 text-slate-400" />
                        )}
                    </div>
                    <p className={`text-sm font-medium ${isAnalyzing ? 'text-blue-600' : progressPercent > 66 ? 'text-emerald-600' : 'text-slate-400'}`}>
                        AI Analysis
                    </p>
                </div>

                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                        <FileText className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-400">Results Ready</p>
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
                            {(isUploading || isAnalyzing) && (
                                <div className="px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
                                    <span className="text-xs font-medium text-blue-600 flex items-center">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
                                        {isUploading ? 'Extracting...' : 'Analyzing...'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {isAnalyzing && (
                <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl shadow-sm">
                    <p className="text-sm italic text-indigo-600 flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full bg-indigo-400 mr-3 animate-pulse"></span>
                        {funnyText || 'Don\'t worry, your resume isn\'t actually being judged by fussy robots with monocles... or is it? 🤖👀'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProgressStatus; 