import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../ui/Button';

interface PrivacyPolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="privacy-policy-title">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                    aria-hidden="true"
                />
                <div
                    className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6"
                    role="document"
                >
                    <div className="flex justify-between items-start mb-4">
                        <h2 id="privacy-policy-title" className="text-2xl font-bold text-gray-900">
                            Privacy Policy
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Close privacy policy"
                        >
                            <span className="sr-only">Close</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="prose prose-blue max-w-none">
                        <div className="space-y-6">
                            <section>
                                <h3 className="text-lg font-semibold text-slate-900">1. Information We Collect</h3>
                                <p className="text-slate-600">We collect information that you provide directly to us, including:</p>
                                <ul className="list-disc pl-6 text-slate-600 space-y-1">
                                    <li>Resume content and personal information</li>
                                    <li>Email address for notifications</li>
                                    <li>Usage data and preferences</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold text-slate-900">2. How We Use Your Information</h3>
                                <p className="text-slate-600">We use the collected information to:</p>
                                <ul className="list-disc pl-6 text-slate-600 space-y-1">
                                    <li>Provide and improve our resume optimization services</li>
                                    <li>Send notifications about new features and updates</li>
                                    <li>Analyze and enhance user experience</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold text-slate-900">3. Data Security</h3>
                                <p className="text-slate-600">
                                    We implement appropriate security measures to protect your personal information.
                                    However, no method of transmission over the internet is 100% secure.
                                </p>
                                <p className="text-slate-600 mt-2">
                                    Your data is stored temporarily and is automatically deleted after a certain period.
                                    We do not retain your information longer than necessary to provide our services.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold text-slate-900">4. Third-Party Services</h3>
                                <p className="text-slate-600">
                                    We may use third-party services that collect, monitor, and analyze user data.
                                    These services have their own privacy policies.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold text-slate-900">5. Your Rights</h3>
                                <p className="text-slate-600">You have the right to:</p>
                                <ul className="list-disc pl-6 text-slate-600 space-y-1">
                                    <li>Access your personal information</li>
                                    <li>Correct inaccurate data</li>
                                    <li>Request deletion of your data</li>
                                    <li>Opt-out of communications</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold text-slate-900">6. Contact Us</h3>
                                <p className="text-slate-600">
                                    If you have any questions about this Privacy Policy, please contact us at{' '}
                                    <a
                                        href="mailto:sinhagaurav.me@gmail.com"
                                        className="text-blue-600 hover:text-blue-700 underline"
                                    >
                                        sinhagaurav.me@gmail.com
                                    </a>
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyModal; 