'use client';
import React, { useEffect, useState } from 'react';
import { useUser } from '@/provider/UserContext';
import { useRouter } from 'next/navigation';
import { clearStorage, useCompany } from '@/utils/Company';
import { setTheme } from '@/slices';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store/store';
import Loader from './Loader';

function Logout() {
    const { setUser } = useUser();
    const router = useRouter();
    const { userType, accessToken } = useCompany();
    const dispatch = useDispatch<AppDispatch>();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            // Clear the user context
            setUser(null);
            clearStorage();
            // Clear the theme from Redux store
            dispatch(setTheme('light')); // Reset to default theme

            // Add a small delay to show the spinner (optional)
            await new Promise(resolve => setTimeout(resolve, 500));
            
            if (userType === 'user') {
                // Redirect to home page
                router.push('/');
            } else {
                // Redirect to login page
                router.push('/login');
            }
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (!accessToken || !userType) {
            setUser(null); // Clear context if cookies are missing
        }
    }, [setUser, accessToken, userType]);

    return (
        <div className="logout-button">
            <button 
                onClick={handleLogout} 
                className='buttons' 
                disabled={isLoading}
            >
                {isLoading ? <Loader/> : 'Logout'}
            </button>
        </div>
    );
}

export default Logout;