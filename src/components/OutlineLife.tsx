"use client";

import { useEffect, useRef } from "react";
import { onTheme, type Theme } from "@/lib/theme";

// A cut-out photo (transparent background) with a faint Game of Life running
// in a thin band around its outline, in the hero board's glyphs.
//
//   - The band is read from the photo's alpha: grid cells outside the subject
//     but within BAND cells of it. Nothing ever lives on the subject itself,
//     and the canvas sits behind the photo, so faces stay clean.
//   - The band runs along the top and sides only; the photo's bottom edge
//     (where legs are cut off by the frame) is left alone.
//   - B3/S23, a few generations a second. The band is thin, so patterns burn
//     out fast; small soups are dropped in to keep a quiet shimmer going.
//   - The cursor seeds hot (red) cells where it crosses the band.
//   - Pauses offscreen; with reduced motion (followed live) it draws one still frame.
//   - The side overhang shrinks to the room left in the viewport, so on narrow
//     screens the band never widens the page; the photo is never cut.

const GEN = 1 / 8;          // seconds per generation
const BAND = 4;             // band width, in cells
const PAD = BAND + 1;       // canvas overhang around the photo (top and sides), in cells
const SUBJECT_ALPHA = 0.35; // a cell is "subject" when its average alpha passes this
const SEED_DENSITY = 0.3;   // live share of band cells at start
const DROP_EVERY = 0.2;     // seconds between small soups dropped into the band
const ERODE_AGE = 40;       // generations before a settled cell may erode
const ERODE = 0.02;         // per-generation chance an old cell dies anyway
const BRUSH_R = 2.2;        // cursor brush radius, in cells
const LEVELS = 5;
// Glyph opacity range: present, but still under the photo in weight.
const ALPHA_MIN = 0.22, ALPHA_MAX = 0.7;
type RGB = [number, number, number];
const INK: Record<Theme, RGB> = { light: [28, 27, 26], dark: [241, 238, 232] };
const RED: Record<Theme, RGB> = { light: [214, 30, 22], dark: [215, 38, 30] };

