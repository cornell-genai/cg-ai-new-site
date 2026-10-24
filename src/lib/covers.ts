// ASCII cover art for the project write-ups. Each motif is a small scene drawn
// on a character grid: for every cell it returns an ink (0 = blank, 1–3 = one of
// the cover's palette colours) and a density that picks the glyph. Everything is
// deterministic, so the covers render at build time as plain SVG text.

export const COLS = 80;
export const ROWS = 48; // 80 × 0.6em wide, 48 × 1em tall: a square

const RAMP = " .,:-=+*#%@";

/** c overrides the glyph the density would pick. */
type Cell = { ink: 0 | 1 | 2 | 3; d: number; c?: string };
type Motif = (x: number, y: number) => Cell;

const blank: Cell = { ink: 0, d: 0 };

function hash(x: number, y: number, s = 0) {
    let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function segDist(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
    const dx = bx - ax, dy = by - ay;
    const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1)));
    return Math.hypot(px - ax - t * dx, py - ay - t * dy);
}

const clamp = (v: number) => Math.max(0, Math.min(1, v));

// A suspension bridge over still water: towers, cables, a deck, reflections.
const bridge: Motif = (x, y) => {
    const deck = 0.62;
    const towers = [0.27, 0.73];
    const top = 0.2;
    const cable = (u: number) => {
        if (u < towers[0]) return top + ((towers[0] - u) / towers[0]) * (deck - 0.04 - top) * 0.9;
        if (u > towers[1]) return top + ((u - towers[1]) / (1 - towers[1])) * (deck - 0.04 - top) * 0.9;
        const t = (u - towers[0]) / (towers[1] - towers[0]);
        return top + 4 * t * (1 - t) * (deck - 0.08 - top);
    };
    const cw = 1 / COLS, ch = 1 / ROWS;
    for (const t of towers) {
        if (Math.abs(x - t) < cw * 1.2 && y > top - ch && y < deck + ch) return { ink: 3, d: 0.95 };
    }
    if (Math.abs(y - deck) < ch * 0.6) return { ink: 3, d: 0.7 };
    if (Math.abs(y - deck - ch) < ch * 0.6) return { ink: 1, d: 0.3 };
    const cy = cable(x);
    if (Math.abs(y - cy) < ch * 0.7) return { ink: 2, d: 0.8 };
    const col = Math.round(x * COLS);
    if (col % 3 === 0 && y > cy && y < deck) return { ink: 2, d: 0.25 };
    if (y > deck + ch) {
        // Water: horizontal ripples, with the towers and cables mirrored faintly.
        const my = 2 * deck - y;
        const ripple = 0.5 + 0.5 * Math.sin(y * 140 + Math.sin(x * 9) * 2);
        const fade = 1 - (y - deck) / (1 - deck);
        for (const t of towers) {
            if (Math.abs(x - t + Math.sin(y * 90) * 0.006) < cw * 1.2 && my > top) return { ink: 2, d: 0.35 * fade + 0.1 };
        }
        if (Math.abs(my - cy) < ch * 0.8 && hash(col, Math.round(y * ROWS)) > 0.35) return { ink: 2, d: 0.25 * fade };
        return hash(col, Math.round(y * ROWS), 1) < 0.5 * fade * ripple ? { ink: 1, d: 0.12 + 0.2 * ripple * fade } : blank;
    }
    // Sky: a low sun and scattered dust.
    const sun = Math.hypot(x - 0.5, (y - 0.36) * 1.0);
    if (sun < 0.09) return { ink: 1, d: 0.15 + (0.09 - sun) * 2 };
    return hash(col, Math.round(y * ROWS), 2) > 0.985 ? { ink: 1, d: 0.1 } : blank;
};

// A radar sweep over a portfolio of companies; a handful get flagged.
const radar: Motif = (x, y) => {
    const cx = 0.5, cy = 0.5;
    const dx = x - cx, dy = y - cy;
    const r = Math.hypot(dx, dy);
    const col = Math.floor(x * COLS), row = Math.floor(y * ROWS);
    if (r > 0.465) return hash(col, row, 3) > 0.985 ? { ink: 1, d: 0.15 } : blank;
    // Companies: a fixed scatter of points inside the disc, two columns wide.
    const h = hash(col >> 1, row, 7);
    if (h > 0.935 && r > 0.05 && r < 0.44) {
        const flagged = hash(col >> 1, row, 9) > 0.84;
        if (flagged) return { ink: 3, d: 1, c: "@" };
        return { ink: 2, d: 0.8, c: col % 2 ? "]" : "[" };
    }
        // Sweep: dense at the leading edge, thinning out behind it.
    const a = (Math.atan2(dy, dx) + Math.PI * 2) % (Math.PI * 2);
    const behind = (5.4 - a + Math.PI * 2) % (Math.PI * 2);
    if (behind < 0.02 * (1 / Math.max(r, 0.05))) return { ink: 2, d: 0.9 };
    if (behind < 1.6) {
        const f = 1 - behind / 1.6;
        return hash(col, row, 4) < 0.25 + 0.75 * f ? { ink: f > 0.5 ? 2 : 1, d: 0.15 + 0.5 * f * f } : blank;
    }
    for (const ring of [0.15, 0.3, 0.45]) if (Math.abs(r - ring) < 0.009) return { ink: 1, d: 0.35 };
    if (Math.abs(dx) < 0.5 / COLS || Math.abs(dy) < 0.5 / ROWS) return { ink: 1, d: 0.3 };
    return blank;
};

