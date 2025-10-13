import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Section, Item } from './Section';

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
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <Section className="py-24 bg-white" threshold={0.2}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <Item className="inline-block px-4 py-1.5 bg-green-100 rounded-full text-green-700 font-medium text-sm mb-6">
                        FAQ
                    </Item>
                    <Item as={motion.h2} className="text-4xl font-bold text-slate-900 mb-6">
                        Frequently Asked Questions
                    </Item>
                    <Item as={motion.p} className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Everything you need to know about our AI-powered resume optimization platform
                    </Item>
                </div>

                <motion.div
                    className="max-w-3xl mx-auto space-y-4"
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    {faqData.map((faq, index) => (
                        <motion.div
                            key={index}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                            <motion.button
                                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
                                onClick={() => toggleFaq(index)}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {openIndex === index ? (
                                        <ChevronUp className="h-5 w-5 text-slate-500 flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-slate-500 flex-shrink-0" />
                                    )}
                                </motion.div>
                            </motion.button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-4 text-slate-600 leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true, amount: 0.5 }}
                    className="text-center mt-12"
                >
                    <p className="text-slate-600 mb-4">
                        Still have questions? We're here to help!
                    </p>
                    <motion.a
                        href="mailto:support@whatthecv.com"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Contact Support
                    </motion.a>
                </motion.div>
            </div>
        </Section>
    );
};

export default FaqSection; 