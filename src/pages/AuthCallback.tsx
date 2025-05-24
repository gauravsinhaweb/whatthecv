import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                const { error } = await supabase.auth.getSession();
                if (error) throw error;

                // Redirect to home page after successful authentication
                navigate('/');
            } catch (error) {
                console.error('Error handling auth callback:', error);
                navigate('/login?error=auth_callback_failed');
            }
        };

        handleAuthCallback();
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">Completing sign in...</h2>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            </div>
        </div>
    );
};

export default AuthCallback; 