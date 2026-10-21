"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { PALETTES } from "@/lib/palettes";

// Grainy, domain-warped gradient rendered in a fragment shader. The palette is
// sampled with a noisy offset, which produces the stippled, film-grain edges
// between colour fields. With `pixel` > 1 the canvas renders at a lower
// resolution, upscales without smoothing and uses ordered (Bayer) dithering.


type Props = {
    palette?: readonly string[];
    pixel?: number;
    grain?: number;
    scale?: number;
    speed?: number;
    seed?: number;
    interactive?: boolean;
    className?: string;
};

const VERT = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseAmt;
uniform float uPixel;
uniform float uGrain;
uniform float uScale;
uniform float uSeed;
uniform vec3 uC[6];

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
    for (int i = 0; i < 3; i++) { v += a * snoise(p); p = p * 2.03 + 11.7; a *= 0.5; }
    return v;
}
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float bayer2(vec2 a) { a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }

vec3 pal(float t) {
    t = clamp(t, 0.0, 0.9999) * 5.0;
    vec3 c = uC[0];
    for (int i = 0; i < 5; i++) {
        c = mix(c, uC[i + 1], smoothstep(0.0, 1.0, clamp(t - float(i), 0.0, 1.0)));
    }
    return c;
}

void main() {
    vec2 frag = gl_FragCoord.xy;
    vec2 uv = frag / uRes.y;
    vec2 m = uMouse * vec2(uRes.x / uRes.y, 1.0);
    float t = uTime;
    vec2 p = uv * uScale + uSeed;

    vec2 d = uv - m;
    float md = exp(-dot(d, d) * 5.0) * uMouseAmt;

    vec2 q = vec2(fbm(p + vec2(0.0, t * 0.6)), fbm(p + vec2(5.2, 1.3) - t * 0.4));
    vec2 r = vec2(
        fbm(p + 0.6 * q + vec2(1.7, 9.2) + t * 0.5 - d * md * 1.4),
        fbm(p + 0.6 * q + vec2(8.3, 2.8) - t * 0.3)
    );
    float v = fbm(p + 0.8 * r) * 1.45 + 0.5 + md * 0.18;

    float n = uPixel > 1.5 ? bayer8(frag) : hash(frag);
    v += (n - 0.5) * uGrain;
    gl_FragColor = vec4(pal(v), 1.0);
}
`;

function hexToRgb(hex: string) {
    const n = parseInt(hex.slice(1), 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export default function GrainField({
    palette = PALETTES.ember,
    pixel = 1,
    grain = 0.22,
    scale = 0.42,
    speed = 1,
    seed = 0,
    interactive = true,
    className,
}: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
        if (!gl) return;

        const compile = (type: number, src: string) => {
            const s = gl.createShader(type)!;
            gl.shaderSource(s, src);
            gl.compileShader(s);
            return s;
        };
        const prog = gl.createProgram()!;
        gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
        gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
        gl.useProgram(prog);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, "a");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        const u = (name: string) => gl.getUniformLocation(prog, name);
        const uRes = u("uRes"), uTime = u("uTime"), uMouse = u("uMouse"), uMouseAmt = u("uMouseAmt");
        gl.uniform1f(u("uPixel"), pixel);
        gl.uniform1f(u("uGrain"), grain);
        gl.uniform1f(u("uScale"), scale);
        gl.uniform1f(u("uSeed"), seed);
        gl.uniform3fv(u("uC[0]"), new Float32Array(palette.flatMap(hexToRgb)));

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        // Grain reads best at ~1 device pixel per CSS pixel; more is wasted fill.
        const density = pixel > 1 ? 1 / pixel : Math.min(window.devicePixelRatio, 1.25);

        const resize = () => {
            const { width, height } = canvas.getBoundingClientRect();
            canvas.width = Math.max(1, Math.round(width * density));
            canvas.height = Math.max(1, Math.round(height * density));
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform2f(uRes, canvas.width, canvas.height);
        };
        resize();

        let time = seed * 3.1;
        let last = performance.now();
        let raf = 0;
        let running = false;

        const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, amt: 0, tamt: 0 };
        const onMove = (e: PointerEvent) => {
            const r = canvas.getBoundingClientRect();
            mouse.tx = (e.clientX - r.left) / r.width;
            mouse.ty = 1 - (e.clientY - r.top) / r.height;
            mouse.tamt = mouse.tx >= 0 && mouse.tx <= 1 && mouse.ty >= 0 && mouse.ty <= 1 ? 1 : 0;
        };
        if (interactive && !reduced) window.addEventListener("pointermove", onMove, { passive: true });

        const draw = () => {
            gl.uniform1f(uTime, time);
            gl.uniform2f(uMouse, mouse.x, mouse.y);
            gl.uniform1f(uMouseAmt, mouse.amt);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        };
        const frame = (now: number) => {
            const dt = Math.min(now - last, 50) / 1000;
            last = now;
            time += dt * 0.045 * speed;
            const k = 1 - Math.pow(0.001, dt);
            mouse.x += (mouse.tx - mouse.x) * k;
            mouse.y += (mouse.ty - mouse.y) * k;
            mouse.amt += (mouse.tamt - mouse.amt) * k * 0.5;
            draw();
            raf = requestAnimationFrame(frame);
        };
        const start = () => {
            if (running || reduced) return;
            running = true;
            last = performance.now();
            raf = requestAnimationFrame(frame);
        };
        const stop = () => { running = false; cancelAnimationFrame(raf); };

        const ro = new ResizeObserver(() => { resize(); if (!running) draw(); });
        ro.observe(canvas);
        draw();
        canvas.dataset.ready = "true";
        const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
        io.observe(canvas);

        return () => {
            stop();
            io.disconnect();
            ro.disconnect();
            window.removeEventListener("pointermove", onMove);
            gl.getExtension("WEBGL_lose_context")?.loseContext();
        };
    }, [palette, pixel, grain, scale, speed, seed, interactive]);

    return (
        <div
            className={cn("absolute inset-0 overflow-hidden", className)}
            style={{ background: `linear-gradient(135deg, ${palette[1]}, ${palette[3]} 55%, ${palette[4]})` }}
        >
            <canvas
                ref={canvasRef}
                aria-hidden
                className="h-full w-full opacity-0 transition-opacity duration-700 data-[ready=true]:opacity-100"
                style={pixel > 1 ? { imageRendering: "pixelated" } : undefined}
            />
        </div>
    );
}
