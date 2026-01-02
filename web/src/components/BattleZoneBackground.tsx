// components/combat/BattleZoneBackground.tsx
"use client";

import Image from "next/image";

export default function BattleZoneBackground({
    src,
    className = "",
    scale = 1.25,
    origin = "origin-top-left",
    objectPosition = "object-left-top",
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
        </div>
    );
}
