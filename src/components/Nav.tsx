"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lockup } from "./Mark";
import ThemeToggle from "./ThemeToggle";
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
            data-theme-scope={path === "/team" ? "light" : undefined}
            className={cn(
                "fixed inset-x-0 top-0 z-50 text-bone transition-colors duration-300",
                scrolled || open ? "bg-night/95" : "bg-transparent",
            )}
        >
            <nav className="flex h-16 items-center justify-between px-5 md:px-6">
                <Link href="/" aria-label="Cornell Generative AI home" data-swarm-avoid>
                    <Lockup />
                </Link>
                <div data-swarm-avoid className="hidden items-center gap-7 md:flex">
                    {LINKS.map((l) => (
                        <Link key={l.href} href={l.href} className={cn("flex items-center gap-2 text-[15px] transition-colors", path === l.href ? "text-bone" : "text-bone/55 hover:text-bone")}>
                            <span className={cn("size-[5px] bg-red transition-opacity", path === l.href ? "opacity-100" : "opacity-0")} />
                            {l.label}
                        </Link>
                    ))}
                    <ThemeToggle className="text-bone/55 hover:text-bone" />
                    <Link href="/get-involved" className="bg-red px-4 py-2 text-[15px] font-medium text-white transition-colors hover:bg-bone hover:text-night">
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
                        <ThemeToggle label className="mt-8 text-[17px] text-bone/60" />
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
