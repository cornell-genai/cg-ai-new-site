"use client";

import { useEffect, useRef } from "react";
import { onTheme, type Theme } from "@/lib/theme";

// A school of ASCII agents on a character grid.
//
//   - Free agents school (separation / alignment / cohesion), wander, and
//     panic away from the cursor; panic spreads to their neighbours.
//   - Everything that swims leaves a wake that diffuses across the grid.
//   - 81 agents are "claimed" by the brand mark: they swim in, assemble it
//     pixel by pixel, get knocked loose by the cursor, and find their way back.
//   - Clicking sends out a ripple.
//
// The hero places an empty element with [data-swarm-mark] where the mark
// should be, and marks text with [data-swarm-avoid] so the school swims
// around it. Rendering is Canvas 2D: one fillText per agent, bucketed by
// colour so each bucket is a single fillStyle.

// The old pixel-spark mark, 9×9. Unused: the home page runs Life, which now
// builds the club logo instead (see Mark.tsx).
const MARK = [
    ".........",
    "....#....",
    "....#....",
    "...#.#...",
    ".##...##.",
    "...#.#...",
    "....#....",
    "....#....",
    ".........",
];

const STEP = 1 / 60;
type RGB = [number, number, number];
// `floor` lifts the faintest level so the school reads on a light ground.
const PALETTES: Record<Theme, { bg: string; grid: string; ink: RGB; red: RGB; light: string; floor: number }> = {
    dark: { bg: "#161616", grid: "rgba(241,238,232,0.07)", ink: [241, 238, 232], red: [215, 38, 30], light: "#f1eee8", floor: 0 },
    light: { bg: "#f2f2f0", grid: "rgba(22,21,20,0.11)", ink: [28, 27, 26], red: [214, 30, 22], light: "#f7f7f5", floor: 0.32 },
};
const LEVELS = 6;

type Agent = {
    x: number; y: number; vx: number; vy: number;
    alarm: number;
    wander: number;
    target: number; // index into targets, or -1
    delay: number;  // seconds before a mark agent starts heading home
};

type Target = { x: number; y: number; light: boolean };
type Rect = { x0: number; y0: number; x1: number; y1: number };

const hash = (n: number) => {
    const s = Math.sin(n * 127.1) * 43758.5453;
    return s - Math.floor(s);
};

