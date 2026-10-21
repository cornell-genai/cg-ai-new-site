"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

let lenis: Lenis | null = null;

export default function SmoothScroll() {
    const pathname = usePathname();

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
        let raf = requestAnimationFrame(function loop(t) {
            lenis?.raf(t);
            raf = requestAnimationFrame(loop);
        });
        return () => {
            cancelAnimationFrame(raf);
            lenis?.destroy();
            lenis = null;
        };
    }, []);

    useEffect(() => {
        lenis?.scrollTo(0, { immediate: true });
    }, [pathname]);

    return null;
}
