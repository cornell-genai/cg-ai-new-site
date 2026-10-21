"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useState } from "react";
import { Group } from "./SubPage";
import type { Member } from "@/lib/data";

// Name / role rows. Hovering a member with a photo floats it beside the cursor.
export default function TeamList({ groups }: { groups: { title?: string; members: Member[]; showRole?: boolean }[] }) {
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
                <Group key={g.title ?? "lead"} title={g.title}>
                    {g.members.map((m) => {
                        const Tag = m.linkedIn ? "a" : "div";
                        return (
                            <li key={m.name} className="border-b border-bone/12" onPointerEnter={() => setImg(m.image ?? null)}>
                                <Tag
                                    {...(m.linkedIn ? { href: m.linkedIn, target: "_blank", rel: "noopener noreferrer" } : {})}
                                    className="group flex items-baseline justify-between gap-6 py-5"
                                >
                                    <span className="text-[19px] tracking-[-0.015em] transition-colors group-hover:text-red">
                                        {m.name}
                                        {m.linkedIn && <span className="ml-2 text-[13px] text-bone/50 opacity-0 transition-opacity group-hover:opacity-100">LinkedIn ↗</span>}
                                    </span>
                                    {g.showRole !== false && <span className="shrink-0 text-right text-[15px] text-bone/50">{m.role}</span>}
                                </Tag>
                            </li>
                        );
                    })}
                </Group>
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
