'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sword, Zap, Shield, Gem, Hexagon } from 'lucide-react';
import { useSoundStore } from '@/store/useSoundStore';
import { useSelectedCharacter } from "@/store/useSelectedCharacter";
import { CONST_ASSETS } from '@/lib/preloader';
import { useState } from 'react';

import ItemPic from '@/components/ItemPic';
import Inventory from '@/components/Inventory';

interface StuffScreenProps {
    onSwitchScreen: (screen: string) => void;
}

export default function StuffScreen({ onSwitchScreen }: StuffScreenProps) {
    const { playSound } = useSoundStore();
    const { selectedCharacter } = useSelectedCharacter();
    const [selectedItem, setSelectedItem] = useState<{ id: string | number, label?: string, img: string | null, rarity?: string } | null>(null);

    const handleBack = () => {
        playSound(CONST_ASSETS.SOUNDS.CLICK);
        onSwitchScreen('lobby');
    };

    // Mock active equipment
    const equipmentSlots = [
        { id: 'weapon', label: 'ARME', icon: Sword, color: 'text-amber-400', img: CONST_ASSETS.IMAGES.SKILL_02, type: 'OFFENSIVE', rarity: 'legendary' },
        { id: 'stim', label: 'STIM', icon: Zap, color: 'text-cyan-400', img: CONST_ASSETS.IMAGES.ITEM_01, type: 'UTILITAIRE', rarity: 'epic' },
        { id: 'outfit', label: 'TENUE', icon: Shield, color: 'text-purple-400', img: null, type: 'DÉFENSIF', rarity: 'common' }, // Empty
        { id: 'relic', label: 'RELIQUE', icon: Gem, color: 'text-emerald-400', img: null, type: 'PASSIF', rarity: 'common' },
    ];

    // Mock backpack
    const backpackItems = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        img: i === 0 ? CONST_ASSETS.IMAGES.SKILL_04 : null,
        label: i === 0 ? 'CRISTAL DE PUISSANCE' : 'EMP PLACEMENT',
        rarity: i === 0 ? 'rare' : 'common'
    }));

    return (
        <div className="flex flex-col h-full bg-neutral-950 text-white font-sans relative overflow-hidden">
            {/* AMBIENT BACKGROUND */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.1),transparent_70%)] pointer-events-none" />

            {/* HEADER */}
            <header className="relative z-10 flex items-center justify-between mb-2 p-4">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 group active:scale-95 transition-transform"
                >
                    <div className="w-10 h-10 rounded-sm border border-white/10 flex items-center justify-center bg-white/5">
                        <ArrowLeft size={20} className="text-gray-400" />
                    </div>
                </button>
                <div className="text-right pr-1">
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-linear-to-b from-white to-gray-500">{"ÉQUIPEMENT ."}</h1>
                    <p className="text-[10px] font-black text-cyan-500/60 tracking-[0.3em] uppercase">GESTION DE L&apos;ARSENAL</p>
                </div>
            </header>

            <main className="relative z-10 flex-1 flex flex-col px-4 gap-2 overflow-hidden">

                {/* ACTIVE EQUIPMENT - 2x2 GRID */}
                <section className="relative w-full py-2 flex items-center justify-center shrink-0">
                    <div className="bg-linear-to-b from-white/5 to-transparent border border-white/5 rounded-3xl p-3 shadow-lg relative overflow-hidden">
                        {/* Background Effect */}
                        <div className="absolute inset-0 bg-radial-gradient from-cyan-500/10 to-transparent opacity-50" />

                        {/* 2x2 Grid */}
                        <div className="relative z-10 grid grid-cols-2 gap-2">
                            {equipmentSlots.map((slot) => (
                                <motion.button
                                    key={slot.id}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedItem(slot)}
                                    className="relative group"
                                >
                                    <div className="w-20 h-20 relative flex items-center justify-center">

                                        <div className="relative z-10">
                                            <ItemPic
                                                src={slot.img}
                                                rarity={slot.rarity}
                                                size={80} // Larger size for equipment slots
                                                className={!slot.img ? "opacity-30 border-white/10" : ""}
                                            />
                                        </div>

                                        {/* Fallback Icon if no image */}
                                        {!slot.img && (
                                            <div className="absolute inset-0 flex items-center justify-center opacity-30 z-0">
                                                <slot.icon size={28} className={`${slot.color}`} />
                                            </div>
                                        )}

                                        {/* Centered Label */}
                                        <div className="absolute inset-x-0 bottom-1 flex items-center justify-center z-20 pointer-events-none">
                                            <span className="text-[9px] font-black text-white/90 uppercase tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)] bg-black/30 px-2 py-0.5 rounded-xs backdrop-blur-[1px] border border-white/5">
                                                {slot.label}
                                            </span>
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* INVENTORY GRID */}
                <Inventory
                    items={backpackItems}
                    onItemClick={setSelectedItem}
                />
            </main>

            {/* ITEM DETAILS POPUP */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedItem(null)}
                        className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-pointer"
                    >
                        <motion.div
                            initial={{ y: 200 }}
                            animate={{ y: 0 }}
                            exit={{ y: 200 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-sm bg-neutral-900 border border-white/10 rounded-t-xl sm:rounded-xl overflow-hidden shadow-2xl pb-8 sm:pb-0"
                        >
                            <div className="p-1 h-1 bg-linear-to-r from-cyan-500 via-blue-500 to-cyan-500" />
                            <div className="p-6 flex gap-4">
                                <div className="shrink-0">
                                    <ItemPic
                                        src={selectedItem.img}
                                        rarity={selectedItem.rarity} // rarity added to selectedItem in previous steps
                                        size={80} // 20 * 4 = 80px
                                        className={!selectedItem.img ? "opacity-30 border-white/10" : ""}
                                    />
                                    {!selectedItem.img && (
                                        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                                            <Hexagon className="text-white/20" size={32} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-black italic text-white uppercase tracking-tight">{selectedItem.label}</h3>
                                    <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-2 block">RARETÉ : ÉPIQUE</span>
                                    <p className="text-xs text-gray-400 leading-relaxed italic">
                                        &quot;Un artefact condensé d&apos;énergie pure. Augmente considérablement la puissance de combat.&quot;
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 bg-white/5 border-t border-white/5">
                                <button className="p-4 text-xs font-black text-red-400 uppercase active:bg-white/5 transition-colors">JETER</button>
                                <button className="p-4 text-xs font-black text-cyan-400 uppercase border-l border-white/5 active:bg-white/5 transition-colors">ÉQUIPER</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
