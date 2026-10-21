"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// ASCII renderer in two WebGL passes:
//   1. The scene (a domain-warped gradient sky, optionally McGraw Tower) is
//      evaluated once per character cell into a tiny offscreen texture.
//   2. A full-resolution pass maps each cell's brightness to a glyph from a
//      font atlas and tints it from the palette.
// Pass 1 is the only expensive one and it runs at ~1/100th of screen
// resolution, so this stays cheap even on laptops on battery.

export type Scene = "tower" | "field";

const RAMP = " .,:-=+*#%@";

const VERT = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

const NOISE = `
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}
float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * snoise(p); p = p * 2.03 + 11.7; a *= 0.5; }
    return v;
}
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
`;

// Output: r = brightness, g = palette position, b = 1 inside dark silhouettes.
const SCENE_FRAG = `
precision highp float;
uniform vec2 uGrid;
uniform vec2 uCanvas;
uniform float uTime;
uniform float uTower;
uniform float uTowerX;
uniform sampler2D uImage;
uniform float uUseImage;
uniform vec2 uImgScale;
${NOISE}

float box(vec2 p, vec2 c, vec2 h) { vec2 d = abs(p - c) - h; return max(d.x, d.y); }

// McGraw Tower and its neighbours, in units of panel height (y up, 0 = bottom).
float tower(vec2 p) {
    float s = 1e3;
    s = min(s, box(p, vec2(0.0, 0.36), vec2(0.062, 0.26)));        // shaft
    s = min(s, box(p, vec2(0.0, 0.585), vec2(0.068, 0.06)));       // belfry
    s = min(s, box(p, vec2(0.0, 0.648), vec2(0.075, 0.008)));      // cornice
    float k = clamp((p.y - 0.655) / 0.27, 0.0, 1.0);               // spire
    s = min(s, max(abs(p.x) - 0.066 * (1.0 - k), max(0.655 - p.y, p.y - 0.925)));
    s = min(s, box(vec2(abs(p.x), p.y), vec2(0.07, 0.675), vec2(0.006, 0.025))); // pinnacles
    s = min(s, box(p, vec2(0.0, 0.94), vec2(0.002, 0.02)));        // finial
    // Library roofline to the right
    float roof = 0.27 + 0.06 * (1.0 - abs(fract((p.x - 0.07) / 0.18) * 2.0 - 1.0));
    s = min(s, max(box(p, vec2(0.36, 0.14), vec2(0.30, 0.14)), p.y - roof));
    s = min(s, box(p, vec2(0.33, 0.34), vec2(0.03, 0.07)));        // turret
    float tk = clamp((p.y - 0.41) / 0.09, 0.0, 1.0);
    s = min(s, max(abs(p.x - 0.33) - 0.036 * (1.0 - tk), max(0.41 - p.y, p.y - 0.50)));
    return s;
}

// Dark details cut into the stone: belfry arches, clock face, windows.
float cutouts(vec2 p) {
    vec2 q = vec2(abs(p.x), p.y);
    float l = step(box(q, vec2(0.024, 0.58), vec2(0.011, 0.04)), 0.0);
    float c = length(p - vec2(0.0, 0.46));
    l = max(l, step(abs(c - 0.03), 0.004) + step(c, 0.006));
    vec2 id = floor(vec2((p.x - 0.09) / 0.05, (p.y - 0.04) / 0.075));
    vec2 w = vec2(fract((p.x - 0.09) / 0.05), fract((p.y - 0.04) / 0.075));
    float win = step(abs(w.x - 0.5), 0.14) * step(abs(w.y - 0.5), 0.24);
    win *= step(box(p, vec2(0.37, 0.14), vec2(0.26, 0.09)), 0.0);
    l = max(l, win * step(0.4, hash(id)));
    return l;
}

void main() {
    vec2 cell = floor(gl_FragCoord.xy);
    vec2 p = (cell + 0.5) / uGrid * uCanvas / uCanvas.y;
    float t = uTime;

    if (uUseImage > 0.5) {
        // Photo mode: cover-fit the image, with a slow heat-haze drift.
        vec2 uv = (cell + 0.5) / uGrid;
        uv += 0.004 * vec2(snoise(uv * 3.0 + t * 2.0), snoise(uv * 3.0 - t * 2.0 + 7.0));
        vec3 c = texture2D(uImage, (uv - 0.5) * uImgScale + 0.5).rgb;
        float l = dot(c, vec3(0.299, 0.587, 0.114));
        l += (hash(cell + floor(t * 40.0)) - 0.5) * 0.05;
        gl_FragColor = vec4(c, clamp(l, 0.0, 1.0));
        return;
    }

    vec2 sp = p * 1.15 + vec2(0.0, -t * 0.15);
    vec2 q = vec2(fbm(sp + vec2(0.0, t * 0.6)), fbm(sp + vec2(5.2, 1.3) - t * 0.4));
    vec2 r = vec2(fbm(sp + 1.7 * q + vec2(1.7, 9.2) + t * 0.5), fbm(sp + 1.7 * q + vec2(8.3, 2.8) - t * 0.3));
    float v = fbm(sp + 1.9 * r);

    float pal = clamp(v * 0.9 + 0.55 - p.y * 0.25, 0.0, 1.0);
    float lum = clamp(0.62 + v * 0.95, 0.0, 1.0);
    float sil = 0.0;

    if (uTower > 0.5) {
        vec2 tp = p - vec2(uTowerX * uCanvas.x / uCanvas.y, 0.0);
        // Quieter sky so the tower reads, with a warm glow behind it.
        float glow = exp(-dot(tp - vec2(0.0, 0.5), tp - vec2(0.0, 0.5)) * 3.0);
        lum = clamp(0.08 + lum * 0.42 + glow * 0.14, 0.0, 1.0);
        pal = clamp(pal + 0.08, 0.0, 1.0);
        pal = clamp(pal * 0.85 + glow * 0.3, 0.0, 1.0);

        float hill = 0.085 + 0.05 * smoothstep(-0.7, 0.6, tp.x) + 0.01 * snoise(vec2(p.x * 3.0, 1.0));
        if (p.y < hill) {
            sil = 0.5;
            lum = 0.06 + (fbm(p * vec2(20.0, 34.0)) * 0.5 + 0.5) * 0.16;
            pal = 0.1;
        } else if (tower(tp) < 0.0) {
            // Lit stone: brighter on the sun side, coursed with fine noise.
            sil = 1.0;
            float side = tp.x < 0.2 ? smoothstep(0.08, -0.08, tp.x) : 0.35;
            float stone = fbm(p * vec2(26.0, 60.0)) * 0.5 + 0.5;
            lum = 0.66 + side * 0.22 + stone * 0.12;
            if (cutouts(tp) > 0.0) lum = 0.04;
            pal = 0.0;
        }
    }

    // Per-cell shimmer so the field feels alive even when the gradient is slow.
    lum += (hash(cell + floor(t * 40.0)) - 0.5) * 0.06;
    gl_FragColor = vec4(clamp(lum, 0.0, 1.0), pal, sil, 1.0);
}
`;

