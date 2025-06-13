import React, { useState, useEffect } from 'react';
import { ArrowDown, ArrowUp, Award, BarChart2, CheckCircle, Clock, FileText, Info, Loader2, LucideIcon, PieChart, Plus, Target, Trash2, X } from 'lucide-react';
import Button from '../ui/Button';

type AnalysisCategory = 'format' | 'content' | 'tailoring' | 'sections';

interface AnalysisItem {
    category: AnalysisCategory;
    score: number | null;
    details: string[];
    isLoading: boolean;
    error: string | null;
}

interface FullAnalysisViewProps {
    analysisResult: any;
    file: File | null;
    onClose: () => void;
    generateDetailedAnalysis: (category: AnalysisCategory) => Promise<{ score: number, details: string[] }>;
}

const categoryConfig: Record<AnalysisCategory, {
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
    borderColor: string;
    hoverBgColor: string;
    textColor: string;
    borderStrongColor: string;
    iconBgColor: string;
}> = {
    format: {
        title: 'Resume Format',
        description: 'Analysis of layout, structure, and visual presentation',
        icon: FileText,
        color: 'blue',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        hoverBgColor: 'hover:bg-blue-50',
        textColor: 'text-blue-600',
        borderStrongColor: 'border-blue-300',
        iconBgColor: 'bg-blue-100'
    },
    content: {
        title: 'Content Quality',
        description: 'Evaluation of language, achievements, and relevance',
        icon: BarChart2,
        color: 'purple',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        hoverBgColor: 'hover:bg-purple-50',
        textColor: 'text-purple-600',
        borderStrongColor: 'border-purple-300',
        iconBgColor: 'bg-purple-100'
    },
    tailoring: {
        title: 'Job Tailoring',
        description: 'How well your resume is tailored for specific roles',
        icon: Target,
        color: 'emerald',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        hoverBgColor: 'hover:bg-emerald-50',
        textColor: 'text-emerald-600',
        borderStrongColor: 'border-emerald-300',
        iconBgColor: 'bg-emerald-100'
    },
    sections: {
        title: 'Section Balance',
        description: 'Review of your resume sections and completeness',
        icon: PieChart,
        color: 'amber',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        hoverBgColor: 'hover:bg-amber-50',
        textColor: 'text-amber-600',
        borderStrongColor: 'border-amber-300',
        iconBgColor: 'bg-amber-100'
    }
};

const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-slate-400';
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
};

const getScoreBgColor = (score: number | null) => {
    if (score === null) return 'bg-slate-100';
    if (score >= 80) return 'bg-emerald-100';
    if (score >= 60) return 'bg-amber-100';
    return 'bg-red-100';
};

const getScoreGradient = (score: number | null) => {
    if (score === null) return 'from-slate-400 to-slate-500';
    if (score >= 80) return 'from-emerald-500 to-emerald-600';
    if (score >= 60) return 'from-amber-500 to-amber-600';
    return 'from-red-500 to-red-600';
};

const getBorderColor = (category: AnalysisCategory, expanded: boolean, score: number | null) => {
    const config = categoryConfig[category];
    if (expanded) return `border-${config.color}-300`;
    if (score !== null) return `border-${config.color}-200`;
    return 'border-slate-200';
};

