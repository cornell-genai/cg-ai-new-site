"use client";

import { useEffect, useRef } from "react";

// The team photo with a sparse layer of white ASCII over it. The layer is
// stirred by many small, short-lived pulses scattered across the people
// (never one sweeping wave); each pulse brightens and reshuffles the glyphs
// it passes. Moving the cursor sets off pulses where it goes. Glyphs only
// sit on the people, using the photo's alpha and brightness.

const RAMP = ".:-=+*cxo3%#8@";
const CELL = 8;
const LEVELS = 6;

type Pulse = { x: number; y: number; t0: number; life: number; size: number; amp: number };

const hash = (i: number) => {
    const s = Math.sin(i * 12.9898) * 43758.5453;
    return s - Math.floor(s);
};

export default function TeamPhoto({ src, alt }: { src: string; alt: string }) {
    const img = useRef<HTMLImageElement>(null);
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current, photo = img.current;
        if (!canvas || !photo) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const font = getComputedStyle(document.body).getPropertyValue("--font-geist-mono").trim() || "monospace";

        let W = 0, H = 0, cols = 0, rows = 0, dpr = 1;
        let lum = new Float32Array(0), on = new Uint8Array(0), seed = new Float32Array(0);
        const pulses: Pulse[] = [];
        const styles = Array.from({ length: LEVELS }, (_, l) => `rgba(255,255,255,${(0.18 + (0.82 * l) / (LEVELS - 1)).toFixed(3)})`);
        const buckets: number[][] = Array.from({ length: LEVELS }, () => []);
        const glyph: string[] = [];

        const sample = () => {
            const r = canvas.getBoundingClientRect();
            if (r.width < 1 || r.height < 1 || !photo.naturalWidth) return;
            W = r.width; H = r.height;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(W * dpr);
            canvas.height = Math.round(H * dpr);
            cols = Math.ceil(W / CELL); rows = Math.ceil(H / (CELL * 1.25));
            const off = document.createElement("canvas");
            off.width = cols; off.height = rows;
            const o = off.getContext("2d", { willReadFrequently: true })!;
            o.drawImage(photo, 0, 0, cols, rows);
            const d = o.getImageData(0, 0, cols, rows).data;
            const n = cols * rows;
            lum = new Float32Array(n); on = new Uint8Array(n); seed = new Float32Array(n);
            for (let i = 0; i < n; i++) {
                lum[i] = (d[i * 4] * 0.299 + d[i * 4 + 1] * 0.587 + d[i * 4 + 2] * 0.114) / 255;
                on[i] = d[i * 4 + 3] > 200 ? 1 : 0;
                seed[i] = hash(i);
            }
        };

        const spawn = (x: number, y: number, now: number, size = 26 + Math.random() * 30, amp = 0.7 + Math.random() * 0.5) =>
            pulses.push({ x, y, t0: now, life: 0.9 + Math.random() * 0.8, size, amp });

        const draw = (now: number) => {
            const t = now / 1000;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, W, H);
            ctx.font = `500 ${CELL * 1.15}px ${font}`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            for (const b of buckets) b.length = 0;

            // Keep a few ambient pulses going.
            for (let i = pulses.length - 1; i >= 0; i--) if (t - pulses[i].t0 > pulses[i].life) pulses.splice(i, 1);
            if (!reduced && pulses.length < 14 && Math.random() < 0.35) spawn(Math.random() * W, H * (0.1 + Math.random() * 0.8), t);

            const ch = H / rows;
            for (let r = 0; r < rows; r++) {
                const y = (r + 0.5) * ch;
                for (let c = 0; c < cols; c++) {
                    const i = r * cols + c;
                    if (!on[i]) continue;
                    const x = (c + 0.5) * CELL;
                    let e = 0;
                    for (const p of pulses) {
                        const age = (t - p.t0) / p.life;
                        const d = Math.hypot(x - p.x, y - p.y);
                        const ring = d - age * p.size * 2.2;
                        if (ring > p.size || ring < -p.size) continue;
                        e += Math.exp(-(ring * ring) / (p.size * p.size * 0.12)) * (1 - age) * p.amp;
                    }
                    // Base layer: about a third of cells, faint; pulses fill in and brighten.
                    const base = seed[i] < 0.34 ? 0.22 + 0.25 * lum[i] : 0;
                    const v = Math.min(1, base + e * 0.9);
                    if (v < 0.12) continue;
                    const flick = e > 0.25 && seed[(i * 7 + Math.floor(t * 18)) % seed.length] < 0.5;
                    const k = flick ? Math.floor(seed[(i + Math.floor(t * 30)) % seed.length] * RAMP.length) : Math.floor(lum[i] * (RAMP.length - 1));
                    glyph[i] = RAMP[k];
                    buckets[Math.min(LEVELS - 1, Math.floor(v * LEVELS))].push(i);
                }
            }
            for (let l = 0; l < LEVELS; l++) {
                if (!buckets[l].length) continue;
                ctx.fillStyle = styles[l];
                for (const i of buckets[l]) ctx.fillText(glyph[i], (i % cols + 0.5) * CELL, (Math.floor(i / cols) + 0.5) * ch + 1);
            }
        };

        let raf = 0, running = false, lastSpawn = 0;
        const loop = (now: number) => { draw(now); raf = requestAnimationFrame(loop); };
        const start = () => { if (running || reduced) return; running = true; raf = requestAnimationFrame(loop); };
        const stop = () => { running = false; cancelAnimationFrame(raf); };

        const onMove = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return;
            const r = canvas.getBoundingClientRect();
            const x = e.clientX - r.left, y = e.clientY - r.top;
            if (x < 0 || y < 0 || x > r.width || y > r.height) return;
            const now = performance.now() / 1000;
            if (now - lastSpawn > 0.05) { lastSpawn = now; spawn(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20, now, 22 + Math.random() * 18, 1.1); }
        };

        const ready = () => {
            sample();
            if (reduced) draw(performance.now());
            const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
            io.observe(canvas);
            cleanup.push(() => io.disconnect());
        };
        const cleanup: (() => void)[] = [];
        if (photo.complete && photo.naturalWidth) ready(); else photo.addEventListener("load", ready, { once: true });
        const ro = new ResizeObserver(sample);
        ro.observe(canvas);
        canvas.addEventListener("pointermove", onMove);
        return () => {
            stop();
            ro.disconnect();
            canvas.removeEventListener("pointermove", onMove);
            cleanup.forEach((f) => f());
        };
    }, [src]);

    return (
        <div className="relative [mask-image:linear-gradient(to_bottom,black_80%,transparent)]">
            <img ref={img} src={src} alt={alt} className="block w-full brightness-[0.82]" />
            <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />
        </div>
    );
}
