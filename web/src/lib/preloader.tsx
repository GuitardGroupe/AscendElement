const V = "v1";

export const CONST_ASSETS = {
    IMAGES: {
        CARD_FRAME: `/${V}/images/webp/cardframe.webp`,
        CHARACTER_FRAME: `/${V}/images/webp/character-frame.webp`,
        BACKGROUND: `/${V}/images/webp/background.webp`,
        CRYSTAL_ACTIVE: `/${V}/images/webp/crystal-active.webp`,
        CRYSTAL_ACTIVE_ALPHA: `/${V}/images/webp/crystal-active-alpha.webp`,
        CRYSTAL_INACTIVE: `/${V}/images/webp/crystal-inactive.webp`,
        CHAR_AS: `/${V}/images/webp/as.webp`,
        CHAR_BR: `/${V}/images/webp/br.webp`,
        CHAR_GA: `/${V}/images/webp/ga.webp`,
        CHAR_KR: `/${V}/images/webp/kr.webp`,
        CHAR_LI: `/${V}/images/webp/li.webp`,
        CHAR_ZN: `/${V}/images/webp/zn.webp`,
        CHAR_KNIGHT: `/${V}/images/webp/knight.webp`,
        CHAR_KNIGHT_FULL: `/${V}/images/webp/knightfull.webp`,
        SKILL_1: `/${V}/images/webp/skill01.webp`,
        SKILL_2: `/${V}/images/webp/skill02.webp`,
        SKILL_3: `/${V}/images/webp/skill03.webp`,
        SKILL_4: `/${V}/images/webp/skill04.webp`,
        SKILL_01: `/${V}/images/webp/skilllight.webp`,
        SKILL_02: `/${V}/images/webp/skillheavy.webp`,
        SKILL_03: `/${V}/images/webp/skillcontrol.webp`,
        SKILL_04: `/${V}/images/webp/skillultimate.webp`,
        ITEM_01: `/${V}/images/webp/itemstim.webp`,
        ITEM_02: `/${V}/images/webp/itemgun.webp`,
        SKILL_INFUSOR: `/${V}/images/webp/infusor.webp`,
        SKILL_WEAPON: `/${V}/images/webp/weapon.webp`,
        FIGHT_CRYSTAL_DAMAGED: `/${V}/images/webp/fightcrystaldamaged.webp`,
        FIGHT_CRYSTAL_INTACT: `/${V}/images/webp/fightcrystalintact.webp`,
        MONSTER_GOBLIN: `/${V}/images/webp/goblin.webp`,
    },
    SOUNDS: {
        CLICK: `/${V}/sounds/ui/click.mp3`,
        ACCEPTATION: `/${V}/sounds/ui/acceptation.mp3`,
        SWITCH: `/${V}/sounds/ui/switch.mp3`,
        DESACTIVATION: `/${V}/sounds/ui/desactivation.mp3`,
        SPELL_CAST: `/${V}/sounds/ui/spellcast.mp3`,
        SPELL_IMPACT: `/${V}/sounds/ui/spellimpact.mp3`,
        SWORD_CAST: `/${V}/sounds/ui/swordcast.mp3`,
        SWORD_IMPACT: `/${V}/sounds/ui/swordimpact.mp3`,
        CONTROL_IMPACT: `/${V}/sounds/ui/control.mp3`,
        ULTIMATE_IMPACT: `/${V}/sounds/ui/ultimateimpact.mp3`,
        ULTIMATE_CAST: `/${V}/sounds/ui/ultimatecast.mp3`,
        BATTLE_THEME_01: `/${V}/sounds/ui/battletheme01.mp3`,
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