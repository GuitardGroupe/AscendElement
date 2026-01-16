'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Package, Hexagon, Zap, Shield, Plus, Landmark } from 'lucide-react';
import Image from 'next/image';
import { useSelectedCharacter } from "@/store/useSelectedCharacter";
import { CONST_ASSETS } from '@/lib/preloader';
import { useSoundStore } from '@/store/useSoundStore';
import { skillSets, Skill, Defense, defenses } from '@/lib/skills';
import { stims, Stim } from '@/lib/stim';
import { useState } from 'react';
import ElementCrystal from './ElementCrystal';

const CONST_SOUND_CLICK = CONST_ASSETS.SOUNDS.CLICK;

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
    const { selectedCharacter } = useSelectedCharacter();
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
        { id: 'vault', show: isCrystalActive, label: 'COFFRE', icon: Landmark, bg: 'bg-amber-600', glow: 'shadow-amber-600/50', onClick: () => onSwitchScreen('vault') },
    ];

    const handleCrystalClick = () => {
        playSound(CONST_SOUND_CLICK, 0.6);
        if (selectedCharacter) {
            onSwitchScreen('active-character');
        } else {
            onSwitchScreen('characters');
        }
    };

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
                                    className="group relative w-16 h-16"
                                >
                                    <div className="absolute inset-0 bg-neutral-900 border border-white/10 rounded-2xl transition-colors shadow-lg" />
                                    <div className="absolute inset-1 bg-neutral-800 rounded-xl overflow-hidden">
                                        <Image src={'img' in item.data ? item.data.img : item.data.icon} fill className="object-cover" alt="skill" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-neutral-950 border border-white/20 rounded-full flex items-center justify-center z-10">
                                        <Zap size={10} className="text-cyan-400" />
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
                                    className="group relative w-16 h-16"
                                >
                                    <div className="absolute inset-0 bg-neutral-900 border border-white/10 rounded-2xl transition-colors shadow-lg" />
                                    <div className="absolute inset-1 bg-neutral-800 rounded-xl overflow-hidden">
                                        <Image src={'img' in item.data ? item.data.img : item.data.icon} fill className="object-cover" alt="skill" />
                                    </div>
                                    <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-neutral-950 border border-white/20 rounded-full flex items-center justify-center z-10">
                                        {item.type === 'defense' ? <Shield size={10} className="text-yellow-400" /> : <Plus size={10} className="text-green-400" />}
                                    </div>
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* BOTTOM DOCK NAVIGATION */}
            {/* BOTTOM DOCK NAVIGATION (Wild Rift Arc Style) */}
            <nav className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
                <div className="flex items-end justify-center gap-6 pb-2">
                    <AnimatePresence>
                        {menuItems.filter(item => item.show).map((item, index) => {
                            // Arc positioning logic can be purely visual via relative translation or flex alignment
                            // For simplicity and mobile-first, we use a flex row with translateY for the center button to create an arc effect
                            // Outer buttons (index 0 and 2) stay lower, Center (index 1) can be slightly raised OR
                            // In Wild Rift, the "Play" button is usually the biggest and most prominent at the bottom right.
                            // Here we want a localized menu.
                            // Let's make them round buttons.

                            const isCenter = index === 1;

                            return (
                                <motion.button
                                    key={item.id}
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 50, opacity: 0 }}
                                    transition={{ delay: index * 0.05, type: 'spring', stiffness: 200 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => { playSound(CONST_SOUND_CLICK); item.onClick(); }}
                                    className={`
                                        relative group flex flex-col items-center justify-center
                                        ${isCenter ? '-mb-2' : ''} 
                                    `}
                                >
                                    <div className={`
                                        w-16 h-16 rounded-full border border-opacity-50
                                        flex items-center justify-center shadow-lg relative overflow-hidden transition-all backdrop-blur-md
                                        ${item.id === 'adventure'
                                            ? 'bg-yellow-900/40 border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:bg-yellow-900/60'
                                            : item.id === 'sacrifice'
                                                ? 'bg-red-900/40 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:bg-red-900/60'
                                                : 'bg-blue-900/40 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:bg-blue-900/60'
                                        }
                                    `}>
                                        {/* Glass Glare */}
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_60%)] pointer-events-none" />

                                        {/* Icon */}
                                        <item.icon size={24} className={`relative z-10 drop-shadow-md ${item.id === 'adventure' ? 'text-yellow-100' : 'text-white'}`} />
                                    </div>

                                    {/* Label underneath */}
                                    <span className={`
                                        absolute -bottom-6 text-[10px] font-black uppercase tracking-wider
                                        ${item.id === 'adventure' ? 'text-yellow-500 scale-110' : 'text-gray-400 group-hover:text-white transition-colors'}
                                    `}>
                                        {item.label}
                                    </span>
                                </motion.button>
                            );
                        })}
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
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-sm bg-[#08080a] border border-gray-700 rounded-sm shadow-2xl relative overflow-hidden"
                            onClick={() => { playSound(CONST_SOUND_CLICK); setSelectedInfo(null); }}
                        >
                            {/* Header Image Background */}
                            <div className="absolute top-0 left-0 right-0 h-40 bg-neutral-800">
                                <Image src={'img' in selectedInfo.data ? selectedInfo.data.img : selectedInfo.data.icon} fill className="object-cover opacity-60 mask-image-gradient-b" alt="bg" />
                                <div className="absolute inset-0 bg-linear-to-t from-[#08080a] to-transparent" />
                            </div>

                            <div className="p-5 pt-32 relative z-10 flex flex-col items-start">
                                <h3 className="text-2xl font-black italic text-white uppercase tracking-tight mb-0.5">{selectedInfo.data.name}</h3>
                                <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-4">COMPÉTENCE ACTIVE</p>

                                <div className="w-full h-px bg-gray-800 mb-4" />

                                <p className="text-sm text-gray-400 leading-relaxed mb-6 italic">
                                    &quot;{selectedInfo.data.description}&quot;
                                </p>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-x-8 gap-y-4 w-full mb-6">
                                    {'damage' in selectedInfo.data && (
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-gray-500 uppercase font-black">Dégâts</span>
                                            <span className="text-xl font-black text-white">{selectedInfo.data.damage}</span>
                                        </div>
                                    )}
                                    {'energyCost' in selectedInfo.data && (
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-gray-500 uppercase font-black">Coût</span>
                                            <span className="text-xl font-black text-blue-400">{selectedInfo.data.energyCost}</span>
                                        </div>
                                    )}
                                    {'cooldown' in selectedInfo.data && (
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-gray-500 uppercase font-black">Récup.</span>
                                            <span className="text-xl font-black text-yellow-500">{(selectedInfo.data.cooldown / 1000).toFixed(1)}s</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Close X */}
                            <button onClick={() => setSelectedInfo(null)} className="absolute top-3 right-3 p-2 text-white/50 hover:text-white">
                                <div className="text-xl font-bold">✕</div>
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}