"use client";

import { useEffect, useRef } from "react";

// The team photo, with an ASCII layer that only shows near the cursor: cells
// in a small radius flicker into glyphs sampled from the photo's brightness,
// then fade back to the picture.

const RAMP = " .:-=+*#%@";
const CELL = 9;

export default function TeamPhoto({ src, alt }: { src: string; alt: string }) {
    const img = useRef<HTMLImageElement>(null);
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current, photo = img.current;
        if (!canvas || !photo) return;
        const ctx = canvas.getContext("2d");
        if (!ctx || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        let W = 0, H = 0, cols = 0, rows = 0, dpr = 1, raf = 0;
        let lum = new Float32Array(0), alpha = new Float32Array(0), heat = new Float32Array(0);
        const m = { x: -1e4, y: -1e4, in: false };
        const font = getComputedStyle(document.body).getPropertyValue("--font-geist-mono").trim() || "monospace";

        const sample = () => {
            const r = canvas.getBoundingClientRect();
            if (r.width < 1 || r.height < 1) return;
            W = r.width; H = r.height;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(W * dpr);
            canvas.height = Math.round(H * dpr);
            cols = Math.ceil(W / CELL); rows = Math.ceil(H / CELL);
            const off = document.createElement("canvas");
            off.width = cols; off.height = rows;
            const o = off.getContext("2d", { willReadFrequently: true })!;
            o.drawImage(photo, 0, 0, cols, rows);
            const d = o.getImageData(0, 0, cols, rows).data;
            lum = new Float32Array(cols * rows);
            alpha = new Float32Array(cols * rows);
            heat = new Float32Array(cols * rows);
            for (let i = 0; i < cols * rows; i++) {
                lum[i] = (d[i * 4] * 0.299 + d[i * 4 + 1] * 0.587 + d[i * 4 + 2] * 0.114) / 255;
                alpha[i] = d[i * 4 + 3] / 255;
            }
        };

        const frame = () => {
            const R = 70;
            let live = false;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, W, H);
            ctx.font = `600 ${CELL * 1.1}px ${font}`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            for (let i = 0; i < heat.length; i++) {
                const x = (i % cols + 0.5) * CELL, y = (Math.floor(i / cols) + 0.5) * CELL;
                if (m.in) {
                    const d = Math.hypot(x - m.x, y - m.y);
                    if (d < R) heat[i] = Math.max(heat[i], 1 - d / R);
                }
                if (heat[i] < 0.02 || alpha[i] < 0.3) { heat[i] = 0; continue; }
                live = true;
                heat[i] *= 0.93;
                const h = heat[i];
                ctx.fillStyle = "#121212";
                ctx.globalAlpha = Math.min(1, h * 1.6);
                ctx.fillRect(x - CELL / 2, y - CELL / 2, CELL, CELL);
                const flicker = Math.random() < 0.25 * h ? Math.random() : lum[i];
                const g = RAMP[Math.min(RAMP.length - 1, Math.floor(flicker * RAMP.length))];
                ctx.fillStyle = Math.random() < 0.08 * h ? "#d7261e" : "#f3f0ea";
                ctx.fillText(g, x, y + 1);
            }
            ctx.globalAlpha = 1;
            raf = live || m.in ? requestAnimationFrame(frame) : 0;
        };

        const onMove = (e: PointerEvent) => {
            const r = canvas.getBoundingClientRect();
            m.x = e.clientX - r.left; m.y = e.clientY - r.top;
            m.in = e.pointerType === "mouse" && m.x >= 0 && m.y >= 0 && m.x <= r.width && m.y <= r.height;
            if (m.in && !raf) raf = requestAnimationFrame(frame);
        };

        const ready = () => {
            sample();
            window.addEventListener("pointermove", onMove, { passive: true });
        };
        if (photo.complete && photo.naturalWidth) ready(); else photo.addEventListener("load", ready, { once: true });
        const ro = new ResizeObserver(() => photo.naturalWidth && sample());
        ro.observe(canvas);
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            window.removeEventListener("pointermove", onMove);
        };
    }, [src]);

    return (
        <div className="relative">
            <img ref={img} src={src} alt={alt} className="block w-full brightness-[0.78] saturate-[0.9]" />
            <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
        </div>
    );
}
