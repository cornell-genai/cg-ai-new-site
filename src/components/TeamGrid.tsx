"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Portrait from "./Portrait";
import { MEMBERS, TEAMS, type Team } from "@/lib/data";
import { cn } from "@/lib/utils";

const FILTERS: ("All" | Team)[] = ["All", ...TEAMS];

export default function TeamGrid() {
    const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
    const members = filter === "All" ? MEMBERS : MEMBERS.filter((m) => m.team === filter);

    return (
        <div>
            <div className="mb-10 flex flex-wrap items-center gap-1" role="tablist">
                {FILTERS.map((f) => {
                    const count = f === "All" ? MEMBERS.length : MEMBERS.filter((m) => m.team === f).length;
                    return (
                        <button
                            key={f}
                            role="tab"
                            aria-selected={filter === f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "relative isolate rounded-full px-4 py-2 text-[14px] tracking-[-0.01em] transition-colors",
                                filter === f ? "text-paper" : "text-ink-2 hover:text-ink",
                            )}
                        >
                            {filter === f && (
                                <motion.span layoutId="team-pill" className="absolute inset-0 -z-10 rounded-full bg-ink" transition={{ type: "spring", bounce: 0.15, duration: 0.5 }} />
                            )}
                            {f} <span className="label ml-1 opacity-50">{count}</span>
                        </button>
                    );
                })}
            </div>

            <motion.ul layout className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                <AnimatePresence mode="popLayout" initial={false}>
                    {members.map((m, i) => {
                        const Wrapper = m.linkedIn ? "a" : "div";
                        return (
                            <motion.li
                                key={m.name}
                                layout
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: Math.min(i, 12) * 0.025 } }}
                                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                            >
                                <Wrapper
                                    {...(m.linkedIn ? { href: m.linkedIn, target: "_blank", rel: "noopener noreferrer" } : {})}
                                    className="group block"
                                >
                                    <Portrait member={m} className="aspect-[4/5] rounded-[12px]" />
                                    <div className="mt-3 flex items-start justify-between gap-2">
                                        <div>
                                            <h3 className="text-[16px] font-medium leading-tight tracking-[-0.02em]">{m.name}</h3>
                                            <p className="label mt-1 text-ink-3">{m.role}</p>
                                        </div>
                                        {m.linkedIn && (
                                            <span className="label mt-0.5 text-ink-3 transition-colors group-hover:text-ember">in ↗</span>
                                        )}
                                    </div>
                                </Wrapper>
                            </motion.li>
                        );
                    })}
                </AnimatePresence>
            </motion.ul>
        </div>
    );
}
