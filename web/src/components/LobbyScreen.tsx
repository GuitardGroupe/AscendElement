'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Hexagon, Zap, Shield, Plus, User, Coins } from 'lucide-react';
import Image from 'next/image';
import { useSelectedCharacter } from "@/store/useSelectedCharacter";
import { CONST_ASSETS } from '@/lib/preloader';
import { useSoundStore } from '@/store/useSoundStore';
import { skillSets, Skill, Defense, defenses } from '@/lib/skills';
import { stims, Stim } from '@/lib/stim';
import { useState } from 'react';

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



    const handleCrystalClick = () => {
        playSound(CONST_SOUND_CLICK, 0.6);
        if (selectedCharacter) {
            onSwitchScreen('active-character');
        } else {
            onSwitchScreen('characters');
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#050505] text-white font-sans relative overflow-hidden">

            {/* --- HEADER (SPLIT LAYOUT) --- */}
            <header className="relative z-20 flex justify-between items-start p-6 pt-8 pointer-events-none">

                {/* LEFT: PROFILE INFO */}
                <div className="pointer-events-auto flex items-center gap-3 pl-2">
                    {/* Avatar Ring */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                        className="relative w-12 h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                    >
                        <User size={20} className="text-gray-400" />
                        <div className="absolute -bottom-1 -right-1 bg-cyan-950 border border-cyan-500/30 text-[9px] font-black text-cyan-400 px-1.5 py-0.5 rounded-full">
                            12
                        </div>
                    </motion.div>

                    {/* Name & Rank */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                        className="flex flex-col"
                    >
                        <span className="text-lg font-black italic tracking-tighter text-white leading-none uppercase">
                            {selectedCharacter ? selectedCharacter.name : 'VAGABOND'}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)] animate-pulse" />
                            <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">EN LIGNE</span>
                        </div>
                    </motion.div>
                </div>

                {/* RIGHT: CURRENCY */}
                <motion.div
                    initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                    className="pointer-events-auto pr-2"
                >
                    <div className="bg-neutral-900/60 border border-amber-500/20 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-3 shadow-lg">
                        <span className="font-mono font-bold text-amber-100 text-sm tracking-wide">1,250</span>
                        <Coins size={14} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                    </div>
                </motion.div>
            </header>

            {/* --- MAIN CONTENT (CRYSTAL & SKILLS) --- */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full -mt-10">
                <div className="relative w-full max-w-md h-[400px] flex items-center justify-center -translate-y-[80px]">

                    {/* --- LEFT SKILL PANEL (PRESERVED) --- */}
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-30">
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
                                    <div className="absolute inset-0 bg-neutral-900 border border-white/10 rounded-2xl transition-colors shadow-lg group-hover:border-cyan-500/50" />
                                    <div className="absolute inset-1 bg-neutral-800 rounded-xl overflow-hidden">
                                        <Image src={'img' in item.data ? item.data.img : item.data.icon} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="skill" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-neutral-950 border border-white/20 rounded-full flex items-center justify-center z-10 shadow-md">
                                        <Zap size={10} className="text-cyan-400" />
                                    </div>
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Character Stage */}
                    <div
                        className="relative w-full h-[500px] flex items-center justify-center cursor-pointer group"
                        onClick={() => handleCrystalClick()}
                    >
                        {/* Custom blended vignette (Always active to ground the scene) */}
                        {/* Custom blended vignette (Stronger oval mask) */}
                        <div
                            className="absolute inset-0 z-20 pointer-events-none"
                            style={{
                                background: 'radial-gradient(ellipse at center, transparent 50%, #050505 85%)',
                                boxShadow: 'inset 0 0 60px 40px #050505'
                            }}
                        />

                        {selectedCharacter ? (
                            /* ACTIVE CHARACTER */
                            <div className="relative w-auto h-full aspect-[3/4] mask-image-b-fade z-10 drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                                <Image
                                    src={selectedCharacter.img}
                                    fill
                                    className="object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                                    alt={selectedCharacter.name}
                                    priority
                                />
                            </div>
                        ) : (
                            /* EMPTY STATE: SHADOW KNIGHT */
                            <div className="relative w-auto h-full aspect-[3/4] z-0 opacity-40 grayscale flex items-center justify-center">
                                {/* The Ghostly Knight */}
                                <Image
                                    src="/v1/images/webp/knight.webp"
                                    fill
                                    className="object-contain mask-image-b-fade"
                                    alt="Select Character"
                                    priority
                                />

                                {/* Heavy Inner Shadow Overlay to make it look like a silhouette/hole */}
                                <div className="absolute inset-0 bg-black/50 mix-blend-multiply" />
                                <div className="absolute inset-0 shadow-[inset_0_0_100px_#050505]" />

                                {/* Pulse Prompt */}
                                <div className="absolute inset-0 flex items-center justify-center z-30">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-16 h-16 rounded-full border-2 border-white/10 flex items-center justify-center bg-black/50 backdrop-blur-sm shadow-[0_0_30px_rgba(6,182,212,0.2)] animate-pulse">
                                            <Plus className="text-white/50 w-8 h-8" />
                                        </div>
                                        <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black">INCARNER</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Bottom Fade for feet */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#050505] via-[#050505]/80 to-transparent z-20" />
                    </div>

                    {/* --- RIGHT SKILL PANEL (PRESERVED) --- */}
                    {selectedCharacter && (
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-30">
                            <AnimatePresence>
                                {interactionItems.filter(i => i.side === 'right').map((item, idx) => (
                                    <motion.button
                                        key={`right-${idx}`}
                                        initial={{ x: 50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 + idx * 0.1, type: 'spring' }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => { e.stopPropagation(); playSound(CONST_SOUND_CLICK); setSelectedInfo(item); }}
                                        className="group relative w-16 h-16"
                                    >
                                        <div className="absolute inset-0 bg-neutral-900 border border-white/10 rounded-2xl transition-colors shadow-lg group-hover:border-cyan-500/50" />
                                        <div className="absolute inset-1 bg-neutral-800 rounded-xl overflow-hidden">
                                            <Image src={'img' in item.data ? item.data.img : item.data.icon} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="skill" />
                                        </div>
                                        <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-neutral-950 border border-white/20 rounded-full flex items-center justify-center z-10 shadow-md">
                                            {item.type === 'defense' ? <Shield size={10} className="text-yellow-400" /> : <Plus size={10} className="text-green-400" />}
                                        </div>
                                    </motion.button>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </main>

            {/* --- NAVIGATION DOCK (CRYSTAL SEAL - VISIBLE ONLY IF CHAR SELECTED) --- */}
            <AnimatePresence>
                {selectedCharacter && (
                    <motion.nav
                        initial={{ y: 200, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 200, opacity: 0 }}
                        transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                        className="absolute bottom-24 w-full flex justify-center items-end px-4 z-40"
                    >
                        {/* BUTTONS LAYOUT */}
                        <div className="flex items-end justify-center w-full max-w-lg gap-6 relative z-10">

                            {/* LEFT SATELLITE: STUFF */}
                            <motion.button
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => { playSound(CONST_SOUND_CLICK); onSwitchScreen('inventory'); }}
                                className="relative flex-1 h-14 bg-linear-to-b from-[#0f172a] to-[#020617] rounded-l-xl rounded-tr-md border-t border-l border-cyan-500/30 border-b-2 border-b-cyan-500 flex items-center justify-center overflow-hidden group shadow-[0_4px_20px_rgba(6,182,212,0.15)] mb-4"
                                style={{ skewX: '8deg' }}
                            >
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />
                                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-cyan-400/50 to-transparent opacity-50" />
                                <span className="text-sm font-black italic text-cyan-100 uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transform -skew-x-[8deg]">
                                    STUFF
                                </span>
                            </motion.button>

                            {/* CENTER CORE: CRYSTAL SEAL (AVENTURE) */}
                            <motion.button
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => { playSound(CONST_SOUND_CLICK); onSwitchScreen('adventure'); }}
                                className="relative w-48 h-48 -mb-8 flex items-center justify-center group z-20 will-change-transform"
                            >
                                {/* Crystal Image Main (Static) */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative w-full h-full">
                                        <Image
                                            src="/v1/images/webp/fightcrystalintact.webp"
                                            fill
                                            className="object-contain drop-shadow-[0_0_30px_rgba(234,179,8,0.4)]"
                                            alt="Play"
                                            priority
                                        />
                                    </div>
                                </div>

                                {/* Dark Band Overlay (Static) */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-12 bg-black/60 backdrop-blur-sm border-y border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                                    {/* Text (Static) */}
                                    <span className="text-xl font-black italic text-transparent bg-clip-text bg-linear-to-b from-yellow-100 via-amber-300 to-amber-600 uppercase tracking-widest drop-shadow-sm">
                                        AVENTURE
                                    </span>
                                </div>
                            </motion.button>

                            {/* RIGHT SATELLITE: BANQUE */}
                            <motion.button
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => { playSound(CONST_SOUND_CLICK); onSwitchScreen('vault'); }}
                                className="relative flex-1 h-14 bg-linear-to-b from-[#2a1b0a] to-[#1a0a00] rounded-r-xl rounded-tl-md border-t border-r border-amber-500/30 border-b-2 border-b-amber-500 flex items-center justify-center overflow-hidden group shadow-[0_4px_20px_rgba(245,158,11,0.15)] mb-4"
                                style={{ skewX: '-8deg' }}
                            >
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
                                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-amber-400/50 to-transparent opacity-50" />
                                <span className="text-sm font-black italic text-amber-100 uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transform -skew-x-[-8deg]">
                                    BANQUE
                                </span>
                            </motion.button>

                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>

            {/* DETAIL POPUP (PRESERVED) */}
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