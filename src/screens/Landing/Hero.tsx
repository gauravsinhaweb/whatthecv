import { ArrowUpRight, BarChart, ChevronRight } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import { analyzeResume, extractText } from '../../utils/ai';
import './hero.css';

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [keywords, setKeywords] = useState<{ matched: string[], missing: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      navigate(`/${page === 'landing' ? '' : page}`);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const selectedFile = target.files[0];
      setFile(selectedFile);

      try {
        setIsAnalyzing(true);
        const resumeText = await extractText(selectedFile);
        const analysis = await analyzeResume(resumeText);

        setScore(analysis.score);
        setKeywords(analysis.keywords);
      } catch (error) {
        console.error('Analysis error:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white overflow-hidden">
      <header className="relative pt-20 pb-24 md:pt-28 md:pb-36 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 overflow-hidden">
        {/* Active users indicator */}
        <div className="absolute top-4 left-4 md:top-6 md:left-8 z-20">
          <div className="group flex items-center bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_4px_-2px_rgba(0,0,0,0.02),inset_0_1px_0.5px_rgba(255,255,255,0.6)] border border-emerald-100/40 hover:shadow-[0_6px_16px_-2px_rgba(0,0,0,0.1),0_2px_8px_-2px_rgba(0,0,0,0.05),inset_0_1px_0.5px_rgba(255,255,255,0.6)] hover:border-emerald-200/60 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer overflow-hidden">
            <div className="relative flex items-center justify-center mr-2.5">
              <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-sm"></div>
              <div className="absolute w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-70"></div>
              <div className="absolute w-3 h-3 bg-emerald-400 rounded-full animate-pulse opacity-30"></div>
            </div>
            <div className="flex flex-row items-center">
              <span className="text-xs font-semibold bg-gradient-to-br from-slate-800 to-slate-700 bg-clip-text text-transparent">39</span>
              {/* <span className="text-xs font-medium text-slate-600 ml-0.5 whitespace-nowrap">users</span> */}
              <span className="ml-1 opacity-100 transition-opacity duration-300 text-xs text-emerald-600">•&nbsp;Online</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 opacity-30" />
        <div className="absolute inset-0">
          <div
            className={`absolute inset-0 bg-grid-slate-900/[0.03] bg-[size:20px_20px] transition-opacity duration-500 opacity-100`}
            style={{ backdropFilter: 'blur(0px)' }}
          />
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-56 transform-gpu blur-3xl opacity-30">
            <svg viewBox="0 0 1368 1521" width="800" height="800" xmlns="http://www.w3.org/2000/svg">
              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g fill="#3B82F6" fillRule="nonzero">
                  <path d="M860.52,550a138.19,138.19,0,0,1,25.42,9.79A121.83,121.83,0,0,1,924.35,585a119.16,119.16,0,0,1,38.35,87.08c.15,54.12-19.72,69.79-21.35,129.45-1.65,60.92,17.54,86.71,12.74,96.54-5.37,11-44.85,30.21-173.44,11.32-96.25-14.13-160.17-50.08-155.11-78.39,5.82-32.68,93.61-18.6,125.3-56.66,27.81-33.55,11.08-84.5,52.25-130.15C847.59,586.37,860.52,550,860.52,550Z" />
                </g>
              </g>
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-56 transform-gpu blur-3xl opacity-20">
            <svg viewBox="0 0 1368 1521" width="800" height="800" xmlns="http://www.w3.org/2000/svg">
              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g fill="#8B5CF6" fillRule="nonzero">
                  <path d="M860.52,550a138.19,138.19,0,0,1,25.42,9.79A121.83,121.83,0,0,1,924.35,585a119.16,119.16,0,0,1,38.35,87.08c.15,54.12-19.72,69.79-21.35,129.45-1.65,60.92,17.54,86.71,12.74,96.54-5.37,11-44.85,30.21-173.44,11.32-96.25-14.13-160.17-50.08-155.11-78.39,5.82-32.68,93.61-18.6,125.3-56.66,27.81-33.55,11.08-84.5,52.25-130.15C847.59,586.37,860.52,550,860.52,550Z" />
                </g>
              </g>
            </svg>
          </div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 transform opacity-100 translate-y-0`}>
              <div className="inline-block px-4 py-1.5 bg-blue-100 rounded-full text-blue-700 font-medium text-sm mb-6">
                AI-Powered Resume Platform
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Build an <span className="text-blue-600 relative inline-block">
                  ATS-Optimized
                  <span className="absolute -bottom-2 left-0 right-0 h-1.5 bg-blue-600 rounded-full transform scale-x-100 origin-bottom" />
                </span> Resume
              </h1>
              <div className="mt-3 inline-block px-4 py-2 cursor-pointer bg-gradient-to-r from-pink-600 to-red-600 text-white font-medium text-sm rounded-lg transform rotate-[-1deg] shadow-md hover:rotate-0 ">
                <span className="italic">"No fluff, no buzzwords, just brutal optimization"</span>
              </div>
              <p className="mt-6 text-xl text-slate-600 leading-relaxed max-w-xl">
                Leverage AI to create, analyze, and improve your resume for maximum success with Applicant Tracking Systems.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-5">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                />
                <Button
                  size="lg"
                  onClick={handleUploadClick}
                  className="rounded-full transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg group"
                  isLoading={isAnalyzing}
                >
                  <span>{isAnalyzing ? 'Analyzing...' : 'Try ATS Checker'}</span>
                  <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:rotate-45" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleNavigate('templates')}
                  className="rounded-full transition-all duration-300 hover:translate-y-[-2px] hover:border-blue-400 group"
                >
                  <span>Browse Templates</span>
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
            <div className={`transition-all duration-1000 delay-300 transform opacity-100 translate-y-0`}>
              <div className={`bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl relative md:left-10 border ${score !== null ? 'border-blue-300 shadow-blue-100/50' : 'border-slate-100'} hover:shadow-2xl transition-all duration-500 ${score !== null ? 'animate-pulse-once' : ''}`}>
                <div className="absolute -top-3 -right-3 px-4 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-medium shadow-md">
                  {score !== null ? 'Your Results' : 'Live Demo'}
                </div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-800">ATS Score Preview</h3>
                </div>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Compatibility Score</p>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{score !== null ? `${score}%` : '82%'}</h3>
                  </div>
                  <div className="p-4 bg-blue-100 rounded-full">
                    <BarChart className="h-7 w-7 text-blue-600" />
                  </div>
                </div>
                <ProgressBar value={score !== null ? score : 82} max={100} size="md" className="mt-2 mb-6" />
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 transition-all hover:shadow-md">
                    <h4 className="font-medium text-slate-800 text-sm">Keywords Match</h4>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {keywords && keywords.matched.length > 0 ? (
                        keywords.matched.slice(0, 3).map((keyword, idx) => (
                          <span key={idx} className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                            {keyword}
                          </span>
                        ))
                      ) : (
                        <>
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                            React
                          </span>
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                            TypeScript
                          </span>
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                            JavaScript
                          </span>
                        </>
                      )}
                      {keywords && keywords.missing.length > 0 ? (
                        keywords.missing.slice(0, 2).map((keyword, idx) => (
                          <span key={idx} className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                            {keyword}
                          </span>
                        ))
                      ) : (
                        <>
                          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                            Docker
                          </span>
                          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                            AWS
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button
                    fullWidth
                    className="mt-4 rounded-xl shadow-sm hover:shadow-lg transition-all bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 hover:from-blue-600 hover:to-indigo-600"
                    onClick={() => handleNavigate('upload')}
                  >
                    {score !== null ? 'View Full Insight' : 'Try with Your Resume'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Dashboard;