'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from './SplashScreen';

export default function PwaRoot() {
  const [showSplash, setShowSplash] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if this is a PWA launch
    const isPwaLaunch = window.matchMedia('(display-mode: standalone)').matches;
    
    if (isPwaLaunch) {
      setShowSplash(true);
      setTimeout(() => {
        setShowSplash(false);
        router.replace('/');
      }, 3000);
    }
  }, [router]);

  return showSplash ? <SplashScreen /> : null;
}