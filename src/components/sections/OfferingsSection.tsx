"use client";

import React from "react";
import { motion } from "framer-motion";
import { ScrollSection, Container, AnimatedText, staggerContainer, fadeInUp } from "../layout/ScrollSection";
import { BarChart3, Eye, Sparkles, Network, Code, GraduationCap } from "lucide-react";

const OFFERINGS = [
    {
        icon: <BarChart3 className="w-5 h-5" />,
        title: "AI Product Engineering",
        description: "Full-stack development of intelligent applications that solve real business problems.",
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        icon: <Eye className="w-5 h-5" />,
        title: "Novel Research",
        description: "Exploring new architectures and fine-tuning strategies to push model capabilities.",
        gradient: "from-purple-500 to-pink-500"
    },
    {
        icon: <Code className="w-5 h-5" />,
        title: "Technical Consulting",
        description: "Expert guidance on integrating Generative AI into your existing infrastructure.",
        gradient: "from-amber-500 to-orange-500"
    },
    {
        icon: <Network className="w-5 h-5" />,
        title: "Corporate Partnership",
        description: "Collaborate with our teams on sponsored projects and talent pipelines.",
        gradient: "from-green-500 to-emerald-500"
    },
    {
        icon: <GraduationCap className="w-5 h-5" />,
        title: "Talent Pipeline",
        description: "Access Cornell's brightest minds in ML and software engineering.",
        gradient: "from-blue-500 to-indigo-500"
    },
    {
        icon: <Sparkles className="w-5 h-5" />,
        title: "Innovation Workshops",
        description: "Hands-on sessions to explore AI opportunities specific to your industry.",
        gradient: "from-rose-500 to-red-500"
    },
];

export default function OfferingsSection() {
    return (
        <ScrollSection className="relative">
            <Container>
                <AnimatedText className="text-center mb-20">
                    <span className="font-mono text-xs text-purple-400 uppercase tracking-widest">
                        Capabilities
                    </span>
                    <h2 className="mt-4 text-3xl md:text-5xl font-display font-bold text-white">
                        Enterprise-Grade Scale
                    </h2>
                    <p className="mt-6 text-zinc-400 max-w-2xl mx-auto text-lg">
                        We combine the rigor of Ivy League research with the shipping velocity of a startup.
                    </p>
                </AnimatedText>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {OFFERINGS.map((item, i) => (
                        <motion.div
                            key={item.title}
                            variants={fadeInUp}
                            className="glass-panel p-8 rounded-2xl group relative overflow-hidden transition-all duration-500 hover:-translate-y-1"
                        >
                            <div className={`absolute top-0 right-0 p-20 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500 rounded-full -mr-10 -mt-10`} />

                            <div className={`inline-flex p-3 rounded-lg bg-white/5 text-white mb-6 group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/10 group-hover:ring-white/30`}>
                                {item.icon}
                            </div>

                            <h3 className="text-xl font-display font-semibold text-white mb-3">
                                {item.title}
                            </h3>
                            <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </Container>
        </ScrollSection>
    );
}
