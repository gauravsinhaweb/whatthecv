import { AlertCircle, Award, BarChart2, Check, Clock, FileText, KeyRound, Layers, Loader2, Plus, Target, Wand2, ChevronUp, ChevronDown, Sparkles, Lightbulb, Rocket, Zap, ArrowUpRight, Stars, Palette } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnalysisCategory, performDetailedAnalysis } from '../../services/analysisService';
import { useResumeStore } from '../../store/resumeStore';
import { enhanceResumeFromFile } from '../../utils/resumeService';
import { Badge } from '../ui/Badge';
import Button from '../ui/Button';
import { Progress } from '../ui/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import EnhancingLoader from './EnhancingLoader';

interface AnalysisDashboardProps {
    analysisResult: any;
    extractedText: string;
    file: File | null;
    clearFile: () => void;
}

type AnalysisTab = 'overview' | 'format' | 'content' | 'keywords' | 'improvement';

interface CategoryAnalysis {
    score: number | null;
    details: string[];
    isLoading: boolean;
}

type EnhancementStage = 'extracting' | 'enhancing' | 'finalizing' | 'error';

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
    analysisResult,
    extractedText,
    file,
    clearFile
}) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<AnalysisTab>('overview');
    const [analysisData, setAnalysisData] = useState<Record<AnalysisCategory, CategoryAnalysis>>({
        format: { score: null, details: [], isLoading: false },
        content: { score: null, details: [], isLoading: false },
        tailoring: { score: null, details: [], isLoading: false },
        sections: { score: null, details: [], isLoading: false }
    });
    const [expandedSuggestions, setExpandedSuggestions] = useState<string[]>([]);
    const [goodPoints, setGoodPoints] = useState<string[]>([]);
    const [improvementPoints, setImprovementPoints] = useState<string[]>([]);

    // Use Zustand store instead of local state
    const {
        isEnhancing,
        setIsEnhancing,
        enhancementStage,
        setEnhancementStage,
        setEnhancedResumeData
    } = useResumeStore();

    // Start all analyses when component mounts
    useEffect(() => {
        runAllAnalyses();
    }, []);

    const runAllAnalyses = async () => {
        const analysisOrder: AnalysisCategory[] = ['format', 'content', 'tailoring', 'sections'];

        try {
            for (const category of analysisOrder) {
                await runAnalysis(category);
            }
        } catch (error) {
            console.error('Error in analysis sequence:', error);
        }
    };

    const runAnalysis = async (category: AnalysisCategory) => {
        if (analysisData[category].isLoading || analysisData[category].score !== null) {
            return null;
        }

        setAnalysisData(prev => ({
            ...prev,
            [category]: { ...prev[category], isLoading: true }
        }));

        try {
            const result = await performDetailedAnalysis(category, extractedText);

            setAnalysisData(prev => ({
                ...prev,
                [category]: {
                    score: result.score,
                    details: result.details,
                    isLoading: false
                }
            }));

            // Process details to categorize good points and improvements
            if (result.details && result.details.length > 0) {
                const good = result.details.filter((detail: string) =>
                    detail.includes("Good") ||
                    detail.includes("Excellent") ||
                    detail.includes("Well") ||
                    detail.toLowerCase().includes("present"));

                const improvements = result.details.filter((detail: string) =>
                    detail.includes("Missing") ||
                    detail.includes("Issue") ||
                    detail.includes("Add") ||
                    detail.includes("Improve") ||
                    detail.includes("Consider"));

                if (good.length > 0) {
                    setGoodPoints(prev => [...prev, ...good]);
                }

                if (improvements.length > 0) {
                    setImprovementPoints(prev => [...prev, ...improvements]);
                }
            }

            return result;
        } catch (error) {
            console.error(`Error analyzing ${category}:`, error);
            setAnalysisData(prev => ({
                ...prev,
                [category]: { ...prev[category], isLoading: false }
            }));
            throw error;
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-600';
        if (score >= 60) return 'text-amber-600';
        return 'text-blue-600';
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 80) return 'bg-emerald-100';
        if (score >= 60) return 'bg-amber-100';
        return 'bg-blue-100';
    };

    const getScoreGradient = (score: number) => {
        if (score >= 80) return 'from-emerald-500 to-emerald-600';
        if (score >= 60) return 'from-amber-500 to-amber-600';
        return 'from-blue-500 to-blue-600';
    };

    const getScoreMessage = (score: number) => {
        if (score >= 80) return 'Great! Your resume is well-optimized for ATS systems.';
        if (score >= 60) return 'Your resume has potential. A few tweaks will make it even better!';
        return 'With a few improvements, your resume will shine brighter!';
    };

    const getOverallScore = () => {
        const validScores = Object.values(analysisData)
            .map(item => item.score)
            .filter((score): score is number => score !== null);

        if (validScores.length === 0) return analysisResult.score;

        return analysisResult.score;

    };

    const toggleSuggestion = (section: string) => {
        setExpandedSuggestions(prev =>
            prev.includes(section)
                ? prev.filter(s => s !== section)
                : [...prev, section]
        );
    };

    const renderScoreMeter = (score: number, size: 'sm' | 'md' | 'lg' = 'md') => {
        const dimensions = {
            sm: 'w-16 h-16',
            md: 'w-24 h-24',
            lg: 'w-36 h-36'
        };

        const textSizes = {
            sm: 'text-2xl',
            md: 'text-3xl',
            lg: 'text-5xl'
        };

        return (
            <div className={`relative ${dimensions[size]} flex items-center justify-center`}>
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#E2E8F0"
                        strokeWidth="10"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={getScoreGradient(score)}
                        strokeWidth="10"
                        strokeDasharray={`${score * 2.83} 283`}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-in-out"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`${textSizes[size]} font-bold ${getScoreColor(score)}`}>{score}</span>
                </div>
            </div>
        );
    };

    const handleEnhanceResume = async () => {
        if (!file || isEnhancing) return;

        setIsEnhancing(true);
        setEnhancementStage('extracting');
        let errorMessage = '';

        try {
            // Add a small delay to show the different stages for better UX
            await new Promise(resolve => setTimeout(resolve, 1000));
            setEnhancementStage('enhancing');

            // Use the file directly instead of the extracted text
            const result = await enhanceResumeFromFile(file);

            // Validate the enhanced data
            const validationErrors = [];

            if (!result.personalInfo || !result.personalInfo.name) {
                validationErrors.push('Personal information is incomplete');
            }

            if (!result.workExperience || result.workExperience.length === 0) {
                validationErrors.push('No work experience found');
            }

            if (!result.skills || result.skills.length === 0) {
                validationErrors.push('No skills identified');
            }

            if (validationErrors.length > 0) {
                console.warn('Validation warnings:', validationErrors);
                errorMessage = validationErrors.join(', ');
                setEnhancementStage('error');
                throw new Error(errorMessage);
            }

            setEnhancementStage('finalizing');

            // Save enhanced resume data to Zustand store
            setEnhancedResumeData(result);

            // Add a small delay before navigation for better UX
            await new Promise(resolve => setTimeout(resolve, 800));

            // Navigate to create-resume route
            navigate('/create-resume');
        } catch (error) {
            console.error('Error enhancing resume:', error);
            setEnhancementStage('error');

            // Handle specific error cases
            if (error instanceof Error) {
                if (error.message.includes('cancelled') || error.message.includes('aborted')) {
                    errorMessage = 'The enhancement process was interrupted. Please try again.';
                } else if (error.message.includes('timed out')) {
                    errorMessage = 'The request took too long. Please try again with a smaller file.';
                } else if (error.message.includes('File size too large')) {
                    errorMessage = 'The file is too large. Please upload a smaller file (max 10MB).';
                } else if (error.message.includes('Unsupported file type')) {
                    errorMessage = 'Please upload a PDF, DOCX, or TXT file.';
                } else {
                    errorMessage = error.message;
                }
            } else {
                errorMessage = 'Failed to enhance resume. Please try again.';
            }

            // Reset states after error
            setTimeout(() => {
                setIsEnhancing(false);
                setEnhancementStage('extracting');
            }, 2000);
        } finally {
            if (!errorMessage) {
                setIsEnhancing(false);
            }
        }
    };

    const renderFileActions = () => (
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-xl shadow-md overflow-hidden">
            <div className="p-5 text-white border-b border-white/20">
                <h3 className="text-xl font-bold flex items-center">
                    <Rocket className="h-6 w-6 mr-2" />
                    Create Your Perfect Resume in One Click
                </h3>
                <p className="text-blue-100 mt-1">
                    Transform your resume into an ATS-optimized document that will impress recruiters
                </p>
            </div>

            <div className="p-5 bg-white">
                <div className="flex flex-col md:flex-row items-center md:justify-between gap-5">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="font-medium text-sm text-slate-700 truncate">
                                {file?.name || "Resume file"}
                            </p>
                            <p className="text-xs text-slate-500">
                                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB · ${file.type || "Document"}` : "No file selected"}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={clearFile}
                            className="border-slate-300 text-slate-700 hover:bg-slate-100 flex-1 md:flex-auto"
                        >
                            Upload Another
                        </Button>
                        <Button
                            size="lg"
                            onClick={handleEnhanceResume}
                            disabled={isEnhancing}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg flex-1 md:flex-auto md:min-w-[200px] relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                            {isEnhancing ? (
                                <div className="flex items-center">
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    <span className="font-medium">Processing...</span>
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <Sparkles className="h-5 w-5 mr-2" />
                                    <span className="font-medium">Create My Resume</span>
                                </div>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="px-5 py-3 bg-blue-50 flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center space-x-1">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs text-slate-600">ATS-optimized template</span>
                </div>
                <div className="flex items-center space-x-1">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs text-slate-600">Professional formatting</span>
                </div>
                <div className="flex items-center space-x-1">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs text-slate-600">Immediate results</span>
                </div>
            </div>
        </div>
    );

    const renderOverviewTab = () => (
        <div className="space-y-6 animate-fadeIn">
            {/* Score Card */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    {/* Left side - Main score */}
                    <div className="flex flex-col md:flex-row items-center gap-3 sm:gap-5">
                        <div className={`relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full flex items-center justify-center ${getOverallScore() >= 80 ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' :
                            getOverallScore() >= 60 ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                                'bg-gradient-to-br from-blue-400 to-blue-600'
                            } p-1 shadow-lg transition-all duration-300`}>
                            <div className="absolute inset-1 bg-white rounded-full"></div>
                            <div className="relative flex flex-col items-center justify-center">
                                <span className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold ${getScoreColor(getOverallScore())}`}>
                                    {getOverallScore()}
                                </span>
                                <span className={`text-[10px] sm:text-xs md:text-sm font-medium ${getScoreColor(getOverallScore())}`}>
                                    Overall Score
                                </span>
                            </div>
                        </div>

                        <div className="text-center md:text-left flex-1">
                            <div className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-1 sm:mb-2
                                ${getOverallScore() >= 80 ? 'bg-emerald-100 text-emerald-700' :
                                    getOverallScore() >= 60 ? 'bg-amber-100 text-amber-700' :
                                        'bg-blue-100 text-blue-700'}`}>
                                {getOverallScore() >= 80 ? 'Excellent' :
                                    getOverallScore() >= 60 ? 'Needs Improvement' :
                                        'Room to Grow'}
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 max-w-xs">
                                {getOverallScore() >= 80
                                    ? 'Your resume is well-optimized for ATS systems!'
                                    : getOverallScore() >= 60
                                        ? 'A few targeted improvements will boost your resume.'
                                        : 'Focus on these key areas to strengthen your resume.'}
                            </p>
                        </div>
                    </div>

                    {/* Right side - Key metrics */}
                    <div className="grid grid-cols-3 gap-3 w-full md:w-auto md:min-w-[350px]">
                        {analysisResult.ats_score !== undefined && (
                            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg border border-blue-100 p-3 flex flex-col items-center">
                                <div className="text-blue-700 text-xs uppercase font-medium mb-1">ATS</div>
                                <div className="text-2xl font-bold text-blue-600">{analysisResult.ats_score}%</div>
                            </div>
                        )}

                        {analysisResult.content_score !== undefined && (
                            <div className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-lg border border-purple-100 p-3 flex flex-col items-center">
                                <div className="text-purple-700 text-xs uppercase font-medium mb-1">Content</div>
                                <div className="text-2xl font-bold text-purple-600">{analysisResult.content_score}%</div>
                            </div>
                        )}

                        {analysisResult.format_score !== undefined && (
                            <div className="bg-gradient-to-br from-slate-50 to-emerald-50 rounded-lg border border-emerald-100 p-3 flex flex-col items-center">
                                <div className="text-emerald-700 text-xs uppercase font-medium mb-1">Format</div>
                                <div className="text-2xl font-bold text-emerald-600">{analysisResult.format_score}%</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Key Priorities Section */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center mb-4">
                    <Rocket className="h-5 w-5 text-blue-500 mr-2" />
                    Key Priorities
                </h3>

                {analysisResult.suggestions && analysisResult.suggestions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysisResult.suggestions.slice(0, 4).map((suggestion: any, index: number) => (
                            <div key={index} className="flex items-start p-3 rounded-lg bg-gradient-to-r from-slate-50 to-blue-50 border border-blue-100">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${index % 4 === 0 ? 'bg-blue-100 text-blue-600' :
                                    index % 4 === 1 ? 'bg-purple-100 text-purple-600' :
                                        index % 4 === 2 ? 'bg-emerald-100 text-emerald-600' :
                                            'bg-amber-100 text-amber-600'
                                    }`}>
                                    <Sparkles className="h-4 w-4" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-slate-800">{suggestion.section}</div>
                                    <div className="text-xs text-slate-600 mt-1">
                                        {suggestion.improvements.length > 0 && suggestion.improvements[0]}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-3" />
                        <p className="text-sm text-slate-500">Analyzing your resume to identify priorities...</p>
                    </div>
                )}
            </div>

            {/* Keywords Card - Simplified */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                        <KeyRound className="h-5 w-5 text-purple-500 mr-2" />
                        Top Recommended Keywords
                    </h3>
                </div>

                {analysisResult.keywords && analysisResult.keywords.missing ? (
                    <div className="flex flex-wrap gap-2">
                        {analysisResult.keywords.missing.slice(0, 8).map((keyword: string, i: number) => (
                            <div key={i} className="flex items-center p-2 rounded-lg bg-gradient-to-r from-slate-50 to-purple-50 border border-purple-200">
                                <Plus className="h-4 w-4 text-purple-500 mr-2" />
                                <span className="text-sm text-slate-700">{keyword}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <Loader2 className="h-8 w-8 text-purple-500 animate-spin mb-3" />
                        <p className="text-sm text-slate-500">Analyzing keywords...</p>
                    </div>
                )}
            </div>

        </div>
    );

    return (
        <div className="space-y-6">
            {isEnhancing ? (
                <EnhancingLoader stage={enhancementStage} />
            ) : (
                <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white px-6 py-5">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center">
                                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg mr-3 ring-1 ring-white/30">
                                    <Award className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Resume Insights</h2>
                                    <p className="text-sm text-blue-100 mt-1 flex items-center">
                                        {file && (
                                            <>
                                                <FileText className="h-3.5 w-3.5 mr-1.5 opacity-80" />
                                                <span className="opacity-80 truncate max-w-[300px]">{file.name}</span>
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center">
                                    <div className="mr-2">
                                        <div className="text-xs text-blue-100 opacity-80">Resume Power</div>
                                        <div className="text-xl font-bold">{getOverallScore()}%</div>
                                    </div>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getOverallScore() >= 80 ? 'bg-emerald-500' :
                                        getOverallScore() >= 60 ? 'bg-indigo-500' :
                                            'bg-blue-500'}`}>
                                        <Sparkles className="h-5 w-5 text-white" />
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFile}
                                    className="text-white hover:bg-white/20 border border-white/20"
                                >
                                    Change File
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AnalysisTab)} className="p-0">
                            <TabsList className="w-full bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-3 rounded-t-xl border-b border-slate-200 h-auto justify-start overflow-x-auto no-scrollbar">
                                {(Object.keys({
                                    overview: { label: 'Overview', icon: Award, color: 'blue' },
                                    format: { label: 'Format', icon: FileText, color: 'emerald' },
                                    content: { label: 'Content', icon: BarChart2, color: 'indigo' },
                                    keywords: { label: 'Keywords', icon: KeyRound, color: 'purple' },
                                    improvement: { label: 'Improvements', icon: Layers, color: 'amber' }
                                }) as AnalysisTab[]).map(tab => {
                                    const config = {
                                        overview: { label: 'Overview', icon: Award, color: 'blue' },
                                        format: { label: 'Format', icon: FileText, color: 'emerald' },
                                        content: { label: 'Content', icon: BarChart2, color: 'indigo' },
                                        keywords: { label: 'Keywords', icon: KeyRound, color: 'purple' },
                                        improvement: { label: 'Improvements', icon: Layers, color: 'amber' }
                                    }[tab];

                                    // Prepare the active tab-specific classes
                                    const activeTabClasses = {
                                        overview: "data-[state=active]:shadow-blue-100 data-[state=active]:text-blue-600 data-[state=active]:border-blue-200",
                                        format: "data-[state=active]:shadow-emerald-100 data-[state=active]:text-emerald-600 data-[state=active]:border-emerald-200",
                                        content: "data-[state=active]:shadow-indigo-100 data-[state=active]:text-indigo-600 data-[state=active]:border-indigo-200",
                                        keywords: "data-[state=active]:shadow-purple-100 data-[state=active]:text-purple-600 data-[state=active]:border-purple-200",
                                        improvement: "data-[state=active]:shadow-amber-100 data-[state=active]:text-amber-600 data-[state=active]:border-amber-200"
                                    }[tab];

                                    // Icon background classes
                                    const iconClasses = {
                                        overview: tab === activeTab ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500",
                                        format: tab === activeTab ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500",
                                        content: tab === activeTab ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500",
                                        keywords: tab === activeTab ? "bg-purple-100 text-purple-600" : "bg-slate-100 text-slate-500",
                                        improvement: tab === activeTab ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500"
                                    }[tab];

                                    // Active indicator classes
                                    const indicatorClasses = {
                                        overview: "border-blue-200",
                                        format: "border-emerald-200",
                                        content: "border-indigo-200",
                                        keywords: "border-purple-200",
                                        improvement: "border-amber-200"
                                    }[tab];

                                    return (
                                        <TabsTrigger
                                            key={tab}
                                            value={tab}
                                            className={`relative px-4 py-2 border border-transparent rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-300
                                            data-[state=active]:bg-white data-[state=active]:shadow-md ${activeTabClasses}
                                            data-[state=active]:border data-[state=inactive]:text-slate-600 
                                            data-[state=inactive]:hover:bg-white/70 data-[state=inactive]:hover:shadow-sm
                                            focus:outline-none mr-2
                                            overflow-hidden group`}
                                        >
                                            {/* Background shine effect on hover */}
                                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform"></span>

                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${iconClasses} transition-all duration-300`}>
                                                <config.icon className="h-3.5 w-3.5" />
                                            </div>
                                            <span>{config.label}</span>
                                            {tab === activeTab && (
                                                <>
                                                    {/* Enhanced active indicator with arrow */}
                                                    <span className={`absolute -bottom-[13px] left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 bg-white border-b border-r ${indicatorClasses} transition-all duration-300`}></span>

                                                    {/* Animated underline */}
                                                    <span className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-blue-500 to-indigo-500 scale-x-100 origin-left transition-transform duration-300"></span>
                                                </>
                                            )}
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>
                            <div className="px-6 py-6 bg-white">
                                <TabsContent value="overview" className="m-0 p-0 transition-all transform data-[state=inactive]:translate-x-2 data-[state=inactive]:opacity-0 data-[state=active]:translate-x-0 data-[state=active]:opacity-100 duration-500">
                                    {renderOverviewTab()}
                                </TabsContent>
                                <TabsContent value="format" className="m-0 p-0 transition-all transform data-[state=inactive]:translate-x-2 data-[state=inactive]:opacity-0 data-[state=active]:translate-x-0 data-[state=active]:opacity-100 duration-500">
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 border-b border-slate-200">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                                                        <FileText className="h-5 w-5 text-blue-500 mr-2" />
                                                        Format Enhancement
                                                    </h3>
                                                    <div className={`px-3 py-1 rounded-full text-sm font-medium 
                                                        ${analysisData.format.score && analysisData.format.score >= 80 ? 'bg-emerald-100 text-emerald-700' :
                                                            analysisData.format.score && analysisData.format.score >= 60 ? 'bg-indigo-100 text-indigo-700' :
                                                                analysisData.format.score ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                                                        Score: {analysisData.format.score ?? "--"}/100
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-5">
                                                {analysisData.format.isLoading ? (
                                                    <div className="flex flex-col items-center justify-center py-12">
                                                        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                                                            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                                                        </div>
                                                        <p className="text-slate-600 text-sm">Analyzing your resume format...</p>
                                                        <p className="text-slate-500 text-xs mt-2">This will just take a moment</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {analysisData.format.details.length > 0 ? (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {analysisData.format.details.map((detail, index) => {
                                                                    const isPositive = detail.includes("Good") || detail.includes("Excellent") || detail.includes("Well");
                                                                    return (
                                                                        <div
                                                                            key={index}
                                                                            className={`p-4 rounded-lg border ${isPositive
                                                                                ? "bg-emerald-50 border-emerald-200"
                                                                                : "bg-indigo-50 border-indigo-200"
                                                                                }`}
                                                                        >
                                                                            <div className="flex">
                                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${isPositive
                                                                                    ? "bg-emerald-100"
                                                                                    : "bg-indigo-100"
                                                                                    }`}>
                                                                                    {isPositive ? (
                                                                                        <Check className="h-4 w-4 text-emerald-600" />
                                                                                    ) : (
                                                                                        <Lightbulb className="h-4 w-4 text-indigo-600" />
                                                                                    )}
                                                                                </div>
                                                                                <span className="text-sm">{detail}</span>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-12 bg-slate-50 rounded-lg">
                                                                <p className="text-slate-500">No format analysis available yet.</p>
                                                                <button
                                                                    onClick={() => runAnalysis('format')}
                                                                    className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 border border-blue-200"
                                                                >
                                                                    Run Format Analysis
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="content" className="m-0 p-0 transition-all transform data-[state=inactive]:translate-x-2 data-[state=inactive]:opacity-0 data-[state=active]:translate-x-0 data-[state=active]:opacity-100 duration-500">
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="bg-gradient-to-r from-slate-50 to-indigo-50 p-4 border-b border-slate-200">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                                                        <BarChart2 className="h-5 w-5 text-indigo-500 mr-2" />
                                                        Content Optimization
                                                    </h3>
                                                    <div className={`px-3 py-1 rounded-full text-sm font-medium 
                                                        ${analysisData.content.score && analysisData.content.score >= 80 ? 'bg-emerald-100 text-emerald-700' :
                                                            analysisData.content.score && analysisData.content.score >= 60 ? 'bg-indigo-100 text-indigo-700' :
                                                                analysisData.content.score ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                                                        Score: {analysisData.content.score ?? "--"}/100
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-5">
                                                {analysisData.content.isLoading ? (
                                                    <div className="flex flex-col items-center justify-center py-12">
                                                        <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                                                            <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                                                        </div>
                                                        <p className="text-slate-600 text-sm">Analyzing your resume content...</p>
                                                        <p className="text-slate-500 text-xs mt-2">This will just take a moment</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {analysisData.content.details.length > 0 ? (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {analysisData.content.details.map((detail, index) => {
                                                                    const isPositive = detail.includes("Good") || detail.includes("Excellent") || detail.includes("Well");
                                                                    return (
                                                                        <div
                                                                            key={index}
                                                                            className={`p-4 rounded-lg border ${isPositive
                                                                                ? "bg-emerald-50 border-emerald-200"
                                                                                : "bg-indigo-50 border-indigo-200"
                                                                                }`}
                                                                        >
                                                                            <div className="flex">
                                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${isPositive
                                                                                    ? "bg-emerald-100"
                                                                                    : "bg-indigo-100"
                                                                                    }`}>
                                                                                    {isPositive ? (
                                                                                        <Check className="h-4 w-4 text-emerald-600" />
                                                                                    ) : (
                                                                                        <Lightbulb className="h-4 w-4 text-indigo-600" />
                                                                                    )}
                                                                                </div>
                                                                                <span className="text-sm">{detail}</span>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-12 bg-slate-50 rounded-lg">
                                                                <p className="text-slate-500">No content analysis available yet.</p>
                                                                <button
                                                                    onClick={() => runAnalysis('content')}
                                                                    className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 border border-indigo-200"
                                                                >
                                                                    Run Content Analysis
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="keywords" className="m-0 p-0 transition-all transform data-[state=inactive]:translate-x-2 data-[state=inactive]:opacity-0 data-[state=active]:translate-x-0 data-[state=active]:opacity-100 duration-500">
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="bg-gradient-to-r from-slate-50 to-purple-50 p-4 border-b border-slate-200">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                                                        <KeyRound className="h-5 w-5 text-purple-500 mr-2" />
                                                        Keyword Optimization
                                                    </h3>
                                                    <div className={`px-3 py-1 rounded-full text-sm font-medium 
                                                        ${analysisData.tailoring.score && analysisData.tailoring.score >= 80 ? 'bg-emerald-100 text-emerald-700' :
                                                            analysisData.tailoring.score && analysisData.tailoring.score >= 60 ? 'bg-indigo-100 text-indigo-700' :
                                                                analysisData.tailoring.score ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                                                        Score: {analysisData.tailoring.score ?? "--"}/100
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-5">
                                                {analysisData.tailoring.isLoading ? (
                                                    <div className="flex flex-col items-center justify-center py-12">
                                                        <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mb-4">
                                                            <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
                                                        </div>
                                                        <p className="text-slate-600 text-sm">Analyzing keywords and tailoring...</p>
                                                        <p className="text-slate-500 text-xs mt-2">This will just take a moment</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-5">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                            {/* Matched Keywords */}
                                                            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200 p-4 shadow-sm">
                                                                <h4 className="font-medium text-emerald-700 mb-3 flex items-center">
                                                                    <Check className="h-4 w-4 mr-1.5" />
                                                                    <span>Matched Keywords</span>
                                                                </h4>

                                                                <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                                                                    {analysisResult.keywords && analysisResult.keywords.matched && analysisResult.keywords.matched.length > 0 ? (
                                                                        analysisResult.keywords.matched.map((keyword: string, i: number) => (
                                                                            <div key={i} className="flex items-center p-2 rounded-md bg-white border border-emerald-200 shadow-sm">
                                                                                <Check className="h-3.5 w-3.5 text-emerald-500 mr-1.5" />
                                                                                <span className="text-sm text-slate-700">{keyword}</span>
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <div className="p-3 bg-white bg-opacity-60 rounded-md w-full">
                                                                            <p className="text-sm text-emerald-600 text-center">No matched keywords available</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Missing Keywords */}
                                                            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200 p-4 shadow-sm">
                                                                <h4 className="font-medium text-purple-700 mb-3 flex items-center">
                                                                    <Rocket className="h-4 w-4 mr-1.5" />
                                                                    <span>Recommended Keywords</span>
                                                                </h4>

                                                                <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                                                                    {analysisResult.keywords && analysisResult.keywords.missing && analysisResult.keywords.missing.length > 0 ? (
                                                                        analysisResult.keywords.missing.map((keyword: string, i: number) => (
                                                                            <div key={i} className="flex items-center p-2 rounded-md bg-white border border-purple-200 shadow-sm">
                                                                                <Plus className="h-3.5 w-3.5 text-purple-500 mr-1.5" />
                                                                                <span className="text-sm text-slate-700">{keyword}</span>
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <div className="p-3 bg-white bg-opacity-60 rounded-md w-full">
                                                                            <p className="text-sm text-purple-600 text-center">No additional keywords identified</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Tailoring Advice */}
                                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4 shadow-sm">
                                                            <h4 className="font-medium text-blue-700 mb-3 flex items-center">
                                                                <Target className="h-4 w-4 mr-1.5" />
                                                                <span>Tailoring Advice</span>
                                                            </h4>

                                                            <div className="space-y-3">
                                                                {analysisData.tailoring.details.length > 0 ? (
                                                                    analysisData.tailoring.details.map((detail, index) => (
                                                                        <div key={index} className="p-3 rounded-md bg-white border border-blue-100">
                                                                            <span className="text-sm text-slate-700">{detail}</span>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <div className="flex flex-col items-center justify-center p-6 bg-white bg-opacity-60 rounded-md">
                                                                        <p className="text-slate-500 mb-3">No tailoring analysis available yet.</p>
                                                                        <button
                                                                            onClick={() => runAnalysis('tailoring')}
                                                                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 border border-blue-200"
                                                                        >
                                                                            Run Tailoring Analysis
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="improvement" className="m-0 p-0 transition-all transform data-[state=inactive]:translate-x-2 data-[state=inactive]:opacity-0 data-[state=active]:translate-x-0 data-[state=active]:opacity-100 duration-500">
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="bg-gradient-to-r from-slate-50 to-amber-50 p-4 border-b border-slate-200">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                                                        <Rocket className="h-5 w-5 text-indigo-500 mr-2" />
                                                        Performance Boosters
                                                    </h3>
                                                    <div className={`px-3 py-1 rounded-full text-sm font-medium 
                                                        ${analysisData.sections.score && analysisData.sections.score >= 80 ? 'bg-emerald-100 text-emerald-700' :
                                                            analysisData.sections.score && analysisData.sections.score >= 60 ? 'bg-indigo-100 text-indigo-700' :
                                                                analysisData.sections.score ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                                                        Score: {analysisData.sections.score ?? "--"}/100
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-5">
                                                <div className="space-y-6">
                                                    {/* Section Improvements */}
                                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4 shadow-sm">
                                                        <h4 className="font-medium text-blue-700 mb-3 flex items-center">
                                                            <Layers className="h-4 w-4 mr-1.5" />
                                                            <span>By Section</span>
                                                        </h4>

                                                        <div className="space-y-3">
                                                            {analysisResult.suggestions && analysisResult.suggestions.length > 0 ? (
                                                                analysisResult.suggestions.map((suggestion: any, index: number) => (
                                                                    <div key={index} className="p-4 rounded-lg bg-white border border-blue-100 hover:border-blue-300 transition-colors">
                                                                        <div className="flex items-center justify-between cursor-pointer mb-2" onClick={() => toggleSuggestion(suggestion.section)}>
                                                                            <div className="flex items-center">
                                                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center mr-2 
                                                                                    ${index % 4 === 0 ? 'bg-blue-100 text-blue-600' :
                                                                                        index % 4 === 1 ? 'bg-purple-100 text-purple-600' :
                                                                                            index % 4 === 2 ? 'bg-amber-100 text-amber-600' :
                                                                                                'bg-emerald-100 text-emerald-600'}`}>
                                                                                    <span className="text-xs font-bold">{suggestion.section.charAt(0).toUpperCase()}</span>
                                                                                </div>
                                                                                <span className="font-medium text-slate-800">{suggestion.section}</span>
                                                                            </div>
                                                                            <div className="flex items-center">
                                                                                <span className="text-xs text-slate-500 mr-2">{suggestion.improvements.length} items</span>
                                                                                {expandedSuggestions.includes(suggestion.section) ? (
                                                                                    <ChevronUp className="h-4 w-4 text-slate-400" />
                                                                                ) : (
                                                                                    <ChevronDown className="h-4 w-4 text-slate-400" />
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        {expandedSuggestions.includes(suggestion.section) && (
                                                                            <div className="pl-10 pr-1 pt-2 animate-expandY">
                                                                                <div className="space-y-2 border-l-2 border-blue-200 pl-4">
                                                                                    {suggestion.improvements.map((improvement: string, i: number) => (
                                                                                        <div key={i} className="flex items-start p-2 rounded-md bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                                                                                            <Check className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                                                                            <span className="text-sm text-slate-700">{improvement}</span>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="flex flex-col items-center justify-center p-6 bg-white rounded-md">
                                                                    <p className="text-slate-500 mb-1">No section-specific improvements available.</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* General Improvements */}
                                                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 p-4 shadow-sm">
                                                        <h4 className="font-medium text-indigo-700 mb-3 flex items-center">
                                                            <Lightbulb className="h-4 w-4 mr-1.5" />
                                                            <span>Improvement Opportunities</span>
                                                        </h4>

                                                        <div className="space-y-3">
                                                            {improvementPoints.length > 0 ? (
                                                                improvementPoints.map((point, i) => (
                                                                    <div key={i} className="flex items-start p-3 rounded-md bg-white border border-indigo-200">
                                                                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                                                                            <Zap className="h-3.5 w-3.5 text-indigo-600" />
                                                                        </div>
                                                                        <span className="text-sm text-slate-700">{point}</span>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="flex flex-col items-center justify-center p-6 bg-white bg-opacity-70 rounded-md">
                                                                    <p className="text-slate-500">No improvement opportunities identified yet.</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Sections Analysis */}
                                                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-200 p-4 shadow-sm">
                                                        <h4 className="font-medium text-emerald-700 mb-3 flex items-center">
                                                            <FileText className="h-4 w-4 mr-1.5" />
                                                            <span>Sections Analysis</span>
                                                        </h4>

                                                        <div className="space-y-3">
                                                            {analysisData.sections.isLoading ? (
                                                                <div className="flex flex-col items-center justify-center py-12">
                                                                    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                                                                        <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
                                                                    </div>
                                                                    <p className="text-slate-600 text-sm">Analyzing resume sections...</p>
                                                                    <p className="text-slate-500 text-xs mt-2">This will just take a moment</p>
                                                                </div>
                                                            ) : (
                                                                analysisData.sections.details.length > 0 ? (
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                        {analysisData.sections.details.map((detail, index) => {
                                                                            const isPositive = detail.includes("Good") || detail.includes("Excellent") || detail.includes("Well");
                                                                            return (
                                                                                <div
                                                                                    key={index}
                                                                                    className={`p-3 rounded-md bg-white border ${isPositive
                                                                                        ? "bg-emerald-200"
                                                                                        : "bg-indigo-200"
                                                                                        }`}
                                                                                >
                                                                                    <div className="flex">
                                                                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0 ${isPositive
                                                                                            ? "bg-emerald-100"
                                                                                            : "bg-indigo-100"
                                                                                            }`}>
                                                                                            {isPositive ? (
                                                                                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                                                                                            ) : (
                                                                                                <Lightbulb className="h-3.5 w-3.5 text-indigo-600" />
                                                                                            )}
                                                                                        </div>
                                                                                        <span className="text-sm text-slate-700">{detail}</span>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex flex-col items-center justify-center p-6 bg-white bg-opacity-70 rounded-md">
                                                                        <p className="text-slate-500 mb-3">No sections analysis available yet.</p>
                                                                        <button
                                                                            onClick={() => runAnalysis('sections')}
                                                                            className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-100 border border-emerald-200"
                                                                        >
                                                                            Run Sections Analysis
                                                                        </button>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </div>
            )}
            {renderFileActions()}
        </div>
    );
};

export default AnalysisDashboard; 