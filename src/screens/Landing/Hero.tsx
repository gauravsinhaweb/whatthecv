import { ArrowRight, ArrowUpRight, BarChart, ChevronRight, FileText, LayoutTemplate, Search, Shield } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import ProgressBar from '../../components/ui/ProgressBar';
import { analyzeResume, extractResumeText } from '../../utils/ai';
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
        const resumeText = await extractResumeText(selectedFile);
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
              <div className="mt-3 inline-block px-4 py-2 bg-gradient-to-r from-pink-600 to-red-600 text-white font-medium text-sm rounded-lg transform rotate-[-1deg] shadow-md">
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

      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/30 to-white pointer-events-none"></div>
        <div className="absolute top-0 right-0 transform -translate-y-1/4 translate-x-1/4 opacity-10">
          <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="250" cy="250" r="250" fill="#3B82F6" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 transform translate-y-1/4 -translate-x-1/4 opacity-10">
          <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="250" cy="250" r="250" fill="#8B5CF6" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-block px-4 py-1.5 bg-blue-100 rounded-full text-blue-700 font-medium text-sm mb-4">
              Why Choose Us
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-5">
              Built for Candidates and Recruiters
            </h2>
            <p className="text-xl text-slate-600">
              A complete platform to optimize your job search and hiring process
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-20">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-10 shadow-lg border border-blue-100">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-blue-500 text-white mb-6 shadow-md">
                  <BarChart className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">ATS Optimization</h3>
                <p className="text-lg text-slate-700 mb-6">
                  Get your resume scored against Applicant Tracking Systems and receive detailed improvement suggestions to increase your chances of landing interviews.
                </p>
                <ul className="space-y-3 mb-8">
                  {['Keyword analysis', 'Format compatibility', 'Content assessment', 'Improvement recommendations'].map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <div className="mr-3 mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleNavigate('upload')}
                  className="rounded-xl transition-all duration-300 hover:translate-y-[-2px] shadow-md hover:shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0"
                >
                  Try ATS Checker <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 md:p-10 shadow-lg border border-emerald-100">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-emerald-500 text-white mb-6 shadow-md">
                  <LayoutTemplate className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Professional Templates</h3>
                <p className="text-lg text-slate-700 mb-6">
                  Choose from multiple ATS-friendly templates designed specifically for tech professionals and other industries.
                </p>
                <ul className="space-y-3 mb-8">
                  {['Modern designs', 'Industry-specific formats', 'Customizable sections', 'Export to multiple formats'].map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <div className="mr-3 mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleNavigate('templates')}
                  className="rounded-xl transition-all duration-300 hover:translate-y-[-2px] shadow-md hover:shadow-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0"
                >
                  Browse Templates <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Shield className="h-7 w-7 text-amber-600" />,
                  bgColor: "bg-amber-100",
                  title: "Privacy Control",
                  description: "Choose whether your resume is visible to recruiters or keep it private while you work on it.",
                  features: ['Profile visibility settings', 'Data protection', 'Selective sharing'],
                  cta: "Learn more",
                  link: "candidate-portal",
                  textColor: "text-amber-600",
                  hoverColor: "hover:text-amber-700",
                  buttonColor: "bg-amber-600 hover:bg-amber-700"
                },
                {
                  icon: <FileText className="h-7 w-7 text-purple-600" />,
                  bgColor: "bg-purple-100",
                  title: "Job Targeting",
                  description: "Tailor your resume for specific job descriptions to maximize your match score.",
                  features: ['Job description analysis', 'Keyword suggestions', 'Skills matching'],
                  cta: "Target your resume",
                  link: "upload",
                  textColor: "text-purple-600",
                  hoverColor: "hover:text-purple-700",
                  buttonColor: "bg-purple-600 hover:bg-purple-700"
                },
                {
                  icon: <Search className="h-7 w-7 text-pink-600" />,
                  bgColor: "bg-pink-100",
                  title: "For Recruiters",
                  description: "Find matching candidates by uploading your job description and filtering by skills.",
                  features: ['Candidate database', 'Skills filtering', 'Direct messaging'],
                  cta: "Post a job",
                  link: "recruiter-portal",
                  textColor: "text-pink-600",
                  hoverColor: "hover:text-pink-700",
                  buttonColor: "bg-pink-600 hover:bg-pink-700"
                }
              ].map((feature, index) => (
                <Card key={index} className="border border-slate-100 rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-2 overflow-hidden">
                  <div className={`h-2 ${feature.buttonColor.split(' ')[0]}`}></div>
                  <CardContent className="pt-8 pb-6">
                    <div className={`w-14 h-14 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                    <p className="text-slate-600 mb-4">
                      {feature.description}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {feature.features.map((item, i) => (
                        <li key={i} className="flex items-center text-sm">
                          <div className={`w-1.5 h-1.5 rounded-full ${feature.textColor} mr-2`}></div>
                          <span className="text-slate-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`rounded-xl text-white ${feature.buttonColor} transition-all duration-300 hover:shadow`}
                      size="sm"
                      onClick={() => handleNavigate(feature.link)}
                    >
                      {feature.cta}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-24 text-center">
              <div className="inline-block rounded-full px-6 py-3 bg-blue-100 text-blue-600 font-medium max-w-lg mx-auto">
                "Our platform is designed to bridge the gap between qualified candidates and their dream jobs."
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-slate-50 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 transform translate-y-1/4 translate-x-1/4 opacity-10">
          <svg width="600" height="600" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_328_83)">
              <path d="M600 0H0V600H600V0Z" fill="#4F46E5" />
            </g>
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-4 py-1.5 bg-blue-100 rounded-full text-blue-700 font-medium text-sm mb-4">
              Simple Process
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-5">
              How It Works
            </h2>
            <p className="text-xl text-slate-600">
              Three simple steps to get started with your optimized resume
            </p>
          </div>

          <div className="relative mt-20">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-100 via-blue-300 to-indigo-200 transform -translate-y-1/2 rounded-full z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 relative">
              {[
                {
                  number: "1",
                  title: "Upload Your Resume",
                  description: "Upload your existing resume or start from scratch with our templates.",
                  icon: <FileText className="h-8 w-8 text-white" />,
                  color: "from-blue-500 to-blue-600"
                },
                {
                  number: "2",
                  title: "AI Analysis",
                  description: "Our AI analyzes your resume for ATS compatibility and suggests improvements.",
                  icon: <BarChart className="h-8 w-8 text-white" />,
                  color: "from-indigo-500 to-indigo-600"
                },
                {
                  number: "3",
                  title: "Optimize & Export",
                  description: "Implement the suggestions, choose your privacy settings, and export your optimized resume.",
                  icon: <ArrowUpRight className="h-8 w-8 text-white" />,
                  color: "from-purple-500 to-purple-600"
                }
              ].map((step, index) => (
                <div key={index} className="relative z-10 group">
                  <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-500 group-hover:-translate-y-6 border border-slate-100">
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                      <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center shadow-lg border-4 border-white group-hover:scale-110 transition-all duration-300`}>
                        {step.icon}
                      </div>
                    </div>
                    <div className="mt-12 text-center">
                      <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                        Step {step.number}
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-4">{step.title}</h3>
                      <p className="text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-20">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center shadow-md border-4 border-white">
                        <ArrowRight className="h-5 w-5 text-indigo-500" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-slate-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100/[0.03] bg-[size:24px_24px]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Resume<span className="text-blue-400">AI</span></h3>
              <p className="text-slate-400 leading-relaxed">
                Build ATS-optimized resumes that stand out to both algorithms and human recruiters.
              </p>
              <div className="flex space-x-4 mt-6">
                {[
                  {
                    path: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z",
                    ariaLabel: "Twitter"
                  },
                  {
                    path: "M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z",
                    ariaLabel: "Facebook"
                  },
                  {
                    path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
                    ariaLabel: "LinkedIn"
                  }
                ].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
                    aria-label={social.ariaLabel}
                  >
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d={social.path}></path>
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-white">For Candidates</h4>
              <ul className="space-y-3">
                {[
                  { label: "ATS Checker", link: "upload" },
                  { label: "Resume Templates", link: "templates" },
                  { label: "AI Suggestions", link: "create-resume" },
                  { label: "Privacy Settings", link: "candidate-portal" }
                ].map((item, index) => (
                  <li key={index}>
                    <button
                      className="text-slate-400 hover:text-white transition-colors flex items-center group"
                      onClick={() => handleNavigate(item.link)}
                    >
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-white">For Recruiters</h4>
              <ul className="space-y-3">
                {[
                  { label: "Post Jobs", link: "recruiter-portal" },
                  { label: "Search Candidates", link: "recruiter-portal" },
                  { label: "Filter by Skills", link: "recruiter-portal" },
                  { label: "Contact Matches", link: "recruiter-portal" }
                ].map((item, index) => (
                  <li key={index}>
                    <button
                      className="text-slate-400 hover:text-white transition-colors flex items-center group"
                      onClick={() => handleNavigate(item.link)}
                    >
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Company</h4>
              <ul className="space-y-3">
                {[
                  { label: "About Us", link: "#" },
                  { label: "Privacy Policy", link: "#" },
                  { label: "Terms of Service", link: "#" },
                  { label: "Contact", link: "#" }
                ].map((item, index) => (
                  <li key={index}>
                    <button className="text-slate-400 hover:text-white transition-colors flex items-center group">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>© {new Date().getFullYear()} WhatTheCV. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;