import { createClient } from '@supabase/supabase-js';
import { getCookie, removeCookie, setCookie } from '../utils/cookies';
import { removeToken, removeUserProfile, setToken, setUserProfile } from '../utils/storage';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: {
            getItem: (key) => {
                const value = getCookie(key);
                console.log('Supabase storage getItem:', { key, value });
                return value;
            },
            setItem: (key, value) => {
                console.log('Supabase storage setItem:', { key, value });
                setCookie(key, value);
            },
            removeItem: (key) => {
                console.log('Supabase storage removeItem:', { key });
                removeCookie(key);
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