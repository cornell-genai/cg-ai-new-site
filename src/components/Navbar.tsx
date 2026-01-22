"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Team", href: "/team" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Apply", href: "/apply", highlight: true },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${scrolled && !isOpen ? "py-4" : "py-6"
          }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={`flex items-center gap-3 group relative z-50 transition-colors duration-300 ${isOpen ? "text-zinc-900" : "text-zinc-900"}`}
            onClick={() => setIsOpen(false)}
          >
            <div className="relative w-8 h-8">
              {/* Using the text fallback or SVG if available. Assuming clean text for now as per design trends or keeping existing SVG if file exists */}
              <img src="/cgaiweb.svg" alt="CGAI" className="w-full h-full object-contain" />
            </div>
            <span className={`font-display font-bold hidden sm:inline transition-colors duration-300 group-hover:text-red-700 ${isOpen ? "text-zinc-900" : "text-zinc-900"}`}>
              Gen AI @ Cornell
            </span>
          </Link>

          {/* Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`relative z-50 p-3 rounded-full transition-all duration-300 ${isOpen
                ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                : scrolled
                  ? "bg-white/80 backdrop-blur-md shadow-sm border border-zinc-200/50 text-zinc-900 hover:bg-white"
                  : "bg-white/50 backdrop-blur-sm border border-transparent text-zinc-900 hover:bg-white"
              }`}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Full Screen Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-[#FAFAF9] flex flex-col justify-center items-center"
          >
            {/* Background Decoration */}
            <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-red-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="flex flex-col gap-6 w-full max-w-md px-6 relative z-10">
              {NAV_ITEMS.map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.1 + idx * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${pathname === item.href
                        ? "bg-red-50 text-red-900"
                        : "hover:bg-zinc-100 text-zinc-900"
                      }`}
                  >
                    <span className="text-3xl md:text-4xl font-bold tracking-tight">
                      {item.label}
                    </span>
                    <span className={`p-2 rounded-full transition-all duration-300 ${pathname === item.href
                        ? "bg-red-100 text-red-600"
                        : "bg-zinc-100 text-zinc-400 group-hover:bg-red-100 group-hover:text-red-600"
                      }`}>
                      <ArrowRight className="w-6 h-6 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-12 left-0 right-0 text-center"
            >
              <p className="text-zinc-400 text-sm uppercase tracking-widest font-medium">
                Generative AI @ Cornell
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}