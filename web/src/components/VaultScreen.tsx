'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Hexagon, Lock } from 'lucide-react';
import Image from 'next/image';
import { useSoundStore } from '@/store/useSoundStore';
import { CONST_ASSETS } from '@/lib/preloader';
import { useState } from 'react';

import ItemPic from '@/components/ItemPic';
import Inventory from '@/components/Inventory';

interface VaultScreenProps {
    onSwitchScreen: (screen: string) => void;
}

export default function VaultScreen({ onSwitchScreen }: VaultScreenProps) {
    const { playSound } = useSoundStore();
    const [selectedItem, setSelectedItem] = useState<{ id: string | number, label?: string, img: string | null, source: 'vault' | 'inventory', rarity?: string } | null>(null);

    const handleBack = () => {
        playSound(CONST_ASSETS.SOUNDS.CLICK);
        onSwitchScreen('lobby');
    };

    // Mock Vault Items (9 slots for 3x3)
    const vaultItems = Array.from({ length: 9 }, (_, i) => ({
        id: `vault-${i}`,
        img: i < 5 ? (i % 2 === 0 ? CONST_ASSETS.IMAGES.SKILL_02 : CONST_ASSETS.IMAGES.ITEM_01) : null,
        label: i < 5 ? 'PRÉCIEUX' : 'VIDE',
        rarity: i % 2 === 0 ? 'epic' : 'rare',
        locked: false // No visible locks for now in the 9 slots to keep it clean, or could lock last row
    }));

    // Mock Inventory Items (20 slots)
    const inventoryItems = Array.from({ length: 20 }, (_, i) => ({
        id: `inven-${i}`,
        img: i === 0 ? CONST_ASSETS.IMAGES.SKILL_04 : null,
        label: i === 0 ? 'CRISTAL' : 'VIDE',
        rarity: i === 0 ? 'legendary' : 'common'
    }));

    return (
        <div className="flex flex-col h-full bg-neutral-950 text-white font-sans relative overflow-hidden">
            {/* AMBIENT BACKGROUND */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.1),transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

            {/* HEADER */}
            <header className="relative z-10 flex items-center justify-between mb-4 p-6 pb-2">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 group active:scale-95 transition-transform"
                >
                    <div className="w-10 h-10 rounded-sm border border-white/10 flex items-center justify-center bg-white/5">
                        <ArrowLeft size={20} className="text-gray-400" />
                    </div>
                </button>
                <div className="text-right pr-1">
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-linear-to-b from-amber-200 to-amber-600 pr-2">{"BANQUE"}</h1>
                    <p className="text-[10px] font-black text-amber-500/60 tracking-[0.3em] uppercase">STOCKAGE SÉCURISÉ</p>
                </div>
            </header>

            {/* VAULT SAFETY HINT */}
            <div className="w-full flex flex-col items-center justify-center pb-4 relative z-10">
                <div className="w-full bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.6)_0%,transparent_70%)] py-2 flex justify-center">
                    <p className="text-[10px] font-bold italic text-amber-200  tracking-[0.15em] drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] text-center px-4">
                        {"CONSEIL : les objets stockés dans la banque seront sécurisés même après la mort du personnage"}
                    </p>
                </div>
                <div className="w-1/3 h-px bg-linear-to-r from-transparent via-amber-200/30 to-transparent" />
            </div>

            <main className="relative z-10 flex-1 flex flex-col px-4 gap-2 overflow-hidden pb-4">

                {/* VAULT SECTION - 3x3 MATCHING STUFF SCREEN STYLE */}
                <section className="flex flex-col gap-2 items-center justify-start shrink-0 py-4">
                    <div className="relative inline-block">
                        {/* Chest Container */}
                        {/* Reduced border opacity to /60 */}
                        <div className="bg-neutral-900/80 border-4 border-double border-amber-300/60 rounded-xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative overflow-hidden transition-colors group z-10">
                            {/* Inner Light / Shadow Simulation - Paladin Style */}
                            {/* Ref: Particle effect removed per user request */}
                            <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(251,191,36,0.6)] pointer-events-none z-0 mix-blend-screen" />
                            <div className="absolute inset-0 bg-radial-gradient from-amber-200/20 to-transparent opacity-100 pointer-events-none z-0" />

                            {/* Grid */}
                            <div className="grid grid-cols-3 gap-2 relative z-10 place-content-center"> {/* 3x3 Grid with perfect spacing */}
                                {vaultItems.map((item) => (
                                    <motion.button
                                        key={item.id}
                                        whileTap={!item.locked ? { scale: 0.95 } : {}}
                                        onClick={() => !item.locked && item.img && setSelectedItem({ ...item, source: 'vault' })}
                                        className={`
                                            relative rounded-sm overflow-hidden transition-all flex items-center justify-center group
                                            ${item.locked ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                                        `}
                                    >
                                        <ItemPic
                                            src={item.img}
                                            rarity={item.rarity}
                                            size={56} // Matching standard size
                                            className={!item.img && !item.locked ? "opacity-30 bg-white/5 border-white/5 shadow-none" : ""}
                                        />

                                        {/* Lock Icon for empty/locked slots in Vault context */}
                                        {item.label === 'VIDE' && !item.img && (
                                            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                                                <Lock size={16} className="text-white" />
                                            </div>
                                        )}

                                        {/* Explicit Locked State Override */}
                                        {item.locked && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
                                                <Lock size={16} className="text-gray-400" />
                                            </div>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>



                {/* INVENTORY SECTION */}
                <Inventory
                    items={inventoryItems}
                    onItemClick={(item) => setSelectedItem({ ...item, source: 'inventory' })}
                    className="mb-4"
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
                            <div className={`p-1 h-1 bg-linear-to-r ${selectedItem.source === 'vault' ? 'from-amber-500 via-yellow-500 to-amber-500' : 'from-cyan-500 via-blue-500 to-cyan-500'}`} />
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
                                    <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 block ${selectedItem.source === 'vault' ? 'text-amber-500' : 'text-cyan-500'}`}>
                                        {selectedItem.source === 'vault' ? 'STOCKÉ' : 'DANS LE SAC'}
                                    </span>
                                </div>
                            </div>
                            <button className={`w-full p-4 text-xs font-black uppercase transition-colors border-t border-white/10 ${selectedItem.source === 'vault' ? 'text-cyan-400 active:bg-cyan-900/20' : 'text-amber-400 active:bg-amber-900/20'}`}>
                                {selectedItem.source === 'vault' ? 'RÉCUPÉRER' : 'DÉPOSER'}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
