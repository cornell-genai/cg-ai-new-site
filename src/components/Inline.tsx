"use client";

import Link from "next/link";
import { CURRENT } from "@/lib/data";
import { cn } from "@/lib/utils";

// Low-key circle stacks that sit inside running text: each circle half
// overlaps the next. Hovering a circle lifts it. Sized in em so they scale
// with the paragraph.

function Stack({ children, className }: { children: React.ReactNode; className?: string }) {
    return <span className={cn("ml-[0.14em] mr-[0.04em] inline-flex items-center align-[-0.04em] [&>*+*]:-ml-[0.12em]", className)}>{children}</span>;
}

const circle =
    "relative inline-flex size-[0.82em] shrink-0 items-center justify-center rounded-full ring-[0.06em] ring-night transition-transform duration-300 ease-out hover:z-10 hover:-translate-y-[0.08em]";

// 7×7 pixel icons, one per project.
const ICONS: Record<string, string[]> = {
    microduck: [".......", "..##...", ".####..", "..###.#", "..#####", "...###.", "......."],
    "trading-agent": [".......", ".....#.", "....##.", ".#.#...", "#.#....", "#......", "#######"],
    "long-horizon-agents": ["#......", "##.....", ".##....", "..##...", "...##..", "....##.", ".....##"],
};

export function ProjectIcons() {
    return (
        <Stack>
            {CURRENT.map((p) => (
                <Link key={p.slug} href={`/projects#${p.slug}`} aria-label={p.title} className={cn(circle, "bg-[#2a2a2a] text-bone hover:bg-red")}>
                    <svg viewBox="0 0 7 7" className="h-[0.4em] w-[0.4em]" shapeRendering="crispEdges" aria-hidden>
                        {(ICONS[p.slug] ?? ICONS["long-horizon-agents"]).flatMap((r, y) =>
                            [...r].map((c, x) => (c === "#" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" /> : null)),
                        )}
                    </svg>
                </Link>
            ))}
        </Stack>
    );
}

// Each client as a circle in its brand colour with a monogram.
const CLIENTS = [
    { name: "Cisco", bg: "#049fd9", mark: "C" },
    { name: "Investcorp", bg: "#13294b", mark: "I" },
    { name: "QuickFi", bg: "#76bc21", mark: "Q" },
    { name: "Charter", bg: "#0071bc", mark: "Ch" },
    { name: "Vero", bg: "#16b6e8", mark: "V" },
    { name: "Bridge", bg: "#f3f0ea", mark: "B", ink: "#121212" },
    { name: "NYSFP", bg: "#5b2c83", mark: "N" },
    { name: "Gradial", bg: "#f598b0", mark: "G", ink: "#121212" },
];

export function ClientStack() {
    return (
        <Stack>
            {CLIENTS.map((c) => (
                <span key={c.name} title={c.name} className={circle} style={{ background: c.bg, color: c.ink ?? "#fff" }}>
                    <span className="text-[0.36em] font-semibold leading-none tracking-[-0.04em]">{c.mark}</span>
                    <span className="sr-only">{c.name}</span>
                </span>
            ))}
        </Stack>
    );
}

export function OpenSourceStack() {
    return (
        <Stack>
            <span title="MLX" className={cn(circle, "bg-[#1e1e1e]")}>
                <img src="/logos/mlx.png" alt="MLX" className="max-w-[0.46em] object-contain" />
            </span>
            <span title="Pollen Robotics" className={cn(circle, "bg-[#f3f0ea]")}>
                <img src="/logos/pollen.svg" alt="Pollen Robotics" className="max-h-[0.5em] object-contain" />
            </span>
        </Stack>
    );
}

export function ClientDot({ name, className }: { name: string; className?: string }) {
    const c = CLIENTS.find((x) => x.name === name);
    if (!c) return null;
    return (
        <span className={cn("inline-flex size-9 shrink-0 items-center justify-center rounded-full", className)} style={{ background: c.bg, color: c.ink ?? "#fff" }}>
            <span className="text-[13px] font-semibold tracking-[-0.04em]">{c.mark}</span>
        </span>
    );
}
