"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ExternalLink, ArrowUpRight } from 'lucide-react';

const PROJECTS = [
  {
    id: 1,
    title: "ClassGPT",
    category: "Internal Product",
    description: "A Cornell-exclusive AI tutoring platform that enables professors to create AI Tutors educated on their course content. Students can join supported classes and instantly access personalized tutoring tailored to their specific course material.",
    image: "/classgpt.png",
    tags: ["AI Tutoring", "RAG", "LLMs", "Education"],
    status: "In Development",
    link: null
  },
  {
    id: 2,
    title: "QuickFi: Insurance Verification",
    category: "QuickFi Partnership",
    description: "An AI agent that initiates outreach to insurance providers, requests commercial insurance certificates, validates contract-specific coverage details, handles follow-ups, and ensures documentation is stored correctly for compliance.",
    image: "/quickfi-logo-01-1.png",
    tags: ["AI Agents", "Automation", "Insurance", "Compliance"],
    status: "Completed",
    link: "https://drive.google.com/file/u/0/d/1Pu6QSW2ClZg3em3bRcolzeS73srP9z-p/view"
  },
  {
    id: 3,
    title: "QuickFi: Vendor Due Diligence",
    category: "QuickFi Partnership",
    description: "An intelligent system that verifies vendor legitimacy by cross-referencing public business records, risk databases, and online presence. Flags potential issues like high-risk scores, inactive registrations, or adverse news for internal review.",
    image: "/quickfi-logo-01-1.png",
    tags: ["Risk Management", "Fraud Prevention", "AI Agents", "FinTech"],
    status: "Completed",
    link: "https://drive.google.com/file/u/0/d/1Pu6QSW2ClZg3em3bRcolzeS73srP9z-p/view"
  }
];

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
};

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#0F0A1A] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-red-100 dark:selection:bg-red-900 selection:text-red-900 dark:selection:text-red-100 pt-32 pb-20 transition-colors duration-300">
      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[-5%] w-[35%] h-[35%] bg-red-600/5 dark:bg-red-600/10 blur-[160px] rounded-full" />
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-red-400/5 dark:bg-red-400/10 blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-red-700 dark:text-red-500">Portfolio</span>
              <div className="h-[2px] w-12 bg-red-100 dark:bg-red-900/30" />
            </div>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter">Our Work</h1>
          </div>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed">
            A showcase of the AI tools and solutions our team has built for industry partners and the Cornell community.
          </p>
        </div>
      </div>

      {/* Project Sections - Alternating Layout */}
      {PROJECTS.map((project, index) => (
        <motion.section
          key={project.id}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 last:mb-8"
        >
          <div className={`max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''
            }`}>
            {/* Image Side */}
            <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''} group`}>
              <div className="relative bg-white dark:bg-[#1E1730] rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden shadow-lg shadow-zinc-200/50 dark:shadow-black/20 hover:shadow-xl hover:shadow-red-900/10 dark:hover:shadow-red-900/20 hover:border-red-200 dark:hover:border-red-800/50 transition-all duration-500">
                {/* Status Badge */}
                <div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${project.status === 'Completed'
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                  }`}>
                  {project.status}
                </div>

                {/* Image Container */}
                <div className="aspect-[4/3] relative bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center p-8">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Tags Bar */}
                <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-800/30 border-t border-zinc-100 dark:border-zinc-700/50 flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] uppercase tracking-wider px-2.5 py-1 bg-white dark:bg-zinc-800 rounded-md text-zinc-600 dark:text-zinc-400 font-medium border border-zinc-200 dark:border-zinc-700 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 transition-colors cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Text Side */}
            <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600 dark:text-red-500 mb-4 block">
                {project.category}
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 tracking-tight">
                {project.title}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg font-normal mb-8">
                {project.description}
              </p>

              {project.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-100 hover:text-red-700 dark:hover:text-red-500 transition-colors border-b-2 border-zinc-200 dark:border-zinc-600 pb-1 hover:border-red-700 dark:hover:border-red-500 group/link"
                >
                  <ExternalLink size={14} />
                  View Case Study
                  <ArrowUpRight size={12} className="opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                  Case Study Coming Soon
                </span>
              )}
            </div>
          </div>
        </motion.section>
      ))}

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-8 text-center"
      >
        <p className="text-zinc-400 dark:text-zinc-500 text-sm mb-4">Interested in partnering with us?</p>
        <a
          href="mailto:cgai-exec@cornell.edu"
          className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full font-medium hover:bg-red-700 dark:hover:bg-red-500 dark:hover:text-white transition-colors"
        >
          Get in Touch <ArrowUpRight size={16} />
        </a>
      </motion.div>
    </div>
  );
}