"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ScrollIndicatorProps {
    targetId?: string;
    className?: string;
    visible?: boolean;
}

export default function ScrollIndicator({ 
    targetId = "sections",
    className = "",
    visible = true
}: ScrollIndicatorProps) {
    
    const handleClick = () => {
        const target = document.getElementById(targetId);
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        } else {
            // Fallback: scroll down by viewport height
            window.scrollTo({
                top: window.innerHeight,
                behavior: "smooth"
            });
        }
    };

    return (
        <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
                opacity: visible ? 1 : 0, 
                y: visible ? 0 : -20,
                pointerEvents: visible ? "auto" : "none"
            }}
            transition={{ 
                duration: 0.5, 
                delay: 3,
                ease: [0.22, 1, 0.36, 1]
            }}
            onClick={handleClick}
            className={`group flex flex-col items-center gap-2 cursor-pointer focus:outline-none ${className}`}
            aria-label="Scroll to explore"
        >
            {/* Text label */}
            <motion.span 
                className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/30 group-hover:text-white/60 transition-colors duration-300"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
                Scroll
            </motion.span>
            
            {/* Animated line */}
            <motion.div 
                className="w-[1px] h-8 bg-gradient-to-b from-white/40 to-transparent overflow-hidden"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.8, delay: 3.2 }}
            >
                <motion.div
                    className="w-full h-2 bg-white/80"
                    animate={{ y: ["-100%", "400%"] }}
                    transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        repeatDelay: 0.5
                    }}
                />
            </motion.div>
            
            {/* Chevron with bounce animation */}
            <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    ease: "easeInOut"
                }}
                className="relative"
            >
                {/* Glow effect */}
                <div className="absolute inset-0 blur-md bg-white/20 rounded-full scale-150" />
                
                <ChevronDown 
                    size={24} 
                    className="relative text-white/60 group-hover:text-white transition-colors duration-300" 
                    strokeWidth={1.5}
                />
            </motion.div>
            
            {/* Ripple effect on hover */}
            <motion.div
                className="absolute bottom-0 w-12 h-12 rounded-full border border-white/10"
                initial={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1.5, opacity: [0, 0.3, 0] }}
                transition={{ duration: 0.6 }}
            />
        </motion.button>
    );
}
