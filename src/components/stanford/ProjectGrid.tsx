"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, ArrowUpRight } from 'lucide-react';
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
        title: "ComputeSwarm",
        description: "Decentralized training network allowing students to pool GPU resources for large-scale model training.",
        tags: ["Python", "Pytorch", "Distributed Systems"],
        image: "/network.png",
        links: { github: "#", demo: "#" }
    },
    {
        id: 2,
        title: "Legal RAG Agent",
        description: "Autonomous agent for navigating complex case law and generating legal briefs with citation breakdown.",
        tags: ["LangChain", "Next.js", "OpenAI"],
        image: "/tower.png",
        links: { github: "#", demo: "#" }
    },
    {
        id: 3,
        title: "Generative Video",
        description: "Research into temporal consistency in diffusion models for long-form video generation.",
        tags: ["Research", "Computer Vision", "Diffusers"],
        image: "/envelopes.png",
        links: { github: "#" }
    },
    {
        id: 4,
        title: "Campus AI Assistant",
        description: "Fine-tuned Llama 3 model serving as a comprehensive guide for campus life and course requirements.",
        tags: ["Llama 3", "Fine-tuning", "RAG"],
        image: "/network.png",
        links: { github: "#", demo: "#" }
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
                            className="object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-500 grayscale"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

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

                        <div className="flex gap-4 pt-2">
                            {project.links.github && (
                                <a href={project.links.github} className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors uppercase tracking-widest font-medium">
                                    <Github size={14} /> Code
                                </a>
                            )}
                            {project.links.demo && (
                                <a href={project.links.demo} className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors uppercase tracking-widest font-medium">
                                    <ExternalLink size={14} /> Demo
                                </a>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}

