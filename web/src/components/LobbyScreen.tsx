'use client';

import { motion } from 'framer-motion';
import { CHARACTERS } from '@/lib/game-data';
import { Sword, Map, Users, Archive, Hexagon } from 'lucide-react';
import { useState } from 'react';
import useUISound from '@/hooks/useUISounds';

const CONST_CRYSTAL_ACTIVE = "/images/crystal-active.png";
const CONST_CRYSTAL_INACTIVE = "/images/crystal-inactive.png";

interface LobbyScreenProps {
    onSwitchScreen: (screen: string) => void;
}

export default function LobbyScreen({ onSwitchScreen }: LobbyScreenProps) {
    const [activeCharacter] = useState(CHARACTERS[0]); // Default to Hydrogen for now
    const [isCrystalActive, setIsCrystalActive] = useState(false);
    const playClick = useUISound();

    const menuItems = [
        { id: 'adventure', label: 'AVENTURE', icon: Map, color: 'text-green-400' },
        { id: 'arena', label: 'ARENE', icon: Sword, color: 'text-red-400' },
        { id: 'social', label: 'SOCIAL', icon: Users, color: 'text-blue-400' },
        { id: 'inventory', label: 'INVENTAIRE', icon: Archive, color: 'text-yellow-400' },
    ];

    const handleCrystalClick = () => {
        //playClick();
        onSwitchScreen('characters');
        //setIsCrystalActive(!isCrystalActive)
    };

    return (
        <div className="flex flex-col min-h-screen bg-neutral-950 text-white p-4 font-sans">
            {/* Header / Crystal Status */}
            <header className="flex justify-between items-center mb-8 p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-600 to-blue-900 flex items-center justify-center border border-white/20">
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

            {/* Main Crystal Display */}
            <main className="flex-1 flex flex-col items-center justify-center relative my-4">
                <div
                    className="relative z-10 text-center flex flex-col items-center justify-center cursor-pointer"
                    onClick={handleCrystalClick}
                >
                    {/* Crystal Image Container */}
                    <div className="relative w-80 h-80 flex items-center justify-center">
                        {/* Glow Effect (Active Only) - Optimized */}
                        <motion.div
                            className="absolute inset-0 rounded-full bg-cyan-500/20 blur-[20px]" // Reduced blur radius and opacity
                            animate={{
                                opacity: isCrystalActive ? 1 : 0, // Animate opacity instead of scale for better perf
                            }}
                            style={{
                                willChange: "opacity", // Hint to browser
                                transform: "translateZ(0)" // Force hardware acceleration
                            }}
                            transition={{ duration: 0.3 }}
                        />

                        {/* Crystal Images - Optimized */}
                        {/* We use simple conditional rendering or opacity for cheaper switching */}
                        <div className="relative w-full h-full">
                            <motion.img
                                src={CONST_CRYSTAL_ACTIVE}
                                alt="Active Crystal"
                                className="absolute inset-0 w-full h-full object-contain"
                                animate={{
                                    opacity: isCrystalActive ? 1 : 0,
                                }}
                                style={{ willChange: "opacity" }} // Hint
                                transition={{ duration: 0.3 }}
                            />

                            <motion.img
                                src={CONST_CRYSTAL_INACTIVE}
                                alt="Inactive Crystal"
                                className="absolute inset-0 w-full h-full object-contain opacity-80"
                                animate={{
                                    opacity: isCrystalActive ? 0 : 1,
                                }}
                                style={{ willChange: "opacity" }} // Hint
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>

                    <div className="mt-4 space-y-2">
                        <h1 className="text-3xl font-bold bg-linear-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
                            {isCrystalActive ? activeCharacter.name : "CRYSTAL DORMANT"}
                        </h1>
                        <p className="text-xs text-cyan-400 tracking-[0.2em] font-mono">
                            {isCrystalActive ? `SYSTEM: ${activeCharacter.symbol}-CORE` : "WAITING FOR INPUT..."}
                        </p>
                    </div>
                </div>
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
