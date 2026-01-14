'use client';

import { useState, useEffect } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import LobbyScreen from '@/components/LobbyScreen';
import CharactersScreen from '@/components/CharactersScreen';
import FightScreen from '@/components/FightScreen';
import StuffScreen from '@/components/StuffScreen';
import AdventureScreen from '@/components/AdventureScreen';
import MapScreen from '@/components/MapScreen';
import { AnimatePresence } from 'framer-motion';

type GameState = 'loading' | 'lobby' | 'characters' | 'fight' | 'inventory' | 'adventure' | 'map';

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
      case 'inventory':
        setGameState('inventory');
        break;
      case 'adventure':
        setGameState('adventure');
        break;
      case 'map':
        setGameState('map');
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
        <LobbyScreen key="lobby" onSwitchScreen={(screen: string) => handleGameState(screen)} />
      )}
      {gameState === 'characters' && (
        <CharactersScreen key="characters" onSwitchScreen={(screen: string) => handleGameState(screen)} />
      )}
      {gameState === 'fight' && (
        <FightScreen key="fight" onSwitchScreen={(screen: string) => handleGameState(screen)} />
      )}
      {gameState === 'inventory' && (
        <StuffScreen key="inventory" onSwitchScreen={(screen: string) => handleGameState(screen)} />
      )}
      {gameState === 'adventure' && (
        <AdventureScreen key="adventure" onSwitchScreen={(screen: string) => handleGameState(screen)} />
      )}
      {gameState === 'map' && (
        <MapScreen key="map" onSwitchScreen={(screen: string) => handleGameState(screen)} />
      )}
    </AnimatePresence>
  );

  useEffect(() => {
    const initTelegram = async () => {
      const WebApp = (await import("@twa-dev/sdk")).default;
      WebApp.ready();
      WebApp.expand();
      WebApp.enableClosingConfirmation();
      console.log("Telegram WebApp Ready");
    };

    if (typeof window !== "undefined") {
      initTelegram();
    }

  }, []);

  return (
    <main className="w-full h-screen bg-black overflow-hidden ">
      {isMobile ? (
        content
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[390px] h-[768px] rounded-[28px] overflow-hidden border border-gray-700 shadow-[0_0_40px_rgba(0,0,0,0.8)] ">
            {content}
          </div>
        </div>
      )}
    </main>
  );
}
