"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GrainOverlay } from '@/components/ui/GrainOverlay';
import { Linkedin } from 'lucide-react';
import Image from 'next/image';

const executiveBoard = [
  { name: "Daniel Sachs", role: "Founding President", imageSrc: "/pfps/daniel.png", linkedInUrl: "https://www.linkedin.com/in/daniel-m-sachs/" },
  { name: "Erik Pedersen", role: "Vice-President", imageSrc: "/pfps/erik.png", linkedInUrl: "https://www.linkedin.com/in/erikzhangpedersen/" },
  { name: "Morgan Stuart", role: "Lead Engineer + NME Chair", imageSrc: "/pfps/morgan.png", linkedInUrl: "https://www.linkedin.com/in/morgan-nstuart/" },
  { name: "Merek Soriano", role: "Head of Corporate Partnership", imageSrc: "/pfps/merek.png", linkedInUrl: "https://www.linkedin.com/in/merek-soriano-0ba570291/" },
  { name: "David Lee", role: "Head of Product", imageSrc: "/pfps/david.png", linkedInUrl: "https://www.linkedin.com/in/dave-lee-716318242/" },
];

const administrationTeam = [
  { name: "Mahdi Choudhury", role: "Treasurer", imageSrc: "/pfps/mahdi.png", linkedInUrl: "https://www.linkedin.com/in/mahdi-choudhury-h/" },
  { name: "Akul Maheshwari", role: "DEI Chair", imageSrc: "/pfps/akul.png", linkedInUrl: "https://www.linkedin.com/in/akul-maheshwari/" },
];

const developmentTeam = [
  { name: "Bhavan Sai Balusu", role: "QuickFi – Credit Document AI Analysis", year: 1, imageSrc: "/pfps/blank_profile.webp", linkedInUrl: "" },
  { name: "Surya Chandrakasan", role: "QuickFi – Credit Document AI Analysis", year: 1, imageSrc: "/pfps/blank_profile.webp", linkedInUrl: "" },
  { name: "Trishia Khandelwal", role: "QuickFi – Credit Document AI Analysis", year: 1, imageSrc: "/pfps/blank_profile.webp", linkedInUrl: "" },
  { name: "Thurushi Kiyara Rajapakse", role: "QuickFi – Credit Document AI Analysis", year: 3, imageSrc: "/pfps/thurushi.png", linkedInUrl: "https://www.linkedin.com/in/thurushi-rajapakse" },
  { name: "Aleks Dzudzevic", role: "QuickFi – Credit Document AI Analysis", year: 1, imageSrc: "/pfps/alek.png", linkedInUrl: "" },
  { name: "Brandon Xu", role: "QuickFi – Vendor Due Diligence AI", year: 2, imageSrc: "/pfps/brandon.png", linkedInUrl: "https://www.linkedin.com/in/brandon-xu-284748322/" },
  { name: "Eddie Hu", role: "QuickFi – Vendor Due Diligence AI", year: 1, imageSrc: "/pfps/blank_profile.webp", linkedInUrl: "" },
  { name: "Audrey Lewellen", role: "QuickFi – Vendor Due Diligence AI", year: 3, imageSrc: "/pfps/audrey.png", linkedInUrl: "https://www.linkedin.com/in/audrey-lewellen-686823355/" },
  { name: "Mateo del Rio Lanse", role: "QuickFi – Vendor Due Diligence AI", year: 1, imageSrc: "/pfps/mateo.png", linkedInUrl: "https://www.linkedin.com/in/mdelriolanse" },
  { name: "Nicole Luo", role: "QuickFi – Invoice AI Analysis", year: 3, imageSrc: "/pfps/nicole.png", linkedInUrl: "https://www.linkedin.com/in/nicoleluo7/" },
  { name: "Pratyush Saxena", role: "QuickFi – Invoice AI Analysis", year: 1, imageSrc: "/pfps/blank_profile.webp", linkedInUrl: "" },
  { name: "Anmol Karan", role: "QuickFi – Invoice AI Analysis", year: 1, imageSrc: "/pfps/anmol.jpeg", linkedInUrl: "" },
  { name: "Christina Maria Joseph", role: "QuickFi – Invoice AI Analysis", year: 2, imageSrc: "/pfps/blank_profile.webp", linkedInUrl: "" },
  { name: "Lauren Amelie Ah-Hot", role: "QuickFi – Invoice AI Analysis", year: 3, imageSrc: "/pfps/blank_profile.webp", linkedInUrl: "" },
  { name: "Zahrizhal Ali, Jr", role: "QuickFi", year: 5, imageSrc: "/pfps/blank_profile.webp", linkedInUrl: "" },
  { name: "Dhruv Mandalik", role: "Vero", year: 1, imageSrc: "/pfps/blank_profile.webp", linkedInUrl: "" },
  { name: "Zach Riiff", role: "Vero", year: 2, imageSrc: "/pfps/zach.png", linkedInUrl: "https://www.linkedin.com/in/zach-riiff-828018325/" },
  { name: "Alex Kozik", role: "Vero", year: 4, imageSrc: "/pfps/alex.png", linkedInUrl: "https://www.linkedin.com/in/alex-kozik/" },
  { name: "Rei Meguro", role: "Vero", year: 5, imageSrc: "/pfps/blank_profile.webp", linkedInUrl: "" },
  { name: "Yashnil Saha", role: "Bridge", year: 1, imageSrc: "/pfps/blank_profile.webp", linkedInUrl: "" },
  { name: "Asad Abbas Rizvi", role: "Bridge", year: 1, imageSrc: "/pfps/asad.png", linkedInUrl: "www.linkedin.com/in/asad-rizvi-02a1782a2" },
  { name: "Tanner Brendan Blake", role: "Bridge", year: 1, imageSrc: "/pfps/blank_profile.webp", linkedInUrl: "" },
  { name: "Arshdeep Kaur", role: "Bridge", year: 2, imageSrc: "/pfps/arshdeep.jpg", linkedInUrl: "https://www.linkedin.com/in/arshdeepkaur13/" }
];

