"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ScrollSection, Container, fadeInUp } from "../layout/ScrollSection";
import { ArrowUpRight } from "lucide-react";

export default function CTASection() {
    return (
        <ScrollSection className="relative overflow-hidden py-32 md:py-48">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-red-500/10 to-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

            <Container className="relative z-10">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                        hidden: { opacity: 0, scale: 0.95 },
                        visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } }
                    }}
                    className="text-center max-w-4xl mx-auto glass-panel p-12 md:p-20 rounded-3xl"
                >
                    <motion.h2
                        className="text-4xl md:text-6xl font-display font-bold text-white leading-tight mb-8"
                    >
                        Ready to <span className="text-gradient-nebula">Ship?</span>
                    </motion.h2>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link
                            href="/apply"
                            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-black font-display font-bold uppercase tracking-wide hover:scale-105 transition-transform duration-300 rounded-lg"
                        >
                            Apply Now
                            <ArrowUpRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="mailto:contact@cornellgenai.com"
                            className="inline-flex items-center justify-center gap-2 px-10 py-5 glass-panel text-white font-display font-bold uppercase tracking-wide hover:bg-white/10 transition-all duration-300 rounded-lg"
                        >
                            Contact Us
                        </Link>
                    </motion.div>
                </motion.div>
            </Container>
        </ScrollSection>
    );
}
