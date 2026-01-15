"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

// Coordinated animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.05
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1] as const
        }
    }
};

const PROJECTS = [
    {
        id: 1,
        title: "ClassGPT",
        description: "A Cornell-exclusive platform enabling professors to create AI Tutors educated on their course content. Students can join supported classes and instantly access AI tutoring specifically tailored to that course's material.",
        tags: ["AI Tutoring", "Education", "LLM", "RAG"],
        image: "/network.png",
        links: { demo: "#" },
        status: "In Development (SP25)"
    },
    {
        id: 2,
        title: "QuickFi: AI Insurance Verification",
        description: "An AI agent that initiates outreach to insurance providers, requests commercial insurance certificates, validates contract-specific coverage details, handles follow-ups, and ensures documentation is stored and tagged correctly for compliance.",
        tags: ["AI Agents", "Automation", "Compliance"],
        image: "/tower.png",
        links: { blog: "https://drive.google.com/file/u/0/d/1Pu6QSW2ClZg3em3bRcolzeS73srP9z-p/view" },
        status: "Completed (SP25)"
    },
    {
        id: 3,
        title: "QuickFi: Vendor Due Diligence",
        description: "An intelligent system that verifies vendor legitimacy by cross-referencing public business records, risk databases, and online presence. It flags potential issues like high-risk scores, inactive registrations, or adverse news for internal review.",
        tags: ["Risk Management", "Fraud Prevention", "AI Agents"],
        image: "/envelopes.png",
        links: { blog: "https://drive.google.com/file/u/0/d/1Pu6QSW2ClZg3em3bRcolzeS73srP9z-p/view" },
        status: "Completed (SP25)"
    }
];

export default function ProjectGrid() {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
        >
            {PROJECTS.map((project) => (
                <motion.div
                    key={project.id}
                    variants={itemVariants}
                    className="group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 will-change-transform"
                >
                    <div className="aspect-video relative overflow-hidden bg-black/50">
                        <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover opacity-70 group-hover:scale-105 group-hover:opacity-90 transition-all duration-500"
                        />
                        {/* Subtle gradient only at bottom for text readability */}
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-300">
                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                                View <ArrowUpRight size={10} />
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="text-2xl font-medium text-white mb-2">{project.title}</h3>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {project.tags.map(tag => (
                                    <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-1 bg-white/10 backdrop-blur-sm rounded-md border border-white/5 text-white/80 group-hover:bg-white/20 transition-colors">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-5 border-t border-white/5 bg-black/20">
                        <p className="text-sm text-white/60 font-normal leading-relaxed mb-4 group-hover:text-white/80 transition-colors">
                            {project.description}
                        </p>

                        <div className="flex items-center justify-between pt-2">
                            <div className="flex gap-4">
                                {'blog' in project.links && project.links.blog && (
                                    <a href={project.links.blog} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors uppercase tracking-widest font-medium">
                                        <ExternalLink size={14} /> Blog
                                    </a>
                                )}
                                {'demo' in project.links && project.links.demo && (
                                    <a href={project.links.demo} className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors uppercase tracking-widest font-medium">
                                        <ExternalLink size={14} /> Demo
                                    </a>
                                )}
                            </div>
                            {project.status && (
                                <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-white/5 rounded-md border border-white/10 text-white/50">
                                    {project.status}
                                </span>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}

