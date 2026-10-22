"use client";

import { getTheme, setTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

// Light / dark switch. Which icon shows is pure CSS on <html data-theme>, so
// the server render never disagrees with the theme the inline script chose.
export default function ThemeToggle({ className, label }: { className?: string; label?: boolean }) {
    const toggle = () => {
        const root = document.documentElement;
        root.classList.add("theme-fade");
        setTheme(getTheme() === "light" ? "dark" : "light");
        window.setTimeout(() => root.classList.remove("theme-fade"), 400);
    };

    return (
        <button type="button" onClick={toggle} aria-label="Toggle light and dark mode" className={cn("flex items-center gap-3 transition-colors", className)}>
            <svg viewBox="0 0 16 16" className="size-[15px]" aria-hidden>
                <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 1.75a6.25 6.25 0 0 1 0 12.5z" fill="currentColor" className="origin-center transition-transform duration-500 light:rotate-180" />
            </svg>
            {label && (
                <span>
                    <span className="light:hidden">Light mode</span>
                    <span className="hidden light:inline">Dark mode</span>
                </span>
            )}
        </button>
    );
}
