'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Flame, Hexagon } from 'lucide-react';
import Image from 'next/image';
import { useSoundStore } from '@/store/useSoundStore';
import { useSelectedCharacter } from "@/store/useSelectedCharacter";
import ElementCrystal from './ElementCrystal';

import { CONST_ASSETS } from '@/lib/preloader';
import { skillSets, Skill, Defense, defenses } from '@/lib/skills';
import { stims, Stim } from '@/lib/stim';
import { useState } from 'react';

const CONST_SOUND_CLICK = CONST_ASSETS.SOUNDS.CLICK;
const CONST_SOUND_DESACTIVATION = CONST_ASSETS.SOUNDS.ACCEPTATION;


interface LobbyScreenProps {
    onSwitchScreen: (screen: string) => void;
}

type SkillItem = {
    type: 'skill' | 'defense' | 'stim';
    data: Skill | Defense | Stim;
    side: 'left' | 'right';
};

export default function LobbyScreen({ onSwitchScreen }: LobbyScreenProps) {
    const { playSound } = useSoundStore();
    const { selectedCharacter, clearSelectedCharacter } = useSelectedCharacter();
    const [selectedInfo, setSelectedInfo] = useState<SkillItem | null>(null);

    const isCrystalActive = !!selectedCharacter;

    // Gather skills/items to display around the crystal
    const interactionItems: SkillItem[] = [];
    if (selectedCharacter) {
        const charSkills = skillSets[selectedCharacter.symbol as keyof typeof skillSets] || [];
        // Add first 4 skills (3 left, 1 right or 2/2)
        // User asked for 3 left / 3 right.
        // We have: 4 skills + 1 defense + 1 stim = 6 total.

        charSkills.slice(0, 4).forEach((s, i) => {
            interactionItems.push({
                type: 'skill',
                data: s,
                side: i < 3 ? 'left' : 'right'
            });
        });

        // Add defense (right side)
        if (defenses[0]) {
            interactionItems.push({
                type: 'defense',
                data: defenses[0],
                side: 'right'
            });
        }

        // Add stim (right side)
        if (stims[0]) {
            interactionItems.push({
                type: 'stim',
                data: stims[0],
                side: 'right'
            });
        }
    }

    const menuItems = [
        { id: 'fight', show: isCrystalActive, label: 'COMBAT', icon: Swords, color: 'text-yellow-400', onClick: () => handleFightClick() },
        { id: 'sacrifice', show: isCrystalActive, label: 'SACRIFICE', icon: Flame, color: 'text-red-400', onClick: () => handleActionClick() },
    ];

    const handleCrystalClick = () => {
        playSound(CONST_SOUND_CLICK, 0.6);
        onSwitchScreen('characters');
    };

    const handleActionClick = () => {
        clearSelectedCharacter();
        playSound(CONST_SOUND_DESACTIVATION, 0.6);
    }

    const handleFightClick = () => {
        playSound(CONST_SOUND_CLICK, 0.6);
        onSwitchScreen('fight');
    }

    return (
        <div className="flex flex-col h-full bg-neutral-950 text-white p-4 font-sans relative overflow-hidden">
            {/* Header / Crystal Status */}
            <header className="absolute top-0 left-2 right-2 z-20 flex justify-between items-center mb-2 p-4 border-b border-white/10">
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
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center my-4 w-full">
                <div className="relative flex items-center justify-center w-full max-w-md">
                    {/* Left Items (3 buttons) */}
                    <div className="absolute left-0 flex flex-col gap-6 z-30">
                        {interactionItems.filter(i => i.side === 'left').map((item, idx) => (
                            <motion.button
                                key={`left-${idx}`}
                                whileTap={{ scale: 0.9 }}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => { playSound(CONST_SOUND_CLICK); setSelectedInfo(item); }}
                                className="w-16 h-16 rounded-md bg-neutral-900 border-2 border-white/10 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.8)] overflow-hidden active:border-cyan-500/50"
                            >
                                <img
                                    src={'img' in item.data ? item.data.img : item.data.icon}
                                    className="w-full h-full object-cover"
                                    alt={item.data.name}
                                />
                            </motion.button>
                        ))}
                    </div>

                    {/* Central Crystal */}
                    <ElementCrystal
                        img={selectedCharacter?.img ?? ""}
                        isActive={isCrystalActive}
                        onClick={() => handleCrystalClick()}
                    />

                    {/* Right Items (3 buttons) */}
                    <div className="absolute right-0 flex flex-col gap-6 z-30">
                        {interactionItems.filter(i => i.side === 'right').map((item, idx) => (
                            <motion.button
                                key={`right-${idx}`}
                                whileTap={{ scale: 0.9 }}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => { playSound(CONST_SOUND_CLICK); setSelectedInfo(item); }}
                                className="w-16 h-16 rounded-md bg-neutral-900 border-2 border-white/10 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.8)] overflow-hidden active:border-cyan-500/50"
                            >
                                <img
                                    src={'img' in item.data ? item.data.img : item.data.icon}
                                    className="w-full h-full object-cover"
                                    alt={item.data.name}
                                />
                            </motion.button>
                        ))}
                    </div>
                </div>
            </main>

            {/* Action Menu */}
            <nav className="absolute bottom-6 left-4 right-4 z-20 grid grid-cols-2 gap-3">
                {menuItems.filter(item => item.show).map((item, index) => (
                    <motion.button
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={item.onClick}
                        className="flex items-center gap-3 p-4 bg-linear-to-b from-gray-800/40 to-gray-950/60 border border-white/10 rounded-lg active:bg-gray-800 transition-all text-left shadow-lg overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-cyan-500/5 to-transparent pointer-events-none" />
                        <item.icon className={`${item.color} relative z-10`} size={20} />
                        <span className="font-black italic tracking-widest text-xs relative z-10 text-gray-100">{item.label}</span>
                    </motion.button>
                ))}
            </nav>

            {/* IMAGE WARMUP (PRE-DECODING NEXT SCREEN) */}
            <div className="absolute opacity-0 pointer-events-none -z-50 overflow-hidden w-0 h-0">
                <Image src={CONST_ASSETS.IMAGES.CARD_FRAME} alt="" width={1} height={1} priority />
                <Image src={CONST_ASSETS.IMAGES.CHAR_AS} alt="" width={1} height={1} priority />
            </div>

            {/* DESCRIPTION POPUP */}
            <AnimatePresence>
                {selectedInfo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedInfo(null)}
                        className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md cursor-pointer"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 30 }}
                            className="w-full max-w-sm bg-neutral-950 border-2 border-white/10 rounded-sm overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)] relative"
                        >
                            {/* Decorative Accents */}
                            <div className="absolute top-0 left-0 w-12 h-[2px] bg-cyan-500/50" />
                            <div className="absolute top-0 left-0 w-[2px] h-12 bg-cyan-500/50" />
                            <div className="absolute bottom-0 right-0 w-12 h-[2px] bg-cyan-500/50" />
                            <div className="absolute bottom-0 right-0 w-[2px] h-12 bg-cyan-500/50" />

                            <div className="p-8 flex flex-col items-center gap-6 relative z-10">
                                {/* Large Angular Icon */}
                                <div className="w-28 h-28 rounded-sm bg-neutral-900 border-2 border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden">
                                    <img
                                        src={'img' in selectedInfo.data ? selectedInfo.data.img : selectedInfo.data.icon}
                                        className="w-full h-full object-cover"
                                        alt={selectedInfo.data.name}
                                    />
                                </div>

                                <div className="text-center w-full">
                                    <h3 className="text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-cyan-300 to-cyan-600 uppercase">
                                        {selectedInfo.data.name}
                                    </h3>
                                    <div className="h-px w-1/2 bg-linear-to-r from-transparent via-cyan-500/30 to-transparent mx-auto mt-2" />
                                    <p className="text-[10px] font-black text-gray-500 tracking-[0.4em] uppercase mt-3">
                                        {selectedInfo.type === 'skill' ? 'COMPÉTENCE ACTIVE' : selectedInfo.type === 'defense' ? 'MANOEUVRE DÉFENSIVE' : 'MODULE DE SOUTIEN'}
                                    </p>
                                </div>

                                <p className="text-sm text-gray-300 text-center px-4 leading-relaxed font-medium italic opacity-90 border-l-2 border-cyan-500/30 bg-neutral-900/50 py-3">
                                    &ldquo;{selectedInfo.data.description}&rdquo;
                                </p>

                                <div className="w-full grid grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-sm overflow-hidden">
                                    {'damage' in selectedInfo.data && selectedInfo.data.damage > 0 && (
                                        <div className="p-4 bg-neutral-900 flex flex-col items-center">
                                            <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Dégâts</p>
                                            <p className="text-xl font-mono font-black text-red-500 shadow-sm">{selectedInfo.data.damage}</p>
                                        </div>
                                    )}
                                    {'heal' in selectedInfo.data && selectedInfo.data.heal > 0 && (
                                        <div className="p-4 bg-neutral-900 flex flex-col items-center">
                                            <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Soin</p>
                                            <p className="text-xl font-mono font-black text-green-500 shadow-sm">+{selectedInfo.data.heal}</p>
                                        </div>
                                    )}
                                    {'energyCost' in selectedInfo.data && selectedInfo.data.energyCost > 0 && (
                                        <div className="p-4 bg-neutral-900 flex flex-col items-center border-l border-white/5">
                                            <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Énergie</p>
                                            <p className="text-xl font-mono font-black text-cyan-400 shadow-sm">{selectedInfo.data.energyCost}</p>
                                        </div>
                                    )}
                                    {'cooldown' in selectedInfo.data && (
                                        <div className="p-4 bg-neutral-900 flex flex-col items-center border-l border-white/5">
                                            <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Cooldown</p>
                                            <p className="text-xl font-mono font-black text-yellow-500 shadow-sm">{(selectedInfo.data.cooldown / 1000).toFixed(1)}s</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 text-[9px] font-black text-orange-400/60 tracking-[0.2em] uppercase mt-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400/40 animate-pulse" />
                                    TOUCHER POUR FERMER
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400/40 animate-pulse" />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}



/*

            <div className="absolute inset-0 z-0 flex items-center justify-center">
                <Image
                    src={CONST_BG_LOBBY}
                    alt="Lobby Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/80 z-0" />
            </div>

*/