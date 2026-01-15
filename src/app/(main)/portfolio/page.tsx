"use client";
import React from 'react';
import { GrainOverlay } from '@/components/ui/GrainOverlay';
import { DiffusedImage } from '@/components/ui/DiffusedImage';

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#FFFFFF] font-sans selection:bg-[#E62E2E] selection:text-white pt-32 pb-20">
      <GrainOverlay />

      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-[#E62E2E]/5 blur-[160px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#E62E2E]">Portfolio</span>
              <div className="h-[1px] flex-1 w-12 bg-white/10" />
            </div>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter">Our Work</h1>
          </div>
          <div className="max-w-md pb-2">
            <p className="text-lg text-white/40 font-light leading-relaxed">
              A showcase of the tools, projects, and innovations our team has developed to push the boundaries of Generative AI.
            </p>
          </div>
        </div>

        {/* ClassGPT Project */}
        <section className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E62E2E] mb-4 block">Academic Infrastructure</span>
              <h2 className="text-4xl font-bold text-white mb-6">ClassGPT</h2>
              <p className="text-white/40 leading-relaxed text-lg font-light mb-8">
                CGAI is currently working on ClassGPT, which is a Cornell-exclusive product for both professors and students.
                ClassGPT will allow professors to create AI Tutors educated on their course content. Students will be able to
                join classes that are supported and instantly have access to a AI Tutor specifically educated on that class content.
              </p>
            </div>
            <div className="aspect-[4/3] w-full rounded-sm overflow-hidden border border-white/5 relative">
              <DiffusedImage src="/classgpt.png" alt="ClassGPT Logo" />
            </div>
          </div>
        </section>

        {/* QuickFi Project */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="order-2 lg:order-1 aspect-[4/3] w-full rounded-sm overflow-hidden border border-white/5 relative">
              <DiffusedImage src="/quickfi-logo-01-1.png" alt="QuickFi Logo" />
            </div>

            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E62E2E]">Enterprise Infrastructure</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">QuickFi</h2>
              <a
                href="https://drive.google.com/file/u/0/d/1Pu6QSW2ClZg3em3bRcolzeS73srP9z-p/view"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs font-bold uppercase tracking-[0.2em] text-white hover:text-[#E62E2E] transition-colors mb-8 border-b border-white/10 pb-1"
              >
                View Case Study
              </a>

              <div className="space-y-8">
                <div>
                  <h4 className="text-xl font-bold text-white mb-3">AI Insurance Verification</h4>
                  <p className="text-white/40 leading-relaxed font-light">
                    An AI agent initiates outreach to insurance providers, requests required commercial insurance certificates,
                    validates that all contract-specific coverage details are present, and updates internal records.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-3">Automated Vendor Due Diligence</h4>
                  <p className="text-white/40 leading-relaxed font-light">
                    An intelligent system verifies vendor legitimacy by cross-referencing public business records, risk databases,
                    and online presence. It flags potential issues like high-risk scores or mismatched addresses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}