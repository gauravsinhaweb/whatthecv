import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { containerVariants, itemVariants } from '../../utils/animations';

interface FaqItem {
    question: string;
    answer: string;
}

const faqs: FaqItem[] = [
    {
        question: "What is an ATS and why is it important?",
        answer: "An Applicant Tracking System (ATS) is software used by employers to scan, filter, and rank job applications. It's important because 75% of resumes are rejected by ATS before a human ever sees them. Our platform helps ensure your resume passes these systems."
    },
    {
        question: "How does the resume analyzer work?",
        answer: "Our AI-powered resume analyzer scans your resume for keywords, formatting issues, and content gaps, comparing it against job descriptions and industry standards. It then provides a compatibility score and recommendations for improvements."
    },
    {
        question: "Can I use this for any industry or job type?",
        answer: "Yes! Our platform is designed to work across all industries and job types. We have specialized algorithms for different sectors including tech, finance, healthcare, marketing, and more."
    },
    {
        question: "How much does it cost to use the platform?",
        answer: "We offer a free plan that allows basic resume analysis and optimization. Premium plans with advanced features start at a competitive monthly subscription fee. Check our pricing page for current rates and features."
    },
    {
        question: "Can I try before I commit to a paid plan?",
        answer: "Absolutely! You can use our basic ATS check completely free. This gives you a chance to see the value of our platform before deciding to upgrade to a premium plan."
    },
    {
        question: "How long does it take to optimize my resume?",
        answer: "The initial analysis takes just seconds. Implementing our suggestions might take 15-30 minutes, depending on how many changes are needed. Many users report significant improvements in their ATS score within minutes."
    }
];

const FaqSection: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={containerVariants}
                    className="text-center mb-16"
                >
                    <motion.div variants={itemVariants} className="inline-block px-4 py-1.5 bg-indigo-100 rounded-full text-indigo-700 font-medium text-sm mb-6">
                        Common Questions
                    </motion.div>
                    <motion.h2 variants={itemVariants} className="text-4xl font-bold text-slate-900 mb-6">
                        Frequently Asked Questions
                    </motion.h2>
                    <motion.p variants={itemVariants} className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Everything you need to know about our platform and how it works
                    </motion.p>
                </motion.div>

                <div className="max-w-3xl mx-auto">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            className="mb-4"
                        >
                            <button
                                onClick={() => toggleFaq(index)}
                                className={`w-full text-left p-5 flex justify-between items-center rounded-xl ${activeIndex === index
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-white hover:bg-blue-50 text-slate-800 border border-slate-200'
                                    } transition-all duration-300`}
                            >
                                <span className="font-medium">{faq.question}</span>
                                <ChevronDown
                                    className={`h-5 w-5 transition-transform duration-300 ${activeIndex === index ? 'transform rotate-180' : ''
                                        }`}
                                />
                            </button>
                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-5 bg-white border border-slate-200 border-t-0 rounded-b-xl">
                                            <p className="text-slate-600">{faq.answer}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FaqSection; 