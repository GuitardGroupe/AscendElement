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
            className="relative w-full overflow-hidden"
            style={{
                height,
                clipPath: outerClip,
                background: "linear-gradient(to bottom, #111, #060606)",
                filter: "drop-shadow(0 0 8px rgba(0,0,0,0.8))",
            }}
        >
            {/* CHIP DAMAGE */}
            <div
                className="absolute left-0 top-0 h-full transition-all duration-500 ease-out"
                style={{
                    width: pct(chipHp),
                    clipPath: innerClip,
                    background:
                        "linear-gradient(to right, #2a2a2a, #3a3a3a 40%, #1e1e1e)",
                    opacity: 1,
                }}
            />

            {/* TRUE HP */}
            <div
                className="absolute left-0 top-0 h-full transition-all duration-300 ease-out"
                style={{
                    width: pct(displayHp),
                    clipPath: innerClip,
                    background:
                        "linear-gradient(to right, #700000, #b30000 40%, #ff1b1b)",
                    boxShadow: "inset 0 0 8px rgba(0,0,0,0.6)",
                }}
            />

            {/* FLASH */}
            {displayHp < chipHp && (
                <div
                    className="absolute inset-0 animate-tekkenFlash pointer-events-none"
                    style={{ clipPath: innerClip }}
                />
            )}

            {/* INNER GLOW */}
            <div
                className="absolute inset-0 opacity-30 bg-linear-to-b from-transparent via-black/40 to-transparent pointer-events-none"
                style={{ clipPath: innerClip }}
            />

            {/* TOP HIGHLIGHT */}
            <div
                className="absolute top-0 left-0 w-full h-[22%] bg-white/10 opacity-[0.07] pointer-events-none"
                style={{ clipPath: innerClip }}
            />

            {/* TEXT */}
            <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white pointer-events-none">
                {displayHp}/{max}
            </div>

            <style jsx>{`
        @keyframes tekkenFlash {
          0% {
            background: rgba(255, 60, 60, 0.4);
          }
          100% {
            background: transparent;
          }
        }
      `}</style>
        </div>
    );
}
