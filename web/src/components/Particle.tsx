'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Separated component for stable random generation
export function Particle({ index }: { index: number }) {
    const [randoms, setRandoms] = useState<{ x: number, y: number, duration: number, delay: number, sc: number } | null>(null);

    useEffect(() => {
        setRandoms({
            x: (index % 2 === 0 ? 1 : -1) * (Math.random() * 50),
            y: Math.random() * 100,
            duration: 4 + Math.random() * 6, // Slower duration: 4-10s
            delay: Math.random() * 5,
            sc: Math.random() + 0.5
        });
    }, [index]);

    if (!randoms) return null;

    return (
        <motion.div
            initial={{
                opacity: 0,
                x: randoms.x,
                y: randoms.y
            }}
            animate={{
                opacity: [0, 1, 0],
                y: [randoms.y, randoms.y - 100], // Float upwards
                scale: [0, randoms.sc, 0]
            }}
            transition={{
                duration: randoms.duration,
                repeat: Infinity,
                delay: randoms.delay,
                ease: "easeInOut"
            }}
            className="absolute w-1 h-1 bg-amber-200 rounded-full blur-[1px] shadow-[0_0_5px_rgba(251,191,36,0.8)]"
            style={{
                left: `${50 + (Math.random() * 50 - 25)}%`, // Approx center
                top: `${50 + (Math.random() * 50 - 25)}%`
            }}
        />
    );
}
