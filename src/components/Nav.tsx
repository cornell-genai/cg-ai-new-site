"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Lockup } from "./Mark";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";

const LINKS = [
    { href: "/projects", label: "Projects" },
    { href: "/team", label: "Team" },
];

export default function Nav() {
    const route = usePathname().replace(/(.)\/$/, "$1");
    const path = route === "/portfolio" ? "/projects" : route === "/apply" ? "/get-involved" : route;
    const dialog = useRef<HTMLDialogElement>(null);
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const active = (href: string) => path === href || path.startsWith(`${href}/`);
    const close = () => dialog.current?.close();

    useEffect(() => { dialog.current?.close(); }, [path]);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        const desktop = window.matchMedia("(min-width: 48rem)");
        const onResize = () => { if (desktop.matches) dialog.current?.close(); };
        desktop.addEventListener("change", onResize);
        return () => {
            window.removeEventListener("scroll", onScroll);
            desktop.removeEventListener("change", onResize);
        };
    }, []);
    useEffect(() => {
        if (!open) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = previous; };
    }, [open]);

    return (
        <>
            <a href="#main-content" className="skip-link fixed start-5 top-3 z-[60] flex min-h-11 -translate-y-24 items-center bg-night px-4 text-[15px] font-medium text-fg focus:translate-y-0">
                Skip to content
            </a>
            <header
                className={cn("site-header fixed inset-x-0 top-0 z-50 text-bone", scrolled || path === "/get-involved" ? "bg-night/95 backdrop-blur-md" : "bg-transparent")}
            >
                <nav aria-label="Primary" className="site-nav flex min-h-16 items-center justify-between gap-3 px-5 md:[--gutter:1.5rem]">
                    <Link href="/" aria-label="Cornell Generative AI home" className="flex min-h-11 items-center" data-swarm-avoid>
                        <Lockup />
                    </Link>
                    <div data-swarm-avoid className="hidden items-center gap-6 md:flex">
                        {LINKS.map((l) => (
                            <Link key={l.href} href={l.href} aria-current={active(l.href) ? (path === l.href ? "page" : "location") : undefined} className={cn("flex min-h-11 items-center gap-2 text-[15px] transition-colors duration-150", active(l.href) ? "font-medium text-fg" : "text-bone-2 hover:text-fg")}>
                                <span aria-hidden className={cn("size-[5px] bg-red", active(l.href) ? "opacity-100" : "opacity-0")} />
                                {l.label}
                            </Link>
                        ))}
                        <ThemeToggle className="text-bone-2 hover:text-fg" />
                        <Link href="/get-involved" aria-current={path === "/get-involved" ? "page" : undefined} className="pressable inline-flex min-h-11 items-center rounded-md bg-red px-4 text-[15px] font-medium text-white hover:bg-bone hover:text-night">
                            Get involved
                        </Link>
                    </div>
                    <button type="button" onClick={() => { dialog.current?.showModal(); setOpen(true); }} className="pressable min-h-11 min-w-11 shrink-0 rounded-md text-[15px] text-bone md:hidden" aria-expanded={open} aria-controls="mobile-navigation" aria-haspopup="dialog" data-swarm-avoid>
                        Menu
                    </button>
                </nav>
            </header>
            {/* The platform provides background inertness, focus containment, Escape,
                and focus restoration. No delayed entrance on a keyboard path. */}
            <dialog ref={dialog} id="mobile-navigation" aria-label="Site navigation" onClose={() => setOpen(false)} className="mobile-navigation fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain border-0 bg-night text-bone">
                <div className="site-nav flex min-h-16 items-center justify-between gap-3 px-5">
                    <Link href="/" onClick={close} aria-label="Cornell Generative AI home" className="flex min-h-11 items-center"><Lockup /></Link>
                    <button type="button" autoFocus onClick={close} className="pressable min-h-11 min-w-11 rounded-md text-[15px]">Close</button>
                </div>
                <nav aria-label="Mobile" className="px-5 pb-10 pt-6">
                    {[{ href: "/", label: "Home" }, ...LINKS, { href: "/get-involved", label: "Get involved" }].map((l) => (
                        <Link key={l.href} href={l.href} onClick={close} aria-current={active(l.href) ? (path === l.href ? "page" : "location") : undefined} className="flex min-h-16 items-center gap-3 border-b border-bone/12 py-4 text-[clamp(1.75rem,7vw,2.5rem)] tracking-[-0.03em] hover:text-red">
                            <span aria-hidden className={cn("size-2 bg-red", active(l.href) ? "opacity-100" : "opacity-0")} />
                            {l.label}
                        </Link>
                    ))}
                    <ThemeToggle label className="mt-8 text-[17px] text-bone-2 hover:text-fg" />
                </nav>
            </dialog>
        </>
    );
}
