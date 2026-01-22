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

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity }}>
            {/* Animated gradient mesh */}
            <>
                {/* Primary red glow - top left */}
                <motion.div
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: [0.3, 0.4, 0.3] }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#FF1A1A] rounded-full ${isMobile ? 'blur-[50px]' : 'blur-[80px]'}`}
                />

                {/* Secondary purple glow - center right */}
                <motion.div
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: [0.2, 0.3, 0.2] }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.3
                    }}
                    className={`absolute top-[10%] right-[-15%] w-[50%] h-[70%] bg-[#8B5CF6] rounded-full ${isMobile ? 'blur-[50px]' : 'blur-[100px]'}`}
                />

                {/* Tertiary blue glow - bottom */}
                <motion.div
                    initial={{ opacity: 0.15 }}
                    animate={{ opacity: [0.15, 0.2, 0.15] }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.6
                    }}
                    className={`absolute bottom-[-30%] left-[20%] w-[60%] h-[50%] bg-[#0066FF] rounded-full ${isMobile ? 'blur-[50px]' : 'blur-[100px]'}`}
                />

                {/* White highlight accent - simplified */}
                {!isMobile && (
                    <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-white/5 blur-[80px] rounded-full" />
                )}
            </>

            {/* Noise/grain texture overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* Vignette effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_40%,rgba(5,5,5,0.4)_70%,rgba(5,5,5,0.8)_100%)]" />

            {/* Top edge gradient */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#050505]/50 to-transparent" />

            {/* Side gradients for depth */}
            <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-[#050505]/30 to-transparent" />
            <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-[#050505]/30 to-transparent" />

            {/* Scan line effect (very subtle) */}
            {!isMobile && (
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
                    }}
                />
            )}

            {/* Grid pattern overlay (very subtle) */}
            {!isMobile && (
                <div
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: "100px 100px",
                    }}
                />
            )}
        </div>
    );
}
