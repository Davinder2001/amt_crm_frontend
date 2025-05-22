import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define possible themes
type Theme = 'light' | 'dark' | 'blue' | 'green';

interface ThemeState {
    currentTheme: Theme;
}

const initialState: ThemeState = {
    currentTheme: 'light',  // Default theme
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme(state, action: PayloadAction<Theme>) {
            state.currentTheme = action.payload;
        },
    },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
