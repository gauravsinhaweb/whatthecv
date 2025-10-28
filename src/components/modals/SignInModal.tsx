import { X, LogIn, Shield, Save, FileText, Download, Users, Zap } from 'lucide-react';
import React from 'react';
import GoogleSignInButton from '../ui/GoogleSignInButton';

interface SignInModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSignIn: () => Promise<void>;
    isLoading: boolean;
}

const SignInModal: React.FC<SignInModalProps> = ({
    isOpen,
    onClose,
    onSignIn,
    isLoading
}) => {
    if (!isOpen) return null;

    const features = [
        {
            icon: <Save className="w-5 h-5 text-blue-600" />,
            title: "Save & Sync",
            description: "Save your resumes in the cloud and access them anywhere"
        },
        {
            icon: <FileText className="w-5 h-5 text-green-600" />,
            title: "Multiple Versions",
            description: "Create different versions for different job applications"
        },
        {
            icon: <Download className="w-5 h-5 text-purple-600" />,
            title: "Export PDF",
            description: "Download your resumes as professional PDF files"
        },
        {
            icon: <Zap className="w-5 h-5 text-orange-600" />,
            title: "Auto-Save",
            description: "Never lose your work with automatic saving"
        }
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div>
                                <h3 className="text-lg font-semibold text-white">Unlock Premium Features
                                </h3>
                                <p className="text-blue-100 text-sm">
                                    Sign in to save your work and access all features
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            disabled={isLoading}
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="space-y-6">
                        <div className="space-y-4">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                                    <div className="flex-shrink-0 mt-0.5">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h5 className="font-medium text-slate-900 text-sm">
                                            {feature.title}
                                        </h5>
                                        <p className="text-slate-600 text-xs mt-1">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                            <GoogleSignInButton
                                onClick={onSignIn}
                                isLoading={isLoading}
                                disabled={isLoading}
                                size="lg"
                                fullWidth
                            />
                        </div>

                        <div className="text-center">
                            <p className="text-xs text-slate-500">
                                By signing in, you agree to our{' '}
                                <a href="/terms" className="text-blue-600 hover:underline">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="/privacy-policy" className="text-blue-600 hover:underline">
                                    Privacy Policy
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInModal;
