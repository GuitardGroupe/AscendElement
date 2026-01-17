import ItemPic from "@/components/ItemPic";
import { useSoundStore } from "@/store/useSoundStore";
import { CONST_ASSETS } from "@/lib/preloader";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface LootItem {
    id: number;
    name: string;
    rarity: string;
    color: string;
    border: string;
    icon: string;
}

interface LootAccordionProps {
    items: LootItem[];
    onContinue: () => void;
}

export default function LootAccordion({ items: initialItems, onContinue }: LootAccordionProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [visibleItems, setVisibleItems] = useState(initialItems);
    const { playSound } = useSoundStore();

    // Reset items when initialItems changes
    useEffect(() => {
        setVisibleItems(initialItems);
    }, [initialItems]);

    const handleCollect = (id: number) => {
        playSound(CONST_ASSETS.SOUNDS.CLICK);
        setVisibleItems(prev => prev.filter(item => item.id !== id));
    };

    const handleToggle = () => {
        playSound(CONST_ASSETS.SOUNDS.SWITCH);
        setIsOpen(!isOpen);
    };

    const handleContinue = () => {
        playSound(CONST_ASSETS.SOUNDS.ACCEPTATION);
        onContinue();
    };

    return (
        <div className="relative flex flex-col items-center pointer-events-auto">
            {/* BUTTON - FIXED WIDTH 250px */}
            <motion.button
                layout={false}
                onClick={handleToggle}
                className="w-[250px] h-10 flex items-center justify-center gap-2 bg-linear-to-b from-amber-600 to-amber-500 rounded-t-sm shadow-[0_0_20px_rgba(245,158,11,0.3)] z-20 relative overflow-hidden active:scale-95 transition-transform"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300" />
                <span className="text-black font-black italic uppercase tracking-widest text-xs drop-shadow-sm relative z-10">
                    {isOpen ? "FERMER" : "BUTIN"}
                </span>
            </motion.button>

            {/* DROPDOWN CONTENT - BLACK BG */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="dropdown"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                        className="absolute top-10 w-[250px] bg-black border-x border-b border-amber-500/50 rounded-b-sm overflow-hidden z-10 flex flex-col shadow-2xl gap-0.5 p-0.5"
                    >
                        {/* ITEM LIST */}
                        <AnimatePresence mode="popLayout">
                            {visibleItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    exit={{ opacity: 0, height: 0 }}
                                    onClick={() => handleCollect(item.id)}
                                    className="cursor-pointer group relative"
                                >
                                    {/* Item Row Container - Auto height to fit content + 2px padding */}
                                    <div className="w-full flex items-center p-[2px] bg-neutral-800/50 transition-all rounded-sm border border-white/10">

                                        {/* Left: Item Pic with 1px gap from container edges */}
                                        <div className="shrink-0">
                                            <ItemPic
                                                src={item.icon}
                                                rarity={item.rarity}
                                                size={56}
                                                className="rounded-sm"
                                            />
                                        </div>

                                        {/* Right: Name */}
                                        <div className="flex-1 px-3 flex items-center">
                                            <span className={`text-xs font-bold capitalize ${item.color}`}>
                                                {item.name.toLowerCase()}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Continue Button only if items remain? Or always? User logic implies just collection. Keeping Continue for now. */}
                        {visibleItems.length === 0 && (
                            <div className="p-4 text-center text-[10px] text-white/40 italic">
                                Inventaire vide
                            </div>
                        )}

                        <button
                            onClick={handleContinue}
                            className="w-full py-4 bg-black/60 active:bg-black/80 text-[10px] font-black text-white/60 active:text-white uppercase tracking-wider transition-colors"
                        >
                            CONTINUER
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
