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

            {/* Hero Section */}
            <Section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50">
                {/* <motion.div
                    className="absolute top-6 right-4 z-30 flex items-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <a
                        href="https://github.com/gauravsinhaweb/whatthecv"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-md gap-1.5 text-slate-800 hover:text-slate-900 transition-colors hover:-translate-y-[2px] shadow-sm hover:shadow-md"
                    >
                        <Github className="h-4 w-4" />
                        <span className="text-xs font-medium">Star on GitHub</span>
                    </a>
                </motion.div> */}
                <motion.div
                    className="absolute inset-0 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <motion.div
                        className="absolute inset-0 bg-grid-slate-900/[0.03] bg-[size:20px_20px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#f8faff] via-[#f8faff]/80 to-transparent pointer-events-none" />
                </motion.div>
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
                        <Item className="inline-block px-4 py-1.5 bg-blue-100 rounded-full text-blue-700 font-medium text-sm mb-6">
                            AI-Powered Resume Platform
                        </Item>
                        <Item as={motion.h1} className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight max-w-5xl">
                            Build an <span className="text-blue-600 relative inline-block" aria-label="ATS-Optimized Resume">
                                ATS-Optimized
                                <motion.span
                                    className="absolute -bottom-2 left-0 right-0 h-1.5 bg-blue-600 rounded-full"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
                                    aria-hidden="true"
                                />
                            </span> Resume That Gets You Hired
                        </Item>
                        <Item as={motion.p} className="mt-8 text-xl text-slate-600 max-w-2xl">
                            Our AI-powered platform helps you create, customize, and manage multiple versions of your resume with high accuracy analysis for maximum success with Applicant Tracking Systems.
                        </Item>
                        <motion.div
                            className="mt-10 flex flex-col sm:flex-row gap-5"
                            initial="hidden"
                            animate="visible"
                            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
                        >
                            <Item as={Button} size="lg" onClick={() => handleNavigate('/analyze')} className="rounded-full group" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                                Analyze Your Resume
                            </Item>
                            <Item as={Button} variant="outline" size="lg" onClick={() => handleNavigate('/templates')} className="rounded-full group" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                                Browse Templates
                            </Item>
                        </motion.div>
                    </div>
                    <motion.div
                        style={{ opacity, scale }}
                        className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 transform-gpu will-change-transform -mt-8 sm:mt-0"
                    >
                        {/* Video Container with Enhanced Styling */}
                        <motion.div
                            className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 backdrop-blur-sm group hover:shadow-xl transition-all duration-300"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            whileHover={{ scale: 1.02, y: -5 }}
                        >
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-5">
                                <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <pattern id="video-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#video-grid)" />
                                </svg>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/10 blur-xl"></div>
                            <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-white/5 blur-lg"></div>

                            {/* Video Container */}
                            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
                                <Video
                                    src="/assets/demo.mp4"
                                    className="w-full h-full object-cover transform-gpu rounded-2xl"
                                />

                                {/* Subtle Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent pointer-events-none"></div>

                                {/* Demo Badge */}
                                <motion.div
                                    className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-medium border border-blue-500/30"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    Demo
                                </motion.div>
                            </div>

                            {/* Bottom Info Bar */}
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent backdrop-blur-sm p-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2, duration: 0.5 }}
                            >
                                <div className="text-center text-white">
                                    <span className="text-sm font-medium">AI-Powered Resume Analysis</span>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Decorative Elements */}
                        <motion.div
                            className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-60"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.8, 0.6] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-40"
                            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.6, 0.4] }}
                            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                        />
                    </motion.div>
                </div>
            </Section>

            {/* ATS Analysis Section */}
            <Section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50" threshold={0.2}>
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <Item className="inline-block px-4 py-1.5 bg-blue-100 rounded-full text-blue-700 font-medium text-sm mb-6">
                            ATS Optimization
                        </Item>
                        <Item as={motion.h2} className="text-4xl font-bold text-slate-900 mb-6">
                            Pass Every ATS System
                        </Item>
                        <Item as={motion.p} className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Our advanced AI ensures your resume gets past Applicant Tracking Systems and reaches human recruiters.
                        </Item>
                    </div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        {[
                            {
                                icon: <FileCheck className="h-12 w-12 text-blue-500" />,
                                title: "ATS Compatibility Check",
                                description: "Analyze your resume against 200+ ATS systems to ensure maximum visibility to hiring managers.",
                                highlight: "99% Success Rate",
                                features: ["200+ ATS systems", "Real-time analysis", "Instant feedback"],
                                bgGradient: "from-blue-500/10 to-indigo-500/10",
                                borderColor: "border-blue-200",
                                iconBg: "bg-blue-500/10",
                                highlightBg: "bg-blue-600"
                            },
                            {
                                icon: <Search className="h-12 w-12 text-purple-500" />,
                                title: "AI Keyword Optimization",
                                description: "Our AI scans job descriptions and intelligently integrates relevant keywords into your resume.",
                                highlight: "2x Interview Rate",
                                features: ["Smart keyword matching", "Industry-specific terms", "SEO optimization"],
                                bgGradient: "from-purple-500/10 to-pink-500/10",
                                borderColor: "border-purple-200",
                                iconBg: "bg-purple-500/10",
                                highlightBg: "bg-purple-600"
                            },
                            {
                                icon: <Target className="h-12 w-12 text-emerald-500" />,
                                title: "Detailed ATS Score",
                                description: "Get a comprehensive score with section-by-section feedback and actionable improvements.",
                                highlight: "Step-by-Step Guidance",
                                features: ["Section-by-section analysis", "Actionable improvements", "Progress tracking"],
                                bgGradient: "from-emerald-500/10 to-teal-500/10",
                                borderColor: "border-emerald-200",
                                iconBg: "bg-emerald-500/10",
                                highlightBg: "bg-emerald-600"
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={cardVariants}
                                whileHover={{ scale: 1.02, y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                className={`bg-gradient-to-br ${feature.bgGradient} p-8 rounded-2xl ${feature.borderColor} shadow-lg flex flex-col h-full relative overflow-hidden group hover:shadow-xl transition-all duration-300 backdrop-blur-sm`}
                            >
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-5">
                                    <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <pattern id={`ats-grid-${index}`} width="20" height="20" patternUnits="userSpaceOnUse">
                                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
                                            </pattern>
                                        </defs>
                                        <rect width="100%" height="100%" fill={`url(#ats-grid-${index})`} />
                                    </svg>
                                </div>
                                {/* Floating Elements */}
                                <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/10 blur-xl"></div>
                                <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-white/5 blur-lg"></div>
                                <motion.div
                                    className={`absolute right-0 top-0 ${feature.highlightBg} text-white px-4 py-2 text-sm font-semibold rounded-bl-xl`}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 + 0.3 }}
                                >
                                    {feature.highlight}
                                </motion.div>
                                <motion.div
                                    className={`mb-6 p-4 ${feature.iconBg} rounded-2xl self-start`}
                                    whileHover={{ y: -5, scale: 1.1, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    {feature.icon}
                                </motion.div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                                <p className="text-slate-600 mb-6 flex-grow leading-relaxed">{feature.description}</p>
                                <motion.ul className="space-y-2" variants={containerVariants}>
                                    {feature.features.map((item, i) => (
                                        <motion.li
                                            key={i}
                                            className="flex items-center text-sm text-slate-600"
                                            variants={itemVariants}
                                            whileHover={{ x: 5 }}
                                        >
                                            <CheckCircle className="h-4 w-4 text-slate-500 mr-2 flex-shrink-0" />
                                            {item}
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            </motion.div>
                        ))}
                    </motion.div>
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