"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

/**
 * GlassCard
 * A premium card component with glassmorphism effect, subtle border, and noise.
 */
interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = true, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-xl transition-all duration-500",
        hoverEffect && "hover:border-white/20 hover:bg-white/[0.06] hover:shadow-2xl hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {/* Subtle Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-noise z-0" />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * GlowingButton
 * A button with an animated glow effect for primary actions.
 */
interface GlowingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

export function GlowingButton({ children, className, variant = "primary", ...props }: GlowingButtonProps) {
  const isPrimary = variant === "primary";
  
  return (
    <button
      className={cn(
        "group relative inline-flex items-center justify-center rounded-xl px-8 py-3.5 font-medium transition-all duration-300",
        isPrimary 
          ? "bg-white text-black hover:scale-105" 
          : "bg-white/10 text-white border border-white/10 hover:bg-white/20",
        className
      )}
      {...props}
    >
      {isPrimary && (
        <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-60 animate-gradient-x" />
      )}
      {children}
    </button>
  );
}

/**
 * TitaniumCard
 * A sleek, dark metal-styled card for technical content.
 */
export function TitaniumCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "relative rounded-xl bg-gradient-to-br from-[#1a1c23] to-[#0F1115] border border-white/5 shadow-2xl p-6",
      className
    )}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03),transparent_70%)]" />
      {children}
    </div>
  );
}
