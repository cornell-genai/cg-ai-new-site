"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-zinc-200 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src="/cgaiweb.svg" alt="CGAI Logo" className="h-8 w-auto mix-blend-darken" />
              <span className="font-display font-bold text-lg text-zinc-900">Gen AI @ Cornell</span>
            </div>
            <p className="text-base text-zinc-500 max-w-sm leading-relaxed mb-6">
              Cornell's premier student organization for building production-grade generative AI applications.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6">Navigate</h4>
            <ul className="space-y-3">
              {['Home', 'Portfolio', 'Team', 'Apply'].map((item) => (
                <li key={item}>
                  <Link href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-sm text-zinc-500 hover:text-red-700 transition-colors font-medium">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6">Connect</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:contact@cornellgenai.com" className="text-sm text-zinc-500 hover:text-red-700 transition-colors font-medium">
                  Email Us
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-500 hover:text-red-700 transition-colors font-medium">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://github.com/Cornell-Gen-AI" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-500 hover:text-red-700 transition-colors font-medium">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-500">
            © {currentYear} Generative AI @ Cornell. All rights reserved.
          </p>
          <p className="text-xs text-zinc-400 font-medium">
            Architecting Intelligence.
          </p>
        </div>
      </div>
    </footer>
  );
}