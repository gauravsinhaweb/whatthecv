import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import supabase, { getSession, getUser, signInWithGoogle, signOut as supabaseSignOut } from '../lib/supabase';
import { useUserStore } from '../store/userStore';
import { removeToken, removeUserProfile, setToken, setUserProfile } from '../utils/storage';
import { UserProfile } from '../utils/types';

interface AuthState {
    user: UserProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

interface AuthActions {
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    refreshSession: () => Promise<void>;
    clearError: () => void;
}

export const useAuth = (): AuthState & AuthActions => {
    const navigate = useNavigate();
    const { user, isAuthenticated, loginError, setUser, setIsAuthenticated, setLoginError, clearUser } = useUserStore();

    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const clearError = useCallback(() => {
        setLoginError(null);
    }, [setLoginError]);

    const signIn = useCallback(async () => {
        try {
            setIsLoading(true);
            setLoginError(null);

            const result = await signInWithGoogle();

            if (result.error) {
                console.error('Sign in error:', result.error);
                setLoginError(result.error.message);
                toast.error('Failed to sign in. Please try again.');
                return;
            }

            if (result.data?.url) {
                window.location.href = result.data.url;
            }
        } catch (error) {
            console.error('Sign in error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
            setLoginError(errorMessage);
            toast.error('Failed to sign in. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [setLoginError]);

    const signOut = useCallback(async () => {
        try {
            setIsLoading(true);
            setLoginError(null);

            await supabaseSignOut();

            clearUser();
            removeToken();
            removeUserProfile();

            navigate('/');
            toast.success('Signed out successfully');
        } catch (error) {
            console.error('Sign out error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to sign out';
            setLoginError(errorMessage);
            toast.error('Failed to sign out');
        } finally {
            setIsLoading(false);
        }
    }, [clearUser, navigate, setLoginError]);

    const refreshSession = useCallback(async () => {
        try {
            setIsLoading(true);

            const { data, error } = await supabase.auth.refreshSession();

            if (error) {
                console.error('Session refresh error:', error);
                clearUser();
                removeToken();
                removeUserProfile();
                return;
            }

            if (data.session?.user) {
                const userProfile: UserProfile = {
                    id: data.session.user.id,
                    email: data.session.user.email || '',
                    name: data.session.user.user_metadata?.full_name || data.session.user.user_metadata?.name || data.session.user.email?.split('@')[0] || '',
                    avatar_url: data.session.user.user_metadata?.avatar_url || data.session.user.user_metadata?.picture || '',
                    created_at: data.session.user.created_at,
                    updated_at: data.session.user.updated_at
                };

                setToken(data.session.access_token);
                setUserProfile(userProfile);
                setUser(userProfile);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Session refresh error:', error);
            clearUser();
            removeToken();
            removeUserProfile();
        } finally {
            setIsLoading(false);
        }
    }, [setUser, setIsAuthenticated, clearUser]);

    const initializeAuth = useCallback(async () => {
        try {
            setIsLoading(true);

            // Try to get the session directly first
            const { session } = await getSession();
            console.log('Direct session check in initializeAuth:', { session, hasUser: !!session?.user });

            if (session?.user) {
                const userProfile: UserProfile = {
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
                    avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || '',
                    created_at: session.user.created_at,
                    updated_at: session.user.updated_at
                };

                console.log('Setting user from direct session check:', userProfile);
                setToken(session.access_token);
                setUserProfile(userProfile);
                setUser(userProfile);
                setIsAuthenticated(true);
            } else {
                console.log('No session found in direct check, waiting for INITIAL_SESSION event');
                // Don't clear state here, let INITIAL_SESSION event handle it
            }
        } catch (error) {
            console.error('Auth initialization error:', error);
        } finally {
            setIsLoading(false);
            setIsInitialized(true);
        }
    }, [setUser, setIsAuthenticated]);

    useEffect(() => {
        if (!isInitialized) {
            initializeAuth();
        }
    }, [isInitialized, initializeAuth]);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state change:', event, session);

            if (event === 'INITIAL_SESSION') {
                console.log('INITIAL_SESSION event:', { event, session, hasUser: !!session?.user });
                if (session?.user) {
                    const userProfile: UserProfile = {
                        id: session.user.id,
                        email: session.user.email || '',
                        name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
                        avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || '',
                        created_at: session.user.created_at,
                        updated_at: session.user.updated_at
                    };

                    setToken(session.access_token);
                    setUserProfile(userProfile);
                    setUser(userProfile);
                    setIsAuthenticated(true);
                    console.log('Initial session found, user authenticated:', userProfile);
                } else {
                    // Only clear state if we're sure there's no session and user is not already authenticated
                    if (!isAuthenticated) {
                        clearUser();
                        removeToken();
                        removeUserProfile();
                        console.log('No initial session found, cleared state');
                    } else {
                        console.log('No initial session but user already authenticated, keeping state');
                    }
                }
            } else if (event === 'SIGNED_IN' && session?.user) {
                console.log('SIGNED_IN event:', { event, session, hasUser: !!session?.user });
                const userProfile: UserProfile = {
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
                    avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || '',
                    created_at: session.user.created_at,
                    updated_at: session.user.updated_at
                };

                setToken(session.access_token);
                setUserProfile(userProfile);
                setUser(userProfile);
                setIsAuthenticated(true);
                setLoginError(null);

                console.log('User signed in via auth state change:', userProfile);
            } else if (event === 'SIGNED_OUT') {
                console.log('User signed out, clearing state');
                clearUser();
                removeToken();
                removeUserProfile();
                console.log('User signed out via auth state change');
            } else if (event === 'TOKEN_REFRESHED' && session?.user) {
                console.log('TOKEN_REFRESHED event:', { event, session, hasUser: !!session?.user });
                const userProfile: UserProfile = {
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
                    avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || '',
                    created_at: session.user.created_at,
                    updated_at: session.user.updated_at
                };

                setToken(session.access_token);
                setUserProfile(userProfile);
                setUser(userProfile);
                setIsAuthenticated(true);

                console.log('Token refreshed:', userProfile);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [setUser, setIsAuthenticated, clearUser, setLoginError, isAuthenticated]);

    return {
        user,
        isAuthenticated,
        isLoading: isLoading || !isInitialized,
        error: loginError,
        signIn,
        signOut,
        refreshSession,
        clearError
    };
};
