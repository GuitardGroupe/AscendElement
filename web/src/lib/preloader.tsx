const V = "v1";

export const CONST_ASSETS = {
    IMAGES: {
        CARD_FRAME: `/${V}/images/webp/cardframe.webp`,
        PORTRAIT_FRAME: `/${V}/images/webp/portrait-frame.png`,
        CHARACTER_FRAME: `/${V}/images/webp/character-frame.webp`,
        BACKGROUND: `/${V}/images/webp/background.webp`,
        CRYSTAL_ACTIVE: `/${V}/images/webp/crystal-active.webp`,
        CRYSTAL_INACTIVE: `/${V}/images/webp/crystal-inactive.webp`,
        CHAR_AS: `/${V}/images/webp/as.webp`,
        CHAR_BR: `/${V}/images/webp/br.webp`,
        CHAR_GA: `/${V}/images/webp/ga.webp`,
        CHAR_KR: `/${V}/images/webp/kr.webp`,
        CHAR_LI: `/${V}/images/webp/li.webp`,
        CHAR_ZN: `/${V}/images/webp/zn.webp`,
    },
    SOUNDS: {
        CLICK: `/${V}/sounds/ui/click.mp3`,
        ACCEPTATION: `/${V}/sounds/ui/acceptation.mp3`,
        SWITCH: `/${V}/sounds/ui/switch.mp3`,
        DESACTIVATION: `/${V}/sounds/ui/desactivation.mp3`,
    }
};

export const ASSETS_TO_LOAD = {
    images: Object.values(CONST_ASSETS.IMAGES),
    sounds: Object.values(CONST_ASSETS.SOUNDS)
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