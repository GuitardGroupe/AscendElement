'use client';

import { useState } from 'react';
import { characters } from '@/lib/data';
import { useSelectedCharacter } from "@/store/useSelectedCharacter";
import { useSoundStore } from "@/store/useSoundStore";
import { AnimatePresence, motion } from "framer-motion";
import { CONST_ASSETS } from '@/lib/preloader';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Scale, Shield, Zap } from 'lucide-react';

const CONST_SOUND_SWITCH = CONST_ASSETS.SOUNDS.SWITCH;
const CONST_SOUND_ACCEPTATION = CONST_ASSETS.SOUNDS.ACCEPTATION;

interface CharactersScreenProps {
    onSwitchScreen: (screen: string) => void;
}

export default function CharactersScreen({ onSwitchScreen }: CharactersScreenProps) {
    const { playSound } = useSoundStore();
    const { selectedCharacter, setSelectedCharacter } = useSelectedCharacter();

    const initialIndex = selectedCharacter ? characters.findIndex(c => c.id === selectedCharacter.id) : 0;
    const [currentIndex, setCurrentIndex] = useState(initialIndex !== -1 ? initialIndex : 0);
    const character = characters[currentIndex];

    // Stats calculation (Mock logic based on ID/Symbol)
    const getStats = (charId: string) => {
        // Mock stats for visualization
        const seed = charId.charCodeAt(0);
        return {
            damage: 60 + (seed % 40),
            defense: 40 + (seed % 50),
            difficulty: 30 + (seed % 60)
        };
    };

    const stats = getStats(String(character.id));

    const handleNext = () => {
        if (currentIndex < characters.length - 1) {
            playSound(CONST_SOUND_SWITCH, 0.6);
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            playSound(CONST_SOUND_SWITCH, 0.6);
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleSelect = (index: number) => {
        playSound(CONST_SOUND_SWITCH, 0.6);
        setCurrentIndex(index);
    }

    const handleActivate = () => {
        playSound(CONST_SOUND_ACCEPTATION, 0.6);
        setSelectedCharacter(character);
        onSwitchScreen("lobby");
    };

    return (
        <div className="flex flex-col h-screen bg-neutral-950 text-white font-sans overflow-hidden relative">
            {/* DYNAMIC BACKGROUND */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={character.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 z-0 bg-cover bg-center"
                >
                    <Image src={character.img} fill alt="bg" className="object-cover blur-3xl scale-125 opacity-60" />
                    <div className="absolute inset-0 bg-neutral-950/40" />
                </motion.div>
            </AnimatePresence>

            {/* OVERLAY GRID */}
            <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: `linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)`, backgroundSize: '100px 100px' }}
            />

            {/* HEADER */}
            <header className="relative z-20 p-6 flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">SÉLECTION DU CHAMPION</span>
                    <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter shadow-black drop-shadow-lg">{character.name}</h1>
                </div>
                <div className="px-3 py-1 bg-white/10 border border-white/10 rounded-full backdrop-blur-md">
                    <span className="text-[9px] font-bold text-white uppercase tracking-widest">{currentIndex + 1} / {characters.length}</span>
                </div>
            </header>

            {/* MAIN CAROUSEL AREA */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center">
                <div className="relative w-full h-[500px] flex items-center justify-center perspective-[1000px]">

                    {/* Previous Button */}
                    <button onClick={handlePrev} className={`absolute left-2 z-30 p-4 rounded-full bg-black/20 hover:bg-black/40 border border-white/5 backdrop-blur-md transition-all ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                        <ChevronLeft className="text-white" />
                    </button>

                    {/* Next Button */}
                    <button onClick={handleNext} className={`absolute right-2 z-30 p-4 rounded-full bg-black/20 hover:bg-black/40 border border-white/5 backdrop-blur-md transition-all ${currentIndex === characters.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                        <ChevronRight className="text-white" />
                    </button>

                    {/* Character Card */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={character.id}
                            initial={{ x: 100, opacity: 0, scale: 0.9, rotateY: -10 }}
                            animate={{ x: 0, opacity: 1, scale: 1, rotateY: 0 }}
                            exit={{ x: -100, opacity: 0, scale: 0.9, rotateY: 10 }}
                            transition={{ type: "spring", damping: 20, stiffness: 100 }}
                            className="relative w-[300px] h-[480px] bg-neutral-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl group"
                        >
                            {/* Card Image */}
                            <div className="absolute inset-0 bg-neutral-800">
                                <Image src={character.img} fill className="object-cover transition-transform duration-700 group-hover:scale-105" alt={character.name} />
                                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
                            </div>

                            {/* Card Content (Stats) */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-4">
                                <div className="space-y-3">
                                    {/* Damage Stat */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 flex justify-center"><Zap size={14} className="text-red-500" /></div>
                                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${stats.damage}%` }}
                                                className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                                            />
                                        </div>
                                    </div>
                                    {/* Defense Stat */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 flex justify-center"><Shield size={14} className="text-blue-500" /></div>
                                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${stats.defense}%` }}
                                                className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                            />
                                        </div>
                                    </div>
                                    {/* Difficulty Stat */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 flex justify-center"><Scale size={14} className="text-purple-500" /></div>
                                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${stats.difficulty}%` }}
                                                className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Hextech Border Decor */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* THUMBNAIL NAV */}
                <div className="flex gap-2 mt-6 overflow-x-auto max-w-full px-6 py-2 no-scrollbar">
                    {characters.map((char, idx) => (
                        <button
                            key={char.id}
                            onClick={() => handleSelect(idx)}
                            className={`relative w-12 h-12 rounded-lg border-2 overflow-hidden transition-all shrink-0 ${idx === currentIndex
                                ? 'border-cyan-400 scale-110 shadow-[0_0_15px_rgba(34,211,238,0.5)]'
                                : 'border-white/10 opacity-50 hover:opacity-100 hover:border-white/30'
                                }`}
                        >
                            <Image src={char.img} fill className="object-cover" alt="thumb" />
                        </button>
                    ))}
                </div>
            </main>

            {/* ACTION FOOTER */}
            <footer className="relative z-20 p-6 pb-8 flex justify-center">
                <button
                    onClick={handleActivate}
                    className="w-full max-w-sm py-4 relative group overflow-hidden bg-cyan-600 hover:bg-cyan-500 active:scale-95 transition-all rounded-sm shadow-[0_4px_20px_rgba(6,182,212,0.4)]"
                >
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-size-[250%_250%] animate-[shimmer_2s_infinite]" />
                    <span className="relative z-10 text-sm font-black italic tracking-[0.2em] text-white uppercase drop-shadow-md">
                        VERROUILLER
                    </span>
                    {/* Corners */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/50" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/50" />
                </button>
            </footer>
        </div>
    );
}
