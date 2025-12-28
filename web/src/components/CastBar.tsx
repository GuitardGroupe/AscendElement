"use client";

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
            <div className="absolute inset-0 bg-linear-to-b from-[#141821] to-[#090b10]" />

            {/* Barre de remplissage */}
            <div
                className="absolute left-0 top-0 h-full transition-all duration-80 ease-linear"
                style={{
                    width: pct,
                    background: `linear-gradient(90deg, ${color} 0%, ${color}cc 40%, ${color}aa 70%, ${color}88 100%)`,
                }}
            />

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