// An apple over ploughed fields, after the association's own mark.
const orchard: Motif = (x, y) => {
    const col = Math.round(x * COLS), row = Math.round(y * ROWS);
    // Apple: two overlapping lobes with a notch on top.
    const ax = 0.5, ay = 0.42;
    const lobe = Math.min(Math.hypot(x - ax + 0.065, (y - ay) / 1.12), Math.hypot(x - ax - 0.065, (y - ay) / 1.12));
    const notch = Math.hypot(x - ax, y - (ay - 0.235)) < 0.055;
    if (lobe < 0.19 && !notch && y < 0.66) {
        const light = clamp(1 - Math.hypot(x - (ax - 0.09), y - (ay - 0.07)) / 0.28);
        return { ink: 2, d: 0.55 + 0.45 * (1 - light) };
    }
    // Leaf and stem.
    const lx = (x - 0.56) * Math.cos(0.7) + (y - 0.17) * Math.sin(0.7);
    const ly = -(x - 0.56) * Math.sin(0.7) + (y - 0.17) * Math.cos(0.7);
    if ((lx / 0.075) ** 2 + (ly / 0.03) ** 2 < 1) return { ink: 3, d: 0.75 };
    if (segDist(x, y, 0.5, 0.25, 0.51, 0.14) < 0.009) return { ink: 1, d: 0.8 };
    // Fields: curved furrows sweeping across the bottom.
    if (y > 0.6) {
        const f = y - 0.6 + 0.08 * Math.sin(x * 2.4 + 0.6) - 0.05 * x;
        const band = Math.floor(f * 22);
        const furrow = 0.5 + 0.5 * Math.sin(f * 150);
        if (f < 0) return blank;
        return { ink: 3, d: 0.15 + 0.6 * furrow * (band % 2 ? 1 : 0.55) };
    }
    return hash(col, row, 5) > 0.985 ? { ink: 1, d: 0.1 } : blank;
};

// A stack of certificates, the top one checked off.
const papers: Motif = (x, y) => {
    const cw = 1 / COLS, ch = 1 / ROWS;
    const sheets = [
        { x: 0.3, y: 0.12, w: 0.42, h: 0.62 },
        { x: 0.24, y: 0.18, w: 0.42, h: 0.62 },
        { x: 0.18, y: 0.24, w: 0.42, h: 0.62 },
    ];
    for (let i = sheets.length - 1; i >= 0; i--) {
        const s = sheets[i];
        if (x < s.x || x > s.x + s.w || y < s.y || y > s.y + s.h) continue;
        const edge = x - s.x < cw * 1.1 || s.x + s.w - x < cw * 1.1 || y - s.y < ch * 0.8 || s.y + s.h - y < ch * 0.8;
        if (edge) return { ink: i === 2 ? 1 : 2, d: 0.55 };
        if (i < 2) return blank; // only the front sheet shows its contents
        const ry = (y - s.y) / s.h, rx = (x - s.x) / s.w;
        // Check mark over the lower half of the front sheet.
        const k = Math.min(segDist(rx, ry, 0.22, 0.66, 0.42, 0.84), segDist(rx, ry, 0.42, 0.84, 0.8, 0.44));
        if (k < 0.045) return { ink: 3, d: 1 };
        const line = Math.floor(ry * 26);
        if (ry > 0.08 && ry < 0.42 && line % 3 === 0 && rx > 0.1 && rx < 0.9 - (line % 2) * 0.3) return { ink: 2, d: 0.3 };
        if (ry > 0.08 && ry < 0.12 && rx > 0.1 && rx < 0.5) return { ink: 1, d: 0.7 };
        return blank;
    }
    const col = Math.round(x * COLS), row = Math.round(y * ROWS);
    return hash(col, row, 6) > 0.975 ? { ink: 2, d: 0.12 } : blank;
};

