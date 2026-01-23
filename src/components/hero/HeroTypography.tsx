"use client";

import { motion, Variants } from "framer-motion";

// Animation variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.04,
            delayChildren: 0.15,
        },
    },
};

const letterVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
        rotateX: -30,
    },
    visible: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: {
            type: "spring",
            damping: 16,
            stiffness: 100,
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
            {words.map((word, wordIndex) => {
                const isCornell = word === "Cornell's" || word === "Cornell";
                return (
                    <span
                        key={wordIndex}
                        className="inline-block mr-[0.25em] whitespace-nowrap"
                    >
                        {word.split("").map((letter, letterIndex) => (
                            <motion.span
                                key={letterIndex}
                                variants={letterVariants}
                                className="inline-block will-change-transform"
                                style={isCornell ? {
                                    background: 'linear-gradient(135deg, #b91c1c 0%, #be123c 50%, #9f1239 100%)',
                                    WebkitBackgroundClip: 'text',
                                    backgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    transformStyle: "preserve-3d",
                                    animationDelay: `${delay + (wordIndex * 0.1) + (letterIndex * 0.03)}s`
                                } : {
                                    transformStyle: "preserve-3d",
                                    animationDelay: `${delay + (wordIndex * 0.1) + (letterIndex * 0.03)}s`
                                }}
                            >
                                {letter}
                            </motion.span>
                        ))}
                    </span>
                );
            })}
        </motion.div>
    );
}

interface HeroTypographyProps {
    headline?: string;
    subtitle?: string;
    className?: string;
    isMobile?: boolean;
}

export default function HeroTypography({
    headline = "Where Cornell students build with AI",
    subtitle = "We're a community of builders, researchers, and creators passionate about AI. Join us to work on real projects, learn from industry leaders, and shape the future together.",
    className = "",
    isMobile = false
}: HeroTypographyProps) {
    const mobileSubtitle = "A community of builders and researchers passionate about AI. Join us to work on real projects and shape the future together.";

    // Render simple gradient text for "Cornell" or "Cornell's"
    const renderHeadlineWithGradient = (text: string) => {
        const words = text.split(" ");
        return words.map((word, index) => {
            const isCornell = word === "Cornell's" || word === "Cornell";
            return (
                <span key={index} className="inline-block mr-[0.25em]">
                    <span
                        className={isCornell ? "bg-gradient-to-r from-[#b91c1c] via-[#be123c] to-[#9f1239] bg-clip-text text-transparent" : ""}
                    >
                        {word}
                    </span>
                </span>
            );
        });
    };

    // Mobile: Use static content (no animations)
    if (isMobile) {
        return (
            <div className={`relative z-10 ${className}`}>
                {/* Main headline - static, no animation */}
                <h1 className="font-bold tracking-tight leading-[0.95] mb-6 text-3xl text-zinc-900 dark:text-zinc-100">
                    {renderHeadlineWithGradient(headline)}
                </h1>

                {/* Subtitle - static, no animation */}
                <div className="max-w-2xl text-sm">
                    <p className="text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
                        {mobileSubtitle}
                    </p>
                </div>

                {/* CTA Buttons - static, no animation */}
                <div className="flex flex-wrap gap-4 mt-8 justify-center">
                    <a
                        href="/team"
                        className="inline-flex items-center justify-center px-6 py-3 bg-red-700 dark:bg-red-600 text-white font-medium rounded-full hover:bg-red-800 dark:hover:bg-red-700 transition-colors shadow-lg shadow-red-900/25"
                    >
                        Meet the Team
                    </a>
                    <a
                        href="#sections"
                        className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium rounded-full border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                    >
                        Learn More
                    </a>
                </div>
            </div>
        );
    }

    // Desktop: Use full animations
    return (
        <div className={`relative z-10 ${className}`}>
            {/* Main headline with letter animation */}
            <h1 className="font-bold tracking-tight leading-[0.95] mb-6 md:mb-8 text-4xl md:text-5xl lg:text-6xl">
                <AnimatedText
                    text={headline}
                    className="text-zinc-900 dark:text-zinc-100"
                />
            </h1>

            {/* Subtitle with smooth fade in */}
            <div className="max-w-2xl text-base md:text-lg">
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.6,
                        delay: 0.8,
                        ease: [0.22, 1, 0.36, 1]
                    }}
                    className="text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed"
                >
                    {subtitle}
                </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="flex flex-wrap gap-4 mt-8"
            >
                <a
                    href="/team"
                    className="inline-flex items-center justify-center px-6 py-3 bg-red-700 dark:bg-red-600 text-white font-medium rounded-full hover:bg-red-800 dark:hover:bg-red-700 transition-colors shadow-lg shadow-red-900/25"
                >
                    Meet the Team
                </a>
                <a
                    href="#sections"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium rounded-full border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                >
                    Learn More
                </a>
            </motion.div>
        </div>
    );
}
