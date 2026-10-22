"use client";

import { motion } from "framer-motion";
import AsciiHover from "./AsciiHover";

const ease = [0.16, 1, 0.3, 1] as const;

// Full-bleed photo banner that opens out from a small rounded frame to the
// full width as the page arrives, then holds still. The page title sits on
// its lower edge.
export default function Banner({ src, alt, title }: { src: string; alt: string; title: string }) {
    return (
        <motion.section
            initial={{ clipPath: "inset(18% 28% 18% 28% round 18px)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
            transition={{ duration: 1.3, ease, delay: 0.15 }}
            className="relative h-[72svh] min-h-[440px] overflow-hidden"
        >
            <motion.div initial={{ scale: 1.18 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease, delay: 0.15 }} className="absolute inset-0">
                <AsciiHover src={src} alt={alt} className="h-full w-full" imgClassName="object-[60%_40%]" />
            </motion.div>
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night via-night/20 to-night/40" />
            <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease, delay: 0.7 }}
                className="absolute bottom-6 left-5 text-[clamp(3.5rem,10vw,9rem)] font-medium leading-[0.85] tracking-[-0.055em] text-white md:bottom-10 md:left-6"
            >
                {title}
            </motion.h1>
        </motion.section>
    );
}
