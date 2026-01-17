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

    const [showConfirmation, setShowConfirmation] = useState(false);

    // Reset items when initialItems changes
    useEffect(() => {
        setVisibleItems(initialItems);
    }, [initialItems]);

    const handleCollect = (id: number) => {
        playSound(CONST_ASSETS.SOUNDS.CLICK);
        setVisibleItems(prev => prev.filter(item => item.id !== id));
    };

    const handleToggle = () => {
        if (isOpen) return;
        playSound(CONST_ASSETS.SOUNDS.SWITCH);
        setIsOpen(true);
    };

    const handleContinue = () => {
        if (visibleItems.length > 0) {
            playSound(CONST_ASSETS.SOUNDS.SWITCH); // Alert sound
            setShowConfirmation(true);
            return;
        }
        playSound(CONST_ASSETS.SOUNDS.ACCEPTATION);
        onContinue();
    };

    const confirmLeave = () => {
        playSound(CONST_ASSETS.SOUNDS.ACCEPTATION);
        setShowConfirmation(false);
        onContinue();
    };

    const cancelLeave = () => {
        playSound(CONST_ASSETS.SOUNDS.CLICK);
        setShowConfirmation(false);
    };

    return (
        <div className="relative flex flex-col items-center pointer-events-auto">
            {/* BUTTON - FIXED WIDTH 250px */}
            <motion.button
                layout={false}
                onClick={handleToggle}
                className={`w-[250px] h-10 flex items-center justify-center gap-2 bg-linear-to-b from-amber-600 to-amber-500 rounded-t-sm shadow-[0_0_20px_rgba(245,158,11,0.3)] z-20 relative overflow-hidden transition-transform ${isOpen ? 'cursor-default' : 'active:scale-95'}`}
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300" />
                <span className="text-black font-black italic uppercase tracking-widest text-xs drop-shadow-sm relative z-10">
                    BUTIN
                </span>
            </motion.button>

            {/* CONFIRMATION POPUP */}
            <AnimatePresence>
                {showConfirmation && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute top-12 w-[280px] bg-neutral-900 border border-red-500/50 rounded-md shadow-2xl z-50 p-4 flex flex-col items-center gap-4 text-center"
                    >
                        <div className="text-red-400 font-bold text-xs uppercase tracking-wider">
                            Objets non ramassés !
                        </div>
                        <p className="text-white/80 text-[10px] italic">
                            Certains objets seront perdus si vous partez maintenant.
                        </p>
                        <div className="flex gap-2 w-full">
                            <button
                                onClick={cancelLeave}
                                className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm text-[10px] font-bold text-white uppercase"
                            >
                                Retour
                            </button>
                            <button
                                onClick={confirmLeave}
                                className="flex-1 py-2 bg-red-900/50 hover:bg-red-800/50 border border-red-500/30 rounded-sm text-[10px] font-bold text-red-200 uppercase"
                            >
                                Partir
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* DROPDOWN CONTENT - BLACK BG */}
            <AnimatePresence>
                {isOpen && !showConfirmation && (
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
