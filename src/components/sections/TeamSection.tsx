"use client";

import React from "react";
import { motion } from "framer-motion";
import { ScrollSection, Container, AnimatedText, staggerContainer, fadeInUp } from "../layout/ScrollSection";
import { Linkedin } from "lucide-react";

// Placeholder images would serve better here, but using colored gradients for placeholders for now
const TEAM = [
    { name: "Jordan Chen", role: "President", color: "from-blue-500 to-purple-500" },
    { name: "Maya Williams", role: "VP Engineering", color: "from-emerald-500 to-teal-500" },
    { name: "Alex Kim", role: "VP Research", color: "from-orange-500 to-red-500" },
    { name: "Sam Taylor", role: "VP Partnerships", color: "from-pink-500 to-rose-500" },
];

export default function TeamSection() {
    return (
        <ScrollSection>
            <Container>
                <AnimatedText className="text-center mb-16">
                    <span className="font-mono text-xs text-purple-400 uppercase tracking-widest">
                        The Collective
                    </span>
                    <h2 className="mt-4 text-3xl md:text-5xl font-display font-bold text-white">
                        Leadership
                    </h2>
                </AnimatedText>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
                >
                    {TEAM.map((member) => (
                        <motion.div
                            key={member.name}
                            variants={fadeInUp}
                            className="group relative text-center"
                        >
                            {/* Avatar */}
                            <div className="relative mb-6 aspect-[4/5] rounded-2xl overflow-hidden glass-panel transition-transform duration-500 group-hover:scale-[1.02]">
                                {/* Placeholder Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-4xl font-display font-bold text-white/20 group-hover:text-white/40 transition-colors">
                                        {member.name.charAt(0)}
                                    </span>
                                </div>

                                {/* LinkedIn Button Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                                    <button className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform">
                                        <Linkedin className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-display font-semibold text-white group-hover:text-purple-400 transition-colors">
                                {member.name}
                            </h3>
                            <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider mt-1">
                                {member.role}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </Container>
        </ScrollSection>
    );
}
