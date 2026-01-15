"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Linkedin, Instagram, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

import './globals.css';
import ProjectGrid from '@/components/stanford/ProjectGrid';
import TeamDirectory from '@/components/stanford/TeamDirectory';
import RecruitmentTimeline from '@/components/stanford/RecruitmentTimeline';
import PartnersGrid from '@/components/stanford/PartnersGrid';

// Reusing the grain overlay component
const GrainOverlay = () => (
    <div className="fixed inset-0 pointer-events-none z-[99] opacity-[0.14] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
    />
);

// Snappy ease curve - no bounce, professional feel
const SNAPPY_EASE = [0.32, 0.72, 0, 1] as const;
const SMOOTH_EASE = [0.22, 1, 0.36, 1] as const;

// Animation variants for coordinated orchestration
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.15,
            when: "beforeChildren"
        }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.2, ease: "easeOut" as const }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: SMOOTH_EASE
        }
    }
};

const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: SMOOTH_EASE }
    }
};

const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: SMOOTH_EASE,
            staggerChildren: 0.08,
            delayChildren: 0.1
        }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.15 }
    }
};

const SECTIONS = [
    {
        id: 'projects',
        title: 'Projects',
        subtitle: 'Building the future',
        description: 'Explore our cutting-edge initiatives from QuickFi to ComputeSwarm.',
        longDescription: 'Our projects range from large language model research to practical applications in industry. Students work in teams to build, deploy, and publish their work.',
        image: '/network.png'
    },
    {
        id: 'team',
        title: 'Team',
        subtitle: 'World-class talent',
        description: 'Meet the students and faculty driving the generative revolution.',
        longDescription: 'Our team is composed of undergraduate and graduate students from across the university, united by a passion for AI.',
        image: '/tower.png'
    },
    {
        id: 'involved',
        title: 'Get Involved',
        subtitle: 'Join the community',
        description: 'Join our community, apply for projects, or contact us.',
        longDescription: 'We are always looking for passionate individuals to join our ranks. Whether you are a developer, designer, or researcher, there is a place for you here.',
        image: '/envelopes.png'
    }
];

// Hook to detect mobile devices
const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
};

