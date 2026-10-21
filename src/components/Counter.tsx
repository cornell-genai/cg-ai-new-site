"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function Counter({ to, pad = 2 }: { to: number; pad?: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-15% 0px" });
    const [n, setN] = useState(0);
    useEffect(() => {
        if (!inView) return;
        const c = animate(0, to, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) });
        return () => c.stop();
    }, [inView, to]);
    return <span ref={ref} className="tabular-nums">{String(n).padStart(pad, "0")}</span>;
}
