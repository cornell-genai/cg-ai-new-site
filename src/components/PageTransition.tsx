"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

// Page wipe in two full-screen moves:
//   1. a muted dark-red sheet rises from the bottom until it covers the page;
//   2. the route changes, and the new page (on the page background) rises up
//      over the red sheet, which is then removed.
// The nav sits above both and never moves.
//
// Internal <a> clicks are caught in the capture phase, ahead of <Link>'s own
// handler, so plain <Link>s get the transition. Back/forward stays instant.

const RISE = { duration: 640, easing: "cubic-bezier(0.76, 0, 0.24, 1)" };

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const sheet = useRef<HTMLDivElement>(null);
    const page = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();
    const pending = useRef<string | null>(null);
    const busy = useRef(false);

    useEffect(() => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const onClick = (e: MouseEvent) => {
            if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || busy.current || reduced) return;
            const a = (e.target as Element).closest?.("a");
            if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
            const url = new URL(a.href, location.href);
            if (url.origin !== location.origin) return;
            const there = url.pathname.replace(/\/$/, "") || "/";
            if ((location.pathname.replace(/\/$/, "") || "/") === there) return;
            const el = sheet.current;
            if (!el) return;
            e.preventDefault();
            e.stopPropagation();
            busy.current = true;
            pending.current = there;
            router.prefetch(url.pathname);
            const go = () => router.push(url.pathname + url.search + url.hash);
            el.style.visibility = "visible";
            el.animate([{ transform: "translateY(100%)" }, { transform: "translateY(0%)" }], { ...RISE, fill: "forwards" }).finished.then(go, go);
        };
        document.addEventListener("click", onClick, true);
        return () => document.removeEventListener("click", onClick, true);
    }, [router]);

    useEffect(() => {
        const here = pathname.replace(/\/$/, "") || "/";
        const el = sheet.current, pg = page.current;
        if (pending.current !== here || !el || !pg) return;
        pending.current = null;
        window.scrollTo(0, 0);
        requestAnimationFrame(() => {
            pg.style.zIndex = "46"; // above the sheet while it rises
            pg.animate([{ transform: "translateY(100vh)" }, { transform: "translateY(0)" }], RISE).finished.finally(() => {
                pg.style.zIndex = "";
                el.getAnimations().forEach((a) => a.cancel());
                el.style.visibility = "hidden";
                busy.current = false;
            });
        });
    }, [pathname]);

    return (
        <>
            <div ref={page} className="relative bg-night">
                {children}
            </div>
            <div
                ref={sheet}
                aria-hidden
                className="pointer-events-none invisible fixed inset-0 z-[45] bg-[#5e1714]"
                style={{ transform: "translateY(100%)" }}
            />
        </>
    );
}
