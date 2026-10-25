"use client";

import { useEffect, useRef } from "react";
import { LOGO_RED, LOGO_SRC } from "./Mark";
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
//
// The mark is the club logo, filling the [data-swarm-mark] slot (its size, in
// whole cells, is set by the hero). It is read from the logo file into a grid
// of MARK_RES pixels per cell, swept in pixel by pixel, then
// the pixels cross-fade into the crisp vector. It plays along with the board:
// the cursor shoves its pixels aside (they spring home), pixels knocked past
// its edge land on the board as hot live cells and regrow in the logo, and a
// click on it bursts the logo and fires gliders from its corners. Whenever it
// is disturbed it drops back to pixels; once calm it resolves to the vector.

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
const MARK_RES = 6;     // logo pixels per cell: fine enough to draw the brain's traces
const CRISP_FADE = 0.35; // seconds for the vector logo to fade in over the pixels
const CRISP_DROP = 0.1; // seconds to fall back to pixels when the logo is disturbed
const CALM_HOLD = 0.12; // seconds the pixels must sit still before the vector returns
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
        // Mark pixels: home in logo-grid units; offset and velocity in px;
        // `delay` (first appearance) and `back` (regrowth after shedding) are seconds after markStart.
        type MarkPixel = { x: number; y: number; delay: number; ox: number; oy: number; vx: number; vy: number; back: number };
        let mark: MarkPixel[] = [];
        // The slot, in cells: top-left corner and size.
        let markAt: { c: number; r: number; w: number; h: number } | null = null;
        let markBuiltFor = "";
        let markStart = 0, crispAt = Infinity;
        let crisp = 0, calmFor = 0, settled = true;
        const logo = new Image();
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
            if (markEl) {
                const m = rel(markEl, 0);
                markAt = {
                    c: Math.round(m.x0 / cs), r: Math.round(m.y0 / cs),
                    w: Math.max(1, Math.round((m.x1 - m.x0) / cs)), h: Math.max(1, Math.round((m.y1 - m.y0) / cs)),
                };
                block({ x0: markAt.c * cs, y0: markAt.r * cs, x1: (markAt.c + markAt.w) * cs, y1: (markAt.r + markAt.h) * cs });
                if (logo.complete && logo.naturalWidth && markBuiltFor !== `${markAt.w}x${markAt.h}`) buildMark();
            }
            for (let i = 0; i < wall.length; i++) if (wall[i]) { cur[i] = 0; heat[i] = 0; trail[i] = 0; }
        };

        // Reads the logo into a grid of MARK_RES pixels per slot cell (only the
        // logo's own pixels) and times a diagonal sweep at the old mark's pace.
        // Rebuilt whenever the slot's size in cells changes.
        function buildMark() {
            if (!markAt) return;
            markBuiltFor = `${markAt.w}x${markAt.h}`;
            const gw = markAt.w * MARK_RES, gh = markAt.h * MARK_RES;
            const g = document.createElement("canvas");
            g.width = gw; g.height = gh;
            const gc = g.getContext("2d", { willReadFrequently: true })!;
            const w = gh * (logo.naturalWidth / logo.naturalHeight);
            gc.drawImage(logo, (gw - w) / 2, 0, w, gh);
            const alpha = gc.getImageData(0, 0, gw, gh).data;
            mark = [];
            for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
                if (alpha[(y * gw + x) * 4 + 3] < 128) continue;
                const delay = 0.4 + ((x + y) / MARK_RES) * 0.05 + Math.random() * 0.25;
                mark.push({ x, y, delay, ox: 0, oy: 0, vx: 0, vy: 0, back: 0 });
            }
            // With reduced motion the mark is simply there, crisp.
            markStart = reduced ? -Infinity : time;
            crispAt = Math.max(...mark.map((p) => p.delay)) + 0.1;
            crisp = reduced ? 1 : 0;
            calmFor = 0;
            settled = false;
        }

        const markRect = () => {
            if (!markAt) return null;
            const x0 = markAt.c * cs, y0 = markAt.r * cs;
            return { x0, y0, x1: x0 + markAt.w * cs, y1: y0 + markAt.h * cs, p: cs / MARK_RES };
        };

        // Logo pixels: the cursor shoves them, a spring pulls them home, and any
        // knocked past the logo's edge may drop onto the board as a hot live cell.
        // Drives `crisp`: pixels while disturbed, the vector once calm.
        const stepMark = (dt: number) => {
            const m = markRect();
            if (!m || !mark.length) return;
            const t = time - markStart;
            const R = cs * MARK_PUSH_R;
            const near = pointer.active && pointer.x > m.x0 - R && pointer.x < m.x1 + R && pointer.y > m.y0 - R && pointer.y < m.y1 + R;
            if (settled && !near) {
                calmFor += dt;
            } else {
                let moving = false;
                for (const px of mark) {
                    if (t < px.delay || t < px.back) { moving ||= t < px.back; continue; }
                    const hx = m.x0 + (px.x + 0.5) * m.p, hy = m.y0 + (px.y + 0.5) * m.p;
                    const damp = 2 * Math.sqrt(MARK_SPRING);
                    let ax = -px.ox * MARK_SPRING - px.vx * damp, ay = -px.oy * MARK_SPRING - px.vy * damp;
                    if (near) {
                        const dx = hx + px.ox - pointer.x, dy = hy + px.oy - pointer.y;
                        const d = Math.hypot(dx, dy);
                        if (d < R && d > 0.01) {
                            const k = (1 - d / R) ** 2 * 2600;
                            ax += (dx / d) * k; ay += (dy / d) * k;
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
                }
                settled = !moving;
                calmFor = settled ? calmFor + dt : 0;
            }
            if (t > crispAt && calmFor > CALM_HOLD) crisp = Math.min(1, crisp + dt / CRISP_FADE);
            else if (calmFor === 0) crisp = Math.max(0, crisp - dt / CRISP_DROP);
        };

        // A click on the logo blows its pixels outward from the click and fires
        // gliders from its four corners (the logo itself is a wall, so they start outside).
        const burst = (x: number, y: number) => {
            const m = markRect();
            if (!m || !markAt) return;
            for (const px of mark) {
                const dx = m.x0 + (px.x + 0.5) * m.p - x, dy = m.y0 + (px.y + 0.5) * m.p - y;
                const d = Math.hypot(dx, dy) || 1;
                const kick = 260 + Math.random() * 380;
                px.vx += (dx / d) * kick; px.vy += (dy / d) * kick;
            }
            settled = false;
            const c0 = markAt.c, r0 = markAt.r, c1 = c0 + markAt.w, r1 = r0 + markAt.h;
            place(GLIDER, c1 + 1, r1 + 1, false, false, 1);
            place(GLIDER, c0 - 4, r1 + 1, true, false, 1);
            place(GLIDER, c1 + 1, r0 - 4, false, true, 1);
            place(GLIDER, c0 - 4, r0 - 4, true, true, 1);
        };
        const onMark = (x: number, y: number) => {
            const m = markRect();
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

            // The mark: pixels (sweeping in, or shoved about) cross-faded with the crisp logo.
            const m = markRect();
            if (m && mark.length) {
                const t = time - markStart;
                if (crisp < 1) {
                    const gap = m.p * 0.12;
                    ctx.fillStyle = LOGO_RED;
                    for (const px of mark) {
                        const from = Math.max(px.delay, px.back);
                        if (t < from) continue;
                        ctx.globalAlpha = Math.min(1, (t - from) * 5) * (1 - crisp);
                        ctx.fillRect(m.x0 + px.x * m.p + px.ox + gap / 2, m.y0 + px.y * m.p + px.oy + gap / 2, m.p - gap, m.p - gap);
                    }
                }
                if (crisp > 0) {
                    ctx.globalAlpha = crisp;
                    const h = m.y1 - m.y0, w = h * (logo.naturalWidth / logo.naturalHeight);
                    ctx.drawImage(logo, (m.x0 + m.x1 - w) / 2, m.y0, w, h);
                }
                ctx.globalAlpha = 1;
            }

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
            if (!p.inside || reduced) return;
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
        logo.src = LOGO_SRC;
        logo.decode().then(() => {
            if (disposed) return;
            buildMark();
            if (W > 0 && !running) draw();
        }, () => { /* no logo, no mark: the board still runs */ });
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
