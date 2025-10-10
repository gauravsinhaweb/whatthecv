import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState, useMemo, useCallback } from 'preact/hooks';
import { useNavigate } from 'react-router-dom';
import { OptimizedSection, OptimizedItem } from '../../components/landing/OptimizedSection';
import { OptimizedVideo } from '../../components/landing/OptimizedVideo';
import { OptimizedIcons } from '../../components/ui/OptimizedIcons';
import FaqSection from '../../components/landing/FaqSection';
import Button from '../../components/ui/Button';
import PrivacyPolicyModal from '../../components/modals/PrivacyPolicyModal';
import {
    optimizedContainerVariants,
    optimizedItemVariants,
    optimizedCardVariants,
    optimizedFadeIn,
    optimizedSlideIn,
    useReducedMotion,
    useThrottledCallback,
    useMemoizedValue,
    preloadCriticalResources
} from '../../utils/performance';
import { useAuth } from '../../hooks/useAuth';
import './landing.css';

const OptimizedLandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    const { isAuthenticated, user } = useAuth();
    const prefersReducedMotion = useReducedMotion();

    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 1]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.85]);
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

    const handleNavigate = useCallback((path: string) => {
        navigate(path);
    }, [navigate]);

    const handlePrivacyModal = useCallback(() => {
        setIsPrivacyModalOpen(true);
    }, []);

    const handleClosePrivacyModal = useCallback(() => {
        setIsPrivacyModalOpen(false);
    }, []);

    useEffect(() => {
        if (isAuthenticated && user) {
            navigate('/dashboard');
        } else {
            navigate('/');
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        preloadCriticalResources();
    }, []);

    const footerLinks = useMemoizedValue([
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
                { name: "Privacy Policy", path: "#", onClick: handlePrivacyModal },
                { name: "Feedback", path: "https://docs.google.com/forms/d/e/1FAIpQLScDwpgHCKzVwUaxGGDDAxR6mBhJfTgy5O0Je2Ldt07KZ2we5g/viewform?usp=sharing&ouid=113476487922478109524" },
            ]
        }
    ], [handlePrivacyModal]);

    const atsFeatures = useMemoizedValue([
        {
            icon: <OptimizedIcons.FileCheck className="h-12 w-12 text-blue-500" />,
            title: "ATS Compatibility Check",
            description: "Analyze your resume against 200+ ATS systems to ensure maximum visibility to hiring managers.",
            highlight: "99% Success Rate",
            features: ["200+ ATS systems", "Real-time analysis", "Instant feedback"]
        },
        {
            icon: <OptimizedIcons.Search className="h-12 w-12 text-blue-500" />,
            title: "AI Keyword Optimization",
            description: "Our AI scans job descriptions and intelligently integrates relevant keywords into your resume.",
            highlight: "2x Interview Rate",
            features: ["Smart keyword matching", "Industry-specific terms", "SEO optimization"]
        },
        {
            icon: <OptimizedIcons.Target className="h-12 w-12 text-blue-500" />,
            title: "Detailed ATS Score",
            description: "Get a comprehensive score with section-by-section feedback and actionable improvements.",
            highlight: "Step-by-Step Guidance",
            features: ["Section-by-section analysis", "Actionable improvements", "Progress tracking"]
        }
    ], []);

    const accuracyMetrics = useMemoizedValue([
        {
            icon: <OptimizedIcons.CheckCircle className="h-10 w-10 text-purple-500" />,
            title: "Content Analysis",
            value: "95%",
            description: "Grammar and style accuracy"
        },
        {
            icon: <OptimizedIcons.Target className="h-10 w-10 text-purple-500" />,
            title: "Keyword Matching",
            value: "98%",
            description: "ATS keyword optimization"
        },
        {
            icon: <OptimizedIcons.BarChart className="h-10 w-10 text-purple-500" />,
            title: "Skills Assessment",
            value: "92%",
            description: "Industry relevance scoring"
        },
        {
            icon: <OptimizedIcons.FileCheck className="h-10 w-10 text-purple-500" />,
            title: "Format Validation",
            value: "97%",
            description: "ATS compatibility check"
        }
    ], []);

    const templates = useMemoizedValue([
        {
            name: "Classic Professional",
            category: "Corporate",
            description: "Clean and traditional design for corporate environments",
            features: ["ATS-friendly", "Professional fonts", "Clean layout"]
        },
        {
            name: "Modern Creative",
            category: "Tech & Design",
            description: "Contemporary design for creative and tech industries",
            features: ["Modern styling", "Color accents", "Visual hierarchy"]
        },
        {
            name: "Executive",
            category: "Leadership",
            description: "Sophisticated design for senior-level positions",
            features: ["Premium layout", "Executive styling", "Impact focus"]
        }
    ], []);

    const howItWorksSteps = useMemoizedValue([
        {
            step: "01",
            title: "Upload or Create",
            description: "Upload your existing resume or build from scratch with our AI-assisted editor.",
            action: "Get started with any format - PDF, Word, or plain text.",
            icon: <OptimizedIcons.FileText className="h-6 w-6" />
        },
        {
            step: "02",
            title: "AI Analysis & Optimization",
            description: "Our AI analyzes your resume against job descriptions and provides targeted improvements.",
            action: "Receive a detailed ATS score with actionable feedback.",
            icon: <OptimizedIcons.BarChart className="h-6 w-6" />
        },
        {
            step: "03",
            title: "Download & Apply",
            description: "Export your optimized resume in multiple formats ready for job applications.",
            action: "Track your application success with our dashboard.",
            icon: <OptimizedIcons.ThumbsUp className="h-6 w-6" />
        }
    ], []);

    const socialLinks = useMemoizedValue([
        { icon: <OptimizedIcons.Twitter className="h-5 w-5" />, href: "https://x.com/defigoro" },
        { icon: <OptimizedIcons.Linkedin className="h-5 w-5" />, href: "https://www.linkedin.com/in/gauravsinhaa/" },
        { icon: <OptimizedIcons.Github className="h-5 w-5" />, href: "https://github.com/gauravsinhaweb" },
        { icon: <OptimizedIcons.Mail className="h-5 w-5" />, href: "mailto:support@whatthecv.com" }
    ], []);

    const animationConfig = useMemo(() => ({
        duration: prefersReducedMotion ? 0.1 : 0.3,
        ease: [0.25, 0.1, 0.25, 1] as const,
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
        delayChildren: prefersReducedMotion ? 0 : 0.1,
    }), [prefersReducedMotion]);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <OptimizedSection className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50">
                <div className="absolute top-6 right-4 z-30 flex items-center">
                    <a
                        href="https://github.com/gauravsinhaweb/whatthecv"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-md gap-1.5 text-slate-800 hover:text-slate-900 transition-colors hover:-translate-y-[2px] shadow-sm hover:shadow-md"
                    >
                        <OptimizedIcons.Github className="h-4 w-4" />
                        <span className="text-xs font-medium">Star on GitHub</span>
                    </a>
                </div>

                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute inset-0 bg-grid-slate-900/[0.03] bg-[size:20px_20px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: prefersReducedMotion ? 0.1 : 1 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#f8faff] via-[#f8faff]/80 to-transparent pointer-events-none" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <OptimizedItem className="w-full flex justify-center pt-8 pb-4">
                        <a href="https://peerlist.io/gauravsinha/project/whatthecv" target="_blank" rel="noopener noreferrer">
                            <img src="/assets/Launch.svg" alt="Launchpad" className="h-16 md:h-20" loading="eager" />
                        </a>
                    </OptimizedItem>

                    <div className="flex flex-col items-center text-center mb-16">
                        <motion.div
                            variants={optimizedFadeIn(0)}
                            initial="hidden"
                            animate="visible"
                            className="inline-block px-4 py-1.5 bg-blue-100 rounded-full text-blue-700 font-medium text-sm mb-6"
                        >
                            AI-Powered Resume Platform
                        </motion.div>

                        <motion.h1
                            variants={optimizedSlideIn('up', 0.2)}
                            initial="hidden"
                            animate="visible"
                            className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight max-w-5xl"
                        >
                            Build an <span className="text-blue-600 relative inline-block">
                                ATS-Optimized
                                <motion.span
                                    className="absolute -bottom-2 left-0 right-0 h-1.5 bg-blue-600 rounded-full"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: prefersReducedMotion ? 0.1 : 0.8, delay: 1 }}
                                />
                            </span> Resume That Gets You Hired
                        </motion.h1>

                        <motion.p
                            variants={optimizedFadeIn(0.4)}
                            initial="hidden"
                            animate="visible"
                            className="mt-8 text-xl text-slate-600 max-w-2xl"
                        >
                            Our AI-powered platform helps you create, customize, and manage multiple versions of your resume with high accuracy analysis for maximum success with Applicant Tracking Systems.
                        </motion.p>

                        <motion.div
                            variants={optimizedFadeIn(0.6)}
                            initial="hidden"
                            animate="visible"
                            className="mt-10 flex flex-col sm:flex-row gap-5"
                        >
                            <Button
                                size="lg"
                                onClick={() => handleNavigate('/analyze')}
                                className="rounded-full transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg group"
                                rightIcon={
                                    <motion.div
                                        whileHover={{ rotate: 45 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                    >
                                        <OptimizedIcons.ArrowUpRight className="h-4 w-4" />
                                    </motion.div>
                                }
                            >
                                Analyze Your Resume
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => handleNavigate('/templates')}
                                className="rounded-full transition-all duration-300 hover:translate-y-[-2px] hover:border-blue-400 group"
                                rightIcon={
                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        <OptimizedIcons.ChevronRight className="h-4 w-4" />
                                    </motion.div>
                                }
                            >
                                Browse Templates
                            </Button>
                        </motion.div>
                    </div>

                    <motion.div
                        style={{ opacity, scale }}
                        className="relative max-w-4xl mx-auto px-2 sm:px-6 lg:px-8 transform-gpu will-change-transform -mt-8 sm:mt-0"
                    >
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-[0_20px_70px_-10px_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,0,0,0.1),0_-20px_70px_-10px_rgba(36,99,235,0.2),0_-10px_40px_-5px_rgba(36,99,235,0.15)] sm:shadow-[0_30px_100px_-15px_rgba(0,0,0,0.6),0_0_0_1px_rgba(0,0,0,0.1),0_10px_30px_-5px_rgba(0,0,0,0.3),0_-30px_100px_-15px_rgba(36,99,235,0.25),0_-15px_50px_-10px_rgba(36,99,235,0.2)] overflow-hidden border border-slate-200 transition-all duration-300 ease-out">
                            <div className="relative aspect-[16/10] sm:aspect-video">
                                <OptimizedVideo
                                    src="/assets/demo.mp4"
                                    className="w-full h-full object-cover transform-gpu"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </OptimizedSection>

            {/* ATS Analysis Section */}
            <OptimizedSection className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50" threshold={0.2}>
                <div className="container mx-auto px-4">
                    <motion.div
                        variants={optimizedContainerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        className="text-center mb-16"
                    >
                        <OptimizedItem className="inline-block px-4 py-1.5 bg-blue-100 rounded-full text-blue-700 font-medium text-sm mb-6">
                            ATS Optimization
                        </OptimizedItem>
                        <OptimizedItem className="text-4xl font-bold text-slate-900 mb-6">
                            Pass Every ATS System
                        </OptimizedItem>
                        <OptimizedItem className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Our advanced AI ensures your resume gets past Applicant Tracking Systems and reaches human recruiters.
                        </OptimizedItem>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {atsFeatures.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={optimizedCardVariants}
                                initial="hidden"
                                whileInView="visible"
                                whileHover="hover"
                                viewport={{ once: true, amount: 0.3 }}
                                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg flex flex-col h-full relative overflow-hidden group hover:shadow-xl transition-all duration-300"
                            >
                                <div className="absolute right-0 top-0 bg-blue-600 text-white px-4 py-2 text-sm font-semibold rounded-bl-xl">
                                    {feature.highlight}
                                </div>
                                <motion.div
                                    className="mb-6 p-4 bg-blue-50 rounded-2xl self-start"
                                    whileHover={{ y: -5, scale: 1.1 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    {feature.icon}
                                </motion.div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                                <p className="text-slate-600 mb-6 flex-grow">{feature.description}</p>
                                <ul className="space-y-2">
                                    {feature.features.map((item, i) => (
                                        <li key={i} className="flex items-center text-sm text-slate-600">
                                            <OptimizedIcons.CheckCircle className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </OptimizedSection>

            {/* High Accuracy Analysis Section */}
            <OptimizedSection className="py-24 bg-gradient-to-br from-purple-50 to-pink-50" threshold={0.2}>
                <div className="container mx-auto px-4">
                    <motion.div
                        variants={optimizedContainerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        className="text-center mb-16"
                    >
                        <OptimizedItem className="inline-block px-4 py-1.5 bg-purple-100 rounded-full text-purple-700 font-medium text-sm mb-6">
                            AI-Powered Analysis
                        </OptimizedItem>
                        <OptimizedItem className="text-4xl font-bold text-slate-900 mb-6">
                            95% Accuracy Guaranteed
                        </OptimizedItem>
                        <OptimizedItem className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Our advanced AI algorithms provide precise resume analysis with industry-specific insights and recommendations.
                        </OptimizedItem>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {accuracyMetrics.map((metric, index) => (
                            <motion.div
                                key={index}
                                variants={optimizedCardVariants}
                                initial="hidden"
                                whileInView="visible"
                                whileHover="hover"
                                viewport={{ once: true, amount: 0.3 }}
                                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg text-center hover:shadow-xl transition-all duration-300"
                            >
                                <motion.div
                                    className="mb-4 p-3 bg-purple-50 rounded-2xl inline-block"
                                    whileHover={{ y: -5, scale: 1.1 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    {metric.icon}
                                </motion.div>
                                <div className="text-3xl font-bold text-purple-600 mb-2">{metric.value}</div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">{metric.title}</h3>
                                <p className="text-slate-600 text-sm">{metric.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </OptimizedSection>

            {/* Templates Section */}
            <OptimizedSection className="py-24 bg-white" threshold={0.2}>
                <div className="container mx-auto px-4">
                    <motion.div
                        variants={optimizedContainerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        className="text-center mb-16"
                    >
                        <OptimizedItem className="inline-block px-4 py-1.5 bg-orange-100 rounded-full text-orange-700 font-medium text-sm mb-6">
                            Professional Templates
                        </OptimizedItem>
                        <OptimizedItem className="text-4xl font-bold text-slate-900 mb-6">
                            30+ HR-Approved Templates
                        </OptimizedItem>
                        <OptimizedItem className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Choose from professionally designed templates tailored for different industries and career levels.
                        </OptimizedItem>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {templates.map((template, index) => (
                            <motion.div
                                key={index}
                                variants={optimizedCardVariants}
                                initial="hidden"
                                whileInView="visible"
                                whileHover="hover"
                                viewport={{ once: true, amount: 0.3 }}
                                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className="mb-6">
                                    <div className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full mb-3">
                                        {template.category}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{template.name}</h3>
                                    <p className="text-slate-600 mb-4">{template.description}</p>
                                </div>
                                <ul className="space-y-2 mb-6">
                                    {template.features.map((feature, i) => (
                                        <li key={i} className="flex items-center text-sm text-slate-600">
                                            <OptimizedIcons.CheckCircle className="h-4 w-4 text-orange-500 mr-2 flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    variant="outline"
                                    onClick={() => handleNavigate('/templates')}
                                    className="w-full rounded-xl border-orange-200 text-orange-600 hover:bg-orange-50"
                                >
                                    Use Template
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </OptimizedSection>

            {/* How It Works Section */}
            <OptimizedSection className="py-24 bg-white" threshold={0.2}>
                <div className="container mx-auto px-4">
                    <motion.div
                        variants={optimizedContainerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        className="text-center mb-16"
                    >
                        <OptimizedItem className="inline-block px-4 py-1.5 bg-indigo-100 rounded-full text-indigo-700 font-medium text-sm mb-6">
                            Simple Process
                        </OptimizedItem>
                        <OptimizedItem className="text-4xl font-bold text-slate-900 mb-6">
                            How It Works
                        </OptimizedItem>
                        <OptimizedItem className="text-xl text-slate-600 max-w-2xl mx-auto">
                            From upload to interview-ready in minutes
                        </OptimizedItem>
                    </motion.div>

                    <div className="relative max-w-5xl mx-auto">
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-blue-200 -translate-y-1/2 hidden md:block"></div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
                            {howItWorksSteps.map((item, index) => (
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
            </OptimizedSection>

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
                                {socialLinks.map((social, i) => (
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
                                                onClick={(e) => {
                                                    if (link.onClick) {
                                                        e.preventDefault();
                                                        link.onClick();
                                                    }
                                                }}
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
                            <a href="https://www.buymeacoffee.com/gauravsinha" target="_blank">
                                <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 40px !important;width: 160px !important;" />
                            </a>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-8 mt-8 text-center text-slate-500 text-sm">
                        <p>© {new Date().getFullYear()} WhatTheCV. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            <PrivacyPolicyModal
                isOpen={isPrivacyModalOpen}
                onClose={handleClosePrivacyModal}
            />
        </div>
    );
};

export default OptimizedLandingPage; 