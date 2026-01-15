"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin } from 'lucide-react';

// Coordinated animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.03,
            delayChildren: 0.05
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.25,
            ease: [0.22, 1, 0.36, 1] as const
        }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.15 }
    }
};

// Get initials from a name (first letter of first and last name)
const getInitials = (name: string): string => {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Check if image is the placeholder
const isPlaceholderImage = (image: string): boolean => {
    return image.includes('blank_profile');
};

// Initials Avatar Component
const InitialsAvatar = ({ name, className }: { name: string; className?: string }) => (
    <div
        className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-[#8B2635] via-[#6B1D29] to-[#4A1420] ${className || ''}`}
    >
        <span
            className="text-white/90 font-light tracking-wide select-none"
            style={{
                fontSize: 'clamp(2rem, 8vw, 4rem)',
                fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'
            }}
        >
            {getInitials(name)}
        </span>
    </div>
);

const TEAMS = ["All", "E-Board", "Admin", "Project Managers", "Developers & AI Engineers"];

const MEMBERS = [
    // E-Board
    { id: 1, name: "Daniel Sachs", role: "Founding President", team: "E-Board", image: "/pfps/daniel.png", linkedInUrl: "https://www.linkedin.com/in/daniel-m-sachs/" },
    { id: 2, name: "Erik Pedersen", role: "Vice-President", team: "E-Board", image: "/pfps/erik.png", linkedInUrl: "https://www.linkedin.com/in/erikzhangpedersen/" },
    { id: 3, name: "Morgan Stuart", role: "Lead Engineer + NME Chair", team: "E-Board", image: "/pfps/morgan.png", linkedInUrl: "https://www.linkedin.com/in/morgan-nstuart/" },
    { id: 4, name: "Merek Soriano", role: "Head of Corp Partnership", team: "E-Board", image: "/pfps/merek.png", linkedInUrl: "https://www.linkedin.com/in/merek-soriano-0ba570291/" },
    { id: 5, name: "David Lee", role: "Head of Product", team: "E-Board", image: "/pfps/david.png", linkedInUrl: "https://www.linkedin.com/in/dave-lee-716318242/" },

    // Admin
    { id: 6, name: "Mahdi Choudhury", role: "Treasurer", team: "Admin", image: "/pfps/mahdi.png", linkedInUrl: "https://www.linkedin.com/in/mahdi-choudhury-h/" },
    { id: 7, name: "Akul Maheshwari", role: "DEI Chair", team: "Admin", image: "/pfps/akul.png", linkedInUrl: "https://www.linkedin.com/in/akul-maheshwari/" },

    // Developers & AI Engineers
    { id: 8, name: "Bhavan Sai Balusu", role: "Credit Document AI", team: "Developers & AI Engineers", image: "/pfps/blank_profile.webp", linkedInUrl: "" },
    { id: 9, name: "Surya Chandrakasan", role: "Credit Document AI", team: "Developers & AI Engineers", image: "/pfps/blank_profile.webp", linkedInUrl: "" },
    { id: 10, name: "Trishia Khandelwal", role: "Credit Document AI", team: "Developers & AI Engineers", image: "/pfps/blank_profile.webp", linkedInUrl: "" },
    { id: 11, name: "Thurushi Kiyara Rajapakse", role: "Credit Document AI", team: "Developers & AI Engineers", image: "/pfps/thurushi.png", linkedInUrl: "https://www.linkedin.com/in/thurushi-rajapakse" },
    { id: 12, name: "Aleks Dzudzevic", role: "Credit Document AI", team: "Developers & AI Engineers", image: "/pfps/alek.png", linkedInUrl: "" },
    { id: 13, name: "Brandon Xu", role: "Vendor Due Diligence AI", team: "Developers & AI Engineers", image: "/pfps/brandon.png", linkedInUrl: "https://www.linkedin.com/in/brandon-xu-284748322/" },
    { id: 14, name: "Eddie Hu", role: "Vendor Due Diligence AI", team: "Developers & AI Engineers", image: "/pfps/blank_profile.webp", linkedInUrl: "" },
    { id: 15, name: "Audrey Lewellen", role: "Vendor Due Diligence AI", team: "Developers & AI Engineers", image: "/pfps/audrey.png", linkedInUrl: "https://www.linkedin.com/in/audrey-lewellen-686823355/" },
    { id: 16, name: "Mateo del Rio Lanse", role: "Vendor Due Diligence AI", team: "Developers & AI Engineers", image: "/pfps/mateo.png", linkedInUrl: "https://www.linkedin.com/in/mdelriolanse" },
    { id: 17, name: "Nicole Luo", role: "Invoice AI Analysis", team: "Developers & AI Engineers", image: "/pfps/nicole.png", linkedInUrl: "https://www.linkedin.com/in/nicoleluo7/" },
    { id: 18, name: "Pratyush Saxena", role: "Invoice AI Analysis", team: "Developers & AI Engineers", image: "/pfps/blank_profile.webp", linkedInUrl: "" },
    { id: 19, name: "Anmol Karan", role: "Invoice AI Analysis", team: "Developers & AI Engineers", image: "/pfps/anmol.jpeg", linkedInUrl: "" },
    { id: 20, name: "Christina Maria Joseph", role: "Invoice AI Analysis", team: "Developers & AI Engineers", image: "/pfps/blank_profile.webp", linkedInUrl: "" },
    { id: 21, name: "Lauren Amelie Ah-Hot", role: "Invoice AI Analysis", team: "Developers & AI Engineers", image: "/pfps/blank_profile.webp", linkedInUrl: "" },
    { id: 22, name: "Zahrizhal Ali, Jr", role: "QuickFi", team: "Developers & AI Engineers", image: "/pfps/blank_profile.webp", linkedInUrl: "" },
    { id: 23, name: "Dhruv Mandalik", role: "Vero", team: "Developers & AI Engineers", image: "/pfps/blank_profile.webp", linkedInUrl: "" },
    { id: 24, name: "Zach Riiff", role: "Vero", team: "Developers & AI Engineers", image: "/pfps/zach.png", linkedInUrl: "https://www.linkedin.com/in/zach-riiff-828018325/" },
    { id: 25, name: "Alex Kozik", role: "Vero", team: "Developers & AI Engineers", image: "/pfps/alex.png", linkedInUrl: "https://www.linkedin.com/in/alex-kozik/" },
    { id: 26, name: "Rei Meguro", role: "Vero", team: "Developers & AI Engineers", image: "/pfps/blank_profile.webp", linkedInUrl: "" },
    { id: 27, name: "Yashnil Saha", role: "Bridge", team: "Developers & AI Engineers", image: "/pfps/blank_profile.webp", linkedInUrl: "" },
    { id: 28, name: "Asad Abbas Rizvi", role: "Bridge", team: "Developers & AI Engineers", image: "/pfps/asad.png", linkedInUrl: "https://www.linkedin.com/in/asad-rizvi-02a1782a2" },
    { id: 29, name: "Tanner Brendan Blake", role: "Bridge", team: "Developers & AI Engineers", image: "/pfps/blank_profile.webp", linkedInUrl: "" },
    { id: 30, name: "Arshdeep Kaur", role: "Bridge", team: "Developers & AI Engineers", image: "/pfps/arshdeep.jpg", linkedInUrl: "https://www.linkedin.com/in/arshdeepkaur13/" }
];

export default function TeamDirectory() {
    const [filter, setFilter] = useState("All");

    const filteredMembers = filter === "All"
        ? MEMBERS
        : MEMBERS.filter(m => m.team === filter);

    return (
        <div className="w-full">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
                {TEAMS.map(team => (
                    <button
                        key={team}
                        onClick={() => setFilter(team)}
                        className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-200 ${filter === team
                            ? 'bg-white text-black'
                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {team}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <motion.div
                key={filter}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
            >
                <AnimatePresence mode="popLayout">
                    {filteredMembers.map(member => (
                        <motion.div
                            key={member.id}
                            variants={itemVariants}
                            layout
                            className="group will-change-transform"
                        >
                            {/* Photo or Initials Avatar */}
                            <div className="aspect-square w-full relative rounded-2xl overflow-hidden bg-white/5 mb-4">
                                {isPlaceholderImage(member.image) ? (
                                    <InitialsAvatar name={member.name} className="group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                )}
                            </div>

                            {/* Name and role below */}
                            <h3 className="text-lg font-medium text-white mb-1">{member.name}</h3>
                            <p className="text-sm text-white/50 mb-3">{member.role}</p>

                            {/* Social icons */}
                            {member.linkedInUrl && (
                                <a
                                    href={member.linkedInUrl.startsWith('http') ? member.linkedInUrl : `https://${member.linkedInUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex text-white/40 hover:text-[#0A66C2] transition-colors duration-200"
                                    aria-label={`${member.name}'s LinkedIn profile`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Linkedin size={18} />
                                </a>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

