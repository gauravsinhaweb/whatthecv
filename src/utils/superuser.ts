export const isSuperUser = (email: string): boolean => {
    const superUserEmails = import.meta.env.VITE_SUPER_USER?.split(',') || [];
    return superUserEmails.includes(email);
};

export const getSuperUserEmails = (): string[] => {
    return import.meta.env.VITE_SUPER_USER?.split(',') || [];
}; 