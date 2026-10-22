"use client";

import { useCallback, useEffect, useRef } from "react";

const GLYPHS = "-\\|/+:#*=";

// On hover, the text briefly decodes from ASCII noise back into itself, left
// to right. The real text keeps its place in the layout (hidden while the
// effect runs) so nothing shifts; the noise lives in an overlay React never
// renders into. With `auto` it also runs on mount (remount it via `key` to replay).
export default function Scramble({ text, duration = 420, className, auto }: { text: string; duration?: number; className?: string; auto?: boolean }) {
    const real = useRef<HTMLSpanElement>(null);
    const fx = useRef<HTMLSpanElement>(null);
    const raf = useRef(0);

    const run = useCallback(() => {
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
    }, [text, duration]);

    useEffect(() => {
        if (auto) run();
        return () => {
            cancelAnimationFrame(raf.current);
            raf.current = 0;
            if (real.current) real.current.style.visibility = "";
            if (fx.current) fx.current.textContent = "";
        };
    }, [auto, run]);

    return (
        <span className={`relative inline-block ${className ?? ""}`} onPointerEnter={run}>
            <span ref={real}>{text}</span>
            <span ref={fx} aria-hidden className="pointer-events-none absolute left-0 top-0 whitespace-pre" />
        </span>
    );
}
