"use client";

import { useRef } from "react";

const GLYPHS = "-\\|/+:#*=";

// On hover, the text briefly decodes from ASCII noise back into itself, left
// to right. The real text keeps its place in the layout (hidden while the
// effect runs) so nothing shifts; the noise lives in an overlay React never
// renders into.
export default function Scramble({ text, duration = 420, className }: { text: string; duration?: number; className?: string }) {
    const real = useRef<HTMLSpanElement>(null);
    const fx = useRef<HTMLSpanElement>(null);
    const raf = useRef(0);

    const run = () => {
        const el = fx.current, base = real.current;
        if (!el || !base || raf.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const chars = [...text];
        const noise = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];
        base.style.visibility = "hidden";
        const t0 = performance.now();
        const tick = (t: number) => {
            const p = (t - t0) / duration;
            if (p >= 1) {
                el.textContent = "";
                base.style.visibility = "";
                raf.current = 0;
                return;
            }
            // A soft band of noise sweeps across; letters behind it settle back.
            el.textContent = chars.map((c, i) => (c === " " || Math.abs(i / chars.length - p) > 0.22 ? c : noise())).join("");
            raf.current = requestAnimationFrame(tick);
        };
        raf.current = requestAnimationFrame(tick);
    };

    return (
        <span className={`relative inline-block ${className ?? ""}`} onPointerEnter={run}>
            <span ref={real}>{text}</span>
            <span ref={fx} aria-hidden className="pointer-events-none absolute left-0 top-0 whitespace-pre" />
        </span>
    );
}
