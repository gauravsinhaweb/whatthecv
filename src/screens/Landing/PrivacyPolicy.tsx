import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Section, Item } from '../../components/landing/Section';

const PrivacyPolicy: React.FC = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <Section className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 py-6">
                    <motion.button
                        onClick={handleBack}
                        className="flex items-center text-slate-600 hover:text-slate-900 transition-colors mb-4"
                        whileHover={{ x: -5 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </motion.button>
                    <Item as={motion.h1} className="text-4xl font-bold text-slate-900">
                        Privacy Policy
                    </Item>
                    <Item as={motion.p} className="text-slate-600 mt-2">
                        Last updated: {new Date().toLocaleDateString()}
                    </Item>
                </div>
            </Section>

            {/* Content */}
            <Section className="py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
                        <motion.div
                            className="prose prose-slate max-w-none"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: {
                                    transition: {
                                        staggerChildren: 0.1
                                    }
                                }
                            }}
                        >
                            <Item as={motion.h2} className="text-2xl font-bold text-slate-900 mb-6">
                                Introduction
                            </Item>
                            <Item as={motion.p} className="text-slate-700 mb-6 leading-relaxed">
                                WhatTheCV ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered resume platform.
                            </Item>

                            <Item as={motion.h2} className="text-2xl font-bold text-slate-900 mb-6 mt-12">
                                Information We Collect
                            </Item>
                            <Item as={motion.h3} className="text-xl font-semibold text-slate-900 mb-4">
                                Personal Information
                            </Item>
                            <Item as={motion.p} className="text-slate-700 mb-4 leading-relaxed">
                                We may collect personal information that you provide directly to us, including:
                            </Item>
                            <Item as={motion.ul} className="list-disc list-inside text-slate-700 mb-6 space-y-2 ml-4">
                                <li>Name and contact information (email address)</li>
                                <li>Resume content and job application materials</li>
                                <li>Account credentials and profile information</li>
                                <li>Communication preferences and feedback</li>
                            </Item>

                            <Item as={motion.h3} className="text-xl font-semibold text-slate-900 mb-4">
                                Usage Information
                            </Item>
                            <Item as={motion.p} className="text-slate-700 mb-4 leading-relaxed">
                                We automatically collect certain information about your use of our platform:
                            </Item>
                            <Item as={motion.ul} className="list-disc list-inside text-slate-700 mb-6 space-y-2 ml-4">
                                <li>Log data and device information</li>
                                <li>Usage patterns and feature interactions</li>
                                <li>Performance data and error reports</li>
                                <li>Analytics and improvement metrics</li>
                            </Item>

                            <Item as={motion.h2} className="text-2xl font-bold text-slate-900 mb-6 mt-12">
                                How We Use Your Information
                            </Item>
                            <Item as={motion.p} className="text-slate-700 mb-4 leading-relaxed">
                                We use the information we collect to:
                            </Item>
                            <Item as={motion.ul} className="list-disc list-inside text-slate-700 mb-6 space-y-2 ml-4">
                                <li>Provide and improve our resume optimization services</li>
                                <li>Analyze resumes using AI algorithms for ATS compatibility</li>
                                <li>Personalize your experience and recommendations</li>
                                <li>Communicate with you about our services</li>
                                <li>Ensure platform security and prevent fraud</li>
                                <li>Comply with legal obligations</li>
                            </Item>

                            <Item as={motion.h2} className="text-2xl font-bold text-slate-900 mb-6 mt-12">
                                Information Sharing and Disclosure
                            </Item>
                            <Item as={motion.p} className="text-slate-700 mb-4 leading-relaxed">
                                We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
                            </Item>
                            <Item as={motion.ul} className="list-disc list-inside text-slate-700 mb-6 space-y-2 ml-4">
                                <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in operating our platform</li>
                                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                                <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
                            </Item>

                            <Item as={motion.h2} className="text-2xl font-bold text-slate-900 mb-6 mt-12">
                                Data Security
                            </Item>
                            <Item as={motion.p} className="text-slate-700 mb-6 leading-relaxed">
                                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                            </Item>

                            <Item as={motion.h2} className="text-2xl font-bold text-slate-900 mb-6 mt-12">
                                Data Retention
                            </Item>
                            <Item as={motion.p} className="text-slate-700 mb-6 leading-relaxed">
                                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
                            </Item>

                            <Item as={motion.h2} className="text-2xl font-bold text-slate-900 mb-6 mt-12">
                                Your Rights and Choices
                            </Item>
                            <Item as={motion.p} className="text-slate-700 mb-4 leading-relaxed">
                                You have the right to:
                            </Item>
                            <Item as={motion.ul} className="list-disc list-inside text-slate-700 mb-6 space-y-2 ml-4">
                                <li>Access and update your personal information</li>
                                <li>Request deletion of your data</li>
                                <li>Opt-out of marketing communications</li>
                                <li>Control cookie preferences</li>
                                <li>Export your data in a portable format</li>
                            </Item>

                            <Item as={motion.h2} className="text-2xl font-bold text-slate-900 mb-6 mt-12">
                                Cookies and Tracking Technologies
                            </Item>
                            <Item as={motion.p} className="text-slate-700 mb-6 leading-relaxed">
                                We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and improve our services. You can control cookie settings through your browser preferences.
                            </Item>

                            <Item as={motion.h2} className="text-2xl font-bold text-slate-900 mb-6 mt-12">
                                Third-Party Services
                            </Item>
                            <Item as={motion.p} className="text-slate-700 mb-6 leading-relaxed">
                                Our platform may integrate with third-party services (e.g., authentication providers, analytics tools). These services have their own privacy policies, and we encourage you to review them.
                            </Item>

                            <Item as={motion.h2} className="text-2xl font-bold text-slate-900 mb-6 mt-12">
                                Children's Privacy
                            </Item>
                            <Item as={motion.p} className="text-slate-700 mb-6 leading-relaxed">
                                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                            </Item>

                            <Item as={motion.h2} className="text-2xl font-bold text-slate-900 mb-6 mt-12">
                                International Data Transfers
                            </Item>
                            <Item as={motion.p} className="text-slate-700 mb-6 leading-relaxed">
                                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data.
                            </Item>

                            <Item as={motion.h2} className="text-2xl font-bold text-slate-900 mb-6 mt-12">
                                Changes to This Privacy Policy
                            </Item>
                            <Item as={motion.p} className="text-slate-700 mb-6 leading-relaxed">
                                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                            </Item>

                            <Item as={motion.h2} className="text-2xl font-bold text-slate-900 mb-6 mt-12">
                                Contact Us
                            </Item>
                            <Item as={motion.p} className="text-slate-700 mb-6 leading-relaxed">
                                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
                            </Item>
                            <Item as={motion.div} className="bg-slate-50 p-6 rounded-lg">
                                <p className="text-slate-700 mb-2">
                                    <strong>Email:</strong> support@whatthecv.com
                                </p>
                                <p className="text-slate-700 mb-2">
                                    <strong>Website:</strong> whatthecv.com
                                </p>
                            </Item>
                        </motion.div>
                    </div>
                </div>
            </Section>
        </div>
    );
};

export default PrivacyPolicy; 