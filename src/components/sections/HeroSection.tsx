"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Container, fadeInUp } from "../layout/ScrollSection";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20">

            {/* Ambient Glow Orb */}
            <div className="glow-orb top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40 animate-pulse" style={{ animationDuration: '4s' }} />

            <Container className="relative z-20">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } }
                    }}
                    className="max-w-4xl mx-auto text-center"
                >
                    {/* Tag */}
                    <motion.div variants={fadeInUp} className="mb-8 flex justify-center">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white/80 font-mono text-xs uppercase tracking-wider shadow-lg shadow-purple-500/10 hover:border-white/20 transition-all">
                            <Sparkles className="w-3 h-3 text-purple-400" />
                            Cornell's Creative AI Lab
                        </span>
                    </motion.div>

                    {/* Headline - Luminous Gradient */}
                    <motion.h1
                        variants={fadeInUp}
                        className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-[1.1] tracking-tight"
                    >
                        We Architect <br />
                        <span className="text-gradient-nebula">Creative Intelligence</span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        variants={fadeInUp}
                        className="mt-8 text-lg md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        Bridging the gap between <strong>academic theory</strong> and <strong>production reality</strong>.
                        We build the generative engines that power the next wave of software.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div variants={fadeInUp} className="mt-12 flex flex-col sm:flex-row gap-5 justify-center">
                        <Link
                            href="/apply"
                            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-display font-bold uppercase tracking-wide hover:scale-105 transition-all duration-300 rounded-lg overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                            Partner With Us
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/portfolio"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 glass-panel text-white font-display font-bold uppercase tracking-wide hover:bg-white/10 transition-all duration-300 rounded-lg"
                        >
                            View Our Work
                        </Link>
                    </motion.div>

                    {/* Stats row - Glass Style */}
                    <motion.div
                        variants={fadeInUp}
                        className="mt-20 inline-flex flex-wrap justify-center gap-8 md:gap-16 glass-panel px-10 py-6 rounded-2xl"
                    >
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-mono font-bold text-white">50+</div>
                            <div className="mt-1 text-xs text-zinc-500 uppercase tracking-wider">Builders</div>
                        </div>
                        <div className="w-px h-12 bg-white/10 hidden md:block" />
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-mono font-bold text-white">12</div>
                            <div className="mt-1 text-xs text-zinc-500 uppercase tracking-wider">Shipped Projects</div>
                        </div>
                        <div className="w-px h-12 bg-white/10 hidden md:block" />
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-mono font-bold text-white">5</div>
                            <div className="mt-1 text-xs text-zinc-500 uppercase tracking-wider">Partners</div>
                        </div>
                    </motion.div>
                </motion.div>
            </Container>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
            >
                <div className="flex flex-col items-center gap-2 text-zinc-600">
                    <span className="text-[10px] font-mono uppercase tracking-widest">Explore</span>
                    <ChevronDown className="w-4 h-4 animate-bounce" />
                </div>
            </motion.div>
        </section>
    );
}
