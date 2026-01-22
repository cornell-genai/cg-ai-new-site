"use client";
import React from 'react';
import { GrainOverlay } from '@/components/ui/GrainOverlay';
import { DiffusedImage } from '@/components/ui/DiffusedImage';

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-zinc-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 pt-32 pb-20">
      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-red-600/5 blur-[160px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-red-700">Portfolio</span>
              <div className="h-[2px] flex-1 w-12 bg-red-100" />
            </div>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter">Our Work</h1>
          </div>
          <div className="max-w-md pb-2">
            <p className="text-lg text-zinc-500 font-normal leading-relaxed">
              A showcase of the tools, projects, and innovations our team has developed to push the boundaries of Generative AI.
            </p>
          </div>
        </div>

        {/* ClassGPT Project */}
        <section className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600 mb-4 block">Academic Infrastructure</span>
              <h2 className="text-4xl font-bold text-zinc-900 mb-6">ClassGPT</h2>
              <p className="text-zinc-600 leading-relaxed text-lg font-normal mb-8">
                CGAI is currently working on ClassGPT, which is a Cornell-exclusive product for both professors and students.
                ClassGPT will allow professors to create AI Tutors educated on their course content. Students will be able to
                join classes that are supported and instantly have access to a AI Tutor specifically educated on that class content.
              </p>
            </div>
            <div className="aspect-[4/3] w-full rounded-xl overflow-hidden border border-zinc-200 shadow-xl shadow-zinc-200/50 relative">
              <DiffusedImage src="/classgpt.png" alt="ClassGPT Logo" />
            </div>
          </div>
        </section>

        {/* QuickFi Project */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="order-2 lg:order-1 aspect-[4/3] w-full rounded-xl overflow-hidden border border-zinc-200 shadow-xl shadow-zinc-200/50 relative">
              <DiffusedImage src="/quickfi-logo-01-1.png" alt="QuickFi Logo" />
            </div>

            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600">Enterprise Infrastructure</span>
              </div>
              <h2 className="text-4xl font-bold text-zinc-900 mb-6">QuickFi</h2>
              <a
                href="https://drive.google.com/file/u/0/d/1Pu6QSW2ClZg3em3bRcolzeS73srP9z-p/view"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs font-bold uppercase tracking-[0.2em] text-zinc-900 hover:text-red-700 transition-colors mb-8 border-b border-zinc-200 pb-1 hover:border-red-700"
              >
                View Case Study
              </a>

              <div className="space-y-8">
                <div>
                  <h4 className="text-xl font-bold text-zinc-900 mb-3">AI Insurance Verification</h4>
                  <p className="text-zinc-600 leading-relaxed font-normal">
                    An AI agent initiates outreach to insurance providers, requests required commercial insurance certificates,
                    validates that all contract-specific coverage details are present, and updates internal records.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-zinc-900 mb-3">Automated Vendor Due Diligence</h4>
                  <p className="text-zinc-600 leading-relaxed font-normal">
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