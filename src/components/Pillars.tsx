"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type Pillar = { title: string; body: string; cta?: { href: string; label: string } };

// Numbered list that opens one item at a time as the section scrolls past
// (pinned on desktop). On small screens nothing pins, so every item stays open.
export default function Pillars({ heading, items, aside }: { heading: React.ReactNode; items: Pillar[]; aside: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(0);
    const [pinned, setPinned] = useState(true);
    useEffect(() => {
        const mq = window.matchMedia("(min-width: 768px)");
        const sync = () => setPinned(mq.matches);
        sync();
        mq.addEventListener("change", sync);
        return () => mq.removeEventListener("change", sync);
    }, []);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
    useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(items.length - 1, Math.floor(v * items.length))));

    return (
        <section ref={ref} className="relative bg-night text-bone md:h-[300vh]">
            <div className="grid grid-cols-1 gap-12 px-5 py-20 md:sticky md:top-16 md:h-[calc(100svh-4rem)] md:grid-cols-2 md:items-center md:gap-16 md:px-[6vw] md:py-0">
                <div>
                    <h2 className="mb-10 max-w-[13em] text-[clamp(2.25rem,4vw,3.75rem)] font-medium leading-[1.02] tracking-[-0.04em]">{heading}</h2>
                    <ol className="max-w-xl">
                        {items.map((it, i) => {
                            const open = !pinned || i === active;
                            return (
                                <li key={it.title} className="border-t border-bone/15 last:border-b">
                                    <button
                                        type="button"
                                        onClick={() => setActive(i)}
                                        className="grid w-full grid-cols-[3.5rem_1fr] items-baseline py-5 text-left"
                                    >
                                        <span className={cn("font-mono text-[12px] transition-colors", open ? "text-bone" : "text-bone/40")}>0{i + 1}</span>
                                        <span className={cn("text-[21px] tracking-[-0.02em] transition-colors", open ? "text-bone" : "text-bone/55 md:hover:text-bone/80")}>{it.title}</span>
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {(open || undefined) && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pb-6 pl-14">
                                                    <p className="max-w-md text-[16px] leading-relaxed text-bone/75">{it.body}</p>
                                                    {it.cta && (
                                                        <Link href={it.cta.href} className="mt-5 inline-block border border-bone/25 px-4 py-2 text-[14px] transition-colors hover:border-bone hover:bg-bone hover:text-night">
                                                            {it.cta.label}
                                                        </Link>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </li>
                            );
                        })}
                    </ol>
                </div>
                <div className="relative">{aside}</div>
            </div>
        </section>
    );
}
