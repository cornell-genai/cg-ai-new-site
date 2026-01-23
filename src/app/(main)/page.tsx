"use client";

import React from 'react';
import HeroSection from '@/components/hero/HeroSection';
import PartnersGrid from '@/components/stanford/PartnersGrid';
import { motion } from 'framer-motion';
import { Terminal, Cpu, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="bg-[#FAFAF9] dark:bg-[#0F0A1A] transition-colors duration-300">
            {/* Hero Section */}
            <HeroSection
                headline="Cornell's home for students in AI"
                subtitle="Connecting Cornell's most passionate developers with industry giants to build AI products that streamline workflows."
            />

            {/* About / Mission Section */}
            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-sm font-medium uppercase tracking-[0.3em] text-red-700 dark:text-red-500 mb-6 block">
                            Our Mission
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-8 leading-tight">
                            Architecting Intelligence. <br />
                            <span className="text-zinc-400 dark:text-zinc-500">Grounded in theory, focused on implementation.</span>
                        </h2>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
                            Generative AI @ Cornell is the premier student organization dedicated to the research, development, and application of generative artificial intelligence.
                        </p>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
                            We bridge the gap between academic research and real-world impact by building cutting-edge tools for industry partners, hosting hackathons, and fostering a community of builders.
                        </p>
                        <div className="flex gap-4">
                            <Link
                                href="/team"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full font-medium hover:bg-red-700 dark:hover:bg-red-500 dark:hover:text-white transition-colors"
                            >
                                Meet the Team <ArrowRight size={18} />
                            </Link>
                            <Link
                                href="/apply"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-full font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                            >
                                Apply Now
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {[
                            {
                                icon: Terminal,
                                title: "Build",
                                description: "We engineering production-ready AI solutions for real clients, from startups to Fortune 500s."
                            },
                            {
                                icon: Cpu,
                                title: "Learn",
                                description: "Weekly workshops, reading groups, and guest lectures from industry leaders keep us at the bleeding edge."
                            },
                            {
                                icon: Users,
                                title: "Connect",
                                description: "A tight-knit community of the most talented AI engineers, researchers, and designers at Cornell."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-[#1E1730] border border-zinc-200 dark:border-zinc-700/50 p-6 rounded-2xl hover:border-red-200 dark:hover:border-red-900/50 hover:shadow-lg hover:shadow-red-500/5 dark:hover:shadow-red-500/10 transition-all duration-300 group">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:bg-red-50 dark:group-hover:bg-red-900/30 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">{item.title}</h3>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partners Section */}
            <div className="pb-24">
                <PartnersGrid />
            </div>
        </div>
    );
}

