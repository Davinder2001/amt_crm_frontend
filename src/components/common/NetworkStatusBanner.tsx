'use client';
import { useEffect, useState, useCallback } from 'react';
import { invalidateAllCompanyApis } from '@/utils/ApiDispatch';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { FaSyncAlt, FaExclamationTriangle } from 'react-icons/fa';

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

    return (
        <>
            <div
                role="status"
                aria-live="polite"
                className={`network-banner ${status} ${visible ? 'visible' : ''}`}
            >
                {status === 'offline' ? (
                    <div className="network-line">
                        <div className="network-icon-wrapper">
                            <FaExclamationTriangle className="network-icon offline-icon" />
                        </div>
                        <div className="network-text">
                            <span>
                                You are currently <strong className="network-strong">offline</strong>.
                            </span>
                            <span>Please check your connection.</span>
                        </div>
                    </div>
                ) : (
                    <div className="network-line">
                        <div className="network-icon-wrapper">
                        <FaSyncAlt className="network-icon syncing-icon" />
                        </div>
                        <div className="network-text">
                        Connection restored. Syncing updates...
                    </div>
                    </div>
                )}
            </div>

            <style>{`
            .network-banner {
                position: fixed;
                top: 0;
                left: 50%;
                width: 100%;
                padding: 12px 20px;
                text-align: center;
                font-weight: 600;
                font-size: 16px;
                z-index: 999999999;
                transform: translateX(-50%) translateY(-100%);
                opacity: 0;
                transition: all 0.4s ease-in-out;
                display: flex;
                align-items: center;
                justify-content: center;
                letter-spacing: 0.3px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                max-width: 100vw;
                box-sizing: border-box;
                font-size: 20px;
            }

            .network-banner.visible {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }

            .network-banner.online {
                background-color: #e6ffed;
                color: #1a1a1a;
            }

            .network-banner.offline {
                background-color: #ffecec;
                color: #1a1a1a;
            }

            @media (prefers-color-scheme: dark) {
                .network-banner.online {
                    background-color: #1e4620;
                    color: #f0f0f0;
                }

                .network-banner.offline {
                    background-color: #5c1c1c;
                    color: #f0f0f0;
                }
            }

            .network-line {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                gap: 10px;
            }

            .network-icon-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }

            .network-text {
                display: flex;
                align-items: center;
                font-size: 15px;
                line-height: 1.2;
                gap: 3px;
            }

            .network-icon {
                font-size: 16px;
                flex-shrink: 0;
            }

            .offline-icon {
                color: #e60000;
            }

            .syncing-icon {
                color: #4caf50;
                animation: spinNetwork 1.2s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
            }

            @media (prefers-color-scheme: dark) {
                .syncing-icon {
                    color: #6bff87;
                }

                .offline-icon {
                    color: #ff6b6b;
                }
            }

            @media (max-width: 600px) {
                .network-banner {
                    padding: 10px 14px;
                    font-size: 14px;
                    text-align: center;
                }

                .network-text {
                    font-size: 10px;
                }
            }

            @keyframes spinNetwork {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `}</style>
        </>
    );
}
