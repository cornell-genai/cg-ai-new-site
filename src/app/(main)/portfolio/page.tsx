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
    description: "An intelligent system that verifies vendor legitimacy by cross-referencing public business records, risk databases, and online presence. Flags potential issues like high-risk scores, inactive registrations, or adverse news.",
    image: "/quickfi-logo-01-1.png",
    tags: ["Risk Management", "Fraud Prevention", "AI Agents", "FinTech"],
    status: "Completed",
    link: "https://drive.google.com/file/u/0/d/1Pu6QSW2ClZg3em3bRcolzeS73srP9z-p/view"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-zinc-900 font-sans selection:bg-red-100 selection:text-red-900 pt-32 pb-20">
      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[-5%] w-[35%] h-[35%] bg-red-600/5 blur-[160px] rounded-full" />
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-red-400/5 blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-red-700">Portfolio</span>
              <div className="h-[2px] w-12 bg-red-100" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">Our Work</h1>
          </div>
          <div className="max-w-md pb-2">
            <p className="text-lg text-zinc-500 font-normal leading-relaxed">
              A showcase of the AI tools and solutions our team has built for industry partners and the Cornell community.
            </p>
          </div>
        </div>

        {/* Project Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {PROJECTS.map((project) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              className="group bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:border-red-300 hover:shadow-2xl hover:shadow-red-900/10 transition-all duration-300 hover:-translate-y-2 will-change-transform flex flex-col"
            >
              {/* Image Container - Proper sizing for logos */}
              <div className="relative bg-zinc-50 p-8 flex items-center justify-center h-48 border-b border-zinc-100">
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Status Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${project.status === 'Completed'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                  {project.status}
                </div>
              </div>

              {/* Tags */}
              <div className="px-6 pt-5 pb-3 flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase tracking-wider px-2.5 py-1 bg-zinc-100 rounded-md text-zinc-600 font-medium hover:bg-red-50 hover:text-red-700 transition-colors cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Content */}
              <div className="px-6 pb-6 flex-grow flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600 mb-2 block">
                  {project.category}
                </span>
                <h3 className="text-xl font-bold text-zinc-900 mb-3 group-hover:text-red-800 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed mb-6 flex-grow">
                  {project.description}
                </p>

                {/* Link */}
                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-900 hover:text-red-700 transition-colors group/link"
                  >
                    <ExternalLink size={14} className="transition-transform group-hover/link:rotate-12" />
                    View Case Study
                    <ArrowUpRight size={12} className="opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-zinc-400">
                    Coming Soon
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-20 text-center"
        >
          <p className="text-zinc-400 text-sm mb-4">Interested in partnering with us?</p>
          <a
            href="mailto:cgai-exec@cornell.edu"
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-full font-medium hover:bg-red-700 transition-colors"
          >
            Get in Touch <ArrowUpRight size={16} />
          </a>
        </motion.div>
      </div>
    </div>
  );
}