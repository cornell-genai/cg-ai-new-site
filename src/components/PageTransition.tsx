"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

// Page wipe: a dark grey panel with a thin dark-red band on its leading edge
// slides down over the page (accelerating), the route changes underneath,
// then the panel carries on down and off the screen (decelerating).
//
// Internal <a> clicks are caught in the capture phase, ahead of <Link>'s own
// handler, so plain <Link>s get the transition. Back/forward stays instant.

const COVER = { duration: 520, easing: "cubic-bezier(0.7, 0, 0.84, 0)" }; // ease-in
const REVEAL = { duration: 620, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }; // ease-out

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const wipe = useRef<HTMLDivElement>(null);
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
            const el = wipe.current;
            if (!el) return;
            e.preventDefault();
            e.stopPropagation();
            busy.current = true;
            pending.current = there;
            router.prefetch(url.pathname);
            const go = () => router.push(url.pathname + url.search + url.hash);
            el.style.visibility = "visible";
            el.animate([{ transform: "translateY(-100%)" }, { transform: "translateY(0%)" }], { ...COVER, fill: "forwards" }).finished.then(go, go);
        };
        document.addEventListener("click", onClick, true);
        return () => document.removeEventListener("click", onClick, true);
    }, [router]);

    useEffect(() => {
        const here = pathname.replace(/\/$/, "") || "/";
        const el = wipe.current;
        if (pending.current !== here || !el) return;
        pending.current = null;
        window.scrollTo(0, 0);
        // Give the new page a frame to paint under the panel, then carry on down.
        requestAnimationFrame(() => {
            el.getAnimations().forEach((a) => a.cancel());
            el.animate([{ transform: "translateY(0%)" }, { transform: "translateY(calc(100% + 10px))" }], { ...REVEAL, fill: "forwards" })
                .finished.finally(() => {
                    el.style.visibility = "hidden";
                    el.getAnimations().forEach((a) => a.cancel());
                    busy.current = false;
                });
        });
    }, [pathname]);

    return (
        <>
            {children}
            <div ref={wipe} aria-hidden className="pointer-events-none invisible fixed inset-0 z-[100]" style={{ transform: "translateY(-100%)" }}>
                <div className="h-full bg-[#262626]" />
                <div className="h-[10px] bg-[#7a1712]" />
            </div>
        </>
    );
}
