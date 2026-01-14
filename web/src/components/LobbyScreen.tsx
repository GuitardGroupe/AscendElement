'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Flame, Package, Hexagon, Zap, Shield, Plus } from 'lucide-react';
import Image from 'next/image';
import { useSoundStore } from '@/store/useSoundStore';
import { useSelectedCharacter } from "@/store/useSelectedCharacter";
import { useAdventureStore } from "@/store/useAdventureStore";
import { CONST_ASSETS } from '@/lib/preloader';
import { skillSets, Skill, Defense, defenses } from '@/lib/skills';
import { stims, Stim } from '@/lib/stim';
import { useState } from 'react';
import ElementCrystal from './ElementCrystal';

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
    const { resetAdventure } = useAdventureStore();
    const [selectedInfo, setSelectedInfo] = useState<SkillItem | null>(null);

    const isCrystalActive = !!selectedCharacter;

    // Gather skills/items
    const interactionItems: SkillItem[] = [];
    if (selectedCharacter) {
        const charSkills = skillSets[selectedCharacter.symbol as keyof typeof skillSets] || [];
        charSkills.slice(0, 4).forEach((s, i) => {
            interactionItems.push({
                type: 'skill',
                data: s,
                side: i < 3 ? 'left' : 'right'
            });
        });
        if (defenses[0]) interactionItems.push({ type: 'defense', data: defenses[0], side: 'right' });
        if (stims[0]) interactionItems.push({ type: 'stim', data: stims[0], side: 'right' });
    }

    const menuItems = [
        { id: 'adventure', show: isCrystalActive, label: 'AVENTURE', icon: Swords, bg: 'bg-cyan-500', glow: 'shadow-cyan-500/50', onClick: () => onSwitchScreen('adventure') },
        { id: 'inventory', show: isCrystalActive, label: 'STUFF', icon: Package, bg: 'bg-blue-600', glow: 'shadow-blue-600/50', onClick: () => onSwitchScreen('inventory') },
        { id: 'sacrifice', show: isCrystalActive, label: 'SACRIFICE', icon: Flame, bg: 'bg-red-500', glow: 'shadow-red-500/50', onClick: () => handleActionClick() },
    ];

    const handleCrystalClick = () => {
        playSound(CONST_SOUND_CLICK, 0.6);
        onSwitchScreen('characters');
    };

    const handleActionClick = () => {
        resetAdventure();
        clearSelectedCharacter();
        playSound(CONST_SOUND_DESACTIVATION, 0.6);
    }

    return (
        <div className="flex flex-col h-full bg-neutral-950 text-white font-sans relative overflow-hidden">
            {/* AMBIENT BACKGROUND */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-900/20 via-neutral-950/80 to-neutral-950" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
            </div>

            {/* HEADER - HEXTECH GLASS */}
            <header className="relative z-20 mx-4 mt-6 p-1">
                <div className="flex justify-between items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-r from-cyan-500/10 to-transparent pointer-events-none" />

                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <div className="absolute inset-0 bg-cyan-500 blur-md opacity-20 animate-pulse" />
                            <Hexagon size={28} className="text-cyan-400 fill-cyan-950/50 stroke-1" />
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-cyan-100">12</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-cyan-500 uppercase tracking-widest">Niveau</span>
                            <span className="text-sm font-bold text-white leading-none">INITIÉ</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 px-2">
                        <div className="text-right">
                            <div className="text-[8px] font-black text-yellow-600 uppercase tracking-widest">Crédits</div>
                            <div className="font-mono font-bold text-yellow-400 text-sm">1,250 ◈</div>
                        </div>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full">
                <div className="relative w-full max-w-md h-[400px] flex items-center justify-center">

                    {/* LEFT SKILL PANEL */}
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-30">
                        <AnimatePresence>
                            {interactionItems.filter(i => i.side === 'left').map((item, idx) => (
                                <motion.button
                                    key={`left-${idx}`}
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 + idx * 0.1, type: 'spring' }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => { playSound(CONST_SOUND_CLICK); setSelectedInfo(item); }}
                                    className="group relative w-14 h-14"
                                >
                                    <div className="absolute inset-0 bg-neutral-900 border border-white/10 rotate-45 group-hover:border-cyan-400/50 transition-colors shadow-lg" />
                                    <div className="absolute inset-1 bg-neutral-800 rotate-45 overflow-hidden">
                                        <Image src={'img' in item.data ? item.data.img : item.data.icon} fill className="object-cover -rotate-45 scale-125" alt="skill" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-neutral-950 border border-white/20 rotate-45 flex items-center justify-center z-10">
                                        <Zap size={8} className="text-cyan-400 -rotate-45" />
                                    </div>
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* CENTER CORE / CHARACTER */}
                    <div className="relative z-20 scale-110">
                        <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full" />
                        <ElementCrystal
                            img={selectedCharacter?.img ?? ""}
                            isActive={isCrystalActive}
                            onClick={() => handleCrystalClick()}
                        />
                        {!isCrystalActive && (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 pointer-events-none border border-dashed border-white/10 rounded-full"
                            />
                        )}
                    </div>

                    {/* RIGHT SKILL PANEL */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-30">
                        <AnimatePresence>
                            {interactionItems.filter(i => i.side === 'right').map((item, idx) => (
                                <motion.button
                                    key={`right-${idx}`}
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 + idx * 0.1, type: 'spring' }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => { playSound(CONST_SOUND_CLICK); setSelectedInfo(item); }}
                                    className="group relative w-14 h-14"
                                >
                                    <div className="absolute inset-0 bg-neutral-900 border border-white/10 rotate-45 group-hover:border-yellow-400/50 transition-colors shadow-lg" />
                                    <div className="absolute inset-1 bg-neutral-800 rotate-45 overflow-hidden">
                                        <Image src={'img' in item.data ? item.data.img : item.data.icon} fill className="object-cover -rotate-45 scale-125" alt="skill" />
                                    </div>
                                    <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-neutral-950 border border-white/20 rotate-45 flex items-center justify-center z-10">
                                        {item.type === 'defense' ? <Shield size={8} className="text-yellow-400 -rotate-45" /> : <Plus size={8} className="text-green-400 -rotate-45" />}
                                    </div>
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* BOTTOM DOCK NAVIGATION */}
            <nav className="absolute bottom-8 left-6 right-6 z-30">
                <div className="flex justify-center items-end gap-6">
                    <AnimatePresence>
                        {menuItems.filter(item => item.show).map((item, index) => (
                            <motion.button
                                key={item.id}
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 50, opacity: 0 }}
                                transition={{ delay: index * 0.05, type: 'spring', stiffness: 200 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={item.onClick}
                                className="relative group flex flex-col items-center justify-center gap-2"
                            >
                                <div className={`w-16 h-16 rounded-2xl ${item.bg === 'bg-red-500' ? 'bg-linear-to-br from-red-500 to-red-700' : item.bg === 'bg-cyan-500' ? 'bg-linear-to-br from-cyan-400 to-blue-600' : 'bg-linear-to-br from-blue-500 to-blue-700'} 
                                    border-t border-white/20 shadow-lg ${item.glow} flex items-center justify-center relative overflow-hidden transition-transform group-hover:-translate-y-2`}
                                >
                                    <div className="absolute inset-0 bg-linear-to-b from-white/20 to-transparent opacity-50" />
                                    <item.icon size={28} className="text-white drop-shadow-md relative z-10" />
                                </div>
                                <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/5">
                                    <span className="text-[9px] font-black text-white/90 uppercase tracking-widest">{item.label}</span>
                                </div>
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </div>
            </nav>

            {/* PRESENCE LIGHTING */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-blue-900/20 to-transparent pointer-events-none z-0" />

            {/* PRELOADER */}
            <div className="absolute opacity-0 pointer-events-none w-0 h-0">
                <Image src={CONST_ASSETS.IMAGES.CARD_FRAME} alt="" width={1} height={1} priority />
                <Image src={CONST_ASSETS.IMAGES.CHAR_AS} alt="" width={1} height={1} priority />
            </div>

            {/* DETAIL POPUP */}
            <AnimatePresence>
                {selectedInfo && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        onClick={() => setSelectedInfo(null)}
                        className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/60 cursor-pointer"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 20 }}
                            className="w-full max-w-sm bg-neutral-900/90 border border-white/10 rounded-xl overflow-hidden shadow-2xl relative"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
                        >
                            {/* Header Gradient */}
                            <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-cyan-500/20 to-transparent pointer-events-none" />

                            <div className="p-6 pt-8 flex flex-col items-center relative z-10">
                                {/* Icon Halo */}
                                <div className="w-24 h-24 mb-6 relative">
                                    <div className="absolute inset-0 bg-cyan-500/30 blur-xl rounded-full" />
                                    <div className="relative w-full h-full rounded-2xl bg-neutral-800 border-2 border-white/20 overflow-hidden shadow-inner rotate-45 scale-75">
                                        <Image src={'img' in selectedInfo.data ? selectedInfo.data.img : selectedInfo.data.icon} fill className="object-cover -rotate-45 scale-150" alt="detail" />
                                    </div>
                                </div>

                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter mb-1">{selectedInfo.data.name}</h3>
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-8 h-px bg-linear-to-r from-transparent via-cyan-500 to-transparent" />
                                        <p className="text-[9px] font-bold text-cyan-400 uppercase tracking-[0.2em]">{selectedInfo.type.toUpperCase()}</p>
                                        <div className="w-8 h-px bg-linear-to-r from-transparent via-cyan-500 to-transparent" />
                                    </div>
                                </div>

                                <p className="text-center text-sm text-gray-300 leading-relaxed mb-8 italic opacity-80 max-w-[80%]">
                                    &quot;{selectedInfo.data.description}&quot;
                                </p>

                                {/* Stats Row */}
                                <div className="grid grid-cols-2 gap-3 w-full">
                                    {'damage' in selectedInfo.data && (
                                        <div className="p-3 bg-white/5 rounded-lg border border-white/5 flex flex-col items-center">
                                            <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Dégâts</span>
                                            <span className="text-lg font-mono font-bold text-red-500">{selectedInfo.data.damage}</span>
                                        </div>
                                    )}
                                    {'heal' in selectedInfo.data && (
                                        <div className="p-3 bg-white/5 rounded-lg border border-white/5 flex flex-col items-center">
                                            <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Soin</span>
                                            <span className="text-lg font-mono font-bold text-emerald-500">{selectedInfo.data.heal}</span>
                                        </div>
                                    )}
                                    {'energyCost' in selectedInfo.data && (
                                        <div className="p-3 bg-white/5 rounded-lg border border-white/5 flex flex-col items-center">
                                            <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Énergie</span>
                                            <span className="text-lg font-mono font-bold text-blue-400">{selectedInfo.data.energyCost}</span>
                                        </div>
                                    )}
                                    {'cooldown' in selectedInfo.data && (
                                        <div className="p-3 bg-white/5 rounded-lg border border-white/5 flex flex-col items-center">
                                            <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Recharge</span>
                                            <span className="text-lg font-mono font-bold text-yellow-500">{(selectedInfo.data.cooldown / 1000).toFixed(1)}s</span>
                                        </div>
                                    )}
                                </div>

                                <button onClick={() => setSelectedInfo(null)} className="mt-8 w-full py-3 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-lg border border-white/5 text-xs font-black uppercase tracking-widest text-white/60 hover:text-white">
                                    Fermer
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}