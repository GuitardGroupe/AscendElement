'use client';

//import { CHARACTERS } from '@/lib/game-data';
import { useState } from 'react';
import useUISound from '@/hooks/useUISounds';
import { characters } from '@/lib/data';
import { useSelectedCharacter } from "@/store/useSelectedCharacter";
import { AnimatePresence, motion } from "framer-motion";
import CharacterCard from "@/components/CharacterCard";
import { useSoundStore } from '@/store/useSoundStore';

const CONST_FRAME_IMG = "/images/webp/CardFrame.webp";

interface CharactersScreenProps {
    onSwitchScreen: (screen: string) => void;
}
export default function CharactersScreen({ onSwitchScreen }: CharactersScreenProps) {
    const playAcceptation = useUISound("/sounds/acceptation02.mp3", 0.6);
    const playClick = useUISound("/sounds/uiClick03.mp3", 0.6);
    const { playSound } = useSoundStore();
    const { setSelectedCharacter } = useSelectedCharacter();
    const [selected, setSelected] = useState(0);
    const character = characters[selected];

    const handleSelect = (index: number) => {
        playClick();
        setSelected(index);
    };

    const handleActivate = () => {

        playSound("/sounds/acceptation02.mp3", 0.6);
        setSelectedCharacter(character);
        onSwitchScreen("lobby");
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
            <div className="relative w-[420px] h-[570px]">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={character.id}
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="absolute inset-0"
                        style={{
                            willChange: "transform, opacity",
                            WebkitBackfaceVisibility: "hidden",
                            backfaceVisibility: "hidden", // Astuce pour forcer le lissage
                            transform: "translateZ(0)" // Le "Hack" ultime pour forcer le GPU
                        }} // Hint

                    >
                        <CharacterCard
                            name={character.name}
                            symbol={character.symbol}
                            img={character.img}
                            frame={CONST_FRAME_IMG}
                            width={420}
                            height={570}
                            imageMargin={70} // 🔹 marge interne → réduit la taille du perso
                            onSelect={handleActivate} // 👈 déclenche la sauvegarde + redirection
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="grid grid-cols-6 gap-2 mt-8">
                {characters.map((ch, i) => (
                    <button
                        key={ch.id}
                        onClick={() => handleSelect(i)}
                        className={`p-3 rounded-lg text-white text-sm ${i === selected
                            ? "bg-cyan-500/70 shadow-[0_0_12px_rgba(0,255,255,0.7)]"
                            : "bg-white/10 hover:bg-white/20"
                            } transition-all`}
                    >
                        {ch.symbol}
                    </button>
                ))}
            </div>
        </div>
    );
}

