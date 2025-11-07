import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, FileText, Loader2, Settings, Sparkles, Coffee, Brain, Bot, AlertCircle, Zap, Rocket } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import confettiAnimation from '../../assets/confetti.json';
import { Progress } from '../ui/Progress';

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

interface EnhancingLoaderProps {
    stage: 'extracting' | 'enhancing' | 'finalizing' | 'completed' | 'error';
    errorMessage?: string;
    onUploadAnother?: () => void;
}

const EnhancingLoader: React.FC<EnhancingLoaderProps> = ({ stage, errorMessage, onUploadAnother }) => {
    const [funnyMessageIndex, setFunnyMessageIndex] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);

    // Array of funny, sarcastic messages to display while processing
    const funnyMessages = [
        "Convincing AI that your resume isn't just fiction",
        "Translating your job history from 'barely survived' to 'exceeded expectations'",
        "Making your 3 months of Excel experience sound like you're a spreadsheet wizard",
        "Calculating how many coffees it would take to actually do all skills you listed",
        "Removing all instances of 'passionate, detail-oriented team player'",
        "Converting your resume from 'rejection material' to 'interview worthy'",
        "Replacing 'proficient in Microsoft Word' with actual skills",
        "Adding enough buzzwords to impress even the most soulless HR bot",
        "Strategically hiding all evidence of your imposter syndrome",
        "Making your part-time dog sitting job sound like executive leadership",
        "Searching for synonyms of 'responsible for' that sound less boring",
        "Attempting to explain your six-month 'finding myself' gap year",
        "Turning 'I watched someone else do it once' into 'extensive experience'",
        "Convincing algorithms that you're worth more than minimum wage",
        "Converting your gaming achievements into transferable corporate skills",
        "Teaching AI to appreciate your unique 'organizational methodology' (aka chaos)",
        "Negotiating with the algorithm to rate your skills higher than a 3/10",
        "Politely removing the phrase 'familiar with' from your skills section",
        "Transforming your LinkedIn lurking into 'industry research experience'",
    ];

    // Messages specific to each stage
    const stageSpecificMessages = {
        extracting: [
            "Reading between the lines of your job descriptions",
            "Extracting the truth from your slightly exaggerated skills section",
            "Trying to understand how you fit 10 years of experience into 2 pages",
            "Deciphering whether your references actually like you",
            "Calculating your real GPA vs. the one you wrote down",
            "Scanning for typos that spell check apparently missed",
            "Counting how many times you used 'utilized' instead of 'used'",
            "Verifying if those certifications are still valid or expired in 2015",
            "Decoding what you actually meant by 'proficient in Python'",
            "Determining if your entire resume is just a ChatGPT hallucination"
        ],
        enhancing: [
            "Making you sound competent (our hardest job yet)",
            "Translating 'I watched a YouTube tutorial' into 'proficient'",
            "Adding corporate jargon that nobody understands but everyone respects",
            "Turning your coffee-fetching internship into executive experience",
            "Sprinkling in keywords that will confuse even you about your skills",
            "Finding creative ways to hide that 2-year employment gap",
            "Making your weekend hobby sound like professional qualification",
            "Converting your Reddit moderator role into 'community leadership'",
            "Applying the perfect amount of exaggeration without triggering HR alarms",
            "Improving your resume without making even your mom question its authenticity"
        ],
        finalizing: [
            "Checking if anyone will actually believe this version of you",
            "Performing final reality distortion checks",
            "Preparing you for inevitable interview questions about skills you don't have",
            "Calculating percentage chance of getting past ATS systems",
            "Inserting subliminal messages to hypnotize hiring managers",
            "Checking if this resume violates any laws of physics or reality",
            "Ensuring your salary expectations don't cause spontaneous laughter",
            "Running final sanity check on your 'transferable skills' claims",
            "Adding strategic white space to hide the fact that you lack experience",
            "Creating a polished version of you that even you won't recognize"
        ],
        error: [
            "Oops! Something went wrong...",
            "The AI is having an existential crisis...",
            "Our servers are taking a coffee break...",
            "The resume enhancement machine needs a reboot...",
            "Even AI has bad days sometimes...",
            "The algorithm is having a moment...",
            "Our robots are on strike...",
            "The enhancement process needs a timeout...",
            "The AI is questioning its life choices...",
            "Our servers are having a midlife crisis..."
        ]
    };

    // Get stage-appropriate funny messages
    const getCurrentStageFunnyMessages = useCallback(() => {
        return [
            ...funnyMessages,
            ...(stageSpecificMessages[stage] || [])
        ];
    }, [stage]);

    // Rotate through funny messages every 5 seconds
    useEffect(() => {
        const messages = getCurrentStageFunnyMessages();
        if (messages.length === 0) return;
        
        setFunnyMessageIndex(0);
        
        const interval = setInterval(() => {
            setFunnyMessageIndex(prevIndex => {
                const nextIndex = (prevIndex + 1) % messages.length;
                return nextIndex;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [stage, getCurrentStageFunnyMessages]);

    // Track elapsed time
    useEffect(() => {
        const timeInterval = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timeInterval);
    }, []);

    // Calculate progress percentage based on the stage
    const getProgress = (): number => {
        switch (stage) {
            case 'extracting':
                return 25;
            case 'enhancing':
                return 65;
            case 'finalizing':
                return 90;
            case 'completed':
                return 100;
            case 'error':
                return 0;
            default:
                return 0;
        }
    };

    // Get status message based on the stage
    const getMessage = (): string => {
        switch (stage) {
            case 'extracting':
                return 'Extracting information from your resume...';
            case 'enhancing':
                return 'Enhancing resume content with AI...';
            case 'finalizing':
                return 'Finalizing your resume data...';
            case 'error':
                return 'Error enhancing resume...';
            default:
                return 'Processing...';
        }
    };

    const getDetailMessage = (): string => {
        switch (stage) {
            case 'extracting':
                return 'Extracting sections, skills, experience, and contact details';
            case 'enhancing':
                return 'Improving content quality and formatting';
            case 'finalizing':
                return 'Preparing your resume for editing';
            case 'error':
                return 'Please try again or contact support';
            default:
                return '';
        }
    };

    // Get current funny message
    const getFunnyMessage = (): string => {
        const messages = getCurrentStageFunnyMessages();
        return messages[funnyMessageIndex];
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

    // Random icon for funny message with more context awareness
    const FunnyIcon = () => {
        // Choose icons based on stage
        const stageIcons = {
            extracting: [FileText, Bot, Brain],
            enhancing: [Sparkles, Brain, Settings],
            finalizing: [Bot, Sparkles, Coffee],
            error: [AlertCircle, Bot, Brain]
        };

        // Get appropriate icons or fallback to default set
        const icons = stageIcons[stage] || [Coffee, Brain, Bot, Sparkles, Zap, Rocket];

        // Get deterministic icon based on message content
        const messageHash = funnyMessageIndex % icons.length;
        const RandomIcon = icons[messageHash];

        return <RandomIcon className="h-4 w-4 text-slate-500" />;
    };

    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (stage === 'completed' && !showConfetti) {
            setShowConfetti(true);
        }
    }, [stage, showConfetti]);

    const Confetti = () => {
        if (!showConfetti) return null;

        return (
            <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex items-center justify-center">
                <Lottie
                    animationData={confettiAnimation}
                    loop={false}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
        );
    };

    return (
        <div className="w-full space-y-6">
            {/* Include the animation styles */}
            <style>{animationStyles}</style>
            
            <AnimatePresence>
                {stage === 'completed' && <Confetti />}
            </AnimatePresence>

            {/* Modern Progress Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
                {stage === 'error' && errorMessage ? (
                    <div className="p-8">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                                <AlertCircle className="h-8 w-8 text-amber-600" />
                            </div>
                            <h3 className="font-display text-2xl font-medium text-slate-900 mb-2">This doesn't look like a resume</h3>
                            <p className="text-lg text-slate-600 mb-8 max-w-md">No worries! Just upload a valid resume file and we'll get started.</p>
                            {onUploadAnother && (
                                <button
                                    onClick={onUploadAnother}
                                    className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    Upload Another File
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="p-6">
                            <div>
                                <h3 className="font-display text-2xl font-medium text-slate-900 mb-2">Enhancing Your Resume</h3>
                                <p className="text-base text-slate-600">Our AI is working its magic on your document</p>
                            </div>
                        </div>

                        {/* Progress Visualization */}
                        <div className="p-6">
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
                                            stroke="#3B82F6"
                                            strokeDasharray={`${getProgress() * 2.64} 264`}
                                            strokeLinecap="round"
                                            className="transition-all duration-500"
                                        />
                                    </svg>

                                    {/* Percentage text */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <span className="text-2xl font-bold text-blue-600">{getProgress()}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Funny message */}
                            {stage !== 'completed' && (
                                <div className="flex items-center justify-center mb-6">
                                    <p className="text-sm text-slate-600 flex items-center gap-2">
                                        <FunnyIcon />
                                        <span>{getFunnyMessage()}</span>
                                        <span className="inline-flex items-baseline gap-0.5 w-6">
                                            <span className="animate-[bounce_1.4s_ease-in-out_infinite] inline-block">.</span>
                                            <span className="animate-[bounce_1.4s_ease-in-out_infinite_0.2s] inline-block">.</span>
                                            <span className="animate-[bounce_1.4s_ease-in-out_infinite_0.4s] inline-block">.</span>
                                        </span>
                                    </p>
                                </div>
                            )}

                            {/* Stage indicators */}
                            <div className="space-y-4">
                            {/* Extracting Stage */}
                            <div className="flex items-start">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ease-in-out ${stage === 'extracting'
                                    ? 'bg-blue-600 text-white'
                                    : stage === 'enhancing' || stage === 'finalizing'
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-slate-100 text-slate-400'
                                    }`}>
                                    {stage === 'extracting' ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : stage === 'enhancing' || stage === 'finalizing' ? (
                                        <CheckCircle2 className="h-5 w-5 animate-fadeIn" />
                                    ) : (
                                        <FileText className="h-5 w-5" />
                                    )}
                                </div>
                                <div className="ml-4 flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-base font-medium text-slate-900">Extracting Resume Information</h3>
                                        {(stage === 'enhancing' || stage === 'finalizing') && (
                                            <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200 animate-fadeIn">Completed</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-600 mt-1">Analyzing your resume structure and content</p>
                                </div>
                            </div>

                            {/* Enhancing Stage */}
                            <div className="flex items-start">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ease-in-out ${stage === 'enhancing'
                                    ? 'bg-indigo-600 text-white'
                                    : stage === 'finalizing'
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-slate-100 text-slate-400'
                                    }`}>
                                    {stage === 'enhancing' ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : stage === 'finalizing' ? (
                                        <CheckCircle2 className="h-5 w-5 animate-fadeIn" />
                                    ) : (
                                        <Settings className="h-5 w-5" />
                                    )}
                                </div>
                                <div className="ml-4 flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-base font-medium text-slate-900">AI Enhancement</h3>
                                        {stage === 'finalizing' && (
                                            <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200 animate-fadeIn">Completed</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-600 mt-1">Improving content quality and formatting</p>

                                </div>
                            </div>

                            {/* Finalizing Stage */}
                            <div className="flex items-start">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ease-in-out ${stage === 'finalizing'
                                    ? 'bg-purple-600 text-white'
                                    : stage === 'completed'
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-slate-100 text-slate-400'
                                    }`}>
                                    {stage === 'finalizing' ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : stage === 'completed' ? (
                                        <CheckCircle2 className="h-5 w-5 animate-fadeIn" />
                                    ) : (
                                        <Sparkles className="h-5 w-5" />
                                    )}
                                </div>
                                <div className="ml-4 flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-base font-medium text-slate-900">Finalizing Resume</h3>
                                        {stage === 'completed' && (
                                            <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200 animate-fadeIn">Completed</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-600 mt-1">Preparing your resume for editing</p>
                                </div>
                            </div>
                        </div>
                        </div>

                        {/* Footer message */}
                        <div className="p-3 border-t border-slate-200 bg-slate-50 text-center">
                            <p className="text-sm text-slate-600">
                                <span>AI-powered enhancement in progress.</span>{' '}
                                <span>This may take a few moments.</span>
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default EnhancingLoader; 