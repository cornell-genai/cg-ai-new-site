"use client";

import React from "react";
import { motion } from "framer-motion";
import { ScrollSection, Container, AnimatedText, fadeInUp } from "../layout/ScrollSection";
import { Marquee } from "@/components/magicui/marquee";

const PARTNERS = [
    { src: "/chartercommunications.png", alt: "Charter Communications" },
    { src: "/vero.webp", alt: "Vero Technologies" },
    { src: "/quickfi-logo-01-1.png", alt: "QuickFi" },
    { src: "/cisco.png", alt: "Cisco" },
    { src: "/gradial.jpeg", alt: "Gradial" },
];

export default function PartnersSection() {
    return (
        <ScrollSection className="py-16 md:py-24 relative">
            {/* Glow */}
            <div className="glow-orb left-0 top-1/2 -translate-y-1/2 opacity-20 -translate-x-1/2 bg-blue-500 blur-[100px]" />

            <Container>
                <AnimatedText className="text-center mb-12">
                    <span className="font-mono text-xs text-purple-400 uppercase tracking-widest">
                        Trusted Partnerships
                    </span>
                    <h2 className="mt-4 text-2xl md:text-3xl font-display font-bold text-white">
                        Powering the Next Generation
                    </h2>
                </AnimatedText>
            </Container>

            <motion.div
                variants={fadeInUp}
                className="relative w-full overflow-hidden mt-8"
            >
                {/* Soft Gradient masks */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[var(--color-obsidian)] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--color-obsidian)] to-transparent z-10 pointer-events-none" />

                <Marquee pauseOnHover className="[--duration:30s]">
                    {PARTNERS.map((partner) => (
                        <div
                            key={partner.alt}
                            className="mx-12 flex items-center justify-center opacity-40 hover:opacity-100 transition-all duration-500 filter grayscale hover:grayscale-0"
                        >
                            <img
                                src={partner.src}
                                alt={partner.alt}
                                className="h-10 md:h-14 w-auto object-contain"
                            />
                        </div>
                    ))}
                </Marquee>
            </motion.div>
        </ScrollSection>
    );
}
