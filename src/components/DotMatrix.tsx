"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// Re-draws a small, blurred source photo as a halftone dot screen. Dots grow
// in as the image scrolls into view and swell away from the cursor. It only
// renders while something is changing, so an idle frame costs nothing.

const VERT = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform sampler2D uImg;
uniform vec2 uRes;
uniform float uPitch;
uniform vec2 uMouse;
uniform float uMouseAmt;
uniform float uIntro;
uniform vec3 uBg;
uniform vec3 uSrcBg;
uniform vec2 uImgScale;
uniform vec2 uFocus;
uniform float uLift;

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void main() {
    vec2 frag = gl_FragCoord.xy;
    vec2 cell = floor(frag / uPitch);
    vec2 center = (cell + 0.5) * uPitch;
    vec3 c = texture2D(uImg, (center / uRes - 0.5) * uImgScale + uFocus).rgb; // cover-fit

    // Background-coloured areas get no dot; ink gets a full one.
    float ink = smoothstep(0.06, 0.2, distance(c, uSrcBg));
    float lum = dot(c, vec3(0.299, 0.587, 0.114));
    float r = uPitch * mix(0.34, 0.48, 1.0 - lum) * ink;

    vec2 dm = center - uMouse;
    float R = uPitch * 16.0;
    float push = exp(-dot(dm, dm) / (R * R)) * uMouseAmt;
    r *= 1.0 + push * 0.45;
    vec2 off = normalize(dm + 0.0001) * push * uPitch * 0.25;

    vec2 uv = center / uRes;
    float intro = clamp(uIntro * 1.8 - uv.x * 0.7 - hash(cell) * 0.25, 0.0, 1.0);
    r *= intro;

    float d = length(frag - center - off);
    float a = 1.0 - smoothstep(r - 0.75, r + 0.75, d);
    vec3 dot = mix(c, c * c * 1.1, 0.35); // deepen tones, dots read lighter than fills
    dot = mix(dot, sqrt(dot), uLift);     // on dark grounds, lift shadows so dark clothes stay visible
    gl_FragColor = vec4(mix(uBg, dot, a), 1.0);
}
`;

function hexToRgb(hex: string): [number, number, number] {
    const n = parseInt(hex.slice(1), 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export default function DotMatrix({
    src,
    alt,
    pitch = 7,
    background = "#f3f1ec",
    sourceBackground = "#f9f8f4",
    focus = [0.5, 0.5],
    className,
}: {
    src: string;
    alt: string;
    pitch?: number;
    background?: string;
    sourceBackground?: string;
    /** Point of the image (0–1, from top-left) to keep in frame when cropping. */
    focus?: [number, number];
    className?: string;
}) {
    const ref = useRef<HTMLCanvasElement>(null);
    const [fx, fy] = focus;

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
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
        gl.uniform3fv(u("uBg"), hexToRgb(background));
        gl.uniform3fv(u("uSrcBg"), hexToRgb(sourceBackground));
        const [br, bgc, bb] = hexToRgb(background);
        gl.uniform1f(u("uLift"), br + bgc + bb < 1.2 ? 0.45 : 0);

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const state = { intro: reduced ? 1 : 0, introTarget: reduced ? 1 : 0, mx: 0, my: 0, tx: 0, ty: 0, amt: 0, tamt: 0 };
        let raf = 0;
        let ready = false;
        let imgAspect = 1;

        const resize = () => {
            const { width, height } = canvas.getBoundingClientRect();
            canvas.width = Math.max(1, Math.round(width * dpr));
            canvas.height = Math.max(1, Math.round(height * dpr));
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform2f(u("uRes"), canvas.width, canvas.height);
            const ca = width / height;
            const sx = ca > imgAspect ? 1 : ca / imgAspect, sy = ca > imgAspect ? imgAspect / ca : 1;
            gl.uniform2f(u("uImgScale"), sx, sy);
            // Keep the focal point in frame without sampling past the edges.
            gl.uniform2f(u("uFocus"), Math.min(1 - sx / 2, Math.max(sx / 2, fx)), Math.min(1 - sy / 2, Math.max(sy / 2, 1 - fy)));
            gl.uniform1f(u("uPitch"), Math.max(4, (width < 640 ? pitch * 0.7 : pitch) * dpr));
        };

        const draw = () => {
            gl.uniform1f(u("uIntro"), state.intro);
            gl.uniform2f(u("uMouse"), state.mx, state.my);
            gl.uniform1f(u("uMouseAmt"), state.amt);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        };

        // Animate only until every value has settled, then go idle.
        let last = 0;
        const tick = (now: number) => {
            const dt = Math.min(now - last, 50) / 1000;
            last = now;
            const k = 1 - Math.pow(0.0008, dt);
            state.intro += (state.introTarget - state.intro) * (1 - Math.pow(0.12, dt));
            state.mx += (state.tx - state.mx) * k;
            state.my += (state.ty - state.my) * k;
            state.amt += (state.tamt - state.amt) * Math.min(1, dt * 5);
            draw();
            const settled =
                Math.abs(state.introTarget - state.intro) < 0.002 &&
                Math.abs(state.tamt - state.amt) < 0.002 &&
                Math.hypot(state.tx - state.mx, state.ty - state.my) < 0.5;
            raf = settled ? 0 : requestAnimationFrame(tick);
        };
        const kick = () => {
            if (!ready || raf) return;
            last = performance.now();
            raf = requestAnimationFrame(tick);
        };

        const onMove = (e: PointerEvent) => {
            const r = canvas.getBoundingClientRect();
            const x = e.clientX - r.left, y = e.clientY - r.top;
            const inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
            if (!inside && state.tamt === 0) return;
            state.tx = x * dpr;
            state.ty = (r.height - y) * dpr;
            if (inside && state.amt < 0.01) { state.mx = state.tx; state.my = state.ty; }
            state.tamt = inside && e.pointerType === "mouse" ? 1 : 0;
            kick();
        };

        const io = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { state.introTarget = 1; kick(); } },
            { threshold: 0.25 },
        );
        const ro = new ResizeObserver(() => { resize(); if (ready) draw(); });

        const img = new Image();
        img.onload = () => {
            if (disposed) return;
            const tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            imgAspect = img.naturalWidth / img.naturalHeight;
            ready = true;
            resize();
            draw();
            canvas.dataset.ready = "true";
            ro.observe(canvas);
            io.observe(canvas);
            if (!reduced) window.addEventListener("pointermove", onMove, { passive: true });
        };
        img.src = src;

        return () => {
            disposed = true;
            cancelAnimationFrame(raf);
            io.disconnect();
            ro.disconnect();
            window.removeEventListener("pointermove", onMove);
            gl.getExtension("WEBGL_lose_context")?.loseContext();
        };
    }, [src, pitch, background, sourceBackground, fx, fy]);

    return (
        <canvas
            ref={ref}
            role="img"
            aria-label={alt}
            className={cn("block h-full w-full opacity-0 transition-opacity duration-700 data-[ready=true]:opacity-100", className)}
        />
    );
}
