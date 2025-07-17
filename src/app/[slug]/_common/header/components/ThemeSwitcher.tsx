'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { THEMES, type Theme } from '@/slices/theme/themeConfig';
import { setTheme } from '@/slices/theme/themeSlice';
import { FaPalette } from 'react-icons/fa';

const ThemeSwitcher = () => {
    const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);
    const dispatch = useDispatch<AppDispatch>();

    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTheme = event.target.value as Theme;
        dispatch(setTheme(selectedTheme));
    };

    return (
        <div className="theme-switcher-menu-item">
            <div className="theme-switcher-icon">
                <FaPalette className="menu-icon" />
                <span>Theme</span>
            </div>
            <select
                value={currentTheme}
                onChange={handleThemeChange}
                className="theme-select"
                aria-label="Select theme"
            >
                {THEMES.map((theme) => (
                    <option key={theme} value={theme}>
                        {theme}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ThemeSwitcher;