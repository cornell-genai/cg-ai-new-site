"use client";

import React from 'react';
import { GrainOverlay } from '@/components/ui/GrainOverlay';
import Timeline, { TimelineItemData } from "@/components/Timeline";
import { Calendar, Users, FileText, MessageSquare, CheckCircle } from "lucide-react";
import Link from "next/link";

const items: TimelineItemData[] = [
  { icon: <Calendar className="h-6 w-6" />, title: "Applications Open", date: "1/26/26" },
  { icon: <Users className="h-6 w-6" />, title: "Info Session 1", date: "TBD..." },
  { icon: <Users className="h-6 w-6" />, title: "Info Session 2", date: "TBD..." },
  { icon: <FileText className="h-6 w-6" />, title: "Project Submission Deadline", date: "TBD..." },
  { icon: <MessageSquare className="h-6 w-6" />, title: "Interviews", date: "TBD..." },
  { icon: <CheckCircle className="h-6 w-6" />, title: "Decisions", date: "TBD..." },
];

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#FFFFFF] font-sans selection:bg-[#E62E2E] selection:text-white pt-32 pb-20">
      <GrainOverlay />

      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] right-[20%] w-[30%] h-[30%] bg-[#E62E2E]/5 blur-[160px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#E62E2E]">Recruitment</span>
              <div className="h-[1px] flex-1 w-12 bg-white/10" />
            </div>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter">Join Us</h1>
          </div>
          <div className="max-w-md pb-2">
            <p className="text-lg text-white/40 font-light leading-relaxed">
              We look for drive, technical depth, and the ability to ship.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Timeline Section */}
          <div className="relative">
            <div className="absolute left-[-20px] top-0 bottom-0 w-[1px] bg-white/5" />
            <Timeline items={items} />
          </div>

          <div className="space-y-12">
            <div className="p-8 border border-white/5 bg-white/[0.02] backdrop-blur-sm rounded-sm">
              <h3 className="text-2xl font-bold mb-6">Status: <span className="text-white/40">Offline</span></h3>
              <p className="text-white/40 leading-relaxed font-light mb-8">
                We are currently not in the recruitment season. Check back around the start of the SP26 semester.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="https://docs.google.com/forms/d/e/1FAIpQLSeGj9KCqA4_iu4gMfV97mGATUtohsvN2yY3JbgpjH45ZTsX8A/viewform?usp=dialog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-4 bg-white/5 text-white/40 font-bold text-[10px] uppercase tracking-[0.2em] border border-white/5 cursor-not-allowed text-center"
                >
                  Applications Closed
                </Link>
                <Link
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfWeNJ32lSA8jg-X1cBjJsSkinwIv0jX7tiE9ruvhOJJxyzdA/viewform?usp=dialog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-4 bg-white text-black font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-[#E62E2E] hover:text-white transition-all text-center"
                >
                  Coffee Chat
                </Link>
              </div>
            </div>

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
                <div key={f.q} className="border-l-2 border-white/10 pl-6 py-2">
                  <h3 className="text-lg font-bold text-white mb-2">{f.q}</h3>
                  <p className="text-sm text-white/40 leading-relaxed font-light">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
