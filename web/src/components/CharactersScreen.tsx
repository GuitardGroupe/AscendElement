'use client';

//import { CHARACTERS } from '@/lib/game-data';
import { useState } from 'react';
import { characters } from '@/lib/data';
import { useSelectedCharacter } from "@/store/useSelectedCharacter";
import { AnimatePresence, motion } from "framer-motion";
import CharacterCard from "@/components/CharacterCard";
import { useSoundStore } from '@/store/useSoundStore';

const CONST_IMG_FRAME = "/images/webp/CardFrame.webp";
const CONST_SOUND_SWITCH = "/sounds/uiClick03.mp3";
const CONST_SOUND_ACCEPTATION = "/sounds/acceptation02.mp3";

interface CharactersScreenProps {
    onSwitchScreen: (screen: string) => void;
}
export default function CharactersScreen({ onSwitchScreen }: CharactersScreenProps) {
    const { playSound } = useSoundStore();
    const { setSelectedCharacter } = useSelectedCharacter();

    const [selected, setSelected] = useState(0);
    const character = characters[selected];

    const handleSelect = (index: number) => {
        playSound(CONST_SOUND_SWITCH, 0.6);
        setSelected(index);
    };

    const handleActivate = () => {
        playSound(CONST_SOUND_ACCEPTATION, 0.6);
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
                            backfaceVisibility: "hidden",
                            transform: "translateZ(0)"
                        }}
                    >
                        <CharacterCard
                            name={character.name}
                            symbol={character.symbol}
                            img={character.img}
                            frame={CONST_IMG_FRAME}
                            width={420}
                            height={570}
                            imageMargin={70}
                            onSelect={handleActivate}
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

