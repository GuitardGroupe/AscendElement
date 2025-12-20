import { Crystal, Currency, Character, Item } from "./types";

export const mockCrystal: Crystal = {
    level: 1,
    shards: 12,
    shardsForNext: 50,
    charges: 18,
    chargesMax: 50,
    chargesPerSec: 0.05,
    slots: 1,
};

export const mockWallet: Currency = {
    shards: 12,
    charges: 18,
    electrons: 0,
    gold: 123,
    bnb: 0,
};

const mkItem = (
    id: string,
    slot: Item["slot"],
    name: string,
    rarity: Item["rarity"],
    img: string
): Item => ({
    id,
    slot,
    name,
    rarity,
    score: Math.floor(Math.random() * 100) + 50,
    img,
});

export const characters = [
    {
        id: 0,
        symbol: "H",
        name: "Hydrogen",
        img: "/images/characters/H.png",
        img_h: "/images/characters/H_h.png",
        color: "#00ffff",
        stat_hp: 100, // nombre d epoints de vie max
        stat_energy: 100, // nombre de points d'énergie max
        stat_hp_regen: 0, // coef de regen par seconde
        stat_energy_regen: 10, // coef de regen par seconde
        stat_attack: 1, // nombre de points de dégats infligés à chaque attaque
        stat_critical: 0.1, // % de chances de faire un coup critique à chaque attaque
        stat_haste: 1, // coefficient de rapidité qui vient multiplier les temps de recharge et de lancement
        stat_def: 0.1, // coefficient de défense qui détermine le % de dégats réduits
    },
    {
        id: 1,
        symbol: "He",
        name: "Helium",
        img: "/images/characters/He.png",
        img_h: "/images/characters/He_h.png",
        color: "#ff9eff",
        stat_hp: 100, // nombre d epoints de vie max
        stat_energy: 100, // nombre de points d'énergie max
        stat_hp_regen: 0, // coef de regen par seconde
        stat_energy_regen: 10, // coef de regen par seconde
        stat_attack: 1, // nombre de points de dégats infligés à chaque attaque
        stat_critical: 0.1, // % de chances de faire un coup critique à chaque attaque
        stat_haste: 1, // coefficient de rapidité qui vient multiplier les temps de recharge et de lancement
        stat_def: 0.1, // coefficient de défense qui détermine le % de dégats réduits
    },
    {
        id: 2,
        symbol: "Li",
        name: "Lithium",
        img: "/images/characters/Li.png",
        img_h: "/images/characters/Li_h.png",
        color: "#F54927",
        stat_hp: 100, // nombre d epoints de vie max
        stat_energy: 100, // nombre de points d'énergie max
        stat_hp_regen: 0, // coef de regen par seconde
        stat_energy_regen: 10, // coef de regen par seconde
        stat_attack: 1, // nombre de points de dégats infligés à chaque attaque
        stat_critical: 0.1, // % de chances de faire un coup critique à chaque attaque
        stat_haste: 1, // coefficient de rapidité qui vient multiplier les temps de recharge et de lancement
        stat_def: 0.1, // coefficient de défense qui détermine le % de dégats réduits
    },
];

export const activeCharacterId = "H";
