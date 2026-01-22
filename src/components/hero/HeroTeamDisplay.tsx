"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroTeamDisplay() {
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

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="absolute bottom-8 -right-4 md:right-0 bg-white px-4 py-2 rounded-full shadow-lg border border-red-100 flex items-center gap-2 z-20"
                >
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full bg-zinc-200 border-2 border-white" />
                        ))}
                    </div>
                    <span className="text-xs font-bold text-red-700 uppercase tracking-wider">Join 100+ Builders</span>
                </motion.div>
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
