"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

interface CharacterCardProps {
    name: string;
    symbol: string;
    img: string;
    frame: string;
    width?: number;
    height?: number;
    imageMargin?: number;
    onSelect?: () => void;
}

export default function CharacterCard({
    name,
    symbol,
    img,
    frame,
    width = 300,
    height = 420,
    imageMargin = 20,
    onSelect,
}: CharacterCardProps) {


    return (
        <div
            className="relative flex flex-col items-center justify-center"
            style={{ width, height }}
        >
            <div
                className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl"
                style={{
                    top: imageMargin,
                    bottom: imageMargin,
                    left: imageMargin,
                    right: imageMargin,
                }}
            >
                <Image
                    src={img}
                    alt={name}
                    fill
                    priority
                    className="relative z-10 object-contain select-none pointer-events-none"
                />
            </div>

            <div
                className="absolute inset-0 pointer-events-none"
                style={{ zIndex: 20 }}
            >
                <Image
                    src={frame}
                    alt="Cadre décoratif"
                    fill
                    className="object-contain"
                />
            </div>

            <div
                className="absolute bottom-14.5 left-1/2 -translate-x-1/2 
             text-center font-semibold tracking-wide text-white
             text-lg drop-shadow-[0_0_6px_rgba(120,180,255,0.9)]"
                style={{
                    zIndex: 25,
                    textShadow: `
      0 0 10px rgba(120,180,255,0.8),
      0 0 20px rgba(150,100,255,0.5),
      0 0 30px rgba(90,180,255,0.3)
    `,
                }}
            >
                {symbol}
            </div>

            {onSelect && (
                <button
                    onClick={onSelect}
                    className="absolute -bottom-2 px-5 py-2 rounded-lg bg-amber-400/90 hover:bg-amber-300/90 
                     text-black font-semibold shadow-[0_0_18px_rgba(255,191,0,0.5)] transition-all"
                    style={{ zIndex: 40 }}
                >
                    Activer {name}
                </button>
            )}
        </div>
    );
}