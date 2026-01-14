"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

const TEAMS = ["All", "E-Board", "Admin", "Project Managers", "Developers & AI Engineers"];

const MEMBERS = [
    // E-Board
    { id: 1, name: "Daniel Sachs", role: "Founding President", team: "E-Board", image: "/pfps/daniel.png" },
    { id: 2, name: "Erik Pedersen", role: "Vice-President", team: "E-Board", image: "/pfps/erik.png" },
    { id: 3, name: "Morgan Stuart", role: "Lead Engineer + NME Chair", team: "E-Board", image: "/pfps/morgan.png" },
    { id: 4, name: "Merek Soriano", role: "Head of Corp Partnership", team: "E-Board", image: "/pfps/merek.png" },
    { id: 5, name: "David Lee", role: "Head of Product", team: "E-Board", image: "/pfps/david.png" },

    // Admin
    { id: 6, name: "Mahdi Choudhury", role: "Treasurer", team: "Admin", image: "/pfps/mahdi.png" },
    { id: 7, name: "Akul Maheshwari", role: "DEI Chair", team: "Admin", image: "/pfps/akul.png" },

    // Developers & AI Engineers
    { id: 8, name: "Bhavan Sai Balusu", role: "Credit Document AI", team: "Developers & AI Engineers", image: "/pfps/blank_profile.webp" },
    { id: 9, name: "Surya Chandrakasan", role: "Credit Document AI", team: "Developers & AI Engineers", image: "/pfps/blank_profile.webp" },
    { id: 10, name: "Trishia Khandelwal", role: "Credit Document AI", team: "Developers & AI Engineers", image: "/pfps/blank_profile.webp" },
    { id: 11, name: "Thurushi Kiyara Rajapakse", role: "Credit Document AI", team: "Developers & AI Engineers", image: "/pfps/thurushi.png" },
    { id: 12, name: "Aleks Dzudzevic", role: "Credit Document AI", team: "Developers & AI Engineers", image: "/pfps/alek.png" },
    { id: 13, name: "Brandon Xu", role: "Vendor Due Diligence AI", team: "Developers & AI Engineers", image: "/pfps/brandon.png" },
    { id: 14, name: "Eddie Hu", role: "Vendor Due Diligence AI", team: "Developers & AI Engineers", image: "/pfps/blank_profile.webp" },
    { id: 15, name: "Audrey Lewellen", role: "Vendor Due Diligence AI", team: "Developers & AI Engineers", image: "/pfps/audrey.png" },
    { id: 16, name: "Mateo del Rio Lanse", role: "Vendor Due Diligence AI", team: "Developers & AI Engineers", image: "/pfps/mateo.png" },
    { id: 17, name: "Nicole Luo", role: "Invoice AI Analysis", team: "Developers & AI Engineers", image: "/pfps/nicole.png" },
    { id: 18, name: "Pratyush Saxena", role: "Invoice AI Analysis", team: "Developers & AI Engineers", image: "/pfps/blank_profile.webp" },
    { id: 19, name: "Anmol Karan", role: "Invoice AI Analysis", team: "Developers & AI Engineers", image: "/pfps/anmol.jpeg" },
    { id: 20, name: "Christina Maria Joseph", role: "Invoice AI Analysis", team: "Developers & AI Engineers", image: "/pfps/blank_profile.webp" },
    { id: 21, name: "Lauren Amelie Ah-Hot", role: "Invoice AI Analysis", team: "Developers & AI Engineers", image: "/pfps/blank_profile.webp" },
    { id: 22, name: "Zahrizhal Ali, Jr", role: "QuickFi", team: "Developers & AI Engineers", image: "/pfps/blank_profile.webp" },
    { id: 23, name: "Dhruv Mandalik", role: "Vero", team: "Developers & AI Engineers", image: "/pfps/blank_profile.webp" },
    { id: 24, name: "Zach Riiff", role: "Vero", team: "Developers & AI Engineers", image: "/pfps/zach.png" },
    { id: 25, name: "Alex Kozik", role: "Vero", team: "Developers & AI Engineers", image: "/pfps/alex.png" },
    { id: 26, name: "Rei Meguro", role: "Vero", team: "Developers & AI Engineers", image: "/pfps/blank_profile.webp" },
    { id: 27, name: "Yashnil Saha", role: "Bridge", team: "Developers & AI Engineers", image: "/pfps/blank_profile.webp" },
    { id: 28, name: "Asad Abbas Rizvi", role: "Bridge", team: "Developers & AI Engineers", image: "/pfps/asad.png" },
    { id: 29, name: "Tanner Brendan Blake", role: "Bridge", team: "Developers & AI Engineers", image: "/pfps/blank_profile.webp" },
    { id: 30, name: "Arshdeep Kaur", role: "Bridge", team: "Developers & AI Engineers", image: "/pfps/arshdeep.jpg" }
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
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
                <AnimatePresence mode="popLayout">
                    {filteredMembers.map(member => (
                        <motion.div
                            key={member.id}
                            variants={itemVariants}
                            layout
                            className="bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors duration-200 group flex flex-col items-center text-center will-change-transform"
                        >
                            <div className="w-16 h-16 mb-4 relative rounded-full overflow-hidden bg-white/5 group-hover:scale-110 transition-transform duration-200">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-sm font-medium text-white mb-1">{member.name}</h3>
                            <p className="text-[10px] text-white/50">{member.role}</p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

