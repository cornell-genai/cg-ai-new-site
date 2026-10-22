"use client";

import { useEffect, useRef } from "react";
import { MARK } from "./Mark";
import { onTheme, type Theme } from "@/lib/theme";

// Conway's Game of Life on the same ASCII character grid as the Swarm.
//
//   - B3/S23 on a torus, ~12 generations a second. Living cells are drawn by
//     age (+ newborn, x, o, then # as they settle); cells that just died leave
//     a red trail that fades between generations.
//   - The cursor is a brush: moving it seeds live cells along its path. Those
//     cells are "hot" (red) and pass the heat to their offspring, so you can
//     watch your scribble's descendants spread and burn out.
//   - Clicking fires four gliders out from the click.
//   - Nothing stays still for long: settled cells slowly erode, and when the
//     board quiets down a methuselah, a soup patch or a glider fleet is
//     dropped in somewhere to keep it going.
//
// Same hooks as the Swarm: [data-swarm-mark] is where the brand mark is
// drawn, [data-swarm-avoid] text is a dead zone that life never enters, and
// the cell size is published as --swarm-cell.

const STEP = 1 / 60;
const GEN = 1 / 12;
type RGB = [number, number, number];
// `floor` lifts the faintest level so cells read on a light ground.
const PALETTES: Record<Theme, { bg: string; grid: string; ink: RGB; red: RGB; light: string; floor: number }> = {
    dark: { bg: "#161616", grid: "rgba(241,238,232,0.07)", ink: [241, 238, 232], red: [215, 38, 30], light: "#f1eee8", floor: 0 },
    light: { bg: "#f2f2f0", grid: "rgba(22,21,20,0.11)", ink: [28, 27, 26], red: [214, 30, 22], light: "#f7f7f5", floor: 0.32 },
};
const LEVELS = 6;
const ERODE_AGE = 90;   // generations before a settled cell starts to erode
const ERODE = 0.004;    // per-generation chance an old cell dies anyway

type Rect = { x0: number; y0: number; x1: number; y1: number };
type Pattern = string[];

// Glider heading +x +y; flip either axis to aim it elsewhere.
const GLIDER: Pattern = [".#.", "..#", "###"];
const R_PENTOMINO: Pattern = [".##", "##.", ".#."];
const ACORN: Pattern = [".#.....", "...#...", "##..###"];
const DIEHARD: Pattern = ["......#.", "##......", ".#...###"];

