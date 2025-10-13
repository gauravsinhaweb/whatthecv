import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Section, Item } from '../../components/landing/Section';

const Terms: React.FC = () => {
    const navigate = useNavigate();
    const handleBack = () => navigate('/');

    return (
        <div className="min-h-screen bg-slate-50">
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
                        Terms & Conditions
                    </Item>
                    <Item as={motion.p} className="text-slate-600 mt-2">
                        Last updated: {new Date().toLocaleDateString()}
                    </Item>
                </div>
            </Section>
            <Section className="py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
                        <motion.div
                            className="prose prose-slate max-w-none"
                            initial="hidden"
                            animate="visible"
                            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                        >
                            <Item as={motion.h2} className="text-2xl font-bold text-slate-900 mb-6">
                                Acceptance of Terms
                            </Item>
                            <Item as={motion.p} className="text-slate-700 mb-6 leading-relaxed">
                                By accessing or using WhatTheCV, you agree to be bound by these Terms & Conditions and our Privacy Policy. If you do not agree, please do not use our platform.
                            </Item>
                            <Item as={motion.h2} className="text-2xl font-bold text-slate-900 mb-6 mt-12">
                                Use of the Platform
                            </Item>
                            <Item as={motion.ul} className="list-disc list-inside text-slate-700 mb-6 space-y-2 ml-4">
                                <li>You must be at least 13 years old to use our services.</li>
                                <li>You agree to use the platform only for lawful purposes.</li>
                                <li>You are responsible for maintaining the confidentiality of your account.</li>
                                <li>You may not use the platform to infringe on the rights of others.</li>
                            </Item>
                            <Item as={motion.h2} className="text-2xl font-bold text-slate-900 mb-6 mt-12">
                                Intellectual Property
                            </Item>
                            <Item as={motion.p} className="text-slate-700 mb-6 leading-relaxed">
                                All content, trademarks, and data on this platform, including but not limited to software, databases, text, graphics, icons, and hyperlinks are the property of WhatTheCV or its licensors.
                            </Item>
                            <Item as={motion.h2} className="text-2xl font-bold text-slate-900 mb-6 mt-12">
                                User Content
                            </Item>
                            <Item as={motion.p} className="text-slate-700 mb-6 leading-relaxed">
                                You retain ownership of your resume and other content you upload. By using our platform, you grant us a license to use, store, and process your content as necessary to provide our services.
                            </Item>
                            <Item as={motion.h2} className="text-2xl font-bold text-slate-900 mb-6 mt-12">
                                Disclaimer of Warranties
                            </Item>
                            <Item as={motion.p} className="text-slate-700 mb-6 leading-relaxed">
                                The platform is provided "as is" and "as available" without warranties of any kind. We do not guarantee that the platform will be error-free or uninterrupted.
                            </Item>
                            <Item as={motion.h2} className="text-2xl font-bold text-slate-900 mb-6 mt-12">
                                Limitation of Liability
                            </Item>
                            <Item as={motion.p} className="text-slate-700 mb-6 leading-relaxed">
                                WhatTheCV will not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform.
                            </Item>
                            <Item as={motion.h2} className="text-2xl font-bold text-slate-900 mb-6 mt-12">
                                Changes to Terms
                            </Item>
                            <Item as={motion.p} className="text-slate-700 mb-6 leading-relaxed">
                                We may update these Terms & Conditions from time to time. Continued use of the platform after changes constitutes acceptance of the new terms.
                            </Item>
                            <Item as={motion.h2} className="text-2xl font-bold text-slate-900 mb-6 mt-12">
                                Contact Us
                            </Item>
                            <Item as={motion.p} className="text-slate-700 mb-6 leading-relaxed">
                                If you have any questions about these Terms & Conditions, please contact us at:
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

export default Terms; 