"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

interface CharacterCardProps {
    name: string;
    symbol: string;
    img: string; // image perso
    frame: string; // cadre PNG (centre transparent)
    width?: number;
    height?: number;
    imageMargin?: number; // réduit l'image dans le cadre
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
    const clipRef = useRef<HTMLDivElement>(null);
    const orbitRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = clipRef.current;
        const orbit = orbitRef.current;
        if (!el || !orbit) return;

        const computeRadius = () => {
            // Taille du conteneur qui CLIPPE (zone image+glows sous le cadre)
            const rect = el.getBoundingClientRect();
            // Rayon = moitié du plus petit côté, moins un offset pour coller au bord et éviter le cadre
            const halfMin = Math.min(rect.width, rect.height) / 2;
            const edgeOffset = 12; // ajuste si tu veux coller plus/moins au bord
            const r = Math.max(0, halfMin - edgeOffset);
            orbit.style.setProperty("--orbit-radius", `${r}px`);
        };

        computeRadius();
        const ro = new ResizeObserver(computeRadius);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    return (
        <div
            className="relative flex flex-col items-center justify-center"
            style={{ width, height }}
        >
            {/* Conteneur qui CLIPPE l'intérieur du cadre */}
            <div
                className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl"
                style={{
                    top: imageMargin,
                    bottom: imageMargin,
                    left: imageMargin,
                    right: imageMargin,
                }}
            >
                {/* IMAGE */}
                <Image
                    src={img}
                    alt={name}
                    fill
                    priority
                    className="relative z-10 object-contain select-none pointer-events-none"
                />

                {/* GLOW interne vacillant */}
                <div className="element-innerglow" />

                {/* Halo orbital vivant */}
                <div className="element-orbit" />
            </div>

            {/* CADRE PNG */}
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

            {/*TITRE */}
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

            {/* Bouton */}
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