import { useState, useCallback } from 'react';

interface EmailValidationResult {
    isValid: boolean;
    error: string | null;
}

export const useEmailValidation = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);

    const validateEmail = useCallback((email: string): EmailValidationResult => {
        if (!email.trim()) {
            return {
                isValid: false,
                error: 'Email is required'
            };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                isValid: false,
                error: 'Please enter a valid email address'
            };
        }

        return {
            isValid: true,
            error: null
        };
    }, []);

    const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        const { error } = validateEmail(newEmail);
        setError(error);
    }, [validateEmail]);

    return {
        email,
        error,
        setEmail,
        setError,
        validateEmail,
        handleEmailChange
    };
}; 