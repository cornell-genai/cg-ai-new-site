"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CURRENT, partner } from "@/lib/data";

// Small interactive pieces that sit inside running text. Everything is sized
// in em so it scales with the paragraph.

// 7×7 pixel icons, one per project.
const ICONS: Record<string, string[]> = {
    microduck: [".......", "..##...", ".####..", "..###.#", "..#####", "...###.", "......."],
    "trading-agent": [".......", ".....#.", "....##.", ".#.#...", "#.#....", "#......", "#######"],
    "long-horizon-agents": ["#......", "##.....", ".##....", "..##...", "...##..", "....##.", ".....##"],
};

function PixelIcon({ rows }: { rows: string[] }) {
    return (
        <svg viewBox="0 0 7 7" className="h-[0.44em] w-[0.44em]" shapeRendering="crispEdges" aria-hidden>
            {rows.flatMap((r, y) => [...r].map((c, x) => (c === "#" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" /> : null)))}
        </svg>
    );
}

export function ProjectIcons() {
    const [hover, setHover] = useState<string | null>(null);
    return (
        <span className="relative mx-[0.15em] inline-flex items-center gap-[0.12em] align-[-0.08em]">
            {CURRENT.map((p) => (
                <Link
                    key={p.slug}
                    href={`/projects#${p.slug}`}
                    aria-label={p.title}
                    onPointerEnter={() => setHover(p.slug)}
                    onPointerLeave={() => setHover(null)}
                    className="relative inline-flex size-[0.86em] items-center justify-center rounded-full bg-bone/10 text-bone ring-1 ring-bone/15 transition-colors duration-300 hover:bg-red hover:ring-red"
                >
                    <PixelIcon rows={ICONS[p.slug] ?? ICONS["long-horizon-agents"]} />
                    <AnimatePresence>
                        {hover === p.slug && (
                            <motion.span
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 4 }}
                                transition={{ duration: 0.18 }}
                                className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-bone px-2 py-1 text-[13px] font-medium tracking-normal text-night"
                            >
                                {p.title}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>
            ))}
        </span>
    );
}

const CLIENTS = ["Cisco", "Investcorp", "QuickFi", "Charter", "Vero", "Bridge", "NYSFP", "Gradial"];

// A pill that shows one client at a time. Click to step to the next; it also
// steps on its own every few seconds until someone interacts with it.
export function ClientCycler() {
    const [i, setI] = useState(0);
    const [auto, setAuto] = useState(true);
    useEffect(() => {
        if (!auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const id = setInterval(() => setI((n) => (n + 1) % CLIENTS.length), 2600);
        return () => clearInterval(id);
    }, [auto]);
    const name = CLIENTS[i];
    const p = partner(name);
    return (
        <button
            type="button"
            onClick={() => { setAuto(false); setI((n) => (n + 1) % CLIENTS.length); }}
            aria-label={`Client: ${name}. Show next client`}
            className="group relative mx-[0.12em] inline-flex h-[0.92em] w-[3.1em] items-center justify-center overflow-hidden rounded-full bg-bone/[0.07] align-[-0.12em] ring-1 ring-bone/15 transition-colors hover:bg-bone/[0.12]"
        >
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                    key={name}
                    initial={{ y: "110%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-110%", opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center justify-center"
                >
                    {p?.logo ? (
                        <img src={p.logo} alt="" style={{ height: `${0.52 * ((p.h ?? 26) / 26)}em` }} className="w-auto max-w-[2.3em] object-contain" />
                    ) : (
                        <span className="text-[0.42em] font-semibold tracking-[-0.02em] text-white">{name}</span>
                    )}
                </motion.span>
            </AnimatePresence>
        </button>
    );
}

export function OrbLogo({ src, name }: { src: string; name: string }) {
    return (
        <span title={name} className="mx-[0.1em] inline-flex size-[0.92em] items-center justify-center rounded-full bg-[#1d1d1d] align-[-0.12em] ring-1 ring-bone/15">
            <img src={src} alt={name} className="max-h-[0.46em] max-w-[0.6em] object-contain" />
        </span>
    );
}
