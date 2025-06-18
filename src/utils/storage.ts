import { COOKIE_KEYS, getCookie, removeCookie, setCookie } from './cookies';

export const setToken = (token: string) => {
    try {
        setCookie(COOKIE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
        console.error('Error setting token:', error);
    }
};

/**
 * Get the auth token
 */
export const getToken = () => {
    try {
        return getCookie(COOKIE_KEYS.AUTH_TOKEN);
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

/**
 * Remove the auth token
 */
export const removeToken = () => {
    try {
        removeCookie(COOKIE_KEYS.AUTH_TOKEN);
    } catch (error) {
        console.error('Error removing token:', error);
    }
};

/**
 * Set the user profile
 */
export const setUserProfile = (profile: any) => {
    try {
        setCookie(COOKIE_KEYS.PROFILE, profile);
    } catch (error) {
        console.error('Error setting profile:', error);
    }
};

/**
 * Get the user profile
 */
export const getUserProfile = () => {
    try {
        return getCookie(COOKIE_KEYS.PROFILE);
    } catch (error) {
        console.error('Error getting profile:', error);
        return null;
    }
};

/**
 * Remove the user profile
 */
export const removeUserProfile = () => {
    try {
        removeCookie(COOKIE_KEYS.PROFILE);
    } catch (error) {
        console.error('Error removing profile:', error);
    }
}; 