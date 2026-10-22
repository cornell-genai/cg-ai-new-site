"use client";

import { useEffect, useRef } from "react";

// The team photo under a dense layer of white ASCII that always covers the
// people. A slow, smooth noise field drifts across them, gathering glyphs
// into soft pockets that swell, shimmer, and dissolve together. The cursor
// leaves a slowly fading trail through the field. Redraws at 30fps: the
// field drifts slowly, so more is wasted work.

const RAMP = ".:-=+*cxo3%#8@";
const CELL = 8;
const LEVELS = 6;

const hash = (i: number) => {
    const s = Math.sin(i * 12.9898) * 43758.5453;
    return s - Math.floor(s);
};
const h2 = (x: number, y: number) => hash(x * 157 + y * 113);
function noise(x: number, y: number) {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = h2(xi, yi), b = h2(xi + 1, yi), c = h2(xi, yi + 1), d = h2(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

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
        let lum = new Float32Array(0), on = new Uint8Array(0), seed = new Float32Array(0), heat = new Float32Array(0);
        const m = { x: -1e4, y: -1e4, a: 0, ta: 0 };
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
            lum = new Float32Array(n); on = new Uint8Array(n); seed = new Float32Array(n); heat = new Float32Array(n);
            for (let i = 0; i < n; i++) {
                lum[i] = (d[i * 4] * 0.299 + d[i * 4 + 1] * 0.587 + d[i * 4 + 2] * 0.114) / 255;
                on[i] = d[i * 4 + 3] > 200 ? 1 : 0;
                seed[i] = hash(i);
            }
        };

        const draw = (now: number) => {
            const t = now / 1000;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, W, H);
            ctx.font = `500 ${CELL * 1.15}px ${font}`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            for (const b of buckets) b.length = 0;

            m.a += (m.ta - m.a) * 0.15;
            const ch = H / rows;
            for (let r = 0; r < rows; r++) {
                const y = (r + 0.5) * ch;
                for (let c = 0; c < cols; c++) {
                    const i = r * cols + c;
                    if (!on[i]) continue;
                    const x = (c + 0.5) * CELL;
                    // Two octaves of drifting noise make the pockets; a fast, faint
                    // third adds the vibration inside them.
                    const n = noise(x / 90 + t * 0.12, y / 70 - t * 0.08) * 0.7 + noise(x / 34 - t * 0.3, y / 30 + t * 0.2) * 0.3;
                    const pocket = Math.max(0, (n - 0.36) / 0.64);
                    const dx = x - m.x, dy = y - m.y;
                    // The cursor heats a small radius; heat fades slowly, leaving a trail.
                    const d2 = dx * dx + dy * dy;
                    if (m.ta > 0 && d2 < 1600) heat[i] = Math.max(heat[i], 1 - Math.sqrt(d2) / 40);
                    heat[i] *= 0.957; // ≈0.978 per 60fps frame
                    const stir = heat[i];
                    const e = Math.min(1, pocket * pocket * 1.6 + stir * 0.9);
                    // Base layer covers most of each person; pockets brighten it.
                    const base = seed[i] < 0.86 ? 0.3 + 0.35 * lum[i] : 0;
                    const v = Math.min(1, base + e * 0.85 + (e > 0.05 ? 0.1 : 0));
                    if (v < 0.12) continue;
                    const flick = e > 0.3 && seed[(i * 7 + Math.floor(t * 9)) % seed.length] < 0.35;
                    const k = flick ? Math.floor(seed[(i + Math.floor(t * 30)) % seed.length] * RAMP.length) : 2 + Math.floor(lum[i] * (RAMP.length - 3));
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

        let raf = 0, running = false, last = 0;
        const loop = (now: number) => {
            if (now - last >= 32) { last = now; draw(now); }
            raf = requestAnimationFrame(loop);
        };
        const start = () => { if (running || reduced) return; running = true; raf = requestAnimationFrame(loop); };
        const stop = () => { running = false; cancelAnimationFrame(raf); };

        const onMove = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return;
            const r = canvas.getBoundingClientRect();
            m.x = e.clientX - r.left; m.y = e.clientY - r.top;
            m.ta = 1;
        };
        const onLeave = () => { m.ta = 0; };

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
        canvas.addEventListener("pointerleave", onLeave);
        return () => {
            stop();
            ro.disconnect();
            canvas.removeEventListener("pointermove", onMove);
            canvas.removeEventListener("pointerleave", onLeave);
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
