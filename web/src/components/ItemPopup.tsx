import { motion } from 'framer-motion';
import ItemPic from './ItemPic';
import { X, Sword, Crosshair, Heart, Zap, Clock, Repeat } from 'lucide-react';
import React, { useEffect } from 'react';
import { useSoundStore } from '@/store/useSoundStore';
import { CONST_ASSETS } from '@/lib/preloader';

// Reused Rarity Colors
const RARITY_COLORS: Record<string, { text: string, bg: string, border: string, gradient: string }> = {
    Common: { text: "text-gray-400", bg: "bg-gray-400", border: "border-gray-400", gradient: "from-gray-400" },
    Uncommon: { text: "text-green-400", bg: "bg-green-400", border: "border-green-400", gradient: "from-green-400" },
    Rare: { text: "text-blue-400", bg: "bg-blue-400", border: "border-blue-400", gradient: "from-blue-400" },
    Epic: { text: "text-purple-400", bg: "bg-purple-400", border: "border-purple-400", gradient: "from-purple-400" },
    Legendary: { text: "text-orange-400", bg: "bg-orange-400", border: "border-orange-400", gradient: "from-orange-400" }
};

interface ItemPopupProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    item: any;
    onClose: () => void;
    actions?: React.ReactNode;
}

export default function ItemPopup({ item, onClose, actions }: ItemPopupProps) {
    const { playSound } = useSoundStore();

    useEffect(() => {
        playSound(CONST_ASSETS.SOUNDS.CLICK); // Open sound
        // No unmount sound to avoid double trigger on button actions
    }, [playSound]);

    const handleClose = () => {
        playSound(CONST_ASSETS.SOUNDS.CLICK, 0.5); // Close sound
        onClose();
    };

    if (!item) return null;

    const rarity = item.rarity || 'Common';
    const colors = RARITY_COLORS[rarity] || RARITY_COLORS.Common;

    // Helper for stats
    const renderItemStats = (itm: any) => {
        const stats = [];
        // Equipment Stats
        if (['Weapon', 'Ring', 'Book', 'Gem'].includes(itm.type)) {
            if (itm.attack) stats.push({ label: 'Dégâts', value: `+${itm.attack}`, icon: Sword, color: 'text-red-400' });
            if (itm.critical) stats.push({ label: 'Critique', value: `+${itm.critical}%`, icon: Crosshair, color: 'text-purple-400' });
        }
        if (['Armor', 'Ring', 'Book', 'Gem'].includes(itm.type)) {
            if (itm.health) stats.push({ label: 'Santé', value: `+${itm.health}`, icon: Heart, color: 'text-green-400' });
            if (itm.energy) stats.push({ label: 'Énergie', value: `+${itm.energy}`, icon: Zap, color: 'text-blue-400' });
        }
        // Consumable Stats
        if (itm.type === 'Consumable') {
            if (itm.heal) stats.push({ label: 'Soin', value: `+${itm.heal}`, icon: Heart, color: 'text-amber-400' });
            if (itm.cooldown) stats.push({ label: 'Recharge', value: `${itm.cooldown / 1000}s`, icon: Clock, color: 'text-white' });
            if (itm.usages) stats.push({ label: 'Charges', value: `${itm.usages}`, icon: Repeat, color: 'text-white' });
        }

        const validStats = stats.filter(s => s.value !== undefined);
        if (validStats.length === 0) return null;

        return (
            <div className="grid grid-cols-2 gap-2 mt-4 bg-white/5 p-3 rounded-lg border border-white/5 pointer-events-none">
                {validStats.map((stat, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-full bg-white/5 ${stat.color}`}>
                            <stat.icon size={14} />
                        </div>
                        <div className="flex flex-col">
                            <span className={`text-sm font-black tracking-tight ${stat.color}`}>{stat.value}</span>
                            <span className="text-[9px] uppercase font-bold tracking-widest text-white/40 leading-none">{stat.label}</span>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm cursor-pointer"
            onClick={handleClose} // Backdrop close with sound
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-lg shadow-2xl overflow-hidden relative cursor-default"
                onClick={(e) => {
                    // Clicking card body also closes
                    e.stopPropagation(); // Prevent double trigger from backdrop
                    handleClose();
                }}
            >
                {/* Header Line */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-linear-to-r ${colors.gradient} to-transparent opacity-80`} />

                {/* Close Button (X) */}
                <button
                    onClick={(e) => { e.stopPropagation(); handleClose(); }}
                    className="absolute top-2 right-2 p-2 text-white/30 hover:text-white transition-colors z-20"
                >
                    <X size={16} />
                </button>


                {/* Content */}
                <div className="relative p-6 pb-4">
                    <div className="flex gap-4 pointer-events-none">
                        <div className={`w-16 h-16 shrink-0 rounded-md border ${colors.border} bg-white/5 relative shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
                            <ItemPic src={item.icon || item.img} rarity={item.rarity} size={64} className="rounded-md" />
                        </div>
                        <div className="flex-1">
                            <h3 className={`text-lg font-black italic uppercase tracking-tight ${colors.text}`}>{item.name}</h3>
                            <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 block ${colors.text} opacity-80`}>{item.type} • {item.rarity}</span>
                            <p className="text-xs text-gray-400 leading-relaxed italic border-l-2 border-white/10 pl-2">
                                &quot;{item.description || "Un objet mystérieux."}&quot;
                            </p>
                        </div>
                    </div>

                    {renderItemStats(item)}
                </div>

                {/* ACTIONS - Stop propagation here to prevent close on click */}
                {actions && (
                    <div
                        className="flex w-full bg-white/5 border-t border-white/5 divide-x divide-white/5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {actions}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
