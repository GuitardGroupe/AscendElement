"use client";

import { useState, useEffect } from "react";

export default function HealthBar({
    current,
    max,
    height = 28,
}: {
    current: number;
    max: number;
    height?: number;
}) {
    const [chipHp, setChipHp] = useState(current);

    const pct = (v: number) => Math.max(0, Math.min(100, (v / max) * 100)) + "%";

    // Derived state for Healing: Immediate update
    if (current > chipHp) {
        setChipHp(current);
    }

    useEffect(() => {
        if (current < chipHp) {
            // Damage taken: delayed Chip update
            const timer = setTimeout(() => setChipHp(current), 500);
            return () => clearTimeout(timer);
        }
    }, [current, chipHp]);

    return (
        <div
            className="relative w-full overflow-hidden bg-black/60 backdrop-blur-sm rounded-sm border border-white/5 shadow-inner"
            style={{ height }}
        >
            {/* BACKGROUND */}
            <div className="absolute inset-0 bg-neutral-900/80" />

            {/* CHIP DAMAGE */}
            <div
                className="absolute left-0 top-0 h-full transition-all duration-500 ease-out bg-white/20"
                style={{ width: pct(chipHp) }}
            />

            {/* TRUE HP */}
            <div
                className="absolute left-0 top-0 h-full transition-all duration-300 ease-out flex items-center justify-end overflow-hidden"
                style={{
                    width: pct(current),
                    background: "linear-gradient(90deg, #991b1b 0%, #dc2626 50%, #f87171 100%)",
                    boxShadow: "0 0 20px rgba(220, 38, 38, 0.5)"
                }}
            >
                <div className="h-full w-2 bg-white/30 blur-[2px]" />
            </div>

            {/* INNER HIGHLIGHT */}
            <div className="absolute inset-x-0 top-0 h-px bg-white/20 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-black/40 pointer-events-none" />

            {/* TEXT */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <span className="text-[10px] font-black text-white drop-shadow-md tracking-wider">
                    {Math.ceil(current)} <span className="text-white text-[8px]">/ {max}</span>
                </span>
            </div>
        </div>
    );
}
