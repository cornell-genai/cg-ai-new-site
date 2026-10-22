"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// A warm, slowly drifting dot field, like dusk coming up from the bottom of
// the page. Dot size follows a soft noise field; colour runs from deep red
// at the base through amber to cream. The cursor brightens and swells the
// dots near it. Canvas 2D, about one circle per 9px cell, paused offscreen.
// Redraws at up to 30fps and at most 1.5x density: soft dots don't need more.

const STOPS: [number, [number, number, number]][] = [
    [0.0, [255, 236, 214]],
    [0.35, [255, 170, 92]],
    [0.65, [226, 72, 40]],
    [1.0, [122, 23, 18]],
];

function ramp(t: number) {
    t = Math.min(1, Math.max(0, t));
    for (let i = 1; i < STOPS.length; i++) {
        const [b, cb] = STOPS[i];
        const [a, ca] = STOPS[i - 1];
        if (t <= b) {
            const k = (t - a) / (b - a);
            return ca.map((v, j) => Math.round(v + (cb[j] - v) * k)) as [number, number, number];
        }
    }
    return STOPS[STOPS.length - 1][1];
}

// Cheap smooth value noise.
const hash = (x: number, y: number) => {
    const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return s - Math.floor(s);
};
function noise(x: number, y: number) {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

export default function Glow({ text, className }: { text?: string; className?: string }) {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const P = 9;
        let W = 0, H = 0, dpr = 1, raf = 0, running = false, t = 0, last = 0, drawn = 0;
        const m = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4, a: 0, ta: 0 };
        const colors = Array.from({ length: 48 }, (_, i) => {
            const [r, g, b] = ramp(i / 47);
            return `rgb(${r},${g},${b})`;
        });

        // Optional wordmark: dots inside the letters burn brighter.
        let mask: Uint8ClampedArray | null = null, mw = 0;
        const font = getComputedStyle(document.body).getPropertyValue("--font-host").trim() || "sans-serif";
        const buildMask = () => {
            if (!text) return;
            const off = document.createElement("canvas");
            mw = Math.ceil(W / P); const mh = Math.ceil(H / P);
            off.width = mw; off.height = mh;
            const o = off.getContext("2d", { willReadFrequently: true })!;
            let size = mh * 0.62;
            o.font = `600 ${size}px ${font}`;
            const tw = o.measureText(text).width;
            if (tw > mw * 0.92) size *= (mw * 0.92) / tw;
            o.font = `600 ${size}px ${font}`;
            o.fillStyle = "#fff";
            o.textBaseline = "alphabetic";
            o.fillText(text, mw * 0.04, mh * 0.9);
            mask = o.getImageData(0, 0, mw, mh).data;
        };

        const resize = () => {
            const r = canvas.getBoundingClientRect();
            W = r.width; H = r.height;
            dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            canvas.width = Math.round(W * dpr);
            canvas.height = Math.round(H * dpr);
            buildMask();
        };

        const draw = () => {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, W, H);
            const R = 150;
            for (let y = P / 2; y < H; y += P) {
                const depth = y / H; // 0 top → 1 bottom
                for (let x = P / 2; x < W; x += P) {
                    const n = noise(x / 180 + t * 0.6, y / 120 - t * 0.35) * 0.65 + noise(x / 60 - t, y / 50) * 0.35;
                    const dx = x - m.x, dy = y - m.y;
                    const near = Math.exp(-(dx * dx + dy * dy) / (R * R)) * m.a;
                    // Field rises from the bottom; noise breaks up its upper edge.
                    let v = depth * 1.25 - 0.35 + (n - 0.5) * 0.7 + near * 0.55;
                    const inText = mask ? mask[(Math.floor(y / P) * mw + Math.floor(x / P)) * 4 + 3] > 120 : false;
                    if (inText) v = Math.max(v, 0.25) + 0.55 + (n - 0.5) * 0.3;
                    if (v <= 0.04) continue;
                    v = Math.min(1, v);
                    const r = P * 0.46 * Math.sqrt(v);
                    ctx.fillStyle = inText ? colors[Math.max(0, Math.round((0.1 - near * 0.1) * 47))] : colors[Math.min(47, Math.max(0, Math.round((1 - v * 0.9 + depth * 0.25 - near * 0.5) * 47)))];
                    ctx.beginPath();
                    ctx.arc(x, y, r, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        };

        const frame = (now: number) => {
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            t += dt * 0.12;
            const k = 1 - Math.pow(0.002, dt);
            m.x += (m.tx - m.x) * k;
            m.y += (m.ty - m.y) * k;
            m.a += (m.ta - m.a) * Math.min(1, dt * 4);
            if (now - drawn >= 32) { drawn = now; draw(); }
            raf = requestAnimationFrame(frame);
        };
        const start = () => {
            if (running || reduced) return;
            running = true;
            last = performance.now();
            raf = requestAnimationFrame(frame);
        };
        const stop = () => { running = false; cancelAnimationFrame(raf); };

        const onMove = (e: PointerEvent) => {
            const r = canvas.getBoundingClientRect();
            const x = e.clientX - r.left, y = e.clientY - r.top;
            const inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
            if (inside && m.a < 0.01) { m.x = x; m.y = y; }
            m.tx = x; m.ty = y;
            m.ta = inside && e.pointerType === "mouse" ? 1 : 0;
        };

        resize();
        draw();
        document.fonts.ready.then(() => { buildMask(); if (!running) draw(); });
        const ro = new ResizeObserver(() => { resize(); if (!running) draw(); });
        const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
        ro.observe(canvas);
        io.observe(canvas);
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => {
            stop();
            ro.disconnect();
            io.disconnect();
            window.removeEventListener("pointermove", onMove);
        };
    }, [text]);

    return <canvas ref={ref} aria-hidden className={cn("absolute inset-0 h-full w-full", className)} />;
}
