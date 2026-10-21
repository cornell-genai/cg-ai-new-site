"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

// Pixel-dissolve transitions. A full-screen canvas fills with cells along a
// dithered diagonal (a red leading edge, then black), the route changes
// underneath, and the cells clear in the same direction. The first page
// load plays the "clear" half, so load-in and navigation feel like one move.
//
// Internal <a> clicks are intercepted globally (capture phase, ahead of
// <Link>'s own handler), so plain <Link>s get the transition with no wrapper. Back/forward navigation is left instant.

const CELL = 22;
const COVER_MS = 520;
const REVEAL_MS = 640;
const EDGE = 0.07; // width of the red front, in progress units
const BLACK = "#121212";
const RED = "#d7261e";

type Phase = "idle" | "covering" | "covered" | "revealing";

const bayer = (x: number, y: number) => {
    // 4×4 ordered-dither matrix, normalised to [0, 1).
    const m = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
    return m[(y & 3) * 4 + (x & 3)] / 16;
};

export default function PageTransition() {
    const ref = useRef<HTMLCanvasElement>(null);
    const router = useRouter();
    const pathname = usePathname();
    const phase = useRef<Phase>("covered");
    const pending = useRef<string | null>(null);
    const play = useRef<(mode: "cover" | "reveal", done?: () => void) => void>(() => {});

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let W = 0, H = 0, cols = 0, rows = 0, dpr = 1;
        let order = new Float32Array(0);
        let raf = 0;

        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = Math.round(W * dpr);
            canvas.height = Math.round(H * dpr);
            cols = Math.ceil(W / CELL);
            rows = Math.ceil(H / CELL);
            // Each cell's moment in the sweep: diagonal position, jittered by dither.
            order = new Float32Array(cols * rows);
            for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
                const diag = (x / cols) * 0.62 + (1 - y / rows) * 0.38;
                order[y * cols + x] = diag * 0.78 + bayer(x, y) * 0.22;
            }
        };

        // p: 0 → 1 sweep progress. Cells with order < p are "in".
        const paint = (p: number, mode: "cover" | "reveal") => {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, W, H);
            for (let i = 0; i < order.length; i++) {
                const o = order[i];
                const x = (i % cols) * CELL, y = Math.floor(i / cols) * CELL;
                if (mode === "cover") {
                    if (o > p) continue;
                    ctx.fillStyle = p - o < EDGE ? RED : BLACK;
                } else {
                    if (o < p) continue;
                    ctx.fillStyle = o - p < EDGE ? RED : BLACK;
                }
                ctx.fillRect(x, y, CELL + 0.5, CELL + 0.5);
            }
        };

        play.current = (mode, done) => {
            cancelAnimationFrame(raf);
            canvas.style.visibility = "visible";
            document.documentElement.dataset.transition = mode;
            if (reduced) {
                if (mode === "cover") paint(2, "cover");
                else canvas.style.visibility = "hidden";
                done?.();
                return;
            }
            const dur = mode === "cover" ? COVER_MS : REVEAL_MS;
            const t0 = performance.now();
            const tick = (t: number) => {
                const k = Math.min(1, (t - t0) / dur);
                const e = mode === "cover" ? k * k * (3 - 2 * k) : 1 - Math.pow(1 - k, 3);
                paint(e * (1 + EDGE), mode);
                if (k < 1) raf = requestAnimationFrame(tick);
                else {
                    if (mode === "reveal") {
                        canvas.style.visibility = "hidden";
                        delete document.documentElement.dataset.transition;
                    }
                    done?.();
                }
            };
            raf = requestAnimationFrame(tick);
        };

        resize();
        paint(2, "cover");
        // The server-rendered curtain hands over to the canvas.
        const curtain = document.getElementById("curtain");
        if (curtain) curtain.style.display = "none";
        window.addEventListener("resize", resize);

        // First load: reveal once fonts are in, so the decode effects start on real glyphs.
        let cancelled = false;
        document.fonts.ready.then(() => {
            if (cancelled) return;
            phase.current = "revealing";
            play.current("reveal", () => (phase.current = "idle"));
        });

        const onClick = (e: MouseEvent) => {
            if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            const a = (e.target as Element).closest?.("a");
            if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
            const url = new URL(a.href, location.href);
            if (url.origin !== location.origin) return;
            const here = location.pathname.replace(/\/$/, "");
            const there = url.pathname.replace(/\/$/, "");
            if (here === there || phase.current !== "idle") return; // mid-transition: let the link navigate plainly
            e.preventDefault();
            e.stopPropagation(); // keep <Link> from navigating before the curtain is down
            phase.current = "covering";
            pending.current = there || "/";
            router.prefetch(url.pathname);
            play.current("cover", () => {
                phase.current = "covered";
                router.push(url.pathname + url.search + url.hash);
            });
        };
        document.addEventListener("click", onClick, true);

        return () => {
            cancelled = true;
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", resize);
            document.removeEventListener("click", onClick, true);
        };
    }, [router]);

    // The new route has rendered under the curtain: clear it.
    useEffect(() => {
        const here = pathname.replace(/\/$/, "") || "/";
        if (phase.current === "covered" && pending.current === here) {
            pending.current = null;
            window.scrollTo(0, 0);
            phase.current = "revealing";
            requestAnimationFrame(() => play.current("reveal", () => (phase.current = "idle")));
        }
    }, [pathname]);

    return <canvas ref={ref} data-curtain aria-hidden className="pointer-events-none fixed inset-0 z-[100] h-full w-full" />;
}
