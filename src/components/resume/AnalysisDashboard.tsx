import { AlertCircle, Award, BarChart2, Check, Clock, Download, FileText, KeyRound, Layers, Loader2, Plus, Target, Wand2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnalysisCategory, performDetailedAnalysis } from '../../services/analysisService';
import { useResumeStore } from '../../store/resumeStore';
import { enhanceResume } from '../../utils/ai';
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
        return 'text-red-600';
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 80) return 'bg-emerald-100';
        if (score >= 60) return 'bg-amber-100';
        return 'bg-red-100';
    };

    const getScoreGradient = (score: number) => {
        if (score >= 80) return 'from-emerald-500 to-emerald-600';
        if (score >= 60) return 'from-amber-500 to-amber-600';
        return 'from-red-500 to-red-600';
    };

    const getOverallScore = () => {
        const validScores = Object.values(analysisData)
            .map(item => item.score)
            .filter((score): score is number => score !== null);

        if (validScores.length === 0) return analysisResult.score;

        const weights: Record<AnalysisCategory, number> = {
            format: 0.3,
            content: 0.3,
            tailoring: 0.25,
            sections: 0.15
        };

        let weightedSum = 0;
        let totalWeight = 0;

        Object.entries(analysisData).forEach(([category, data]) => {
            if (data.score !== null) {
                weightedSum += data.score * weights[category as AnalysisCategory];
                totalWeight += weights[category as AnalysisCategory];
            }
        });

        if (totalWeight === 0) return analysisResult.score;

        return Math.round(weightedSum / totalWeight);
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
                        stroke={score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444'}
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
        if (!extractedText || isEnhancing) return;

        setIsEnhancing(true);
        setEnhancementStage('extracting');

        try {
            // Add a small delay to show the different stages for better UX
            setTimeout(() => setEnhancementStage('enhancing'), 1000);
            console.log('Extracted Analysis', extractedText);

            const result = await enhanceResume(extractedText);

            setEnhancementStage('finalizing');

            // Save enhanced resume data to Zustand store instead of localStorage
            setEnhancedResumeData(result);

            setTimeout(() => {
                // Navigate to create-resume route
                navigate('/create-resume');
                setIsEnhancing(false);
            }, 800);
        } catch (error) {
            console.error('Error enhancing resume:', error);
            setIsEnhancing(false);
            setEnhancedResumeData(null);
        }
    };

    const renderFileActions = () => (
        <div className="flex justify-end items-center gap-3 pt-4">
            <Button
                variant="outline"
                size="sm"
                onClick={clearFile}
                className="border-slate-300 text-slate-700"
            >
                Upload Another Resume
            </Button>
            <Button
                size="sm"
                onClick={handleEnhanceResume}
                disabled={isEnhancing}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
                {isEnhancing ? (
                    <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Enhancing...
                    </>
                ) : (
                    <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Create My Resume
                    </>
                )}
            </Button>
        </div>
    );

    const renderOverviewTab = () => (
        <div className="space-y-6 animate-fadeIn">
            {/* Score meter and summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1 bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col items-center">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Overall Score</h3>
                    {renderScoreMeter(getOverallScore(), 'lg')}
                    <div className="mt-4 text-center">
                        <Badge variant={getOverallScore() >= 80 ? "success" : getOverallScore() >= 60 ? "warning" : "destructive"} className="mb-2">
                            {getOverallScore() >= 80 ? 'Excellent' : getOverallScore() >= 60 ? 'Needs Improvement' : 'Requires Attention'}
                        </Badge>
                        <p className="text-sm text-slate-600">
                            {getOverallScore() >= 80
                                ? 'Your resume is well-optimized for ATS systems.'
                                : getOverallScore() >= 60
                                    ? 'Your resume needs some improvements to perform better.'
                                    : 'Your resume requires significant improvements to pass ATS filters.'}
                        </p>
                    </div>
                </div>

                {/* Category scores */}
                <div className="col-span-1 md:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="space-y-4">
                        {[
                            { category: 'format', label: 'ATS Format', icon: FileText, description: 'Resume formatting and structure' },
                            { category: 'content', label: 'Content Quality', icon: BarChart2, description: 'Effectiveness of content' },
                            { category: 'tailoring', label: 'Job Relevance', icon: Target, description: 'Alignment with job requirements' },
                            { category: 'sections', label: 'Section Structure', icon: Layers, description: 'Organization of resume sections' }
                        ].map(item => {
                            const analysis = analysisData[item.category as AnalysisCategory];
                            return (
                                <div key={item.category} className="group">
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="flex items-center">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-2 ${analysis.score ?
                                                (analysis.score >= 80 ? 'bg-emerald-100 text-emerald-600' :
                                                    analysis.score >= 60 ? 'bg-amber-100 text-amber-600' :
                                                        'bg-red-100 text-red-600') :
                                                analysis.isLoading ? 'bg-blue-100 text-blue-600 animate-pulse' : 'bg-slate-100 text-slate-400'
                                                }`}>
                                                <item.icon className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">{item.label}</p>
                                                <p className="text-xs text-slate-500">{item.description}</p>
                                            </div>
                                        </div>
                                        {analysis.score !== null ? (
                                            <Badge variant={analysis.score >= 80 ? "success" : analysis.score >= 60 ? "warning" : "destructive"}>
                                                {analysis.score}%
                                            </Badge>
                                        ) : analysis.isLoading ? (
                                            <div className="flex items-center">
                                                <Loader2 className="h-4 w-4 animate-spin text-blue-600 mr-1" />
                                                <span className="text-xs text-blue-600">Analyzing...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 text-slate-400 mr-1" />
                                                <span className="text-xs text-slate-400">Queued</span>
                                            </div>
                                        )}
                                    </div>
                                    {analysis.score !== null && (
                                        <Progress
                                            value={analysis.score}
                                            className={`h-2 ${analysis.score >= 80 ? 'bg-emerald-100' :
                                                analysis.score >= 60 ? 'bg-amber-100' :
                                                    'bg-red-100'
                                                }`}
                                            indicatorClassName={
                                                analysis.score >= 80 ? 'bg-emerald-500' :
                                                    analysis.score >= 60 ? 'bg-amber-500' :
                                                        'bg-red-500'
                                            }
                                        />
                                    )}
                                    {analysis.isLoading && (
                                        <Progress value={undefined} className="h-2 bg-blue-100" indicatorClassName="bg-blue-500" />
                                    )}
                                    {!analysis.isLoading && analysis.score === null && (
                                        <div className="h-2 bg-slate-100 rounded-full"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Resume Strengths and Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Resume Strengths */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <Badge variant="success" className="bg-emerald-50 text-emerald-700">
                            Good Points
                        </Badge>
                    </div>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                        {goodPoints.length > 0 ? (
                            goodPoints.slice(0, 10).map((point, i) => (
                                <div key={i} className="flex items-start p-3 rounded-lg border border-emerald-200 bg-emerald-50">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                                    </div>
                                    <span className="text-sm text-slate-700">{point}</span>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-6 text-center">
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                                    <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
                                </div>
                                <p className="text-sm text-slate-500">Analyzing your resume strengths...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Improvement Areas */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <Badge variant="warning" className="bg-amber-50 text-amber-700">
                            Action Points
                        </Badge>
                    </div>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                        {improvementPoints.length > 0 ? (
                            improvementPoints.slice(0, 10).map((point, i) => (
                                <div key={i} className="flex items-start p-3 rounded-lg border border-amber-200 bg-amber-50">
                                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                                        <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                                    </div>
                                    <span className="text-sm text-slate-700">{point}</span>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-6 text-center">
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                                    <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
                                </div>
                                <p className="text-sm text-slate-500">Identifying improvement areas...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Missing Keywords */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <Badge variant="destructive" className="bg-pink-50 text-pink-700">
                        Suggested Keywords
                    </Badge>
                </div>
                {analysisResult.keywords && analysisResult.keywords.missing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {analysisResult.keywords.missing.slice(0, 12).map((keyword: string, i: number) => (
                            <div key={i} className="flex items-center p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                                <Plus className="h-4 w-4 text-blue-500 mr-2" />
                                <span className="text-sm text-slate-700">{keyword}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                            <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
                        </div>
                        <p className="text-sm text-slate-500">Analyzing missing keywords...</p>
                    </div>
                )}
            </div>

            {/* Top Improvements */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">Section-Specific Improvements</h3>
                </div>
                <div className="space-y-3">
                    {analysisResult.suggestions && analysisResult.suggestions.length > 0 ? (
                        analysisResult.suggestions.slice(0, 4).map((suggestion: any, index: number) => (
                            <div key={index} className="p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
                                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSuggestion(suggestion.section)}>
                                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{suggestion.section}</span>
                                    {expandedSuggestions.includes(suggestion.section) ? (
                                        <button className="text-slate-400 hover:text-slate-500">
                                            <AlertCircle className="h-4 w-4" />
                                        </button>
                                    ) : (
                                        <button className="text-slate-400 hover:text-slate-500">
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>

                                {expandedSuggestions.includes(suggestion.section) && (
                                    <div className="mt-2 pl-2 border-l-2 border-blue-200 space-y-2 animate-expandY">
                                        {suggestion.improvements.map((improvement: string, i: number) => (
                                            <div key={i} className="flex items-start">
                                                <Check className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                                                <span className="text-xs text-slate-700">{improvement}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                                <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
                            </div>
                            <p className="text-sm text-slate-500">Analyzing section improvements...</p>
                        </div>
                    )}
                </div>
            </div>

            {renderFileActions()}
        </div>
    );

    return (
        <div className="space-y-6">
            {isEnhancing ? (
                <EnhancingLoader stage={enhancementStage} />
            ) : (
                <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="p-2 bg-white/20 rounded-lg mr-3">
                                    <Award className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold">Resume Analysis</h2>
                                    <p className="text-xs text-blue-100">
                                        {file && <span className="opacity-80">Analyzing: {file.name}</span>}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Badge
                                    variant="outline"
                                    className="bg-white/10 border-white/20 text-white"
                                >
                                    Score: {getOverallScore()}%
                                </Badge>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFile}
                                    className="text-white hover:bg-white/20"
                                >
                                    Change File
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AnalysisTab)} className="p-0">
                            <TabsList className="w-full border-b border-slate-200 px-5 pt-1 rounded-none bg-white h-auto gap-2">
                                {(Object.keys({
                                    overview: { label: 'Overview', icon: Award },
                                    format: { label: 'Format', icon: FileText },
                                    content: { label: 'Content', icon: BarChart2 },
                                    keywords: { label: 'Keywords', icon: KeyRound },
                                    improvement: { label: 'Improvements', icon: Layers }
                                }) as AnalysisTab[]).map(tab => {
                                    const config = {
                                        overview: { label: 'Overview', icon: Award },
                                        format: { label: 'Format', icon: FileText },
                                        content: { label: 'Content', icon: BarChart2 },
                                        keywords: { label: 'Keywords', icon: KeyRound },
                                        improvement: { label: 'Improvements', icon: Layers }
                                    }[tab];

                                    return (
                                        <TabsTrigger
                                            key={tab}
                                            value={tab}
                                            className="data-[state=active]:border-b-2 data-[state=active]:border-b-blue-600 data-[state=active]:text-blue-700 data-[state=active]:bg-transparent data-[state=active]:rounded-none data-[state=active]:shadow-none px-3 rounded-none flex items-center gap-1.5 pb-2.5"
                                        >
                                            <config.icon className="h-4 w-4" />
                                            {config.label}
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>
                            <div className="p-6">
                                <TabsContent value="overview" className="m-0 p-0">
                                    {renderOverviewTab()}
                                </TabsContent>
                                <TabsContent value="format" className="m-0 p-0">
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-semibold text-slate-800">Format Analysis</h3>
                                                <div className="flex items-center">
                                                    <span className={`text-xl font-bold ${getScoreColor(analysisData.format.score ?? 0)}`}>
                                                        {analysisData.format.score ?? "--"}
                                                    </span>
                                                    <span className="text-xs text-slate-500 ml-1">/100</span>
                                                </div>
                                            </div>

                                            {analysisData.format.isLoading ? (
                                                <div className="flex flex-col items-center justify-center py-12">
                                                    <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                                                    <p className="text-slate-500 text-sm">Analyzing resume format...</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {analysisData.format.details.length > 0 ? (
                                                        analysisData.format.details.map((detail, index) => (
                                                            <div
                                                                key={index}
                                                                className={`p-4 rounded-lg border ${detail.includes("Good") || detail.includes("Excellent") || detail.includes("Well")
                                                                    ? "bg-emerald-50 border-emerald-200"
                                                                    : "bg-amber-50 border-amber-200"
                                                                    }`}
                                                            >
                                                                <div className="flex">
                                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${detail.includes("Good") || detail.includes("Excellent") || detail.includes("Well")
                                                                        ? "bg-emerald-100"
                                                                        : "bg-amber-100"
                                                                        }`}>
                                                                        {detail.includes("Good") || detail.includes("Excellent") || detail.includes("Well") ? (
                                                                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                                                                        ) : (
                                                                            <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                                                                        )}
                                                                    </div>
                                                                    <span className="text-sm">{detail}</span>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center py-12 bg-slate-50 rounded-lg">
                                                            <p className="text-slate-500">No format analysis available yet.</p>
                                                            <button
                                                                onClick={() => runAnalysis('format')}
                                                                className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100"
                                                            >
                                                                Run Format Analysis
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="content" className="m-0 p-0">
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-semibold text-slate-800">Content Analysis</h3>
                                                <div className="flex items-center">
                                                    <span className={`text-xl font-bold ${getScoreColor(analysisData.content.score ?? 0)}`}>
                                                        {analysisData.content.score ?? "--"}
                                                    </span>
                                                    <span className="text-xs text-slate-500 ml-1">/100</span>
                                                </div>
                                            </div>

                                            {analysisData.content.isLoading ? (
                                                <div className="flex flex-col items-center justify-center py-12">
                                                    <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                                                    <p className="text-slate-500 text-sm">Analyzing resume content...</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {analysisData.content.details.length > 0 ? (
                                                        analysisData.content.details.map((detail, index) => (
                                                            <div
                                                                key={index}
                                                                className={`p-4 rounded-lg border ${detail.includes("Good") || detail.includes("Excellent") || detail.includes("Well")
                                                                    ? "bg-emerald-50 border-emerald-200"
                                                                    : "bg-amber-50 border-amber-200"
                                                                    }`}
                                                            >
                                                                <div className="flex">
                                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${detail.includes("Good") || detail.includes("Excellent") || detail.includes("Well")
                                                                        ? "bg-emerald-100"
                                                                        : "bg-amber-100"
                                                                        }`}>
                                                                        {detail.includes("Good") || detail.includes("Excellent") || detail.includes("Well") ? (
                                                                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                                                                        ) : (
                                                                            <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                                                                        )}
                                                                    </div>
                                                                    <span className="text-sm">{detail}</span>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center py-12 bg-slate-50 rounded-lg">
                                                            <p className="text-slate-500">No content analysis available yet.</p>
                                                            <button
                                                                onClick={() => runAnalysis('content')}
                                                                className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100"
                                                            >
                                                                Run Content Analysis
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="keywords" className="m-0 p-0">
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-semibold text-slate-800">Keywords Analysis</h3>
                                            </div>

                                            {analysisData.tailoring.isLoading ? (
                                                <div className="flex flex-col items-center justify-center py-12">
                                                    <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                                                    <p className="text-slate-500 text-sm">Analyzing keywords and tailoring...</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-6">
                                                    <div>
                                                        <h4 className="text-md font-medium text-slate-700 mb-3">
                                                            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full mr-2 text-xs">
                                                                Matched Keywords
                                                            </span>
                                                        </h4>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                                            {analysisResult.keywords && analysisResult.keywords.matched ? (
                                                                analysisResult.keywords.matched.map((keyword: string, i: number) => (
                                                                    <div key={i} className="flex items-center p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                                                                        <Check className="h-4 w-4 text-emerald-500 mr-2" />
                                                                        <span className="text-sm text-slate-700">{keyword}</span>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p className="text-slate-500 col-span-3 p-4 bg-slate-50 rounded-lg text-center">
                                                                    No matched keywords available
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h4 className="text-md font-medium text-slate-700 mb-3">
                                                            <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full mr-2 text-xs">
                                                                Missing Keywords
                                                            </span>
                                                        </h4>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                                            {analysisResult.keywords && analysisResult.keywords.missing ? (
                                                                analysisResult.keywords.missing.map((keyword: string, i: number) => (
                                                                    <div key={i} className="flex items-center p-2 rounded-lg bg-amber-50 border border-amber-200">
                                                                        <Plus className="h-4 w-4 text-amber-500 mr-2" />
                                                                        <span className="text-sm text-slate-700">{keyword}</span>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p className="text-slate-500 col-span-3 p-4 bg-slate-50 rounded-lg text-center">
                                                                    No missing keywords analysis available
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h4 className="text-md font-medium text-slate-700 mb-3">Tailoring Advice</h4>
                                                        <div className="space-y-3">
                                                            {analysisData.tailoring.details.length > 0 ? (
                                                                analysisData.tailoring.details.map((detail, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className="p-3 rounded-lg border border-blue-100 bg-blue-50"
                                                                    >
                                                                        <span className="text-sm text-slate-700">{detail}</span>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="text-center py-12 bg-slate-50 rounded-lg">
                                                                    <p className="text-slate-500">No tailoring analysis available yet.</p>
                                                                    <button
                                                                        onClick={() => runAnalysis('tailoring')}
                                                                        className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100"
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
                                </TabsContent>

                                <TabsContent value="improvement" className="m-0 p-0">
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-semibold text-slate-800">Suggested Improvements</h3>
                                            </div>

                                            <div className="space-y-6">
                                                {/* Section Improvements */}
                                                <div>
                                                    <h4 className="text-md font-medium text-slate-700 mb-3">By Section</h4>
                                                    <div className="space-y-3">
                                                        {analysisResult.suggestions && analysisResult.suggestions.length > 0 ? (
                                                            analysisResult.suggestions.map((suggestion: any, index: number) => (
                                                                <div key={index} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                                                                    <div className="flex items-center justify-between cursor-pointer mb-2" onClick={() => toggleSuggestion(suggestion.section)}>
                                                                        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{suggestion.section}</span>
                                                                        {expandedSuggestions.includes(suggestion.section) ? (
                                                                            <button className="text-slate-400 hover:text-slate-500">
                                                                                <AlertCircle className="h-4 w-4" />
                                                                            </button>
                                                                        ) : (
                                                                            <button className="text-slate-400 hover:text-slate-500">
                                                                                <Plus className="h-4 w-4" />
                                                                            </button>
                                                                        )}
                                                                    </div>

                                                                    {expandedSuggestions.includes(suggestion.section) && (
                                                                        <div className="pl-4 border-l-2 border-blue-200 space-y-3 animate-expandY">
                                                                            {suggestion.improvements.map((improvement: string, i: number) => (
                                                                                <div key={i} className="flex items-start">
                                                                                    <Check className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                                                                                    <span className="text-sm text-slate-700">{improvement}</span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="flex flex-col items-center justify-center py-6 text-center">
                                                                <p className="text-sm text-slate-500">No section-specific improvements available.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* General Improvements */}
                                                <div>
                                                    <h4 className="text-md font-medium text-slate-700 mb-3">General Improvements</h4>
                                                    <div className="space-y-3">
                                                        {improvementPoints.length > 0 ? (
                                                            improvementPoints.map((point, i) => (
                                                                <div key={i} className="flex items-start p-3 rounded-lg border border-amber-200 bg-amber-50">
                                                                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                                                                        <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                                                                    </div>
                                                                    <span className="text-sm text-slate-700">{point}</span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="flex flex-col items-center justify-center py-6 text-center">
                                                                <p className="text-sm text-slate-500">No general improvements available yet.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Sections Analysis */}
                                                <div>
                                                    <h4 className="text-md font-medium text-slate-700 mb-3">Sections Analysis</h4>
                                                    <div className="space-y-3">
                                                        {analysisData.sections.isLoading ? (
                                                            <div className="flex flex-col items-center justify-center py-12">
                                                                <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                                                                <p className="text-slate-500 text-sm">Analyzing resume sections...</p>
                                                            </div>
                                                        ) : (
                                                            analysisData.sections.details.length > 0 ? (
                                                                analysisData.sections.details.map((detail, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className={`p-4 rounded-lg border ${detail.includes("Good") || detail.includes("Excellent") || detail.includes("Well")
                                                                            ? "bg-emerald-50 border-emerald-200"
                                                                            : "bg-amber-50 border-amber-200"
                                                                            }`}
                                                                    >
                                                                        <div className="flex">
                                                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${detail.includes("Good") || detail.includes("Excellent") || detail.includes("Well")
                                                                                ? "bg-emerald-100"
                                                                                : "bg-amber-100"
                                                                                }`}>
                                                                                {detail.includes("Good") || detail.includes("Excellent") || detail.includes("Well") ? (
                                                                                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                                                                                ) : (
                                                                                    <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                                                                                )}
                                                                            </div>
                                                                            <span className="text-sm">{detail}</span>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="text-center py-12 bg-slate-50 rounded-lg">
                                                                    <p className="text-slate-500">No sections analysis available yet.</p>
                                                                    <button
                                                                        onClick={() => runAnalysis('sections')}
                                                                        className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100"
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
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalysisDashboard; 