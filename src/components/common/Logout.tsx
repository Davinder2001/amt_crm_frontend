'use client';
import React, { useEffect } from 'react';
import { useUser } from '@/provider/UserContext';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/utils/Company';

function Logout() {
    const { setUser } = useUser();
    const router = useRouter();
    const { userType } = useCompany();

    const handleLogout = async () => {
        // Clear the user context
        setUser(null);

        // Remove cookies
        Cookies.remove('access_token');
        Cookies.set('user_type', 'user');
        Cookies.remove('company_slug');

        if (userType === 'user') {
            // Redirect to home page
            router.push('/');
        } else {
            // Redirect to login page
            router.push('/login');
        }
    }

    useEffect(() => {
        const accessToken = Cookies.get('access_token');
        const userType = Cookies.get('user_type') ?? 'user';

        if (!accessToken || !userType) {
            setUser(null); // Clear context if cookies are missing
        }
    }, [setUser]);

    return (
        <div className="logout-button"><button onClick={handleLogout} className='buttons'>Logout</button></div>
    );
}

export default Logout;
