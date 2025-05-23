'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);

    useEffect(() => {
        document.body.className = currentTheme;
    }, [currentTheme]);

    return <>{children}</>;
};

export default ThemeProvider;