"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * BootLog
 * Simulates a system startup log.
 */
const LOGS = [
    "INITIALIZING VANGUARD KERNEL...",
    "LOADING NEURAL CLUSTERS... [OK]",
    "ESTABLISHING SECURE CONNECTION...",
    "OPTIMIZING LATENT SPACE VECTORS...",
    "MOUNTING GENERATIVE ENGINE...",
    "SYSTEM ONLINE."
];

export default function BootSequence({ onComplete }: { onComplete: () => void }) {
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        let delay = 0;
        LOGS.forEach((log, index) => {
            delay += Math.random() * 300 + 100;
            setTimeout(() => {
                setLogs(prev => [...prev, log]);
                if (index === LOGS.length - 1) {
                    setTimeout(onComplete, 800);
                }
            }, delay);
        });
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black text-green-500 font-mono text-sm p-10 flex flex-col justify-end"
        >
            <div className="mb-8 opacity-50 text-[10px] leading-3 whitespace-pre">
                {`
   ______  ________  _______    ____
  / ____/ / ____/  |/  / __ \\  /  _/
 / / __  / __/ / /|_/ / /_/ /  / /  
/ /_/ / / /___/ /  / / _, _/ _/ /   
\\____/ /_____/_/  /_/_/ |_| /___/   
                                    
    GEN AI @ CORNELL // V 1.0.0
`}
            </div>

            {logs.map((log, i) => (
                <div key={i} className="mb-1">
                    <span className="opacity-50 mr-2">{`>`}</span>
                    {log}
                </div>
            ))}
            <div className="animate-pulse mt-1">_</div>
        </motion.div>
    );
}