export default function OutlineLife({ src, alt, className }: { src: string; alt: string; className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current, img = imgRef.current;
        if (!canvas || !img) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
        let reduced = motion.matches;
        const font = getComputedStyle(document.body).getPropertyValue("--font-geist-mono").trim() || "monospace";

        let cs = 10, cols = 0, rows = 0, dpr = 1;
        let band = new Uint8Array(0);
        let cur = new Uint8Array(0), nxt = new Uint8Array(0);
        let age = new Uint16Array(0), heat = new Float32Array(0), trail = new Float32Array(0);
        let bandCells: number[] = [];
        let styles: string[][] = [];
        let genAcc = 0, dropAcc = 0, last = 0, raf = 0, running = false, visible = false;
        let builtFor = "";
        const pointer = { x: -1e4, y: -1e4, active: false };

        const setPalette = (t: Theme) => {
            styles = [INK[t], RED[t]].map(([r, g, b]) =>
                Array.from({ length: LEVELS }, (_, l) => `rgba(${r},${g},${b},${(ALPHA_MIN + ((ALPHA_MAX - ALPHA_MIN) * l) / (LEVELS - 1)).toFixed(3)})`),
            );
        };

        // Grid over the photo plus PAD cells above and up to PAD cells to each
        // side (fewer where the viewport edge is closer). Band cells are found
        // by a breadth-first distance from the subject's cells. Returns false
        // when nothing changed, so the board is not reseeded needlessly.
        const build = () => {
            const w = img.clientWidth, h = img.clientHeight;
            if (!w || !h || !img.naturalWidth) return false;
            cs = w < 640 ? 7 : 10;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            const box = img.getBoundingClientRect();
            const vw = document.documentElement.clientWidth;
            const padL = Math.max(0, Math.min(PAD, Math.floor(box.left / cs)));
            // box.left + w, not box.right: the canvas is sized from the rounded clientWidth.
            const padR = Math.max(0, Math.min(PAD, Math.floor((vw - box.left - w) / cs)));
            const key = `${w}x${h}@${cs},${dpr},${padL},${padR}`;
            if (key === builtFor) return false;
            builtFor = key;
            const padPx = PAD * cs;
            // The canvas covers exactly photo + overhang; the last column may be
            // a partial cell, which simply clips at the canvas edge.
            const cw = w + (padL + padR) * cs, ch = h + padPx;
            cols = Math.ceil(cw / cs);
            rows = Math.ceil(ch / cs);
            canvas.style.left = `${-padL * cs}px`;
            canvas.style.top = `${-padPx}px`;
            canvas.style.width = `${cw}px`;
            canvas.style.height = `${ch}px`;
            canvas.width = Math.round(cw * dpr);
            canvas.height = Math.round(ch * dpr);

            // The photo's alpha, one sample per cell.
            const probe = document.createElement("canvas");
            probe.width = cols; probe.height = rows;
            const pc = probe.getContext("2d", { willReadFrequently: true })!;
            pc.drawImage(img, padL, PAD, w / cs, h / cs);
            const alpha = pc.getImageData(0, 0, cols, rows).data;

            const N = cols * rows;
            const dist = new Int16Array(N).fill(-1);
            const queue: number[] = [];
            for (let i = 0; i < N; i++) if (alpha[i * 4 + 3] / 255 > SUBJECT_ALPHA) { dist[i] = 0; queue.push(i); }
            for (let q = 0; q < queue.length; q++) {
                const i = queue[q], c = i % cols, r = (i / cols) | 0;
                if (dist[i] >= BAND) continue;
                for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
                    const cc = c + dx, rr = r + dy;
                    if (cc < 0 || rr < 0 || cc >= cols || rr >= rows) continue;
                    const j = rr * cols + cc;
                    if (dist[j] === -1) { dist[j] = dist[i] + 1; queue.push(j); }
                }
            }
            const bottomRow = Math.floor((padPx + h) / cs) - 1; // keep clear of the photo's bottom edge
            band = new Uint8Array(N);
            bandCells = [];
            for (let i = 0; i < N; i++) {
                if (dist[i] > 0 && (i / cols | 0) < bottomRow - 1) { band[i] = 1; bandCells.push(i); }
            }
            cur = new Uint8Array(N); nxt = new Uint8Array(N);
            age = new Uint16Array(N); heat = new Float32Array(N); trail = new Float32Array(N);
            for (const i of bandCells) if (Math.random() < SEED_DENSITY) cur[i] = 1;
            return true;
        };

        const generation = () => {
            for (const i of bandCells) {
                const c = i % cols, r = (i / cols) | 0;
                let n = 0, hot = 0;
                for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
                    if (!dx && !dy) continue;
                    const cc = c + dx, rr = r + dy;
                    if (cc < 0 || rr < 0 || cc >= cols || rr >= rows) continue;
                    const j = rr * cols + cc;
                    if (cur[j]) { n++; if (heat[j] > hot) hot = heat[j]; }
                }
                const was = cur[i];
                let live = n === 3 || (was === 1 && n === 2);
                if (live && was && age[i] > ERODE_AGE && Math.random() < ERODE) live = false;
                nxt[i] = live ? 1 : 0;
                if (live) {
                    age[i] = was ? Math.min(65535, age[i] + 1) : 0;
                    heat[i] = was ? heat[i] * 0.95 : hot * 0.9;
                } else {
                    if (was) trail[i] = 1;
                    age[i] = 0; heat[i] = 0;
                }
            }
            [cur, nxt] = [nxt, cur];
        };

        // A small soup somewhere on the band, so the thin strip never goes still.
        const drop = () => {
            if (!bandCells.length) return;
            const i = bandCells[(Math.random() * bandCells.length) | 0];
            const c = i % cols, r = (i / cols) | 0;
            for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
                const cc = c + dx, rr = r + dy;
                if (cc < 0 || rr < 0 || cc >= cols || rr >= rows) continue;
                const j = rr * cols + cc;
                if (band[j] && Math.random() < 0.45) { cur[j] = 1; age[j] = 0; }
            }
        };

        const brush = () => {
            if (!pointer.active) return;
            const r = canvas.getBoundingClientRect();
            const pc = (pointer.x - r.left) / cs, pr = (pointer.y - r.top) / cs;
            if (pc < -BRUSH_R || pr < -BRUSH_R || pc > cols + BRUSH_R || pr > rows + BRUSH_R) return;
            for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
                const cc = Math.floor(pc) + dx, rr = Math.floor(pr) + dy;
                if (cc < 0 || rr < 0 || cc >= cols || rr >= rows || Math.hypot(dx, dy) > BRUSH_R) continue;
                const j = rr * cols + cc;
                if (band[j] && Math.random() < 0.28) { cur[j] = 1; age[j] = 0; heat[j] = 1; }
            }
        };

        // One glyph per live cell (by age: + newborn, x, o, # settled; red while
        // hot from the cursor) and a faint dot where a cell just died. Glyphs are
        // bucketed by colour so each bucket is a single fillStyle.
        const buckets: number[][] = Array.from({ length: LEVELS * 2 }, () => []);
        const glyphs: string[] = [];
        const cells: number[] = [];
        const draw = () => {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, cols * cs, rows * cs);
            ctx.font = `600 ${Math.round(cs * 1.02)}px ${font}`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            for (const b of buckets) b.length = 0;
            glyphs.length = 0;
            cells.length = 0;
            for (const i of bandCells) {
                let glyph: string, bucket: number;
                if (cur[i]) {
                    const a = age[i];
                    glyph = a === 0 ? "+" : a < 3 ? "x" : a < 10 ? "o" : "#";
                    bucket = heat[i] > 0.3 ? LEVELS + Math.min(LEVELS - 1, 1 + Math.floor(heat[i] * 3)) : a < 3 ? LEVELS - 2 : a < 10 ? LEVELS - 3 : 0;
                } else if (trail[i] > 0.1) {
                    glyph = "·";
                    bucket = 0;
                } else continue;
                buckets[bucket].push(glyphs.length);
                glyphs.push(glyph);
                cells.push(i);
            }
            for (let b = 0; b < buckets.length; b++) {
                if (!buckets[b].length) continue;
                ctx.fillStyle = styles[b < LEVELS ? 0 : 1][b % LEVELS];
                for (const k of buckets[b]) {
                    const i = cells[k];
                    ctx.fillText(glyphs[k], (i % cols + 0.5) * cs, (((i / cols) | 0) + 0.5) * cs + 1);
                }
            }
        };

        const frame = (now: number) => {
            const dt = Math.min(0.1, (now - last) / 1000);
            last = now;
            genAcc += dt; dropAcc += dt;
            const fade = Math.exp(-dt * 3);
            for (const i of bandCells) if (trail[i] > 0) trail[i] = trail[i] < 0.05 ? 0 : trail[i] * fade;
            brush();
            if (dropAcc >= DROP_EVERY) { dropAcc = 0; drop(); }
            if (genAcc >= GEN) { genAcc -= GEN; generation(); }
            draw();
            raf = requestAnimationFrame(frame);
        };
        const start = () => {
            if (running || reduced || !visible || document.hidden || !bandCells.length) return;
            running = true;
            last = performance.now();
            raf = requestAnimationFrame(frame);
        };
        const stop = () => { running = false; cancelAnimationFrame(raf); };

        const rebuild = () => {
            if (build() && !running) draw();
            start();
        };
        // Live prefers-reduced-motion: freeze on a clean still frame, or resume.
        const onMotionChange = () => {
            reduced = motion.matches;
            if (!reduced) return start();
            stop();
            pointer.active = false;
            trail.fill(0);
            heat.fill(0);
            if (cols) draw();
        };
        const onMove = (e: PointerEvent) => {
            pointer.x = e.clientX; pointer.y = e.clientY;
            pointer.active = e.pointerType !== "touch";
        };
        const onLeave = () => { pointer.active = false; };

        const offTheme = onTheme((t) => { setPalette(t); if (!running && cols) draw(); });
        motion.addEventListener("change", onMotionChange);
        const ro = new ResizeObserver(rebuild);
        const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); else stop(); });
        const onVis = () => (document.hidden ? stop() : start());

        let disposed = false;
        img.decode().then(() => {
            if (disposed) return;
            ro.observe(img);
            io.observe(canvas);
            // The side room can change without the photo resizing.
            window.addEventListener("resize", rebuild);
            document.addEventListener("visibilitychange", onVis);
            window.addEventListener("pointermove", onMove, { passive: true });
            document.documentElement.addEventListener("pointerleave", onLeave);
        }, () => { /* no photo, no band */ });

        return () => {
            disposed = true;
            offTheme();
            motion.removeEventListener("change", onMotionChange);
            stop();
            ro.disconnect();
            io.disconnect();
            window.removeEventListener("resize", rebuild);
            document.removeEventListener("visibilitychange", onVis);
            window.removeEventListener("pointermove", onMove);
            document.documentElement.removeEventListener("pointerleave", onLeave);
        };
    }, []);

    return (
        <div className={`relative isolate ${className ?? ""}`}>
            <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute -z-10" />
            <img ref={imgRef} src={src} alt={alt} width="1448" height="711" loading="lazy" className="relative block h-auto w-full" />
        </div>
    );
}
