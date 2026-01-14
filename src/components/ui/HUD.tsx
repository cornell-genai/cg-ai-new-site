"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * TextScrambler
 * constantly randomly shifts characters before settling.
 */
function ScrambleText({ text, speed = 50 }: { text: string; speed?: number }) {
    const [display, setDisplay] = useState(text);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

    useEffect(() => {
        let iteration = 0;
        const interval = setInterval(() => {
            setDisplay(
                text
                    .split("")
                    .map((char, index) => {
                        if (index < iteration) return text[index];
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("")
            );
            if (iteration >= text.length) clearInterval(interval);
            iteration += 1 / 3;
        }, speed);
        return () => clearInterval(interval);
    }, [text, speed]);

    return <span className="font-mono">{display}</span>;
}

export default function HUD() {
    return (
        <div className="fixed inset-0 z-50 pointer-events-none p-6 mix-blend-difference text-white flex flex-col justify-between">
            {/* Top Row */}
            <div className="flex justify-between items-start">
                {/* Top Left: Coordinates */}
                <div className="font-mono text-xs opacity-70 flex flex-col gap-1">
                    <div><ScrambleText text="SYSTEM: ONLINE" /></div>
                    <div><ScrambleText text="LOC: 42.4534° N, 76.4735° W" /></div>
                    <div>MEM_USAGE: 402MB</div>
                </div>

                {/* Top Right: Menu trigger (Stylized) */}
                <div className="pointer-events-auto cursor-pointer group">
                    <div className="flex flex-col gap-1.5 items-end">
                        <span className="w-8 h-[2px] bg-white group-hover:w-12 transition-all duration-300"></span>
                        <span className="w-6 h-[2px] bg-white group-hover:w-12 transition-all duration-300 delay-75"></span>
                        <span className="w-4 h-[2px] bg-white group-hover:w-12 transition-all duration-300 delay-150"></span>
                    </div>
                    <div className="text-[10px] font-mono mt-1 text-right opacity-0 group-hover:opacity-100 transition-opacity">MENU</div>
                </div>
            </div>

            {/* Center Crosshair (Optional) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 opacity-20">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[1px] bg-white"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-white"></div>
            </div>

            {/* Bottom Row */}
            <div className="flex justify-between items-end">
                {/* Bottom Left: Generative Context */}
                <div className="max-w-md pointer-events-auto">
                    <h2 className="text-xl font-bold font-display uppercase tracking-widest mb-2">
                        Cornell Gen AI
                    </h2>
                    <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                        <ScrambleText speed={10} text="Exploration of latent space logic. We build the tools that build the future." />
                    </p>
                </div>

                {/* Bottom Right: Action */}
                <button className="pointer-events-auto border border-white/20 hover:bg-white hover:text-black transition-colors duration-300 px-6 py-2 rounded-full font-mono text-xs tracking-widest uppercase">
                    Initialize_Sequence
                </button>
            </div>
        </div>
    );
}
