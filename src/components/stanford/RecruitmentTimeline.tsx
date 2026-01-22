"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Code, Palette, Coffee } from 'lucide-react';
import Link from 'next/link';

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

const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1] as const
        }
    }
};

const TIMELINE = [
    { date: "Jan 20", label: "Coffee Chats Open", location: null },
    { date: "Jan 21", label: "All Applications Open", location: null },
    { date: "Jan 25", label: "Club Fest", location: null },
    { date: "Jan 29", label: "Info Session #1", location: "Stimson Hall" },
    { date: "Feb 1", label: "Info Session #2", location: "Gates Hall G01" },
    { date: "Feb 7", label: "Applications Due", location: null },
];

const ROLES = [
    {
        id: 'developer',
        icon: Code,
        title: 'Developer Track',
        subtitle: 'Build AI products with industry partners',
        description: 'Join our engineering teams to develop real AI solutions for companies like QuickFi, Charter, and Cisco.',
        lookingFor: [
            'Technical depth in software/ML',
            'Ability to ship real projects',
            'Problem-solving mindset'
        ],
        applyUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSczHtve7uF-9Vm6RsD28WlanNAmP8ORY1jg9hk9pveuuJwe-Q/viewform'
    },
    {
        id: 'design',
        icon: Palette,
        title: 'Design & Marketing',
        subtitle: 'Shape our brand and grow our community',
        description: 'Help define the visual identity, create content, and expand the reach of Cornell GenAI.',
        lookingFor: [
            'Creative vision & design skills',
            'Strong communication',
            'Collaborative spirit'
        ],
        applyUrl: 'https://forms.gle/DRq6W7sHwkhnjn7x5'
    }
];

