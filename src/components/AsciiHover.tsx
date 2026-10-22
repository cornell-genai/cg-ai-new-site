"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// A photo that turns into ASCII around the cursor: cells near the pointer
// are drawn as glyphs in the photo's own colours, flicker, and fade back to
// the picture once the cursor moves on. Idle when nothing is happening.

const RAMP = " .:-=+*cxo3%#8@";
const CELL = 11;

export default function AsciiHover({ src, alt, className, imgClassName }: { src: string; alt: string; className?: string; imgClassName?: string }) {
    const img = useRef<HTMLImageElement>(null);
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current, photo = img.current;
        if (!canvas || !photo || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const font = getComputedStyle(document.body).getPropertyValue("--font-geist-mono").trim() || "monospace";
        let W = 0, H = 0, cols = 0, rows = 0, dpr = 1, raf = 0;
        let col: string[] = [], lum = new Float32Array(0), heat = new Float32Array(0);
        const m = { x: -1e4, y: -1e4, in: false };

        // Sample the photo as it is drawn (object-cover), one pixel per cell.
        const sample = () => {
            // Layout size, not getBoundingClientRect: the banner animates a scale
            // transform on load, and the visual size would be off once it settles.
            if (canvas.offsetWidth < 1 || canvas.offsetHeight < 1 || !photo.naturalWidth) return;
            W = canvas.offsetWidth; H = canvas.offsetHeight;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(W * dpr);
            canvas.height = Math.round(H * dpr);
            cols = Math.ceil(W / CELL); rows = Math.ceil(H / CELL);
            const off = document.createElement("canvas");
            off.width = cols; off.height = rows;
            const o = off.getContext("2d", { willReadFrequently: true })!;
            const s = Math.max(cols / photo.naturalWidth, rows / photo.naturalHeight);
            const dw = photo.naturalWidth * s, dh = photo.naturalHeight * s;
            const pos = getComputedStyle(photo).objectPosition.split(" ").map((v) => parseFloat(v) / 100);
            o.drawImage(photo, (cols - dw) * (pos[0] || 0.5), (rows - dh) * (pos[1] ?? 0.5), dw, dh);
            const d = o.getImageData(0, 0, cols, rows).data;
            col = []; lum = new Float32Array(cols * rows); heat = new Float32Array(cols * rows);
            for (let i = 0; i < cols * rows; i++) {
                const [R, G, B] = [d[i * 4], d[i * 4 + 1], d[i * 4 + 2]];
                lum[i] = (R * 0.299 + G * 0.587 + B * 0.114) / 255;
                const k = 255 / Math.max(R, G, B, 1); // full-brightness hue so glyphs glow
                col.push(`rgb(${Math.min(255, R * k * 0.95) | 0},${Math.min(255, G * k * 0.95) | 0},${Math.min(255, B * k * 0.95) | 0})`);
            }
        };

        const frame = () => {
            const R = 64;
            let live = false;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, W, H);
            ctx.font = `600 ${CELL * 1.15}px ${font}`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            for (let i = 0; i < heat.length; i++) {
                const x = (i % cols + 0.5) * CELL, y = (Math.floor(i / cols) + 0.5) * CELL;
                if (m.in) {
                    const d = Math.hypot(x - m.x, y - m.y);
                    if (d < R) heat[i] = Math.max(heat[i], 1 - d / R);
                }
                if (heat[i] < 0.02) { heat[i] = 0; continue; }
                live = true;
                heat[i] *= 0.975; // long, slow fade so the cursor leaves a trail
                const h = heat[i];
                ctx.globalAlpha = Math.min(0.85, h * 1.5);
                ctx.fillStyle = "#121212";
                ctx.fillRect(x - CELL / 2, y - CELL / 2, CELL, CELL);
                const v = Math.random() < 0.2 * h ? Math.random() : lum[i];
                ctx.globalAlpha = Math.min(1, h * 2);
                ctx.fillStyle = col[i];
                ctx.fillText(RAMP[Math.min(RAMP.length - 1, 1 + Math.floor(v * (RAMP.length - 1)))], x, y + 1);
            }
            ctx.globalAlpha = 1;
            raf = live || m.in ? requestAnimationFrame(frame) : 0;
        };

        const onMove = (e: PointerEvent) => {
            const r = canvas.getBoundingClientRect();
            // Map from the (possibly transformed) visual box back to layout pixels.
            m.x = ((e.clientX - r.left) * W) / r.width;
            m.y = ((e.clientY - r.top) * H) / r.height;
            m.in = e.pointerType === "mouse" && m.x >= 0 && m.y >= 0 && m.x <= W && m.y <= H;
            if (m.in && !raf) raf = requestAnimationFrame(frame);
        };
        const ready = () => { sample(); window.addEventListener("pointermove", onMove, { passive: true }); };
        if (photo.complete && photo.naturalWidth) ready(); else photo.addEventListener("load", ready, { once: true });
        const ro = new ResizeObserver(sample);
        ro.observe(canvas);
        return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener("pointermove", onMove); };
    }, [src]);

    return (
        <div className={cn("relative", className)}>
            <img ref={img} src={src} alt={alt} className={cn("absolute inset-0 h-full w-full object-cover", imgClassName)} />
            <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
        </div>
    );
}
