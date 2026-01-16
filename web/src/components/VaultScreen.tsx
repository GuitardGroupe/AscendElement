'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Hexagon, Lock } from 'lucide-react';
import Image from 'next/image';
import { useSoundStore } from '@/store/useSoundStore';
import { CONST_ASSETS } from '@/lib/preloader';
import { useState } from 'react';

interface VaultScreenProps {
    onSwitchScreen: (screen: string) => void;
}

export default function VaultScreen({ onSwitchScreen }: VaultScreenProps) {
    const { playSound } = useSoundStore();
    const [selectedItem, setSelectedItem] = useState<{ id: string | number, label?: string, img: string | null, source: 'vault' | 'inventory' } | null>(null);

    const handleBack = () => {
        playSound(CONST_ASSETS.SOUNDS.CLICK);
        onSwitchScreen('lobby');
    };

    // Mock Vault Items (9 slots for 3x3)
    const vaultItems = Array.from({ length: 9 }, (_, i) => ({
        id: `vault-${i}`,
        img: i < 5 ? (i % 2 === 0 ? CONST_ASSETS.IMAGES.SKILL_02 : CONST_ASSETS.IMAGES.ITEM_01) : null,
        label: i < 5 ? 'PRÉCIEUX' : 'VIDE',
        locked: false // No visible locks for now in the 9 slots to keep it clean, or could lock last row
    }));

    // Mock Inventory Items (20 slots)
    const inventoryItems = Array.from({ length: 20 }, (_, i) => ({
        id: `inven-${i}`,
        img: i === 0 ? CONST_ASSETS.IMAGES.SKILL_04 : null,
        label: i === 0 ? 'CRISTAL' : 'VIDE'
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
                <div className="text-right">
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-linear-to-b from-amber-200 to-amber-600">BANQUE</h1>
                    <p className="text-[10px] font-black text-amber-500/60 tracking-[0.3em] uppercase">STOCKAGE SÉCURISÉ</p>
                </div>
            </header>

            <main className="relative z-10 flex-1 flex flex-col px-4 gap-2 overflow-hidden pb-4">

                {/* VAULT SECTION - 3x3 MATCHING STUFF SCREEN STYLE */}
                <section className="flex flex-col gap-2 flex-1 items-center justify-start min-h-0 shrink-0 mt-4">
                    <div className="flex items-center justify-between px-2 w-full max-w-[280px]">
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">COFFRE PERSONNEL</span>
                        <span className="text-[10px] font-mono text-amber-500/80">5 / 9</span>
                    </div>

                    <div className="bg-linear-to-b from-white/5 to-transparent border border-white/5 rounded-xl p-4 shadow-[0_0_30px_rgba(245,158,11,0.2)] relative overflow-hidden">
                        {/* Background Golden Glow */}
                        <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 to-transparent opacity-60" />

                        <div className="grid grid-cols-3 gap-2 relative z-10">
                            {vaultItems.map((item) => (
                                <motion.button
                                    key={item.id}
                                    whileTap={!item.locked ? { scale: 0.95 } : {}}
                                    onClick={() => !item.locked && item.img && setSelectedItem({ ...item, source: 'vault' })}
                                    className={`
                                        aspect-square w-16 rounded-sm border relative overflow-hidden transition-all flex items-center justify-center group
                                        ${item.locked
                                            ? 'bg-black/60 border-white/5 opacity-30 cursor-not-allowed'
                                            : item.img
                                                ? 'bg-neutral-800 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                                                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-amber-500/30'
                                        }
                                    `}
                                >
                                    {item.img && <Image src={item.img} fill className="object-cover" alt="item" />}
                                    {item.locked && <Lock size={12} className="text-gray-600" />}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* INVENTORY SECTION */}
                <section className="flex flex-col gap-2 h-[140px] shrink-0">
                    <div className="flex items-center justify-between px-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">INVENTAIRE</span>
                        <span className="text-[10px] font-mono text-cyan-500">1 / 20</span>
                    </div>
                    <div className="bg-black/20 border border-white/5 rounded-sm p-3 overflow-y-auto">
                        <div className="grid grid-cols-5 gap-2 pr-1">
                            {inventoryItems.map((item) => (
                                <motion.button
                                    key={item.id}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => item.img && setSelectedItem({ ...item, source: 'inventory' })}
                                    className={`aspect-square rounded-sm border ${item.img ? 'bg-neutral-800 border-white/20' : 'bg-white/5 border-white/5'} relative overflow-hidden transition-colors`}
                                >
                                    {item.img && <Image src={item.img} fill className="object-cover" alt="item" />}
                                </motion.button>
                            ))}
                        </div>
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
                            <div className={`p-1 h-1 bg-linear-to-r ${selectedItem.source === 'vault' ? 'from-amber-500 via-yellow-500 to-amber-500' : 'from-cyan-500 via-blue-500 to-cyan-500'}`} />
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
