'use client';

import { motion } from 'framer-motion';
import { User, Users, Swords, ArrowLeft, Lock } from 'lucide-react';
import { useSoundStore } from '@/store/useSoundStore';
import { useAdventureStore } from '@/store/useAdventureStore';
import { CONST_ASSETS } from '@/lib/preloader';

interface AdventureScreenProps {
    onSwitchScreen: (screen: string) => void;
}

export default function AdventureScreen({ onSwitchScreen }: AdventureScreenProps) {
    const { playSound } = useSoundStore();

    const setMode = useAdventureStore(state => state.setMode);

    const handleSoloClick = () => {
        playSound(CONST_ASSETS.SOUNDS.CLICK);
        setMode('solo');
        onSwitchScreen('map');
    };

    const handleBack = () => {
        playSound(CONST_ASSETS.SOUNDS.CLICK);
        onSwitchScreen('lobby');
    };

    const handleCoopClick = () => {
        playSound(CONST_ASSETS.SOUNDS.CLICK);
        setMode('coop');
        onSwitchScreen('map');
    };

    const adventureModes = [
        {
            id: 'solo',
            label: 'SOLO',
            desc: 'Parcourez la carte en solitaire et affrontez des monstres légendaires.',
            icon: User,
            color: 'from-cyan-600 to-blue-900',
            active: true,
            onClick: handleSoloClick
        },
        {
            id: 'coop',
            label: 'COOPÉRATION',
            desc: 'Mode Coopératif (Bêta). Un allié gobelin vous rejoint.',
            icon: Users,
            color: 'from-emerald-600 to-teal-900',
            active: true,
            onClick: handleCoopClick
        },
        {
            id: 'pvp',
            label: 'DUEL JOUEUR',
            desc: 'Bientôt disponible. Testez votre force contre d\'autres combattants.',
            icon: Swords,
            color: 'from-red-600 to-rose-900',
            active: false,
            onClick: () => { }
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full bg-neutral-950 text-white font-sans relative overflow-hidden p-6"
        >
            {/* BG Decor */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.1),transparent_70%)] pointer-events-none" />

            <header className="relative z-10 flex items-center justify-between mb-12">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 group active:scale-95 transition-transform"
                >
                    <div className="w-10 h-10 rounded-sm border border-white/10 flex items-center justify-center bg-white/5">
                        <ArrowLeft size={20} className="text-gray-400" />
                    </div>
                </button>
                <div className="text-right pr-1">
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-linear-to-b from-white to-gray-500">{"AVENTURE ."}</h1>
                    <p className="text-[10px] font-black text-cyan-500/60 tracking-[0.3em] uppercase">QUÊTES & EXPLORATION</p>
                </div>
            </header>

            <main className="relative z-10 flex-1 flex flex-col gap-4">
                {adventureModes.map((mode) => (
                    <motion.button
                        key={mode.id}
                        whileTap={mode.active ? { scale: 0.98 } : {}}
                        onClick={mode.onClick}
                        disabled={!mode.active}
                        className={`relative w-full p-6 text-left rounded-sm border ${mode.active ? 'border-white/10' : 'border-white/5 opacity-50 cursor-not-allowed'} bg-white/5 overflow-hidden transition-all`}
                    >
                        {/* Mode BG Gradient */}
                        <div className={`absolute inset-y-0 left-0 w-1 bg-linear-to-b ${mode.active ? mode.color : 'from-gray-700 to-gray-800'}`} />

                        <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-sm border border-white/10 flex items-center justify-center bg-black/40 ${mode.active ? 'text-cyan-400' : 'text-gray-600'}`}>
                                <mode.icon size={28} />
                            </div>
                            <div className="flex-1">
                                <h2 className={`text-xl font-black italic tracking-tight uppercase ${mode.active ? 'text-white' : 'text-gray-500'}`}>{mode.label}</h2>
                                <p className="text-xs text-gray-400 mt-1 leading-snug">{mode.desc}</p>
                            </div>
                            {!mode.active && <Lock size={20} className="text-gray-700" />}
                        </div>
                    </motion.button>
                ))}
            </main>

            <footer className="relative z-10 text-center py-6">
                <p className="text-[9px] font-black text-gray-600 tracking-[0.5em] uppercase">Proto-Logistics v1.2 // Division: Expedition</p>
            </footer>
        </motion.div>
    );
}
