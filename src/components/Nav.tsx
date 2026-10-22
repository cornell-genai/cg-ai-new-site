"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lockup } from "./Mark";
import Scramble from "./Scramble";
import { cn } from "@/lib/utils";

const LINKS = [
    { href: "/projects", label: "Projects" },
    { href: "/team", label: "Team" },
];

export default function Nav() {
    const path = usePathname().replace(/(.)\/$/, "$1");
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => setOpen(false), [path]);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed inset-x-0 top-0 z-50 text-bone transition-colors duration-300",
                scrolled || open ? "bg-night/85 backdrop-blur-md" : "bg-transparent",
            )}
        >
            <nav className="flex h-16 items-center justify-between px-5 md:px-6">
                <Link href="/" aria-label="Cornell GenAI home" data-swarm-avoid>
                    <Lockup />
                </Link>
                <div data-swarm-avoid className="hidden items-center gap-7 md:flex">
                    {LINKS.map((l) => (
                        <Link key={l.href} href={l.href} className={cn("flex items-center gap-2 text-[15px] transition-colors", path === l.href ? "text-bone" : "text-bone/55 hover:text-bone")}>
                            <span className={cn("size-[5px] bg-red transition-opacity", path === l.href ? "opacity-100" : "opacity-0")} />
                            <Scramble text={l.label} duration={320} />
                        </Link>
                    ))}
                    <Link href="/get-involved" className="bg-red px-4 py-2 text-[15px] font-medium text-bone transition-colors hover:bg-bone hover:text-night">
                        Get involved
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
                        transition={{ duration: 0.2 }}
                        className="h-[calc(100svh-4rem)] bg-night px-5 pt-6 md:hidden"
                    >
                        {[{ href: "/", label: "Home" }, ...LINKS, { href: "/get-involved", label: "Get involved" }].map((l) => (
                            <Link key={l.href} href={l.href} className="flex items-center gap-3 border-b border-bone/10 py-4 text-[30px] tracking-[-0.03em]">
                                <span className={cn("size-2 bg-red", path === l.href ? "opacity-100" : "opacity-0")} />
                                {l.label}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
