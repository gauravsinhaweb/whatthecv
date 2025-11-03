import { motion, useScroll, useTransform } from 'framer-motion';
import {
    BarChart,
    CheckCircle,
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
import React, { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import FaqSection from '../../components/landing/FaqSection';
import { Item, Section } from '../../components/landing/Section';
import { Video } from '../../components/landing/Video';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { cardVariants, containerVariants, itemVariants } from '../../utils/animations';
import './landing.css';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    const { isAuthenticated, user } = useAuth();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 1]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.85]);

    const handleNavigate = useCallback((path: string) => {
        navigate(path);
    }, [navigate]);

    useEffect(() => {
        if (isAuthenticated && user) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        const preloadCriticalResources = () => {
            const criticalPaths = [
                '/assets/demo.mp4',
                '/assets/create-resume.png',
                '/assets/Launch.svg'
            ];
            criticalPaths.forEach((path) => {
                if (path.endsWith('.mp4')) {
                    const video = document.createElement('video');
                    video.preload = 'metadata';
                    video.src = path;
                } else {
                    const link = document.createElement('link');
                    link.rel = 'preload';
                    link.as = path.endsWith('.png') ? 'image' : 'image';
                    link.href = path;
                    document.head.appendChild(link);
                }
            });
        };
        preloadCriticalResources();
    }, []);

    const footerLinks = useMemo(() => [
        {
            title: "Product",
            links: [
                { name: "Resume Builder", path: "/create-resume" },
                { name: "For Recruiters", path: "/recruiter-coming-soon" },
                { name: "ATS Checker", path: "/analyze" },
                { name: "Templates", path: "/templates" },
            ]
        },
        {
            title: "Resources",
            links: [
                { name: "Terms & Conditions", path: "/terms" },
                { name: "Privacy Policy", path: "/privacy-policy" },
                { name: "Feedback", path: "https://docs.google.com/forms/d/e/1FAIpQLScDwpgHCKzVwUaxGGDDAxR6mBhJfTgy5O0Je2Ldt07KZ2we5g/viewform?usp=sharing&ouid=113476487922478109524" },
                { name: "Peerlist", path: "https://peerlist.io/gauravsinha/project/whatthecv" }
            ]
        }
    ], []);

    return (
        <div className="min-h-screen">

            {/* Hero Section - Split Layout */}
            <Section className="relative pt-8 pb-16 overflow-hidden bg-white paper-texture">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-8rem)]">
                        {/* Left Column - Content */}
                        <motion.div
                            className="flex flex-col justify-center"
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Product Hunt Badge */}
                            <motion.div
                                className="mb-8 relative inline-block group"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                            >
                                <img
                                    src="/project-rank-one-badge-weekly.svg"
                                    alt="#1 Product of the Week"
                                    className="h-14 w-auto cursor-pointer transition-transform hover:scale-105"
                                />
                                {/* Hover Tooltip */}
                                <div className="absolute left-0 top-full mt-3 px-4 py-2.5 bg-white text-slate-700 text-sm font-medium rounded-xl shadow-xl border border-slate-200 opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-10">
                                    #1 Peerlist product of the Week
                                    <div className="absolute -top-1.5 left-6 w-3 h-3 bg-white border-l border-t border-slate-200 transform rotate-45"></div>
                                </div>
                            </motion.div>

                            {/* Main Heading */}
                            <motion.h1
                                className="font-display text-4xl lg:text-5xl xl:text-6xl font-medium text-slate-900 leading-[1.15] mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                Resumes That Get<br />You Interviews. Guaranteed.
                            </motion.h1>

                            {/* Subtitle */}
                            <motion.p
                                className="text-lg text-slate-600 leading-relaxed mb-10 max-w-xl"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                We've helped thousands of professionals land interviews at top companies. Our AI-powered resume builder creates ATS-optimized resumes that cut through filters and put you in front of recruiters.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                className="flex flex-col sm:flex-row gap-4 mb-10"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <motion.button
                                    onClick={() => handleNavigate('/analyze')}
                                    className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Get Started Free
                                </motion.button>
                                <motion.button
                                    onClick={() => handleNavigate('/templates')}
                                    className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all duration-200"
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Browse Templates
                                </motion.button>
                            </motion.div>

                            {/* User Avatars */}
                            <motion.div
                                className="flex items-center gap-3"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                            >
                                <div className="flex -space-x-2">
                                    <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden">
                                        <img
                                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces"
                                            alt="User"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden">
                                        <img
                                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces"
                                            alt="User"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden">
                                        <img
                                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces"
                                            alt="User"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden">
                                        <img
                                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces"
                                            alt="User"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <span className="text-sm text-slate-600 font-medium">
                                    Join 10,000+ professionals
                                </span>
                            </motion.div>
                        </motion.div>

                        {/* Right Column - Visual Showcase */}
                        <motion.div
                            className="relative lg:h-[600px] flex items-center justify-center"
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            {/* Main Image Container */}
                            <div className="relative w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 shadow-2xl">
                                <img
                                    src="/assets/resumepng.png"
                                    alt="Resume Example"
                                    className="w-full h-full object-contain"
                                />

                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none"></div>
                            </div>

                            {/* Floating accent - bottom left */}
                            <motion.div
                                className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-100 rounded-full blur-3xl opacity-60"
                                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.8, 0.6] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            />

                            {/* Floating accent - top right */}
                            <motion.div
                                className="absolute -top-4 -right-4 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-60"
                                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.8, 0.6] }}
                                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                            />
                        </motion.div>
                    </div>
                </div>
            </Section>

            {/* Live Demo Section */}
            <Section className="py-16 lg:py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <div className="container mx-auto px-4 lg:px-8">
                    <motion.div
                        className="mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full font-mono font-normal text-sm uppercase tracking-wider text-slate-600 mb-6"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            ✨ Live Demo
                        </motion.div>
                        <h2 className="font-display text-4xl lg:text-5xl font-medium text-slate-900 mb-4">
                            See Our AI in Action
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl">
                            Our advanced AI analyzes your resume for ATS compatibility, keyword optimization, and provides tailored recommendations to help you land more interviews
                        </p>
                    </motion.div>

                    {/* Demo Video */}
                    <motion.div
                        className="max-w-6xl"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-500 to-indigo-600">
                            <Video
                                src="/assets/demo.mp4"
                                className="w-full h-auto"
                            />
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none"></div>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* Trusted By Section */}
            <Section className="py-16 bg-white border-y border-slate-100">
                <div className="container mx-auto px-4 lg:px-8">
                    <motion.p
                        className="text-center text-sm font-medium text-slate-500 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Trusted by people from
                    </motion.p>

                    {/* Logo Scroll Container */}
                    <div className="relative overflow-hidden">
                        {/* Gradient Overlays */}
                        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

                        {/* Scrolling Logos */}
                        <div className="flex">
                            <div className="flex animate-scroll">
                                {/* First set of logos */}
                                {[
                                    "Company One",
                                    "Company Two",
                                    "Company Three",
                                    "Company Four",
                                    "Company Five",
                                    "Company Six",
                                    "Company Seven",
                                    "Company Eight"
                                ].map((company, index) => (
                                    <div
                                        key={`logo-1-${index}`}
                                        className="flex-shrink-0 mx-8 flex items-center justify-center"
                                        style={{ width: '140px' }}
                                    >
                                        <div className="text-slate-400 font-semibold text-lg whitespace-nowrap">
                                            {company}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Duplicate set for seamless loop */}
                            <div className="flex animate-scroll" aria-hidden="true">
                                {[
                                    "Company One",
                                    "Company Two",
                                    "Company Three",
                                    "Company Four",
                                    "Company Five",
                                    "Company Six",
                                    "Company Seven",
                                    "Company Eight"
                                ].map((company, index) => (
                                    <div
                                        key={`logo-2-${index}`}
                                        className="flex-shrink-0 mx-8 flex items-center justify-center"
                                        style={{ width: '140px' }}
                                    >
                                        <div className="text-slate-400 font-semibold text-lg whitespace-nowrap">
                                            {company}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* ATS Analysis Section */}
            <Section className="py-24 bg-white paper-texture" threshold={0.2}>
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="mb-16">
                        <motion.div
                            className="inline-block px-4 py-1.5 bg-blue-100 rounded-full text-blue-700 font-mono font-normal text-sm mb-6 uppercase"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            ATS Optimization
                        </motion.div>
                        <motion.h2
                            className="font-display text-4xl lg:text-5xl font-medium text-slate-900 mb-6 max-w-3xl"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            Pass Every ATS System
                        </motion.h2>
                        <motion.p
                            className="text-lg text-slate-600 max-w-2xl leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            Our advanced AI ensures your resume gets past Applicant Tracking Systems and reaches human recruiters.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                standout: "99%",
                                standoutLabel: "Success Rate",
                                title: "ATS Compatibility Check",
                                description: "Analyze your resume against 200+ ATS systems to ensure maximum visibility to hiring managers.",
                                features: ["200+ ATS systems", "Real-time analysis", "Instant feedback"]
                            },
                            {
                                standout: "2x",
                                standoutLabel: "Interview Rate",
                                title: "AI Keyword Optimization",
                                description: "Our AI scans job descriptions and intelligently integrates relevant keywords into your resume.",
                                features: ["Smart keyword matching", "Industry-specific terms", "SEO optimization"]
                            },
                            {
                                standout: "100%",
                                standoutLabel: "Coverage",
                                title: "Detailed ATS Score",
                                description: "Get a comprehensive score with section-by-section feedback and actionable improvements.",
                                features: ["Section-by-section analysis", "Actionable improvements", "Progress tracking"]
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="bg-slate-100/80 p-8 rounded-2xl"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                            >
                                {/* Standout Stat */}
                                <div className="mb-6">
                                    <div className="text-xs font-mono font-normal text-slate-500 uppercase tracking-wider mb-2">
                                        {feature.standoutLabel}
                                    </div>
                                    <div className="font-display text-6xl font-medium text-slate-900">
                                        {feature.standout}
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-bold text-slate-900 mb-3">{feature.title}</h3>

                                {/* Description */}
                                <p className="text-base text-slate-600 mb-4 leading-relaxed">{feature.description}</p>

                                {/* Features List */}
                                <div className="space-y-2 text-base text-slate-600">
                                    {feature.features.map((item, i) => (
                                        <div key={i}>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Templates Section */}
            <Section className="py-24 lg:py-32 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50" threshold={0.2}>
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left Column - Visual Preview */}
                        <motion.div
                            className="flex items-center justify-center lg:justify-start"
                            initial={{ opacity: 0, y: -30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <motion.div
                                className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-200/50 shadow-xl"
                                whileHover={{ y: -5 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Mini Template Preview */}
                                <div className="bg-white rounded-2xl shadow-lg p-8 w-64 h-72">
                                    <div className="space-y-3">
                                        {/* Header */}
                                        <div className="border-b border-slate-200 pb-3">
                                            <div className="h-5 bg-slate-900 rounded w-3/4 mb-1.5"></div>
                                            <div className="h-3 bg-slate-300 rounded w-1/2"></div>
                                        </div>

                                        {/* Sections */}
                                        <div className="space-y-1.5">
                                            <div className="h-4 bg-slate-700 rounded w-2/5"></div>
                                            <div className="h-2.5 bg-slate-200 rounded w-full"></div>
                                            <div className="h-2.5 bg-slate-200 rounded w-4/5"></div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="h-4 bg-slate-700 rounded w-1/3"></div>
                                            <div className="h-2.5 bg-slate-200 rounded w-full"></div>
                                            <div className="h-2.5 bg-slate-200 rounded w-5/6"></div>
                                            <div className="h-2.5 bg-slate-200 rounded w-4/5"></div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="h-4 bg-slate-700 rounded w-2/5"></div>
                                            <div className="h-2.5 bg-slate-200 rounded w-3/4"></div>
                                            <div className="h-2.5 bg-slate-200 rounded w-2/3"></div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Right Column - Content */}
                        <motion.div
                            className="flex flex-col justify-center items-start"
                            initial={{ opacity: 0, y: -30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <motion.div
                                className="px-4 py-1.5 bg-orange-100 rounded-full text-orange-700 font-mono font-normal text-sm mb-6 uppercase"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                Professional Templates
                            </motion.div>

                            <motion.h2
                                className="font-display text-4xl lg:text-5xl font-medium text-slate-900 leading-[1.6] mb-6 text-left"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                            >
                                HR Approved Templates<br />to Get You Hired
                            </motion.h2>

                            <motion.p
                                className="text-lg text-slate-600 mb-10 leading-relaxed max-w-md"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                            >
                                Choose from over 30+ professionally designed templates tailored for different industries and career levels.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                            >
                                <motion.button
                                    onClick={() => handleNavigate('/templates')}
                                    className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all duration-200"
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Browse Templates
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </Section>

            {/* How It Works Section */}
            <Section className="py-24 bg-white" threshold={0.2}>
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="mb-16">
                        <motion.div
                            className="inline-block px-4 py-1.5 bg-purple-100 rounded-full text-purple-700 font-mono font-normal text-sm mb-6 uppercase"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            How It Works
                        </motion.div>
                        <motion.h2
                            className="font-display text-4xl lg:text-5xl font-medium text-slate-900 mb-6 max-w-3xl"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            How We Help You Land Your Dream Job
                        </motion.h2>
                    </div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={{
                            visible: {
                                transition: {
                                    staggerChildren: 0.1
                                }
                            }
                        }}
                    >
                        {[
                            {
                                title: "Upload or Create",
                                description: "Start by uploading your existing resume or build one from scratch with our intuitive AI-assisted editor that guides you every step of the way.",
                                cta: "Create Resume",
                                link: "/create-resume"
                            },
                            {
                                title: "AI Analysis & Optimization",
                                description: "Our advanced AI analyzes your resume against job descriptions, checks ATS compatibility, and provides targeted improvements to maximize your chances.",
                                cta: "Analyse",
                                link: "/analyze"
                            },
                            {
                                title: "Download & Apply",
                                description: "Export your optimized resume in multiple formats ready for job applications. Track your success with our built-in dashboard.",
                                cta: "Create an Account",
                                link: "/auth"
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                className="bg-slate-100/80 p-8 rounded-2xl flex flex-col"
                            >
                                {/* Icon */}
                                <div className="mb-6 text-6xl">
                                    {index === 0 && "📄"}
                                    {index === 1 && "⚡"}
                                    {index === 2 && "🎯"}
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>

                                {/* Description */}
                                <p className="text-base text-slate-600 mb-6 leading-relaxed flex-grow">{item.description}</p>

                                {/* CTA */}
                                <a
                                    href={item.link}
                                    className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium text-base transition-colors"
                                >
                                    {item.cta}
                                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </Section>

            {/* FAQ Section */}
            <FaqSection />

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200">
                <div className="container mx-auto px-4 lg:px-8">
                    {/* Top Section - Logo & Tagline */}
                    <div className="py-12 border-b border-slate-200">
                        <div className="flex items-center gap-3 mb-4">
                            <img src="/wtcv.svg" alt="WhatTheCV Logo" className="h-10 w-10" />
                            <h3 className="font-display text-2xl font-medium text-slate-900">what the cv</h3>
                        </div>
                        <p className="text-slate-600 text-base">
                            AI-powered resume platform that helps you land your dream job
                        </p>
                    </div>

                    {/* Middle Section - Links & Contact */}
                    <div className="py-12 border-b border-slate-200">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                            {/* Product Column */}
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
                                <ul className="space-y-3">
                                    {footerLinks[0].links.map((link, j) => (
                                        <li key={j}>
                                            <a
                                                href={link.path}
                                                className="text-slate-600 hover:text-slate-900 transition-colors text-base"
                                                target={link.path.startsWith('http') ? "_blank" : undefined}
                                                rel={link.path.startsWith('http') ? "noopener noreferrer" : undefined}
                                            >
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Resources Column */}
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-4">Resources</h4>
                                <ul className="space-y-3">
                                    {footerLinks[1].links.map((link, j) => (
                                        <li key={j}>
                                            <a
                                                href={link.path}
                                                className="text-slate-600 hover:text-slate-900 transition-colors text-base"
                                                target={link.path.startsWith('http') ? "_blank" : undefined}
                                                rel={link.path.startsWith('http') ? "noopener noreferrer" : undefined}
                                            >
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Contact Column */}
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-4">Contact</h4>
                                <ul className="space-y-3 mb-6">
                                    <li className="flex items-center gap-2 text-slate-600 text-base">
                                        <Mail className="h-5 w-5" />
                                        <a href="mailto:support@whatthecv.com" className="hover:text-slate-900 transition-colors">
                                            support@whatthecv.com
                                        </a>
                                    </li>
                                </ul>
                                <div className="flex flex-col gap-3">
                                    <a
                                        href="https://github.com/sponsors/gauravsinhaweb"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors duration-200 w-fit"
                                        title="Support us on GitHub Sponsors"
                                    >
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                        Sponsor
                                    </a>
                                    <a
                                        href="https://www.buymeacoffee.com/gauravsinha"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors duration-200 w-fit"
                                        title="Buy us a coffee"
                                    >
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M2 21h18v-2H2v2zm0-9h4v7H2v-7zm6 0h4v7H8v-7zm6 0h4v7h-4v-7zM2 3v8h18V3H2zm16 6H4V5h14v4z" />
                                        </svg>
                                        Buy Me a Coffee
                                    </a>
                                </div>
                            </div>

                            {/* Social Icons Column */}
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-4">Follow Us</h4>
                                <div className="flex gap-4">
                                    {[
                                        { icon: <Twitter className="h-5 w-5" />, href: "https://x.com/wtcv_app" },
                                        { icon: <Linkedin className="h-5 w-5" />, href: "https://www.linkedin.com/in/gauravsinhaa/" },
                                        { icon: <Github className="h-5 w-5" />, href: "https://github.com/gauravsinhaweb" }
                                    ].map((social, i) => (
                                        <a
                                            key={i}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white transition-colors p-3.5 rounded-lg"
                                        >
                                            {social.icon}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section - Copyright & Legal */}
                    <div className="py-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-600">
                            <p>© {new Date().getFullYear()} WhatTheCV. All rights reserved.</p>
                            <div className="flex gap-6">
                                <a href="/terms" className="hover:text-slate-900 transition-colors">Terms & Conditions</a>
                                <a href="/privacy-policy" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage; 