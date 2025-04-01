// src/utils/company.ts

import Cookies from 'js-cookie';

export const useCompany = () => {
    return {
        companySlug: Cookies.get('company_slug'),
        userType: Cookies.get('user_type'),
        accessToken: Cookies.get('access_token'),
    };
};
