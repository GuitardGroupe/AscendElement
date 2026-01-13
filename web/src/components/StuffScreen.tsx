'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Sword, Zap, Shield, Gem } from 'lucide-react';
import Image from 'next/image';
import { useSoundStore } from '@/store/useSoundStore';
import { CONST_ASSETS } from '@/lib/preloader';

interface StuffScreenProps {
    onSwitchScreen: (screen: string) => void;
}

export default function StuffScreen({ onSwitchScreen }: StuffScreenProps) {
    const { playSound } = useSoundStore();

    const handleBack = () => {
        playSound(CONST_ASSETS.SOUNDS.CLICK);
        onSwitchScreen('lobby');
    };

    // Mock active equipment
    const equipmentSlots = [
        { id: 'weapon', label: 'ARME', icon: Sword, color: 'text-amber-400', img: CONST_ASSETS.IMAGES.SKILL_02 },
        { id: 'stim', label: 'STIM', icon: Zap, color: 'text-cyan-400', img: CONST_ASSETS.IMAGES.ITEM_01 },
        { id: 'outfit', label: 'TENUE', icon: Shield, color: 'text-purple-400', img: null },
        { id: 'relic', label: 'RELIQUE', icon: Gem, color: 'text-emerald-400', img: null },
    ];

    // Mock backpack (4x4)
    const backpackItems = Array.from({ length: 16 }, (_, i) => ({
        id: i,
        img: i === 0 ? CONST_ASSETS.IMAGES.SKILL_04 : null
    }));

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex flex-col h-full bg-neutral-950 text-white font-sans relative overflow-hidden"
        >
            {/* Background Decor */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.1),transparent_70%)] pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between p-6 border-b border-white/5">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 group active:scale-95 transition-transform"
                >
                    <div className="w-10 h-10 rounded-sm border border-white/10 flex items-center justify-center bg-white/5 group-active:border-cyan-500/50">
                        <ArrowLeft size={20} className="text-gray-400 group-active:text-cyan-400" />
                    </div>
                    <span className="font-black italic tracking-tighter text-sm text-gray-400 group-active:text-cyan-400 uppercase">RETOUR</span>
                </button>
                <div className="text-right">
                    <h1 className="text-xl font-black italic tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white to-gray-500 uppercase">ÉQUIPEMENT</h1>
                    <p className="text-[10px] font-black text-cyan-500/60 tracking-[0.3em] uppercase">GESTION DU STUFF</p>
                </div>
            </header>

            <main className="relative z-10 flex-1 flex flex-col p-6 gap-8 overflow-y-auto">
                {/* TOP: ACTIVE EQUIPMENT */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-linear-to-r from-transparent to-white/10" />
                        <h2 className="text-[10px] font-black text-gray-500 tracking-[0.4em] uppercase">SLOTS ACTIFS</h2>
                        <div className="h-px flex-1 bg-linear-to-l from-transparent to-white/10" />
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        {equipmentSlots.map((slot) => (
                            <div key={slot.id} className="flex flex-col items-center gap-3">
                                <div className="relative group cursor-pointer">
                                    {/* Slot Frame */}
                                    <div className="w-16 h-16 rounded-sm bg-neutral-900 border-2 border-white/10 shadow-lg flex items-center justify-center relative overflow-hidden group-active:border-cyan-500/50 transition-colors">
                                        {slot.img ? (
                                            <Image
                                                src={slot.img}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                alt={slot.label}
                                            />
                                        ) : (
                                            <slot.icon size={24} className={`${slot.color} opacity-20`} />
                                        )}
                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/5 transition-colors" />
                                    </div>
                                    {/* Slot Glow if active */}
                                    {slot.img && <div className="absolute inset-0 rounded-sm shadow-[0_0_15px_rgba(6,182,212,0.2)] pointer-events-none" />}
                                </div>
                                <span className={`text-[9px] font-black tracking-widest ${slot.img ? 'text-white' : 'text-gray-600'} uppercase`}>{slot.label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* BOTTOM: BACKPACK */}
                <section className="space-y-4 flex-1">
                    <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-linear-to-r from-transparent to-white/10" />
                        <h2 className="text-[10px] font-black text-gray-500 tracking-[0.4em] uppercase">SAC À DOS</h2>
                        <div className="h-px flex-1 bg-linear-to-l from-transparent to-white/10" />
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-md p-4 shadow-inner">
                        <div className="grid grid-cols-4 gap-3 place-items-center">
                            {backpackItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-14 h-14 rounded-sm bg-black/40 border border-white/10 flex items-center justify-center cursor-pointer hover:border-white/30 transition-colors relative group"
                                >
                                    {item.img ? (
                                        <Image
                                            src={item.img}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            className="rounded-sm"
                                            alt="inventory item"
                                        />
                                    ) : (
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/5" />
                                    )}
                                    {/* Corner Accents for premium look */}
                                    <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-white/20 group-hover:border-cyan-400/50" />
                                    <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-white/20 group-hover:border-cyan-400/50" />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Capacity Indicator */}
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-black text-gray-600 tracking-widest uppercase">CAPACITÉ</span>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-mono text-gray-400 uppercase">1 / 16</span>
                            <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="w-[6%] h-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Bottom Footer Decor */}
            <footer className="p-6 border-t border-white/5 flex justify-center">
                <div className="flex items-center gap-2 text-[9px] font-black text-gray-600 tracking-[0.3em] uppercase">
                    <div className="w-2 h-[2px] bg-gray-600/30" />
                    Ascend Protocol - Logistics Module
                    <div className="w-2 h-[2px] bg-gray-600/30" />
                </div>
            </footer>
        </motion.div>
    );
}
