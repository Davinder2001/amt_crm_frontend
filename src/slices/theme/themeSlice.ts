// src/slices/theme/themeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { THEMES, type Theme } from './themeConfig';

// Helper: get theme from localStorage or fallback to default
const getInitialTheme = (): Theme => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme && THEMES.includes(storedTheme)) {
        return storedTheme;
    }
    return 'light'; // default theme
};

interface ThemeState {
    currentTheme: Theme;
}

const initialState: ThemeState = {
    currentTheme: typeof window !== 'undefined' ? getInitialTheme() : 'light',
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme(state, action: PayloadAction<Theme>) {
            state.currentTheme = action.payload;
            localStorage.setItem('theme', action.payload); // persist in LS
        },
    },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
