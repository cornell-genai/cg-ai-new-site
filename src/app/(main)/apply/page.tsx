"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight, Code, Palette, Coffee } from 'lucide-react';
import Link from 'next/link';

const TIMELINE = [
  { date: "Jan 20", fullDate: "2026-01-20", label: "Coffee Chats Open", location: null },
  { date: "Jan 21", fullDate: "2026-01-21", label: "All Applications Open", location: null },
  { date: "Jan 25", fullDate: "2026-01-25", label: "Club Fest", location: null },
  { date: "Jan 29", fullDate: "2026-01-29", label: "Info Session #1", location: "Stimson Hall" },
  { date: "Feb 1", fullDate: "2026-02-01", label: "Info Session #2", location: "Gates Hall G01" },
  { date: "Feb 7", fullDate: "2026-02-07", label: "Applications Due", location: null },
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
  // Get current date in EST timezone as YYYY-MM-DD string
  const [todayDateString, setTodayDateString] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    const estString = now.toLocaleDateString("en-CA", { timeZone: "America/New_York" });
    setTodayDateString(estString); // Format: "2026-01-22"
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#0F0A1A] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-red-100 dark:selection:bg-red-900 selection:text-red-900 dark:selection:text-red-100 pt-32 pb-20 transition-colors duration-300">

      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] right-[20%] w-[30%] h-[30%] bg-red-500/5 dark:bg-red-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-red-700 dark:text-red-500">Recruitment</span>
              <div className="h-[1px] flex-1 w-12 bg-red-200 dark:bg-red-900/30" />
            </div>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter">Join Us</h1>
          </div>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
            Spring 2026 recruitment is open. We look for drive, technical depth, and the ability to ship.
          </p>
        </div>

        {/* Timeline Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-zinc-900 dark:text-zinc-100">Recruitment Timeline</h2>
          <div className="bg-white dark:bg-[#1E1730] border border-zinc-200 dark:border-zinc-700 rounded-xl p-8 shadow-sm">
            <div className="relative">
              {/* Vertical line for mobile */}
              <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-zinc-200 dark:bg-zinc-700 md:hidden" />
              {/* Horizontal line for desktop */}
              <div className="absolute top-[7px] left-0 right-0 h-[1px] bg-gradient-to-r from-red-500/20 via-zinc-200 dark:via-zinc-700 to-transparent hidden md:block" />

              <div className="grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-4">
                {TIMELINE.map((item, idx) => {
                  // Find the most recent event that occurred on or before today
                  let isActive = false;
                  if (todayDateString) {
                    // Find all events that have occurred (on or before today)
                    const pastOrCurrentEvents = TIMELINE.filter(t => t.fullDate <= todayDateString);
                    // The most recent one is the last one (since they're in chronological order)
                    const mostRecentEvent = pastOrCurrentEvents.length > 0
                      ? pastOrCurrentEvents[pastOrCurrentEvents.length - 1]
                      : null;
                    isActive = mostRecentEvent?.fullDate === item.fullDate;
                  }

                  return (
                    <div key={idx} className="relative flex md:flex-col items-center md:items-start gap-4 md:gap-3 group">
                      <div className={`w-4 h-4 rounded-full border-2 border-[#FAFAF9] dark:border-[#0F0A1A] z-10 transition-colors duration-300 flex-shrink-0 ${isActive ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.3)]' : 'bg-zinc-200 dark:bg-zinc-600 group-hover:bg-red-400'}`} />
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isActive ? 'text-red-600 dark:text-red-500' : 'text-zinc-400 dark:text-zinc-500'}`}>{item.date}</p>
                        <p className="text-sm text-zinc-800 dark:text-zinc-200 font-medium group-hover:text-red-700 dark:group-hover:text-red-500 transition-colors duration-200">{item.label}</p>
                        {item.location && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{item.location}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Open Roles */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-zinc-900 dark:text-zinc-100">Open Roles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {ROLES.map((role) => {
              // Define color schemes for each role type - muted, subtle tones
              const isDeveloper = role.id === 'developer';
              const colorClasses = isDeveloper ? {
                // Developer - Muted red/rose with subtle fill
                cardBg: 'bg-red-50/50 dark:bg-red-950/20',
                border: 'border-red-100 dark:border-red-900/40 hover:border-red-200 dark:hover:border-red-800/60',
                shadow: 'hover:shadow-red-500/5 dark:hover:shadow-red-900/20',
                iconBg: 'bg-red-100 dark:bg-red-900/40',
                iconColor: 'text-red-700 dark:text-red-400',
                bullet: 'bg-red-400/50 dark:bg-red-500/40',
                button: 'bg-red-700 hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-600',
              } : {
                // Design/Marketing - Muted purple with subtle fill
                cardBg: 'bg-purple-50/50 dark:bg-purple-950/20',
                border: 'border-purple-100 dark:border-purple-900/40 hover:border-purple-200 dark:hover:border-purple-800/60',
                shadow: 'hover:shadow-purple-500/5 dark:hover:shadow-purple-900/20',
                iconBg: 'bg-purple-100 dark:bg-purple-900/40',
                iconColor: 'text-purple-700 dark:text-purple-400',
                bullet: 'bg-purple-400/50 dark:bg-purple-500/40',
                button: 'bg-purple-800 hover:bg-purple-900 dark:bg-purple-800 dark:hover:bg-purple-700',
              };

              return (
                <div
                  key={role.id}
                  className={`group ${colorClasses.cardBg} border ${colorClasses.border} rounded-xl p-6 hover:shadow-lg ${colorClasses.shadow} transition-all duration-300`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-lg ${colorClasses.iconBg} transition-colors duration-300`}>
                      <role.icon size={24} className={`${colorClasses.iconColor} transition-colors duration-300`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-1">{role.title}</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">{role.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-5">
                    {role.description}
                  </p>

                  <div className="mb-6">
                    <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">What we look for</p>
                    <ul className="space-y-2">
                      {role.lookingFor.map((item, idx) => (
                        <li key={idx} className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${colorClasses.bullet}`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={role.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 ${colorClasses.button} text-white px-5 py-2.5 rounded-full text-sm font-medium active:scale-95 transition-all duration-200 shadow-lg shadow-zinc-500/10`}
                  >
                    Apply Now <ArrowRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* Coffee Chat */}
        <section className="mb-16">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white dark:bg-[#1E1730] border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30">
                <Coffee size={20} className="text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-zinc-900 dark:text-zinc-100 font-medium">Not sure which track?</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Book a coffee chat with a current member</p>
              </div>
            </div>
            <Link
              href="https://docs.google.com/forms/d/e/1FAIpQLSeT6zY3ZnLLzLh00GOcP-MQwYadRs49YOLukcxny0kytQCyAg/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2 border border-zinc-200 dark:border-zinc-600 rounded-full text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-900 dark:hover:bg-zinc-100 hover:text-white dark:hover:text-zinc-900 active:scale-95 transition-all duration-200"
            >
              Book Coffee Chat <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-8 text-zinc-900 dark:text-zinc-100">FAQs</h2>
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
              <div key={f.q} className="border-l-2 border-red-200 dark:border-red-800 pl-6 py-2">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">{f.q}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
