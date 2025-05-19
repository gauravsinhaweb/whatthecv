import React, { useState, useEffect } from 'react';
import { CheckCircle2, FileText, Loader2, Settings, Sparkles, Coffee, Brain, Bot } from 'lucide-react';
import { Progress } from '../ui/Progress';

// Custom CSS for animations
const animationStyles = `
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}
`;

interface EnhancingLoaderProps {
    stage: 'extracting' | 'enhancing' | 'finalizing';
}

const EnhancingLoader: React.FC<EnhancingLoaderProps> = ({ stage }) => {
    const [funnyMessageIndex, setFunnyMessageIndex] = useState(0);

    // Array of funny, sarcastic messages to display while processing
    const funnyMessages = [
        "Convincing AI that your resume isn't just fiction...",
        "Translating your job history from 'barely survived' to 'exceeded expectations'...",
        "Making your 3 months of Excel experience sound like you're a spreadsheet wizard...",
        "Calculating how many coffees it would take to actually do all skills you listed...",
        "Removing all instances of 'passionate, detail-oriented team player'...",
        "Converting your resume from 'rejection material' to 'interview worthy'...",
        "Replacing 'proficient in Microsoft Word' with actual skills...",
        "Adding enough buzzwords to impress even the most soulless HR bot...",
        "Strategically hiding all evidence of your imposter syndrome...",
        "Making your part-time dog sitting job sound like executive leadership...",
        "Searching for synonyms of 'responsible for' that sound less boring...",
        "Attempting to explain your six-month 'finding myself' gap year...",
        "Turning 'I watched someone else do it once' into 'extensive experience'...",
        "Convincing algorithms that you're worth more than minimum wage...",
        "Converting your gaming achievements into transferable corporate skills...",
        "Teaching AI to appreciate your unique 'organizational methodology' (aka chaos)...",
        "Negotiating with the algorithm to rate your skills higher than a 3/10...",
        "Politely removing the phrase 'familiar with' from your skills section...",
        "Transforming your LinkedIn lurking into 'industry research experience'...",
    ];

    // Messages specific to each stage
    const stageSpecificMessages = {
        extracting: [
            "Reading between the lines of your job descriptions...",
            "Extracting the truth from your slightly exaggerated skills section...",
            "Trying to understand how you fit 10 years of experience into 2 pages...",
            "Deciphering whether your references actually like you...",
            "Calculating your real GPA vs. the one you wrote down...",
            "Scanning for typos that spell check apparently missed...",
            "Counting how many times you used 'utilized' instead of 'used'...",
            "Verifying if those certifications are still valid or expired in 2015...",
            "Decoding what you actually meant by 'proficient in Python'...",
            "Determining if your entire resume is just a ChatGPT hallucination..."
        ],
        enhancing: [
            "Making you sound competent (our hardest job yet)...",
            "Translating 'I watched a YouTube tutorial' into 'proficient'...",
            "Adding corporate jargon that nobody understands but everyone respects...",
            "Turning your coffee-fetching internship into executive experience...",
            "Sprinkling in keywords that will confuse even you about your skills...",
            "Finding creative ways to hide that 2-year employment gap...",
            "Making your weekend hobby sound like professional qualification...",
            "Converting your Reddit moderator role into 'community leadership'...",
            "Applying the perfect amount of exaggeration without triggering HR alarms...",
            "Improving your resume without making even your mom question its authenticity..."
        ],
        finalizing: [
            "Checking if anyone will actually believe this version of you...",
            "Performing final reality distortion checks...",
            "Preparing you for inevitable interview questions about skills you don't have...",
            "Calculating percentage chance of getting past ATS systems...",
            "Inserting subliminal messages to hypnotize hiring managers...",
            "Checking if this resume violates any laws of physics or reality...",
            "Ensuring your salary expectations don't cause spontaneous laughter...",
            "Running final sanity check on your 'transferable skills' claims...",
            "Adding strategic white space to hide the fact that you lack experience...",
            "Creating a polished version of you that even you won't recognize..."
        ]
    };

    // Get stage-appropriate funny messages
    const getCurrentStageFunnyMessages = () => {
        return [
            ...funnyMessages,
            ...(stageSpecificMessages[stage] || [])
        ];
    };

    // Rotate through funny messages every 5 seconds
    useEffect(() => {
        const messages = getCurrentStageFunnyMessages();
        const interval = setInterval(() => {
            setFunnyMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [stage]);

    // Calculate progress percentage based on the stage
    const getProgress = (): number => {
        switch (stage) {
            case 'extracting':
                return 25;
            case 'enhancing':
                return 65;
            case 'finalizing':
                return 90;
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
            default:
                return '';
        }
    };

    // Get current funny message
    const getFunnyMessage = (): string => {
        const messages = getCurrentStageFunnyMessages();
        return messages[funnyMessageIndex];
    };

    // Random icon for funny message with more context awareness
    const FunnyIcon = () => {
        // Choose icons based on stage
        const stageIcons = {
            extracting: [FileText, Bot, Brain],
            enhancing: [Sparkles, Brain, Settings],
            finalizing: [Bot, Sparkles, Coffee]
        };

        // Get appropriate icons or fallback to default set
        const icons = stageIcons[stage] || [Coffee, Brain, Bot, Sparkles];

        // Get deterministic icon based on message content
        const messageHash = funnyMessageIndex % icons.length;
        const RandomIcon = icons[messageHash];

        return <RandomIcon className="h-4 w-4" />;
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
            {/* Include the animation styles */}
            <style>{animationStyles}</style>

            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white p-6">
                <h2 className="text-xl font-bold flex items-center">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Enhancing Your Resume
                </h2>
                <p className="text-blue-100 mt-1">
                    We're creating a professionally formatted resume with the information from your file
                </p>
            </div>

            <div className="p-6">
                <div className="space-y-8">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-sm font-medium text-slate-700">Overall Progress</div>
                            <div className="text-sm font-medium text-slate-700">{getProgress()}%</div>
                        </div>
                        <Progress
                            value={getProgress()}
                            className="h-2 bg-slate-100"
                            indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-500"
                        />
                    </div>

                    {/* Funny message banner */}
                    <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 rounded-lg border border-purple-200 p-4 flex items-center relative overflow-hidden">
                        {/* Background decorative elements */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-10">
                            <div className="absolute top-1/4 left-1/4 w-12 h-12 rounded-full bg-purple-400 blur-xl"></div>
                            <div className="absolute bottom-1/4 right-1/4 w-16 h-16 rounded-full bg-pink-400 blur-xl"></div>
                        </div>

                        <div className="bg-white/60 backdrop-blur-sm rounded-full p-1.5 mr-3 animate-pulse">
                            <FunnyIcon />
                        </div>

                        <div className="relative overflow-hidden flex-1">
                            <div className="relative h-5">
                                <p
                                    key={funnyMessageIndex} // Add key to force re-render and animation
                                    className="text-sm text-purple-800 font-medium absolute inset-0 animate-fadeIn"
                                >
                                    {getFunnyMessage()}
                                </p>
                            </div>
                            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-purple-200 to-transparent mt-1.5 opacity-70"></div>
                        </div>
                    </div>

                    <div className="space-y-5">
                        {/* Extracting Stage */}
                        <div className="flex items-start">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${stage === 'extracting'
                                ? 'bg-blue-100 text-blue-600'
                                : stage === 'enhancing' || stage === 'finalizing'
                                    ? 'bg-emerald-100 text-emerald-600'
                                    : 'bg-slate-100 text-slate-400'
                                }`}>
                                {stage === 'extracting' ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : stage === 'enhancing' || stage === 'finalizing' ? (
                                    <CheckCircle2 className="h-5 w-5" />
                                ) : (
                                    <FileText className="h-5 w-5" />
                                )}
                            </div>
                            <div className="ml-4 flex-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-slate-800">Extracting Resume Information</h3>
                                    {(stage === 'enhancing' || stage === 'finalizing') && (
                                        <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full">Completed</span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Analyzing your resume structure and content</p>

                                {stage === 'extracting' && (
                                    <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded-md flex items-center">
                                        <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                                        {getDetailMessage()}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Enhancing Stage */}
                        <div className="flex items-start">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${stage === 'enhancing'
                                ? 'bg-blue-100 text-blue-600'
                                : stage === 'finalizing'
                                    ? 'bg-emerald-100 text-emerald-600'
                                    : 'bg-slate-100 text-slate-400'
                                }`}>
                                {stage === 'enhancing' ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : stage === 'finalizing' ? (
                                    <CheckCircle2 className="h-5 w-5" />
                                ) : (
                                    <Settings className="h-5 w-5" />
                                )}
                            </div>
                            <div className="ml-4 flex-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-slate-800">AI Enhancement</h3>
                                    {stage === 'finalizing' && (
                                        <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full">Completed</span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Improving content quality and formatting</p>

                                {stage === 'enhancing' && (
                                    <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded-md flex items-center">
                                        <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                                        {getDetailMessage()}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Finalizing Stage */}
                        <div className="flex items-start">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${stage === 'finalizing'
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-slate-100 text-slate-400'
                                }`}>
                                {stage === 'finalizing' ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Sparkles className="h-5 w-5" />
                                )}
                            </div>
                            <div className="ml-4 flex-1">
                                <h3 className="text-sm font-medium text-slate-800">Finalizing Resume</h3>
                                <p className="text-xs text-slate-500 mt-1">Preparing your resume for editing</p>

                                {stage === 'finalizing' && (
                                    <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded-md flex items-center">
                                        <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                                        {getDetailMessage()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 border-t border-slate-200 bg-slate-50">
                <div className="flex items-center text-slate-600">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <p className="text-sm">{getMessage()}</p>
                </div>
            </div>
        </div>
    );
};

export default EnhancingLoader; 