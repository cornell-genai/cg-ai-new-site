"use client";

import { useEffect, useRef, useState } from "react";
import Scramble from "./Scramble";
import { TeamCard } from "./TeamGrid";
import { cn } from "@/lib/utils";
import type { Member } from "@/lib/data";

type Group = { id: string; title: string; members: Member[] };

// 3×5 pixel digits for the counter.
const DIGITS = ["111101101101111", "010110010010111", "111001111100111", "111001111001111", "101101111001001", "111100111001111", "111100111101111", "111001001001001", "111101111101111", "111101111001111"];

// Two digits on a 7×5 grid of cells (3 + gap + 3). Lit cells are red; when
// the number changes they ripple over diagonally, like the mark assembling.
function PixelCount({ n }: { n: number }) {
    const [a, b] = String(Math.min(99, n)).padStart(2, "0").split("").map(Number);
    const lit = (x: number, y: number) => (x < 3 ? DIGITS[a][y * 3 + x] : x > 3 ? DIGITS[b][y * 3 + x - 4] : "0") === "1";
    return (
        <div aria-hidden className="grid w-max grid-cols-7 gap-[3px]">
            {Array.from({ length: 35 }, (_, i) => {
                const x = i % 7, y = Math.floor(i / 7);
                return (
                    <span
                        key={i}
                        className={cn("size-[13px] transition-colors duration-300", lit(x, y) ? "bg-red" : "bg-bone/[0.06]")}
                        style={{ transitionDelay: `${(x + y) * 28}ms` }}
                    />
                );
            })}
        </div>
    );
}

// Sticky index on the left tracks which group is in view on the right.
export default function TeamSections({ groups }: { groups: Group[] }) {
    const [active, setActive] = useState(0);
    const refs = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        // A group is "current" once it crosses a line ~40% down the viewport.
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
            },
            { rootMargin: "-40% 0px -59% 0px" },
        );
        refs.current.forEach((el) => el && io.observe(el));
        return () => io.disconnect();
    }, []);

    const current = groups[active];

    return (
        <div className="grid gap-14 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20">
            {/* The aside stretches to the grid's full height, so its sticky part holds to the very end. */}
            <aside>
                <h1 className="text-[clamp(3rem,5vw,4.5rem)] font-medium leading-[0.9] tracking-[-0.05em] text-fg">The team</h1>

                <div className="hidden lg:sticky lg:top-28 lg:block lg:pt-12">
                    <PixelCount n={current.members.length} />
                    <p className="mt-5 text-[22px] font-medium tracking-[-0.02em] text-fg">
                        <Scramble key={current.id} text={current.title} duration={520} auto />
                    </p>

                <ol className="mt-10 border-t border-bone/12">
                    {groups.map((g, i) => (
                        <li key={g.id}>
                            <button
                                onClick={() => refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" })}
                                className={cn(
                                    "flex w-full items-center gap-3 border-b border-bone/12 py-3 text-left font-mono text-[12px] uppercase tracking-[0.08em] transition-colors",
                                    i === active ? "text-fg" : "text-bone/40 hover:text-bone/70",
                                )}
                            >
                                <span className={cn("size-[7px] shrink-0 bg-red transition-transform duration-300", i === active ? "scale-100" : "scale-0")} />
                                <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                                <span className="flex-1">{g.title}</span>
                                <span className="tabular-nums opacity-60">{String(g.members.length).padStart(2, "0")}</span>
                            </button>
                        </li>
                    ))}
                </ol>
                </div>
            </aside>

            <div className="flex flex-col gap-24">
                {groups.map((g, i) => (
                    <section key={g.id} id={g.id} data-index={i} ref={(el) => { refs.current[i] = el; }} className="scroll-mt-32">
                        {/* On small screens there's no sticky index, so each group labels itself. */}
                        <h2 className="mb-6 flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.08em] text-bone/50 lg:hidden">
                            <span className="size-[7px] bg-red" />
                            {g.title}
                            <span className="opacity-60">{String(g.members.length).padStart(2, "0")}</span>
                        </h2>
                        <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3">
                            {g.members.map((m, j) => <TeamCard key={m.name} m={m} index={j} />)}
                        </ul>
                    </section>
                ))}
            </div>
        </div>
    );
}