export default function StanfordPage() {
    const [mounted, setMounted] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [contentReady, setContentReady] = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Reset content ready state when selection changes
    useEffect(() => {
        if (selectedId) {
            // Small delay to let the layout animation start first
            const timer = setTimeout(() => setContentReady(true), 300);
            return () => clearTimeout(timer);
        } else {
            setContentReady(false);
        }
    }, [selectedId]);

    if (!mounted) return <div className="min-h-screen bg-black" />;

    const selectedSection = SECTIONS.find(s => s.id === selectedId);

    return (
        <div className="min-h-screen bg-[#050505] text-white font-[family-name:var(--font-inter)] selection:bg-white/20 selection:text-white overflow-x-hidden relative">
            {/* Grain overlay - disabled on mobile for performance */}
            {!isMobile && <GrainOverlay />}

            {/* Background - Simplified for mobile, full animations for desktop */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                {isMobile ? (
                    /* Mobile: Simple static gradient - no blur, no animations */
                    <div className="absolute inset-0 bg-gradient-to-b from-[#5A1818] via-[#2a0808] to-[#0a0202]" />
                ) : (
                    /* Desktop: Full animated background */
                    <>
                        {/* Base Gradient - Animated breathing pulse */}
                        <motion.div
                            animate={{
                                opacity: [0.85, 1, 0.85],
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute inset-0 bg-gradient-to-b from-[#5A1818] via-[#1a0505] to-[#050202]"
                        />

                        {/* Large ambient blob 1 - Upper left, visible drift */}
                        <motion.div
                            animate={{
                                x: ['-8%', '15%', '-8%'],
                                y: ['-8%', '12%', '-8%'],
                                scale: [1, 1.2, 1],
                                opacity: [0.45, 0.55, 0.45],
                            }}
                            transition={{
                                duration: 12,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute top-[-30%] left-[-20%] w-[90%] h-[90%] bg-[#FF3030] blur-[160px] rounded-full will-change-transform"
                        />

                        {/* Large ambient blob 2 - Bottom right, counter-drift */}
                        <motion.div
                            animate={{
                                x: ['8%', '-12%', '8%'],
                                y: ['8%', '-15%', '8%'],
                                scale: [1.15, 0.95, 1.15],
                                opacity: [0.4, 0.5, 0.4],
                            }}
                            transition={{
                                duration: 15,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 2
                            }}
                            className="absolute bottom-[-40%] right-[-30%] w-[100%] h-[100%] bg-[#881515] blur-[180px] rounded-full will-change-transform"
                        />

                        {/* Center glow - pronounced breathing pulse */}
                        <motion.div
                            animate={{
                                scale: [1, 1.25, 1],
                                opacity: [0.25, 0.4, 0.25],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 1
                            }}
                            className="absolute top-[20%] left-[30%] w-[60%] h-[60%] bg-[#FF5555] blur-[140px] rounded-full will-change-transform"
                        />

                        {/* White highlight 1 - Upper right, visible organic drift */}
                        <motion.div
                            animate={{
                                x: [0, 80, -50, 0],
                                y: [0, -60, 30, 0],
                                opacity: [0.12, 0.2, 0.08, 0.12],
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute top-[-10%] right-[0%] w-[70%] h-[70%] bg-white blur-[180px] rounded-full mix-blend-soft-light will-change-transform"
                        />

                        {/* White highlight 2 - Lower area, breathing float */}
                        <motion.div
                            animate={{
                                x: [-30, 50, -30],
                                y: [0, -40, 0],
                                opacity: [0.08, 0.15, 0.08],
                            }}
                            transition={{
                                duration: 12,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 3
                            }}
                            className="absolute bottom-[10%] left-[10%] w-[50%] h-[50%] bg-[#FFE8E8] blur-[160px] rounded-full mix-blend-soft-light will-change-transform"
                        />

                        {/* Accent color shift - pink/rose undertone */}
                        <motion.div
                            animate={{
                                x: ['-15%', '10%', '-15%'],
                                y: ['15%', '-10%', '15%'],
                                opacity: [0.15, 0.25, 0.15],
                            }}
                            transition={{
                                duration: 18,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 1
                            }}
                            className="absolute top-[40%] right-[-10%] w-[60%] h-[80%] bg-[#DD4477] blur-[180px] rounded-full will-change-transform"
                        />
                    </>
                )}
            </div>

            {/* Navigation */}
            <motion.nav
                animate={{ opacity: selectedId ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className="fixed top-0 left-0 right-0 z-50 px-6 sm:px-12 py-6 flex justify-between items-center max-w-[1600px] mx-auto w-full pointer-events-none"
            >
                <div className="pointer-events-auto">
                    <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-xs font-bold tracking-[0.3em] uppercase opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
                        Generative AI <span className="text-white">@ Cornell</span>
                    </a>
                </div>
                <div className="flex gap-6 text-white/70 pointer-events-auto">
                    <a href="https://www.linkedin.com/company/generative-ai-at-cornell/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Linkedin size={18} /></a>
                    <a href="https://instagram.com/cornellgenai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Instagram size={18} /></a>
                </div>
            </motion.nav>

            <LayoutGroup>
                <main className="relative z-10 min-h-screen max-w-[1600px] mx-auto px-4 sm:px-8 h-full flex flex-col">

                    {/* Landing View */}
                    <AnimatePresence mode="wait">
                        {!selectedId && (
                            <motion.div
                                key="landing"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="flex flex-col h-full pt-24 pb-12"
                            >
                                {/* Header Section */}
                                <motion.section
                                    variants={headerVariants}
                                    className="max-w-4xl mb-16 px-2"
                                >
                                    <h1 className="text-5xl md:text-8xl font-semibold tracking-tight leading-[0.95] mb-6 mix-blend-overlay opacity-90">
                                        Cornell's home <br />
                                        for students in AI
                                    </h1>

                                    <p className="text-lg md:text-xl text-white/60 font-normal leading-relaxed max-w-2xl">
                                        Cornell GenAI is where the students that shape the future of AI at Cornell come together.
                                        From research to industry, we offer opportunities to connect with titans of industry,
                                        learn from the best in the field, and get started in the field.
                                    </p>
                                </motion.section>

                                {/* 3 Columns Grid - Centered & Larger */}
                                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 items-center justify-items-center w-full max-w-[1800px] mx-auto flex-1">
                                    {SECTIONS.map((section) => (
                                        <motion.div
                                            layoutId={`card-${section.id}`}
                                            key={section.id}
                                            variants={cardVariants}
                                            onClick={() => setSelectedId(section.id)}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.98 }}
                                            transition={{
                                                layout: { duration: 0.4, ease: SNAPPY_EASE },
                                                scale: { duration: 0.2 }
                                            }}
                                            className="group relative flex flex-col items-center text-center cursor-pointer w-full h-full justify-center p-4 will-change-transform"
                                            style={{ transformOrigin: "center center" }}
                                        >
                                            {/* Translucent overlay - covers full card, behind everything */}
                                            <div className="absolute inset-0 bg-white/[0.03] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                            {/* Image Asset - No layoutId to prevent competing animations */}
                                            <div className="relative h-64 w-full md:w-[90%] aspect-[4/5] mb-6 overflow-hidden rounded-sm bg-transparent z-10">
                                                <Image
                                                    src={section.image}
                                                    alt={section.title}
                                                    fill
                                                    className="object-contain object-center transition-all duration-300"
                                                />
                                            </div>

                                            <div className="relative z-10 px-2 flex flex-col items-center">
                                                <h3 className="text-4xl md:text-6xl font-semibold mb-4 tracking-tight group-hover:opacity-80 transition-opacity duration-200">
                                                    {section.title}
                                                </h3>
                                                <p className="text-sm text-white/50 font-normal max-w-[80%] group-hover:text-white/70 transition-colors duration-200">
                                                    {section.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </section>

                                {/* Industry Partners Section */}
                                <PartnersGrid />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Detailed Expanded View */}
                    <AnimatePresence>
                        {selectedId && selectedSection && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
                                {/* Backdrop */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="absolute inset-0 bg-black/40 backdrop-blur-md pointer-events-auto"
                                    onClick={() => setSelectedId(null)}
                                />

                                {/* Expanded Card Container */}
                                <motion.div
                                    layoutId={`card-${selectedId}`}
                                    className="relative z-10 w-full max-w-[1600px] h-full md:h-[90vh] bg-black/30 backdrop-blur-lg md:rounded-2xl overflow-hidden shadow-2xl flex flex-col pointer-events-auto border border-white/10 will-change-transform"
                                    transition={{
                                        layout: { duration: 0.4, ease: SNAPPY_EASE }
                                    }}
                                    style={{ transformOrigin: "center center" }}
                                >
                                    {/* Close Button - Floating */}
                                    <motion.button
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.25, delay: 0.2 }}
                                        onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                                        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-white/50 hover:text-white transition-colors group"
                                    >
                                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
                                        <span className="text-sm font-medium uppercase tracking-widest">Back</span>
                                    </motion.button>

                                    {/* Main Content Container - Single Column */}
                                    <div className="flex-1 overflow-y-auto relative w-full">

                                        {/* Top Right Absolute Image - Fade in, no layoutId */}
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.4, ease: SMOOTH_EASE, delay: 0.1 }}
                                            className="fixed md:absolute top-0 right-0 w-full md:w-[400px] h-64 md:h-[400px] pointer-events-none opacity-20 md:opacity-100 mix-blend-screen md:mix-blend-normal z-0 will-change-transform"
                                        >
                                            {/* No overlay - full color image */}
                                            <Image
                                                src={selectedSection.image}
                                                alt={selectedSection.title}
                                                fill
                                                className="object-contain object-right-top opacity-50 md:opacity-100"
                                            />
                                        </motion.div>

                                        {/* Content Wrapper - Waits for layout animation */}
                                        <div className="p-8 md:p-16 pt-32 md:pt-24 relative z-10 w-full max-w-[1400px] mx-auto">
                                            <AnimatePresence>
                                                {contentReady && (
                                                    <motion.div
                                                        variants={contentVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="exit"
                                                        className="w-full"
                                                    >
                                                        <motion.div
                                                            variants={contentVariants}
                                                            className="max-w-4xl"
                                                        >
                                                            <motion.h2
                                                                variants={contentVariants}
                                                                className="text-6xl md:text-8xl font-semibold tracking-tight mb-8 text-white"
                                                            >
                                                                {selectedSection.title}
                                                            </motion.h2>

                                                            <motion.div
                                                                variants={contentVariants}
                                                                className="text-xl text-white/70 font-normal leading-relaxed mb-16 max-w-2xl"
                                                            >
                                                                {selectedSection.longDescription}
                                                            </motion.div>
                                                        </motion.div>

                                                        {/* Dynamic Content - Full Width */}
                                                        <motion.div
                                                            variants={contentVariants}
                                                            className="w-full pb-20"
                                                        >
                                                            {selectedId === 'projects' && <ProjectGrid />}
                                                            {selectedId === 'team' && <TeamDirectory />}
                                                            {selectedId === 'involved' && <RecruitmentTimeline />}
                                                        </motion.div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                </main>
            </LayoutGroup>
        </div>
    );
}
