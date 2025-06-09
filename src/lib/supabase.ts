import { createClient } from '@supabase/supabase-js'
import { removeToken, setToken } from '../utils/storage';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'whatthecv-auth-token',
        storage: {
            getItem: (key) => {
                const value = localStorage.getItem(key);
                return value ? JSON.parse(value) : null;
            },
            setItem: (key, value) => {
                localStorage.setItem(key, JSON.stringify(value));
                const parsedValue = typeof value === 'string' ? JSON.parse(value) : value;
                if (parsedValue?.session?.access_token) {
                    setToken(parsedValue.session.access_token);
                }
            },
            removeItem: (key) => {
                localStorage.removeItem(key);
                removeToken();
            }
        }
    }
})

// Set up auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'TOKEN_REFRESHED' && session) {
        setToken(session.access_token);
    } else if (event === 'SIGNED_OUT') {
        removeToken();
    }
});

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

    if (error) {
        console.error('Error signing in with Google:', error)
        throw error
    }

    return data
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