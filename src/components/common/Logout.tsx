'use client';
import React, { useEffect } from 'react';
import { useUser } from '@/provider/UserContext';
import { useRouter } from 'next/navigation';
import { clearStorage, useCompany } from '@/utils/Company';

function Logout() {
    const { setUser } = useUser();
    const router = useRouter();
    const { userType, accessToken } = useCompany();

    const handleLogout = async () => {
        // Clear the user context
        setUser(null);

        clearStorage();

        if (userType === 'user') {
            // Redirect to home page
            router.push('/');
        } else {
            // Redirect to login page
            router.push('/login');
        }
    }

    useEffect(() => {
        if (!accessToken || !userType) {
            setUser(null); // Clear context if cookies are missing
        }
    }, [setUser]);

    return (
        <div className="logout-button"><button onClick={handleLogout} className='buttons'>Logout</button></div>
    );
}

export default Logout;
