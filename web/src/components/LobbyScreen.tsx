'use client';

import { motion } from 'framer-motion';
import { Swords, Flame, Hexagon } from 'lucide-react';
import Image from 'next/image';
import { useSoundStore } from '@/store/useSoundStore';
import { useSelectedCharacter } from "@/store/useSelectedCharacter";
import ElementCrystal from './ElementCrystal';

import { CONST_ASSETS } from '@/lib/preloader';

const CONST_SOUND_CLICK = CONST_ASSETS.SOUNDS.CLICK;
const CONST_SOUND_DESACTIVATION = CONST_ASSETS.SOUNDS.DESACTIVATION;


interface LobbyScreenProps {
    onSwitchScreen: (screen: string) => void;
}

export default function LobbyScreen({ onSwitchScreen }: LobbyScreenProps) {
    const { playSound } = useSoundStore();
    const { selectedCharacter, clearSelectedCharacter } = useSelectedCharacter();

    const isCrystalActive = !!selectedCharacter;

    const menuItems = [
        { id: 'fight', show: isCrystalActive, label: 'COMBAT', icon: Swords, color: 'text-yellow-400', onClick: () => handleFightClick() },
        { id: 'sacrifice', show: isCrystalActive, label: 'SACRIFICE', icon: Flame, color: 'text-red-400', onClick: () => handleActionClick() },
    ];

    const handleCrystalClick = () => {
        playSound(CONST_SOUND_CLICK, 0.6);
        onSwitchScreen('characters');
    };

    const handleActionClick = () => {
        clearSelectedCharacter();
        playSound(CONST_SOUND_DESACTIVATION, 0.6);
    }

    const handleFightClick = () => {
        playSound(CONST_SOUND_CLICK, 0.6);
        onSwitchScreen('fight');
    }

    return (
        <div className="flex flex-col min-h-full bg-neutral-950 text-white p-4 font-sans relative overflow-hidden">
            {/* Header / Crystal Status */}
            <header className="absolute top-6 left-4 right-4 z-20 flex justify-between items-center mb-2 p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-600 to-blue-900 flex items-center justify-center border border-white/20">
                        <Hexagon size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xs text-gray-400 tracking-wider">CRYSTAL LEVEL</h2>
                        <p className="font-bold text-lg text-purple-300">CORE-I</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-gray-400">CREDITS</div>
                    <div className="font-mono text-yellow-500">1,250 ◈</div>
                </div>
            </header>

            {/* Main Crystal Display */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center my-4">
                <ElementCrystal
                    img={selectedCharacter?.img ?? ""}
                    isActive={isCrystalActive}
                    onClick={() => handleCrystalClick()}
                />
            </main>

            {/* Action Menu */}
            <nav className="absolute bottom-6 left-4 right-4 z-20 grid grid-cols-2 gap-3">
                {menuItems.filter(item => item.show).map((item, index) => (
                    <motion.button
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={item.onClick}
                        className="flex items-center gap-3 p-4 bg-gray-900/40 border border-white/5 rounded-xl hover:bg-gray-800/60 active:scale-95 transition-all text-left"
                    >
                        <item.icon className={`${item.color}`} size={20} />
                        <span className="font-bold tracking-wider text-sm">{item.label}</span>
                    </motion.button>
                ))}
            </nav>

            {/* IMAGE WARMUP (PRE-DECODING NEXT SCREEN) */}
            <div className="absolute opacity-0 pointer-events-none -z-50 overflow-hidden w-0 h-0">
                <Image src={CONST_ASSETS.IMAGES.CARD_FRAME} alt="" width={1} height={1} priority />
                <Image src={CONST_ASSETS.IMAGES.CHAR_AS} alt="" width={1} height={1} priority />
            </div>
        </div>
    );
}



/*

            <div className="absolute inset-0 z-0 flex items-center justify-center">
                <Image
                    src={CONST_BG_LOBBY}
                    alt="Lobby Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/80 z-0" />
            </div>

*/