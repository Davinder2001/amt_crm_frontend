// src/utils/company.ts
import Cookies from 'js-cookie';

// Utility function to Base64 encode values
export const encodeStorage = (value: string) => {
    return btoa(value); // Base64 encoding
};

// Decode safely
const decodeStorage = (value: string | null): string => {
    try {
        return value ? atob(value) : '';
    } catch (e) {
        console.error('decode error', e);
        return '';
    }
};

// Safe wrapper for localStorage (won't break SSR)
const safeGetLocalStorage = (key: string): string => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(key) || '';
};

export const useCompany = () => {
    const companySlug =
        decodeStorage(safeGetLocalStorage('company_slug')) ||
        Cookies.get('company_slug') ||
        '';

    const userType =
        decodeStorage(safeGetLocalStorage('user_type')) ||
        Cookies.get('user_type') ||
        'user';

    const accessToken =
        decodeStorage(safeGetLocalStorage('access_token')) ||
        Cookies.get('access_token') ||
        '';

    return {
        companySlug,
        userType,
        accessToken,
    };
};


// Utility function to clear storage
export const clearStorage = () => {
    if (typeof window !== 'undefined') {
        // Clear all localStorage keys
        Object.keys(localStorage).forEach((key) => {
            localStorage.removeItem(key);
        });

        // Clear all cookie keys
        Object.keys(Cookies.get()).forEach((key) => {
            Cookies.remove(key, { path: '/' });
        });
    }
};