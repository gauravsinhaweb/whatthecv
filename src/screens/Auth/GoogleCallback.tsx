import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSession } from '../../lib/supabase';

export default function GoogleCallback() {
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                setIsProcessing(true);
                setError(null);

                // Wait a bit for Supabase to process the OAuth callback
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Check if we have a session (the auth state change listener will handle setting the user)
                const { session } = await getSession();
                console.log('GoogleCallback session check:', { session, hasUser: !!session?.user });

                if (session?.user) {
                    console.log('OAuth callback successful, redirecting to dashboard');
                    navigate('/dashboard');
                } else {
                    throw new Error('No session found after OAuth callback');
                }
            } catch (err) {
                console.error('OAuth callback error:', err);
                setError(err instanceof Error ? err.message : 'Authentication failed');
            } finally {
                setIsProcessing(false);
            }
        };

        handleCallback();
    }, [location, navigate]);

    if (isProcessing) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-lg">Processing authentication...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center text-red-600">
                    <h2 className="text-2xl font-bold mb-4">Authentication Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return null;
} 