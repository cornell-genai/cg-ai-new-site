"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';

// Coordinated animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.05
        }
    }
};

const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1] as const
        }
    }
};

const TIMELINE = [
    { date: "Aug 20", label: "Applications Open", active: false },
    { date: "Sept 5", label: "Info Session", active: false },
    { date: "Sept 10", label: "Apps Close", active: false },
    { date: "Sept 15", label: "Interviews", active: false },
];

export default function RecruitmentTimeline() {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full space-y-12"
        >

            {/* Student Section */}
            <motion.section variants={sectionVariants}>
                <div className="flex items-center gap-3 mb-6">
                    <span className="w-8 h-[1px] bg-red-500/50" />
                    <h3 className="text-2xl font-light tracking-wide uppercase text-white/90">For Students</h3>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-xl p-8 backdrop-blur-sm hover:border-white/10 transition-colors duration-200">
                    <h4 className="text-xl font-normal mb-8 text-white/90">Fall Recruitment Cycle</h4>

                    <div className="relative">
                        {/* Line */}
                        <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-white/10 md:hidden" />
                        <div className="absolute top-[7px] left-0 right-0 h-[1px] bg-gradient-to-r from-red-500/50 via-white/10 to-transparent hidden md:block" />

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {TIMELINE.map((item, idx) => (
                                <div key={idx} className="relative flex md:flex-col items-center md:items-start gap-4 md:gap-4 group">
                                    <div className={`w-4 h-4 rounded-full border-2 border-[#050505] z-10 transition-colors duration-300 ${idx === 0 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-white/20 group-hover:bg-white'}`} />
                                    <div>
                                        <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1">{item.date}</p>
                                        <p className="text-sm text-white font-medium group-hover:text-red-400 transition-colors duration-200">{item.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="mt-8 flex items-center gap-2 bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-white/90 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-white/10">
                        Apply Now <ArrowRight size={16} />
                    </button>
                </div>
            </motion.section>

            {/* Industry Section */}
            <motion.section variants={sectionVariants}>
                <div className="flex items-center gap-3 mb-6">
                    <span className="w-8 h-[1px] bg-red-500/50" />
                    <h3 className="text-2xl font-light tracking-wide uppercase text-white/90">For Industry</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="group bg-gradient-to-br from-white/5 to-transparent border border-white/5 rounded-xl p-8 hover:border-white/20 transition-all duration-200 hover:bg-white/10">
                        <h4 className="text-xl font-medium mb-3 flex items-center gap-2">
                            Project Sponsorship
                        </h4>
                        <p className="text-sm text-white/60 leading-relaxed mb-6">
                            Partner with our project teams to solve real-world generative AI challenges. We offer dedicated teams of top engineers.
                        </p>
                        <a href="#" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors duration-200 group-hover:gap-3">
                            Learn more <ArrowRight size={14} />
                        </a>
                    </div>
                    <div className="group bg-gradient-to-br from-white/5 to-transparent border border-white/5 rounded-xl p-8 hover:border-white/20 transition-all duration-200 hover:bg-white/10">
                        <h4 className="text-xl font-medium mb-3 flex items-center gap-2">
                            Events & Recruiting
                        </h4>
                        <p className="text-sm text-white/60 leading-relaxed mb-6">
                            Host workshops, tech talks, or recruiting events with our members. Access the top AI talent at Cornell.
                        </p>
                        <a href="#" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors duration-200 group-hover:gap-3">
                            Contact us <Mail size={14} />
                        </a>
                    </div>
                </div>
            </motion.section>
        </motion.div>
    );
}