export default function RecruitmentTimeline() {
    // Determine which timeline items are "past" based on current date
    const now = new Date();
    const getMonthDay = (dateStr: string) => {
        const [month, day] = dateStr.split(' ');
        const monthMap: Record<string, number> = { 'Jan': 0, 'Feb': 1 };
        return new Date(2026, monthMap[month] || 0, parseInt(day));
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full space-y-16"
        >

            {/* Student Section */}
            <motion.section variants={sectionVariants}>
                <div className="flex items-center gap-3 mb-8">
                    <span className="w-8 h-[1px] bg-red-500/50" />
                    <h3 className="text-2xl font-light tracking-wide uppercase text-white/90">For Students</h3>
                </div>

                {/* Timeline Card */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-8 backdrop-blur-sm mb-8">
                    <h4 className="text-xl font-normal mb-8 text-white/90">Spring 2026 Recruitment</h4>

                    <div className="relative">
                        {/* Vertical line for mobile */}
                        <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-white/10 md:hidden" />
                        {/* Horizontal line for desktop */}
                        <div className="absolute top-[7px] left-0 right-0 h-[1px] bg-gradient-to-r from-red-500/50 via-white/10 to-transparent hidden md:block" />

                        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-4">
                            {TIMELINE.map((item, idx) => {
                                const itemDate = getMonthDay(item.date);
                                const isPast = itemDate < now;
                                const isActive = idx === 0; // First item is active

                                return (
                                    <div key={idx} className="relative flex md:flex-col items-center md:items-start gap-4 md:gap-3 group">
                                        <div className={`w-4 h-4 rounded-full border-2 border-[#050505] z-10 transition-colors duration-300 flex-shrink-0 ${isActive ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : isPast ? 'bg-white/50' : 'bg-white/20 group-hover:bg-white'}`} />
                                        <div>
                                            <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1">{item.date}</p>
                                            <p className="text-sm text-white font-medium group-hover:text-red-400 transition-colors duration-200">{item.label}</p>
                                            {item.location && (
                                                <p className="text-xs text-white/30 mt-1">{item.location}</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Open Roles Section */}
                <div className="mb-8">
                    <h4 className="text-lg font-normal mb-6 text-white/70 uppercase tracking-wider">Open Roles</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                        {ROLES.map((role) => (
                            <motion.div
                                key={role.id}
                                variants={cardVariants}
                                className="group bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/5 rounded-xl p-6 hover:border-white/15 transition-all duration-300"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="p-3 rounded-lg bg-white/5 group-hover:bg-red-500/10 transition-colors duration-300">
                                        <role.icon size={24} className="text-white/70 group-hover:text-red-400 transition-colors duration-300" />
                                    </div>
                                    <div>
                                        <h5 className="text-xl font-medium text-white mb-1">{role.title}</h5>
                                        <p className="text-sm text-white/50">{role.subtitle}</p>
                                    </div>
                                </div>

                                <p className="text-sm text-white/60 leading-relaxed mb-5">
                                    {role.description}
                                </p>

                                <div className="mb-6">
                                    <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">What we look for</p>
                                    <ul className="space-y-2">
                                        {role.lookingFor.map((item, idx) => (
                                            <li key={idx} className="text-sm text-white/50 flex items-center gap-2">
                                                <span className="w-1 h-1 rounded-full bg-red-500/50" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Link
                                    href={role.applyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full text-sm font-medium hover:bg-red-500 hover:text-white active:scale-95 transition-all duration-200 shadow-lg shadow-white/5"
                                >
                                    Apply Now <ArrowRight size={16} />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Coffee Chat CTA */}
                <motion.div
                    variants={cardVariants}
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gradient-to-r from-white/[0.04] to-transparent border border-white/5 rounded-xl"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-white/5">
                            <Coffee size={20} className="text-white/60" />
                        </div>
                        <div>
                            <p className="text-white font-medium">Not sure which track?</p>
                            <p className="text-sm text-white/50">Book a coffee chat with a current member</p>
                        </div>
                    </div>
                    <Link
                        href="https://docs.google.com/forms/d/e/1FAIpQLSeT6zY3ZnLLzLh00GOcP-MQwYadRs49YOLukcxny0kytQCyAg/viewform"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2 border border-white/20 rounded-full text-sm font-medium text-white/80 hover:bg-white hover:text-black active:scale-95 transition-all duration-200"
                    >
                        Book Coffee Chat <ArrowRight size={14} />
                    </Link>
                </motion.div>
            </motion.section>

            {/* Industry Section */}
            <motion.section variants={sectionVariants}>
                <div className="flex items-center gap-3 mb-8">
                    <span className="w-8 h-[1px] bg-red-500/50" />
                    <h3 className="text-2xl font-light tracking-wide uppercase text-white/90">For Industry</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <motion.div
                        variants={cardVariants}
                        className="group bg-gradient-to-br from-white/5 to-transparent border border-white/5 rounded-xl p-8 hover:border-white/20 transition-all duration-200 hover:bg-white/10"
                    >
                        <h4 className="text-xl font-medium mb-3 flex items-center gap-2">
                            Project Sponsorship
                        </h4>
                        <p className="text-sm text-white/60 leading-relaxed mb-6">
                            Partner with our project teams to solve real-world generative AI challenges. We offer dedicated teams of top Cornell engineers for semester-long engagements.
                        </p>
                        <a
                            href="mailto:admin@cornellgenai.dev?subject=Project%20Sponsorship%20Inquiry"
                            className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors duration-200 group-hover:gap-3"
                        >
                            Get in touch <Mail size={14} />
                        </a>
                    </motion.div>

                    <motion.div
                        variants={cardVariants}
                        className="group bg-gradient-to-br from-white/5 to-transparent border border-white/5 rounded-xl p-8 hover:border-white/20 transition-all duration-200 hover:bg-white/10"
                    >
                        <h4 className="text-xl font-medium mb-3 flex items-center gap-2">
                            Events & Recruiting
                        </h4>
                        <p className="text-sm text-white/60 leading-relaxed mb-6">
                            Host workshops, tech talks, or recruiting events with our members. Access the top AI talent at Cornell through exclusive networking opportunities.
                        </p>
                        <a
                            href="mailto:admin@cornellgenai.dev?subject=Events%20%26%20Recruiting%20Inquiry"
                            className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors duration-200 group-hover:gap-3"
                        >
                            Contact us <Mail size={14} />
                        </a>
                    </motion.div>
                </div>
            </motion.section>
        </motion.div>
    );
}
