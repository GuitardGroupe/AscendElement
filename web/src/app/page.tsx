'use client';

import { useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import LobbyScreen from '@/components/LobbyScreen';
import CharactersScreen from '@/components/CharactersScreen';
import { AnimatePresence } from 'framer-motion';

type GameState = 'loading' | 'lobby' | 'characters';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('lobby');

  const handleGameState = (screen: string) => {
    console.log("SWITCHING SCREEN : " + screen)
    switch (screen) {
      case 'loading':
        setGameState('loading');
        break;
      case 'lobby':
        setGameState('lobby');
        break;
      case 'characters':
        setGameState('characters');
        break;
      default:
        setGameState('lobby');
        break;
    }
  };

  return (
    <main className="w-full min-h-screen bg-black overflow-hidden">
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
      </AnimatePresence>
    </main>
  );
}