const GLYPH_FRAG = `
precision highp float;
uniform sampler2D uScene;
uniform sampler2D uAtlas;
uniform vec2 uGrid;
uniform vec2 uCell;
uniform vec2 uMouse;
uniform float uMouseAmt;
uniform float uLens;
uniform float uScan;
uniform vec3 uBg;
uniform vec3 uInk;
uniform vec3 uStone;
uniform vec3 uC[6];
uniform float uUseImage;

vec3 pal(float t) {
    t = clamp(t, 0.0, 0.9999) * 5.0;
    vec3 c = uC[0];
    for (int i = 0; i < 5; i++) c = mix(c, uC[i + 1], smoothstep(0.0, 1.0, clamp(t - float(i), 0.0, 1.0)));
    return c;
}

void main() {
    vec2 frag = gl_FragCoord.xy;
    vec2 cell = floor(frag / uCell);
    vec2 local = fract(frag / uCell);
    vec4 s = texture2D(uScene, (cell + 0.5) / uGrid);
    float lum = uUseImage > 0.5 ? smoothstep(0.06, 0.95, dot(s.rgb, vec3(0.299, 0.587, 0.114))) : s.r;
    float region = s.b * (1.0 - uUseImage); // 0 sky, 0.5 ground, 1 stone

    // A soft scanline sweeps down the field, briefly densifying glyphs.
    float row = 1.0 - (cell.y + 0.5) / uGrid.y;
    float scan = exp(-pow((row - uScan) * 14.0, 2.0));
    lum = clamp(lum + scan * 0.18 * step(region, 0.25), 0.0, 1.0);

    float n = ${RAMP.length.toFixed(1)};
    float idx = floor(lum * (n - 0.001));
    float g = texture2D(uAtlas, vec2((idx + local.x) / n, 1.0 - local.y)).r;

    vec3 tint = pal(s.g);
    if (region > 0.75) tint = mix(uStone * 0.75, uStone, lum);
    else if (region > 0.25) tint = mix(uInk, pal(0.2), 0.5);
    if (uUseImage > 0.5) {
        float m = max(s.r, max(s.g, s.b));
        tint = min(s.rgb / max(m, 0.2) * mix(0.75, 1.0, lum), 1.0); // full-brightness hue
    }
    vec3 col = mix(uBg, tint, g * (region > 0.75 ? 1.0 : mix(0.7, 1.15, lum)));

    // Cursor lens: glyphs resolve into solid pixels of the underlying gradient.
    vec2 cc = (cell + 0.5) * uCell;
    float d = length(cc - uMouse);
    float lens = (1.0 - smoothstep(uLens * 0.55, uLens, d)) * uMouseAmt;
    vec2 inset = step(vec2(0.08), local) * step(local, vec2(0.92));
    vec3 fill = uUseImage > 0.5 ? s.rgb : pal(s.g) * mix(0.35, 1.05, lum);
    vec3 block = mix(uBg, fill, inset.x * inset.y);
    col = mix(col, block, lens);

    gl_FragColor = vec4(col, 1.0);
}
`;

