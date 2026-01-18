"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function SkillButton({
    img,
    size = 64,
    cooldown = 0,
    maxCooldown = 0,
    energyCost = 0,
    currentEnergy = 0,
    isCasting = false,
    anySkillCasting = false,
    usages = undefined,
    showTimer = true,
    onClick,
}: {
    img: string;
    size?: number;
    cooldown?: number;
    maxCooldown?: number;
    energyCost?: number;
    currentEnergy?: number;
    isCasting?: boolean;
    anySkillCasting?: boolean;
    usages?: number;
    showTimer?: boolean;
    onClick?: () => void;
}) {
    const [flashKey, setFlashKey] = useState(0);
    const [prevPropCooldown, setPrevPropCooldown] = useState(cooldown);
    const [dynamicMax, setDynamicMax] = useState(0);

    // Sync state during render
    if (cooldown !== prevPropCooldown) {
        setPrevPropCooldown(cooldown);
        if (prevPropCooldown > 0 && cooldown === 0) {
            setFlashKey(prev => prev + 1);
            setDynamicMax(0);
        }
        if (cooldown > dynamicMax) {
            setDynamicMax(cooldown);
        }
    }

    const isOnCooldown = cooldown > 0;
    const isLowEnergy = currentEnergy < energyCost;
    const isOutOfUsages = usages !== undefined && usages <= 0;
    const isBlockedByCasting = anySkillCasting && !isCasting;

    // We allow interaction if it's casting (to cancel) OR if it's available
    const isDisabled = isBlockedByCasting || (!isCasting && (isOnCooldown || isLowEnergy || isOutOfUsages));

    // Use dynamicMax to ensure the veil is always relative to the current cooldown duration
    const currentMax = dynamicMax > 0 ? dynamicMax : maxCooldown;
    const veilHeight = currentMax > 0 ? (cooldown / currentMax) * 100 : 0;

    return (
        <motion.div
            className="group relative cursor-pointer"
            style={{
                width: size,
                height: size,
            }}
            whileTap={!isDisabled || isCasting ? { scale: 0.92 } : {}}
            onClick={() => (isCasting || !isDisabled) && onClick?.()}
        >
            {/* OUTER RING / BORDER */}
            <div className={`absolute inset-0 bg-neutral-900 border transition-all duration-300 rounded-2xl shadow-lg
                ${isDisabled ? 'border-white/5 opacity-80' : 'border-white/10'}`}
            />

            {/* INNER CONTAINER (Image & Overlays) */}
            <div className="absolute inset-1 bg-neutral-800 rounded-xl overflow-hidden">
                <Image
                    src={img}
                    fill
                    alt="skill"
                    className={`object-cover transition-all duration-300 
                        ${isDisabled ? "grayscale opacity-50" : "grayscale-0 opacity-100"}`}
                />

                {/* COOLDOWN VEIL */}
                <AnimatePresence>
                    {isOnCooldown && (
                        <motion.div
                            key="veil"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 bg-black/70 pointer-events-none transition-[clip-path] duration-150 ease-linear"
                            style={{
                                clipPath: `inset(0 0 ${100 - veilHeight}% 0)`,
                            }}
                        />
                    )}
                </AnimatePresence>

                {/* LOW ENERGY VEIL */}
                <AnimatePresence>
                    {!isOnCooldown && isLowEnergy && (
                        <motion.div
                            key="energy-veil"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-red-900/40 pointer-events-none"
                        />
                    )}
                </AnimatePresence>

                {/* BLOCK BY CASTING VEIL */}
                <AnimatePresence>
                    {isBlockedByCasting && (
                        <motion.div
                            key="casting-block-veil"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 pointer-events-none z-20"
                        />
                    )}
                </AnimatePresence>

                {/* TIMER TEXT */}
                <AnimatePresence>
                    {isOnCooldown && showTimer && (
                        <motion.div
                            key="timer"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0 } }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                        >
                            <span className="text-[11px] font-black text-white/90 tabular-nums drop-shadow-md">
                                {(cooldown / 1000).toFixed(1)}s
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* CANCEL OVERLAY */}
                <AnimatePresence>
                    {isCasting && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-red-600/60 backdrop-blur-[1px] flex flex-col items-center justify-center pointer-events-none z-30"
                        >
                            <span className="text-[9px] font-black text-white leading-none tracking-widest shadow-sm">CANCEL</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* READY FLASH */}
                <AnimatePresence>
                    {flashKey > 0 && (
                        <motion.div
                            key={flashKey}
                            className="absolute inset-0 bg-white pointer-events-none z-40"
                            initial={{ opacity: 0.8 }}
                            animate={{ opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* --- BADGES (On Outer Layer) --- */}

            {/* ENERGY COST (Top Right) */}
            {energyCost > 0 && (
                <div className="absolute -top-1 -right-1 z-30">
                    <div className={`w-5 h-5 rounded-full border border-neutral-900 flex items-center justify-center shadow-md bg-neutral-800`}>
                        <span className={`text-[9px] font-black ${isLowEnergy ? "text-red-400" : "text-cyan-400"}`}>
                            {energyCost}
                        </span>
                    </div>
                </div>
            )}

            {/* USAGES COUNT (Bottom Right) */}
            {usages !== undefined && (
                <div className="absolute -bottom-1 -right-1 z-30">
                    <div className={`w-5 h-5 rounded-full border border-neutral-900 flex items-center justify-center shadow-md bg-neutral-800`}>
                        <span className={`text-[9px] font-black ${isOutOfUsages ? "text-gray-500" : "text-white"}`}>
                            {usages}
                        </span>
                    </div>
                </div>
            )}

            {/* GLOW WHEN READY (Outer) */}
            {!isDisabled && !isCasting && (
                <div className="absolute inset-0 rounded-2xl pointer-events-none shadow-[0_0_15px_rgba(6,182,212,0.05)] transition-shadow duration-300" />
            )}
        </motion.div>
    );
}
