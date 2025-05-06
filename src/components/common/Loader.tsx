'use client';
import React, { useState, useEffect } from 'react';
import {
    FaMoneyBillWave,
    FaShoppingCart,
    FaWallet,
    FaTasks,
    FaClipboardList,
    FaHandHoldingUsd,
    FaUserPlus,
    FaUsers,
    FaStore,
    FaUserFriends,
    FaSpinner,
} from "react-icons/fa";

const Loader = () => {
    const icons = [
        FaMoneyBillWave,
        FaShoppingCart,
        FaWallet,
        FaTasks,
        FaClipboardList,
        FaHandHoldingUsd,
        FaUserPlus,
        FaUsers,
        FaStore,
        FaUserFriends,
        FaSpinner
    ];

    const [currentIconIndex, setCurrentIconIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIconIndex((prevIndex) =>
                prevIndex === icons.length - 1 ? 0 : prevIndex + 1
            );
        }, 300); // Change icon every 300ms

        return () => clearInterval(interval);
    }, [icons.length]);

    const CurrentIcon = icons[currentIconIndex];

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            zIndex: 9999
        }} className='main-loader-container'>
            <div style={{
                fontSize: '3rem',
                color: '#009693',
                marginBottom: '1rem',
                animation: 'pulse 0.5s infinite alternate'
            }}>
                <CurrentIcon />
            </div>
            <p style={{
                color: '#555',
                fontSize: '1.2rem',
                fontWeight: 500
            }}>Loading your page...</p>

            <style>
                {`
          @keyframes pulse {
            from { transform: scale(1); }
            to { transform: scale(1.1); }
          }
        `}
            </style>
        </div>
    );
};

export default Loader;