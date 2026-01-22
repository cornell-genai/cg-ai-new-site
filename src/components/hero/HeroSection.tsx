"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import HeroTypography from "./HeroTypography";
import ScrollIndicator from "./ScrollIndicator";
import HeroOverlays from "./HeroOverlays";
import HeroTeamDisplay from "./HeroTeamDisplay";

// Dynamically import the 3D background to avoid SSR issues
const HeroBackground3D = dynamic(() => import("./HeroBackground3D"), {
    ssr: false,
    loading: () => (
        <div className="absolute inset-0 bg-gradient-to-br from-[#FAFAF9] via-[#F5F5F4] to-[#EDE9FE]" />
    ),
});

interface HeroSectionProps {
    headline?: string;
    subtitle?: string;
    onScrollPastHero?: (isPast: boolean) => void;
}

export default function HeroSection({
    headline = "Where Cornell students build with AI",
    subtitle = "We're a community of builders, researchers, and creators passionate about AI. Join us to work on real projects, learn from industry leaders, and shape the future together.",
    onScrollPastHero
}: HeroSectionProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isHeroVisible, setIsHeroVisible] = useState(true);
    const heroRef = useRef<HTMLElement>(null);

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Track scroll progress for parallax and fade effects
    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const windowHeight = window.innerHeight;
                    const progress = Math.min(1, scrollY / windowHeight);

                    setScrollProgress(progress);

                    const isPast = scrollY > windowHeight * 0.5;
                    setIsHeroVisible(!isPast);
                    onScrollPastHero?.(isPast);

                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [onScrollPastHero]);

    return (
        <section
            ref={heroRef}
            className="relative h-screen w-full overflow-hidden bg-[#FAFAF9]"
            aria-label="Hero section"
        >
            {/* 3D Background Layer - don't even load on mobile */}
            {!isMobile && (
                <HeroBackground3D
                    scrollProgress={scrollProgress}
                />
            )}

            {/* Gradient Overlays */}
            <HeroOverlays
                scrollProgress={scrollProgress}
                isMobile={isMobile}
            />

            {/* Content Container */}
            <div className="relative z-10 h-full flex flex-col">
                {/* Navigation spacer */}
                <div className="h-20 md:h-24 shrink-0" />

                {/* Main content - vertically centered on desktop, top-aligned on mobile */}
                {isMobile ? (
                    /* Mobile: Static layout (no animations, no motion) */
                    <div className="flex-1 flex flex-col px-6 justify-start pt-4 max-w-[1600px] mx-auto w-full">
                        <div className="flex flex-col items-center gap-6">
                            <HeroTypography
                                isMobile={isMobile}
                                headline={headline}
                                subtitle={subtitle}
                                className="w-full text-center"
                            />
                            <div className="relative z-20">
                                <HeroTeamDisplay isMobile={isMobile} />
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Desktop: Animated layout with Framer Motion */
                    <motion.div
                        className="flex-1 flex flex-col px-6 sm:px-12 lg:px-16 max-w-[1600px] mx-auto w-full justify-center"
                        style={{
                            opacity: 1 - scrollProgress * 1.5,
                            transform: `translateY(${scrollProgress * -50}px)`,
                        }}
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                            <HeroTypography
                                isMobile={isMobile}
                                headline={headline}
                                subtitle={subtitle}
                                className="max-w-2xl"
                            />
                            <div className="relative z-20">
                                <HeroTeamDisplay isMobile={isMobile} />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Scroll Indicator - positioned at bottom */}
                <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2">
                    <ScrollIndicator
                        targetId="sections"
                        visible={isHeroVisible && scrollProgress < 0.3}
                    />
                </div>
            </div>

            {/* Bottom gradient fade into next section */}
            <div
                className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#FAFAF9] to-transparent pointer-events-none z-20"
                style={{ opacity: Math.min(1, scrollProgress * 3 + 0.3) }}
            />
        </section>
    );
}

