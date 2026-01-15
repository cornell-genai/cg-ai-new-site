"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Cpu, Activity, GitCommit, Users } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * BentoTile
 * The fundamental building block of the layout.
 */
function BentoTile({ children, className, title, label }: any) {
    return (
        <div className={cn(
            "relative border border-[var(--color-border)] bg-[#050505]/80 backdrop-blur-md p-6 group overflow-hidden hover:border-[var(--color-laser-red)] transition-colors duration-300",
            className
        )}>
            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[var(--color-blind-steel)] opacity-20" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[var(--color-blind-steel)] opacity-20" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[var(--color-blind-steel)] opacity-20" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[var(--color-blind-steel)] opacity-20" />

            {/* Label */}
            {(title || label) && (
                <div className="mb-4 flex justify-between items-baseline">
                    {title && <h3 className="text-xl font-display font-bold uppercase tracking-wide text-white">{title}</h3>}
                    {label && <span className="font-mono text-[10px] text-[var(--color-laser-red)] uppercase">{label}</span>}
                </div>
            )}

            {children}
        </div>
    );
}

export default function BentoLayout() {
    return (
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-20 min-h-screen flex flex-col justify-center">

            {/* Header / Intro */}
            <div className="mb-12 text-center">
                <div className="inline-block px-3 py-1 border border-[var(--color-laser-red)] text-[var(--color-laser-red)] font-mono text-xs mb-4">
                    V 1.0 // EST. 2024
                </div>
                <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tighter uppercase">
                    The Vanguard
                </h1>
                <p className="max-w-2xl mx-auto text-[var(--color-blind-steel)] font-mono text-sm leading-relaxed">
                    A student-run collective shipping real AI projects with industry partners.
                    Small teams. Real mentorship. Hands-on experience that launches careers.
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 h-auto md:h-[600px]">

                {/* 1. Projects (Tall) */}
                <BentoTile className="md:row-span-2 flex flex-col justify-between" title="Ship" label="01">
                    <div className="space-y-6 flex-1 pt-4">
                        <div>
                            <div className="flex justify-between text-sm text-white mb-1">
                                <span>DreamWeaver Agent</span>
                                <ArrowUpRight className="w-4 h-4 text-[var(--color-laser-red)]" />
                            </div>
                            <p className="text-xs text-zinc-500 font-mono">Multi-modal generative workspace.</p>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm text-white mb-1">
                                <span>CornellGPT</span>
                                <ArrowUpRight className="w-4 h-4 text-[var(--color-laser-red)]" />
                            </div>
                            <p className="text-xs text-zinc-500 font-mono">Campus-wide RAG knowledge base.</p>
                        </div>
                    </div>
                    <div className="mt-8 pt-4 border-t border-white/5">
                        <button className="w-full py-3 bg-[var(--color-laser-red)] text-black font-mono font-bold uppercase text-sm hover:bg-white transition-colors">
                            View Portfolio
                        </button>
                    </div>
                </BentoTile>

                {/* 2. Mission (Wide) */}
                <BentoTile className="md:col-span-2" title="Mission" label="02">
                    <p className="text-lg text-zinc-300 font-display leading-snug">
                        "We bridge the gap between academic theory and industrial velocity.
                        Our collective operates as a high-performance implementation lab."
                    </p>
                    <div className="mt-6 flex gap-4">
                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                            <Cpu className="w-4 h-4 text-[var(--color-laser-red)]" />
                            <span>COMPUTE_OPTIMIZED</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                            <GitCommit className="w-4 h-4 text-[var(--color-laser-red)]" />
                            <span>OPEN_SOURCE</span>
                        </div>
                    </div>
                </BentoTile>

                {/* 3. Kinetic Data (Small) */}
                <BentoTile title="Status" label="03">
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                            <div className="text-3xl font-mono text-white font-bold">42</div>
                            <div className="text-[10px] text-zinc-500 uppercase">Active Nodes</div>
                        </div>
                        <div>
                            <div className="text-3xl font-mono text-white font-bold">12k</div>
                            <div className="text-[10px] text-zinc-500 uppercase">Commits</div>
                        </div>
                        <div>
                            <div className="text-3xl font-mono text-white font-bold">99.9%</div>
                            <div className="text-[10px] text-zinc-500 uppercase">Uptime</div>
                        </div>
                        <div className="flex items-end text-[var(--color-laser-red)]">
                            <Activity className="w-6 h-6 animate-pulse" />
                        </div>
                    </div>
                </BentoTile>

                {/* 4. Join (Small) */}
                <BentoTile className="cursor-pointer group hover:bg-[var(--color-laser-red)] hover:border-[var(--color-laser-red)] transition-all" label="04">
                    <div className="h-full flex flex-col justify-center items-center text-center group-hover:text-black">
                        <Users className="w-8 h-8 mb-4 text-[var(--color-laser-red)] group-hover:text-black" />
                        <h3 className="text-xl font-bold font-display uppercase">Join The Vanguard</h3>
                        <p className="text-xs font-mono mt-2 opacity-60">Spring 2026 Cohort</p>
                    </div>
                </BentoTile>

            </div>
        </div>
    );
}
