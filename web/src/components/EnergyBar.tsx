"use client";

import { useState, useEffect } from "react";

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

    const pct = (v: number) => Math.max(0, Math.min(100, (v / max) * 100)) + "%";

    useEffect(() => {
        if (current < displayValue) {
            setDisplayValue(current);
            setTimeout(() => setChipValue(current), 250);
        } else {
            setDisplayValue(current);
            setChipValue(current);
        }
    }, [current]);

    const clip = `polygon(${angle}px 0%, 100% 0%, calc(100% - ${angle}px) 100%, 0% 100%)`;

    return (
        <div
            className="relative w-full overflow-hidden"
            style={{
                height,
                clipPath: clip,
                background: "linear-gradient(to bottom, #0a0f18, #06080d)",
                filter: "drop-shadow(0 0 10px rgba(0,0,0,0.7))",
            }}
        >
            {/* CHIP DAMAGE */}
            <div
                className="absolute left-0 top-0 h-full transition-all duration-500 ease-out"
                style={{
                    width: pct(chipValue),
                    clipPath: clip,
                    background:
                        "linear-gradient(to right, #1a2739, #223148 40%, #0b1522)",
                    opacity: 1,
                }}
            />

            {/* TRUE ENERGY */}
            <div
                className="absolute left-0 top-0 h-full transition-all duration-300 ease-out"
                style={{
                    width: pct(displayValue),
                    clipPath: clip,
                    background:
                        "linear-gradient(to right, #0040ff, #0077ff 35%, #00b3ff)",
                    boxShadow:
                        "inset 0 0 8px rgba(0,0,0,0.6), 0 0 16px rgba(0,128,255,0.4)",
                }}
            />

            {/* ENERGY ELECTRIC GLOW */}
            <div
                className="absolute inset-0 pointer-events-none opacity-30 animate-energyPulse"
                style={{
                    clipPath: clip,
                    background:
                        "radial-gradient(circle at 50% 50%, rgba(0,150,255,0.5), rgba(0,150,255,0) 60%)",
                }}
            />

            {/* TOP HIGHLIGHT */}
            <div
                className="absolute top-0 left-0 w-full h-[20%] bg-white/10 opacity-[0.07] pointer-events-none"
                style={{ clipPath: clip }}
            />

            {/* TEXT */}
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-white pointer-events-none">
                {Math.floor(displayValue)}/{Math.floor(max)}
            </div>

            <style jsx>{`
        @keyframes energyPulse {
          0% {
            opacity: 0.15;
          }
          50% {
            opacity: 0.35;
          }
          100% {
            opacity: 0.15;
          }
        }

        @keyframes energyArcs {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: -200% 0%;
          }
        }
      `}</style>
            {/* Légère texture de mouvement interne (sans glow) */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.08) 40%, transparent 80%)",
                    backgroundSize: "200% 100%",
                    animation: "castBarSweep 1.4s linear infinite",
                    mixBlendMode: "screen",
                }}
            />

            <style jsx>{`
        @keyframes castBarSweep {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: -200% 0%;
          }
        }
      `}</style>
        </div>
    );
}
