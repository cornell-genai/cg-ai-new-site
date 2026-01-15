"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BarChart3, Eye, Network, Smartphone, Leaf } from "lucide-react";
import { GlassCard } from "./design-system";

/**
 * TextStream
 * Simulates an AI streaming response character by character.
 */
function TextStream({ text }: { text: string }) {
    const [display, setDisplay] = useState("");

    useEffect(() => {
        let i = 0;
        setDisplay("");
        const interval = setInterval(() => {
            setDisplay(text.slice(0, i + 1));
            i++;
            if (i > text.length) clearInterval(interval);
        }, 20); // Typing speed
        return () => clearInterval(interval);
    }, [text]);

    return <span>{display}<span className="animate-pulse">_</span></span>;
}

const ITEMS = [
    {
        icon: <BarChart3 className="h-6 w-6" />,
        title: "Innovative AI Projects",
        desc: "Collaborate on impactful projects like AI-driven accessibility tools, educational assistants, and creative applications.",
        category: "build"
    },
    {
        icon: <Eye className="h-6 w-6" />,
        title: "Exclusive Speaker Series",
        desc: "Engage with AI startup founders, researchers, and tech leaders for insights into the latest opportunities in the field.",
        category: "learn"
    },
    {
        icon: <Sparkles className="h-6 w-6" />,
        title: "Real-World Applications",
        desc: "Work on real-world challenges with industry partners, ensuring your projects have tangible outcomes and societal impact.",
        category: "impact"
    },
    {
        icon: <Network className="h-6 w-6" />,
        title: "Networking & Mentorship",
        desc: "Build connections with industry professionals and like-minded peers through exclusive opportunities that foster long-term relationships.",
        category: "connect"
    },
    {
        icon: <Smartphone className="h-6 w-6" />,
        title: "Cutting-Edge Tech",
        desc: "Gain hands-on experience with the latest AI tools and platforms to create innovative solutions.",
        category: "build"
    },
    {
        icon: <Leaf className="h-6 w-6" />,
        title: "Career Development",
        desc: "Prepare for the future of AI with personalized career guidance, impactful resume-building projects, and access to networking events.",
        category: "growth"
    }
];

export default function GenerativeGrid() {
    const [query, setQuery] = useState("");
    const [filteredItems, setFilteredItems] = useState(ITEMS);
    const [isThinking, setIsThinking] = useState(false);
    const [aiMessage, setAiMessage] = useState("Exploring our initiatives...");

    // Simulate AI processing when query changes
    useEffect(() => {
        if (!query) {
            setFilteredItems(ITEMS);
            setAiMessage("showing all initiatives.");
            return;
        }

        const timer = setTimeout(() => {
            setIsThinking(true);
            setAiMessage("analyzing request...");

            // Artificial delay for "thinking"
            setTimeout(() => {
                const lowerQ = query.toLowerCase();
                const results = ITEMS.filter(item =>
                    item.title.toLowerCase().includes(lowerQ) ||
                    item.desc.toLowerCase().includes(lowerQ) ||
                    item.category.includes(lowerQ)
                );

                setFilteredItems(results);
                setIsThinking(false);
                setAiMessage(`found ${results.length} relevant opportunities for: "${query}"`);
            }, 800);
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className="w-full max-w-7xl mx-auto px-4">
            {/* AI Input Section */}
            <div className="mb-12 flex flex-col items-center justify-center space-y-6">
                <GlassCard className="p-1 rounded-full flex items-center w-full max-w-2xl bg-black/40 border-white/10">
                    <div className="pl-4 text-zinc-400">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask the AI: 'How can I build?' or 'network'..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-zinc-500 py-3 px-4 text-lg"
                    />
                </GlassCard>

                <div className="h-6 text-sm font-mono text-indigo-300">
                    {/* Terminal-style status output */}
                    <span className="opacity-50">{">"} </span>
                    <TextStream text={aiMessage} />
                </div>
            </div>

            {/* Grid */}
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {filteredItems.map((item) => (
                        <motion.div
                            layout
                            key={item.title}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            <GlassCard className="h-full p-8 flex flex-col hover:border-indigo-500/30 group">
                                <div className="mb-6 inline-flex p-3 rounded-xl bg-white/5 text-indigo-400 group-hover:text-white group-hover:bg-indigo-500 transition-colors duration-300">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-white">{item.title}</h3>
                                <p className="text-zinc-400 leading-relaxed text-sm">
                                    {item.desc}
                                </p>
                            </GlassCard>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {filteredItems.length === 0 && !isThinking && (
                <div className="text-center py-20 text-zinc-500">
                    No matches found. Try asking something else.
                </div>
            )}
        </div>
    );
}
