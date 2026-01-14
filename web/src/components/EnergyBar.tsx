"use client";

import { useState, useEffect } from "react";

export default function EnergyBar({
    current,
    max,
    height = 22,
}: {
    current: number;
    max: number;
    height?: number;
}) {
    const [chipValue, setChipValue] = useState(current);

    const pct = (v: number) => Math.max(0, Math.min(100, (v / max) * 100)) + "%";

    // Derived state for Energy Gain: Immediate update
    if (current > chipValue) {
        setChipValue(current);
    }

    useEffect(() => {
        if (current < chipValue) {
            // Decayed: delayed Chip update
            const timer = setTimeout(() => setChipValue(current), 500);
            return () => clearTimeout(timer);
        }
    }, [current, chipValue]);

    return (
        <div
            className="relative w-full overflow-hidden bg-black/60 backdrop-blur-sm rounded-sm border border-white/5 shadow-inner"
            style={{ height }}
        >
            {/* BACKGROUND */}
            <div className="absolute inset-0 bg-neutral-900/80" />

            {/* CHIP LOSS */}
            <div
                className="absolute left-0 top-0 h-full transition-all duration-500 ease-out bg-white/20"
                style={{ width: pct(chipValue) }}
            />

            {/* TRUE ENERGY */}
            <div
                className="absolute left-0 top-0 h-full transition-all duration-300 ease-out flex items-center justify-end overflow-hidden"
                style={{
                    width: pct(current),
                    background: "linear-gradient(90deg, #0040ff 0%, #0077ff 50%, #00b3ff 100%)",
                    boxShadow: "0 0 15px rgba(0, 128, 255, 0.4)"
                }}
            >
                <div className="h-full w-2 bg-white/30 blur-[2px]" />
            </div>

            {/* ENERGY ARCS ANIMATION */}
            <div
                className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen"
                style={{
                    backgroundImage: "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.2) 40%, transparent 80%)",
                    backgroundSize: "200% 100%",
                    animation: "castBarSweep 2s linear infinite",
                }}
            />

            {/* INNER HIGHLIGHT */}
            <div className="absolute inset-x-0 top-0 h-px bg-white/20 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-black/40 pointer-events-none" />

            {/* TEXT */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <span className="text-[10px] font-black text-white drop-shadow-md tracking-wider">
                    {Math.floor(current)} <span className="text-gray-400 text-[8px]">/ {Math.floor(max)}</span>
                </span>
            </div>

            <style jsx>{`
        @keyframes castBarSweep {
          0% {
            background-position: 100% 0%;
          }
          100% {
            background-position: -100% 0%;
          }
        }
      `}</style>
        </div>
    );
}
