'use client';

import { useState } from 'react';
import { characters } from '@/lib/data';
import { useSelectedCharacter } from "@/store/useSelectedCharacter";
import { useSoundStore } from "@/store/useSoundStore";
import { AnimatePresence, motion } from "framer-motion";
import CharacterCard from "@/components/CharacterCard";
import { CONST_ASSETS } from '@/lib/preloader';

const CONST_IMG_FRAME = CONST_ASSETS.IMAGES.CARD_FRAME;
const CONST_SOUND_SWITCH = CONST_ASSETS.SOUNDS.SWITCH;
const CONST_SOUND_ACCEPTATION = CONST_ASSETS.SOUNDS.ACCEPTATION;

interface CharactersScreenProps {
    onSwitchScreen: (screen: string) => void;
}
export default function CharactersScreen({ onSwitchScreen }: CharactersScreenProps) {
    const { playSound } = useSoundStore();
    const { selectedCharacter, setSelectedCharacter } = useSelectedCharacter();

    const initialIndex = selectedCharacter ? characters.findIndex(c => c.id === selectedCharacter.id) : 0;
    const [selected, setSelected] = useState(initialIndex !== -1 ? initialIndex : 0);
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

