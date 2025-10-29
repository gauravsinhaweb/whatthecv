import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { Section } from './Section';

interface FAQItem {
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        question: "How does the ATS optimization work?",
        answer: "Our AI analyzes your resume against job descriptions and Applicant Tracking Systems to ensure maximum visibility. It checks for keyword matching, formatting compatibility, and provides specific recommendations to improve your ATS score."
    },
    {
        question: "What file formats are supported?",
        answer: "We support PDF, Word (.docx), and plain text files for resume uploads. For analysis, we recommend PDF format for best results. You can export your optimized resume in PDF, Word, or plain text formats."
    },
    {
        question: "How accurate is the AI analysis?",
        answer: "Our AI achieves 95% accuracy in resume analysis, including grammar checking, keyword optimization, and ATS compatibility scoring. The system continuously learns from industry trends to provide the most relevant recommendations."
    },
    {
        question: "Can I create multiple resume versions?",
        answer: "Yes! You can create and manage multiple versions of your resume tailored for different job applications. Each version can be optimized for specific industries, roles, or companies."
    },
    {
        question: "Is my data secure?",
        answer: "Absolutely. We use enterprise-grade encryption and follow strict data protection protocols. Your resume data is never shared with third parties and is automatically deleted after analysis unless you choose to save it."
    },
    {
        question: "How long does the analysis take?",
        answer: "Our AI analysis typically completes within 30-60 seconds. The process includes content analysis, keyword optimization, ATS scoring, and generating detailed improvement recommendations."
    }
];

const FaqSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <Section className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" threshold={0.2}>
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
                    {/* Left Column - Heading */}
                    <div className="lg:col-span-4">
                        <motion.h2
                            className="font-display text-4xl lg:text-5xl font-medium text-slate-900"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            FAQs
                        </motion.h2>
                    </div>

                    {/* Right Column - FAQ Items */}
                    <div className="lg:col-span-8">
                        <motion.div
                            className="space-y-4"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            variants={{
                                visible: {
                                    transition: {
                                        staggerChildren: 0.05
                                    }
                                }
                            }}
                        >
                            {faqData.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    variants={{
                                        hidden: { opacity: 0, y: 10 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                    className="bg-white rounded-lg overflow-hidden"
                                >
                                    <button
                                        className="w-full px-6 py-5 text-left flex items-start justify-between gap-4"
                                        onClick={() => toggleFaq(index)}
                                    >
                                        <span className="text-lg text-slate-600 pr-4">
                                            {faq.question}
                                        </span>
                                        <motion.div
                                            animate={{ rotate: openIndex === index ? 45 : 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex-shrink-0 mt-0.5"
                                        >
                                            <Plus className="h-5 w-5 text-slate-400" />
                                        </motion.div>
                                    </button>

                                    <AnimatePresence>
                                        {openIndex === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-6 pb-5 text-lg text-slate-600 leading-relaxed">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default FaqSection; 