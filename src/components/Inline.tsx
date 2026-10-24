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
    "relative inline-flex size-[0.82em] shrink-0 items-center justify-center rounded-full ring-[0.06em] ring-night transition-transform duration-300 ease-out hover:z-10 hover:-translate-y-[0.08em] light:shadow-[inset_0_0_0_0.03em_rgba(0,0,0,0.12)]";

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
                <Link key={p.slug} href="/projects" aria-label={p.title} className={cn(circle, "bg-[#2a2a2a] text-bone hover:bg-red light:bg-[#e4e1da] light:hover:bg-red light:hover:text-white")}>
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

// Each client as a circle: its square app icon, or a mark cropped from its
// logo, on a background that suits it. Clients we've written up link to the
// write-up; the rest link to their own site.
const CLIENTS: { name: string; bg: string; src: string; size: string; href: string }[] = [
    { name: "Cisco", bg: "#ffffff", src: "/logos/mark-cisco.png", size: "0.6em", href: "https://www.cisco.com" },
    { name: "Investcorp", bg: "#ffffff", src: "/logos/mark-investcorp.png", size: "0.82em", href: "/projects/investcorp/" },
    { name: "QuickFi", bg: "#ffffff", src: "/logos/mark-quickfi.svg", size: "0.6em", href: "/projects/quickfi/" },
    { name: "Charter", bg: "#ffffff", src: "/logos/mark-charter.png", size: "0.42em", href: "https://corporate.charter.com" },
    { name: "Vero", bg: "#0e0e0e", src: "/logos/mark-vero.png", size: "0.48em", href: "https://www.vero-technologies.com" },
    { name: "Bridge", bg: "#ffffff", src: "/logos/mark-bridge.svg", size: "0.56em", href: "/projects/bridge/" },
    { name: "Gradial", bg: "#f6c9d4", src: "/logos/mark-gradial.svg", size: "0.38em", href: "https://www.gradial.com" },
    { name: "NYSFP", bg: "#ffffff", src: "/logos/mark-nysfp.png", size: "0.56em", href: "https://nysfoodprocessors.org" },
];

export function ClientStack() {
    return (
        <Stack>
            {CLIENTS.map((c) => {
                const img = <img src={c.src} alt="" style={{ maxWidth: c.size, maxHeight: c.size }} className="object-contain" />;
                const cls = cn(circle, "overflow-hidden");
                return c.href.startsWith("/") ? (
                    <Link key={c.name} href={c.href} title={`${c.name}: read the write-up`} aria-label={`${c.name} write-up`} className={cls} style={{ background: c.bg }}>
                        {img}
                    </Link>
                ) : (
                    <a key={c.name} href={c.href} target="_blank" rel="noopener noreferrer" title={c.name} aria-label={`${c.name} website`} className={cls} style={{ background: c.bg }}>
                        {img}
                    </a>
                );
            })}
        </Stack>
    );
}

export function OpenSourceStack() {
    return (
        <Stack>
            <a href="https://github.com/jundot/omlx" target="_blank" rel="noopener noreferrer" title="oMLX" aria-label="oMLX on GitHub" className={cn(circle, "bg-[#1e1e1e]")}>
                <img src="/logos/mlx.png" alt="" className="max-w-[0.46em] object-contain" />
            </a>
            <a href="https://pollen-robotics.com" target="_blank" rel="noopener noreferrer" title="Pollen Robotics" aria-label="Pollen Robotics website" className={cn(circle, "bg-[#f3f0ea]")}>
                <img src="/logos/pollen.svg" alt="" className="max-h-[0.5em] object-contain" />
            </a>
        </Stack>
    );
}
