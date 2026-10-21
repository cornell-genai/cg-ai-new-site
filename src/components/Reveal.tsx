"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

export function Reveal({
    children,
    delay = 0,
    y = 24,
    className,
}: {
    children: React.ReactNode;
    delay?: number;
    y?: number;
    className?: string;
}) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1, ease, delay }}
        >
            {children}
        </motion.div>
    );
}

// Lines slide up from behind a mask, staggered.
export function MaskLines({
    lines,
    className,
    lineClassName,
    delay = 0,
    inView = false,
}: {
    lines: React.ReactNode[];
    className?: string;
    lineClassName?: string;
    delay?: number;
    inView?: boolean;
}) {
    return (
        <span className={cn("block", className)}>
            {lines.map((line, i) => (
                <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                    <motion.span
                        className={cn("block", lineClassName)}
                        initial={{ y: "105%" }}
                        {...(inView
                            ? { whileInView: { y: "0%" }, viewport: { once: true, margin: "-10% 0px" } }
                            : { animate: { y: "0%" } })}
                        transition={{ duration: 1.1, ease, delay: delay + i * 0.08 }}
                    >
                        {line}
                    </motion.span>
                </span>
            ))}
        </span>
    );
}