const MemberCard = ({ name, role, imageSrc, linkedInUrl }: { name: string, role: string, imageSrc: string, linkedInUrl?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="group relative"
  >
    <div className="aspect-[3/4] mb-4 overflow-hidden bg-[#121212] border border-white/5 rounded-sm relative grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
      <Image
        src={imageSrc}
        alt={name}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
      {linkedInUrl && (
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 right-3 p-2 bg-white/10 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#E62E2E] hover:text-white"
        >
          <Linkedin size={14} />
        </a>
      )}
    </div>
    <h4 className="text-sm font-bold tracking-tight text-white/90 group-hover:text-[#E62E2E] transition-colors">{name}</h4>
    <p className="text-[10px] text-white/40 uppercase tracking-[0.1em] mt-1 line-clamp-2 h-8">{role}</p>
  </motion.div>
);

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#FFFFFF] font-sans selection:bg-[#E62E2E] selection:text-white pt-32 pb-20">
      <GrainOverlay />

      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] bg-[#E62E2E]/5 blur-[160px] rounded-full" />
        <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[30%] bg-[#E62E2E]/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#E62E2E]">Collective</span>
              <div className="h-[1px] flex-1 w-12 bg-white/10" />
            </div>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter">Our Team</h1>
          </div>
          <div className="max-w-md pb-2">
            <p className="text-lg text-white/40 font-light leading-relaxed">
              Builders, researchers, and operators focused on shipping real AI products.
            </p>
          </div>
        </div>

        {/* Executive Board */}
        <section className="mb-32">
          <div className="flex items-end justify-between mb-12 border-b border-white/5 pb-6">
            <h3 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/30">Executive Board</h3>
            <span className="text-[9px] font-mono text-white/20">MEMBERS [ 0{executiveBoard.length} ]</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-12">
            {executiveBoard.map((m) => (
              <MemberCard key={m.name} {...m} />
            ))}
          </div>
        </section>

        {/* Development Team */}
        <section className="mb-32">
          <div className="flex items-end justify-between mb-12 border-b border-white/5 pb-6">
            <h3 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/30">Development</h3>
            <span className="text-[9px] font-mono text-white/20">MEMBERS [ {developmentTeam.length} ]</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-12">
            {developmentTeam.map((m) => (
              <MemberCard key={m.name} {...m} />
            ))}
          </div>
        </section>

        {/* Administration Team */}
        <section>
          <div className="flex items-end justify-between mb-12 border-b border-white/5 pb-6">
            <h3 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/30">Administration</h3>
            <span className="text-[9px] font-mono text-white/20">MEMBERS [ 0{administrationTeam.length} ]</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-12">
            {administrationTeam.map((m) => (
              <MemberCard key={m.name} {...m} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}