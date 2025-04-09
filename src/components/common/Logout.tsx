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
    }, [setUser]);

    return (
        <div className="logout-button"><button onClick={handleLogout} className='buttons'>Logout</button></div>
    );
}

export default Logout;
