// components/combat/BattleZoneBackground.tsx
"use client";

import Image from "next/image";

export default function BattleZoneBackground({
    src,
    className = "",
    scale = 1.25,
    origin = "origin-top-left",
    objectPosition = "object-left-top", // ou object-[100%_0%]
    blur = 0,
}: {
    src: string;
    className?: string;
    scale?: number;
    origin?: string;
    objectPosition?: string;
    blur?: number;
}) {
    return (
        <div className={`absolute inset-0 overflow-hidden ${className}`}>
            {/* Wrapper qui gère le zoom */}
            <div
                className={`w-full h-full ${origin}`}
                style={{
                    transform: `scale(${scale})`,
                    filter: blur ? `blur(${blur}px)` : undefined,
                }}
            >
                <Image
                    src={src}
                    alt="Combat background"
                    fill
                    className={`object-cover ${objectPosition}`}
                />
            </div>

            {/* Overlay sombre */}
            <div className="absolute inset-0 bg-black/50 pointer-events-none" />
        </div>
    );
}

/*
 src={opponentBackground}
              scale={1.5}
              origin="origin-top-left"
              objectPosition="object-[100%_0%]"
              blur={0}
*/
