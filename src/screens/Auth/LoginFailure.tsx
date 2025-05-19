import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const LoginFailure: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [error, setError] = useState<string>('Authentication failed');

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const errorMsg = searchParams.get('error');

        if (errorMsg) {
            setError(decodeURIComponent(errorMsg));
        }

        // Redirect to home page after a delay
        const timer = setTimeout(() => {
            navigate('/');
        }, 5000);

        return () => clearTimeout(timer);
    }, [location, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <AlertCircle className="h-12 w-12 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        Authentication Failed
                    </h2>
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md text-sm mb-6">
                        {error}
                    </div>
                    <p className="text-slate-600">
                        There was a problem signing you in with Google.
                        Please try again or contact support if the problem persists.
                    </p>
                    <div className="mt-6">
                        <button
                            onClick={() => navigate('/')}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Return to Home
                        </button>
                    </div>
                    <p className="text-slate-500 text-xs mt-4">
                        Redirecting to home page in 5 seconds...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginFailure; 