"use client";

import { useState, useEffect } from "react";

export default function HealthBar({
    current,
    max,
    height = 28,
    angle = 12, // angle “en pixels”
}: {
    current: number;
    max: number;
    height?: number;
    angle?: number;
}) {
    const [displayHp, setDisplayHp] = useState(current);
    const [chipHp, setChipHp] = useState(current);

    const pct = (v: number) => Math.max(0, Math.min(100, (v / max) * 100)) + "%";

    useEffect(() => {
        if (current < displayHp) {
            setDisplayHp(current);
            setTimeout(() => setChipHp(current), 250);
        } else {
            setDisplayHp(current);
            setChipHp(current);
        }
    }, [current]);

    // CLIPS IN PIXELS
    const outerClip = `polygon(${angle}px 0%, 100% 0%, calc(100% - ${angle}px) 100%, 0% 100%)`;
    const innerClip = `polygon(${angle}px 0%, 100% 0%, calc(100% - ${angle}px) 100%, 0% 100%)`;

    return (
        <div
            className="relative w-full overflow-hidden bg-black/60 backdrop-blur-sm"
            style={{
                height,
                clipPath: outerClip,
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}
        >
            {/* BACKGROUND */}
            <div className="absolute inset-0 bg-neutral-900/80" />

            {/* CHIP DAMAGE */}
            <div
                className="absolute left-0 top-0 h-full transition-all duration-500 ease-out"
                style={{
                    width: pct(chipHp),
                    clipPath: innerClip,
                    background: "rgba(255, 255, 255, 0.2)",
                }}
            />

            {/* TRUE HP */}
            <div
                className="absolute left-0 top-0 h-full transition-all duration-300 ease-out flex items-center justify-end overflow-hidden"
                style={{
                    width: pct(displayHp),
                    clipPath: innerClip,
                    background: "linear-gradient(90deg, #991b1b 0%, #dc2626 50%, #f87171 100%)",
                    boxShadow: "0 0 15px rgba(220, 38, 38, 0.4)"
                }}
            >
                <div className="h-full w-2 bg-white/20 blur-[2px]" />
            </div>

            {/* INNER GLOW BORDER */}
            <div className="absolute inset-0 border-t border-white/10 opacity-50 pointer-events-none" style={{ clipPath: innerClip }} />

            {/* GRID OVERLAY */}
            <div className="absolute inset-0 bg-[url('/img/grid-pattern.png')] opacity-10 mix-blend-overlay" />

            {/* TEXT */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[10px] font-black text-white drop-shadow-md tracking-wider">
                    {Math.ceil(displayHp)} <span className="text-gray-400 text-[8px]">/ {max}</span>
                </span>
            </div>
        </div>
    );
}
