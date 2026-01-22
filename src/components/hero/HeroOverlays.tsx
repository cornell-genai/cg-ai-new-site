"use client";

import React from "react";
import { motion } from "framer-motion";

interface HeroOverlaysProps {
    scrollProgress?: number;
    isMobile?: boolean;
}

export default function HeroOverlays({
    scrollProgress = 0,
    isMobile = false
}: HeroOverlaysProps) {
    const opacity = Math.max(0, 1 - scrollProgress * 1.2);

    // Use static gradients on mobile for better performance
    if (isMobile) {
        return (
            <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity }}>
                {/* Static gradient mesh - warm colors (no animation) */}
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#b91c1c] rounded-full blur-[40px] opacity-20" />
                <div className="absolute top-[10%] right-[-15%] w-[50%] h-[70%] bg-[#be123c] rounded-full blur-[40px] opacity-15" />
                <div className="absolute bottom-[-30%] left-[20%] w-[60%] h-[50%] bg-[#fca5a5] rounded-full blur-[40px] opacity-12" />

                {/* Subtle soft vignette for depth */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_50%,rgba(250,250,249,0.3)_100%)]" />
            </div>
        );
    }

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity }}>
            {/* Animated gradient mesh - warm colors (desktop only) */}
            <>
                {/* Primary red glow - top left */}
                <motion.div
                    initial={{ opacity: 0.15 }}
                    animate={{ opacity: [0.15, 0.25, 0.15] }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#b91c1c] rounded-full blur-[120px]"
                />

                {/* Secondary rose glow - center right */}
                <motion.div
                    initial={{ opacity: 0.1 }}
                    animate={{ opacity: [0.1, 0.2, 0.1] }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.3
                    }}
                    className="absolute top-[10%] right-[-15%] w-[50%] h-[70%] bg-[#be123c] rounded-full blur-[140px]"
                />

                {/* Tertiary zinc/red glow - bottom */}
                <motion.div
                    initial={{ opacity: 0.08 }}
                    animate={{ opacity: [0.08, 0.15, 0.08] }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.6
                    }}
                    className="absolute bottom-[-30%] left-[20%] w-[60%] h-[50%] bg-[#fca5a5] rounded-full blur-[140px]"
                />

                {/* Soft red accent */}
                <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-[#fecaca]/10 blur-[100px] rounded-full" />
            </>

            {/* Subtle soft vignette for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_50%,rgba(250,250,249,0.3)_100%)]" />
        </div>
    );
}
