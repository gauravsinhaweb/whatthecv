import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSession, getUser } from '../../lib/supabase';
import { useUserStore } from '../../store/userStore';
import { setToken, setUserProfile } from '../../utils/storage';
import { UserProfile } from '../../utils/types';

export default function GoogleCallback() {
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const setUser = useUserStore((state) => state.setUser);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                setIsProcessing(true);
                setError(null);
                console.log('dddsdsdsdsd')
                // Get Supabase session
                const { session } = await getSession();
                if (!session) {
                    throw new Error('Failed to get Supabase session');
                }

                // Get user data from Supabase
                const userData = await getUser();
                if (!userData) {
                    throw new Error('Failed to get user data');
                }

                // Store FastAPI token
                setToken(session.access_token);
                console.log('FastAPI token stored');

                // Create user profile
                const profile: UserProfile = {
                    id: userData.id,
                    email: userData.email || '',
                    name: userData.user_metadata?.full_name,
                    avatar_url: userData.user_metadata?.avatar_url,
                    created_at: userData.created_at,
                    updated_at: userData.updated_at
                };

                // Store user profile
                setUserProfile(profile);
                setUser(profile);

                console.log('Authentication successful');
                navigate('/dashboard');
            } catch (err) {
                console.error('Authentication error:', err);
                setError(err instanceof Error ? err.message : 'Authentication failed');
                navigate('/auth/login/failure');
            } finally {
                setIsProcessing(false);
            }
        };

        handleCallback();
    }, [location, navigate, setUser]);

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