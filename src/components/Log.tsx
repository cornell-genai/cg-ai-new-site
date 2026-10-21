"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const COLORS = ["text-log-red", "text-log-pink", "text-log-green", "text-log-blue"];

// Monospace status lines that type themselves out once they scroll into view.
export default function Log({ lines, footer, className }: { lines: string[]; footer?: string; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const total = lines.reduce((n, l) => n + l.length, 0);
    const [shown, setShown] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setShown(total);
            return;
        }
        let raf = 0;
        const io = new IntersectionObserver(([e]) => {
            if (!e.isIntersecting) return;
            io.disconnect();
            const t0 = performance.now();
            const tick = (t: number) => {
                const n = Math.min(total, Math.floor((t - t0) / 16));
                setShown(n);
                if (n < total) raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);
        }, { threshold: 0.6 });
        io.observe(el);
        return () => { io.disconnect(); cancelAnimationFrame(raf); };
    }, [total]);

    let budget = shown;
    return (
        <div ref={ref} className={cn("rounded-xl bg-[#f3f3f2] px-4 py-3.5 font-mono text-[12px] leading-[1.75]", className)}>
            <span className="sr-only">{lines.join(". ")}</span>
            <div aria-hidden>
                {lines.map((line, i) => {
                    const n = Math.max(0, Math.min(line.length, budget));
                    budget -= line.length;
                    const typing = n > 0 && n < line.length;
                    return (
                        <div key={i} className={cn("min-h-[1.75em] whitespace-pre-wrap", COLORS[i % COLORS.length])}>
                            {n > 0 && <>{"> "}{line.slice(0, n)}</>}
                            {typing && <span className="ml-px inline-block h-[1em] w-[0.5em] translate-y-[0.15em] animate-[caret_1s_steps(1)_infinite] bg-current" />}
                        </div>
                    );
                })}
                {footer && <div className="mt-2 text-[10.5px] text-ink-3">{footer}</div>}
            </div>
        </div>
    );
}
