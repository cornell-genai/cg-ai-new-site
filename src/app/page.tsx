"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
  X,
  Github,
  Linkedin,
  Twitter,
  Layers,
  Menu
} from 'lucide-react';
import Image from 'next/image';

/**
 * GENAI AT CORNELL: THE STANFORD-INSPIRED EVOLUTION
 * Vibe: Organic Digital, Diffused Visuals, Shared Layout Transitions.
 */

const PROJECTS = [
  {
    id: 'classgpt',
    title: 'ClassGPT (SP25)',
    category: 'Academic Infrastructure',
    tagline: 'AI Tutors for Cornell',
    description: 'Creating AI Tutors educated on course content for professors and students.',
    details: 'ClassGPT allows professors to create AI Tutors educated on their course content. Students can join classes and instantly access an AI Tutor specifically educated on that class content, facilitating personalized learning at scale.',
    image: '/classgpt.png',
  },
  {
    id: 'quickfi',
    title: 'QuickFi Agentic Mesh',
    category: 'Enterprise Infrastructure',
    tagline: 'Scaleable Underwriting',
    description: 'Automating industrial underwriting through multi-agent verification.',
    details: 'Our collaboration with QuickFi focuses on two main pillars: AI Insurance Verification to validate coverage details, and Automated Vendor Due Diligence to verify business legitimacy against risk databases. The system reduces manual processing time while increasing compliance accuracy.',
    image: '/quickfi-logo-01-1.png',
  },
  {
    id: 'swarm',
    title: 'ComputeSwarm V4',
    category: 'Distributed Computing',
    tagline: 'Dynamic Resource Allocation',
    description: 'A decentralized GPU orchestration layer designed for Cornell’s local compute nodes.',
    details: 'ComputeSwarm V4 manages the allocation of distributed GPUs across campus. It provides a seamless API for researchers to submit training jobs that are automatically partitioned and executed across the most efficient available hardware nodes.',
    image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=1200',
  }
];

const LEADERSHIP = [
  { name: "Daniel Sachs", role: "Founding President", image: "/pfps/daniel.png" },
  { name: "Erik Pedersen", role: "Vice-President", image: "/pfps/erik.png" },
  { name: "Morgan Stuart", role: "Lead Engineer", image: "/pfps/morgan.png" },
  { name: "Merek Soriano", role: "Head of Partnerships", image: "/pfps/merek.png" },
  { name: "David Lee", role: "Head of Product", image: "/pfps/david.png" },
];

// --- Sub-components ---

import { GrainOverlay } from '@/components/ui/GrainOverlay';
import { DiffusedImage } from '@/components/ui/DiffusedImage';

