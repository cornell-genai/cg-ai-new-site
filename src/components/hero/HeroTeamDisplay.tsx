"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface HeroTeamDisplayProps {
    isMobile?: boolean;
}

export default function HeroTeamDisplay({ isMobile = false }: HeroTeamDisplayProps) {
    // Mobile: Simplified static version (no animations, no Framer Motion)
    if (isMobile) {
        return (
            <div className="relative w-full h-[220px] flex items-center justify-center">
                {/* Static blob container - no animations */}
                <div className="relative z-10 w-[200px] h-[200px]">
                    {/* Main Image Blob - static border-radius */}
                    <div
                        className="relative w-full h-full overflow-hidden border-4 border-white shadow-2xl shadow-red-900/10 bg-zinc-100"
                        style={{
                            borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%"
                        }}
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070"
                            alt="Gen AI Team"
                            fill
                            className="object-cover"
                            priority={false}
                            loading="lazy"
                            sizes="200px"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-red-900/20 to-transparent pointer-events-none mix-blend-overlay" />
                    </div>

                    {/* Decorative circles for visual interest - static, lightweight */}
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-red-100/70 rounded-full border-2 border-white shadow-md" />
                    <div className="absolute -bottom-3 -left-3 w-14 h-14 bg-rose-100/60 rounded-full border-2 border-white shadow-md" />
                    <div className="absolute top-1/2 -right-6 w-8 h-8 bg-red-50/80 rounded-full border-2 border-white shadow-md" />
                    <div className="absolute bottom-8 -left-4 w-6 h-6 bg-red-200/50 rounded-full border border-white shadow-sm" />
                </div>

                {/* Background Glow - lighter on mobile */}
                <div className="absolute inset-0 z-0 bg-gradient-to-tr from-red-200/15 to-rose-200/15 blur-[60px] rounded-full scale-75 opacity-40" />
            </div>
        );
    }

    // Desktop: Full animated version
    return (
        <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center">
            {/* Animated blob container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="relative z-10 w-[300px] h-[300px] md:w-[400px] md:h-[400px]"
            >
                {/* Main Image Blob */}
                <motion.div
                    animate={{
                        borderRadius: [
                            "60% 40% 30% 70% / 60% 30% 70% 40%",
                            "30% 60% 70% 40% / 50% 60% 30% 60%",
                            "60% 40% 30% 70% / 60% 30% 70% 40%"
                        ]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative w-full h-full overflow-hidden border-4 border-white shadow-2xl shadow-red-900/10 bg-zinc-100"
                    style={{
                        borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%"
                    }}
                >
                    <Image
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070"
                        alt="Gen AI Team"
                        fill
                        className="object-cover"
                        priority
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-900/20 to-transparent pointer-events-none mix-blend-overlay" />
                </motion.div>

                {/* Decorative floating elements */}
                <>
                    <FloatingElement
                        className="absolute -top-4 -right-4 w-16 h-16 bg-red-100/80 backdrop-blur-md"
                        delay={0}
                        duration={6}
                    />
                    <FloatingElement
                        className="absolute -bottom-8 -left-8 w-24 h-24 bg-rose-100/80 backdrop-blur-md"
                        delay={2}
                        duration={8}
                    />
                    <FloatingElement
                        className="absolute top-1/2 -right-12 w-12 h-12 bg-red-50/80 backdrop-blur-md"
                        delay={1}
                        duration={5}
                    />
                </>

                {/* Badge */}

            </motion.div>

            {/* Background Glow */}
            <div className="absolute inset-0 z-0 bg-gradient-to-tr from-red-200/20 to-rose-200/20 blur-[80px] rounded-full scale-75 opacity-60" />
        </div>
    );
}

function FloatingElement({ className, delay, duration }: { className: string, delay: number, duration: number }) {
    return (
        <motion.div
            animate={{
                y: [0, -15, 0],
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay
            }}
            className={`rounded-full shadow-lg border border-white/50 ${className}`}
        />
    );
}
