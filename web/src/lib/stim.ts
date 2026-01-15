import { CONST_ASSETS } from "./preloader";

export type Stim = {
    id: number;
    name: string;
    img: string;
    sound: string;
    color: string;
    heal: number;
    cooldown: number;
    usages: number;
    description: string;
};

export const stims = [
    {
        id: 0,
        name: "Cartouche de soin",
        img: CONST_ASSETS.IMAGES.ITEM_01,
        sound: CONST_ASSETS.SOUNDS.HEAL,
        color: "#00ffff",
        heal: 2000,
        cooldown: 2000,
        usages: 3,
        description: "Un module de soin portable pour restaurer vos points de vie en combat."
    },
];