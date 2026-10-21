"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// Posterised blue halftone. A small, blurred source image (or, without one,
// a soft noise field) is reduced to four tones and drawn as a dot screen.
// The image behaves a little like water: the cursor pushes the dots aside
// and a click sends a ripple through them. Rendering is on demand, so a
// still image costs nothing.

export const TONES = ["#3446d8", "#5d6cef", "#9ba4f5", "#d3d6fb"]; // dark → light

const VERT = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform sampler2D uImg;
uniform float uHasImg;
uniform vec2 uRes;
uniform float uPitch;
uniform vec2 uImgScale;
uniform vec2 uFocus;
uniform vec2 uMouse;
uniform float uMouseAmt;
uniform float uTime;
uniform vec3 uRipple[4];
uniform vec3 uTone[4];
uniform float uFade;
uniform float uSeed;

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float field(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.1; a *= 0.5; }
    return v;
}
float bayer2(vec2 a) { a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }

void main() {
    vec2 frag = gl_FragCoord.xy;
    vec2 cell = floor(frag / uPitch);
    vec2 center = (cell + 0.5) * uPitch;

    // Water: the cursor pushes the image away, ripples travel outwards.
    vec2 disp = vec2(0.0);
    vec2 dm = center - uMouse;
    float R = 120.0;
    disp += normalize(dm + 0.001) * exp(-dot(dm, dm) / (R * R)) * uMouseAmt * 26.0;
    for (int i = 0; i < 4; i++) {
        vec3 rp = uRipple[i];
        float age = uTime - rp.z;
        if (age < 0.0 || age > 2.5) continue;
        vec2 d = center - rp.xy;
        float dist = length(d);
        float ring = exp(-pow((dist - age * 420.0) / 50.0, 2.0)) * exp(-age * 1.6);
        disp += normalize(d + 0.001) * ring * 22.0;
    }

    vec2 p = center - disp;
    vec2 uv = p / uRes;
    float lum;
    if (uHasImg > 0.5) {
        vec3 c = texture2D(uImg, (uv - 0.5) * uImgScale + uFocus).rgb;
        lum = dot(c, vec3(0.299, 0.587, 0.114));
    } else {
        lum = smoothstep(0.3, 0.72, field(p / 340.0 + uSeed)); // broad blobs with open paper between
    }

    // Four tones, with ordered dither between them so edges stay soft.
    float t = clamp(lum, 0.0, 1.0) * 4.0 + (bayer4(cell) - 0.5) * 0.9;
    float level = clamp(floor(t), 0.0, 4.0);
    vec3 col = uTone[0];
    if (level > 0.5) col = uTone[1];
    if (level > 1.5) col = uTone[2];
    if (level > 2.5) col = uTone[3];

    // Darker tones get fuller dots; the lightest band is bare paper.
    float r = uPitch * mix(0.5, 0.3, level / 3.0);
    float a = level > 3.5 ? 0.0 : 1.0 - smoothstep(r - 0.7, r + 0.7, length(frag - center));

    vec2 q = frag / uRes;
    if (uFade > 0.5 && uFade < 1.5) a *= smoothstep(0.0, 0.42, q.y);                      // fade to the bottom
    if (uFade > 1.5) a *= smoothstep(0.0, 0.5, min(min(q.x, 1.0 - q.x), min(q.y, 1.0 - q.y)) * 2.2); // soft edges
    gl_FragColor = vec4(col * a, a);
}
`;

function hexToRgb(hex: string): [number, number, number] {
    const n = parseInt(hex.slice(1), 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

type Props = {
    src?: string;
    alt?: string;
    pitch?: number;
    /** Point of the image (0–1 from top-left) kept in frame when cropping. */
    focus?: [number, number];
    fade?: "none" | "bottom" | "edges";
    tones?: string[];
    seed?: number;
    className?: string;
};

export default function Halftone({ src, alt, pitch = 4, focus = [0.5, 0.5], fade = "none", tones = TONES, seed = 0, className }: Props) {
    const ref = useRef<HTMLCanvasElement>(null);
    const [fx, fy] = focus;
    const toneKey = tones.join(",");

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: true, powerPreference: "low-power" });
        if (!gl) return;
        let disposed = false;

        const prog = gl.createProgram()!;
        for (const [type, code] of [[gl.VERTEX_SHADER, VERT], [gl.FRAGMENT_SHADER, FRAG]] as const) {
            const s = gl.createShader(type)!;
            gl.shaderSource(s, code);
            gl.compileShader(s);
            gl.attachShader(prog, s);
        }
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
        gl.useProgram(prog);

        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, "a");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        const u = (n: string) => gl.getUniformLocation(prog, n);
        gl.uniform3fv(u("uTone[0]"), new Float32Array(toneKey.split(",").flatMap(hexToRgb)));
        gl.uniform1f(u("uFade"), fade === "bottom" ? 1 : fade === "edges" ? 2 : 0);
        gl.uniform1f(u("uSeed"), seed * 17.3);
        gl.uniform1i(u("uImg"), 0);

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const state = { mx: -1e4, my: -1e4, tx: -1e4, ty: -1e4, amt: 0, tamt: 0 };
        const ripples = new Float32Array(12).fill(-100);
        let rippleIdx = 0;
        let imgAspect = 1;
        let ready = false;
        let raf = 0;
        const t0 = performance.now();
        const now = () => (performance.now() - t0) / 1000;

        const resize = () => {
            const { width, height } = canvas.getBoundingClientRect();
            if (width < 1 || height < 1) return;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform2f(u("uRes"), canvas.width, canvas.height);
            gl.uniform1f(u("uPitch"), Math.max(3, Math.round(pitch * dpr)));
            const ca = width / height;
            const sx = ca > imgAspect ? 1 : ca / imgAspect, sy = ca > imgAspect ? imgAspect / ca : 1;
            gl.uniform2f(u("uImgScale"), sx, sy);
            gl.uniform2f(u("uFocus"), Math.min(1 - sx / 2, Math.max(sx / 2, fx)), Math.min(1 - sy / 2, Math.max(sy / 2, 1 - fy)));
        };

        const draw = () => {
            gl.uniform1f(u("uTime"), now());
            gl.uniform2f(u("uMouse"), state.mx, state.my);
            gl.uniform1f(u("uMouseAmt"), state.amt);
            gl.uniform3fv(u("uRipple[0]"), ripples);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        };

        // Animate only while the cursor is settling or a ripple is live.
        let last = 0;
        const tick = (t: number) => {
            const dt = Math.min(t - last, 50) / 1000;
            last = t;
            const k = 1 - Math.pow(0.0006, dt);
            state.mx += (state.tx - state.mx) * k;
            state.my += (state.ty - state.my) * k;
            state.amt += (state.tamt - state.amt) * Math.min(1, dt * 5);
            draw();
            let live = Math.abs(state.tamt - state.amt) > 0.002 || (state.amt > 0.01 && Math.hypot(state.tx - state.mx, state.ty - state.my) > 0.5);
            for (let i = 0; i < 4; i++) if (now() - ripples[i * 3 + 2] < 2.5) live = true;
            raf = live ? requestAnimationFrame(tick) : 0;
        };
        const kick = () => {
            if (!ready || raf || reduced) return;
            last = performance.now();
            raf = requestAnimationFrame(tick);
        };

        const local = (e: PointerEvent) => {
            const r = canvas.getBoundingClientRect();
            const x = e.clientX - r.left, y = e.clientY - r.top;
            return { x: x * dpr, y: (r.height - y) * dpr, inside: x >= 0 && y >= 0 && x <= r.width && y <= r.height };
        };
        const onMove = (e: PointerEvent) => {
            const p = local(e);
            if (!p.inside && state.tamt === 0) return;
            state.tx = p.x;
            state.ty = p.y;
            if (p.inside && state.amt < 0.01) { state.mx = p.x; state.my = p.y; }
            state.tamt = p.inside && e.pointerType === "mouse" ? 1 : 0;
            kick();
        };
        const onDown = (e: PointerEvent) => {
            const p = local(e);
            if (!p.inside) return;
            ripples.set([p.x, p.y, now()], rippleIdx * 3);
            rippleIdx = (rippleIdx + 1) % 4;
            kick();
        };

        const ro = new ResizeObserver(() => { resize(); if (ready) draw(); });
        const start = () => {
            ready = true;
            resize();
            draw();
            canvas.dataset.ready = "true";
            ro.observe(canvas);
            if (!reduced) {
                window.addEventListener("pointermove", onMove, { passive: true });
                window.addEventListener("pointerdown", onDown, { passive: true });
            }
        };

        if (src) {
            const img = new Image();
            img.onload = () => {
                if (disposed) return;
                const tex = gl.createTexture();
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, tex);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                imgAspect = img.naturalWidth / img.naturalHeight;
                gl.uniform1f(u("uHasImg"), 1);
                start();
            };
            img.src = src;
        } else {
            start();
        }

        return () => {
            disposed = true;
            cancelAnimationFrame(raf);
            ro.disconnect();
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerdown", onDown);
            gl.getExtension("WEBGL_lose_context")?.loseContext();
        };
    }, [src, pitch, fx, fy, fade, toneKey, seed]);

    return (
        <canvas
            ref={ref}
            role={alt ? "img" : undefined}
            aria-label={alt}
            aria-hidden={alt ? undefined : true}
            className={cn("block h-full w-full opacity-0 transition-opacity duration-700 data-[ready=true]:opacity-100", className)}
        />
    );
}
