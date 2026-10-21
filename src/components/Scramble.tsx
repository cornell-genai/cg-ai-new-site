"use client";

import { useLayoutEffect, useRef } from "react";

const GLYPHS = "-\\|/+:#*=";

// Text that decodes from ASCII noise into itself, left to right, as the page
// curtain lifts. The real text stays in the layout (invisible while decoding)
// so nothing around it shifts; the noise is drawn in an overlay React never
// touches.
export default function Scramble({ text, delay = 0, duration = 900, className }: { text: string; delay?: number; duration?: number; className?: string }) {
    const real = useRef<HTMLSpanElement>(null);
    const fx = useRef<HTMLSpanElement>(null);

    useLayoutEffect(() => {
        const el = fx.current, base = real.current;
        if (!el || !base || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const chars = [...text];
        const noise = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];
        const show = (s: string) => { el.textContent = s; };
        const finish = () => { el.textContent = ""; base.style.visibility = ""; };

        base.style.visibility = "hidden";
        show(chars.map((c) => (c === " " ? " " : noise())).join(""));

        let raf = 0, t0 = 0;
        const tick = (t: number) => {
            if (!t0) t0 = t;
            const p = (t - t0 - delay) / duration;
            show(chars.map((c, i) => (c === " " ? " " : p > i / chars.length + 0.18 ? c : noise())).join(""));
            if (p < 1.2) raf = requestAnimationFrame(tick);
            else finish();
        };
        const start = () => { raf = requestAnimationFrame(tick); };

        // Start as the curtain lifts; if nothing is covering the page, start now.
        const root = document.documentElement;
        const mo = new MutationObserver(() => {
            if (root.dataset.transition !== "cover") { mo.disconnect(); start(); }
        });
        if (root.dataset.transition !== "cover") start();
        else mo.observe(root, { attributes: true, attributeFilter: ["data-transition"] });

        return () => { mo.disconnect(); cancelAnimationFrame(raf); finish(); };
    }, [text, delay, duration]);

    return (
        <span className={`relative inline-block ${className ?? ""}`}>
            <span ref={real}>{text}</span>
            <span ref={fx} aria-hidden className="pointer-events-none absolute left-0 top-0 whitespace-pre" />
        </span>
    );
}