export default function Life({ className }: { className?: string }) {
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
        let cur = new Uint8Array(0), nxt = new Uint8Array(0);
        let heat = new Float32Array(0), heat2 = new Float32Array(0);
        let age = new Uint16Array(0);
        let trail = new Float32Array(0);
        let wall = new Uint8Array(0); // text and mark cells: always dead, never drawn over
        let mark: { c: number; r: number; light: boolean; delay: number }[] = [];
        let time = 0, genAcc = 0, seedIn = 2, activity = 0;
        const pointer = { x: -1e4, y: -1e4, px: -1e4, py: -1e4, active: false };

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
            const block = (q: Rect) => {
                for (let y = Math.max(0, Math.floor(q.y0 / cs)); y < Math.min(rows, Math.ceil(q.y1 / cs)); y++)
                    for (let x = Math.max(0, Math.floor(q.x0 / cs)); x < Math.min(cols, Math.ceil(q.x1 / cs)); x++) wall[y * cols + x] = 1;
            };
            wall = new Uint8Array(cols * rows);
            for (const el of document.querySelectorAll("[data-swarm-avoid]")) block(rel(el, cs * 0.5));

            const markEl = root.querySelector("[data-swarm-mark]");
            mark = [];
            if (markEl) {
                const m = rel(markEl, 0);
                const c0 = Math.round(m.x0 / cs), r0 = Math.round(m.y0 / cs);
                MARK.forEach((row, y) =>
                    [...row].forEach((ch, x) => mark.push({ c: c0 + x, r: r0 + y, light: ch === "#", delay: 0.4 + (x + y) * 0.05 + Math.random() * 0.25 })),
                );
                block({ x0: c0 * cs, y0: r0 * cs, x1: (c0 + 9) * cs, y1: (r0 + 9) * cs });
            }
            for (let i = 0; i < wall.length; i++) if (wall[i]) { cur[i] = 0; heat[i] = 0; trail[i] = 0; }
        };

        const wrap = (c: number, r: number) => ((r % rows) + rows) % rows * cols + ((c % cols) + cols) % cols;

        const place = (p: Pattern, c0: number, r0: number, fx: boolean, fy: boolean, h: number) => {
            const ph = p.length, pw = p[0].length;
            for (let y = 0; y < ph; y++) for (let x = 0; x < pw; x++) {
                if (p[fy ? ph - 1 - y : y][fx ? pw - 1 - x : x] !== "#") continue;
                const i = wrap(c0 + x, r0 + y);
                if (wall[i]) continue;
                cur[i] = 1; age[i] = 0; heat[i] = Math.max(heat[i], h);
            }
        };

        const soup = (c0: number, r0: number, w: number, h: number, density: number) => {
            for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
                if (Math.random() > density) continue;
                const i = wrap(c0 + x, r0 + y);
                if (!wall[i]) { cur[i] = 1; age[i] = 0; }
            }
        };

        // A random open spot, so drops don't land on the wordmark.
        const openSpot = () => {
            for (let t = 0; t < 12; t++) {
                const c = Math.floor(Math.random() * cols), r = Math.floor(Math.random() * rows);
                if (!wall[wrap(c, r)] && !wall[wrap(c + 6, r + 4)] && !wall[wrap(c - 6, r - 4)]) return [c, r];
            }
            return [Math.floor(Math.random() * cols), Math.floor(Math.random() * rows)];
        };

        const inject = () => {
            const [c, r] = openSpot();
            const roll = Math.random();
            const fx = Math.random() < 0.5, fy = Math.random() < 0.5;
            if (roll < 0.35) soup(c - 5, r - 4, 11, 8, 0.42);
            else if (roll < 0.55) place(R_PENTOMINO, c, r, fx, fy, 0);
            else if (roll < 0.7) place(ACORN, c, r, fx, fy, 0);
            else if (roll < 0.8) place(DIEHARD, c, r, fx, fy, 0);
            else for (let k = 0; k < 3; k++) place(GLIDER, c + k * 6 * (fx ? -1 : 1), r + k * 2, fx, fy, 0);
        };

        const seed = () => {
            cur.fill(0); heat.fill(0); age.fill(0); trail.fill(0);
            const n = Math.max(10, Math.round((cols * rows) / 260));
            for (let k = 0; k < n; k++) inject();
        };

        const resize = () => {
            const r = canvas.getBoundingClientRect();
            if (r.width < 1 || r.height < 1) return;
            const first = W === 0;
            const oldCols = cols, oldRows = rows, old = cur, oldHeat = heat, oldAge = age;
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

            const N = cols * rows;
            cur = new Uint8Array(N); nxt = new Uint8Array(N);
            heat = new Float32Array(N); heat2 = new Float32Array(N);
            age = new Uint16Array(N); trail = new Float32Array(N);
            // Keep whatever overlaps the old board.
            for (let y = 0; y < Math.min(rows, oldRows); y++) for (let x = 0; x < Math.min(cols, oldCols); x++) {
                cur[y * cols + x] = old[y * oldCols + x];
                heat[y * cols + x] = oldHeat[y * oldCols + x];
                age[y * cols + x] = oldAge[y * oldCols + x];
            }
            measure();
            if (first) seed();
        };

        const generation = () => {
            let births = 0;
            for (let r = 0; r < rows; r++) {
                const up = ((r + rows - 1) % rows) * cols, mid = r * cols, dn = ((r + 1) % rows) * cols;
                for (let c = 0; c < cols; c++) {
                    const i = mid + c;
                    if (wall[i]) { nxt[i] = 0; heat2[i] = 0; continue; }
                    const l = c > 0 ? c - 1 : cols - 1, rt = c < cols - 1 ? c + 1 : 0;
                    const n = cur[up + l] + cur[up + c] + cur[up + rt] + cur[mid + l] + cur[mid + rt] + cur[dn + l] + cur[dn + c] + cur[dn + rt];
                    const was = cur[i];
                    let live = n === 3 || (was === 1 && n === 2);
                    if (live && was && age[i] > ERODE_AGE && Math.random() < ERODE) live = false;
                    if (live) {
                        nxt[i] = 1;
                        if (was) {
                            age[i] = Math.min(65535, age[i] + 1);
                            heat2[i] = heat[i] * 0.97;
                        } else {
                            // A newborn inherits the hottest of its three parents.
                            births++;
                            age[i] = 0;
                            let h = 0;
                            for (const j of [up + l, up + c, up + rt, mid + l, mid + rt, dn + l, dn + c, dn + rt]) if (cur[j] && heat[j] > h) h = heat[j];
                            heat2[i] = h * 0.93;
                        }
                    } else {
                        if (was) trail[i] = Math.max(trail[i], 0.7 + 0.3 * heat[i]);
                        nxt[i] = 0; heat2[i] = 0; age[i] = 0;
                    }
                }
            }
            [cur, nxt] = [nxt, cur];
            [heat, heat2] = [heat2, heat];

            // Keep it alive: drop something in now and then, sooner when it's quiet.
            activity = activity * 0.85 + births * 0.15;
            seedIn -= GEN;
            if (seedIn <= 0) {
                inject();
                seedIn = activity < cols * rows * 0.004 ? 0.5 : 2.5 + Math.random() * 2;
            }
        };

        // Paint hot cells along the cursor's path since the last frame.
        const brush = () => {
            if (!pointer.active) return;
            const dx = pointer.x - pointer.px, dy = pointer.y - pointer.py;
            const dist = Math.hypot(dx, dy);
            if (pointer.px < -1e3 || dist > W) { pointer.px = pointer.x; pointer.py = pointer.y; return; }
            const steps = Math.ceil(dist / (cs * 0.6));
            for (let s = 1; s <= steps; s++) {
                const cx = Math.floor((pointer.px + (dx * s) / steps) / cs), cy = Math.floor((pointer.py + (dy * s) / steps) / cs);
                for (let y = -2; y <= 2; y++) for (let x = -2; x <= 2; x++) {
                    if (x * x + y * y > 5 || Math.random() > 0.22) continue;
                    if (cx + x < 0 || cy + y < 0 || cx + x >= cols || cy + y >= rows) continue;
                    const i = (cy + y) * cols + cx + x;
                    if (wall[i]) continue;
                    cur[i] = 1; age[i] = 0; heat[i] = 1;
                }
            }
            pointer.px = pointer.x; pointer.py = pointer.y;
        };

        const fire = (x: number, y: number) => {
            const c = Math.floor(x / cs), r = Math.floor(y / cs);
            place(GLIDER, c + 2, r + 2, false, false, 1);
            place(GLIDER, c - 4, r + 2, true, false, 1);
            place(GLIDER, c + 2, r - 4, false, true, 1);
            place(GLIDER, c - 4, r - 4, true, true, 1);
            // A flash of trail around the launch point.
            for (let a = 0; a < 24; a++) {
                const t = (a / 24) * Math.PI * 2;
                for (const rad of [3, 5]) {
                    const cc = Math.round(c + Math.cos(t) * rad), rr = Math.round(r + Math.sin(t) * rad);
                    if (cc < 0 || rr < 0 || cc >= cols || rr >= rows) continue;
                    const i = rr * cols + cc;
                    if (!wall[i]) trail[i] = 1.2;
                }
            }
        };

        const step = (dt: number) => {
            time += dt;
            brush();
            genAcc += dt;
            if (genAcc >= GEN) { genAcc -= GEN; generation(); }
            const fade = Math.exp(-dt * 2.4);
            for (let i = 0; i < trail.length; i++) if (trail[i] > 0) trail[i] = trail[i] < 0.02 ? 0 : trail[i] * fade;
        };

        const buckets: number[][] = Array.from({ length: LEVELS * 2 }, () => []);
        const glyphs: string[] = [];
        const pos: number[] = [];

        const draw = () => {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.drawImage(bg, 0, 0);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            // The mark assembles pixel by pixel in a diagonal sweep.
            const gap = Math.max(1, cs * 0.06);
            for (const p of mark) {
                if (time < p.delay) continue;
                ctx.globalAlpha = Math.min(1, (time - p.delay) * 5);
                ctx.fillStyle = p.light ? pal.light : `rgb(${pal.red})`;
                ctx.fillRect(p.c * cs + gap / 2, p.r * cs + gap / 2, cs - gap, cs - gap);
            }
            ctx.globalAlpha = 1;

            ctx.font = `600 ${Math.round(cs * 1.02)}px ${font}`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            for (const b of buckets) b.length = 0;
            glyphs.length = 0;
            pos.length = 0;
            for (let i = 0; i < cur.length; i++) {
                if (wall[i]) continue;
                let glyph: string, bucket: number;
                if (cur[i]) {
                    const a = age[i], h = heat[i];
                    glyph = a === 0 ? "+" : a < 3 ? "x" : a < 10 ? "o" : "#";
                    if (h > 0.3) bucket = LEVELS + Math.min(LEVELS - 1, 2 + Math.floor(h * 4));
                    else bucket = a < 3 ? LEVELS - 1 : a < 10 ? LEVELS - 2 : a < ERODE_AGE ? LEVELS - 4 : LEVELS - 5;
                } else if (trail[i] > 0.08) {
                    const t = trail[i];
                    glyph = t > 0.55 ? ":" : "·";
                    bucket = LEVELS + Math.min(LEVELS - 1, Math.floor(t * 3.5));
                } else continue;
                const k = glyphs.length;
                glyphs.push(glyph);
                pos.push((i % cols + 0.5) * cs, (Math.floor(i / cols) + 0.5) * cs + 1);
                buckets[bucket].push(k);
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
            // Only redraw when the simulation moved: caps drawing at 60fps on 120Hz+ displays.
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
            time = 10;
            for (let i = 0; i < 60; i++) generation();
            trail.fill(0);
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
            const active = p.inside && e.pointerType !== "touch";
            if (active && !pointer.active) { pointer.px = p.x; pointer.py = p.y; }
            pointer.active = active;
        };
        const onDown = (e: PointerEvent) => {
            const p = local(e);
            if (p.inside && !reduced) fire(p.x, p.y);
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
