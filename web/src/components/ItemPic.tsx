import Image from "next/image";

interface ItemPicProps {
    src: string | null;
    rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary" | string;
    size?: number; // Size in pixels
    className?: string; // Additional classes
}

export default function ItemPic({ src, rarity = "common", size = 48, className = "" }: ItemPicProps) {
    // Map rarity to colors
    const getColors = (r: string) => {
        switch (r.toLowerCase()) {
            case "legendary": return { border: "border-orange-500", shadow: "shadow-[0_0_2px_rgba(249,115,22,1)]" };
            case "epic": return { border: "border-purple-500", shadow: "shadow-[0_0_2px_rgba(168,85,247,1)]" };
            case "rare": return { border: "border-blue-500", shadow: "shadow-[0_0_2px_rgba(59,130,246,1)]" };
            case "uncommon": return { border: "border-green-500", shadow: "shadow-none" };
            case "common":
            default: return { border: "border-gray-600", shadow: "shadow-none" };
        }
    };

    const colors = getColors(rarity);

    return (
        <div
            className={`relative bg-black rounded-sm overflow-hidden shrink-0 ${colors.shadow} ${className}`}
            style={{ width: size, height: size }}
        >
            {src ? (
                <Image
                    src={src}
                    fill
                    className="object-cover"
                    alt="item"
                />
            ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                    {/* Placeholder */}
                </div>
            )}

            {/* INNER BORDER 1: Semi-transparent Overlay */}
            <div className={`absolute inset-0 border-[3px] ${colors.border} opacity-50 pointer-events-none rounded-sm`} />

            {/* INNER BORDER 2: Solid Fine Edge (Effectively "outer" but inside) */}
            <div className={`absolute inset-0 border ${colors.border} opacity-100 pointer-events-none rounded-sm`} />

            {/* Glossy Effect */}
            <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent pointer-events-none opacity-50" />
        </div>
    );
}
