'use client';
import { useEffect, useState } from 'react';
import { invalidateAllCompanyApis } from '@/utils/ApiDispatch';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';

type Status = 'offline' | 'online' | null;

export default function NetworkStatusBanner() {
    const [status, setStatus] = useState<Status>(null);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const handleOnline = () => {
            setStatus('online');
            // Show "online" banner for 3 seconds, then hide it and invalidate queries
            setTimeout(() => {
                setStatus(null);
                invalidateAllCompanyApis(dispatch);
            }, 3000);
        };

        const handleOffline = () => {
            setStatus('offline');
        };

        // Initial check
        if (!navigator.onLine) {
            setStatus('offline');
        }

        // Add listeners
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (status === null) return null;

    return (
        <div
            style={{
                backgroundColor: status === 'offline' ? '#ffcccc' : '#ccffcc',
                color: '#333',
                padding: '10px',
                textAlign: 'center',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 9999999999,
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
        >
            {status === 'offline'
                ? '⚠️ You are currently offline. Please check your network.'
                : '✅ You are back online.'}
        </div>
    );
}
