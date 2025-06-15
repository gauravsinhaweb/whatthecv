import { UserProfile } from './types';

const TOKEN_KEY = 'auth-token';
const PROFILE_KEY = 'user-profile';

export function setToken(token: string): void {
    try {
        if (token.length === 0) return;
        document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; secure; samesite=lax`;
    } catch (error) {
        console.error('Error setting token:', error);
    }
}

export function getToken(): string | null {
    try {
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith(`${TOKEN_KEY}=`));

        if (tokenCookie) {
            const token = decodeURIComponent(tokenCookie.split('=')[1]);
            return token;
        }

        console.warn('No token found in cookies');
        return null;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
}

export function removeToken(): void {
    try {
        const domain = window.location.hostname;
        const isLocalhost = domain === 'localhost' || domain === '127.0.0.1';

        // Remove cookie with proper domain
        const cookieOptions = [
            `${TOKEN_KEY}=`,
            'path=/',
            'expires=Thu, 01 Jan 1970 00:00:00 GMT',
            'secure',
            'samesite=lax'
        ];

        if (!isLocalhost) {
            cookieOptions.push(`domain=.${domain}`);
        }

        document.cookie = cookieOptions.join('; ');
    } catch (error) {
        console.error('Error removing token:', error);
    }
}

export function setUserProfile(profile: UserProfile): void {
    try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
        console.log('User profile stored:', !!profile);
    } catch (error) {
        console.error('Error storing user profile:', error);
    }
}

export function getUserProfile(): UserProfile | null {
    try {
        const profile = localStorage.getItem(PROFILE_KEY);
        if (profile) {
            return JSON.parse(profile);
        }
        return null;
    } catch (error) {
        console.error('Error retrieving user profile:', error);
        return null;
    }
}

export function removeUserProfile(): void {
    try {
        localStorage.removeItem(PROFILE_KEY);
        console.log('User profile removed');
    } catch (error) {
        console.error('Error removing user profile:', error);
    }
} 