export default function Swarm({ className }: { className?: string }) {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        const root = canvas?.parentElement;
        if (!canvas || !root) return;
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const font = getComputedStyle(document.body).getPropertyValue("--font-geist-mono").trim() || "monospace";
        const bg = document.createElement("canvas");

        let W = 0, H = 0, dpr = 1, cs = 12, cols = 0, rows = 0;
        let agents: Agent[] = [];
        let targets: Target[] = [];
        let avoid: Rect[] = [];
        let energy = new Float32Array(0);
        let tmp = new Float32Array(0);
        let stamp = new Uint32Array(0);
        let quiet = new Uint8Array(0); // cells under [data-swarm-avoid] text: never drawn, so copy stays legible
        let frameId = 0;
        let time = 0;
        const pointer = { x: -1e4, y: -1e4, active: false };

        // Spatial hash for neighbour queries.
        let bucketSize = 48, bx = 0, by = 0;
        let heads = new Int32Array(0);
        let next = new Int32Array(0);

        let pal = PALETTES.dark;
        let styles: string[][] = [];
        const setPalette = (t: Theme) => {
            pal = PALETTES[t];
            styles = [pal.ink, pal.red].map(([r, g, b]) =>
                Array.from({ length: LEVELS }, (_, l) => `rgba(${r},${g},${b},${(pal.floor + ((1 - pal.floor) * (l + 1)) / LEVELS).toFixed(3)})`),
            );
        };

        // Dot grid behind the glyphs, cached on an offscreen canvas.
        const paintGrid = () => {
            const g = bg.getContext("2d")!;
            g.fillStyle = pal.bg;
            g.fillRect(0, 0, bg.width, bg.height);
            g.fillStyle = pal.grid;
            const d = Math.max(1, Math.round(dpr));
            for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
                g.fillRect(Math.round((x + 0.5) * cs * dpr), Math.round((y + 0.5) * cs * dpr), d, d);
            }
        };

        const measure = () => {
            const r = canvas.getBoundingClientRect();
            const rel = (el: Element, pad: number): Rect => {
                const e = el.getBoundingClientRect();
                return { x0: e.left - r.left - pad, y0: e.top - r.top - pad, x1: e.right - r.left + pad, y1: e.bottom - r.top + pad };
            };
            avoid = [...document.querySelectorAll("[data-swarm-avoid]")].map((el) => rel(el, cs));
            quiet = new Uint8Array(cols * rows);
            for (const el of document.querySelectorAll("[data-swarm-avoid]")) {
                const q = rel(el, cs * 0.5);
                for (let r = Math.max(0, Math.floor(q.y0 / cs)); r < Math.min(rows, Math.ceil(q.y1 / cs)); r++)
                    for (let c = Math.max(0, Math.floor(q.x0 / cs)); c < Math.min(cols, Math.ceil(q.x1 / cs)); c++) quiet[r * cols + c] = 1;
            }

            const markEl = root.querySelector("[data-swarm-mark]");
            targets = [];
            if (markEl) {
                const m = rel(markEl, 0);
                const c0 = Math.round(m.x0 / cs), r0 = Math.round(m.y0 / cs);
                MARK.forEach((row, y) =>
                    [...row].forEach((ch, x) => targets.push({ x: (c0 + x + 0.5) * cs, y: (r0 + y + 0.5) * cs, light: ch === "#" })),
                );
                avoid.push({ x0: c0 * cs - cs, y0: r0 * cs - cs, x1: (c0 + 9) * cs + cs, y1: (r0 + 9) * cs + cs });
            }
        };

        const spawn = () => {
            const free = Math.round(Math.min(2000, Math.max(320, cols * rows * 0.16)));
            agents = [];
            const schools = Math.max(6, Math.round(free / 40));
            for (let s = 0; s < schools; s++) {
                const cx = Math.random() * W, cy = Math.random() * H;
                const heading = Math.random() * Math.PI * 2;
                const n = Math.round(free / schools);
                for (let i = 0; i < n; i++) {
                    agents.push({
                        x: cx + (Math.random() - 0.5) * cs * 10,
                        y: cy + (Math.random() - 0.5) * cs * 6,
                        vx: Math.cos(heading) * 40, vy: Math.sin(heading) * 18,
                        alarm: 0, wander: Math.random() * 6.28, target: -1, delay: 0,
                    });
                }
            }
            // Mark agents enter from the edges and build the mark in a sweep.
            targets.forEach((t, i) => {
                const side = Math.random() < 0.5;
                agents.push({
                    x: side ? (Math.random() < 0.5 ? -cs : W + cs) : Math.random() * W,
                    y: side ? Math.random() * H : (Math.random() < 0.5 ? -cs : H + cs),
                    vx: 0, vy: 0, alarm: 0, wander: Math.random() * 6.28, target: i,
                    delay: 0.3 + ((t.x + t.y) / cs) * 0.012 + hash(i) * 0.5,
                });
            });
        };

        const resize = () => {
            const r = canvas.getBoundingClientRect();
            if (r.width < 1 || r.height < 1) return;
            const first = W === 0;
            const oldW = W, oldH = H;
            W = r.width; H = r.height;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            cs = W < 640 ? 9 : Math.max(10, Math.min(13, Math.round(W / 120)));
            root.style.setProperty("--swarm-cell", `${cs}px`);
            cols = Math.ceil(W / cs);
            rows = Math.ceil(H / cs);
            canvas.width = Math.round(W * dpr);
            canvas.height = Math.round(H * dpr);
            bg.width = canvas.width;
            bg.height = canvas.height;

            paintGrid();

            energy = new Float32Array(cols * rows);
            tmp = new Float32Array(cols * rows);
            stamp = new Uint32Array(cols * rows);
            bucketSize = cs * 5;
            bx = Math.ceil(W / bucketSize) + 1;
            by = Math.ceil(H / bucketSize) + 1;
            heads = new Int32Array(bx * by);

            measure();
            if (first) spawn();
            else {
                // Keep the school; just rescale positions and re-home the mark.
                for (const a of agents) { a.x *= W / oldW; a.y *= H / oldH; }
                const markAgents = agents.filter((a) => a.target >= 0);
                if (markAgents.length !== targets.length) spawn();
            }
            next = new Int32Array(agents.length);
        };

        const cellAt = (x: number, y: number) => {
            const c = Math.floor(x / cs), r = Math.floor(y / cs);
            return c < 0 || r < 0 || c >= cols || r >= rows ? -1 : r * cols + c;
        };

        const deposit = (x: number, y: number, radius: number, amount: number) => {
            const c0 = Math.floor(x / cs), r0 = Math.floor(y / cs);
            for (let r = r0 - radius; r <= r0 + radius; r++) for (let c = c0 - radius; c <= c0 + radius; c++) {
                if (c < 0 || r < 0 || c >= cols || r >= rows) continue;
                const d = Math.hypot(c - c0, r - r0);
                if (d > radius + 0.5) continue;
                const i = r * cols + c;
                energy[i] = Math.min(1.6, energy[i] + amount * (1 - d / (radius + 1)));
            }
        };

        const splash = (x: number, y: number) => {
            const R = 240;
            for (const a of agents) {
                const dx = a.x - x, dy = a.y - y;
                const d = Math.hypot(dx, dy);
                if (d > R || d < 0.01) continue;
                const k = 1 - d / R;
                a.vx += (dx / d) * 420 * k;
                a.vy += (dy / d) * 420 * k;
                a.alarm = Math.max(a.alarm, k);
            }
            deposit(x, y, 7, 1.4);
        };

        const step = (dt: number) => {
            time += dt;

            heads.fill(-1);
            for (let i = 0; i < agents.length; i++) {
                const a = agents[i];
                const k = Math.min(bx - 1, Math.max(0, Math.floor(a.x / bucketSize))) + Math.min(by - 1, Math.max(0, Math.floor(a.y / bucketSize))) * bx;
                next[i] = heads[k];
                heads[k] = i;
            }

            const sepR = cs * 1.5, nR = cs * 4.5;
            const fearR = 170;

            for (let i = 0; i < agents.length; i++) {
                const a = agents[i];
                let ax = 0, ay = 0;

                // Cursor: everything flees it.
                let fear = 0;
                if (pointer.active) {
                    const dx = a.x - pointer.x, dy = a.y - pointer.y;
                    const d = Math.hypot(dx, dy);
                    if (d < fearR && d > 0.01) {
                        fear = 1 - d / fearR;
                        ax += (dx / d) * 1400 * fear * fear;
                        ay += (dy / d) * 1400 * fear * fear;
                    }
                }

                if (a.target >= 0 && time > a.delay) {
                    // Spring home, critically damped; panic loosens the grip.
                    const t = targets[a.target];
                    const grip = 1 - a.alarm * 0.85;
                    ax += ((t.x - a.x) * 36 - a.vx * 12) * grip;
                    ay += ((t.y - a.y) * 36 - a.vy * 12) * grip;
                    a.alarm = Math.max(a.alarm * Math.exp(-dt * 1.6), fear);
                } else {
                    let n = 0, avx = 0, avy = 0, cx = 0, cy = 0, sx = 0, sy = 0, relay = 0;
                    const gx = Math.floor(a.x / bucketSize), gy = Math.floor(a.y / bucketSize);
                    for (let yy = gy - 1; yy <= gy + 1; yy++) {
                        if (yy < 0 || yy >= by) continue;
                        for (let xx = gx - 1; xx <= gx + 1; xx++) {
                            if (xx < 0 || xx >= bx) continue;
                            for (let j = heads[xx + yy * bx]; j !== -1; j = next[j]) {
                                if (j === i) continue;
                                const o = agents[j];
                                if (o.target >= 0) continue;
                                const dx = o.x - a.x, dy = o.y - a.y;
                                const d2 = dx * dx + dy * dy;
                                if (d2 > nR * nR) continue;
                                n++;
                                avx += o.vx; avy += o.vy; cx += o.x; cy += o.y;
                                if (o.alarm > relay) relay = o.alarm;
                                if (d2 < sepR * sepR && d2 > 0.01) {
                                    const d = Math.sqrt(d2);
                                    sx -= (dx / d) * (sepR - d);
                                    sy -= (dy / d) * (sepR - d);
                                }
                            }
                        }
                    }
                    const calm = 1 - 0.8 * a.alarm;
                    if (n > 0) {
                        ax += (avx / n - a.vx) * 1.8 * calm;
                        ay += (avy / n - a.vy) * 1.8 * calm;
                        ax += (cx / n - a.x) * 1.3 * calm;
                        ay += (cy / n - a.y) * 1.3 * calm;
                    }
                    ax += sx * 26;
                    ay += sy * 26;

                    a.wander += (hash(i + time) - 0.5) * dt * 6;
                    ax += Math.cos(a.wander) * 30;
                    ay += Math.sin(a.wander) * 30;
                    ay -= a.vy * 0.9 * (1 - 0.7 * a.alarm); // fish mostly cruise level

                    // Swim around text and the mark.
                    for (const r of avoid) {
                        if (a.x < r.x0 || a.x > r.x1 || a.y < r.y0 || a.y > r.y1) continue;
                        const l = a.x - r.x0, rt = r.x1 - a.x, u = a.y - r.y0, dn = r.y1 - a.y;
                        const m = Math.min(l, rt, u, dn);
                        if (m === l) ax -= 900; else if (m === rt) ax += 900; else if (m === u) ay -= 900; else ay += 900;
                    }

                    let alarm = Math.max(a.alarm * Math.exp(-dt * 1.1), fear);
                    if (relay * 0.7 > alarm) alarm += (relay * 0.7 - alarm) * Math.min(1, dt * 8);
                    a.alarm = alarm;

                    // Hold a preferred cruising speed.
                    const sp = Math.hypot(a.vx, a.vy) || 1;
                    const want = 42 * (1 + 1.6 * a.alarm);
                    ax += (a.vx / sp) * (want - sp) * 2;
                    ay += (a.vy / sp) * (want - sp) * 2;
                }

                a.vx += ax * dt;
                a.vy += ay * dt;
                const sp = Math.hypot(a.vx, a.vy);
                const max = 90 * (1 + 2 * a.alarm) + (a.target >= 0 ? 340 : 0);
                if (sp > max) { a.vx *= max / sp; a.vy *= max / sp; }
                a.x += a.vx * dt;
                a.y += a.vy * dt;

                if (a.target < 0) {
                    if (a.x < -cs) a.x += W + 2 * cs; else if (a.x > W + cs) a.x -= W + 2 * cs;
                    if (a.y < -cs) a.y += H + 2 * cs; else if (a.y > H + cs) a.y -= H + 2 * cs;
                    const c = cellAt(a.x, a.y);
                    if (c >= 0) energy[c] = Math.min(1.6, energy[c] + 0.06 + a.alarm * 0.16);
                } else if (Math.hypot(a.vx, a.vy) > 60) {
                    const c = cellAt(a.x, a.y);
                    if (c >= 0) energy[c] = Math.min(1.6, energy[c] + 0.05);
                }
            }

            // Wake diffuses and fades.
            const decay = Math.exp(-dt * 1.7);
            for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
                const i = r * cols + c;
                const l = c > 0 ? energy[i - 1] : energy[i];
                const rt = c < cols - 1 ? energy[i + 1] : energy[i];
                const u = r > 0 ? energy[i - cols] : energy[i];
                const d = r < rows - 1 ? energy[i + cols] : energy[i];
                tmp[i] = (energy[i] * 4 + l + rt + u + d) * 0.125 * decay;
            }
            [energy, tmp] = [tmp, energy];
        };

        const GLYPH_DIR = ["-", "\\", "|", "/"];
        const buckets: number[][] = Array.from({ length: LEVELS * 2 }, () => []);

        const draw = () => {
            frameId++;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.drawImage(bg, 0, 0);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.font = `600 ${Math.round(cs * 1.02)}px ${font}`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            // Mark pixels that have arrived are drawn as solid cells.
            const gap = Math.max(1, cs * 0.06);
            for (const a of agents) {
                if (a.target < 0) continue;
                const t = targets[a.target];
                if (Math.abs(a.x - t.x) < cs * 0.3 && Math.abs(a.y - t.y) < cs * 0.3) {
                    ctx.fillStyle = t.light ? pal.light : `rgb(${pal.red})`;
                    ctx.fillRect(t.x - cs / 2 + gap / 2, t.y - cs / 2 + gap / 2, cs - gap, cs - gap);
                    const c = cellAt(t.x, t.y);
                    if (c >= 0) stamp[c] = frameId;
                }
            }

            // Agents in transit: one glyph per cell, pointing where they swim.
            for (const b of buckets) b.length = 0;
            const glyphs: string[] = [];
            const pos: number[] = [];
            for (const a of agents) {
                const c = cellAt(a.x, a.y);
                if (c < 0 || stamp[c] === frameId || quiet[c]) continue;
                stamp[c] = frameId;
                let red = a.alarm > 0.55;
                const sp = Math.hypot(a.vx, a.vy);
                let level = Math.min(LEVELS - 1, Math.floor((0.62 + 0.25 * Math.min(1, sp / 80) + 0.4 * a.alarm) * LEVELS));
                let glyph: string;
                if (a.target >= 0) {
                    red = !targets[a.target].light;
                    level = LEVELS - 1;
                    glyph = "#";
                } else {
                    const ang = Math.atan2(a.vy, a.vx);
                    glyph = GLYPH_DIR[((Math.round(ang / (Math.PI / 4)) % 4) + 4) % 4];
                }
                const k = pos.length / 2;
                glyphs.push(glyph);
                pos.push((c % cols + 0.5) * cs, (Math.floor(c / cols) + 0.5) * cs + 1);
                buckets[(red ? LEVELS : 0) + level].push(k);
            }

            // Wake: dim red dots that brighten where the water is busiest.
            for (let i = 0; i < energy.length; i++) {
                const e = energy[i];
                if (e < 0.1 || stamp[i] === frameId || quiet[i]) continue;
                const level = Math.min(LEVELS - 1, Math.floor((e - 0.1) * 7));
                const k = pos.length / 2;
                glyphs.push(e > 0.8 ? "+" : e > 0.38 ? ":" : "·");
                pos.push((i % cols + 0.5) * cs, (Math.floor(i / cols) + 0.5) * cs + 1);
                buckets[LEVELS + level].push(k);
            }

            for (let b = 0; b < buckets.length; b++) {
                if (!buckets[b].length) continue;
                ctx.fillStyle = styles[b < LEVELS ? 0 : 1][b % LEVELS];
                for (const k of buckets[b]) ctx.fillText(glyphs[k], pos[k * 2], pos[k * 2 + 1]);
            }
        };

        let raf = 0, last = 0, acc = 0, running = false, visible = false;
        const frame = (now: number) => {
            const dt = Math.min(0.1, (now - last) / 1000);
            last = now;
            acc += dt;
            let n = 0;
            while (acc >= STEP && n < 4) { step(STEP); acc -= STEP; n++; }
            if (n === 4) acc = 0;
            // Only redraw when the simulation moved: caps drawing at 60fps on
            // 120Hz+ displays instead of rendering identical frames.
            if (n > 0) draw();
            raf = requestAnimationFrame(frame);
        };
        const start = () => {
            if (running || reduced || !visible || document.hidden) return;
            running = true;
            last = performance.now();
            raf = requestAnimationFrame(frame);
        };
        const stop = () => { running = false; cancelAnimationFrame(raf); };

        const still = () => {
            for (const a of agents) a.delay = 0;
            for (let i = 0; i < 300; i++) step(STEP);
            draw();
        };

        const local = (e: PointerEvent) => {
            const r = canvas.getBoundingClientRect();
            const x = e.clientX - r.left, y = e.clientY - r.top;
            return { x, y, inside: x >= 0 && y >= 0 && x <= r.width && y <= r.height };
        };
        const onMove = (e: PointerEvent) => {
            const p = local(e);
            pointer.x = p.x; pointer.y = p.y;
            pointer.active = p.inside && e.pointerType !== "touch";
        };
        const onDown = (e: PointerEvent) => {
            const p = local(e);
            if (p.inside && !reduced) splash(p.x, p.y);
        };
        const onLeave = () => { pointer.active = false; };

        const ro = new ResizeObserver(() => {
            resize();
            if (running) return;
            if (reduced) still(); else draw();
        });
        const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); else stop(); });
        const onVis = () => (document.hidden ? stop() : start());

        let disposed = false;
        const offTheme = onTheme((t) => {
            setPalette(t);
            if (W === 0) return;
            paintGrid();
            if (!running) { if (reduced) still(); else draw(); }
        });
        document.fonts.load(`600 16px ${font}`).finally(() => {
            if (disposed) return;
            resize();
            if (reduced) still(); else draw();
            canvas.dataset.ready = "true";
            ro.observe(canvas);
            io.observe(canvas);
            document.addEventListener("visibilitychange", onVis);
            window.addEventListener("pointermove", onMove, { passive: true });
            window.addEventListener("pointerdown", onDown, { passive: true });
            document.documentElement.addEventListener("pointerleave", onLeave);
            window.addEventListener("blur", onLeave);
        });

        return () => {
            disposed = true;
            offTheme();
            stop();
            ro.disconnect();
            io.disconnect();
            document.removeEventListener("visibilitychange", onVis);
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerdown", onDown);
            document.documentElement.removeEventListener("pointerleave", onLeave);
            window.removeEventListener("blur", onLeave);
        };
    }, []);

    return (
        <canvas
            ref={ref}
            aria-hidden
            className={`absolute inset-0 h-full w-full opacity-0 transition-opacity duration-[1600ms] ease-out data-[ready=true]:opacity-100 ${className ?? ""}`}
        />
    );
}
