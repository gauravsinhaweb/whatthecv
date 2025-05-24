import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Briefcase } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import { subscribeToNotifications, NotificationType } from '../../services/notification';

const RecruiterComingSoon: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubscribe = async () => {
        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        try {
            setIsLoading(true);
            await subscribeToNotifications(email, NotificationType.RECRUITER);
            setIsSubscribed(true);
            toast.success('Successfully subscribed to recruiter portal notifications!');
            setEmail('');
        } catch (error) {
            toast.error('Failed to subscribe. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement;
        setEmail(input.value);
    };

    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                        <Briefcase className="h-10 w-10 text-blue-600" />
                    </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                    Recruiter Portal - Coming Soon
                </h1>
                <div className="flex items-center justify-center space-x-2 mb-6">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <p className="text-slate-600">Launching shortly</p>
                </div>
                <p className="text-slate-600 max-w-2xl mx-auto mb-8">
                    We're working hard to bring you a comprehensive set of tools for recruiters.
                    The Recruiter Portal will help you find the perfect candidates, post jobs,
                    and streamline your hiring process.
                </p>
                <Button
                    onClick={() => navigate('/')}
                    leftIcon={<ArrowLeft className="h-4 w-4 mr-2" />}
                    variant="outline"
                >
                    Back to Home
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mt-12">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">
                    Features Coming to the Recruiter Portal
                </h2>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div className="border border-slate-200 rounded-lg p-4">
                        <h3 className="font-medium text-slate-800 mb-2">Job Posting</h3>
                        <p className="text-sm text-slate-600">
                            Create and manage job listings with detailed requirements and qualifications.
                        </p>
                    </div>
                    <div className="border border-slate-200 rounded-lg p-4">
                        <h3 className="font-medium text-slate-800 mb-2">AI-Powered Matching</h3>
                        <p className="text-sm text-slate-600">
                            Automatically find candidates whose resumes best match your job requirements.
                        </p>
                    </div>
                    <div className="border border-slate-200 rounded-lg p-4">
                        <h3 className="font-medium text-slate-800 mb-2">Candidate Management</h3>
                        <p className="text-sm text-slate-600">
                            Track applicants, schedule interviews, and collaborate with your team.
                        </p>
                    </div>
                    <div className="border border-slate-200 rounded-lg p-4">
                        <h3 className="font-medium text-slate-800 mb-2">Analytics Dashboard</h3>
                        <p className="text-sm text-slate-600">
                            Get insights into your hiring process with comprehensive analytics and reports.
                        </p>
                    </div>
                </div>
            </div>

            <div className="text-center mt-12">
                {isSubscribed ? (
                    <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">You're on the list!</h3>
                        <p className="text-slate-600 mb-4">
                            We'll notify you when the Recruiter Portal launches. Stay tuned for updates!
                        </p>
                        <Button
                            onClick={() => setIsSubscribed(false)}
                            variant="outline"
                            className="text-sm"
                        >
                            Subscribe Another Email
                        </Button>
                    </div>
                ) : (
                    <>
                        <p className="text-slate-500 text-sm">
                            Want to get notified when the Recruiter Portal launches?
                        </p>
                        <div className="flex max-w-md mx-auto mt-4">
                            <input
                                type="email"
                                placeholder="Your email address"
                                value={email}
                                onChange={handleEmailChange}
                                className="flex-grow p-2 border border-slate-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Button
                                onClick={handleSubscribe}
                                disabled={isLoading}
                                className="rounded-l-none"
                            >
                                {isLoading ? 'Subscribing...' : 'Notify Me'}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default RecruiterComingSoon; 