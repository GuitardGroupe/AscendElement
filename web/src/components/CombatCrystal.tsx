import { CONST_ASSETS } from '@/lib/preloader';

const getCrystalImage = (hp: number, maxHp: number) => {
    const ratio = hp / maxHp;
    if (ratio <= 0.5) return CONST_ASSETS.IMAGES.FIGHT_CRYSTAL_DAMAGED;
    return CONST_ASSETS.IMAGES.FIGHT_CRYSTAL_INTACT;
};

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { flushSync } from "react-dom";
import { useState, useEffect } from "react";
import DamagePop, { DamageEvent } from "@/components/DamagePop";

export default function CombatCrystal({
    hp,
    maxHp,
    color,
    lastHitTimestamp,
    damageEvents,
    onDamageDone,
}: {
    hp: number;
    maxHp: number;
    color: string;
    lastHitTimestamp: any;
    damageEvents: DamageEvent[];
    onDamageDone: (id: string) => void;
}) {
    const src = getCrystalImage(hp, maxHp);
    const [hitEffect, setHitEffect] = useState(false);

    useEffect(() => {
        if (!lastHitTimestamp) return;
        flushSync(() => {
            setHitEffect(true);
        });
        const timeout = setTimeout(() => setHitEffect(false), 400);
        return () => clearTimeout(timeout);
    }, [lastHitTimestamp]);

    return (
        <div className="w-40 h-40 relative flex items-center justify-center">
            <motion.div
                className={`flex items-center justify-center`}
                // 🔥 Véritable secousse avec translation X/Y
                animate={
                    hitEffect
                        ? {
                            x: [0, -10, 8, -6, 4, 0],
                            y: [0, 4, -4, 3, -2, 0],
                            scale: [1, 1.1, 0.95, 1],
                        }
                        : { x: 0, y: 0, scale: 1 }
                }
                transition={{ duration: 0.4, ease: "easeInOut" }}
            >
                {/* === CRISTAL === */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <Image
                        src={src}
                        alt="Combat crystal"
                        width={150}
                        height={150}
                        className="transition-all duration-300"
                    />
                    {/* Glow énergétique normal */}
                    <motion.div
                        className="absolute inset-0 blur-lg rounded-full"
                        style={{
                            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                            mixBlendMode: "screen",
                        }}
                        animate={{ opacity: [0.5, 0.9, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />

                    {/* ⚡️ Onde de choc blanche */}
                    <AnimatePresence>
                        {hitEffect && (
                            <motion.div
                                className="absolute inset-0 rounded-full blur-xl pointer-events-none"
                                style={{
                                    background:
                                        "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 40%, transparent 70%)",
                                    mixBlendMode: "screen",
                                }}
                                initial={{ opacity: 0.9, scale: 0.6 }}
                                animate={{ opacity: 0, scale: 2 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {hitEffect && (
                            <motion.div
                                className="absolute inset-0 rounded-full blur-2xl pointer-events-none"
                                style={{
                                    background: `radial-gradient(circle, ${"#ff0000"} 0%, transparent 60%)`,
                                    mixBlendMode: "screen",
                                }}
                                initial={{ opacity: 0.8, scale: 0.8 }}
                                animate={{ opacity: 0, scale: 1.4 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
            {/* Dégâts POP */}
            <AnimatePresence>
                {damageEvents.map((ev) => (
                    <DamagePop key={ev.id} event={ev} onDone={onDamageDone} />
                ))}
            </AnimatePresence>
        </div>
    );
}
