"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";

// Animation variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.03,
            delayChildren: 0.2,
        },
    },
};

const letterVariants: Variants = {
    hidden: { 
        opacity: 0, 
        y: 40,
        rotateX: -60,
        filter: "blur(8px)",
    },
    visible: { 
        opacity: 1, 
        y: 0,
        rotateX: 0,
        filter: "blur(0px)",
        transition: {
            type: "spring",
            damping: 15,
            stiffness: 120,
        },
    },
};

const subtitleVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
            delay: 1.2,
        },
    },
};

interface AnimatedTextProps {
    text: string;
    className?: string;
    delay?: number;
}

/**
 * AnimatedText
 * Renders text with letter-by-letter reveal animation
 */
function AnimatedText({ text, className = "", delay = 0 }: AnimatedTextProps) {
    const words = text.split(" ");
    
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`inline-flex flex-wrap ${className}`}
            style={{ perspective: "1000px" }}
        >
            {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block mr-[0.25em] whitespace-nowrap">
                    {word.split("").map((letter, letterIndex) => (
                        <motion.span
                            key={letterIndex}
                            variants={letterVariants}
                            className="inline-block will-change-transform"
                            style={{ 
                                transformStyle: "preserve-3d",
                                animationDelay: `${delay + (wordIndex * 0.1) + (letterIndex * 0.03)}s`
                            }}
                        >
                            {letter}
                        </motion.span>
                    ))}
                </span>
            ))}
        </motion.div>
    );
}

/**
 * TypewriterText
 * Renders text with a typewriter effect
 */
function TypewriterText({ 
    text, 
    className = "", 
    startDelay = 1500,
    typingSpeed = 30 
}: { 
    text: string; 
    className?: string;
    startDelay?: number;
    typingSpeed?: number;
}) {
    const [displayedText, setDisplayedText] = useState("");
    const [showCursor, setShowCursor] = useState(true);
    const [isTypingComplete, setIsTypingComplete] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        
        // Start typing after delay
        timeout = setTimeout(() => {
            let currentIndex = 0;
            
            const typeInterval = setInterval(() => {
                if (currentIndex < text.length) {
                    setDisplayedText(text.slice(0, currentIndex + 1));
                    currentIndex++;
                } else {
                    clearInterval(typeInterval);
                    setIsTypingComplete(true);
                }
            }, typingSpeed);
            
            return () => clearInterval(typeInterval);
        }, startDelay);
        
        return () => clearTimeout(timeout);
    }, [text, startDelay, typingSpeed]);

    // Blinking cursor effect
    useEffect(() => {
        if (!isTypingComplete) return;
        
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 530);
        
        return () => clearInterval(cursorInterval);
    }, [isTypingComplete]);

    return (
        <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: startDelay / 1000 - 0.3 }}
            className={className}
        >
            {displayedText}
            <span 
                className={`inline-block w-[2px] h-[1em] bg-white/70 ml-1 align-middle transition-opacity duration-100 ${
                    showCursor ? "opacity-100" : "opacity-0"
                }`}
            />
        </motion.p>
    );
}

/**
 * GlowText
 * Text with a subtle glow effect
 */
function GlowText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <span className={`relative ${className}`}>
            {/* Glow layer */}
            <span 
                className="absolute inset-0 blur-2xl opacity-50"
                style={{ 
                    background: "linear-gradient(90deg, #FF1A1A 0%, #8B5CF6 50%, #0066FF 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                }}
                aria-hidden="true"
            >
                {children}
            </span>
            {/* Main text */}
            <span className="relative">{children}</span>
        </span>
    );
}

interface HeroTypographyProps {
    headline?: string;
    subtitle?: string;
    className?: string;
    isMobile?: boolean;
}

export default function HeroTypography({ 
    headline = "Cornell's home for students in AI",
    subtitle = "Cornell GenAI is where the students that shape the future of AI at Cornell come together. From research to industry, we offer opportunities to connect with titans of industry, learn from the best in the field, and get started in the field.",
    className = "",
    isMobile = false
}: HeroTypographyProps) {
    const mobileSubtitle = "Cornell GenAI is where the students that shape the future of AI at Cornell come together.";
    
    return (
        <div className={`relative z-10 ${className}`}>
            {/* Main headline with letter animation */}
            <h1 className={`font-bold tracking-tight leading-[0.95] mb-6 md:mb-8 ${
                isMobile ? "text-3xl" : "text-4xl md:text-5xl lg:text-6xl"
            }`}>
                <AnimatedText 
                    text={headline}
                    className="text-white"
                />
            </h1>
            
            {/* Subtitle with typewriter effect */}
            <div className={`max-w-2xl ${isMobile ? "text-sm" : "text-base md:text-lg"}`}>
                <TypewriterText 
                    text={isMobile ? mobileSubtitle : subtitle}
                    className="text-white/60 font-normal leading-relaxed"
                    startDelay={1800}
                    typingSpeed={isMobile ? 20 : 25}
                />
            </div>
            
            {/* Accent line */}
            <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 2.5, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 md:mt-12 h-[2px] w-24 md:w-32 bg-gradient-to-r from-[#FF1A1A] via-[#8B5CF6] to-transparent origin-left"
            />
        </div>
    );
}
