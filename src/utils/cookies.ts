import Cookies from 'js-cookie';

// Cookie names
export const COOKIE_KEYS = {
    AUTH_TOKEN: 'wtcv_auth_token',
    USER_ID: 'wtcv_user_id',
    USER_EMAIL: 'wtcv_user_email',
    PROFILE: 'wtcv_profile'
} as const;

// Default cookie options
const DEFAULT_OPTIONS = {
    expires: 7, // 7 days
    secure: window.location.protocol === 'https:', // Only send over HTTPS in production
    sameSite: 'strict' as const,
    path: '/'
};

/**
 * Set a cookie with the given name and value
 */
export const setCookie = (name: string, value: string | object, options = {}) => {
    const finalValue = typeof value === 'string' ? value : JSON.stringify(value);
    Cookies.set(name, finalValue, { ...DEFAULT_OPTIONS, ...options });
};

/**
 * Get a cookie value by name
 */
export const getCookie = (name: string) => {
    const value = Cookies.get(name);
    if (!value) return null;

    try {
        return JSON.parse(value);
    } catch {
        return value; // Return as is if not JSON
    }
};

/**
 * Remove a cookie by name
 */
export const removeCookie = (name: string) => {
    Cookies.remove(name, { path: '/' });
};

/**
 * Set auth related cookies
 */
export const setAuthCookies = (token: string, userId: string, email: string) => {
    setCookie(COOKIE_KEYS.AUTH_TOKEN, token);
    setCookie(COOKIE_KEYS.USER_ID, userId);
    setCookie(COOKIE_KEYS.USER_EMAIL, email);
};

/**
 * Remove all auth related cookies
 */
export const removeAuthCookies = () => {
    removeCookie(COOKIE_KEYS.AUTH_TOKEN);
    removeCookie(COOKIE_KEYS.USER_ID);
    removeCookie(COOKIE_KEYS.USER_EMAIL);
    removeCookie(COOKIE_KEYS.PROFILE);
};

/**
 * Get all auth related cookies
 */
export const getAuthCookies = () => ({
    token: getCookie(COOKIE_KEYS.AUTH_TOKEN),
    userId: getCookie(COOKIE_KEYS.USER_ID),
    email: getCookie(COOKIE_KEYS.USER_EMAIL)
}); 