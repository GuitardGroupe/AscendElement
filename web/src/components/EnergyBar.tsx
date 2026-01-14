"use client";

import { useState, useEffect, useRef } from "react";

export default function EnergyBar({
    current,
    max,
    height = 22,
    angle = 11,
}: {
    current: number;
    max: number;
    height?: number;
    angle?: number;
}) {
    const [displayValue, setDisplayValue] = useState(current);
    const [chipValue, setChipValue] = useState(current);
    const prevCurrent = useRef(current);

    const pct = (v: number) => Math.max(0, Math.min(100, (v / max) * 100)) + "%";

    useEffect(() => {
        if (current < prevCurrent.current) {
            setDisplayValue(current);
            setTimeout(() => setChipValue(current), 250);
        } else {
            setDisplayValue(current);
            setChipValue(current);
        }
        prevCurrent.current = current;
    }, [current]);

    const clip = `polygon(${angle}px 0%, 100% 0%, calc(100% - ${angle}px) 100%, 0% 100%)`;

    return (
        <div
            className="relative w-full overflow-hidden bg-black/60 backdrop-blur-sm"
            style={{
                height,
                clipPath: clip,
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}
        >
            {/* BACKGROUND */}
            <div className="absolute inset-0 bg-neutral-900/80" />

            {/* CHIP DAMAGE */}
            <div
                className="absolute left-0 top-0 h-full transition-all duration-500 ease-out"
                style={{
                    width: pct(chipValue),
                    clipPath: clip,
                    background: "rgba(255, 255, 255, 0.1)",
                }}
            />

            {/* TRUE ENERGY */}
            <div
                className="absolute left-0 top-0 h-full transition-all duration-300 ease-out flex items-center justify-end overflow-hidden"
                style={{
                    width: pct(displayValue),
                    clipPath: clip,
                    background: "linear-gradient(90deg, #0040ff 0%, #0077ff 50%, #00b3ff 100%)",
                    boxShadow: "0 0 15px rgba(0, 128, 255, 0.4)"
                }}
            >
                <div className="h-full w-2 bg-white/20 blur-[2px]" />
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

            {/* INNER GLOW BORDER */}
            <div className="absolute inset-0 border-t border-white/10 opacity-50 pointer-events-none" style={{ clipPath: clip }} />

            {/* GRID OVERLAY */}
            <div className="absolute inset-0 bg-[url('/img/grid-pattern.png')] opacity-10 mix-blend-overlay" />

            {/* TEXT */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[10px] font-black text-white drop-shadow-md tracking-wider">
                    {Math.floor(displayValue)} <span className="text-gray-400 text-[8px]">/ {Math.floor(max)}</span>
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
