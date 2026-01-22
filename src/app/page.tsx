"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup, useScroll, useTransform } from 'framer-motion';
import { Linkedin, Instagram, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

import './globals.css';
import ProjectGrid from '@/components/stanford/ProjectGrid';
import TeamDirectory from '@/components/stanford/TeamDirectory';
import RecruitmentTimeline from '@/components/stanford/RecruitmentTimeline';
import PartnersGrid from '@/components/stanford/PartnersGrid';
import HeroSection from '@/components/hero/HeroSection';

// Reusing the grain overlay component
const GrainOverlay = () => (
    <div className="fixed inset-0 pointer-events-none z-[99] opacity-[0.08] mix-blend-overlay"
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

    // Scroll-based animations for sections
    const { scrollY } = useScroll();
    const sectionOpacity = useTransform(scrollY, [200, 500], [0, 1]);
    const sectionY = useTransform(scrollY, [200, 500], [60, 0]);
    const navOpacity = useTransform(scrollY, [0, 100], [0.7, 1]);
    const navBackground = useTransform(
        scrollY,
        [0, 200],
        ["rgba(5,5,5,0)", "rgba(5,5,5,0.8)"]
    );

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

    if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

    const selectedSection = SECTIONS.find(s => s.id === selectedId);

    return (
        <div className="min-h-screen bg-[#050505] text-white font-[family-name:var(--font-inter)] selection:bg-white/20 selection:text-white overflow-x-hidden relative">
            {/* Grain overlay - disabled on mobile for performance */}
            {!isMobile && <GrainOverlay />}

            {/* Navigation - Always visible, higher z-index */}
            <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: selectedId ? 0 : 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{
                    opacity: navOpacity,
                    backgroundColor: navBackground,
                    backdropFilter: "blur(8px)",
                }}
                className="fixed top-0 left-0 right-0 z-[60] px-6 sm:px-12 py-6 flex justify-between items-center max-w-[1600px] mx-auto w-full pointer-events-none"
            >
                <div className="pointer-events-auto">
                    <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-xs font-mono tracking-[0.3em] uppercase opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
                        Generative AI <span className="text-white">@ Cornell</span>
                    </a>
                </div>
                <div className="flex gap-6 text-white/70 pointer-events-auto">
                    <a href="https://www.linkedin.com/company/generative-ai-at-cornell/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Linkedin size={18} /></a>
                    <a href="https://instagram.com/cornellgenai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Instagram size={18} /></a>
                </div>
            </motion.nav>

            {/* Hero Section - Full viewport height */}
            <HeroSection
                headline="Cornell's home
for students in AI"
                subtitle="Connecting Cornell's most passionate developers with industry giants to build AI products that streamline workflows."
            />

            {/* Content Section - Appears after hero */}
            <div id="sections" className="relative z-10 bg-[#050505]">
                {/* Background gradient for content area */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {!isMobile && (
                        <>
                            {/* Subtle ambient glow */}
                            <motion.div
                                animate={{
                                    opacity: [0.2, 0.3, 0.2],
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 10,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute top-0 left-[20%] w-[60%] h-[40%] bg-[#FF1A1A] blur-[200px] rounded-full opacity-10"
                            />
                            <motion.div
                                animate={{
                                    opacity: [0.1, 0.15, 0.1],
                                }}
                                transition={{
                                    duration: 12,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 2
                                }}
                                className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-[#0066FF] blur-[180px] rounded-full opacity-10"
                            />
                        </>
                    )}
                </div>

                <LayoutGroup>
                    <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8">

                        {/* Landing View - Section Cards */}
                        <AnimatePresence mode="wait">
                            {!selectedId && (
                                <motion.div
                                    key="landing"
                                    style={{ opacity: sectionOpacity, y: sectionY }}
                                    className="py-16 md:py-24"
                                >
                                    {/* Section Header */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.3 }}
                                        transition={{ duration: 0.6, ease: SMOOTH_EASE }}
                                        className="text-center mb-12 md:mb-20"
                                    >
                                        <span className="text-sm font-mono uppercase tracking-[0.3em] text-white/40 mb-4 block">
                                            Explore
                                        </span>
                                        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
                                            What We Do
                                        </h2>
                                    </motion.div>

                                    {/* Section Cards - 3-column grid on desktop */}
                                    <motion.section
                                        variants={containerVariants}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, amount: 0.2 }}
                                        className={`w-full mx-auto ${isMobile ? 'flex flex-col gap-4' : 'grid grid-cols-3 gap-8 items-stretch'}`}
                                    >
                                        {SECTIONS.map((section) => (
                                            <motion.div
                                                layoutId={`card-${section.id}`}
                                                key={section.id}
                                                variants={cardVariants}
                                                onClick={() => setSelectedId(section.id)}
                                                whileHover={!isMobile ? { scale: 1.03, y: -8 } : undefined}
                                                whileTap={{ scale: 0.97 }}
                                                transition={{
                                                    layout: { duration: 0.4, ease: SNAPPY_EASE },
                                                    scale: { duration: 0.2, delay: 0 },
                                                    y: { duration: 0.2, delay: 0 }
                                                }}
                                                className={`group relative cursor-pointer will-change-transform ${isMobile
                                                    ? 'flex flex-col items-center text-center py-6 px-4 bg-white/[0.03] rounded-2xl border border-white/5'
                                                    : 'flex flex-col items-center text-center p-8 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300'
                                                    }`}
                                                style={{ transformOrigin: "center center" }}
                                            >
                                                {isMobile ? (
                                                    /* Mobile: Compact layout */
                                                    <>
                                                        <div className="relative w-full h-[120px] overflow-hidden mb-4">
                                                            <Image
                                                                src={section.image}
                                                                alt={section.title}
                                                                fill
                                                                className="object-contain object-center"
                                                            />
                                                        </div>
                                                        <h3 className="text-2xl font-semibold tracking-tight text-white">
                                                            {section.title}
                                                        </h3>
                                                        <p className="text-sm text-white/50 mt-2">
                                                            {section.description}
                                                        </p>
                                                    </>
                                                ) : (
                                                    /* Desktop: Full layout */
                                                    <>
                                                        <div className="relative h-48 w-full mb-6 overflow-hidden">
                                                            <Image
                                                                src={section.image}
                                                                alt={section.title}
                                                                fill
                                                                className="object-contain object-center transition-transform duration-500 group-hover:scale-110"
                                                            />
                                                        </div>
                                                        <h3 className="text-4xl font-semibold mb-3 tracking-tight transition-colors duration-300">
                                                            {section.title}
                                                        </h3>
                                                        <p className="text-sm text-white/50 font-normal group-hover:text-white/70 transition-colors duration-300">
                                                            {section.description}
                                                        </p>
                                                        <div className="mt-6 flex items-center gap-2 text-sm text-white/40 group-hover:text-white/60 transition-colors">
                                                            <span>Explore</span>
                                                            <motion.span
                                                                className="inline-block"
                                                                initial={{ x: 0 }}
                                                                whileHover={{ x: 4 }}
                                                            >
                                                                →
                                                            </motion.span>
                                                        </div>
                                                    </>
                                                )}
                                            </motion.div>
                                        ))}
                                    </motion.section>

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
                                        className="absolute inset-0 bg-black/60 backdrop-blur-md pointer-events-auto"
                                        onClick={() => setSelectedId(null)}
                                    />

                                    {/* Expanded Card Container */}
                                    <motion.div
                                        layoutId={`card-${selectedId}`}
                                        className="relative z-10 w-full max-w-[1600px] h-full md:h-[90vh] bg-[#0a0a0a]/95 backdrop-blur-lg md:rounded-2xl overflow-hidden shadow-2xl flex flex-col pointer-events-auto border border-white/10 will-change-transform"
                                        transition={{
                                            layout: { duration: 0.4, ease: SNAPPY_EASE }
                                        }}
                                        style={{ transformOrigin: "center center" }}
                                    >
                                        {/* Close Button */}
                                        <motion.button
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.25, delay: 0.2 }}
                                            onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                                            className="absolute top-4 left-4 z-[200] flex items-center gap-2 text-white/70 hover:text-white active:text-white transition-colors group p-3 -m-3 touch-manipulation"
                                            style={{ WebkitTapHighlightColor: 'transparent' }}
                                        >
                                            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform duration-200" />
                                            <span className="text-sm font-medium uppercase tracking-widest">Back</span>
                                        </motion.button>

                                        {/* Main Content Container */}
                                        <div className="flex-1 overflow-y-auto relative w-full">
                                            {/* Top Right Image */}
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.4, ease: SMOOTH_EASE, delay: 0.1 }}
                                                className="fixed md:absolute top-0 right-0 w-full md:w-[400px] h-64 md:h-[400px] pointer-events-none opacity-20 md:opacity-100 mix-blend-screen md:mix-blend-normal z-0 will-change-transform"
                                            >
                                                <Image
                                                    src={selectedSection.image}
                                                    alt={selectedSection.title}
                                                    fill
                                                    className="object-contain object-right-top opacity-50 md:opacity-100"
                                                />
                                            </motion.div>

                                            {/* Content Wrapper */}
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
                                                                    className="text-5xl md:text-8xl font-semibold tracking-tight mb-8 text-white"
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

                                                            {/* Dynamic Content */}
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
        </div>
    );
}
