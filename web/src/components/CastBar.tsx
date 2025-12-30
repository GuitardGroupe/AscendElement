"use client";

import { motion } from "framer-motion";

export default function CastBar({
    progress, // 0 → 100
    height = 12,
    color = "#4db8ff",
}: {
    progress: number;
    height?: number;
    color?: string;
}) {
    const pct = Math.max(0, Math.min(progress, 100)) + "%";

    return (
        <div
            className="relative w-full overflow-hidden rounded-md bg-[#05070a]"
            style={{
                height,
                border: "1px solid #1a1d22",
            }}
        >
            {/* Track de fond discret */}
            <div className="absolute inset-0 bg-[#090b10]" />

            {/* Barre de remplissage */}
            <motion.div
                className="absolute left-0 top-0 h-full"
                style={{
                    width: pct,
                    background: `linear-gradient(90deg, ${color} 0%, ${color}cc 40%, ${color}aa 70%, ${color}88 100%)`,
                }}
                initial={false}
                animate={progress === 100 ? {
                    backgroundColor: "#ffffff", // Devient blanc flash
                    filter: "brightness(1.5)",   // Augmente la luminosité
                    boxShadow: "0 0 20px #ffffff" // Ajoute un glow
                } : {}}
                transition={{ duration: 0.1 }}
            />
        </div>
    );
}
