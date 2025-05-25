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
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                    aria-hidden="true"
                />

                <div className="relative w-full max-w-3xl rounded-xl bg-white shadow-2xl transform transition-all">
                    <div className="sticky top-0 z-10 bg-white rounded-t-xl border-b border-slate-200 px-6 py-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-slate-900">Privacy Policy</h2>
                            <button
                                onClick={onClose}
                                className="text-slate-500 hover:text-slate-700 transition-colors p-1 hover:bg-slate-100 rounded-full"
                                aria-label="Close modal"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 py-4">
                        <div className="prose prose-slate max-w-none">
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

                    <div className="sticky bottom-0 bg-white rounded-b-xl border-t border-slate-200 px-6 py-4">
                        <div className="flex justify-end">
                            <Button
                                onClick={onClose}
                                className="px-6"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyModal; 