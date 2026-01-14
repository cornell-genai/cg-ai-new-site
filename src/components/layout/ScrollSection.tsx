"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Animation variants for scroll-triggered effects
 */
export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
};

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.8 }
    }
};

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

export const slideInLeft: Variants = {
    hidden: { opacity: 0, x: -60 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
};

export const slideInRight: Variants = {
    hidden: { opacity: 0, x: 60 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
};

/**
 * ScrollSection
 * A wrapper that triggers animations when the section enters the viewport.
 */
interface ScrollSectionProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
}

export function ScrollSection({ children, className, id }: ScrollSectionProps) {
    return (
        <motion.section
            id={id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className={cn("relative py-20 md:py-32", className)}
        >
            {children}
        </motion.section>
    );
}

/**
 * AnimatedText
 * Text that animates in when scrolled into view.
 */
export function AnimatedText({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * Container
 * Max-width container for content.
 */
export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("max-w-7xl mx-auto px-6 md:px-8", className)}>
            {children}
        </div>
    );
}
