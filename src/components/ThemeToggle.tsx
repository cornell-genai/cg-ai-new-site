"use client";

import { getTheme, setTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

// CSS follows the pre-paint theme, so the first render never shows the wrong icon.
export default function ThemeToggle({ className, label }: { className?: string; label?: boolean }) {
    const toggle = () => {
        const root = document.documentElement;
        root.classList.add("theme-switching");
        setTheme(getTheme() === "light" ? "dark" : "light");
        // Flush the new colors with transitions disabled, then restore interaction feedback.
        void root.offsetHeight;
        requestAnimationFrame(() => root.classList.remove("theme-switching"));
    };

    return (
        <button type="button" onClick={toggle} aria-label={label ? undefined : "Switch color theme"} className={cn("pressable inline-flex min-h-11 min-w-11 items-center justify-center gap-3 rounded-md", className)}>
            <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
                <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 1.75a6.25 6.25 0 0 1 0 12.5z" fill="currentColor" className="origin-center light:rotate-180" />
            </svg>
            {label && <span><span className="light:hidden">Switch to light mode</span><span className="hidden light:inline">Switch to dark mode</span></span>}
        </button>
    );
}
