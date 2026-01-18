import { CONST_ASSETS } from "./preloader";

export type MONSTER = {
    id: number;
    name: string;
    img: string;
    stat_celerity: number;
    stat_hp: number;
    stat_energy: number;
    stat_hp_regen: number;
    stat_energy_regen: number;
    stat_attack: number;
    stat_critical: number;
    stat_haste: number;
    stat_def: number;
    level: number;
    description: string;
    skills: number[];
    loot_table: {
        item_id?: number; // If undefined, it's a currency or generic
        chance: number; // 0-1
        min_qty: number;
        max_qty: number;
        type?: "currency_gold" | "currency_soulshard" | "currency_xp" | "item";
    }[];
};

export type MonsterSkill = {
    id: number;
    power: number;
    name: string;
    cooldown: number;
    energyCost: number;
    castTime: number;
    damage: number;
    heal: number;
    stun: number;
    recover: number;
    shield: number;
    interrupt: number;
    castSound?: string;
    impactSound?: string;
};

export const monsters: MONSTER[] = [
    {
        id: 0,
        name: "Gobelin",
        img: CONST_ASSETS.IMAGES.MONSTER_GOBLIN,
        stat_celerity: 2000,
        stat_hp: 80, // nombre d epoints de vie max
        stat_energy: 80, // nombre de points d'énergie max
        stat_hp_regen: 0, // coef de regen par seconde
        stat_energy_regen: 5, // coef de regen par seconde
        stat_attack: 1, // nombre de points de dégats infligés à chaque attaque
        stat_critical: 0.1, // % de chances de faire un coup critique à chaque attaque
        stat_haste: 1, // coefficient de rapidité qui vient multiplier les temps de recharge et de lancement
        stat_def: 0.1, // coefficient de défense qui détermine le % de dégats réduits
        level: 1,
        description: "Un charognard agile qui rôde dans les décombres de l'infra-système. Rapide mais fragile.",
        skills: [0, 1],
        loot_table: [
            { type: "currency_gold", chance: 1, min_qty: 10, max_qty: 50 },
            { type: "currency_xp", chance: 1, min_qty: 20, max_qty: 20 },
            { item_id: 0, type: "item", chance: 0.2, min_qty: 1, max_qty: 1 }, // Stim
            { item_id: 1, type: "item", chance: 0.2, min_qty: 1, max_qty: 1 }, // Wood Sword
            { item_id: 2, type: "item", chance: 0.2, min_qty: 1, max_qty: 1 }, // Novice Armor
            { item_id: 3, type: "item", chance: 0.2, min_qty: 1, max_qty: 1 }, // Red Gem
            { item_id: 4, type: "item", chance: 0.2, min_qty: 1, max_qty: 1 }, // Sorcerer Book
            { item_id: 5, type: "item", chance: 0.2, min_qty: 1, max_qty: 1 }, // Noble Ring
        ]
    },
];

export const monstersSkills: MonsterSkill[] = [
    {
        id: 0,
        power: 1,
        name: "Griffure",
        cooldown: 2000,
        energyCost: 0,
        castTime: 750,
        damage: 5,
        heal: 0,
        stun: 0,
        recover: 0,
        shield: 0,
        interrupt: 0,
        castSound: CONST_ASSETS.SOUNDS.GOBLIN_CAST_LIGHT,
        impactSound: CONST_ASSETS.SOUNDS.GOBLIN_IMPACT_LIGHT,
    },
    {
        id: 1,
        power: 2,
        name: "Morsure",
        cooldown: 6000,
        energyCost: 60,
        castTime: 3000,
        damage: 20,
        heal: 0,
        stun: 0,
        recover: 0,
        shield: 0,
        interrupt: 0,
        castSound: CONST_ASSETS.SOUNDS.GOBLIN_CAST_HEAVY,
        impactSound: CONST_ASSETS.SOUNDS.GOBLIN_IMPACT_HEAVY,
    }
];