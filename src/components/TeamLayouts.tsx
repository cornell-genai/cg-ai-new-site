"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Member, Team } from "@/lib/data";

// Three candidate team layouts, switchable with ?layout=directory|index|wall.
// ?mock fills empty frames with existing photos to preview a full roster.

const caption = (m: Member) => m.role ?? (m.team === "Members" ? undefined : m.team === "Business" ? "Business" : m.team === "Alumni" ? "Alumni" : undefined);

function Photo({ m, className }: { m: Member; className?: string }) {
    return (
        <div className={cn("relative overflow-hidden bg-night-2 ring-1 ring-inset ring-bone/10", className)}>
            {m.image && <img src={m.image} alt={m.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
        </div>
    );
}

function Wrap({ m, className, children }: { m: Member; className?: string; children: React.ReactNode }) {
    return m.linkedIn ? (
        <a href={m.linkedIn} target="_blank" rel="noopener noreferrer" className={cn("group block", className)}>{children}</a>
    ) : (
        <div className={cn("group block", className)}>{children}</div>
    );
}

// A. One uniform grid; filter chips instead of sections.
function Directory({ members }: { members: Member[] }) {
    const FILTERS: ("All" | Team)[] = ["All", "Board", "Members", "Business", "Alumni"];
    const [f, setF] = useState<(typeof FILTERS)[number]>("All");
    const shown = members.filter((m) => (f === "All" ? m.team !== "Alumni" : m.team === f));
    return (
        <>
            <div className="mb-10 flex flex-wrap gap-2">
                {FILTERS.map((x) => (
                    <button
                        key={x}
                        onClick={() => setF(x)}
                        className={cn("border px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.06em] transition-colors", f === x ? "border-bone bg-bone text-night" : "border-bone/20 text-bone/60 hover:border-bone/50 hover:text-bone")}
                    >
                        {x === "All" ? "Everyone" : x} <span className="opacity-50">{x === "All" ? members.filter((m) => m.team !== "Alumni").length : members.filter((m) => m.team === x).length}</span>
                    </button>
                ))}
            </div>
            <motion.ul layout className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
                <AnimatePresence mode="popLayout">
                    {shown.map((m) => (
                        <motion.li key={m.name} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                            <Wrap m={m}>
                                <Photo m={m} className="aspect-[4/5]" />
                                <p className="mt-3 text-[15px] tracking-[-0.015em] transition-colors group-hover:text-red">{m.name}</p>
                                {caption(m) && <p className="text-[13px] text-bone/50">{caption(m)}</p>}
                            </Wrap>
                        </motion.li>
                    ))}
                </AnimatePresence>
            </motion.ul>
        </>
    );
}

// B. Editorial index: a large sticky portrait, every name in columns beside it.
function Index({ members }: { members: Member[] }) {
    const current = members.filter((m) => m.team !== "Alumni");
    const alumni = members.filter((m) => m.team === "Alumni");
    const [active, setActive] = useState<Member>(current[0]);
    const Row = ({ m }: { m: Member }) => (
        <li onPointerEnter={() => setActive(m)}>
            <Wrap m={m} className="flex items-baseline justify-between gap-3 border-b border-bone/10 py-2.5">
                <span className={cn("text-[16px] tracking-[-0.015em] transition-colors", active === m ? "text-red" : "group-hover:text-red")}>{m.name}</span>
                {caption(m) && <span className="shrink-0 text-[12px] text-bone/45">{caption(m)}</span>}
            </Wrap>
        </li>
    );
    return (
        <div className="grid gap-10 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-14">
            <div className="hidden md:block">
                <div className="sticky top-28">
                    <Photo m={active} className="aspect-[4/5]" />
                    <p className="mt-4 text-[22px] font-medium tracking-[-0.02em]">{active.name}</p>
                    <p className="text-[15px] text-bone/50">{caption(active) ?? "Member"}</p>
                </div>
            </div>
            <div>
                <ul className="columns-1 gap-8 sm:columns-2 lg:columns-3 [&>li]:break-inside-avoid">
                    {current.map((m) => <Row key={m.name} m={m} />)}
                </ul>
                <p className="mb-2 mt-14 font-mono text-[12px] uppercase tracking-[0.08em] text-bone/40">Alumni</p>
                <ul className="columns-1 gap-8 sm:columns-2 lg:columns-3 [&>li]:break-inside-avoid">
                    {alumni.map((m) => <Row key={m.name} m={m} />)}
                </ul>
            </div>
        </div>
    );
}

// C. Wall: a tight mosaic of square portraits; name and role on hover.
function Wall({ members }: { members: Member[] }) {
    return (
        <ul className="grid grid-cols-3 gap-[3px] sm:grid-cols-5 lg:grid-cols-7">
            {members.map((m) => (
                <li key={m.name}>
                    <Wrap m={m} className="relative">
                        <Photo m={m} className="aspect-square ring-0" />
                        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/75 via-black/10 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-md:opacity-100">
                            <p className="text-[14px] font-medium leading-tight text-white">{m.name}</p>
                            {caption(m) && <p className="text-[12px] text-white/65">{caption(m)}</p>}
                        </div>
                    </Wrap>
                </li>
            ))}
        </ul>
    );
}

export default function TeamLayouts({ members }: { members: Member[] }) {
    const [layout, setLayout] = useState("directory");
    const [list, setList] = useState(members);
    useEffect(() => {
        const q = new URLSearchParams(location.search);
        setLayout(q.get("layout") ?? "directory");
        if (q.has("mock")) {
            const pics = members.flatMap((m) => (m.image ? [m.image] : []));
            setList(members.map((m, i) => ({ ...m, image: m.image ?? pics[i % pics.length] })));
        }
    }, [members]);
    if (layout === "index") return <Index members={list} />;
    if (layout === "wall") return <Wall members={list} />;
    return <Directory members={list} />;
}
