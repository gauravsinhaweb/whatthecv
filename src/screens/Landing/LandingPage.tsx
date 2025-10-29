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
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
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
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            {/* Main Video/Image Container */}
                            <div className="relative w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl">
                                <Video
                                    src="/assets/demo.mp4"
                                    className="w-full h-full object-cover opacity-90"
                                />

                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none"></div>

                                {/* Demo Badge */}
                                <motion.div
                                    className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 text-slate-700 text-sm font-semibold shadow-lg"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.8, duration: 0.5 }}
                                >
                                    ✨ Live Demo
                                </motion.div>
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
                            className="inline-block px-4 py-1.5 bg-blue-100 rounded-full text-blue-700 font-medium text-sm mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            ATS Optimization
                        </motion.div>
                        <motion.h2
                            className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 max-w-3xl"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            Pass Every ATS System
                        </motion.h2>
                        <motion.p
                            className="text-lg text-slate-600 max-w-2xl"
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
                                className="bg-slate-100 p-8 rounded-2xl"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                            >
                                {/* Standout Stat */}
                                <div className="mb-6">
                                    <div className="font-display text-5xl font-bold text-slate-900 mb-1">
                                        {feature.standout}
                                    </div>
                                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                        {feature.standoutLabel}
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-base font-semibold text-slate-900 mb-3">{feature.title}</h3>

                                {/* Description */}
                                <p className="text-sm text-slate-600 mb-4 leading-relaxed">{feature.description}</p>

                                {/* Features List */}
                                <div className="space-y-1.5 text-sm text-slate-600">
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

            {/* High Accuracy Analysis Section */}
            <Section className="py-24 bg-gradient-to-br from-purple-50 to-pink-50" threshold={0.2}>
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <Item className="inline-block px-4 py-1.5 bg-purple-100 rounded-full text-purple-700 font-medium text-sm mb-6">
                            AI-Powered Analysis
                        </Item>
                        <Item as={motion.h2} className="text-4xl font-bold text-slate-900 mb-6">
                            95% Accuracy Guaranteed
                        </Item>
                        <Item as={motion.p} className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Our advanced AI algorithms provide precise resume analysis with industry-specific insights and recommendations.
                        </Item>
                    </div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        {[
                            {
                                icon: <CheckCircle className="h-10 w-10 text-purple-500" />,
                                title: "Content Analysis",
                                value: "95%",
                                description: "Grammar and style accuracy",
                                gradient: "from-purple-500/20 to-pink-500/20",
                                borderColor: "border-purple-200/50"
                            },
                            {
                                icon: <Target className="h-10 w-10 text-blue-500" />,
                                title: "Keyword Matching",
                                value: "98%",
                                description: "ATS keyword optimization",
                                gradient: "from-blue-500/20 to-indigo-500/20",
                                borderColor: "border-blue-200/50"
                            },
                            {
                                icon: <BarChart className="h-10 w-10 text-emerald-500" />,
                                title: "Skills Assessment",
                                value: "92%",
                                description: "Industry relevance scoring",
                                gradient: "from-emerald-500/20 to-teal-500/20",
                                borderColor: "border-emerald-200/50"
                            },
                            {
                                icon: <FileCheck className="h-10 w-10 text-orange-500" />,
                                title: "Format Validation",
                                value: "97%",
                                description: "ATS compatibility check",
                                gradient: "from-orange-500/20 to-red-500/20",
                                borderColor: "border-orange-200/50"
                            }
                        ].map((metric, index) => (
                            <motion.div
                                key={index}
                                variants={cardVariants}
                                whileHover={{ scale: 1.02, y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                className={`bg-gradient-to-br ${metric.gradient} p-8 rounded-2xl ${metric.borderColor} shadow-lg text-center hover:shadow-xl transition-all duration-300 backdrop-blur-sm relative overflow-hidden group`}
                            >
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-5">
                                    <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <pattern id={`accuracy-grid-${index}`} width="25" height="25" patternUnits="userSpaceOnUse">
                                                <circle cx="12.5" cy="12.5" r="1" fill="currentColor" />
                                            </pattern>
                                        </defs>
                                        <rect width="100%" height="100%" fill={`url(#accuracy-grid-${index})`} />
                                    </svg>
                                </div>
                                {/* Floating Elements */}
                                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 blur-lg"></div>
                                <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-white/5 blur-md"></div>
                                <motion.div
                                    className={`mb-4 p-3 ${metric.gradient.replace('/20', '/10').replace('bg-gradient-to-br ', '')} backdrop-blur-sm rounded-2xl inline-block`}
                                    whileHover={{ y: -5, scale: 1.1, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    {metric.icon}
                                </motion.div>
                                <motion.div
                                    className="text-3xl font-bold text-purple-600 mb-2"
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, delay: index * 0.1 }}
                                >
                                    {metric.value}
                                </motion.div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">{metric.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{metric.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </Section>

            {/* Templates Section */}
            <Section className="py-24 bg-white" threshold={0.2}>
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <Item className="inline-block px-4 py-1.5 bg-orange-100 rounded-full text-orange-700 font-medium text-sm mb-6">
                            Professional Templates
                        </Item>
                        <Item as={motion.h2} className="text-4xl font-bold text-slate-900 mb-6">
                            30+ HR-Approved Templates
                        </Item>
                        <Item as={motion.p} className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Choose from professionally designed templates tailored for different industries and career levels.
                        </Item>
                    </div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        {[
                            {
                                name: "Classic Professional",
                                category: "Corporate",
                                description: "Clean and traditional design for corporate environments",
                                features: ["ATS-friendly", "Professional fonts", "Clean layout"],
                                gradient: "from-slate-500/10 to-gray-500/10",
                                borderColor: "border-slate-200",
                                categoryColor: "bg-slate-100 text-slate-700"
                            },
                            {
                                name: "Modern Creative",
                                category: "Tech & Design",
                                description: "Contemporary design for creative and tech industries",
                                features: ["Modern styling", "Color accents", "Visual hierarchy"],
                                gradient: "from-blue-500/10 to-purple-500/10",
                                borderColor: "border-blue-200",
                                categoryColor: "bg-blue-100 text-blue-700"
                            },
                            {
                                name: "Executive",
                                category: "Leadership",
                                description: "Sophisticated design for senior-level positions",
                                features: ["Premium layout", "Executive styling", "Impact focus"],
                                gradient: "from-amber-500/10 to-orange-500/10",
                                borderColor: "border-amber-200",
                                categoryColor: "bg-amber-100 text-amber-700"
                            }
                        ].map((template, index) => (
                            <motion.div
                                key={index}
                                variants={cardVariants}
                                whileHover={{ scale: 1.02, y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                className={`bg-gradient-to-br ${template.gradient} p-8 rounded-2xl ${template.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 group backdrop-blur-sm relative overflow-hidden`}
                            >
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-5">
                                    <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <pattern id={`template-grid-${index}`} width="30" height="30" patternUnits="userSpaceOnUse">
                                                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                                            </pattern>
                                        </defs>
                                        <rect width="100%" height="100%" fill={`url(#template-grid-${index})`} />
                                    </svg>
                                </div>
                                {/* Floating Elements */}
                                <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/10 blur-xl"></div>
                                <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-white/5 blur-lg"></div>
                                <div className="mb-6">
                                    <motion.div
                                        className={`inline-block px-3 py-1 ${template.categoryColor} text-sm font-medium rounded-full mb-3 transition-all duration-300`}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        {template.category}
                                    </motion.div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{template.name}</h3>
                                    <p className="text-slate-600 mb-4 leading-relaxed">{template.description}</p>
                                </div>
                                <motion.ul className="space-y-2 mb-6" variants={containerVariants}>
                                    {template.features.map((feature, i) => (
                                        <motion.li
                                            key={i}
                                            className="flex items-center text-sm text-slate-600"
                                            variants={itemVariants}
                                            whileHover={{ x: 5 }}
                                        >
                                            <CheckCircle className="h-4 w-4 text-slate-500 mr-2 flex-shrink-0" />
                                            {feature}
                                        </motion.li>
                                    ))}
                                </motion.ul>
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleNavigate('/templates')}
                                        className="w-full rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 transition-all duration-300"
                                    >
                                        Use Template
                                    </Button>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </Section>

            {/* How It Works Section */}
            <Section className="py-24 bg-white" threshold={0.2}>
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <Item className="inline-block px-4 py-1.5 bg-indigo-100 rounded-full text-indigo-700 font-medium text-sm mb-6">
                            Simple Process
                        </Item>
                        <Item as={motion.h2} className="text-4xl font-bold text-slate-900 mb-6">
                            How It Works
                        </Item>
                        <Item as={motion.p} className="text-xl text-slate-600 max-w-2xl mx-auto">
                            From upload to interview-ready in minutes
                        </Item>
                    </div>

                    <div className="relative max-w-5xl mx-auto">
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-blue-200 -translate-y-1/2 hidden md:block"></div>

                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.5 }}
                        >
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
                                    variants={itemVariants}
                                    className="relative z-10"
                                >
                                    <motion.div
                                        className="bg-blue-600 text-white h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-8 relative"
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 300, delay: index * 0.2 + 0.3 }}
                                        viewport={{ once: true }}
                                        whileHover={{ scale: 1.1, rotate: 5 }}
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

                                    <motion.div
                                        className="bg-white p-8 rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-shadow duration-300"
                                        whileHover={{ y: -5 }}
                                    >
                                        <motion.div
                                            className="p-3 bg-blue-50 rounded-full inline-block mb-4"
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                        >
                                            {item.icon}
                                        </motion.div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                        <p className="text-slate-600 mb-4">{item.description}</p>
                                        <p className="text-blue-600 font-medium text-sm">{item.action}</p>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        viewport={{ once: true, amount: 0.5 }}
                        className="text-center mt-16"
                    >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                size="lg"
                                onClick={() => handleNavigate('/analyze')}
                                className="rounded-full transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg"
                            >
                                Get Started Now
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </Section>

            {/* FAQ Section */}
            <FaqSection />

            {/* Footer */}
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
                                The AI-powered resume platform that helps you create, customize, and manage multiple versions of your resume with high accuracy analysis for maximum success.
                            </p>
                            <div className="flex space-x-4">
                                {[
                                    { icon: <Twitter className="h-5 w-5" />, href: "https://x.com/wtcv_app" },
                                    { icon: <Linkedin className="h-5 w-5" />, href: "https://www.linkedin.com/in/gauravsinhaa/" },
                                    { icon: <Github className="h-5 w-5" />, href: "https://github.com/gauravsinhaweb" },
                                    { icon: <Mail className="h-5 w-5" />, href: "mailto:support@whatthecv.com" }
                                ].map((social, i) => (
                                    <motion.a
                                        key={i}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-slate-800 p-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
                                        whileHover={{ y: -5, scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
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
                        <div className="hidden sm:ml-6 sm:flex flex-col sm:items-center self-end gap-2">
                            <a
                                href="https://github.com/sponsors/gauravsinhaweb"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:-translate-y-[2px] transition-transform duration-200 ease-out hover:shadow-lg rounded-lg p-1"
                                title="Support us on GitHub Sponsors"
                            >
                                <iframe
                                    src="https://github.com/sponsors/gauravsinhaweb/button"
                                    title="Sponsor gauravsinhaweb"
                                    height="40"
                                    width="114"
                                    style={{ border: 0, borderRadius: '6px', }}
                                />
                            </a>
                            <a
                                href="https://www.buymeacoffee.com/gauravsinha"
                                target="_blank"
                                className="hover:-translate-y-[2px] transition-transform duration-200 ease-out hover:shadow-lg rounded-lg p-1"
                                title="Buy us a coffee"
                            >
                                <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style={{ height: '32px', width: '114px' }} />
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