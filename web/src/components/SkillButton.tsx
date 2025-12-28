"use client";

import { useEffect, useState } from "react";
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
    keybind,
}: {
    img: string;
    size?: number;
    cooldown?: number;
    maxCooldown?: number;
    energyCost?: number;
    currentEnergy?: number;
    onClick?: () => void;
    keybind?: string;
}) {
    const [justReady, setJustReady] = useState(false);
    const [lastCooldown, setLastCooldown] = useState(cooldown);

    const pct = maxCooldown > 0 ? (cooldown / maxCooldown) * 100 : 0;

    const notEnoughEnergy = currentEnergy < energyCost;
    const isReady = cooldown <= 0 && !notEnoughEnergy;

    // Detect when cooldown finishes → flash animation
    useEffect(() => {
        if (lastCooldown > 0 && cooldown === 0) {
            setJustReady(true);
            setTimeout(() => setJustReady(false), 400);
        }
        setLastCooldown(cooldown);
    }, [cooldown, lastCooldown]);

    return (
        <motion.div
            className={`relative rounded-md overflow-hidden bg-[#0c0f14] border transition-all ${notEnoughEnergy ? "border-[#1c1c1c]" : "border-[#1c2025]"
                }`}
            style={{ width: size, height: size }}
            whileTap={!isReady ? {} : { scale: 0.9 }}
            onClick={() => isReady && onClick?.()}
        >
            {/* SKILL IMAGE */}
            <Image
                src={img}
                fill
                alt="skill"
                className="object-cover pointer-events-none"
            />

            {/* DARKEN IF NOT ENOUGH ENERGY */}
            {notEnoughEnergy && <div className="absolute inset-0 bg-black/50" />}

            {/* COOLDOWN VEIL (slider UP) */}
            {cooldown > 0 && (
                <div
                    className="absolute inset-0 bg-black/60 transition-all duration-80 ease-linear"
                    style={{
                        clipPath: `inset(${pct}% 0 0 0)`,
                    }}
                />
            )}

            {/* READY GLOW (subtle pulsing when ready) */}
            {isReady && (
                <motion.div
                    className="absolute inset-0 rounded-md pointer-events-none"
                    style={{ boxShadow: "0 0 12px rgba(0, 200, 255, 0.35)" }}
                    animate={{ opacity: [0.25, 0.6, 0.25] }}
                    transition={{ repeat: Infinity, duration: 1.6 }}
                />
            )}

            {/* READY FLASH (when cooldown finishes) */}
            <AnimatePresence>
                {justReady && (
                    <motion.div
                        className="absolute inset-0 bg-white/80 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.9 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                    />
                )}
            </AnimatePresence>

            {/* SHOCKWAVE ON PRESS */}
            <AnimatePresence>
                {justReady && (
                    <motion.div
                        className="absolute inset-0 rounded-full pointer-events-none"
                        initial={{ scale: 0.4, opacity: 0.5 }}
                        animate={{ scale: 1.8, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        style={{
                            background: "radial-gradient(circle, white, transparent)",
                        }}
                    />
                )}
            </AnimatePresence>

            {/* KEYBIND */}
            {keybind && (
                <div className="absolute bottom-0 right-0 text-[9px] px-1 py-[1px] bg-black/70 text-white/80 rounded-tl pointer-events-none">
                    {keybind}
                </div>
            )}
        </motion.div>
    );
}
