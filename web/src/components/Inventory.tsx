'use client';

import { motion } from 'framer-motion';
import ItemPic from '@/components/ItemPic';

interface InventoryItem {
    id: string | number;
    img: string | null;
    rarity?: string;
    label?: string; // Optional context for the item
}

interface InventoryProps {
    items: InventoryItem[];
    onItemClick: (item: InventoryItem) => void;
    capacity?: number;
    label?: string;
    className?: string;
}

export default function Inventory({
    items,
    onItemClick,
    capacity = 20,
    label = "INVENTAIRE",
    className = ""
}: InventoryProps) {
    // Ensure we fill the grid up to capacity if needed, or just display items
    // If the passed items array is less than capacity, we might want to fill with empty slots if the design requires it.
    // Based on StuffScreen, the items array was already created with length 20.
    // So we assume the parent passes the full array of slots (empty or filled).

    const occupiedCount = items.filter(i => i.img).length;

    return (
        <section className={`flex-1 min-h-0 overflow-y-auto ${className}`}>
            <div className="flex items-center justify-between mb-2 px-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
                <span className="text-[10px] font-mono text-cyan-500">{occupiedCount} / {capacity}</span>
            </div>

            <div className="grid grid-cols-5 gap-2 px-4 place-content-center">
                {items.map((item) => (
                    <motion.button
                        key={item.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => item.img && onItemClick(item)}
                        className="relative group"
                    >
                        <ItemPic
                            src={item.img}
                            rarity={item.rarity}
                            size={56}
                            className={!item.img ? "opacity-30 bg-white/5 border-white/5 shadow-none" : ""}
                        />
                    </motion.button>
                ))}
            </div>
        </section>
    );
}
