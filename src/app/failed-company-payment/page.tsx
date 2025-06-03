// src/app/failed-company-payment/page.tsx
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const FailedPaymentPage = () => {
    const router = useRouter();

    const handleRetry = () => {
        router.push('/add-company');
    };

    return (
        <div className="confirmation-container">
            <div className="confirmation-card error">
                <div className="c-spinner failed">
                    <div className="spinner-circle"></div>
                    <div className="spinner-circle"></div>
                    <div className="spinner-circle"></div>
                    <div className="spinner-circle"></div>
                </div>
                <h1 className="confirmation-title">Payment Failed</h1>
                <p className="confirmation-message">Unfortunately, your company registration could not be completed due to a payment issue.</p>
                <button className="retry-button" onClick={handleRetry}>
                    Try Again
                </button>
            </div>
        </div>
    );
};

export default FailedPaymentPage;
