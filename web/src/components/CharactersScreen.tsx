'use client';

import { useState } from 'react';
import { characters } from '@/lib/data';
import { useSelectedCharacter } from "@/store/useSelectedCharacter";
import { useSoundStore } from "@/store/useSoundStore";
import { AnimatePresence, motion } from "framer-motion";
import { CONST_ASSETS } from '@/lib/preloader';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { skillSets, ElementKey } from "@/lib/skills";

const CONST_SOUND_SWITCH = CONST_ASSETS.SOUNDS.SWITCH;
const CONST_SOUND_ACCEPTATION = CONST_ASSETS.SOUNDS.ACCEPTATION;

interface CharactersScreenProps {
    onSwitchScreen: (screen: string) => void;
}

const descriptions: Record<string, string> = {
    0: "Un guerrier implacable maniant l'épée lourde. Spécialiste du combat rapproché et de la défense physique.",
    1: "Maîtresse des énergies lumineuses. Elle manipule les flux pour soigner ses alliés et désintégrer ses ennemis."
};

export default function CharactersScreen({ onSwitchScreen }: CharactersScreenProps) {
    const { playSound } = useSoundStore();
    const { selectedCharacter, setSelectedCharacter } = useSelectedCharacter();

    const initialIndex = selectedCharacter ? characters.findIndex(c => c.id === selectedCharacter.id) : 0;
    const [currentIndex, setCurrentIndex] = useState(initialIndex !== -1 ? initialIndex : 0);
    const [direction, setDirection] = useState(0);

    const character = characters[currentIndex];
    const characterSkills = skillSets[character.symbol as ElementKey] || [];

    const handleNext = () => {
        if (currentIndex < characters.length - 1) {
            setDirection(1);
            playSound(CONST_SOUND_SWITCH, 0.6);
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setDirection(-1);
            playSound(CONST_SOUND_SWITCH, 0.6);
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleSelect = (index: number) => {
        setDirection(index > currentIndex ? 1 : -1);
        playSound(CONST_SOUND_SWITCH, 0.6);
        setCurrentIndex(index);
    }

    const handleActivate = () => {
        playSound(CONST_SOUND_ACCEPTATION, 0.6);
        setSelectedCharacter(character);
        onSwitchScreen("lobby");
    };

    // Simple Slide Animation for Performance
    const variants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 50 : -50,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (dir: number) => ({
            x: dir < 0 ? 50 : -50,
            opacity: 0,
            scale: 0.95
        })
    };

    return (
        <div className="flex flex-col h-screen bg-neutral-950 text-white font-sans overflow-hidden relative">
            {/* DYNAMIC BACKGROUND (Static Blur) */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={character.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 z-0 bg-cover bg-center"
                >
                    <Image src={character.img} fill alt="bg" className="object-cover blur-3xl scale-125 opacity-50" priority />
                    <div className="absolute inset-0 bg-black/60" />
                </motion.div>
            </AnimatePresence>

            {/* OVERLAY GRID */}
            <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: `linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)`, backgroundSize: '100px 100px' }}
            />

            {/* HEADER */}
            <header className="relative z-20 p-6 flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">SÉLECTION</span>
                    <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter shadow-black drop-shadow-lg">{character.name}</h1>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
                    <span className="text-[9px] font-bold text-white/80 uppercase tracking-widest">{currentIndex + 1} / {characters.length}</span>
                </div>
            </header>

            {/* MAIN CAROUSEL AREA */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-start pt-4">
                <div className="relative w-full h-[540px] flex items-center justify-center">

                    {/* Previous Button */}
                    <button onClick={handlePrev} className={`absolute left-2 z-30 p-4 rounded-full transition-all active:scale-95 ${currentIndex === 0 ? 'opacity-20 pointer-events-none' : 'opacity-100 hover:bg-white/5'}`}>
                        <ChevronLeft className="text-white w-8 h-8" />
                    </button>

                    {/* Next Button */}
                    <button onClick={handleNext} className={`absolute right-2 z-30 p-4 rounded-full transition-all active:scale-95 ${currentIndex === characters.length - 1 ? 'opacity-20 pointer-events-none' : 'opacity-100 hover:bg-white/5'}`}>
                        <ChevronRight className="text-white w-8 h-8" />
                    </button>

                    {/* Character Card */}
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={character.id}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                            className="relative w-[320px] h-[520px] bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl group flex flex-col"
                        >
                            {/* Card Image (Top 60%) */}
                            <div className="relative h-[60%] bg-neutral-900 overflow-hidden">
                                <Image src={character.img} fill className="object-cover object-top scale-110" alt={character.name} priority />
                                <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-transparent to-transparent" />
                            </div>

                            {/* Card Content (Bottom 40%) */}
                            <div className="flex-1 p-6 flex flex-col justify-between bg-[#0a0a0a] relative z-10 -mt-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className="text-2xl font-black italic text-white uppercase tracking-tight">{character.name}</h3>
                                        <div className="h-px flex-1 bg-white/20" />
                                    </div>

                                    <p className="text-xs text-gray-400 italic leading-relaxed mb-6 border-l-2 border-cyan-500/50 pl-3">
                                        &quot;{descriptions[character.id]}&quot;
                                    </p>

                                    {/* Skills Row */}
                                    <div className="flex gap-3 mb-4">
                                        {characterSkills.slice(0, 4).map((skill) => (
                                            <div key={skill.id} className="w-8 h-8 rounded bg-neutral-800 border border-white/10 relative overflow-hidden transition-all">
                                                <Image src={skill.icon} fill className="object-cover" alt="skill" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* INCARNER BUTTON - GOLD PRESTIGE (NO HOVER) */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleActivate(); }}
                                    className="w-full py-4 bg-linear-to-r from-amber-400 to-yellow-600 active:scale-95 transition-all rounded-lg flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(245,158,11,0.3)] relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/20 -translate-x-full animate-[shimmer_3s_infinite] skew-x-12" />
                                    <span className="relative z-10 font-black italic tracking-[0.2em] text-sm text-black uppercase">
                                        INCARNER
                                    </span>
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* THUMBNAIL NAV - SMALL SQUARES */}
                <div className="flex gap-3 mt-4">
                    {characters.map((char, idx) => (
                        <button
                            key={char.id}
                            onClick={() => handleSelect(idx)}
                            className={`relative w-10 h-10 rounded-md flex items-center justify-center border transition-all ${idx === currentIndex
                                ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.4)]'
                                : 'bg-black/40 border-white/10 text-white/40'
                                }`}
                        >
                            <span className={`text-xs font-black uppercase ${idx === currentIndex ? 'text-white' : 'text-white/40'}`}>
                                {char.symbol}
                            </span>
                        </button>
                    ))}
                </div>
            </main>

        </div>
    );
}
