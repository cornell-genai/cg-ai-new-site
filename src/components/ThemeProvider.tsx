"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}

interface ThemeProviderProps {
    children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>("light");
    const [mounted, setMounted] = useState(false);

    // Initialize theme from localStorage or system preference
    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem("theme") as Theme | null;
        if (stored) {
            setThemeState(stored);
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setThemeState("dark");
        }
    }, []);

    // Apply theme class to html element
    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme, mounted]);

    const toggleTheme = () => {
        setThemeState((prev) => (prev === "light" ? "dark" : "light"));
    };

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    // Prevent flash of wrong theme
    if (!mounted) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
