import React, { useEffect, useState } from 'react';
import { BarChart, FileText, Search, Shield, LayoutTemplate, ArrowRight, ChevronRight, ExternalLink, ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import Button from './ui/Button';
import ProgressBar from './ui/ProgressBar';

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);

    const featureInterval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3);
    }, 4000);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(featureInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const features = [
    {
      title: "Optimized for ATS",
      description: "Professional templates designed to pass through Applicant Tracking Systems with ease",
      icon: <BarChart className="h-6 w-6 text-blue-600" />
    },
    {
      title: "AI-Powered Analysis",
      description: "Get actionable feedback on your resume with our advanced AI technology",
      icon: <FileText className="h-6 w-6 text-purple-600" />
    },
    {
      title: "Job-Specific Tailoring",
      description: "Customize your resume for specific job listings to increase your chances",
      icon: <Search className="h-6 w-6 text-emerald-600" />
    }
  ];

  return (
    <div className="bg-white overflow-hidden">
      <header className="relative pt-20 pb-24 md:pt-28 md:pb-36 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 overflow-hidden">
        <div className="absolute inset-0">
          <div
            className={`absolute inset-0 bg-grid-slate-900/[0.03] bg-[size:20px_20px] opacity-0 transition-opacity duration-500 ${isVisible ? 'opacity-100' : ''}`}
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
            <div className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block px-4 py-1.5 bg-blue-100 rounded-full text-blue-700 font-medium text-sm mb-6">
                AI-Powered Resume Platform
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Build an <span className="text-blue-600 relative inline-block">
                  ATS-Optimized
                  <span className="absolute -bottom-2 left-0 right-0 h-1.5 bg-blue-600 rounded-full transform scale-x-100 origin-bottom" />
                </span> Resume
              </h1>
              <p className="mt-6 text-xl text-slate-600 leading-relaxed max-w-xl">
                Leverage AI to create, analyze, and improve your resume for maximum success with Applicant Tracking Systems.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-5">
                <Button
                  size="lg"
                  onClick={() => handleNavigate('upload')}
                  className="rounded-full transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg group"
                >
                  <span>Try ATS Checker</span>
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
            <div className={`transition-all duration-1000 delay-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl relative md:left-10 border border-slate-100 hover:shadow-2xl transition-all duration-300">
                <div className="absolute -top-3 -right-3 px-4 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-medium shadow-md">
                  Live Demo
                </div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-800">ATS Score Preview</h3>
                </div>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Compatibility Score</p>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">82%</h3>
                  </div>
                  <div className="p-4 bg-blue-100 rounded-full">
                    <BarChart className="h-7 w-7 text-blue-600" />
                  </div>
                </div>
                <ProgressBar value={82} max={100} size="md" className="mt-2 mb-6" />
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 transition-all hover:shadow-md">
                    <h4 className="font-medium text-slate-800 text-sm">Keywords Match</h4>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                        React
                      </span>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                        TypeScript
                      </span>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                        JavaScript
                      </span>
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                        Docker
                      </span>
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                        AWS
                      </span>
                    </div>
                  </div>
                  <Button
                    fullWidth
                    className="mt-4 rounded-xl shadow-sm hover:shadow-lg transition-all bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 hover:from-blue-600 hover:to-indigo-600"
                    onClick={() => handleNavigate('upload')}
                  >
                    Try with Your Resume
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
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500">
            {[
              {
                icon: <BarChart className="h-7 w-7 text-blue-600" />,
                bgColor: "bg-blue-100",
                title: "ATS Optimization",
                description: "Get your resume scored against Applicant Tracking Systems and receive detailed improvement suggestions.",
                cta: "Check your score",
                link: "upload",
                textColor: "text-blue-600",
                hoverColor: "hover:text-blue-700"
              },
              {
                icon: <LayoutTemplate className="h-7 w-7 text-emerald-600" />,
                bgColor: "bg-emerald-100",
                title: "Professional Templates",
                description: "Choose from multiple ATS-friendly templates designed for tech professionals.",
                cta: "Browse templates",
                link: "templates",
                textColor: "text-emerald-600",
                hoverColor: "hover:text-emerald-700"
              },
              {
                icon: <Shield className="h-7 w-7 text-amber-600" />,
                bgColor: "bg-amber-100",
                title: "Privacy Control",
                description: "Choose whether your resume is visible to recruiters or keep it private while you work on it.",
                cta: "Learn more",
                link: "candidate-portal",
                textColor: "text-amber-600",
                hoverColor: "hover:text-amber-700"
              },
              {
                icon: <FileText className="h-7 w-7 text-purple-600" />,
                bgColor: "bg-purple-100",
                title: "Job Targeting",
                description: "Tailor your resume for specific job descriptions to maximize your match score.",
                cta: "Target your resume",
                link: "upload",
                textColor: "text-purple-600",
                hoverColor: "hover:text-purple-700"
              },
              {
                icon: <Search className="h-7 w-7 text-pink-600" />,
                bgColor: "bg-pink-100",
                title: "For Recruiters",
                description: "Find matching candidates by uploading your job description and filtering by skills.",
                cta: "Post a job",
                link: "recruiter-portal",
                textColor: "text-pink-600",
                hoverColor: "hover:text-pink-700"
              }
            ].map((feature, index) => (
              <Card key={index} className="border border-slate-100 rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
                <CardContent className="pt-8 pb-6">
                  <div className={`w-14 h-14 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 mb-4">
                    {feature.description}
                  </p>
                  <Button
                    variant="ghost"
                    className={`p-0 h-auto flex items-center ${feature.textColor} ${feature.hoverColor} group`}
                    size="sm"
                    onClick={() => handleNavigate(feature.link)}
                  >
                    {feature.cta} <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 relative">
            <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-2 bg-blue-100 rounded-full z-0"></div>

            {[
              {
                number: "1",
                title: "Upload Your Resume",
                description: "Upload your existing resume or start from scratch with our templates.",
                delay: ""
              },
              {
                number: "2",
                title: "AI Analysis",
                description: "Our AI analyzes your resume for ATS compatibility and suggests improvements.",
                delay: "md:mt-16"
              },
              {
                number: "3",
                title: "Optimize & Export",
                description: "Implement the suggestions, choose your privacy settings, and export your optimized resume.",
                delay: "md:mt-32"
              }
            ].map((step, index) => (
              <div key={index} className={`relative z-10 text-center ${step.delay} transition-all duration-500 hover:-translate-y-2`}>
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-white hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-xl font-bold">{step.number}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{step.title}</h3>
                <p className="text-slate-600 max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <Button
              size="lg"
              onClick={() => handleNavigate('user-select')}
              className="rounded-full px-8 transition-all duration-300 hover:translate-y-[-2px] shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0"
            >
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-slate-900/[0.02] bg-[size:24px_24px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100">
              <div className="text-center mb-10">
                <div className="inline-block px-4 py-1.5 bg-blue-100 rounded-full text-blue-700 font-medium text-sm mb-4">
                  Featured
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                  Unlock the Full Potential of Your Resume
                </h2>
                <p className="text-lg text-slate-600">
                  Join thousands of professionals who have optimized their job applications
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                  {
                    value: "94%",
                    label: "Higher interview rate",
                    bgColor: "bg-blue-50",
                    textColor: "text-blue-600"
                  },
                  {
                    value: "75%",
                    label: "Faster hiring process",
                    bgColor: "bg-emerald-50",
                    textColor: "text-emerald-600"
                  },
                  {
                    value: "10K+",
                    label: "Successful matches",
                    bgColor: "bg-purple-50",
                    textColor: "text-purple-600"
                  }
                ].map((stat, index) => (
                  <div key={index} className={`flex flex-col items-center p-6 rounded-xl ${stat.bgColor} transition-transform duration-300 hover:scale-105`}>
                    <span className={`text-4xl font-bold ${stat.textColor} mb-2`}>{stat.value}</span>
                    <p className="text-sm text-slate-600 text-center">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={() => handleNavigate('user-select')}
                  className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px] bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0"
                >
                  Start Your Journey <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
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
            <p>© {new Date().getFullYear()} Resume Builder AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;