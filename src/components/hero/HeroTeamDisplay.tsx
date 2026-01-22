"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface HeroTeamDisplayProps {
    isMobile?: boolean;
}

export default function HeroTeamDisplay({ isMobile = false }: HeroTeamDisplayProps) {
    return (
        <div className={`relative w-full flex items-center justify-center ${
            isMobile ? 'h-[220px]' : 'h-[400px] md:h-[500px]'
        }`}>
            {/* Animated blob container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className={`relative z-10 ${
                    isMobile ? 'w-[200px] h-[200px]' : 'w-[300px] h-[300px] md:w-[400px] md:h-[400px]'
                }`}
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
                {!isMobile && (
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
                )}

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
