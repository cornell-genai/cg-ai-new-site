"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lockup } from "./Mark";

const LINKS = [
    { href: "/projects", label: "Projects" },
    { href: "/team", label: "Team" },
];

export default function Nav() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        document.documentElement.style.overflow = open ? "hidden" : "";
    }, [open]);

    return (
        <header className="sticky top-0 z-50 border-b border-bone/10 bg-night text-bone">
            <nav className="flex h-16 items-center justify-between px-5">
                <Link href="/" aria-label="Cornell GenAI home">
                    <Lockup />
                </Link>
                <div className="hidden items-center gap-8 md:flex">
                    {LINKS.map((l) => (
                        <Link key={l.href} href={l.href} className="text-[15px] text-bone/60 transition-colors hover:text-bone">
                            {l.label}
                        </Link>
                    ))}
                    <Link href="/get-involved" className="border border-bone/25 px-4 py-2 text-[15px] transition-colors hover:border-bone hover:bg-bone hover:text-night">
                        Get Involved
                    </Link>
                </div>
                <button onClick={() => setOpen((o) => !o)} className="text-[15px] text-bone/70 md:hidden" aria-expanded={open}>
                    {open ? "Close" : "Menu"}
                </button>
            </nav>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-x-0 bottom-0 top-16 bg-night px-5 pt-8 md:hidden"
                    >
                        {[...LINKS, { href: "/get-involved", label: "Get Involved" }].map((l) => (
                            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block border-b border-bone/10 py-4 text-[28px] tracking-[-0.03em]">
                                {l.label}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
