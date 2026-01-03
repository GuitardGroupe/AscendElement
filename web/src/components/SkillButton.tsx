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
    onClick,
}: {
    img: string;
    size?: number;
    cooldown?: number;
    maxCooldown?: number;
    energyCost?: number;
    currentEnergy?: number;
    onClick?: () => void;
}) {
    const [flashKey, setFlashKey] = useState(0);
    const [prevPropCooldown, setPrevPropCooldown] = useState(cooldown);

    // Sync state during render (React optimization to avoid cascading renders)
    if (cooldown !== prevPropCooldown) {
        setPrevPropCooldown(cooldown);
        if (prevPropCooldown > 0 && cooldown === 0) {
            setFlashKey(prev => prev + 1);
        }
    }

    const isOnCooldown = cooldown > 0;
    const isLowEnergy = currentEnergy < energyCost;
    const isDisabled = isOnCooldown || isLowEnergy;

    const veilHeight = maxCooldown > 0 ? (cooldown / maxCooldown) * 100 : 0;

    return (
        <motion.div
            className="relative rounded-md overflow-hidden bg-[#0c0f14] border border-white/10 transition-all cursor-pointer"
            style={{
                width: size,
                height: size,
                boxShadow: "0 4px 12px rgba(0,0,0,0.6)"
            }}
            animate={{ scale: 1, borderColor: "rgba(255,255,255,0.1)" }}
            whileTap={!isDisabled ? {
                scale: 0.92,
                borderColor: "rgba(255,255,255,0.4)",
                backgroundColor: "rgba(255,255,255,0.05)"
            } : {}}
            transition={{ duration: 0.1 }}
            onClick={() => !isDisabled && onClick?.()}
        >
            <Image
                src={img}
                fill
                alt="skill"
                className={`object-cover pointer-events-none transition-all duration-300 ${isDisabled ? "grayscale opacity-50" : "grayscale-0 opacity-100"}`}
            />

            {/* COOLDOWN VEIL - Smooth fade and clip-path */}
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

            {/* LOW ENERGY VEIL - Reddish tint */}
            <AnimatePresence>
                {!isOnCooldown && isLowEnergy && (
                    <motion.div
                        key="energy-veil"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-red-900/30 pointer-events-none"
                    />
                )}
            </AnimatePresence>

            {/* ENERGY COST */}
            {energyCost > 0 && (
                <div className="absolute top-0 right-0 px-1 bg-blue-900/80 rounded-bl-md border-l border-b border-blue-400/30 z-20">
                    <span className={`text-[10px] font-bold ${isLowEnergy ? "text-red-400" : "text-blue-200"}`}>
                        {energyCost}
                    </span>
                </div>
            )}

            {/* TIMER TEXT - Instant disappearance */}
            <AnimatePresence>
                {isOnCooldown && (
                    <motion.div
                        key="timer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0 } }} // Immediate disappearance
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                    >
                        <span className="text-[11px] font-bold text-white/90 tabular-nums drop-shadow-md">
                            {(cooldown / 1000).toFixed(1)}s
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* READY FLASH */}
            <AnimatePresence>
                {flashKey > 0 && (
                    <motion.div
                        key={flashKey}
                        className="absolute inset-0 bg-white pointer-events-none z-10"
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                )}
            </AnimatePresence>

            {/* GLOW WHEN READY */}
            {!isDisabled && (
                <motion.div
                    className="absolute inset-0 border border-white/20 rounded-md pointer-events-none shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                />
            )}
        </motion.div>
    );
}
