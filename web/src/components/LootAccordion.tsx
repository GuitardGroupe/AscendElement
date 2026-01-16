import ItemPic from "@/components/ItemPic";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

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

export default function LootAccordion({ items, onContinue }: LootAccordionProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative flex flex-col items-center pointer-events-auto">
            {/* BUTTON - FIXED HEIGHT & POSITION */}
            <motion.button
                layout={false} // Important: Do not layout animate the button itself or it might try to center
                onClick={() => setIsOpen(!isOpen)}
                className="w-[200px] h-10 flex items-center justify-center gap-2 bg-linear-to-b from-amber-600 to-amber-500 rounded-t-sm shadow-[0_0_20px_rgba(245,158,11,0.3)] z-20 relative overflow-hidden active:scale-95 transition-transform"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300" />
                <span className="text-black font-black italic uppercase tracking-widest text-xs drop-shadow-sm relative z-10">
                    {isOpen ? "FERMER" : "BUTIN"}
                </span>
            </motion.button>

            {/* DROPDOWN CONTENT */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="dropdown"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                        className="absolute top-10 w-[200px] bg-neutral-900 border-x border-b border-amber-500/50 rounded-b-sm overflow-hidden z-10 flex flex-col shadow-2xl"
                    >
                        {items.map((item, i) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="h-12 border-b border-white/5 last:border-0 flex items-center bg-black/40 active:bg-white/10 transition-colors cursor-pointer relative overflow-hidden"
                            >
                                {/* LEFT: ICON (ItemPic) */}
                                <div className="shrink-0">
                                    <ItemPic
                                        src={item.icon}
                                        rarity={item.rarity}
                                        size={48}
                                        className="rounded-none border-y-0 border-l-0" // Reset standard rounded/border logic to fit row style if needed OR just use it as a square
                                    />
                                    {/* Wait, user wanted "component ItemPic : une image carrée avec une bordure... les coins très légèrement arrondis". 
                                        But in LootAccordion he asked for "à gauche un carré qui prend toute la hauteur". 
                                        If I use ItemPic standard (rounded corners), it might clash with "takes full height".
                                        
                                        Let's stick to the User's latest request for uniformity: "Ce composant aura des dimensions fixes et doit nous servir dans les écrans suivants... y compris la fenetre de loot".
                                        So I should just drop the component in. 
                                        However, in LootAccordion, it's inside a row. 
                                        
                                        If I use ItemPic with size 48 (matching row height 12*4 = 48), it fits.
                                        I should probably removing custom styling on the container in LootAccordion to let ItemPic shine.
                                    */}
                                </div>

                                {/* Actually, let's use the ItemPic exactly as designed. */}
                                <div className="p-1"> {/* Padding to not touch edges if we want rounded look inside */}
                                    <ItemPic src={item.icon} rarity={item.rarity} size={40} />
                                </div>

                                {/* RIGHT: NAME */}
                                <div className="flex-1 px-4 flex items-center">
                                    <span className={`text-xs font-black uppercase tracking-wider ${item.color} truncate`}>
                                        {item.name}
                                    </span>
                                </div>
                            </motion.div>
                        ))}

                        <button
                            onClick={onContinue}
                            className="w-full py-4 bg-black/60 active:bg-black/80 text-[10px] font-black text-white/60 active:text-white uppercase tracking-wider transition-colors border-t border-white/5"
                        >
                            CONTINUER
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