// Little Life patterns scattered on a grid, with the Microduck in the middle.
const DUCK = [".......", "..##...", ".####..", "..###.#", "..#####", "...###.", "......."];
const SHAPES = [
    [".#.", "..#", "###"], // glider
    ["###"], // blinker
    ["##", "##"], // block
    [".##", "#.#", ".#."], // boat
];
const field: Motif = (x, y) => {
    const col = Math.floor(x * COLS), row = Math.floor(y * ROWS);
    // Duck: 7×7 pixels, each 4 columns by 2 rows, centred.
    const dx = Math.floor((col - (COLS / 2 - 14)) / 4), dy = Math.floor((row - (ROWS / 2 - 7)) / 2);
    if (dx >= 0 && dx < 7 && dy >= 0 && dy < 7) return DUCK[dy][dx] === "#" ? { ink: 3, d: 1 } : blank;
    const tx = Math.floor(col / 8), ty = Math.floor(row / 5);
    const pick = hash(tx, ty, 11);
    if (pick < 0.45) return blank;
    const s = SHAPES[Math.floor(hash(tx, ty, 12) * SHAPES.length)];
    const ox = col - tx * 8 - 2, oy = row - ty * 5 - 1;
    const c = s[oy]?.[Math.floor(ox / 1)];
    if (c !== "#") return (col + row) % 8 === 0 ? { ink: 1, d: 0.1 } : blank;
    return pick > 0.93 ? { ink: 3, d: 0.9 } : { ink: 2, d: 0.55 + 0.3 * hash(col, row, 13) };
};

// A game tree: one root, branches weighted by forecast probability, the likely
// line picked out in the highlight ink.
const tree: Motif = (x, y) => {
    const col = Math.floor(x * COLS), row = Math.floor(y * ROWS);
    const levels = [0.12, 0.42, 0.68, 0.88];
    type N = { x: number; y: number; w: number; hot: boolean };
    const root: N = { x: 0.5, y: levels[0], w: 1, hot: true };
    const nodes: N[] = [root];
    const edges: { a: N; b: N }[] = [];
    const labels: { x: number; y: number; t: string; hot: boolean }[] = [];
    [0.62, 0.27, 0.11].forEach((p, i) => {
        const n: N = { x: 0.18 + i * 0.32, y: levels[1], w: p, hot: i === 0 };
        nodes.push(n);
        edges.push({ a: root, b: n });
        labels.push({ x: (root.x + n.x) / 2 + (i === 0 ? -0.07 : i === 1 ? 0.025 : 0.06), y: (root.y + n.y) / 2, t: `.${Math.round(p * 100)}`, hot: i === 0 });
        [0.7, 0.3].forEach((q, j) => {
            const m: N = { x: n.x - 0.075 + j * 0.15, y: levels[2], w: p * q, hot: i === 0 && j === 0 };
            nodes.push(m);
            edges.push({ a: n, b: m });
            [0, 1].forEach((k) => {
                const l: N = { x: m.x - 0.03 + k * 0.06, y: levels[3], w: p * q * 0.5, hot: m.hot && k === 0 };
                nodes.push(l);
                edges.push({ a: m, b: l });
            });
        });
    });
    for (const l of labels) {
        const lc = Math.floor(l.x * COLS) - 1, lr = Math.floor(l.y * ROWS);
        if (row === lr && col >= lc && col < lc + l.t.length) return { ink: l.hot ? 3 : 2, d: 1, c: l.t[col - lc] };
    }
    for (const n of nodes) {
        const nc = Math.floor(n.x * COLS), nr = Math.floor(n.y * ROWS);
        if (row === nr && Math.abs(col - nc) <= (n.w > 0.2 ? 1 : 0)) return { ink: n.hot ? 3 : n.w > 0.1 ? 2 : 1, d: 1, c: n.w > 0.2 ? (col === nc ? "@" : col < nc ? "(" : ")") : "o" };
    }
    for (const { a, b } of edges) {
        if (y <= a.y + 0.5 / ROWS || y >= b.y - 0.5 / ROWS) continue;
        const t = (y - a.y) / (b.y - a.y);
        const ex = a.x + t * (b.x - a.x);
        if (Math.abs(x - ex) < 0.5 / COLS) {
            const slope = ((b.x - a.x) * COLS) / ((b.y - a.y) * ROWS); // columns per row
            const c = Math.abs(slope) < 0.4 ? "|" : slope > 0 ? "\\" : "/";
            return { ink: b.hot ? 3 : b.w > 0.1 ? 2 : 1, d: 1, c };
        }
    }
    return hash(col, row, 14) > 0.985 ? { ink: 1, d: 0.1 } : blank;
};

export const MOTIFS = { bridge, radar, orchard, papers, field, tree };
export type MotifName = keyof typeof MOTIFS;

/** One string per ink per row, spaces elsewhere, so layers line up in monospace. */
export function renderCover(name: MotifName): string[][] {
    const motif = MOTIFS[name];
    const layers: string[][] = [[], [], []];
    for (let r = 0; r < ROWS; r++) {
        const rows = ["", "", ""];
        for (let c = 0; c < COLS; c++) {
            const { ink, d, c: glyph } = motif((c + 0.5) / COLS, (r + 0.5) / ROWS);
            const ch = !ink ? " " : glyph ?? RAMP[Math.max(1, Math.min(RAMP.length - 1, Math.round(clamp(d) * (RAMP.length - 1))))];
            for (let i = 0; i < 3; i++) rows[i] += ink === i + 1 ? ch : " ";
        }
        rows.forEach((s, i) => layers[i].push(s));
    }
    return layers;
}
