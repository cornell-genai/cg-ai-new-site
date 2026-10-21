"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Mark from "./Mark";
import { cn } from "@/lib/utils";

const LINKS = [
    { href: "/work", label: "Work" },
    { href: "/team", label: "Team" },
];

export default function Nav() {
    const pathname = usePathname().replace(/(.)\/$/, "$1");
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => setOpen(false), [pathname]);

    return (
        <>
            <header
                className={cn(
                    "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500",
                    scrolled || open ? "bg-paper/80 backdrop-blur-xl border-b border-line" : "border-b border-transparent",
                )}
            >
                <nav className="mx-auto flex h-14 items-center justify-between px-4 md:px-6">
                    <Link href="/" className="group flex items-center gap-2.5" aria-label="Cornell GenAI home">
                        <Mark animated className="size-[18px] text-ink" />
                        <span className="text-[15px] font-semibold tracking-[-0.02em]">Cornell GenAI</span>
                    </Link>

                    <div className="hidden items-center gap-1 md:flex">
                        {LINKS.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                className={cn(
                                    "relative isolate rounded-full px-3.5 py-1.5 text-[14px] tracking-[-0.01em] transition-colors",
                                    pathname === l.href ? "text-ink" : "text-ink-2 hover:text-ink",
                                )}
                            >
                                {pathname === l.href && (
                                    <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-paper-2" transition={{ type: "spring", bounce: 0.15, duration: 0.5 }} />
                                )}
                                {l.label}
                            </Link>
                        ))}
                        <Link
                            href="/apply"
                            className="group ml-2 inline-flex items-center gap-2 rounded-full bg-ink py-1.5 pl-4 pr-3 text-[14px] tracking-[-0.01em] text-paper transition-colors hover:bg-ember"
                        >
                            Apply
                            <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                        </Link>
                    </div>

                    <button
                        onClick={() => setOpen((o) => !o)}
                        className="label flex h-9 items-center rounded-full border border-line px-3.5 md:hidden"
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                    >
                        {open ? "Close" : "Menu"}
                    </button>
                </nav>
            </header>

            <AnimatePresence>
                {open && (
                    <motion.div
                        id="mobile-menu"
                        initial={{ clipPath: "inset(0 0 100% 0)" }}
                        animate={{ clipPath: "inset(0 0 0% 0)" }}
                        exit={{ clipPath: "inset(0 0 100% 0)" }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 z-40 flex flex-col justify-between bg-paper px-4 pb-8 pt-24 md:hidden"
                    >
                        <ul className="space-y-1">
                            {[{ href: "/", label: "Home" }, ...LINKS, { href: "/apply", label: "Apply" }].map((l, i) => (
                                <li key={l.href} className="overflow-hidden">
                                    <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.05 }}>
                                        <Link href={l.href} className="display flex items-baseline justify-between py-1 text-[15vw]">
                                            {l.label}
                                            <span className="label text-ink-3">0{i + 1}</span>
                                        </Link>
                                    </motion.div>
                                </li>
                            ))}
                        </ul>
                        <div className="label text-ink-3">Generative AI at Cornell</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
