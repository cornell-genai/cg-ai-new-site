"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useState } from "react";
import Scramble from "./Scramble";
import { cn } from "@/lib/utils";
import type { Member } from "@/lib/data";

// Members as a grid of names: the board large with roles, everyone else in
// dense columns. Hovering a member with a photo floats it beside the cursor.
export default function TeamList({ groups }: { groups: { title: string; members: Member[]; featured?: boolean }[] }) {
    const [img, setImg] = useState<string | null>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 300, damping: 30 });
    const sy = useSpring(y, { stiffness: 300, damping: 30 });

    return (
        <div
            onPointerMove={(e) => { x.set(e.clientX + 24); y.set(e.clientY - 80); }}
            onPointerLeave={() => setImg(null)}
        >
            {groups.map((g) => (
                <section key={g.title} className="mb-20 last:mb-0">
                    <h2 className="mb-5 flex items-baseline gap-3 font-mono text-[12px] uppercase tracking-[0.08em] text-bone/45">
                        <Scramble text={g.title} duration={380} />
                        <span className="text-bone/30">{String(g.members.length).padStart(2, "0")}</span>
                    </h2>
                    <ul className={cn("grid gap-x-8", g.featured ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" : "grid-cols-2 md:grid-cols-4")}>
                        {g.members.map((m) => {
                            const Tag = m.linkedIn ? "a" : "div";
                            return (
                                <li key={m.name} className="border-t border-bone/12" onPointerEnter={() => setImg(m.image ?? null)}>
                                    <Tag
                                        {...(m.linkedIn ? { href: m.linkedIn, target: "_blank", rel: "noopener noreferrer" } : {})}
                                        className={cn("group block", g.featured ? "py-6" : "py-3.5")}
                                    >
                                        <span className={cn("block tracking-[-0.015em] transition-colors group-hover:text-red", g.featured ? "text-[22px] font-medium" : "text-[16px]")}>
                                            {m.name}
                                            {m.linkedIn && <span className="ml-1.5 text-[0.75em] text-bone/40 opacity-0 transition-opacity group-hover:opacity-100">↗</span>}
                                        </span>
                                        {m.role && <span className={cn("block text-bone/50", g.featured ? "mt-1 text-[15px]" : "text-[13px]")}>{m.role}</span>}
                                    </Tag>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            ))}
            <motion.div style={{ x: sx, y: sy }} className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block">
                <AnimatePresence>
                    {img && (
                        <motion.img
                            key={img}
                            src={img}
                            alt=""
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.92 }}
                            transition={{ duration: 0.2 }}
                            className="absolute h-40 w-32 object-cover"
                        />
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
