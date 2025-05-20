import { Check, FileText, Loader, ScanSearch, Brain, Coffee, Bot, Sparkles, Rocket, AlertCircle, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Custom CSS for animations
const animationStyles = `
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

@keyframes shimmer {
  0% { background-position: -100% 0; }
  100% { background-position: 200% 0; }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-shimmer {
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

.animate-spin-slow {
  animation: spin 3s linear infinite;
}
`;

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
    const [funnyMessageIndex, setFunnyMessageIndex] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [pulseAnimation, setPulseAnimation] = useState(false);

    // Combine all messages since we're not showing specific stages
    const funnyMessages = [
        "Convincing AI that your resume isn't just fiction...",
        "Evaluating how many employers will actually believe this...",
        "Translating 'I once saw Excel' to 'Advanced spreadsheet proficiency'...",
        "Calculating how many coffees this job will require...",
        "Searching for evidence you're not just a well-trained parrot...",
        "Optimizing buzzwords to maximum eye-roll threshold...",
        "Detecting questionable achievements that defy physics...",
        "Removing unnecessary uses of 'synergy' and 'leverage'...",
        "Computing your actual skill level vs. what you claimed...",
        "Checking if this is actually a resume or your grocery list...",
        "Making sure you didn't upload your dating profile by accident...",
        "Confirming this isn't just Lorem Ipsum with your name on it...",
        "Teaching AI to understand why 'Sandwich Artist' isn't executive experience...",
        "Filtering out emojis you sneakily added to your bullet points...",
        "Making your references sound like they actually remember you...",
        "Calculating the probability that someone will hire you...",
        "Creating an alternative reality where your skills are impressive...",
        "Converting your 'extensive travel' into legitimate cultural awareness...",
        "Translating your gaming achievements into corporate leadership qualities...",
        "Making 'managed a Twitter account' sound like social media expertise...",
        "Adding the perfect amount of corporate buzzwords...",
        "Determining the optimal ratio of fluff to substance...",
        "Scanning for traces of ChatGPT hallucinations...",
        "Finding creative ways to explain that 6-month 'sabbatical'...",
        "Converting coffee consumption into productive work hours..."
    ];

    // Get current funny message
    const getCurrentFunnyMessage = () => {
        return funnyMessages[funnyMessageIndex % funnyMessages.length];
    };

    // Get funny status based on elapsed time
    const getFunnyStatus = () => {
        const statuses = [
            "AI Magic: In Progress",
            "Caffeine Required: High",
            "Resume Embellishment Index: Calculating...",
            "Job Prospect Forecast: Partly Cloudy",
            "HR Bot Confusion Level: Extreme",
            "Pattern Recognition: Active",
            "Neural Network: Caffeinated",
            "Resume Enhancement: Loading..."
        ];
        return statuses[Math.floor(elapsedTime / 5) % statuses.length];
    };

    // Random icon for message display
    const FunnyIcon = () => {
        const icons = [Coffee, Brain, Bot, Sparkles, Rocket, Zap, FileText];
        const RandomIcon = icons[funnyMessageIndex % icons.length];
        return <RandomIcon className="h-4 w-4" />;
    };

    useEffect(() => {
        let targetPercent = 0;

        // Simplified progress calculation without revealing actual steps
        if (isCheckingResume) {
            targetPercent = 30;
        } else if (isUploading) {
            targetPercent = 65;
        } else if (isAnalyzing) {
            targetPercent = 95;
        }

        const interval = setInterval(() => {
            setProgressPercent(prev => {
                if (prev < targetPercent) {
                    return Math.min(prev + 1, targetPercent);
                }
                return prev;
            });
        }, 100);

        return () => {
            clearInterval(interval);
        };
    }, [isUploading, isAnalyzing, isCheckingResume]);

    // Trigger pulse animation when stage changes
    useEffect(() => {
        setPulseAnimation(true);
        const timer = setTimeout(() => setPulseAnimation(false), 2500);
        return () => clearTimeout(timer);
    }, [isCheckingResume, isUploading, isAnalyzing]);

    // Change funny message every 5 seconds
    useEffect(() => {
        const messageInterval = setInterval(() => {
            setFunnyMessageIndex(prev => prev + 1);
        }, 5000);

        const timeInterval = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);

        return () => {
            clearInterval(messageInterval);
            clearInterval(timeInterval);
        };
    }, []);

    return (
        <div className="w-full space-y-6">
            {/* Include the animation styles */}
            <style>{animationStyles}</style>

            {/* Modern Progress Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Analyzing Your Resume</h3>
                                <p className="text-sm text-blue-100">Our AI is working its magic on your document</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-blue-100">Time elapsed</div>
                            <div className="text-xl font-bold">{elapsedTime}s</div>
                        </div>
                    </div>
                </div>

                {/* Progress Visualization */}
                <div className="p-5">
                    {/* Circular progress */}
                    <div className="flex justify-center mb-6">
                        <div className="relative w-24 h-24">
                            {/* Background circle */}
                            <div className="w-full h-full rounded-full border-8 border-slate-100"></div>

                            {/* Progress arc - using SVG for proper circular progress */}
                            <svg className="absolute top-0 left-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle
                                    cx="50" cy="50" r="42"
                                    fill="none"
                                    strokeWidth="8"
                                    stroke="url(#gradient)"
                                    strokeDasharray={`${progressPercent * 2.64} 264`}
                                    strokeLinecap="round"
                                    className="transition-all duration-500"
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#3B82F6" />
                                        <stop offset="100%" stopColor="#8B5CF6" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            {/* Percentage text */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <span className="text-2xl font-bold text-indigo-600">{progressPercent}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced funny message banner */}
                    <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl border border-indigo-200 overflow-hidden shadow-sm mb-5">
                        {/* Background decorative elements */}
                        <div className="absolute inset-0 overflow-hidden opacity-10">
                            <div className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-indigo-400 blur-xl"></div>
                            <div className="absolute bottom-1/3 right-1/4 w-20 h-20 rounded-full bg-purple-400 blur-xl"></div>
                            <div className="absolute bottom-1/4 left-1/3 w-12 h-12 rounded-full bg-pink-400 blur-xl"></div>
                        </div>

                        {/* Status bar */}
                        <div className="w-full px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 flex justify-between items-center border-b border-indigo-100">
                            <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse mr-2"></div>
                                <span className="text-xs font-medium text-indigo-700">{getFunnyStatus()}</span>
                            </div>
                        </div>

                        {/* Message content */}
                        <div className="p-4 flex items-start relative">
                            <div className="bg-white/60 backdrop-blur-sm rounded-full p-2 mr-3 flex-shrink-0 shadow-sm animate-float">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center">
                                    <FunnyIcon />
                                </div>
                            </div>

                            <div className="relative overflow-hidden flex-1">
                                <div className="relative min-h-[1.25rem]">
                                    <p
                                        key={funnyMessageIndex}
                                        className="text-sm text-indigo-800 font-medium animate-fadeIn"
                                    >
                                        {getCurrentFunnyMessage()}
                                    </p>
                                </div>

                                <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-indigo-200 to-transparent mt-2 opacity-70 animate-shimmer"></div>
                            </div>
                        </div>
                    </div>

                    {/* File display card */}
                    {file && (
                        <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                            <div className="p-3 bg-white rounded-lg border border-blue-200 shadow-sm mr-3">
                                <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-slate-800 truncate">{file.name}</div>
                                <div className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                            </div>
                            <div className="ml-3">
                                <div className="text-xs px-2 py-1 bg-indigo-100 rounded-full border border-indigo-200 text-indigo-700 font-medium flex items-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1.5 animate-pulse"></div>
                                    Processing
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Visual animation elements */}
                    <div className="mt-5 h-16 relative overflow-hidden">
                        <div className="absolute inset-0 flex justify-around">
                            {[...Array(5)].map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 
                                               opacity-${30 + (index * 10)} animate-float`}
                                    style={{
                                        animationDelay: `${index * 0.7}s`,
                                        transform: `translateY(${Math.sin(index) * 10}px)`
                                    }}
                                >
                                    <div className="w-full h-full flex items-center justify-center">
                                        {index % 2 === 0 ? (
                                            <Sparkles className="h-4 w-4 text-white animate-pulse" />
                                        ) : (
                                            <Brain className="h-4 w-4 text-white" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer message */}
                <div className="p-4 border-t border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50 text-center">
                    <p className="text-sm text-slate-700">
                        <span className="font-medium">AI-powered analysis in progress.</span>{' '}
                        <span className="text-slate-500">This may take a few moments.</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProgressStatus; 