export const ASSETS_TO_LOAD = {
    images: [
        '/images/webp/CardFrame.webp',
        '/images/webp/Background.webp',
        '/images/webp/Crystal-active.webp',
        '/images/webp/Crystal-inactive.webp',
        '/images/webp/As.webp',
        '/images/webp/Br.webp',
        '/images/webp/Ga.webp',
        '/images/webp/Kr.webp',
        '/images/webp/Li.webp',
        '/images/webp/Zn.webp',
    ],
    sounds: [
        '/sounds/UI/Click.mp3',
        '/sounds/UI/Acceptation.mp3',
        '/sounds/UI/Switch.mp3',
    ]
};

import { useState, useEffect } from 'react';
import { Howl } from 'howler';

export function usePreloader(assets: { images: string[], sounds: string[] }) {
    const [isReady, setIsReady] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const loadImage = (src: string) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = src;
                img.onload = () => resolve({ src, success: true });
                img.onerror = () => {
                    console.warn(`Failed to load image: ${src}`);
                    resolve({ src, success: false });
                };
            });
        };

        const loadSound = (src: string) => {
            return new Promise((resolve) => {
                new Howl({
                    src: [src],
                    onload: () => resolve({ src, success: true }),
                    onloaderror: (id, err) => {
                        console.warn(`Failed to load sound: ${src}`, err);
                        resolve({ src, success: false });
                    },
                });
            });
        };

        const allPromises = [
            ...assets.images.map(loadImage),
            ...assets.sounds.map(loadSound)
        ];

        let loadedCount = 0;
        allPromises.forEach(p => {
            p.then(() => {
                loadedCount++;
                const newProgress = Math.round((loadedCount / allPromises.length) * 100);
                setProgress(newProgress);
            });
        });

        Promise.all(allPromises).then(() => {
            setIsReady(true);
        });
    }, [assets]);

    return { isReady, progress };
}   