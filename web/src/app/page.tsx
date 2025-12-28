'use client';

import WebApp from '@twa-dev/sdk';
import { useState, useEffect } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import LobbyScreen from '@/components/LobbyScreen';
import CharactersScreen from '@/components/CharactersScreen';
import FightScreen from '@/components/FightScreen';
import { AnimatePresence } from 'framer-motion';

type GameState = 'loading' | 'lobby' | 'characters' | 'fight';

function useIsMobile() {

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

export default function Home() {
  const isMobile = useIsMobile();

  const [gameState, setGameState] = useState<GameState>('loading');

  const handleGameState = (screen: string) => {
    console.log("SWITCHING SCREEN : " + screen)
    switch (screen) {
      case 'loading':
        setGameState('loading');
        break;
      case 'lobby':
        setGameState('lobby');
        break;
      case 'fight':
        setGameState('fight');
        break;
      case 'characters':
        setGameState('characters');
        break;
      default:
        setGameState('lobby');
        break;
    }
  };

  const content = (
    <AnimatePresence mode="wait">
      {gameState === 'loading' && (
        <LoadingScreen key="loading" onComplete={() => handleGameState('lobby')} />
      )}
      {gameState === 'lobby' && (
        <LobbyScreen key="lobby" onSwitchScreen={(screen) => handleGameState(screen)} />
      )}
      {gameState === 'characters' && (
        <CharactersScreen key="characters" onSwitchScreen={(screen) => handleGameState(screen)} />
      )}
      {gameState === 'fight' && (
        <FightScreen key="fight" onSwitchScreen={(screen) => handleGameState(screen)} />
      )}
    </AnimatePresence>
  );

  useEffect(() => {
    WebApp.ready(); // Informe Telegram que l'app est chargée
    WebApp.expand(); // Passe en plein écran

    WebApp.setHeaderColor('#1a1a1a');

    WebApp.BackButton.hide();

  }, []);

  return (
    <main className="w-full min-h-screen bg-black overflow-hidden flex items-center justify-center">
      {isMobile ? (
        content
      ) : (
        <div className="relative w-[390px] h-[768px] rounded-[28px] overflow-hidden border border-gray-700 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
          {content}
        </div>
      )}
    </main>
  );
}
