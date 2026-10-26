"use client";

import { useEffect, useRef } from "react";
import { LOGO_RED } from "./Mark";
import { PIXEL_LOGO } from "./pixelLogo";
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
// drawn, it and [data-swarm-avoid] text are dead zones that life never
// enters, and the cell size is published as --swarm-cell.
//
// The mark is the club logo in the [data-swarm-mark] slot, as pixel art
// (pixelLogo.ts) in the board's own square-pixel style. The SVG in the DOM is
// only a stand-in until those pixels are drawn. The mark plays along with the
// board: the cursor shoves its pixels aside (they spring home), pixels knocked
// past its edge land on the board as hot live cells and regrow in the logo,
// and a click on it bursts the logo and fires gliders from its corners.

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
const MARK_SPRING = 70; // pull home (stiffness, 1/s²); damping is set for no overshoot
const MARK_PUSH_R = 3.5; // cursor reach on the logo, in cells
const MARK_SHED = 0.08; // per-step chance a pixel knocked past the edge drops onto the board
const MARK_REGROW = [0.5, 1]; // seconds before a shed pixel reappears, min / max

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
        const vector = root.querySelector<HTMLElement>(".life-mark");
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
        let reduced = motion.matches;
        const font = getComputedStyle(document.body).getPropertyValue("--font-geist-mono").trim() || "monospace";
        const bg = document.createElement("canvas");

        let W = 0, H = 0, dpr = 1, cs = 12, cols = 0, rows = 0;
        let cur = new Uint8Array(0), nxt = new Uint8Array(0);
        let heat = new Float32Array(0), heat2 = new Float32Array(0);
        let age = new Uint16Array(0);
        let trail = new Float32Array(0);
        let wall = new Uint8Array(0); // text and mark cells: always dead, never drawn over
        // Mark pixels: home in logo-grid units; offset and velocity in px.
        // `back` is the regrowth time after shedding, in seconds after markStart.
        type MarkPixel = { x: number; y: number; ox: number; oy: number; vx: number; vy: number; back: number };
        let mark: MarkPixel[] = [];
        // The mark's area in px (the slot, plus any overhang); its size in logo pixels, their size `p` in px,
        // and where the pixels start (centred on the slot).
        let markAt: (Rect & { gw: number; gh: number; p: number; left: number; top: number }) | null = null;
        let markStart = 0;
        let settled = true;
        let time = 0, genAcc = 0, seedIn = 2, activity = 0;
        const pointer = { x: -1e4, y: -1e4, px: -1e4, py: -1e4, active: false };

        let pal = PALETTES.dark;
        let styles: string[][] = [];
        const setPalette = (t: Theme) => {
            // Paint the board in the page's own background so the hero runs into the body seamlessly.
            const night = getComputedStyle(document.documentElement).getPropertyValue("--color-night").trim();
            pal = { ...PALETTES[t], bg: night || PALETTES[t].bg };
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
            markAt = null;
            if (markEl && markEl.getClientRects().length > 0) {
                const e = markEl.getBoundingClientRect();
                // Logo pixels as near the slot's size as whole device pixels allow, so every one is crisp and the
                // same size. Centred, so rounding up overhangs the slot a little on each side, and the overhang is walled too.
                const gw = PIXEL_LOGO[0].length, gh = PIXEL_LOGO.length;
                const p = Math.max(1, Math.round(Math.min(e.width / gw, e.height / gh) * dpr)) / dpr;
                const left = e.left - r.left + (e.width - gw * p) / 2, top = e.top - r.top + (e.height - gh * p) / 2;
                markAt = {
                    x0: Math.min(e.left - r.left, left), y0: Math.min(e.top - r.top, top),
                    x1: Math.max(e.right - r.left, left + gw * p), y1: Math.max(e.bottom - r.top, top + gh * p),
                    gw, gh, p, left, top,
                };
                block(markAt);
            }
            for (let i = 0; i < wall.length; i++) if (wall[i]) { cur[i] = 0; heat[i] = 0; trail[i] = 0; }
        };

        // Every logo pixel, at home: for pointer interaction, not an entrance.
        function buildMark() {
            mark = [];
            PIXEL_LOGO.forEach((row, y) => {
                for (let x = 0; x < row.length; x++) if (row[x] === "#") mark.push({ x, y, ox: 0, oy: 0, vx: 0, vy: 0, back: 0 });
            });
            // Start fully present. Pixel motion belongs to interaction, not loading.
            markStart = time;
            settled = true;
        }

        // Logo pixels: the cursor shoves them, a spring pulls them home, and any
        // knocked past the logo's edge may drop onto the board as a hot live cell.
        const stepMark = (dt: number) => {
            const m = markAt;
            if (!m || !mark.length) return;
            const t = time - markStart;
            const R = cs * MARK_PUSH_R;
            const near = pointer.active && onMark(pointer.x, pointer.y);
            if (settled && !near) return;
            let moving = false;
            for (const px of mark) {
                if (t < px.back) { moving = true; continue; }
                const hx = m.left + (px.x + 0.5) * m.p, hy = m.top + (px.y + 0.5) * m.p;
                const damp = 2 * Math.sqrt(MARK_SPRING);
                let ax = -px.ox * MARK_SPRING - px.vx * damp, ay = -px.oy * MARK_SPRING - px.vy * damp;
                let pushed = false;
                if (near) {
                    const dx = hx + px.ox - pointer.x, dy = hy + px.oy - pointer.y;
                    const d = Math.hypot(dx, dy);
                    if (d < R && d > 0.01) {
                        const k = (1 - d / R) ** 2 * 2600;
                        ax += (dx / d) * k; ay += (dy / d) * k;
                        pushed = true;
                    }
                }
                px.vx += ax * dt; px.vy += ay * dt;
                px.ox += px.vx * dt; px.oy += px.vy * dt;
                const x = hx + px.ox, y = hy + px.oy;
                const outside = x < m.x0 || x > m.x1 || y < m.y0 || y > m.y1;
                if (outside && Math.random() < MARK_SHED) {
                    const c = Math.floor(x / cs), r = Math.floor(y / cs);
                    if (c >= 0 && r >= 0 && c < cols && r < rows && !wall[r * cols + c]) {
                        const i = r * cols + c;
                        cur[i] = 1; age[i] = 0; heat[i] = 1;
                    }
                    px.ox = px.oy = px.vx = px.vy = 0;
                    px.back = t + MARK_REGROW[0] + Math.random() * (MARK_REGROW[1] - MARK_REGROW[0]);
                    moving = true;
                    continue;
                }
                if (Math.abs(px.ox) + Math.abs(px.oy) > 0.5 || Math.abs(px.vx) + Math.abs(px.vy) > 4) moving = true;
                // Close and slow: put it exactly home. The spring only approaches home, and the
                // sub-pixel leftover snaps to a whole device pixel when drawn, which reads as a broken edge.
                else if (!pushed) px.ox = px.oy = px.vx = px.vy = 0;
            }
            settled = !moving;
        };

        // A click on the logo blows its pixels outward from the click and fires
        // gliders from its four corners (the logo itself is a wall, so they start outside).
        const burst = (x: number, y: number) => {
            const m = markAt;
            if (!m) return;
            for (const px of mark) {
                const dx = m.left + (px.x + 0.5) * m.p - x, dy = m.top + (px.y + 0.5) * m.p - y;
                const d = Math.hypot(dx, dy) || 1;
                const kick = 260 + Math.random() * 380;
                px.vx += (dx / d) * kick; px.vy += (dy / d) * kick;
            }
            settled = false;
            const c0 = Math.floor(m.x0 / cs), r0 = Math.floor(m.y0 / cs), c1 = Math.ceil(m.x1 / cs), r1 = Math.ceil(m.y1 / cs);
            place(GLIDER, c1 + 1, r1 + 1, false, false, 1);
            place(GLIDER, c0 - 4, r1 + 1, true, false, 1);
            place(GLIDER, c1 + 1, r0 - 4, false, true, 1);
            place(GLIDER, c0 - 4, r0 - 4, true, true, 1);
        };
        const onMark = (x: number, y: number) => {
            const m = markAt;
            return !!m && x >= m.x0 && x <= m.x1 && y >= m.y0 && y <= m.y1;
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
            stepMark(dt);
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

            // The pixel logo. The vector in the DOM covers the gap before fonts,
            // JS, or the canvas are ready, and is hidden once the pixels are drawn.
            const m = markAt;
            if (m && mark.length) {
                const t = time - markStart;
                // Solid pixels on a whole-device-pixel pitch (see measure), so neighbours meet without seams.
                const snap = (v: number) => Math.round(v * dpr) / dpr;
                ctx.fillStyle = LOGO_RED;
                for (const px of mark) {
                    if (t < px.back) continue;
                    ctx.globalAlpha = Math.min(1, (t - px.back) * 5);
                    ctx.fillRect(snap(m.left + px.ox) + px.x * m.p, snap(m.top + px.oy) + px.y * m.p, m.p, m.p);
                }
                ctx.globalAlpha = 1;
                if (vector && canvas.dataset.ready && vector.style.opacity !== "0") vector.style.opacity = "0";
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

        const onMotionChange = () => {
            reduced = motion.matches;
            if (reduced) {
                stop();
                pointer.active = false;
                buildMark();
                if (W > 0) still();
            } else start();
        };

        const local = (e: PointerEvent) => {
            const r = canvas.getBoundingClientRect();
            const x = e.clientX - r.left, y = e.clientY - r.top;
            return { x, y, inside: x >= 0 && y >= 0 && x <= r.width && y <= r.height };
        };
        const onMove = (e: PointerEvent) => {
            const p = local(e);
            pointer.x = p.x; pointer.y = p.y;
            const active = p.inside && !reduced && e.pointerType !== "touch";
            if (active && !pointer.active) { pointer.px = p.x; pointer.py = p.y; }
            pointer.active = active;
        };
        const onDown = (e: PointerEvent) => {
            const p = local(e);
            if (!p.inside || reduced) return;
            if ((e.target as Element).closest?.("a, button, input, select, textarea")) return;
            if (onMark(p.x, p.y)) burst(p.x, p.y); else fire(p.x, p.y);
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
        motion.addEventListener("change", onMotionChange);
        buildMark();
        document.fonts.load(`600 16px ${font}`).finally(() => {
            if (disposed) return;
            resize();
            canvas.dataset.ready = "true";
            if (reduced) still(); else draw();
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
            if (vector) vector.style.opacity = "";
            motion.removeEventListener("change", onMotionChange);
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
            className={`absolute inset-0 h-full w-full opacity-0 data-[ready=true]:opacity-100 ${className ?? ""}`}
        />
    );
}
