import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const GoogleCallback: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');

        if (token) {
            // Store token and set authenticated state
            localStorage.setItem('token', token);
            setIsProcessing(false);

            // Navigate to the main app after a short delay
            setTimeout(() => {
                navigate('/analyze');
            }, 1500);
        } else {
            setError('Authentication failed. Please try again.');
            setIsProcessing(false);
            setTimeout(() => navigate('/'), 3000);
        }
    }, [location, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                {error ? (
                    <div className="text-center">
                        <div className="text-xl font-medium text-red-600 mb-4">
                            Authentication Error
                        </div>
                        <p className="text-slate-600">{error}</p>
                        <p className="text-slate-500 text-sm mt-4">
                            Redirecting to home page...
                        </p>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="text-xl font-medium text-blue-600 mb-4">
                            {isProcessing ? 'Processing Authentication...' : 'Authentication Successful'}
                        </div>
                        {isProcessing ? (
                            <div className="flex justify-center my-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <p className="text-slate-600">
                                You've successfully logged in with Google.
                            </p>
                        )}
                        <p className="text-slate-500 text-sm mt-4">
                            {isProcessing ? 'Please wait...' : 'Redirecting to your dashboard...'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GoogleCallback; 