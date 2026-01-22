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
                    <span className="w-8 h-[2px] bg-red-600" />
                    <h3 className="text-2xl font-light tracking-wide uppercase text-zinc-800">For Students</h3>
                </div>

                {/* Timeline Card */}
                <div className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm mb-8">
                    <h4 className="text-xl font-medium mb-8 text-zinc-900">Spring 2026 Recruitment</h4>

                    <div className="relative">
                        {/* Vertical line for mobile */}
                        <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-zinc-100 md:hidden" />
                        {/* Horizontal line for desktop */}
                        <div className="absolute top-[7px] left-0 right-0 h-[2px] bg-gradient-to-r from-red-600 via-zinc-200 to-transparent hidden md:block" />

                        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-4">
                            {TIMELINE.map((item, idx) => {
                                const itemDate = getMonthDay(item.date);
                                const isPast = itemDate < now;
                                const isActive = idx === 0; // First item is active

                                return (
                                    <div key={idx} className="relative flex md:flex-col items-center md:items-start gap-4 md:gap-3 group">
                                        <div className={`w-4 h-4 rounded-full border-2 border-white z-10 transition-all duration-300 flex-shrink-0 shadow-sm ${isActive ? 'bg-red-600 ring-4 ring-red-100 scale-110' : isPast ? 'bg-zinc-300' : 'bg-white border-zinc-300 group-hover:border-red-400'}`} />
                                        <div>
                                            <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">{item.date}</p>
                                            <p className="text-sm text-zinc-900 font-medium group-hover:text-red-700 transition-colors duration-200">{item.label}</p>
                                            {item.location && (
                                                <p className="text-xs text-zinc-500 mt-1">{item.location}</p>
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
                    <h4 className="text-lg font-medium mb-6 text-zinc-500 uppercase tracking-wider">Open Roles</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                        {ROLES.map((role) => (
                            <motion.div
                                key={role.id}
                                variants={cardVariants}
                                className="group bg-white border border-zinc-200 rounded-xl p-6 hover:border-red-300 hover:shadow-lg hover:shadow-red-900/5 transition-all duration-300"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="p-3 rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors duration-300">
                                        <role.icon size={24} className="text-red-700" />
                                    </div>
                                    <div>
                                        <h5 className="text-xl font-bold text-zinc-900 mb-1">{role.title}</h5>
                                        <p className="text-sm text-zinc-500">{role.subtitle}</p>
                                    </div>
                                </div>

                                <p className="text-sm text-zinc-600 leading-relaxed mb-5">
                                    {role.description}
                                </p>

                                <div className="mb-6">
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">What we look for</p>
                                    <ul className="space-y-2">
                                        {role.lookingFor.map((item, idx) => (
                                            <li key={idx} className="text-sm text-zinc-600 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Link
                                    href={role.applyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-red-700 active:scale-95 transition-all duration-200 shadow-lg shadow-zinc-900/20 hover:shadow-red-900/30"
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
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gradient-to-r from-red-50 to-white border border-red-100 rounded-xl"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-white shadow-sm">
                            <Coffee size={20} className="text-red-600" />
                        </div>
                        <div>
                            <p className="text-zinc-900 font-medium">Not sure which track?</p>
                            <p className="text-sm text-zinc-500">Book a coffee chat with a current member</p>
                        </div>
                    </div>
                    <Link
                        href="https://docs.google.com/forms/d/e/1FAIpQLSeT6zY3ZnLLzLh00GOcP-MQwYadRs49YOLukcxny0kytQCyAg/viewform"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2 border border-red-200 bg-white rounded-full text-sm font-medium text-red-700 hover:bg-red-50 hover:border-red-300 active:scale-95 transition-all duration-200"
                    >
                        Book Coffee Chat <ArrowRight size={14} />
                    </Link>
                </motion.div>
            </motion.section>

            {/* Industry Section */}
            <motion.section variants={sectionVariants}>
                <div className="flex items-center gap-3 mb-8">
                    <span className="w-8 h-[2px] bg-red-600" />
                    <h3 className="text-2xl font-light tracking-wide uppercase text-zinc-800">For Industry</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <motion.div
                        variants={cardVariants}
                        className="group bg-white border border-zinc-200 rounded-xl p-8 hover:border-red-300 transition-all duration-200 hover:shadow-lg"
                    >
                        <h4 className="text-xl font-bold mb-3 flex items-center gap-2 text-zinc-900">
                            Project Sponsorship
                        </h4>
                        <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                            Partner with our project teams to solve real-world generative AI challenges. We offer dedicated teams of top Cornell engineers for semester-long engagements.
                        </p>
                        <a
                            href="mailto:admin@cornellgenai.dev?subject=Project%20Sponsorship%20Inquiry"
                            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-red-700 transition-colors duration-200 group-hover:gap-3 font-medium"
                        >
                            Get in touch <Mail size={14} />
                        </a>
                    </motion.div>

                    <motion.div
                        variants={cardVariants}
                        className="group bg-white border border-zinc-200 rounded-xl p-8 hover:border-red-300 transition-all duration-200 hover:shadow-lg"
                    >
                        <h4 className="text-xl font-bold mb-3 flex items-center gap-2 text-zinc-900">
                            Events & Recruiting
                        </h4>
                        <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                            Host workshops, tech talks, or recruiting events with our members. Access the top AI talent at Cornell through exclusive networking opportunities.
                        </p>
                        <a
                            href="mailto:admin@cornellgenai.dev?subject=Events%20%26%20Recruiting%20Inquiry"
                            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-red-700 transition-colors duration-200 group-hover:gap-3 font-medium"
                        >
                            Contact us <Mail size={14} />
                        </a>
                    </motion.div>
                </div>
            </motion.section>
        </motion.div>
    );
}
