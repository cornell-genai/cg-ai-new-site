"use client";

import { useEffect, useRef, useState } from "react";
import { TeamCard } from "./TeamGrid";
import type { Member } from "@/lib/data";

type Group = { id: string; title: string; members: Member[] };

const GLYPHS = "-\\|/+:#*=";

// A word that glitches into the next: a band of ASCII noise sweeps left to
// right, leaving the new word behind it.
function GlitchWord({ text }: { text: string }) {
    const [shown, setShown] = useState(text);
    const prev = useRef(text);

    useEffect(() => {
        const from = prev.current;
        prev.current = text;
        if (from === text) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setShown(text);
        const len = Math.max(from.length, text.length);
        const t0 = performance.now();
        let raf = 0;
        const tick = (t: number) => {
            const p = Math.min(1, (t - t0) / 560) * 1.3; // band front; its back edge trails by 0.3
            let s = "";
            for (let i = 0; i < len; i++) {
                const x = i / len;
                s += x < p - 0.3 ? (text[i] ?? " ") : x < p ? GLYPHS[(Math.random() * GLYPHS.length) | 0] : (from[i] ?? " ");
            }
            setShown(s.trimEnd());
            if (p < 1.3) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [text]);

    return (
        <>
            <span aria-hidden className="whitespace-pre">{shown}</span>
            <span className="sr-only">{text}</span>
        </>
    );
}

const word = "font-medium leading-[0.85] tracking-[-0.05em] text-fg";

// The left column holds one word, the group in view on the right.
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

    return (
        // lg: two capped columns side by side. xl: the word is centered in the left 20% of the page and the
        // cards fill the remaining 80%, inset by a margin that grows with the screen.
        <div className="grid gap-14 lg:grid-cols-[minmax(20rem,26rem)_minmax(0,58rem)] lg:gap-16 xl:grid-cols-[20%_80%] xl:gap-0">
            <h1 className="sr-only">Team</h1>
            {/* Stretches to the grid's full height so the word stays pinned to the end. */}
            <aside aria-live="polite" className="hidden lg:block">
                <p className={`sticky top-32 text-[clamp(3rem,4vw,5rem)] xl:text-center ${word}`}>
                    <GlitchWord text={groups[active].title} />
                </p>
            </aside>

            <div className="flex flex-col gap-24 xl:px-[clamp(4.75rem,9vw,11.75rem)]">
                {groups.map((g, i) => (
                    <section key={g.id} id={g.id} data-index={i} ref={(el) => { refs.current[i] = el; }} className="scroll-mt-32">
                        {/* No sticky column on small screens, so each group carries its own word. */}
                        <h2 className={`mb-8 text-[clamp(2.75rem,12vw,4rem)] lg:hidden ${word}`}>{g.title}</h2>
                        <ul className="grid grid-cols-3 gap-x-3 gap-y-8 sm:grid-cols-4 sm:gap-x-5 sm:gap-y-10">
                            {g.members.map((m, j) => <TeamCard key={m.name} m={m} index={j} />)}
                        </ul>
                        {/* Hairline between groups, closer to the cards above than to the next group. */}
                        {i < groups.length - 1 && <hr className="mt-12 border-bone/15" />}
                    </section>
                ))}
            </div>
        </div>
    );
}
