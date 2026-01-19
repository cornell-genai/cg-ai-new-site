


"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const PARTNERS = [
    { src: "/chartercommunications.png", alt: "Charter Communications" },
    { src: "/vero.webp", alt: "Vero Technologies" },
    { src: "/quickfi-logo-01-1.png", alt: "QuickFi" },
    { src: "/cisco.png", alt: "Cisco" },
    { src: "/gradial.jpeg", alt: "Gradial" },
];

// Staggered animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: {
        opacity: 0,
        y: 30,
        scale: 0.9
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1] as const
        }
    }
};

export default function PartnersGrid() {
    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="w-full py-16 md:py-24"
        >
            {/* Section Header */}
            <motion.div
                variants={itemVariants}
                className="text-center mb-12 md:mb-16"
            >
                <span className="text-sm md:text-lg font-medium uppercase tracking-[0.3em] text-white/40">
                    Industry Partners
                </span>
            </motion.div>

            {/* Borderless Logo Grid */}
            <motion.div
                variants={containerVariants}
                className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 items-center justify-items-center max-w-5xl mx-auto px-8"
            >
                {PARTNERS.map((partner) => (
                    <motion.div
                        key={partner.alt}
                        variants={itemVariants}
                        className="relative w-full h-16 md:h-24 flex items-center justify-center group cursor-pointer"
                    >
                        <div 
                            className="relative w-full h-full opacity-50 group-hover:opacity-100 grayscale group-hover:grayscale-0"
                            style={{ transition: 'opacity 0.5s ease-in-out, filter 0.5s ease-in-out' }}
                        >
                            <Image
                                src={partner.src}
                                alt={partner.alt}
                                fill
                                className="object-contain"
                            />
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.section>
    );
}