const FullAnalysisView: React.FC<FullAnalysisViewProps> = ({
    analysisResult,
    file,
    onClose,
    generateDetailedAnalysis
}) => {
    const [analyses, setAnalyses] = useState<Record<AnalysisCategory, AnalysisItem>>({
        format: { category: 'format', score: null, details: [], isLoading: false, error: null },
        content: { category: 'content', score: null, details: [], isLoading: false, error: null },
        tailoring: { category: 'tailoring', score: null, details: [], isLoading: false, error: null },
        sections: { category: 'sections', score: null, details: [], isLoading: false, error: null }
    });

    const [expandedCategories, setExpandedCategories] = useState<Record<AnalysisCategory, boolean>>({
        format: false,
        content: false,
        tailoring: false,
        sections: false
    });

    const toggleCategory = (category: AnalysisCategory) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const runAnalysis = async (category: AnalysisCategory) => {
        if (analyses[category].isLoading) return;

        setAnalyses(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                isLoading: true,
                error: null
            }
        }));

        try {
            const result = await generateDetailedAnalysis(category);

            setAnalyses(prev => ({
                ...prev,
                [category]: {
                    ...prev[category],
                    score: result.score,
                    details: result.details,
                    isLoading: false
                }
            }));

            setExpandedCategories(prev => ({
                ...prev,
                [category]: true
            }));
        } catch (error) {
            setAnalyses(prev => ({
                ...prev,
                [category]: {
                    ...prev[category],
                    isLoading: false,
                    error: 'Failed to generate analysis'
                }
            }));
        }
    };

    const analyzeAll = () => {
        Object.keys(analyses).forEach((category) => {
            runAnalysis(category as AnalysisCategory);
        });
    };

    const getOverallScore = (): number => {
        const validScores = Object.values(analyses)
            .map(item => item.score)
            .filter((score): score is number => score !== null);

        if (validScores.length === 0) return analysisResult.score;

        return Math.round(validScores.reduce((sum, score) => sum + score, 0) / validScores.length);
    };

    // Render category card with proper Tailwind classes
    const renderCategoryCard = (category: AnalysisCategory) => {
        const config = categoryConfig[category];
        const analysis = analyses[category];
        const isExpanded = expandedCategories[category];
        const hasScore = analysis.score !== null;

        // Determine border class based on state
        let borderClass = 'border-slate-200';
        if (isExpanded) {
            borderClass = config.borderStrongColor;
        } else if (hasScore) {
            borderClass = config.borderColor;
        }

        // Determine background class based on state
        let bgClass = 'hover:bg-slate-50';
        if (isExpanded) {
            bgClass = config.bgColor;
        } else if (hasScore) {
            bgClass = config.hoverBgColor;
        }

        // Determine icon background class
        let iconBgClass = 'bg-slate-100';
        if (hasScore) {
            iconBgClass = config.iconBgColor;
        }

        // Determine icon text color
        let iconTextClass = 'text-slate-400';
        if (hasScore) {
            iconTextClass = config.textColor;
        }

        return (
            <div
                key={category}
                className={`border rounded-xl transition-all duration-200 overflow-hidden ${isExpanded ? 'shadow-md' : ''
                    } ${borderClass}`}
            >
                <div
                    className={`flex justify-between items-center p-4 cursor-pointer ${bgClass}`}
                    onClick={() => hasScore && toggleCategory(category)}
                >
                    <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${iconBgClass}`}>
                            <config.icon className={`h-5 w-5 ${iconTextClass}`} />
                        </div>
                        <div>
                            <h3 className="font-medium text-slate-800">{config.title}</h3>
                            <p className="text-xs text-slate-500">{config.description}</p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        {analysis.isLoading ? (
                            <div className="flex items-center px-3 py-1 bg-slate-100 rounded-md">
                                <Loader2 className="h-4 w-4 text-slate-500 animate-spin mr-1" />
                                <span className="text-xs text-slate-500">Analyzing...</span>
                            </div>
                        ) : hasScore ? (
                            <div className="flex items-center">
                                <div className={`px-3 py-1 rounded-md ${getScoreBgColor(analysis.score)}`}>
                                    <span className={`text-sm font-medium ${getScoreColor(analysis.score)}`}>
                                        {analysis.score}%
                                    </span>
                                </div>
                                <button
                                    className="ml-2 p-1.5 rounded-full hover:bg-slate-100"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleCategory(category);
                                    }}
                                >
                                    {isExpanded ? (
                                        <ArrowUp className="h-4 w-4 text-slate-500" />
                                    ) : (
                                        <ArrowDown className="h-4 w-4 text-slate-500" />
                                    )}
                                </button>
                            </div>
                        ) : analysis.error ? (
                            <div className="flex items-center">
                                <span className="text-xs text-red-500 mr-2">{analysis.error}</span>
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        runAnalysis(category);
                                    }}
                                    size="sm"
                                    isLoading={analysis.isLoading}
                                    className="text-xs py-1"
                                >
                                    Retry
                                </Button>
                            </div>
                        ) : (
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    runAnalysis(category);
                                }}
                                size="sm"
                                isLoading={analysis.isLoading}
                                className="text-xs py-1"
                            >
                                Analyze
                            </Button>
                        )}
                    </div>
                </div>

                {/* Expanded content */}
                {isExpanded && hasScore && (
                    <div className={`p-4 ${config.bgColor} border-t ${config.borderColor}`}>
                        <div className="space-y-3">
                            {analysis.details.map((detail, i) => (
                                <div key={i} className="flex items-start">
                                    <div className={`w-5 h-5 rounded-full ${config.iconBgColor} flex-shrink-0 flex items-center justify-center mt-0.5 mr-2`}>
                                        <CheckCircle className={`h-3 w-3 ${config.textColor}`} />
                                    </div>
                                    <div className={`text-sm text-slate-700 bg-white p-3 rounded-lg border ${config.borderColor} flex-grow`}>
                                        {detail}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full h-[90vh] max-h-[800px] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-4 md:p-6 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <Award className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-slate-800">
                                Detailed Resume Analysis
                            </h2>
                            <p className="text-xs md:text-sm text-slate-500">
                                In-depth analysis of your resume's performance
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-slate-100"
                    >
                        <X className="h-5 w-5 md:h-6 md:w-6 text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    {/* Overall Score */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 md:p-6 mb-6 border border-blue-100">
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                                <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center bg-gradient-to-br ${getScoreGradient(getOverallScore())} p-1`}>
                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                        <div className="text-center">
                                            <span className={`text-3xl md:text-4xl font-bold ${getScoreColor(getOverallScore())}`}>
                                                {getOverallScore()}
                                            </span>
                                            <span className={`text-xl md:text-2xl font-bold ${getScoreColor(getOverallScore())}`}>
                                                %
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1">
                                <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-2">
                                    Overall Resume Score
                                </h3>
                                <p className="text-sm md:text-base text-slate-600 mb-4">
                                    This score combines the ATS compatibility with detailed analysis of format, content,
                                    tailoring, and section balance. Run individual analyses below to improve your score.
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {Object.entries(categoryConfig).map(([key, config]) => {
                                        const category = key as AnalysisCategory;
                                        const analysis = analyses[category];
                                        return (
                                            <div key={category} className={`rounded-lg p-2 border ${analysis.score ? config.borderColor : 'border-slate-200'}`}>
                                                <div className="flex items-center">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${analysis.score ? config.iconBgColor : 'bg-slate-100'}`}>
                                                        {analysis.isLoading ? (
                                                            <Loader2 className="h-3 w-3 animate-spin text-slate-500" />
                                                        ) : (
                                                            <config.icon className={`h-3 w-3 ${analysis.score ? config.textColor : 'text-slate-400'}`} />
                                                        )}
                                                    </div>
                                                    <div className="ml-1 text-xs">
                                                        <span className={analysis.score ? config.textColor : 'text-slate-400'}>
                                                            {analysis.score ? analysis.score + '%' : 'Run'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Analysis Categories */}
                    <div className="space-y-4">
                        {Object.keys(categoryConfig).map((key) => renderCategoryCard(key as AnalysisCategory))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 md:p-6 border-t border-slate-200 flex justify-between items-center bg-slate-50">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="text-sm"
                    >
                        Close
                    </Button>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            onClick={analyzeAll}
                            className="text-sm"
                            leftIcon={<BarChart2 className="h-4 w-4" />}
                        >
                            Analyze All
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FullAnalysisView; 