"use client";

import React from 'react';
import { GrainOverlay } from '@/components/ui/GrainOverlay';
import { ArrowRight, Code, Palette, Coffee } from 'lucide-react';
import Link from 'next/link';

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

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-zinc-900 font-sans selection:bg-red-100 selection:text-red-900 pt-32 pb-20">
      {/* <GrainOverlay /> */}

      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] right-[20%] w-[30%] h-[30%] bg-red-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-red-700">Recruitment</span>
              <div className="h-[1px] flex-1 w-12 bg-red-200" />
            </div>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter">Join Us</h1>
          </div>
          <div className="max-w-md pb-2">
            <p className="text-lg text-zinc-500 font-light leading-relaxed">
              Spring 2026 recruitment is open. We look for drive, technical depth, and the ability to ship.
            </p>
          </div>
        </div>

        {/* Timeline Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-zinc-900">Recruitment Timeline</h2>
          <div className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm">
            <div className="relative">
              {/* Vertical line for mobile */}
              <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-zinc-200 md:hidden" />
              {/* Horizontal line for desktop */}
              <div className="absolute top-[7px] left-0 right-0 h-[1px] bg-gradient-to-r from-red-500/20 via-zinc-200 to-transparent hidden md:block" />

              <div className="grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-4">
                {TIMELINE.map((item, idx) => (
                  <div key={idx} className="relative flex md:flex-col items-center md:items-start gap-4 md:gap-3 group">
                    <div className={`w-4 h-4 rounded-full border-2 border-[#FAFAF9] z-10 transition-colors duration-300 flex-shrink-0 ${idx === 0 ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.3)]' : 'bg-zinc-200 group-hover:bg-red-400'}`} />
                    <div>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">{item.date}</p>
                      <p className="text-sm text-zinc-800 font-medium group-hover:text-red-700 transition-colors duration-200">{item.label}</p>
                      {item.location && (
                        <p className="text-xs text-zinc-500 mt-1">{item.location}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Open Roles */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-zinc-900">Open Roles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {ROLES.map((role) => (
              <div
                key={role.id}
                className="group bg-white border border-zinc-200 rounded-xl p-6 hover:border-red-200 hover:shadow-lg hover:shadow-red-500/5 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-zinc-50 group-hover:bg-red-50 transition-colors duration-300">
                    <role.icon size={24} className="text-zinc-400 group-hover:text-red-600 transition-colors duration-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-zinc-900 mb-1">{role.title}</h3>
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
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500/40" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={role.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-red-700 active:scale-95 transition-all duration-200 shadow-lg shadow-zinc-500/10"
                >
                  Apply Now <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Coffee Chat */}
        <section className="mb-16">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white border border-zinc-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-red-50">
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
              className="flex items-center gap-2 px-5 py-2 border border-zinc-200 rounded-full text-sm font-medium text-zinc-600 hover:bg-zinc-900 hover:text-white active:scale-95 transition-all duration-200"
            >
              Book Coffee Chat <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-8 text-zinc-900">FAQs</h2>
          <div className="space-y-6">
            {[
              {
                q: "Who we look for",
                a: "The most important trait is drive. We want to know that you can get things done no matter the challenge. Second is technical depth. Third is 'vibe'—we are a tight-knit team.",
              },
              {
                q: "The Application",
                a: "We want to see your skills put to the test in building and shipping a real AI application. You have 3 weeks. Any idea goes.",
              },
              {
                q: "Environment",
                a: "You'll be part of a small, agile team working quickly on specific client projects. We focus on delivering real solutions.",
              }
            ].map((f) => (
              <div key={f.q} className="border-l-2 border-red-200 pl-6 py-2">
                <h3 className="text-lg font-bold text-zinc-900 mb-2">{f.q}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed font-light">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
