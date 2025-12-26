'use client';

import { motion } from 'framer-motion';
import { Sword, Map, Users, Archive, Hexagon } from 'lucide-react';
import Image from 'next/image';
import { useSoundStore } from '@/store/useSoundStore';
import { useSelectedCharacter } from "@/store/useSelectedCharacter";
import CharacterPortrait from './CharacterPortrait';

import { CONST_ASSETS } from '@/lib/preloader';

const CONST_CRYSTAL_ACTIVE = CONST_ASSETS.IMAGES.CRYSTAL_ACTIVE;
const CONST_CRYSTAL_INACTIVE = CONST_ASSETS.IMAGES.CRYSTAL_INACTIVE;
const CONST_BG_LOBBY = CONST_ASSETS.IMAGES.BACKGROUND;
const CONST_SOUND_CLICK = CONST_ASSETS.SOUNDS.CLICK;
const CONST_SOUND_DESACTIVATION = CONST_ASSETS.SOUNDS.DESACTIVATION;


interface LobbyScreenProps {
    onSwitchScreen: (screen: string) => void;
}

export default function LobbyScreen({ onSwitchScreen }: LobbyScreenProps) {
    const { playSound } = useSoundStore();
    const { selectedCharacter, clearSelectedCharacter } = useSelectedCharacter();

    const menuItems = [
        { id: 'adventure', label: 'AVENTURE', icon: Map, color: 'text-green-400', onClick: () => handleActionClick() },
        { id: 'arena', label: 'Tuer le personnage', icon: Sword, color: 'text-red-400', onClick: () => handleActionClick() },
        { id: 'social', label: 'SOCIAL', icon: Users, color: 'text-blue-400', onClick: () => handleActionClick() },
        { id: 'inventory', label: 'INVENTAIRE', icon: Archive, color: 'text-yellow-400', onClick: () => handleActionClick() },
    ];

    const isCrystalActive = !!selectedCharacter;

    const handleCrystalClick = () => {
        playSound(CONST_SOUND_CLICK, 0.6);
        onSwitchScreen('characters');
    };

    const handleActionClick = () => {
        clearSelectedCharacter();
        playSound(CONST_SOUND_DESACTIVATION, 0.6);
    }

    return (
        <div className="flex flex-col min-h-screen bg-neutral-950 text-white p-4 font-sans relative overflow-hidden">



            {/* Header / Crystal Status */}
            <header className="relative z-10 flex justify-between items-center mb-8 p-4 border-b border-white/10">
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
                <div
                    className="relative z-10 text-center flex flex-col items-center justify-center"
                >
                    {/* Crystal Image Container */}
                    <div className="relative w-100 h-100 flex items-center justify-center">
                        {/* Glow Effect (Active Only) - Optimized */}
                        <motion.div
                            className="absolute inset-0 rounded-full bg-cyan-500/20 blur-[20px]" // Reduced blur radius and opacity
                            animate={{
                                opacity: isCrystalActive ? 1 : 0, // Animate opacity instead of scale for better perf
                            }}
                            style={{
                                willChange: "opacity", // Hint to browser
                                transform: "translateZ(0)" // Force hardware acceleration
                            }}
                            transition={{ duration: 0.3 }}
                        />

                        {/* Crystal Images - Optimized */}
                        <div className="relative w-full h-full">
                            <motion.img
                                src={CONST_CRYSTAL_ACTIVE}
                                alt="Active Crystal"
                                className="absolute inset-0 w-full h-full object-contain"
                                animate={{
                                    opacity: isCrystalActive ? 1 : 0,
                                }}
                                style={{ willChange: "opacity" }} // Hint
                                transition={{ duration: 0.3 }}
                            />

                            <motion.img
                                src={CONST_CRYSTAL_INACTIVE}
                                alt="Inactive Crystal"
                                className="absolute inset-0 w-full h-full object-contain opacity-80"
                                animate={{
                                    opacity: isCrystalActive ? 0 : 1,
                                }}
                                style={{ willChange: "opacity" }} // Hint
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        <div className="absolute mt-[-112px]">
                            <CharacterPortrait
                                img={selectedCharacter?.img ?? ""}
                                isActive={isCrystalActive}
                                handleClick={handleCrystalClick}
                            />
                        </div>

                    </div>
                </div>
            </main>

            {/* Action Menu */}
            <nav className="relative z-10 grid grid-cols-2 gap-3 mt-auto">
                {menuItems.map((item, index) => (
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