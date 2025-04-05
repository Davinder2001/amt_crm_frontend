'use client';
import React, { useEffect } from 'react';
import { useUser } from '@/provider/UserContext';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

function Logout() {
    const { setUser } = useUser();
    const router = useRouter();
    
    const handleLogout = async () => {
        // Clear the user context
        setUser(null);
        
        // Remove cookies
        Cookies.remove('access_token');
        Cookies.remove('user_type');
        Cookies.remove('company_slug');
        
        // Redirect to login page
        router.push('/login');
    }

    useEffect(() => {
        const accessToken = Cookies.get('access_token');
        const userType = Cookies.get('user_type');
        
        if (!accessToken || !userType) {
            setUser(null); // Clear context if cookies are missing
        }
        router.refresh(); // Refresh the page to ensure the context is updated
    }, [setUser]);

    return (
        <button onClick={handleLogout} className='logout-btn'>Logout</button>
    );
}

export default Logout;
