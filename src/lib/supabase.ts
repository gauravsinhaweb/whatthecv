import { createClient } from '@supabase/supabase-js';
import Cookies from 'js-cookie';
import { removeToken, removeUserProfile, setToken, setUserProfile } from '../utils/storage';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

const supabaseAuthCookieOptions = {
    path: '/',
    sameSite: 'lax' as const,
    secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
    expires: 7,
};

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: {
            getItem: (key) => Cookies.get(key) ?? null,
            setItem: (key, value) => {
                Cookies.set(key, value, supabaseAuthCookieOptions);
            },
            removeItem: (key) => {
                Cookies.remove(key, { path: '/' });
            },
        },
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
});

export default supabase;

export const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent'
            }
        }
    })

    return { data, error }
}

export const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
        console.error('Error signing out:', error)
        throw error
    }
    removeToken()
}

export const getSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
        console.error('Error getting session:', error)
        throw error
    }
    return { session }
}

export const getUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
        console.error('Error getting user:', error)
        throw error
    }
    return user
}

export const refreshSession = async () => {
    const { data: { session }, error } = await supabase.auth.refreshSession()
    if (error) {
        console.error('Error refreshing session:', error)
        throw error
    }
    if (session) {
        setToken(session.access_token)
    }
    return { session }
}

export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
} 