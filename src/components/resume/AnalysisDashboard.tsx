import { Award, Check, ChevronDown, ChevronUp, FileText, Layers, Lightbulb, Loader2, Rocket, Sparkles, Target, Zap, TrendingUp, BarChart3, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useResumeStore } from '../../store/resumeStore';
import { enhanceResumeFromFile } from '../../utils/api';
import { checkFileIsResume } from '../../utils/resumeService';
import Button from '../ui/Button';
import EnhancingLoader from './EnhancingLoader';

interface AnalysisDashboardProps {
    analysisResult: any;
    extractedText: string;
    file: File | null;
    clearFile: () => void;
    onFileSelect?: (file: File) => void;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
    analysisResult,
    extractedText,
    file,
    clearFile,
    onFileSelect
}) => {
    const navigate = useNavigate();
    const [expandedSuggestions, setExpandedSuggestions] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<string>('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const {
        ui: { isEnhancing, enhancementStage },
        setIsEnhancing,
        setEnhancementStage,
        setEnhancedResumeData
    } = useResumeStore();

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-600';
        if (score >= 60) return 'text-amber-600';
        return 'text-blue-600';
    };

    const getOverallScore = () => {
        return analysisResult.score || 0;
    };

    const toggleSuggestion = (section: string) => {
        setExpandedSuggestions(prev =>
            prev.includes(section)
                ? prev.filter(s => s !== section)
                : [...prev, section]
        );
    };

    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleEnhanceResume = async () => {
        if (!file || isEnhancing) return;

        try {
            setIsEnhancing(true);
            setEnhancementStage('extracting');
            setErrorMessage('');

            const checkResult = await checkFileIsResume(file, false);

            if (!checkResult.is_resume) {
                throw new Error('The uploaded document does not appear to be a resume. Please upload a valid resume document.');
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
            setEnhancementStage('enhancing');

            const enhanceResult = await enhanceResumeFromFile(file);

            setEnhancementStage('finalizing');
            await new Promise(resolve => setTimeout(resolve, 800));

            setEnhancementStage('completed' as any);
            setEnhancedResumeData(enhanceResult);

            await new Promise(resolve => setTimeout(resolve, 500));

            navigate('/create-resume');

        } catch (error) {
            console.error('Error enhancing resume:', error);
            setEnhancementStage('error');

            let message = '';
            if (error instanceof Error) {
                if (error.message.includes('does not appear to be a resume')) {
                    message = error.message;
                } else if (error.message.includes('cancelled') || error.message.includes('aborted')) {
                    message = 'The enhancement process was interrupted. Please try again.';
                } else if (error.message.includes('timed out')) {
                    message = 'The request took too long. Please try again with a smaller file.';
                } else if (error.message.includes('File size too large')) {
                    message = 'The file is too large. Please upload a smaller file (max 10MB).';
                } else if (error.message.includes('Unsupported file type')) {
                    message = 'Please upload a PDF, DOCX, or TXT file.';
                } else if (error.message.includes('Insufficient tokens')) {
                    message = 'Insufficient tokens. Please try again later.';
                } else {
                    message = error.message;
                }
            } else {
                message = 'Failed to enhance resume. Please try again.';
            }

            setErrorMessage(message);
        }
    };

    const handleUploadAnother = () => {
        clearFile();
        // Keep error state visible - don't clear errorMessage or enhancementStage
        // Only clear when a new file is selected and processing starts
        // Trigger file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
            fileInputRef.current.click();
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = (e.target as HTMLInputElement).files;
        if (files && files.length > 0 && onFileSelect) {
            // Clear error state when a new file is selected
            setErrorMessage('');
            onFileSelect(files[0]);
        }
    };

    if (isEnhancing) {
        return (
            <>
                <EnhancingLoader
                    stage={enhancementStage}
                    errorMessage={errorMessage}
                    onUploadAnother={handleUploadAnother}
                />
                {/* Hidden file input for upload another file */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileInputChange}
                    className="hidden"
                />
            </>
        );
    }

    const careerAlignment = (analysisResult as any)?.career_alignment;
    const summary = (analysisResult as any)?.summary;
    const priorityActions = (analysisResult as any)?.priority_actions || [];
    const achievementAnalysis = (analysisResult as any)?.achievement_analysis;
    const overallScore = getOverallScore();

    useEffect(() => {
        if (analysisResult.suggestions && analysisResult.suggestions.length > 0 && !activeTab) {
            setActiveTab(analysisResult.suggestions[0].section);
        }
    }, [analysisResult.suggestions, activeTab]);

    return (
        <div className="min-h-screen bg-white">
            <section className="relative pt-8 pb-16 overflow-hidden bg-white">
                <div className="container mx-auto px-4 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="font-display text-3xl lg:text-4xl font-medium text-slate-900">Resume Analysis</h1>
                                {file && (
                                    <p className="text-sm text-slate-600 mt-1 flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        <span className="truncate max-w-md">{file.name}</span>
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={clearFile}
                                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 focus:outline-none transition-all duration-200"
                            >
                                Upload Another Resume
                            </button>
                        </div>
                    </motion.div>

                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
                        >
                            <div className="flex items-start gap-8">
                                <div className="flex-1">
                                    <h2 className="font-display text-2xl font-medium text-slate-900 mb-3">Overall Score</h2>
                                    {summary ? (
                                        <p className="text-slate-600 leading-relaxed mb-4">{summary}</p>
                                    ) : (
                                        <p className="text-slate-600 leading-relaxed mb-4">
                                            {overallScore >= 80
                                                ? 'Your resume is well-optimized for ATS systems and recruiters!'
                                                : overallScore >= 60
                                                    ? 'Your resume has potential. A few targeted improvements will make it stand out.'
                                                    : 'Focus on these key areas to strengthen your resume and improve your chances.'}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-3">
                                        {analysisResult.ats_score !== undefined && (
                                            <div className="bg-slate-50 rounded-full px-4 py-1.5 border border-slate-200 flex items-center gap-1.5">
                                                <span className="text-xs font-medium text-slate-600 uppercase tracking-wide whitespace-nowrap">ATS</span>
                                                <span className="text-xs font-medium text-slate-700">{analysisResult.ats_score}%</span>
                                            </div>
                                        )}
                                        {analysisResult.content_score !== undefined && (
                                            <div className="bg-slate-50 rounded-full px-4 py-1.5 border border-slate-200 flex items-center gap-1.5">
                                                <span className="text-xs font-medium text-slate-600 uppercase tracking-wide whitespace-nowrap">Content</span>
                                                <span className="text-xs font-medium text-slate-700">{analysisResult.content_score}%</span>
                                            </div>
                                        )}
                                        {analysisResult.format_score !== undefined && (
                                            <div className="bg-slate-50 rounded-full px-4 py-1.5 border border-slate-200 flex items-center gap-1.5">
                                                <span className="text-xs font-medium text-slate-600 uppercase tracking-wide whitespace-nowrap">Format</span>
                                                <span className="text-xs font-medium text-slate-700">{analysisResult.format_score}%</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className={`w-32 h-32 rounded-full flex flex-col items-center justify-center ${overallScore >= 80 ? 'bg-gradient-to-br from-emerald-100 to-emerald-200' :
                                        overallScore >= 60 ? 'bg-gradient-to-br from-amber-100 to-amber-200' :
                                            'bg-gradient-to-br from-blue-100 to-blue-200'
                                        }`}>
                                        <span className={`text-5xl font-bold ${getScoreColor(overallScore)}`}>
                                            {overallScore}
                                        </span>
                                        <div className={`px-3 py-1 rounded-full text-xs font-semibold mt-1 ${overallScore >= 80 ? 'bg-emerald-500 text-white' :
                                            overallScore >= 60 ? 'bg-amber-500 text-white' :
                                                'bg-blue-500 text-white'
                                            }`}>
                                            {overallScore >= 80 ? 'Excellent' :
                                                overallScore >= 60 ? 'Good' : 'Needs Work'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {careerAlignment && (careerAlignment.target_role || careerAlignment.seniority_level) && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-xl border border-slate-200 p-8"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-white rounded-xl shadow-sm">
                                        <Target className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <h2 className="font-display text-2xl font-medium text-slate-900">Career Alignment</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    {careerAlignment.target_role && (
                                        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                                            <div className="text-xs text-slate-500 font-semibold mb-2 uppercase tracking-wide">Target Role</div>
                                            <div className="text-xl font-medium text-slate-900">{careerAlignment.target_role}</div>
                                        </div>
                                    )}
                                    {careerAlignment.seniority_level && (
                                        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                                            <div className="text-xs text-slate-500 font-semibold mb-2 uppercase tracking-wide">Seniority Level</div>
                                            <div className="text-xl font-medium text-slate-900">{careerAlignment.seniority_level}</div>
                                        </div>
                                    )}
                                    {careerAlignment.industry_fit && (
                                        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                                            <div className="text-xs text-slate-500 font-semibold mb-2 uppercase tracking-wide">Industry Fit</div>
                                            <div className="text-xl font-medium text-slate-900">{careerAlignment.industry_fit}</div>
                                        </div>
                                    )}
                                </div>
                                {careerAlignment.rationale && (
                                    <div className="bg-white/80 rounded-xl p-5 border border-slate-200">
                                        <p className="text-slate-700 leading-relaxed">{careerAlignment.rationale}</p>
                                    </div>
                                )}
                            </motion.section>
                        )}

                        {priorityActions && priorityActions.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="bg-white rounded-xl border border-slate-200 shadow-sm p-8"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-slate-100 rounded-xl">
                                        <Rocket className="h-6 w-6 text-slate-700" />
                                    </div>
                                    <h2 className="font-display text-2xl font-medium text-slate-900">Priority Actions</h2>
                                </div>
                                <div className="space-y-3">
                                    {priorityActions.slice(0, 5).map((action: any, index: number) => (
                                        <div key={index} className="bg-slate-50 rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
                                            <div className="flex items-start gap-4">
                                                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${action.priority === 'high' ? 'bg-red-100 text-red-700' :
                                                    action.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {action.priority?.[0].toUpperCase() || 'M'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="font-semibold text-slate-900">{action.title}</span>
                                                        {action.impact && (
                                                            <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                                                                Impact: {action.impact}/5
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-slate-600 leading-relaxed">{action.detail}</p>
                                                    {action.section && (
                                                        <span className="inline-block mt-2 px-2 py-1 rounded-md bg-slate-200 text-slate-600 text-xs font-medium">
                                                            {action.section}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {achievementAnalysis && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="bg-white rounded-xl border border-slate-200 shadow-sm p-8"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-slate-100 rounded-xl">
                                        <Award className="h-6 w-6 text-slate-700" />
                                    </div>
                                    <h2 className="font-display text-2xl font-medium text-slate-900">Achievement Analysis</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                        <div className="text-xs text-slate-500 font-semibold mb-2 uppercase tracking-wide">Quantifiable Achievements</div>
                                        <div className="text-4xl font-bold text-slate-900 mb-1">{achievementAnalysis.quantifiable_achievements || 0}</div>
                                        <div className="text-sm text-slate-600">found in resume</div>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                        <div className="text-xs text-slate-500 font-semibold mb-2 uppercase tracking-wide">Metrics Coverage</div>
                                        <div className="text-2xl font-bold text-slate-900 mb-1">
                                            {achievementAnalysis.needs_more_metrics ? 'Needs Improvement' : 'Good Coverage'}
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            {achievementAnalysis.needs_more_metrics ? 'Add more quantifiable results' : 'Well quantified'}
                                        </div>
                                    </div>
                                </div>
                                {achievementAnalysis.best_achievements && achievementAnalysis.best_achievements.length > 0 && (
                                    <div>
                                        <h3 className="font-display text-sm font-semibold text-slate-700 mb-3">Top Achievements</h3>
                                        <div className="space-y-2">
                                            {achievementAnalysis.best_achievements.map((achievement: string, i: number) => (
                                                <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                                    <p className="text-sm text-slate-700 leading-relaxed">{achievement}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.section>
                        )}

                        {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
                            >
                                <div className="mb-6">
                                    <h2 className="font-display text-2xl font-medium text-slate-900">Key Focus Areas</h2>
                                </div>
                                <div className="space-y-4">
                                    {analysisResult.suggestions.slice(0, 4).map((suggestion: any, index: number) => (
                                        <div key={index} className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d6d6d6] text-slate-900 flex items-center justify-center font-semibold text-xs mt-0.5">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-display text-lg font-medium text-slate-900 mb-2">{suggestion.section}</h3>
                                                <p className="text-slate-700 leading-relaxed">
                                                    {suggestion.improvements.length > 0 && suggestion.improvements[0]}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
                        >
                            <div className="mb-6">
                                <h2 className="font-display text-2xl font-medium text-slate-900">Section wise improvements</h2>
                            </div>
                            {analysisResult.suggestions && analysisResult.suggestions.length > 0 ? (
                                <>
                                    <div className="relative mb-6">
                                        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                                            {analysisResult.suggestions.map((suggestion: any, index: number) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setActiveTab(suggestion.section)}
                                                    className={`px-6 py-3 rounded-lg font-medium text-base whitespace-nowrap transition-colors ${
                                                        activeTab === suggestion.section
                                                            ? 'bg-slate-900 text-white'
                                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                    }`}
                                                >
                                                    {suggestion.section}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
                                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
                                    </div>
                                    <div className="min-h-[200px]">
                                        {activeTab ? (
                                            (() => {
                                                const activeSuggestion = analysisResult.suggestions.find((s: any) => s.section === activeTab);
                                                if (!activeSuggestion) return null;
                                                return (
                                                    <div className="space-y-4">
                                                        {activeSuggestion.improvements.map((improvement: string, i: number) => (
                                                            <div key={i} className="flex items-start gap-4">
                                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d6d6d6] text-slate-900 flex items-center justify-center font-semibold text-xs mt-0.5">
                                                                    {i + 1}
                                                                </div>
                                                                <span className="text-slate-700 leading-relaxed">{improvement}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            })()
                                        ) : (
                                            <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl border border-slate-200">
                                                <p className="text-slate-500">Select a section above to view improvements</p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl border border-slate-200">
                                    <p className="text-slate-500">No section-specific improvements available.</p>
                                </div>
                            )}
                        </motion.section>

                        {analysisResult?.feedback?.improvements?.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                                className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-xl border border-slate-200 p-8"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-white rounded-xl shadow-sm">
                                        <Lightbulb className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <h2 className="font-display text-2xl font-medium text-slate-900">Improvement Opportunities</h2>
                                </div>
                                <div className="space-y-3">
                                    {analysisResult.feedback.improvements.map((point: string, i: number) => (
                                        <div key={i} className="flex items-start gap-4 bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                                            <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                                <Zap className="h-4 w-4 text-indigo-600" />
                                            </div>
                                            <span className="text-slate-700 leading-relaxed flex-1">{point}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl border border-slate-700 p-8 text-white"
                        >
                            <div className="max-w-3xl mx-auto text-center mb-6">
                                <h2 className="font-display text-3xl font-medium mb-4">Ready to Transform Your Resume?</h2>
                                <p className="text-lg text-slate-300 leading-relaxed mb-8">
                                    Transform your resume into an ATS-optimized document that will impress recruiters
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm truncate">
                                            {file?.name || "Resume file"}
                                        </p>
                                        <p className="text-xs text-slate-300 mt-0.5">
                                            {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "No file selected"}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    size="lg"
                                    onClick={handleEnhanceResume}
                                    disabled={isEnhancing}
                                    className="w-full bg-white text-slate-900 hover:bg-slate-100 font-semibold shadow-xl"
                                    leftIcon={<Sparkles className="h-5 w-5" />}
                                >
                                    {isEnhancing ? 'Processing...' : 'Create My Resume'}
                                </Button>
                            </div>
                            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                                <div className="flex items-center gap-2 justify-center">
                                    <Check className="h-4 w-4 text-emerald-300" />
                                    <span className="text-xs text-slate-300">ATS-Optimized</span>
                                </div>
                                <div className="flex items-center gap-2 justify-center">
                                    <Check className="h-4 w-4 text-emerald-300" />
                                    <span className="text-xs text-slate-300">Professional</span>
                                </div>
                                <div className="flex items-center gap-2 justify-center">
                                    <Check className="h-4 w-4 text-emerald-300" />
                                    <span className="text-xs text-slate-300">Instant</span>
                                </div>
                            </div>
                        </motion.section>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AnalysisDashboard;
