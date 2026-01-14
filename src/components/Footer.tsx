"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-white/5 bg-[var(--color-obsidian)]">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/cgaiweb.svg" alt="CGAI Logo" className="h-10 w-auto" />
              <span className="font-display font-bold text-lg text-white">Gen AI @ Cornell</span>
            </div>
            <p className="text-sm text-zinc-500 max-w-sm leading-relaxed">
              Cornell's premier student organization for building production-grade generative AI applications.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-mono text-xs text-[var(--color-laser-red)] uppercase tracking-widest mb-4">Navigate</h4>
            <ul className="space-y-2">
              {['Home', 'Portfolio', 'Team', 'Apply'].map((item) => (
                <li key={item}>
                  <Link href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-sm text-zinc-400 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-mono text-xs text-[var(--color-laser-red)] uppercase tracking-widest mb-4">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:contact@cornellgenai.com" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Email Us
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://github.com/Cornell-Gen-AI" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-600 font-mono">
            © {currentYear} Generative AI @ Cornell. All rights reserved.
          </p>
          <p className="text-xs text-zinc-600 font-mono">
            Architecting Intelligence.
          </p>
        </div>
      </div>
    </footer>
  );
}