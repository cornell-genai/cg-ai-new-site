"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import type { Project } from "@/lib/data";

// Index rows; hovering one floats a preview that trails the cursor.
export default function WorkIndex({ projects }: { projects: Project[] }) {
    const [active, setActive] = useState<number | null>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 260, damping: 30, mass: 0.6 });
    const sy = useSpring(y, { stiffness: 260, damping: 30, mass: 0.6 });

    return (
        <div
            className="relative"
            onPointerMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                x.set(e.clientX - r.left);
                y.set(e.clientY - r.top);
            }}
            onPointerLeave={() => setActive(null)}
        >
            <ul className="border-t border-line">
                {projects.map((p, i) => (
                    <li key={p.slug} onPointerEnter={() => setActive(i)} className="border-b border-line">
                        <Link
                            href={`/work#${p.slug}`}
                            className="group grid grid-cols-12 items-baseline gap-x-4 gap-y-1 py-6 md:py-8"
                        >
                            <span className="label col-span-2 text-ink-3 md:col-span-1">0{i + 1}</span>
                            <span className="col-span-10 text-[clamp(1.75rem,4vw,3.5rem)] font-medium leading-none tracking-[-0.04em] transition-transform duration-500 ease-out-expo group-hover:translate-x-2 md:col-span-6">
                                {p.title}
                            </span>
                            <span className="label col-span-10 col-start-3 text-ink-2 md:col-span-2 md:col-start-auto">{p.partner}</span>
                            <span className="label hidden text-ink-3 md:col-span-2 md:block">{p.kind}</span>
                            <span className="label hidden items-center justify-end gap-2 text-ink-2 md:col-span-1 md:flex">
                                <span className={p.status === "Shipped" ? "size-1.5 bg-ink" : "size-1.5 animate-pulse bg-ember"} />
                                {p.term}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>

            <motion.div
                aria-hidden
                style={{ x: sx, y: sy }}
                className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block"
            >
                <AnimatePresence>
                    {active !== null && (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="relative -ml-[150px] -mt-[110px] h-[220px] w-[300px] overflow-hidden rounded-xl bg-paper-2 shadow-2xl shadow-ink/20"
                        >
                            {projects.map((p, i) => (
                                <img
                                    key={p.slug}
                                    src={p.image}
                                    alt=""
                                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
                                    style={{ opacity: i === active ? 1 : 0 }}
                                />
                            ))}
                            <div className="halftone absolute inset-0 opacity-20 mix-blend-multiply" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
