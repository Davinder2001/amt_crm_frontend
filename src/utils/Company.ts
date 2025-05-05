// // src/utils/company.ts

// import Cookies from 'js-cookie';

// export const useCompany = () => {
//     return {
//         companySlug: Cookies.get('company_slug'),
//         userType: Cookies.get('user_type') ?? 'user',
//         accessToken: Cookies.get('access_token'),
//     };
// };









import Cookies from 'js-cookie';

// Utility function to Base64 encode values
export const encodeStorage = (value: string) => {
    return btoa(value); // Base64 encoding
};

// Utility function to Base64 decode the values
const decodeStorage = (value: string | null): string => {
    try {
        // If value is present, decode it; otherwise, return empty string
        return value ? atob(value) : '';
    } catch (error) {
        console.error('Error decoding storage:', error);
        return ''; // Return empty string in case of error
    }
};

export const useCompany = () => {
    // Attempt to retrieve and decode values from localStorage, fallback to cookies if needed
    const companySlug = decodeStorage(localStorage.getItem('company_slug') || '') || Cookies.get('company_slug') || '';
    const userType = decodeStorage(localStorage.getItem('user_type') ?? 'user') || Cookies.get('user_type') || 'user';
    const accessToken = decodeStorage(localStorage.getItem('access_token') || '') || Cookies.get('access_token') || '';

    return {
        companySlug,
        userType,
        accessToken,
    };
};



// Utility function to clear storage
export const clearStorage = () => {
    // Remove from localStorage
    localStorage.removeItem('company_slug');
    localStorage.removeItem('user_type');
    localStorage.removeItem('access_token');

    // Remove from cookies
    Cookies.remove('company_slug', { path: '/' });
    Cookies.remove('user_type', { path: '/' });
    Cookies.remove('access_token', { path: '/' });
};