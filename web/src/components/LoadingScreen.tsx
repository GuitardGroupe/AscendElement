'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
    onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulate loading for 3 seconds
        const duration = 1500;
        const interval = 30;
        const steps = duration / interval;
        const increment = 100 / steps;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 500); // Small delay before switching
                    return 100;
                }
                return prev + increment;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">

            <div
                className="mb-10
             text-center font-semibold tracking-wide text-white
             text-3xl drop-shadow-[0_0_6px_rgba(120,180,255,0.9)]"
                style={{
                    zIndex: 25,
                    textShadow: `
      0 0 10px rgba(120,180,255,0.8),
      0 0 20px rgba(150,100,255,0.5),
      0 0 30px rgba(90,180,255,0.3)
    `,
                }}
            >
                {"Ascend Element"}
            </div>

            <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-linear-to-r from-cyan-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: 'linear' }}
                />
            </div>

            <p className="mt-4 text-sm text-gray-500 " style={{
                zIndex: 25,
                textShadow: `
      0 0 10px rgba(120,180,255,0.8),
      0 0 20px rgba(150,100,255,0.5),
      0 0 30px rgba(90,180,255,0.3)
    `,
            }}>
                INITIALIZING SYSTEMS... {Math.round(progress)}%
            </p>
        </div>
    );
}
