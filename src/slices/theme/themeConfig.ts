// themeConfig.ts
export const THEMES = ["light", "dark", "blue", "green"] as const;
export type Theme = typeof THEMES[number];
