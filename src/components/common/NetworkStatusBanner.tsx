'use client';
import { useEffect, useState, useCallback } from 'react';
import { invalidateAllCompanyApis } from '@/utils/ApiDispatch';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { FaWifi, FaSyncAlt } from 'react-icons/fa';

type Status = 'offline' | 'online' | null;

export default function NetworkStatusBanner() {
    const [status, setStatus] = useState<Status>(null);
    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const handleOnline = useCallback(() => {
        setStatus('online');
        setVisible(true);

        const timeout = setTimeout(() => {
            setVisible(false);
            setTimeout(() => {
                setStatus(null);
                invalidateAllCompanyApis(dispatch);
            }, 500);
        }, 4000);

        return () => clearTimeout(timeout);
    }, [dispatch]);

    const handleOffline = useCallback(() => {
        setStatus('offline');
        setVisible(true);
    }, []);

    useEffect(() => {
        if (!navigator.onLine) handleOffline();

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [handleOnline, handleOffline]);

    if (status === null) return null;

    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const backgroundColor =
        status === 'offline'
            ? isDark ? '#5c1c1c' : '#ffecec'
            : isDark ? '#1e4620' : '#e6ffed';
    const textColor = isDark ? '#f0f0f0' : '#1a1a1a';

    const accentColor = status === 'offline'
        ? isDark ? '#ff6b6b' : '#ff5252'
        : isDark ? '#6bff87' : '#4caf50';

    return (
        <div
            role="status"
            aria-live="polite"
            style={{
                position: 'fixed',
                top: 0,
                left: '50%',
                width: '100%',
                padding: '12px 20px',
                textAlign: 'center',
                fontWeight: 600,
                fontSize: '16px',
                zIndex: 999999999999,
                backgroundColor,
                color: textColor,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transform: visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-100%)',
                opacity: visible ? 1 : 0,
                transition: 'all 0.4s ease-in-out',
                letterSpacing: '0.3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >

            {status === 'offline' ? (
                <>
                    <FaWifi style={{ marginRight: 8, color: '#e60000' }} />
                    You are currently <strong>offline</strong>. Please check your connection.
                </>
            ) : (
                <>
                    <FaSyncAlt style={{
                        animation: 'spinNetwork 1.2s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite',
                        color: accentColor,
                        fontSize: '16px',
                        marginRight: '8px'
                    }} />
                    Connection restored. Syncing updates...
                </>
            )}

            {/* Inline keyframes for spin animation */}
            <style>{`
                  @keyframes spinNetwork {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
