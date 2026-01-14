"use client";

import { motion } from "framer-motion";

export default function CastBar({
    progress,
    label, // 0 → 100
    height = 12,
    color = "#4db8ff",
}: {
    progress: number;
    label?: string;
    height?: number;
    color?: string;
}) {
    const pct = Math.max(0, Math.min(progress, 100)) + "%";

    return (
        <div className="flex flex-col items-center gap-1 w-full">
            {label && (
                <div className="text-[9px] uppercase font-black text-cyan-400 tracking-[0.2em] animate-pulse">
                    {label}
                </div>
            )}
            <div
                className="relative w-full overflow-hidden bg-black/60 backdrop-blur-sm rounded-full border border-white/10 shadow-inner"
                style={{ height }}
            >
                {/* BACKGROUND */}
                <div className="absolute inset-0 bg-neutral-900/80" />

                {/* TRACK */}
                <div className="absolute inset-0 bg-white/5" />

                {/* FILL */}
                <motion.div
                    className="absolute left-0 top-0 h-full flex items-center justify-end overflow-hidden rounded-full"
                    style={{
                        width: pct,
                        background: `linear-gradient(90deg, ${color} 0%, white 100%)`,
                        boxShadow: `0 0 15px ${color}`
                    }}
                    initial={false}
                    animate={progress === 100 ? {
                        opacity: [1, 0],
                        transition: { duration: 0.3 }
                    } : { opacity: 1 }}
                >
                    <div className="h-full w-4 bg-white/80 blur-xs" />
                </motion.div>

                {/* INNER HIGHLIGHT */}
                <div className="absolute inset-x-0 top-0 h-px bg-white/20 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-black/40 pointer-events-none" />
            </div>
        </div>
    );
}
