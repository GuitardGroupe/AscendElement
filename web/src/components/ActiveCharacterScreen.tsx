'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, Zap, Flame, Sword, Gem } from 'lucide-react';
import { useSoundStore } from '@/store/useSoundStore';
import { useSelectedCharacter } from "@/store/useSelectedCharacter";
import { CONST_ASSETS } from '@/lib/preloader';
import { useState } from 'react';

import ItemPic from '@/components/ItemPic';

interface ActiveCharacterScreenProps {
    onSwitchScreen: (screen: string) => void;
}

import { useAdventureStore } from "@/store/useAdventureStore";

interface ActiveCharacterScreenProps {
    onSwitchScreen: (screen: string) => void;
}

export default function ActiveCharacterScreen({ onSwitchScreen }: ActiveCharacterScreenProps) {
    const { playSound } = useSoundStore();
    const { selectedCharacter, clearSelectedCharacter } = useSelectedCharacter();
    const { currencies } = useAdventureStore();
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleBack = () => {
        playSound(CONST_ASSETS.SOUNDS.CLICK);
        onSwitchScreen('lobby');
    };

    const handleSacrificeClick = () => {
        playSound(CONST_ASSETS.SOUNDS.CLICK);
        setShowConfirmation(true);
    };

    const confirmSacrifice = () => {
        playSound(CONST_ASSETS.SOUNDS.ACCEPTATION);
        clearSelectedCharacter();
        onSwitchScreen('lobby');
    };

    const cancelSacrifice = () => {
        playSound(CONST_ASSETS.SOUNDS.CLICK);
        setShowConfirmation(false);
    };

    // Calculate stats (Mock logic consistent with CharactersScreen)
    // In a real app, these would come from the character object or a stats util
    const getStats = (charId: string) => {
        const seed = charId.charCodeAt(0);
        return {
            damage: 60 + (seed % 40),
            defense: 40 + (seed % 50),
            difficulty: 30 + (seed % 60)
        };
    };

    const stats = selectedCharacter ? getStats(String(selectedCharacter.id)) : { damage: 0, defense: 0, difficulty: 0 };

    // Mock progression data - TODO: Real Level/XP logic?
    // User asked to implement counters for currencies (Gold, Shards, XP).
    // Let's display the currencies here.

    // XP is now a currency? 
    // "Il faut implémenter un compteur pour chaque currencies... dans la feuille de personnage actif"

    const activeEquipment = [
        { id: 'weapon', icon: Sword, color: 'text-amber-400', img: CONST_ASSETS.IMAGES.SKILL_02, rarity: 'legendary' },
        { id: 'stim', icon: Zap, color: 'text-cyan-400', img: CONST_ASSETS.IMAGES.ITEM_01, rarity: 'rare' },
        { id: 'outfit', icon: Shield, color: 'text-purple-400', img: null, rarity: 'common' }, // Empty but has type
        { id: 'relic', icon: Gem, color: 'text-emerald-400', img: null, rarity: 'common' },
    ];

    if (!selectedCharacter) return null;

    return (
        <div className="flex flex-col h-full bg-neutral-950 text-white font-sans relative overflow-hidden">
            {/* AMBIENT BACKGROUND */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.1),transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

            {/* CONFIRMATION OVERLAY */}
            <AnimatePresence>
                {showConfirmation && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-[320px] bg-neutral-900 border border-red-500/50 rounded-sm shadow-[0_0_50px_rgba(220,38,38,0.2)] p-6 pt-8 flex flex-col items-center gap-6 relative overflow-hidden"
                        >
                            {/* DANGER STRIPES */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#ef4444_10px,#ef4444_20px)] opacity-50" />

                            <div className="flex flex-col items-center text-center gap-2">
                                <Flame size={32} className="text-red-500 mb-2 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                                <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">
                                    CONFIRMER LE SACRIFICE ?
                                </h3>
                                <p className="text-xs text-red-200/60 font-medium">
                                    Vous êtes sur le point de sacrifier <span className="text-white font-bold">{selectedCharacter.name}</span>.
                                    <br />
                                    Cette action est <span className="text-red-400 font-bold underline">IRRÉVERSIBLE</span>.
                                </p>
                            </div>

                            <div className="flex flex-col w-full gap-3">
                                <button
                                    onClick={confirmSacrifice}
                                    className="w-full py-3 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-black italic uppercase tracking-widest text-sm rounded-xs shadow-lg transition-all"
                                >
                                    OUI, SACRIFIER
                                </button>
                                <button
                                    onClick={cancelSacrifice}
                                    className="w-full py-3 bg-white/5 hover:bg-white/10 active:bg-white/20 text-white/60 hover:text-white font-black uppercase tracking-widest text-xs rounded-xs border border-white/10 transition-all"
                                >
                                    ANNULER
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* HEADER */}
            <header className="relative z-10 flex items-center justify-between mb-2 p-6">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 group active:scale-95 transition-transform"
                >
                    <div className="w-10 h-10 rounded-sm border border-white/10 flex items-center justify-center bg-white/5">
                        <ArrowLeft size={20} className="text-gray-400" />
                    </div>
                </button>
                <div className="text-right pr-1">
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-linear-to-b from-white to-gray-500 pr-2">{"PERSONNAGE"}</h1>
                    <p className="text-[10px] font-black text-cyan-500/60 tracking-[0.3em] uppercase">STATISTIQUES & PROGRESSION</p>
                </div>
            </header>

            <main className="relative z-10 flex-1 flex flex-col px-6 gap-6 overflow-y-auto pb-6">

                {/* PORTRAIT & CORE INFO */}
                <div className="flex flex-col items-center">

                    <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">{selectedCharacter.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="bg-cyan-900/40 border border-cyan-500/30 text-cyan-200 text-[9px] font-black px-2 py-0.5 rounded-xs tracking-widest uppercase">INITIÉ</span>
                        {/* <span className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">NIVEAU {currentLevel}</span> */}
                    </div>
                </div>

                {/* CURRENCIES GRID */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/5 p-2 rounded flex flex-col items-center border border-white/5">
                        <span className="text-[9px] text-amber-500 font-bold uppercase tracking-wider">OR</span>
                        <span className="text-lg font-black text-white">{currencies.gold}</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded flex flex-col items-center border border-white/5">
                        <span className="text-[9px] text-purple-400 font-bold uppercase tracking-wider">ÉCLATS</span>
                        <span className="text-lg font-black text-white">{currencies.soulShards}</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded flex flex-col items-center border border-white/5">
                        <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-wider">EXP</span>
                        <span className="text-lg font-black text-white">{currencies.experience}</span>
                    </div>
                </div>



                {/* STATS GRID */}
                <div className="grid grid-cols-2 gap-4">
                    {/* STAT ITEM */}
                    <div className="p-3 bg-white/5 border border-white/5 rounded-sm flex flex-col gap-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Zap size={14} className="text-white/40" />
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">DÉGÂTS</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-white">{stats.damage}</span>
                            <span className="text-xs font-bold text-green-400">+12</span>
                            <span className="text-xs font-bold text-cyan-400">+5</span>
                        </div>
                    </div>

                    <div className="p-3 bg-white/5 border border-white/5 rounded-sm flex flex-col gap-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Shield size={14} className="text-white/40" />
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">DÉFENSE</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-white">{stats.defense}</span>
                            <span className="text-xs font-bold text-green-400">+8</span>
                            <span className="text-xs font-bold text-cyan-400">+15</span>
                        </div>
                    </div>
                    {/* More props can go here */}
                </div>

                {/* ACTIVE EQUIPMENT ROW */}
                <div className="flex flex-col gap-2">
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">ÉQUIPEMENT ACTIF</span>
                    <div className="flex items-center justify-between gap-2">
                        {activeEquipment.map((slot) => (
                            <div key={slot.id} className="relative group">
                                <ItemPic
                                    src={slot.img}
                                    rarity={slot.rarity}
                                    size={56} // Matching standard size
                                    className={!slot.img ? "opacity-30" : ""}
                                />
                                {!slot.img && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                                        <slot.icon size={18} className={`${slot.color}`} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </main>

            {/* FOOTER ACTION */}
            <div className="p-6 pt-0 relative z-20 flex flex-col items-center">
                <button
                    onClick={handleSacrificeClick}
                    className="w-[60%] py-4 group bg-linear-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 active:scale-95 transition-all rounded-sm flex items-center justify-center gap-3 shadow-[0_4px_20px_rgba(220,38,38,0.3)] relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <Flame size={20} className="text-red-200 drop-shadow-md" />
                    <span className="relative z-10 font-black italic tracking-widest text-sm text-white uppercase drop-shadow-md">
                        SACRIFIER
                    </span>
                </button>
                <p className="text-center text-[9px] text-red-500/50 uppercase mt-3 font-bold tracking-wider">Cette action est irréversible</p>
            </div>
        </div>
    );
}
