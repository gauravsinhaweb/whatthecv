import { motion, useScroll, useTransform } from 'framer-motion';
import {
    ArrowUpRight,
    BarChart,
    ChevronRight,
    FileCheck,
    FileText,
    Github,
    Linkedin,
    Mail,
    Search,
    Target,
    ThumbsUp,
    Twitter
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import FaqSection from '../../components/landing/FaqSection';
import Button from '../../components/ui/Button';
import { cardVariants, containerVariants, itemVariants } from '../../utils/animations';
import './landing.css';
import resumeBuilderImg from '/assets/create-resume.png';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    const handleNavigate = (path: string) => {
        navigate(path);
    };

    const footerLinks = [
        {
            title: "Product",
            links: [
                { name: "Templates", path: "/templates" },
                { name: "Resume Builder", path: "/create-resume" },
                { name: "ATS Checker", path: "/analyze" },
                { name: "For Recruiters", path: "/recruiter-coming-soon" }
            ]
        },
        {
            title: "Resources",
            links: [
                { name: "Feedback", path: "https://docs.google.com/forms/d/e/1FAIpQLScDwpgHCKzVwUaxGGDDAxR6mBhJfTgy5O0Je2Ldt07KZ2we5g/viewform?usp=sharing&ouid=113476487922478109524" },
            ]
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50">
                {/* GitHub Badges */}
                <div className="absolute top-6 right-4 z-30 flex items-center">
                    <a
                        href="https://github.com/gauravsinhaweb/whatthecv"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-md gap-1.5 text-slate-800 hover:text-slate-900 transition-colors hover:-translate-y-[2px] shadow-sm hover:shadow-md"
                    >
                        <Github className="h-4 w-4" />
                        <span className="text-xs font-medium">Star on GitHub</span>
                    </a>
                </div>

                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute inset-0 bg-grid-slate-900/[0.03] bg-[size:20px_20px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#f8faff] via-[#f8faff]/80 to-transparent pointer-events-none" />
                </div>
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-56 transform-gpu blur-3xl opacity-30">
                    <svg viewBox="0 0 1368 1521" width="800" height="800" xmlns="http://www.w3.org/2000/svg">
                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <g fill="#3B82F6" fillRule="nonzero">
                                <path d="M860.52,550a138.19,138.19,0,0,1,25.42,9.79A121.83,121.83,0,0,1,924.35,585a119.16,119.16,0,0,1,38.35,87.08c.15,54.12-19.72,69.79-21.35,129.45-1.65,60.92,17.54,86.71,12.74,96.54-5.37,11-44.85,30.21-173.44,11.32-96.25-14.13-160.17-50.08-155.11-78.39,5.82-32.68,93.61-18.6,125.3-56.66,27.81-33.55,11.08-84.5,52.25-130.15C847.59,586.37,860.52,550,860.52,550Z" />
                            </g>
                        </g>
                    </svg>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col items-center text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-block px-4 py-1.5 bg-blue-100 rounded-full text-blue-700 font-medium text-sm mb-6"
                        >
                            AI-Powered Resume Platform
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 50, duration: 0.8, delay: 0.2 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight max-w-5xl"
                        >
                            Build an <span className="text-blue-600 relative inline-block">
                                ATS-Optimized
                                <motion.span
                                    className="absolute -bottom-2 left-0 right-0 h-1.5 bg-blue-600 rounded-full"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
                                />
                            </span> Resume That Gets You Hired
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                            className="mt-8 text-xl text-slate-600 max-w-2xl"
                        >
                            Our AI-powered platform helps you create, analyze, and optimize your resume for maximum success with Applicant Tracking Systems.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.6 }}
                            className="mt-10 flex flex-col sm:flex-row gap-5"
                        >
                            <Button
                                size="lg"
                                onClick={() => handleNavigate('/analyze')}
                                className="rounded-full transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg group"
                            >
                                <span>Analyze Your Resume</span>
                                <motion.div
                                    whileHover={{ rotate: 45 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                >
                                    <ArrowUpRight className="ml-2 h-4 w-4" />
                                </motion.div>
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => handleNavigate('/templates')}
                                className="rounded-full transition-all duration-300 hover:translate-y-[-2px] hover:border-blue-400 group"
                            >
                                <span>Browse Templates</span>
                                <motion.div
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </motion.div>
                            </Button>
                        </motion.div>
                    </div>

                    <motion.div
                        style={{ opacity, scale }}
                        className="relative max-w-4xl mx-auto"
                    >
                        <div className="absolute -right-4 -top-4 bg-blue-500 text-white px-4 py-2 rounded-lg font-medium z-10 shadow-lg">
                            Live Preview
                        </div>
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                            <video
                                autoPlay
                                muted
                                playsInline
                                loop
                                src="/assets/demo.mp4"
                                className="w-full h-auto"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={containerVariants}
                        className="text-center mb-16"
                    >
                        <motion.div variants={itemVariants} className="inline-block px-4 py-1.5 bg-indigo-100 rounded-full text-indigo-700 font-medium text-sm mb-6">
                            Key Features
                        </motion.div>
                        <motion.h2 variants={itemVariants} className="text-4xl font-bold text-slate-900 mb-6">
                            Everything You Need For Resume Success
                        </motion.h2>
                        <motion.p variants={itemVariants} className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Our platform provides all the tools you need to create a resume that passes through Applicant Tracking Systems and impresses recruiters.
                        </motion.p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <FileCheck className="h-8 w-8 text-blue-500" />,
                                title: "ATS Compatibility Check",
                                description: "Analyze your resume against 200+ ATS systems to ensure maximum visibility to hiring managers.",
                                highlight: "99% Success Rate"
                            },
                            {
                                icon: <Search className="h-8 w-8 text-blue-500" />,
                                title: "AI Keyword Optimization",
                                description: "Our AI scans job descriptions and intelligently integrates relevant keywords into your resume.",
                                highlight: "2x Interview Rate"
                            },
                            {
                                icon: <Target className="h-8 w-8 text-blue-500" />,
                                title: "Detailed ATS Score",
                                description: "Get a comprehensive score with section-by-section feedback and actionable improvements.",
                                highlight: "Step-by-Step Guidance"
                            },
                            {
                                icon: <FileText className="h-8 w-8 text-blue-500" />,
                                title: "Industry-Specific Templates",
                                description: "Choose from 30+ ATS-friendly templates tailored for different industries and career levels.",
                                highlight: "HR-Approved Designs"
                            },
                            {
                                icon: <BarChart className="h-8 w-8 text-blue-500" />,
                                title: "Skills Gap Analysis",
                                description: "Compare your skills against job requirements and get personalized recommendations to stand out.",
                                highlight: "Talent Matching"
                            },
                            {
                                icon: <ThumbsUp className="h-8 w-8 text-blue-500" />,
                                title: "AI Content Enhancement",
                                description: "Transform bland bullet points into compelling achievements with our AI content assistant.",
                                highlight: "Impact-Driven Language"
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                whileHover="hover"
                                viewport={{ once: true, amount: 0.3 }}
                                className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full relative overflow-hidden group"
                            >
                                <div className="absolute right-0 top-0 bg-blue-600/10 text-blue-700 px-3 py-1 text-xs font-semibold rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {feature.highlight}
                                </div>
                                <motion.div
                                    className="mb-5 p-3 bg-blue-50 rounded-full self-start"
                                    whileHover={{ y: -5, scale: 1.1 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    {feature.icon}
                                </motion.div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Resume Builder Preview Section */}
            <section className="py-24 bg-gradient-to-br from-indigo-50 via-blue-50 to-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={containerVariants}
                        className="text-center mb-16"
                    >
                        <motion.div variants={itemVariants} className="inline-block px-4 py-1.5 bg-indigo-100 rounded-full text-indigo-700 font-medium text-sm mb-6">
                            Powerful Builder
                        </motion.div>
                        <motion.h2 variants={itemVariants} className="text-4xl font-bold text-slate-900 mb-6">
                            Intuitive Resume Builder
                        </motion.h2>
                        <motion.p variants={itemVariants} className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Create professional resumes with our easy-to-use drag-and-drop builder
                        </motion.p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, type: "spring" }}
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Modern Resume Editor</h3>
                            <p className="mb-6 text-slate-600">Our intuitive interface makes it easy to create professional resumes in minutes. No design skills required.</p>

                            <ul className="space-y-4">
                                {[
                                    "Drag-and-drop interface for easy editing",
                                    "Real-time preview of your resume",
                                    "AI-powered content suggestions",
                                    "One-click formatting options",
                                    "Export to PDF, Word, or plain text"
                                ].map((item, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        viewport={{ once: true }}
                                        className="flex items-center"
                                    >
                                        <span className="h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                        <span className="text-slate-700">{item}</span>
                                    </motion.li>
                                ))}
                            </ul>

                            <motion.div
                                className="mt-8"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <Button
                                    size="lg"
                                    onClick={() => handleNavigate('/create-resume')}
                                    className="rounded-xl transition-all duration-300 hover:shadow-lg"
                                >
                                    <span>Try Resume Builder</span>
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </Button>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true, amount: 0.3 }}
                            className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-200"
                        >
                            <img
                                src={resumeBuilderImg}
                                alt="Resume Builder Interface"
                                className="w-full h-auto"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'https://placehold.co/800x600/EEF2FF/3B82F6?text=Resume+Builder+Interface';
                                }}
                            />
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 0.5 }}
                                viewport={{ once: true }}
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={containerVariants}
                        className="text-center mb-16"
                    >
                        <motion.div variants={itemVariants} className="inline-block px-4 py-1.5 bg-indigo-100 rounded-full text-indigo-700 font-medium text-sm mb-6">
                            Simple Process
                        </motion.div>
                        <motion.h2 variants={itemVariants} className="text-4xl font-bold text-slate-900 mb-6">
                            How It Works
                        </motion.h2>
                        <motion.p variants={itemVariants} className="text-xl text-slate-600 max-w-2xl mx-auto">
                            From upload to interview-ready in minutes
                        </motion.p>
                    </motion.div>

                    <div className="relative max-w-5xl mx-auto">
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-blue-200 -translate-y-1/2 hidden md:block"></div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
                            {[
                                {
                                    step: "01",
                                    title: "Upload or Create",
                                    description: "Upload your existing resume or build from scratch with our AI-assisted editor.",
                                    action: "Get started with any format - PDF, Word, or plain text.",
                                    icon: <FileText className="h-6 w-6" />
                                },
                                {
                                    step: "02",
                                    title: "AI Analysis & Optimization",
                                    description: "Our AI analyzes your resume against job descriptions and provides targeted improvements.",
                                    action: "Receive a detailed ATS score with actionable feedback.",
                                    icon: <BarChart className="h-6 w-6" />
                                },
                                {
                                    step: "03",
                                    title: "Download & Apply",
                                    description: "Export your optimized resume in multiple formats ready for job applications.",
                                    action: "Track your application success with our dashboard.",
                                    icon: <ThumbsUp className="h-6 w-6" />
                                }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.2, type: "spring", stiffness: 50 }}
                                    viewport={{ once: true, amount: 0.5 }}
                                    className="relative z-10"
                                >
                                    <motion.div
                                        className="bg-blue-600 text-white h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-8 relative"
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 300, delay: index * 0.2 + 0.3 }}
                                        viewport={{ once: true }}
                                    >
                                        <span className="text-2xl font-bold">{item.step}</span>
                                        <motion.div
                                            className="absolute inset-0 rounded-full border-4 border-blue-200"
                                            initial={{ scale: 1.2, opacity: 0 }}
                                            animate={{ scale: 1.5, opacity: 0 }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 1.5,
                                                delay: index * 0.2
                                            }}
                                        />
                                    </motion.div>

                                    <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-shadow duration-300">
                                        <div className="p-3 bg-blue-50 rounded-full inline-block mb-4">
                                            {item.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                        <p className="text-slate-600 mb-4">{item.description}</p>
                                        <p className="text-blue-600 font-medium text-sm">{item.action}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        viewport={{ once: true, amount: 0.5 }}
                        className="text-center mt-16"
                    >
                        <Button
                            size="lg"
                            onClick={() => handleNavigate('/analyze')}
                            className="rounded-full transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg"
                        >
                            Get Started Now
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* FAQ Section */}
            <FaqSection />

            {/* Improved Footer with Navigation */}
            <footer className="bg-slate-900 text-white pt-16 pb-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
                        <div className="col-span-2">
                            <motion.h3
                                className="text-2xl font-bold mb-4 gradient-text"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                WhatTheCV
                            </motion.h3>
                            <p className="text-slate-400 mb-6 max-w-md">
                                The AI-powered resume platform that helps you create, analyze, and optimize your resume for maximum success with Applicant Tracking Systems.
                            </p>
                            <div className="flex space-x-4">
                                {[
                                    { icon: <Twitter className="h-5 w-5" />, href: "https://x.com/defigoro" },
                                    { icon: <Linkedin className="h-5 w-5" />, href: "https://www.linkedin.com/in/gauravsinhaa/" },
                                    { icon: <Github className="h-5 w-5" />, href: "https://github.com/gauravsinhaweb" },
                                    { icon: <Mail className="h-5 w-5" />, href: "mailto:sinhagaurav.me@gmail.com" }
                                ].map((social, i) => (
                                    <motion.a
                                        key={i}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-slate-800 p-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
                                        whileHover={{ y: -5 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        {social.icon}
                                    </motion.a>
                                ))}
                            </div>
                        </div>

                        {footerLinks.map((column, i) => (
                            <div key={i}>
                                <motion.h4
                                    className="font-semibold text-lg mb-4 text-white"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * i }}
                                    viewport={{ once: true }}
                                >
                                    {column.title}
                                </motion.h4>
                                <ul className="space-y-3">
                                    {column.links.map((link, j) => (
                                        <motion.li
                                            key={j}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * i + 0.05 * j }}
                                            viewport={{ once: true }}
                                        >
                                            <a
                                                href={link.path}
                                                className="text-slate-400 hover:text-white transition-colors duration-300"
                                                target={link.path.startsWith('http') ? "_blank" : undefined}
                                                rel={link.path.startsWith('http') ? "noopener noreferrer" : undefined}
                                            >
                                                {link.name}
                                            </a>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        <div className="hidden sm:ml-6 sm:flex sm:items-center self-start">
                            <a href="https://www.buymeacoffee.com/gauravsinha" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 40px !important;width: 160px !important;" />
                            </a>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-8 mt-8 text-center text-slate-500 text-sm">
                        <p>© {new Date().getFullYear()} WhatTheCV. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage; 