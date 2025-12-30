"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function SkillButton({
    img,
    size = 64,
    cooldown = 0,
    maxCooldown = 0,
    onClick,
}: {
    img: string;
    size?: number;
    cooldown?: number;
    maxCooldown?: number;
    onClick?: () => void;
}) {
    const [flashKey, setFlashKey] = useState(0);
    const [prevCooldown, setPrevCooldown] = useState(cooldown);

    // Flash when cooldown finishes
    useEffect(() => {
        if (prevCooldown > 0 && cooldown === 0) {
            setFlashKey(Date.now());
        }
        setPrevCooldown(cooldown);
    }, [cooldown, prevCooldown]);

    const isOnCooldown = cooldown > 0;

    // Fluid percent for clip-path (inverted logic for "lifting")
    // If cooldown is max, pct is 100 -> clip is 0 (veil full)
    // If cooldown is 0, pct is 0 -> clip is 100 (veil gone)
    const veilHeight = maxCooldown > 0 ? (cooldown / maxCooldown) * 100 : 0;

    return (
        <motion.div
            className="relative rounded-md overflow-hidden bg-[#0c0f14] border border-white/10 transition-all cursor-pointer"
            style={{ width: size, height: size }}
            animate={{ scale: 1, borderColor: "rgba(255,255,255,0.1)" }}
            whileTap={!isOnCooldown ? {
                scale: 0.92,
                borderColor: "rgba(255,255,255,0.4)",
                backgroundColor: "rgba(255,255,255,0.05)"
            } : {}}
            transition={{ duration: 0.1 }}
            onClick={() => !isOnCooldown && onClick?.()}
        >
            <Image
                src={img}
                fill
                alt="skill"
                className={`object-cover pointer-events-none transition-all duration-300 ${isOnCooldown ? "grayscale opacity-50" : "grayscale-0 opacity-100"}`}
            />

            {/* COOLDOWN VEIL - Smooth with CSS transition */}
            <AnimatePresence>
                {isOnCooldown && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/70 pointer-events-none flex items-center justify-center transition-[clip-path] duration-150 ease-linear"
                        style={{
                            clipPath: `inset(0 0 ${100 - veilHeight}% 0)`,
                        }}
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
            {!isOnCooldown && (
                <motion.div
                    className="absolute inset-0 border border-white/20 rounded-md pointer-events-none shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                />
            )}
        </motion.div>
    );
}
