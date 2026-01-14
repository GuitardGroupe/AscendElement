'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Skull, Swords, Check } from 'lucide-react';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useSoundStore } from '@/store/useSoundStore';
import { useAdventureStore } from '@/store/useAdventureStore';
import { CONST_ASSETS } from '@/lib/preloader';
import { monsters, monstersSkills } from '@/lib/monsters';
import Image from 'next/image';

interface MapScreenProps {
    onSwitchScreen: (screen: string) => void;
}

const CELL_SIZE = 100;
const GRID_SIZE = 20; // 20x20 grid
const START_X = 10;
const START_Y = 10;

export default function MapScreen({ onSwitchScreen }: MapScreenProps) {
    const { playSound } = useSoundStore();
    const {
        mode,
        solo,
        coop,
        setCurrentNode,
        markAsVisited,
        addLink
    } = useAdventureStore();

    const { currentNodeId, visitedNodes, defeatedNodes, links } = mode === 'solo' ? solo : coop;

    const viewportRef = useRef<HTMLDivElement>(null);
    const [showMonsterDetails, setShowMonsterDetails] = useState(false);
    const [dimensions, setDimensions] = useState({ w: 390, h: 768 });

    useEffect(() => {
        if (!viewportRef.current) return;
        const updateDims = () => {
            if (viewportRef.current) {
                setDimensions({
                    w: viewportRef.current.offsetWidth,
                    h: viewportRef.current.offsetHeight
                });
            }
        };
        const observer = new ResizeObserver(updateDims);
        observer.observe(viewportRef.current);
        updateDims();
        return () => observer.disconnect();
    }, []);

    // RADIUS HELPER
    const getRadius = (id: string) => {
        const [x, y] = id.split('-').map(Number);
        return Math.max(Math.abs(x - START_X), Math.abs(y - START_Y));
    };

    // GENERATE CANDIDATES
    const candidates = useMemo(() => {
        // Rule: current monster must be defeated to see candidates
        if (!defeatedNodes.includes(currentNodeId)) return [];

        const [cx, cy] = currentNodeId.split('-').map(Number);
        const currentRadius = getRadius(currentNodeId);

        const adj = [
            { x: cx + 1, y: cy },
            { x: cx - 1, y: cy },
            { x: cx, y: cy + 1 },
            { x: cx, y: cy - 1 },
        ];

        return adj
            .map(c => `${c.x}-${c.y}`)
            .filter(id => {
                const alreadyVisited = visitedNodes.includes(id);
                const r = getRadius(id);
                // Rule: must be N or N+1 radius
                const validRadius = r === currentRadius || r === currentRadius + 1;
                return !alreadyVisited && validRadius;
            });
    }, [currentNodeId, visitedNodes, defeatedNodes]);

    const handleNodeClick = (id: string, isCandidate: boolean) => {
        if (isCandidate) {
            playSound(CONST_ASSETS.SOUNDS.SWITCH);
            addLink(currentNodeId, id);
            markAsVisited(id);
            setCurrentNode(id);
        } else if (id === currentNodeId) {
            // Only show details if NOT defeated
            if (!defeatedNodes.includes(id)) {
                playSound(CONST_ASSETS.SOUNDS.CLICK);
                setShowMonsterDetails(true);
            }
        }
    };

    const handleBack = () => {
        playSound(CONST_ASSETS.SOUNDS.CLICK);
        onSwitchScreen('adventure');
    };

    const handleStartCombat = () => {
        playSound(CONST_ASSETS.SOUNDS.ACCEPTATION);
        onSwitchScreen('fight');
    };

    // CALCULATE MAP CENTER OFFSET
    const [cx, cy] = currentNodeId.split('-').map(Number);
    const mapOffsetX = dimensions.w / 2 - (cx * CELL_SIZE + CELL_SIZE / 2);
    const mapOffsetY = dimensions.h / 2 - (cy * CELL_SIZE + CELL_SIZE / 2);

    const monster = monsters[0];

    return (
        <div ref={viewportRef} className="flex flex-col h-full bg-neutral-950 text-white font-sans relative overflow-hidden">
            <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-6 bg-linear-to-b from-black/80 to-transparent pointer-events-none">
                <button onClick={handleBack} className="flex items-center gap-2 group active:scale-95 transition-transform pointer-events-auto">
                    <div className="w-10 h-10 rounded-sm border border-white/10 flex items-center justify-center bg-white/5">
                        <ArrowLeft size={20} className="text-gray-400 group-active:text-cyan-400" />
                    </div>
                    <span className="font-black italic tracking-tighter text-sm text-gray-400 group-active:text-cyan-400 uppercase">RETOUR</span>
                </button>
                <div className="text-right">
                    <h1 className="text-xl font-black italic tracking-tighter uppercase text-cyan-400">CARTE D&apos;AVENTURE</h1>
                    <p className="text-[9px] font-black text-white/40 tracking-[0.3em] uppercase">RÉGION: INFRA-SYSTEME</p>
                </div>
            </header>

            <motion.div
                className="absolute top-0 left-0"
                style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
                animate={{ x: mapOffsetX, y: mapOffsetY }}
                transition={{ type: 'spring', damping: 25, stiffness: 100 }}
            >
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`, backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px` }} />

                <svg className="absolute inset-0 pointer-events-none" width={GRID_SIZE * CELL_SIZE} height={GRID_SIZE * CELL_SIZE}>
                    {links.map((link, i) => {
                        const [fx, fy] = link.from.split('-').map(Number);
                        const [tx, ty] = link.to.split('-').map(Number);
                        return (
                            <motion.line
                                key={`link-${i}`}
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                x1={fx * CELL_SIZE + CELL_SIZE / 2}
                                y1={fy * CELL_SIZE + CELL_SIZE / 2}
                                x2={tx * CELL_SIZE + CELL_SIZE / 2}
                                y2={ty * CELL_SIZE + CELL_SIZE / 2}
                                stroke="rgba(6, 182, 212, 0.5)"
                                strokeWidth="3"
                                strokeDasharray="4 4"
                            />
                        );
                    })}
                </svg>

                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                    const gx = i % GRID_SIZE;
                    const gy = Math.floor(i / GRID_SIZE);
                    const id = `${gx}-${gy}`;
                    const isVisited = visitedNodes.includes(id);
                    const isActive = id === currentNodeId;
                    const isCandidate = candidates.includes(id);
                    const isDefeated = defeatedNodes.includes(id);

                    if (!isVisited && !isCandidate) return null;

                    return (
                        <motion.div
                            key={id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute flex items-center justify-center cursor-pointer z-20"
                            style={{ left: gx * CELL_SIZE, top: gy * CELL_SIZE, width: CELL_SIZE, height: CELL_SIZE }}
                            onClick={() => handleNodeClick(id, isCandidate)}
                        >
                            <div className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${isActive
                                ? isDefeated ? 'bg-emerald-500/20 border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'bg-cyan-500 shadow-[0_0_35px_rgba(6,182,212,1)] scale-110 border-2 border-white'
                                : isVisited
                                    ? isDefeated ? 'bg-emerald-900/40 border border-emerald-500/30' : 'bg-cyan-900/40 border border-cyan-500/30'
                                    : 'bg-white/5 border border-white/20 hover:border-cyan-400/50 hover:bg-white/10'
                                }`}>
                                {isActive ? (
                                    isDefeated ? (
                                        <Check size={28} className="text-emerald-500" />
                                    ) : (
                                        <Skull size={28} className="text-white animate-pulse" />
                                    )
                                ) : isCandidate ? (
                                    <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-ping" />
                                ) : isDefeated ? (
                                    <Check size={16} className="text-emerald-500/60" />
                                ) : (
                                    <div className="w-2 h-2 rounded-full bg-cyan-500/40" />
                                )}

                                {(isActive || isCandidate) && (
                                    <div className={`absolute inset-0 rounded-full border border-dashed ${isDefeated ? 'border-emerald-500/30' : 'border-cyan-400/30'} animate-[spin_8s_linear_infinite] ${isActive ? 'scale-150' : 'scale-125'}`} />
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            <AnimatePresence>
                {showMonsterDetails && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 30 }}
                            className="w-full max-w-sm bg-neutral-900 border border-white/10 rounded-sm overflow-hidden shadow-2xl relative"
                        >
                            {/* Cinematic Background Image */}
                            <div className="absolute inset-0 z-0 opacity-40">
                                <Image src={monster.img} fill style={{ objectFit: 'cover' }} alt="monster-bg" />
                                <div className="absolute inset-0 bg-linear-to-b from-black/20 via-neutral-900/60 to-neutral-900" />
                            </div>

                            {/* Header / Level Badge */}
                            <div className="relative z-10 px-6 pt-8 pb-4 flex justify-between items-start">
                                <div>
                                    <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none drop-shadow-lg">{monster.name}</h2>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-xs tracking-widest uppercase">CRITIQUE</span>
                                        <span className="text-[10px] font-black text-cyan-400 tracking-[0.2em] uppercase">LEVEL {monster.level}</span>
                                    </div>
                                </div>
                                <button onClick={() => setShowMonsterDetails(false)} className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center border border-white/10 active:scale-95 transition-transform backdrop-blur-sm">
                                    <ArrowLeft size={20} className="rotate-90 text-gray-400" />
                                </button>
                            </div>

                            {/* Body Content */}
                            <div className="relative z-10 p-6 pt-2 space-y-6">
                                {/* Description Box */}
                                <div className="p-4 bg-white/5 border-l-2 border-cyan-500 rounded-r-sm backdrop-blur-xs">
                                    <p className="text-xs text-gray-400 leading-relaxed italic">{monster.description}</p>
                                </div>

                                {/* Stats & Skills */}
                                <div className="space-y-4">
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 bg-white/5 rounded-sm border border-white/5 flex flex-col items-center">
                                            <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-1">UNITES PV</p>
                                            <p className="text-xl font-mono font-black text-red-500">{monster.stat_hp}</p>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-sm border border-white/5 flex flex-col items-center">
                                            <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-1">NIVEAU DÉGÂTS</p>
                                            <p className="text-xl font-mono font-black text-orange-500">HAUT</p>
                                        </div>
                                    </div>

                                    {/* Skills List */}
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black text-gray-500 tracking-[0.3em] uppercase ml-1">CAPACITÉS ACTIVES</p>
                                        <div className="flex flex-wrap gap-2">
                                            {monster.skills.map(skillId => {
                                                const skill = monstersSkills.find(s => s.id === skillId);
                                                return (
                                                    <div key={skillId} className="px-3 py-1.5 bg-cyan-950/40 border border-cyan-500/30 rounded-sm flex items-center gap-2">
                                                        <Swords size={12} className="text-cyan-400" />
                                                        <span className="text-[10px] font-black text-cyan-100 uppercase tracking-tighter">{skill?.name || 'Inconnu'}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <button onClick={handleStartCombat} className="w-full py-4 group bg-linear-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 active:scale-95 transition-all rounded-sm flex items-center justify-center gap-3 shadow-[0_4px_20px_rgba(6,182,212,0.4)] relative overflow-hidden">
                                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    <Swords size={20} className="text-white drop-shadow-md" />
                                    <span className="font-black italic tracking-widest text-sm text-white drop-shadow-md">LANCER L&apos;ASSAUT</span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
