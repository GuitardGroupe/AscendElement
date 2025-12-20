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
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = src;
                img.onload = resolve;
                img.onerror = reject;
            });
        };

        const loadSound = (src: string) => {
            return new Promise<void>((resolve) => {
                const sound = new Howl({
                    src: [src],
                    onload: () => resolve(),
                    onloaderror: () => resolve(), // On continue même si un son échoue
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
                setProgress(Math.round((loadedCount / allPromises.length) * 100));
            });
        });

        Promise.all(allPromises).then(() => setIsReady(true));
    }, [assets]);

    return { isReady, progress };
}   