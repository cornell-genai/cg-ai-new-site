"use client";

import Link from "next/link";
import { CURRENT } from "@/lib/data";
import { cn } from "@/lib/utils";

// Inline marks scale with the editorial paragraph. Keep links at least 24px
// and non-overlapping, without turning the logo stacks into separate rows.

function Stack({ children, className }: { children: React.ReactNode; className?: string }) {
    return <span className={cn("inline-flex flex-wrap items-center gap-1.5 align-[-0.04em]", className)}>{children}</span>;
}

const circle =
    "relative inline-flex size-[max(24px,0.82em)] shrink-0 items-center justify-center rounded-full ring-1 ring-bone/15";

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
                <span key={p.slug} title={p.title} aria-hidden className={cn(circle, "bg-[#2a2a2a] text-[#f3f0ea] light:bg-[#e4e1da] light:text-[#161514]")}>
                    <svg viewBox="0 0 7 7" className="h-[0.4em] w-[0.4em]" shapeRendering="crispEdges" aria-hidden>
                        {(ICONS[p.slug] ?? ICONS["long-horizon-agents"]).flatMap((r, y) =>
                            [...r].map((c, x) => (c === "#" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" /> : null)),
                        )}
                    </svg>
                </span>
            ))}
        </Stack>
    );
}

// Each client as a circle: its square app icon, or a mark cropped from its
// logo, on a background that suits it. Clients we've written up link to the
// write-up; the rest link to their own site.
const CLIENTS: { name: string; bg: string; src: string; size: string; href: string }[] = [
    { name: "Investcorp", bg: "#ffffff", src: "/logos/mark-investcorp.png", size: "0.82em", href: "/projects/investcorp/" },
    { name: "QuickFi", bg: "#ffffff", src: "/logos/mark-quickfi.svg", size: "0.6em", href: "/projects/quickfi/" },
    { name: "Charter", bg: "#ffffff", src: "/logos/mark-charter.png", size: "0.42em", href: "https://corporate.charter.com" },
    { name: "Bridge", bg: "#ffffff", src: "/logos/mark-bridge.svg", size: "0.56em", href: "/projects/bridge/" },
    { name: "NYSFP", bg: "#ffffff", src: "/logos/mark-nysfp.png", size: "0.56em", href: "https://nysfoodprocessors.org" },
    { name: "Marketing + Media Alliance", bg: "#000000", src: "/logos/mark-mma.png", size: "0.9em", href: "https://mma.org" },
];

export function ClientStack() {
    return (
        <Stack>
            {CLIENTS.map((c) => {
                const img = <img src={c.src} alt="" width="32" height="32" loading="lazy" style={{ maxWidth: c.size, maxHeight: c.size }} className="object-contain" />;
                const cls = cn(circle, "overflow-hidden hover:ring-red");
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
            <a href="https://github.com/jundot/omlx" target="_blank" rel="noopener noreferrer" title="oMLX" aria-label="oMLX on GitHub" className={cn(circle, "bg-[#1e1e1e] hover:ring-red")}>
                <img src="/logos/mlx.png" alt="" width="24" height="24" loading="lazy" className="max-w-[0.6em] object-contain" />
            </a>
            <a href="https://pollen-robotics.com" target="_blank" rel="noopener noreferrer" title="Pollen Robotics" aria-label="Pollen Robotics website" className={cn(circle, "bg-[#f3f0ea] hover:ring-red")}>
                <img src="/logos/pollen.svg" alt="" width="24" height="24" loading="lazy" className="max-h-[0.65em] object-contain" />
            </a>
        </Stack>
    );
}
