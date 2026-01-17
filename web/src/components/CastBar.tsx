"use client";

import { motion } from "framer-motion";

// WoW-Style Clean Cast Bar
export default function CastBar({
    progress, // 0 or 100 (Start/End)
    duration = 0, // Duration in ms
    label,
    height = 24,
    color = "#fcd34d",
}: {
    progress: number;
    duration?: number;
    label?: string;
    height?: number;
    color?: string;
}) {
    const pct = Math.max(0, Math.min(progress, 100)) + "%";

    return (
        <div className="relative w-full flex flex-col items-center justify-center">
            {/* FRAME - Metallic/Iron Border */}
            <div
                className="relative w-full bg-[#0a0a0a] rounded-[2px] border border-[#404040] shadow-[0_0_0_1px_black,0_4px_6px_rgba(0,0,0,0.5)] overflow-hidden"
                style={{ height }}
            >
                {/* BACKGROUND - Dark distinct background */}
                <div className="absolute inset-0 bg-[#151515]" />

                {/* FILL BAR - Standard WoW Yellow/Gold Texture */}
                <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-b from-[#fcd34d] to-[#d97706]"
                    style={{
                        borderRight: "1px solid rgba(255,255,255,0.4)"
                    }}
                    initial={{ width: "0%" }}
                    animate={{ width: pct }}
                    transition={{
                        duration: duration / 1000, // Convert ms to s
                        ease: "linear"
                    }}
                >
                    {/* GLOSS EFFECT (Top Half) */}
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-white/20" />

                    {/* SPARK/LEADING EDGE */}
                    <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-white opacity-80 blur-[2px] translate-x-1/2" />
                </motion.div>

                {/* TEXT LABEL - Centered, White with Shadow */}
                {label && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <span className="text-[11px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,1)] tracking-wide uppercase">
                            {label}
                        </span>
                    </div>
                )}
            </div>


        </div>
    );
}
