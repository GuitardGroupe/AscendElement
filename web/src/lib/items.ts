import { CONST_ASSETS } from '@/lib/preloader';

export type Currency = {
    id: number;
    name: string;
    icon: string;
};
export const currencies = [
    {
        id: 0,
        name: "Or",
        icon: CONST_ASSETS.IMAGES.CURRENCY_GOLDCOIN,
    },
    {
        id: 1,
        name: "Éclat d'âme",
        icon: CONST_ASSETS.IMAGES.CURRENCY_SOULSHARD,
    },
    {
        id: 2,
        name: "Expérience",
        icon: CONST_ASSETS.IMAGES.CURRENCY_EXPERIENCE,
    },
];

export type Item = {
    id: number;
    name: string;
    rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";
    icon: string;
    type: "Weapon" | "Armor" | "Consumable" | "Ring" | "Book" | "Gem";
    attack: number;
    critical: number;
    health: number;
    energy: number;
    sound: string;
    color: string;
    heal: number;
    cooldown: number;
    usages: number;
    description: string;
};

export const items = [
    {
        id: 0,
        name: "Cartouche de soin",
        rarity: "Rare",
        icon: CONST_ASSETS.IMAGES.ITEM_STIMHEALTH,
        type: "Consumable",
        attack: 0,
        critical: 0,
        health: 0,
        energy: 0,
        sound: CONST_ASSETS.SOUNDS.HEAL,
        color: "#00ffff",
        heal: 2000,
        cooldown: 2000,
        usages: 3,
        description: "Un module de soin portable pour restaurer vos points de vie en combat.",
    },
    {
        id: 1,
        name: "Épée en bois",
        icon: CONST_ASSETS.IMAGES.ITEM_WOODSWORD,
        type: "Weapon",
        attack: 10,
        critical: 0,
        health: 0,
        energy: 0,
        sound: "",
        color: "#00ffff",
        heal: 0,
        cooldown: 0,
        usages: 0,
        description: "Epée d'entraînement dérobée à un bambin du coin. Pas de quoi être fier.",
    },
    {
        id: 2,
        name: "Armure de novice",
        icon: CONST_ASSETS.IMAGES.ITEM_ARMOR,
        type: "Armor",
        attack: 0,
        critical: 0,
        health: 10,
        energy: 10,
        sound: "",
        color: "#00ffff",
        heal: 0,
        cooldown: 0,
        usages: 0,
        description: "Vieille armure de novice. Elle a vu mieux.",
    },
    {
        id: 3,
        name: "Gemme rouge",
        icon: CONST_ASSETS.IMAGES.ITEM_GEM,
        type: "Gem",
        attack: 0,
        critical: 0,
        health: 10,
        energy: 0,
        sound: "",
        color: "#00ffff",
        heal: 0,
        cooldown: 0,
        usages: 0,
        description: "Une gemme rouge. Elle augmente les points de vie. Ne pas insérer dans un orifice inapproprié.",
    },
    {
        id: 4,
        name: "Grimoire sorcier",
        icon: CONST_ASSETS.IMAGES.ITEM_BOOK,
        type: "Book",
        attack: 0,
        critical: 0,
        health: 0,
        energy: 30,
        sound: "",
        color: "#00ffff",
        heal: 0,
        cooldown: 0,
        usages: 0,
        description: "Un grimoire sorcier. Il augmente votre énergie. Ne pas lire les incantations à voix haute.",
    },
    {
        id: 5,
        name: "Bague de noble",
        icon: CONST_ASSETS.IMAGES.ITEM_RING,
        type: "Ring",
        attack: 0,
        critical: 0,
        health: 10,
        energy: 0,
        sound: "",
        color: "#00ffff",
        heal: 0,
        cooldown: 0,
        usages: 0,
        description: "Une bague de noble. Elle augmente vos points de vie.",
    },
];


