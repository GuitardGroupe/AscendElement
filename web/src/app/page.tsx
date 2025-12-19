'use client';

import { useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import LobbyScreen from '@/components/LobbyScreen';
import { AnimatePresence } from 'framer-motion';

type GameState = 'loading' | 'lobby';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('loading');

  return (
    <main className="w-full min-h-screen bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        {gameState === 'loading' && (
          <LoadingScreen key="loading" onComplete={() => setGameState('lobby')} />
        )}
        {gameState === 'lobby' && (
          <LobbyScreen key="lobby" />
        )}
      </AnimatePresence>
    </main>
  );
}
