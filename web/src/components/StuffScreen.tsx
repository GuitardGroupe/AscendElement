'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sword, Zap, Shield, Gem, Hexagon, Footprints, Hand } from 'lucide-react';
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { selectedCharacter } = useSelectedCharacter();
    const [selectedItem, setSelectedItem] = useState<{ id: string | number, label?: string, img: string | null, rarity?: string, source?: string } | null>(null);

    const handleBack = () => {
        playSound(CONST_ASSETS.SOUNDS.CLICK);
        onSwitchScreen('lobby');
    };

    // Mock active equipment
    const equipmentSlots = [
        // TOP ROW (2 ITEMS)
        { id: 'weapon', label: 'ARME', icon: Sword, color: 'text-amber-400', img: CONST_ASSETS.IMAGES.SKILL_02, type: 'OFFENSIVE', rarity: 'legendary' },
        { id: 'stim', label: 'STIM', icon: Zap, color: 'text-cyan-400', img: CONST_ASSETS.IMAGES.ITEM_01, type: 'UTILITAIRE', rarity: 'epic' },

        // BOTTOM ROW (4 ITEMS)
        { id: 'outfit', label: 'TENUE', icon: Shield, color: 'text-purple-400', img: null, type: 'DÉFENSIF', rarity: 'common' }, // Empty
        { id: 'gloves', label: 'GANTS', icon: Hand, color: 'text-blue-400', img: null, type: 'DÉFENSIF', rarity: 'common' },
        { id: 'boots', label: 'BOTTES', icon: Footprints, color: 'text-orange-400', img: null, type: 'DÉFENSIF', rarity: 'common' },
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
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-linear-to-b from-white to-gray-500 pr-2">{"ÉQUIPEMENT"}</h1>
                    <p className="text-[10px] font-black text-cyan-500/60 tracking-[0.3em] uppercase">GESTION DE L&apos;ARSENAL</p>
                </div>
            </header>

            {/* DEATH PENALTY HINT */}
            <div className="w-full flex flex-col items-center justify-center pb-4 relative z-10">
                <div className="w-full bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.6)_0%,transparent_70%)] py-2 flex justify-center">
                    <p className="text-[10px] font-bold italic text-amber-200 tracking-[0.15em] drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] text-center px-4">
                        {"ATTENTION : l'équipement actif et le contenu de l'inventaire seront détruits à la mort du personnage"}
                    </p>
                </div>
                <div className="w-1/3 h-px bg-linear-to-r from-transparent via-amber-200/30 to-transparent" />
            </div>

            <main className="relative z-10 flex-1 flex flex-col px-4 gap-2 overflow-hidden">

                {/* ACTIVE EQUIPMENT - CUSTOM LAYOUT */}
                <section className="relative w-full py-2 flex items-center justify-center shrink-0">
                    {/* Flex Column Layout - No Container */}
                    <div className="flex flex-col gap-2 items-center">

                        {/* TOP ROW: 2 Items */}
                        <div className="flex gap-2">
                            {equipmentSlots.slice(0, 2).map((slot) => (
                                <div key={slot.id} className="flex flex-col gap-2 items-center">
                                    <span className="text-[9px] font-black text-white/70 uppercase tracking-widest drop-shadow-md z-20">{slot.label}</span>
                                    <EquipmentSlot slot={slot} onClick={(item) => setSelectedItem({ ...item, source: 'equipment' })} />
                                </div>
                            ))}
                        </div>

                        {/* BOTTOM ROW: 4 Items */}
                        <div className="flex gap-2">
                            {equipmentSlots.slice(2, 6).map((slot) => (
                                <div key={slot.id} className="flex flex-col gap-2 items-center">
                                    <EquipmentSlot slot={slot} onClick={(item) => setSelectedItem({ ...item, source: 'equipment' })} />
                                    <span className="text-[9px] font-black text-white/70 uppercase tracking-widest drop-shadow-md z-20">{slot.label}</span>
                                </div>
                            ))}
                        </div>

                    </div>
                </section>

                {/* LoL Wild Rift Style Separator */}
                <div className="flex items-center justify-center gap-4 py-2 w-full opacity-80 px-8">
                    {/* Left Tapering Line */}
                    <div className="h-[1px] flex-1 bg-linear-to-r from-transparent via-amber-400/50 to-amber-200/80" />

                    {/* Central Hextech/Gold Element */}
                    <div className="relative flex items-center justify-center">
                        <div className="w-2 h-2 rotate-45 bg-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.8)] z-10" />
                        <div className="absolute w-6 h-[1px] bg-amber-200/60" /> {/* Horizontal cross line */}
                        <div className="absolute w-[1px] h-6 bg-amber-200/60" /> {/* Vertical cross line */}
                        <div className="absolute w-8 h-8 bg-amber-500/10 blur-xl rounded-full" /> {/* Glow */}
                    </div>

                    {/* Right Tapering Line */}
                    <div className="h-[1px] flex-1 bg-linear-to-l from-transparent via-amber-400/50 to-amber-200/80" />
                </div>

                {/* INVENTORY GRID */}
                <Inventory
                    items={backpackItems}
                    onItemClick={(item) => setSelectedItem({ ...item, source: 'inventory' })}
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
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-pointer"
                    >
                        <motion.div
                            initial={{ y: 200 }}
                            animate={{ y: 0 }}
                            exit={{ y: 200 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-sm bg-neutral-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                        >
                            <div className="p-1 h-1 bg-linear-to-r from-cyan-500 via-blue-500 to-cyan-500" />
                            <div className="p-6 flex gap-4">
                                <div className="shrink-0">
                                    <ItemPic
                                        src={selectedItem.img}
                                        rarity={selectedItem.rarity}
                                        size={80}
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

// --- HELPER COMPONENT ---

interface EquipmentSlotProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    slot: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick: (slot: any) => void;
}

function EquipmentSlot({ slot, onClick }: EquipmentSlotProps) {
    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onClick(slot)}
            className="relative group"
        >
            <div className="relative flex items-center justify-center">
                <ItemPic
                    src={slot.img}
                    rarity={slot.rarity}
                    size={56}
                    className={!slot.img ? "opacity-30 bg-white/5 border-white/5 shadow-none" : ""}
                />

                {/* Fallback Icon */}
                {!slot.img && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                        <slot.icon size={20} className={`${slot.color}`} />
                    </div>
                )}
            </div>
        </motion.button>
    );
}
