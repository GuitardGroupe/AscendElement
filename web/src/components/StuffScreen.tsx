'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sword, Zap, Shield, Gem, Hexagon } from 'lucide-react';
import Image from 'next/image';
import { useSoundStore } from '@/store/useSoundStore';
import { useSelectedCharacter } from "@/store/useSelectedCharacter";
import { CONST_ASSETS } from '@/lib/preloader';
import { useState } from 'react';

interface StuffScreenProps {
    onSwitchScreen: (screen: string) => void;
}

export default function StuffScreen({ onSwitchScreen }: StuffScreenProps) {
    const { playSound } = useSoundStore();
    const { selectedCharacter } = useSelectedCharacter();
    const [selectedItem, setSelectedItem] = useState<{ id: string | number, label?: string, img: string | null } | null>(null);

    const handleBack = () => {
        playSound(CONST_ASSETS.SOUNDS.CLICK);
        onSwitchScreen('lobby');
    };

    // Mock active equipment
    const equipmentSlots = [
        { id: 'weapon', label: 'ARME', icon: Sword, color: 'text-amber-400', img: CONST_ASSETS.IMAGES.SKILL_02, type: 'OFFENSIVE' },
        { id: 'stim', label: 'STIM', icon: Zap, color: 'text-cyan-400', img: CONST_ASSETS.IMAGES.ITEM_01, type: 'UTILITAIRE' },
        { id: 'outfit', label: 'TENUE', icon: Shield, color: 'text-purple-400', img: null, type: 'DÉFENSIF' },
        { id: 'relic', label: 'RELIQUE', icon: Gem, color: 'text-emerald-400', img: null, type: 'PASSIF' },
    ];

    // Mock backpack
    const backpackItems = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        img: i === 0 ? CONST_ASSETS.IMAGES.SKILL_04 : null,
        label: i === 0 ? 'CRISTAL DE PUISSANCE' : 'EMP PLACEMENT'
    }));

    return (
        <div className="flex flex-col h-full bg-neutral-950 text-white font-sans relative overflow-hidden">
            {/* AMBIENT BACKGROUND */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-blue-900/30 via-neutral-950/80 to-neutral-950" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

            {/* HEADER */}
            <header className="relative z-20 mx-4 mt-6 p-1">
                <div className="flex justify-between items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-3 shadow-lg relative overflow-hidden">
                    <button onClick={handleBack} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 active:scale-90 transition-transform">
                        <ArrowLeft size={16} className="text-gray-300" />
                    </button>
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black text-cyan-500 uppercase tracking-widest">LOGISTIQUE</span>
                        <span className="text-sm font-black italic text-white uppercase tracking-tighter">ÉQUIPEMENT</span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 flex-1 flex flex-col p-4 gap-6 overflow-y-auto pb-20">

                {/* CHARACTER MANNEQUIN / EQUIPMENT */}
                <section className="relative h-[280px] w-full bg-linear-to-b from-white/5 to-transparent border border-white/5 rounded-xl overflow-hidden shadow-lg flex items-center justify-center">
                    {/* Character Silhouette */}
                    {selectedCharacter && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-30 grayscale mix-blend-overlay">
                            <Image src={selectedCharacter.img} fill className="object-cover" alt="silhouette" />
                        </div>
                    )}

                    <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/50 to-transparent" />

                    {/* Equipment Hex Grid */}
                    <div className="relative z-10 grid grid-cols-2 gap-x-12 gap-y-6">
                        {equipmentSlots.map((slot) => (
                            <motion.button
                                key={slot.id}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedItem(slot)}
                                className="relative group flex flex-col items-center gap-2"
                            >
                                <div className="w-16 h-16 relative">
                                    {/* Hexagon Border */}
                                    <div className={`absolute inset-0 rotate-45 border-2 ${slot.img ? 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'border-white/10 bg-black/40'} transition-all group-hover:border-cyan-400/50`} />

                                    {/* Inner Content */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {slot.img ? (
                                            <div className="w-10 h-10 relative rotate-45 overflow-hidden">
                                                <Image src={slot.img} fill className="object-cover -rotate-45 scale-150" alt="equip" />
                                            </div>
                                        ) : (
                                            <slot.icon size={20} className={`${slot.color} opacity-40`} />
                                        )}
                                    </div>
                                </div>
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/5">{slot.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </section>

                {/* INVENTORY GRID */}
                <section className="flex-1">
                    <div className="flex items-center justify-between mb-3 px-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">INVENTAIRE</span>
                        <span className="text-[10px] font-mono text-cyan-500">1 / 20</span>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                        {backpackItems.map((item) => (
                            <motion.button
                                key={item.id}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => item.img && setSelectedItem(item)}
                                className={`aspect-square rounded-sm border ${item.img ? 'bg-neutral-800 border-white/20' : 'bg-white/5 border-white/5'} relative overflow-hidden group hover:border-cyan-500/50 transition-colors`}
                            >
                                {item.img && <Image src={item.img} fill className="object-cover p-1" alt="item" />}
                            </motion.button>
                        ))}
                    </div>
                </section>
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
                                <div className="w-20 h-20 bg-neutral-800 rounded-lg border border-white/10 shrink-0 relative overflow-hidden">
                                    {selectedItem.img ? (
                                        <Image src={selectedItem.img} fill className="object-cover" alt="detail" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center"><Hexagon className="text-white/20" /></div>
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
                                <button className="p-4 text-xs font-black text-red-400 uppercase hover:bg-white/5 transition-colors">JETER</button>
                                <button className="p-4 text-xs font-black text-cyan-400 uppercase border-l border-white/5 hover:bg-white/5 transition-colors">ÉQUIPER</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
