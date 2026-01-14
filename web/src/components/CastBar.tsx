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
                className="relative w-full overflow-hidden bg-black/60 backdrop-blur-sm"
                style={{
                    height,
                    clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}
            >
                {/* BACKGROUND */}
                <div className="absolute inset-0 bg-neutral-900/80" />

                {/* TRACK */}
                <div className="absolute inset-0 bg-white/5" />

                {/* FILL */}
                <motion.div
                    className="absolute left-0 top-0 h-full flex items-center justify-end overflow-hidden"
                    style={{
                        width: pct,
                        background: `linear-gradient(90deg, ${color} 0%, white 100%)`, // Gradient to white tip
                        boxShadow: `0 0 10px ${color}`
                    }}
                    initial={false}
                    animate={progress === 100 ? {
                        opacity: [1, 0],
                        transition: { duration: 0.3 }
                    } : { opacity: 1 }}
                >
                    <div className="h-full w-4 bg-white/80 blur-xs" />
                </motion.div>

                {/* GRID OVERLAY */}
                <div className="absolute inset-0 bg-[url('/img/grid-pattern.png')] opacity-20 mix-blend-overlay" />
            </div>
        </div>
    );
}