function hexToRgb(hex: string): [number, number, number] {
    const n = parseInt(hex.slice(1), 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function buildAtlas(fontFamily: string) {
    const cw = 40, ch = 64;
    const c = document.createElement("canvas");
    c.width = cw * RAMP.length;
    c.height = ch;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#fff";
    ctx.font = `500 ${ch * 0.78}px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    [...RAMP].forEach((g, i) => ctx.fillText(g, i * cw + cw / 2, ch * 0.54));
    return c;
}

type Props = {
    palette: readonly string[];
    scene?: Scene;
    cell?: number;
    towerX?: number;
    image?: string;
    background?: string;
    className?: string;
};

export default function AsciiField({ palette, scene = "field", cell = 9, towerX = 0.72, image, background = "#07070a", className }: Props) {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
        if (!gl) return;
        let disposed = false;

        const program = (frag: string) => {
            const p = gl.createProgram()!;
            for (const [type, src] of [[gl.VERTEX_SHADER, VERT], [gl.FRAGMENT_SHADER, frag]] as const) {
                const s = gl.createShader(type)!;
                gl.shaderSource(s, src);
                gl.compileShader(s);
                gl.attachShader(p, s);
            }
            gl.linkProgram(p);
            return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null;
        };
        const sceneProg = program(SCENE_FRAG);
        const glyphProg = program(GLYPH_FRAG);
        if (!sceneProg || !glyphProg) return;

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        for (const p of [sceneProg, glyphProg]) {
            const loc = gl.getAttribLocation(p, "a");
            gl.enableVertexAttribArray(loc);
            gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        }

        const texture = () => {
            const t = gl.createTexture()!;
            gl.bindTexture(gl.TEXTURE_2D, t);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            return t;
        };
        const sceneTex = texture();
        const imageTex = texture();
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        let imgAspect = 0;
        const atlasTex = texture();
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        const fbo = gl.createFramebuffer();

        const su = (n: string) => gl.getUniformLocation(sceneProg, n);
        const gu = (n: string) => gl.getUniformLocation(glyphProg, n);

        gl.useProgram(glyphProg);
        gl.uniform1i(gu("uScene"), 0);
        gl.uniform1i(gu("uAtlas"), 1);
        gl.uniform3fv(gu("uC[0]"), new Float32Array(palette.flatMap(hexToRgb)));
        gl.uniform3fv(gu("uBg"), hexToRgb(background));
        gl.uniform3fv(gu("uInk"), hexToRgb(palette[0]));
        gl.uniform3fv(gu("uStone"), hexToRgb("#f6e7d4"));
        gl.useProgram(sceneProg);
        gl.uniform1f(su("uTower"), scene === "tower" ? 1 : 0);
        gl.uniform1i(su("uImage"), 2); // never unit 0: that one holds the FBO target

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let grid = [1, 1];
        let cellPx = cell * dpr;

        const resize = () => {
            const { width, height } = canvas.getBoundingClientRect();
            const narrow = width < 640;
            cellPx = Math.round((narrow ? cell * 0.8 : cell) * dpr);
            canvas.width = Math.max(1, Math.round(width * dpr));
            canvas.height = Math.max(1, Math.round(height * dpr));
            const cellH = Math.round(cellPx * 1.7);
            grid = [Math.ceil(canvas.width / cellPx), Math.ceil(canvas.height / cellH)];

            gl.bindTexture(gl.TEXTURE_2D, sceneTex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, grid[0], grid[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, sceneTex, 0);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

            gl.useProgram(sceneProg);
            gl.uniform2f(su("uGrid"), grid[0], grid[1]);
            gl.uniform2f(su("uCanvas"), canvas.width, canvas.height);
            gl.uniform1f(su("uTowerX"), narrow ? 0.62 : towerX);
            if (imgAspect) {
                const ca = canvas.width / canvas.height;
                gl.uniform2f(su("uImgScale"), ca > imgAspect ? 1 : ca / imgAspect, ca > imgAspect ? imgAspect / ca : 1);
            }
            gl.useProgram(glyphProg);
            gl.uniform2f(gu("uGrid"), grid[0], grid[1]);
            gl.uniform2f(gu("uCell"), cellPx, cellH);
            gl.uniform1f(gu("uLens"), 150 * dpr);
        };

        const mouse = { x: 0, y: 0, tx: 0, ty: 0, amt: 0, tamt: 0 };
        const onMove = (e: PointerEvent) => {
            const r = canvas.getBoundingClientRect();
            const x = e.clientX - r.left, y = e.clientY - r.top;
            const inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
            mouse.tx = x * dpr;
            mouse.ty = (r.height - y) * dpr;
            if (inside && mouse.amt < 0.01) { mouse.x = mouse.tx; mouse.y = mouse.ty; }
            mouse.tamt = inside && e.pointerType === "mouse" ? 1 : 0;
        };

        let time = 0;
        let last = performance.now();
        let raf = 0;
        let running = false;

        const draw = () => {
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
            gl.viewport(0, 0, grid[0], grid[1]);
            gl.useProgram(sceneProg);
            gl.uniform1f(su("uTime"), time);
            gl.activeTexture(gl.TEXTURE2);
            gl.bindTexture(gl.TEXTURE_2D, imageTex);
            gl.drawArrays(gl.TRIANGLES, 0, 3);

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.useProgram(glyphProg);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, sceneTex);
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, atlasTex);
            gl.uniform2f(gu("uMouse"), mouse.x, mouse.y);
            gl.uniform1f(gu("uMouseAmt"), mouse.amt);
            gl.uniform1f(gu("uScan"), ((time * 2.2) % 1.6) - 0.3);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        };

        const frame = (now: number) => {
            const dt = Math.min(now - last, 50) / 1000;
            last = now;
            time += dt * 0.05;
            const k = 1 - Math.pow(0.0005, dt);
            mouse.x += (mouse.tx - mouse.x) * k;
            mouse.y += (mouse.ty - mouse.y) * k;
            mouse.amt += (mouse.tamt - mouse.amt) * Math.min(1, dt * 6);
            draw();
            raf = requestAnimationFrame(frame);
        };
        const start = () => {
            if (running || reduced || document.hidden) return;
            running = true;
            last = performance.now();
            raf = requestAnimationFrame(frame);
        };
        const stop = () => { running = false; cancelAnimationFrame(raf); };

        let visible = false;
        const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); else stop(); });
        const ro = new ResizeObserver(() => { resize(); if (!running) draw(); });
        const onVis = () => (document.hidden ? stop() : visible && start());

        // Glyphs need the real font, so wait for it before the first frame.
        const family = getComputedStyle(document.body).getPropertyValue("--font-geist-mono").trim() || "monospace";
        const loadImage = new Promise<void>((resolve) => {
            if (!image) return resolve();
            const img = new Image();
            img.onload = () => {
                if (disposed) return resolve();
                gl.bindTexture(gl.TEXTURE_2D, imageTex);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
                imgAspect = img.naturalWidth / img.naturalHeight;
                gl.useProgram(sceneProg);
                gl.uniform1i(su("uImage"), 2);
                gl.uniform1f(su("uUseImage"), 1);
                gl.useProgram(glyphProg);
                gl.uniform1f(gu("uUseImage"), 1);
                resolve();
            };
            img.onerror = () => resolve(); // falls back to the generative scene
            img.src = image;
        });

        Promise.all([document.fonts.ready, loadImage]).then(() => {
            if (disposed) return;
            gl.bindTexture(gl.TEXTURE_2D, atlasTex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, buildAtlas(family));
            resize();
            time = 3.0;
            draw();
            canvas.dataset.ready = "true";
            ro.observe(canvas);
            io.observe(canvas);
            document.addEventListener("visibilitychange", onVis);
            if (!reduced) window.addEventListener("pointermove", onMove, { passive: true });
        });

        return () => {
            disposed = true;
            stop();
            io.disconnect();
            ro.disconnect();
            document.removeEventListener("visibilitychange", onVis);
            window.removeEventListener("pointermove", onMove);
            gl.getExtension("WEBGL_lose_context")?.loseContext();
        };
    }, [palette, scene, cell, towerX, image, background]);

    return (
        <div className={cn("absolute inset-0 overflow-hidden", className)} style={{ background }}>
            <canvas
                ref={ref}
                aria-hidden
                className="h-full w-full opacity-0 transition-opacity duration-1000 data-[ready=true]:opacity-100"
            />
        </div>
    );
}
