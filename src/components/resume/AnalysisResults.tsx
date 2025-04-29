import React, { useState } from 'react';
import { ArrowDown, ArrowUp, Award, Check, ChevronDown, ChevronUp, Download, FileQuestion, FileText, FileWarning, Loader, Plus, Target, X } from 'lucide-react';
import Button from '../ui/Button';
import './styles.css';

interface AnalysisResultsProps {
    analysisResult: any;
    extractedText: string;
    file: File | null;
    isGeneratingImprovements: boolean;
    sectionImprovements: { [key: string]: string[] };
    generateSectionImprovement: (section: string) => Promise<void>;
    clearFile: () => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
    analysisResult,
    extractedText,
    file,
    isGeneratingImprovements,
    sectionImprovements,
    generateSectionImprovement,
    clearFile,
}) => {
    const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
    const [selectedKeywordTab, setSelectedKeywordTab] = useState<string>('priority');

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 80) return 'bg-emerald-100';
        if (score >= 60) return 'bg-yellow-100';
        return 'bg-red-100';
    };

    const getScoreGradient = (score: number) => {
        if (score >= 80) return 'from-emerald-500 to-emerald-600';
        if (score >= 60) return 'from-yellow-500 to-yellow-600';
        return 'from-red-500 to-red-600';
    };

    const getScoreMessage = (score: number) => {
        if (score >= 80) return 'Great! Your resume is well-optimized for ATS systems.';
        if (score >= 60) return 'Your resume needs some improvements for better ATS compatibility.';
        return 'Your resume needs significant improvements to pass ATS filters.';
    };

    // If the document is not a resume, show a specialized UI
    if (analysisResult && analysisResult.isResume === false) {
        return (
            <div className="space-y-6">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 shadow-lg mb-8">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center mb-4 md:mb-0">
                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                                <FileWarning className="h-8 w-8 text-orange-600" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-2xl font-bold text-white">Not a Resume</h3>
                                <p className="text-orange-100">The uploaded document doesn't appear to be a resume</p>
                            </div>
                        </div>

                        {file && (
                            <div className="flex items-center px-4 py-2 bg-white bg-opacity-20 backdrop-blur-md rounded-lg">
                                <FileText className="h-4 w-4 text-white mr-2" />
                                <span className="text-sm text-white mr-2">{file.name}</span>
                                <span className="text-xs text-orange-200">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                        <div className="flex-shrink-0 relative">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                                <FileQuestion className="h-12 w-12 text-orange-500" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md">
                                <X className="h-6 w-6" />
                            </div>
                        </div>

                        <div className="flex-grow">
                            <h3 className="text-2xl font-semibold text-slate-800 mb-2">Document Type Mismatch</h3>
                            <p className="text-slate-600">
                                Our AI couldn't identify this document as a resume or CV. For accurate analysis,
                                please upload a document that contains standard resume sections.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-5 shadow-sm">
                            <h4 className="font-medium text-orange-800 mb-4 flex items-center">
                                <span className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center mr-2">
                                    <Check className="h-4 w-4 text-orange-600" />
                                </span>
                                What a resume should include:
                            </h4>
                            <ul className="space-y-3">
                                <li className="flex items-start text-orange-700 bg-white bg-opacity-60 p-3 rounded-lg">
                                    <Check className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span>Contact information (name, email, phone)</span>
                                </li>
                                <li className="flex items-start text-orange-700 bg-white bg-opacity-60 p-3 rounded-lg">
                                    <Check className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span>Work experience with dates and descriptions</span>
                                </li>
                                <li className="flex items-start text-orange-700 bg-white bg-opacity-60 p-3 rounded-lg">
                                    <Check className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span>Education section with degrees/certifications</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 shadow-sm">
                            <h4 className="font-medium text-blue-800 mb-4 flex items-center">
                                <span className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center mr-2">
                                    <Check className="h-4 w-4 text-blue-600" />
                                </span>
                                Additional recommended sections:
                            </h4>
                            <ul className="space-y-3">
                                <li className="flex items-start text-blue-700 bg-white bg-opacity-60 p-3 rounded-lg">
                                    <Check className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span>Skills section relevant to your industry</span>
                                </li>
                                <li className="flex items-start text-blue-700 bg-white bg-opacity-60 p-3 rounded-lg">
                                    <Check className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span>Professional summary or career objective</span>
                                </li>
                                <li className="flex items-start text-blue-700 bg-white bg-opacity-60 p-3 rounded-lg">
                                    <Check className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span>Achievements, certifications, or projects</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-4 pt-4 border-t border-slate-200">
                        <p className="text-slate-500 text-sm max-w-md text-center md:text-left">
                            Need help creating a resume? Our analysis tool works best with properly formatted resume documents.
                        </p>
                        <Button
                            onClick={clearFile}
                            size="lg"
                            className="px-8 min-w-[200px] bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md"
                        >
                            Upload a Resume Instead
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg mb-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-inner">
                            <Award className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-2xl font-bold text-white">Analysis Complete</h3>
                            <p className="text-blue-100">Your resume has been analyzed by our AI system</p>
                        </div>
                    </div>

                    {file && (
                        <div className="flex items-center px-4 py-2 bg-white bg-opacity-20 backdrop-blur-md rounded-lg shadow-sm">
                            <FileText className="h-4 w-4 text-white mr-2" />
                            <span className="text-sm text-white mr-2">{file.name}</span>
                            <span className="text-xs text-blue-200">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Score Card */}
                <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="mb-4 flex justify-between items-center">
                        <h4 className="text-lg font-semibold text-slate-700">ATS Compatibility</h4>
                        <div className="px-2 py-1 rounded bg-slate-100 text-xs text-slate-500">Score</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className={`w-36 h-36 rounded-full flex items-center justify-center mb-4 bg-gradient-to-br ${getScoreGradient(analysisResult.score)} p-1`}>
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                <div className="text-center">
                                    <span className={`text-5xl font-bold ${getScoreColor(analysisResult.score)}`}>{analysisResult.score}</span>
                                    <span className={`text-2xl font-bold ${getScoreColor(analysisResult.score)}`}>%</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-slate-600 mb-4">
                                {getScoreMessage(analysisResult.score)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Keywords Section */}
                <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="mb-4 flex justify-between items-center">
                        <h4 className="text-lg font-semibold text-slate-700">Keywords to Add</h4>
                        <div className="px-2 py-1 rounded bg-slate-100 text-xs text-slate-500">
                            {analysisResult.keywords.missing.length} keywords
                        </div>
                    </div>

                    <p className="text-sm text-slate-600 mb-4">
                        Including these keywords will significantly improve your resume's ATS compatibility
                    </p>

                    {analysisResult.keywords.missing.length > 0 ? (
                        <>
                            <div className="border-b border-slate-200 mb-4">
                                <div className="flex overflow-x-auto pb-1 -mb-px hide-scrollbar">
                                    <button
                                        className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 mr-2 transition-colors ${selectedKeywordTab === 'priority' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-300'}`}
                                        onClick={() => setSelectedKeywordTab('priority')}
                                    >
                                        Priority Keywords
                                    </button>
                                    <button
                                        className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 mr-2 transition-colors ${selectedKeywordTab === 'all' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-300'}`}
                                        onClick={() => setSelectedKeywordTab('all')}
                                    >
                                        All Keywords
                                    </button>
                                    <button
                                        className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${selectedKeywordTab === 'grid' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-300'}`}
                                        onClick={() => setSelectedKeywordTab('grid')}
                                    >
                                        Grid View
                                    </button>
                                </div>
                            </div>

                            {/* Priority Keywords Tab */}
                            {selectedKeywordTab === 'priority' && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {analysisResult.keywords.missing.slice(0, 3).map((keyword: string, i: number) => (
                                        <div key={i} className="flex flex-col items-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-3">
                                                <Plus className="h-5 w-5 text-red-600" />
                                            </div>
                                            <div className="text-center">
                                                <div className="font-semibold text-slate-800">{keyword}</div>
                                                <div className="text-xs text-slate-500 mt-1">Add to your resume</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* All Keywords Tab - List View */}
                            {selectedKeywordTab === 'all' && (
                                <div className="space-y-2 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                                    {analysisResult.keywords.missing.map((keyword: string, i: number) => (
                                        <div key={i} className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors duration-150">
                                            <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center mr-3 flex-shrink-0">
                                                <Plus className="h-4 w-4 text-red-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-800">{keyword}</div>
                                            </div>
                                            {i < 3 && (
                                                <span className="ml-auto px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Priority</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Grid View Tab */}
                            {selectedKeywordTab === 'grid' && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                                    {analysisResult.keywords.missing.map((keyword: string, i: number) => (
                                        <div
                                            key={i}
                                            className={`p-3 rounded-lg border text-center hover:shadow-sm transition-all duration-150 ${i < 3 ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}
                                        >
                                            <div className="text-sm font-medium truncate" title={keyword}>
                                                {keyword}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center p-6">
                            <p className="text-sm text-slate-500 italic">No missing keywords identified</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Suggestions Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 pb-3">
                    <h4 className="text-lg font-semibold text-slate-700">Improvement Suggestions</h4>
                    <p className="text-sm text-slate-500 mt-1">
                        Expand each section to see detailed improvement recommendations
                    </p>
                </div>

                <div className="divide-y divide-slate-200">
                    {analysisResult.suggestions.map((suggestion: any, index: number) => (
                        <div key={index} className={`transition-colors duration-200 ${expandedSections[suggestion.section] ? 'bg-slate-50' : 'hover:bg-slate-50'}`}>
                            <div
                                className="flex justify-between items-center cursor-pointer p-4"
                                onClick={() => toggleSection(suggestion.section)}
                            >
                                <div className="flex items-center">
                                    <div className={`w-10 h-10 rounded-lg ${index % 3 === 0 ? 'bg-blue-100' : index % 3 === 1 ? 'bg-purple-100' : 'bg-orange-100'} flex items-center justify-center mr-3`}>
                                        <span className={`text-sm font-bold ${index % 3 === 0 ? 'text-blue-600' : index % 3 === 1 ? 'text-purple-600' : 'text-orange-600'}`}>
                                            {suggestion.section.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <h5 className="font-medium text-slate-800">{suggestion.section}</h5>
                                        <p className="text-xs text-slate-500">{suggestion.improvements.length} suggestions</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            generateSectionImprovement(suggestion.section);
                                        }}
                                        leftIcon={<Loader className={`h-4 w-4 ${isGeneratingImprovements ? 'animate-spin' : ''}`} />}
                                        disabled={isGeneratingImprovements}
                                    >
                                        AI Improve
                                    </Button>
                                    <div className={`ml-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${expandedSections[suggestion.section] ? 'bg-blue-100' : 'bg-slate-100'}`}>
                                        {expandedSections[suggestion.section] ? (
                                            <ChevronUp className={`h-4 w-4 ${expandedSections[suggestion.section] ? 'text-blue-600' : 'text-slate-400'}`} />
                                        ) : (
                                            <ChevronDown className={`h-4 w-4 ${expandedSections[suggestion.section] ? 'text-blue-600' : 'text-slate-400'}`} />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {expandedSections[suggestion.section] && (
                                <div className="p-4 pt-0">
                                    <div className="ml-13 pl-4 border-l-2 border-blue-200">
                                        <div className="mb-4">
                                            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mb-3">
                                                Improvement Opportunities
                                            </div>
                                            <ul className="space-y-3">
                                                {suggestion.improvements.map((improvement: string, i: number) => (
                                                    <li key={i} className="flex items-start">
                                                        <div className="w-5 h-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5 mr-2">
                                                            <Check className="h-3 w-3 text-blue-600" />
                                                        </div>
                                                        <div className="text-sm text-slate-600 bg-blue-50 p-3 rounded-lg border border-blue-100 flex-grow">
                                                            {improvement}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {sectionImprovements[suggestion.section] && (
                                            <div>
                                                <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full mb-3">
                                                    AI Recommendations
                                                </div>
                                                <ul className="space-y-3">
                                                    {sectionImprovements[suggestion.section].map((improvement, i) => (
                                                        <li key={i} className="flex items-start">
                                                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center mt-0.5 mr-2">
                                                                <Check className="h-3 w-3 text-emerald-600" />
                                                            </div>
                                                            <div className="text-sm text-slate-700 bg-emerald-50 p-3 rounded-lg border border-emerald-100 flex-grow">
                                                                {improvement}
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center pt-4">
                <Button
                    variant="outline"
                    onClick={clearFile}
                >
                    Upload Different Resume
                </Button>
                <div className="flex space-x-3">
                    <Button
                        variant="outline"
                        leftIcon={<Download className="h-4 w-4" />}
                    >
                        Download Report
                    </Button>
                    <Button>
                        View Full Analysis
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AnalysisResults; 