const App = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  const selectedProject = PROJECTS.find(p => p.id === selectedId);

  return (
    <div className="min-h-screen bg-[#050505] text-[#FFFFFF] font-sans selection:bg-[#E62E2E] selection:text-white overflow-x-hidden">
      <GrainOverlay />

      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-[#E62E2E]/5 blur-[160px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-[#E62E2E]/5 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[60] px-6 sm:px-12 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-10 h-10 border border-white/10 flex items-center justify-center rounded-sm bg-white/5 backdrop-blur-md">
              <span className="text-[#E62E2E] font-bold text-xl leading-none">C</span>
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-bold tracking-tight uppercase">Generative AI at Cornell</h1>
              <p className="text-[10px] text-white/30 font-medium uppercase tracking-[0.2em]">Research & Implementation</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-12 text-[10px] font-bold tracking-[0.3em] uppercase text-white/40">
            <a href="#" className="hover:text-white transition-colors">Lab</a>
            <a href="#" className="hover:text-white transition-colors">Projects</a>
            <a href="#" className="hover:text-white transition-colors">People</a>
            <button className="flex items-center gap-2 group">
              <span className="h-[1px] w-8 bg-white/10 group-hover:w-12 group-hover:bg-[#E62E2E] transition-all" />
              <span className="text-white group-hover:text-[#E62E2E]">Inquiry</span>
            </button>
          </div>

          <div className="lg:hidden">
            <Menu size={20} className="text-white/40" />
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-48 sm:pt-64 px-6 sm:px-12 max-w-7xl mx-auto">

        {/* Hero Section */}
        <section className="mb-48">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#E62E2E]">Vanguard MMXXVI</span>
              <div className="h-[1px] flex-1 max-w-[40px] bg-white/10" />
            </div>

            <h2 className="text-6xl md:text-[110px] font-bold leading-[0.92] tracking-tighter mb-16">
              Engineering <br />
              <span className="italic font-serif font-light text-white/80 pr-4">Autonomous</span> <br />
              Agency.
            </h2>

            <div className="grid md:grid-cols-2 gap-16 items-end">
              <p className="text-lg md:text-xl text-white/40 leading-relaxed font-light max-w-lg">
                We operate as a high-fidelity implementation lab at Cornell, dedicated to architecting the next generation of scalable intelligence through rigorous hardware-software integration.
              </p>
              <div className="flex flex-col gap-6 font-mono text-[10px] text-white/20 uppercase tracking-[0.2em]">
                <div className="flex justify-between border-b border-white/5 pb-4">
                  <span>Current Focus</span>
                  <span className="text-white/60">Multi-Agent Orchestration</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-4">
                  <span>Node Status</span>
                  <span className="text-green-500/60 flex items-center gap-2">
                    <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" /> Operational
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Project Section */}
        <section className="mb-64">
          <div className="flex items-end justify-between mb-16 border-b border-white/5 pb-8">
            <h3 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/30">Active Initiatives</h3>
            <span className="text-[9px] font-mono text-white/20">EXPLORE WORK [ 0{PROJECTS.length} ]</span>
          </div>

          <LayoutGroup>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {PROJECTS.map(project => (
                <motion.div
                  layoutId={project.id}
                  key={project.id}
                  onClick={() => setSelectedId(project.id)}
                  className="group cursor-pointer"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <motion.div className="aspect-[3/4] rounded-lg overflow-hidden mb-8 bg-[#121212] border border-white/5 relative">
                    <DiffusedImage src={project.image} alt={project.title} />
                  </motion.div>
                  <motion.div layoutId={`content-${project.id}`}>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E62E2E] mb-3 block">{project.tagline}</span>
                    <h4 className="text-2xl font-bold tracking-tight mb-3">{project.title}</h4>
                    <p className="text-sm text-white/30 leading-relaxed font-light">{project.description}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Expansion Overlay */}
            <AnimatePresence>
              {selectedId && selectedProject && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedId(null)}
                    className="fixed inset-0 bg-[#050505]/90 backdrop-blur-md z-[70] cursor-zoom-out"
                  />
                  <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-8 pointer-events-none">
                    <motion.div
                      layoutId={selectedId}
                      className="bg-[#0A0A0A] w-full max-w-6xl rounded-2xl overflow-hidden pointer-events-auto shadow-2xl border border-white/10"
                    >
                      <div className="grid lg:grid-cols-2 h-full max-h-[90vh] overflow-y-auto lg:overflow-visible">
                        <div className="h-[300px] lg:h-auto border-b lg:border-b-0 lg:border-r border-white/10 relative">
                          <DiffusedImage src={selectedProject.image} alt={selectedProject.title} />
                        </div>
                        <div className="p-8 sm:p-16 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-12">
                              <motion.div layoutId={`content-${selectedId}`}>
                                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#E62E2E] mb-2 block">
                                  {selectedProject.category}
                                </span>
                                <h3 className="text-3xl sm:text-5xl font-bold tracking-tight">{selectedProject.title}</h3>
                              </motion.div>
                              <button
                                onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                              >
                                <X size={18} />
                              </button>
                            </div>
                            <div className="space-y-6 text-white/50 text-base sm:text-lg leading-relaxed font-light mb-12">
                              <p>{selectedProject.details}</p>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4">
                            <button className="flex-1 py-4 bg-white text-black font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-[#E62E2E] hover:text-white transition-all">
                              View Project
                            </button>
                            <button className="px-8 py-4 border border-white/10 hover:bg-white/5 transition-all">
                              <Github size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </>
              )}
            </AnimatePresence>
          </LayoutGroup>
        </section>

        {/* Leadership Section - NEW */}
        <section className="mb-64">
          <div className="flex items-end justify-between mb-16 border-b border-white/5 pb-8">
            <h3 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/30">The Vanguard</h3>
            <span className="text-[9px] font-mono text-white/20">LEADERSHIP [ 0{LEADERSHIP.length} ]</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {LEADERSHIP.map((leader) => (
              <motion.div
                key={leader.name}
                className="group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="aspect-[3/4] overflow-hidden mb-6 bg-[#121212] border border-white/5 rounded-sm relative grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
                </div>
                <h4 className="text-sm font-bold tracking-tight text-white/90 group-hover:text-[#E62E2E] transition-colors">{leader.name}</h4>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.1em] mt-1">{leader.role}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Values / Principles Section */}
        <section className="mb-64">
          <div className="grid lg:grid-cols-2 gap-32">
            <div>
              <h3 className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#E62E2E] mb-12">Core Principles</h3>
              <p className="text-4xl sm:text-5xl font-bold leading-[1.1] tracking-tight text-white/90">
                We believe that <span className="italic font-serif font-light">infrastructure</span> is the true product of the generative era.
              </p>
            </div>
            <div className="space-y-16">
              <div className="group">
                <div className="flex items-center gap-6 mb-6">
                  <span className="text-white/10 font-mono text-xs">01</span>
                  <h4 className="text-lg font-bold uppercase tracking-widest group-hover:text-[#E62E2E] transition-colors">Implementation First</h4>
                </div>
                <p className="text-white/30 leading-relaxed font-light group-hover:text-white/60 transition-colors duration-500">
                  Theoretical research finds its true value when validated through hardware-software co-design. We build the stacks that run the future.
                </p>
              </div>
              <div className="group">
                <div className="flex items-center gap-6 mb-6">
                  <span className="text-white/10 font-mono text-xs">02</span>
                  <h4 className="text-lg font-bold uppercase tracking-widest group-hover:text-[#E62E2E] transition-colors">Distributed Agency</h4>
                </div>
                <p className="text-white/30 leading-relaxed font-light group-hover:text-white/60 transition-colors duration-500">
                  We specialize in systems where intelligence is decentralized, resilient, and capable of autonomous decision-making across high-latency networks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA / Contact */}
        <section className="mb-64 border-t border-white/5 pt-32 text-center">
          <h3 className="text-xs font-bold tracking-[0.4em] uppercase text-white/20 mb-12">Initiate Collaboration</h3>
          <h2 className="text-4xl sm:text-7xl font-bold tracking-tighter mb-16">Ready to <span className="italic font-serif font-light">Build?</span></h2>
          <button className="px-12 py-5 bg-white text-black font-bold text-xs uppercase tracking-[0.3em] hover:bg-[#E62E2E] hover:text-white transition-all transform hover:scale-105 active:scale-95">
            Contact the Lab
          </button>
        </section>

        {/* Footer */}
        <footer className="pb-20 pt-20 border-t border-white/5">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-24">
            <div className="max-w-md">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-8 border border-[#E62E2E] flex items-center justify-center text-[#E62E2E] font-bold text-xs">C</div>
                <h5 className="text-sm font-bold uppercase tracking-[0.2em]">GenAI Cornell</h5>
              </div>
              <p className="text-white/20 text-sm leading-relaxed font-light mb-8">
                Architecting autonomous systems for a decentralized world. Operated by the Cornell Vanguard Collective.
              </p>
              <div className="flex gap-6 text-white/30">
                <Twitter size={16} className="hover:text-white transition-colors" />
                <Linkedin size={16} className="hover:text-white transition-colors" />
                <Github size={16} className="hover:text-white transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 sm:gap-24">
              <div>
                <h6 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-8">Nodes</h6>
                <div className="flex flex-col gap-4 text-xs font-bold text-white/60">
                  <a href="#" className="hover:text-[#E62E2E] transition-colors">Lab Status</a>
                  <a href="#" className="hover:text-[#E62E2E] transition-colors">Archives</a>
                  <a href="#" className="hover:text-[#E62E2E] transition-colors">Register</a>
                </div>
              </div>
              <div>
                <h6 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-8">Protocols</h6>
                <div className="flex flex-col gap-4 text-xs font-bold text-white/60">
                  <a href="#" className="hover:text-[#E62E2E] transition-colors">Whitepaper</a>
                  <a href="#" className="hover:text-[#E62E2E] transition-colors">Ethics</a>
                  <a href="#" className="hover:text-[#E62E2E] transition-colors">Compute</a>
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <h6 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-8">Contact</h6>
                <div className="text-xs font-bold text-white/60 leading-relaxed uppercase tracking-tighter">
                  Bill & Melinda Gates Hall<br />
                  Ithaca, NY 14853
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 text-[9px] font-bold uppercase tracking-[0.4em] text-white/10">
            <div>© 2026 CORNELL GENERATIVE AI // ALL SYSTEMS NOMINAL</div>
            <div className="flex gap-12 mt-4 md:mt-0">
              <span className="flex items-center gap-2"><span className="w-1 h-1 bg-green-500/40 rounded-full" /> Latency: 22ms</span>
              <span className="flex items-center gap-2 text-[#E62E2E]/30"><Layers size={10} /> Implementation Lab</span>
            </div>
          </div>
        </footer>

      </main>

      {/* Persistent Floating Command */}
      <div className="fixed bottom-8 right-8 z-[60] hidden sm:block">
        <button className="w-14 h-14 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center group hover:bg-[#E62E2E] transition-all duration-700">
          <Layers size={18} className="text-white group-hover:rotate-12 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default App;
