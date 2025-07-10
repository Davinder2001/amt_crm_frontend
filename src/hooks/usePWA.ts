"use client";

import { useState, useEffect } from 'react';

// Extend the Navigator interface to include standalone property
declare global {
    interface Navigator {
        standalone?: boolean;
    }
}

export function usePWA() {
    const [isPWA, setIsPWA] = useState(false);

    useEffect(() => {
        // Check if app is running as PWA
        const checkPWAMode = () => {
            // Method 1: Check display-mode for Android/Chrome
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

            // Method 2: Check for iOS standalone mode
            const isIOS = navigator.standalone;

            // Method 3: Check for Android intent referrer
            const isAndroidPWA = document.referrer.includes('android-app://');

            return isStandalone || isIOS || isAndroidPWA;
        };

        setIsPWA(checkPWAMode());
    }, []);

    return isPWA;
}