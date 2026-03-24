import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import supabase, { getSession } from '../../lib/supabase';

function readOAuthParamsFromWindow(): Record<string, string> {
    if (typeof window === 'undefined') {
        return {};
    }
    const out: Record<string, string> = {};
    const url = new URL(window.location.href);
    if (url.hash.startsWith('#')) {
        try {
            new URLSearchParams(url.hash.slice(1)).forEach((value, key) => {
                out[key] = value;
            });
        } catch {
        }
    }
    url.searchParams.forEach((value, key) => {
        out[key] = value;
    });
    return out;
}

export default function GoogleCallback() {
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;

        const handleCallback = async () => {
            try {
                setIsProcessing(true);
                setError(null);

                const fromUrl = readOAuthParamsFromWindow();
                const oauthError = fromUrl.error;
                const oauthDescription = fromUrl.error_description;
                if (oauthError) {
                    throw new Error(
                        (oauthDescription && oauthDescription.replace(/\+/g, ' ')) || oauthError
                    );
                }

                const { error: initError } = await supabase.auth.initialize();
                if (initError) {
                    throw new Error(initError.message || 'Authentication failed');
                }

                let { session } = await getSession();
                if (!session?.user) {
                    session = await new Promise((resolve, reject) => {
                        let timeoutId: number | undefined;
                        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
                            if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && nextSession?.user) {
                                if (timeoutId !== undefined) {
                                    window.clearTimeout(timeoutId);
                                }
                                subscription.unsubscribe();
                                resolve(nextSession);
                            }
                        });
                        timeoutId = window.setTimeout(() => {
                            subscription.unsubscribe();
                            reject(new Error('No session found after OAuth callback'));
                        }, 15000);
                    });
                }

                if (cancelled) {
                    return;
                }

                if (session?.user) {
                    navigate('/dashboard', { replace: true });
                } else {
                    throw new Error('No session found after OAuth callback');
                }
            } catch (err) {
                if (!cancelled) {
                    console.error('OAuth callback error:', err);
                    setError(err instanceof Error ? err.message : 'Authentication failed');
                }
            } finally {
                if (!cancelled) {
                    setIsProcessing(false);
                }
            }
        };

        handleCallback();
        return () => {
            cancelled = true;
        };
    }, [location.pathname, location.search, location.hash, navigate]);

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