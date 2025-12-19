'use client';

import { motion } from 'framer-motion';
import { CHARACTERS } from '@/lib/game-data';
import { Sword, Map, Users, Archive, Hexagon } from 'lucide-react';
import { useState } from 'react';

export default function LobbyScreen() {
    const [activeCharacter] = useState(CHARACTERS[0]); // Default to Hydrogen for now

    const menuItems = [
        { id: 'adventure', label: 'AVENTURE', icon: Map, color: 'text-green-400' },
        { id: 'arena', label: 'ARENE', icon: Sword, color: 'text-red-400' },
        { id: 'social', label: 'SOCIAL', icon: Users, color: 'text-blue-400' },
        { id: 'inventory', label: 'INVENTAIRE', icon: Archive, color: 'text-yellow-400' },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-neutral-950 text-white p-4 font-sans">
            {/* Header / Crystal Status */}
            <header className="flex justify-between items-center mb-8 p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-900 flex items-center justify-center border border-white/20">
                        <Hexagon size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xs text-gray-400 tracking-wider">CRYSTAL LEVEL</h2>
                        <p className="font-bold text-lg text-purple-300">CORE-I</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-gray-400">CREDITS</div>
                    <div className="font-mono text-yellow-500">1,250 ◈</div>
                </div>
            </header>

            {/* Main Character Display */}
            <main className="flex-1 flex flex-col items-center justify-center relative my-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 text-center"
                >
                    {/* Character Card */}
                    <div className="w-64 h-96 bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col items-center relative overflow-hidden group">
                        <div className={`absolute inset-0 bg-gradient-to-br ${activeCharacter.color} opacity-10 group-hover:opacity-20 transition-opacity`} />

                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-800 to-black border-4 border-gray-800 flex items-center justify-center mb-6 shadow-xl shadow-cyan-500/20">
                            <span className="text-4xl font-bold">{activeCharacter.symbol}</span>
                        </div>

                        <h1 className="text-2xl font-bold mb-1">{activeCharacter.name}</h1>
                        <p className="text-xs text-cyan-400 tracking-widest mb-4">LVL 01 • RAW MATTER</p>

                        <p className="text-xs text-gray-400 text-center leading-relaxed">
                            {activeCharacter.description}
                        </p>

                        <button className="mt-auto w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs uppercase tracking-widest transition-colors">
                            Manage
                        </button>
                    </div>
                </motion.div>
            </main>

            {/* Action Menu */}
            <nav className="grid grid-cols-2 gap-3 mt-auto">
                {menuItems.map((item, index) => (
                    <motion.button
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-4 bg-gray-900/40 border border-white/5 rounded-xl hover:bg-gray-800/60 active:scale-95 transition-all text-left"
                    >
                        <item.icon className={`${item.color}`} size={20} />
                        <span className="font-bold tracking-wider text-sm">{item.label}</span>
                    </motion.button>
                ))}
            </nav>
        </div>
    );
}
