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
        symbol: "As",
        name: "Arsenic",
        img: "/images/webp/As.webp",
        img_h: "/images/webp/As.webp",
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
        symbol: "Br",
        name: "Brome",
        img: "/images/webp/Br.webp",
        img_h: "/images/webp/Br.webp",
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
        symbol: "Ga",
        name: "Gallium",
        img: "/images/webp/Ga.webp",
        img_h: "/images/webp/Ga.webp",
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
    {
        id: 3,
        symbol: "Kr",
        name: "Krypton",
        img: "/images/webp/Kr.webp",
        img_h: "/images/webp/Kr.webp",
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
    {
        id: 4,
        symbol: "Li",
        name: "Lithium",
        img: "/images/webp/Li.webp",
        img_h: "/images/webp/Li.webp",
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
    {
        id: 5,
        symbol: "Zn",
        name: "Zinc",
        img: "/images/webp/Zn.webp",
        img_h: "/images/webp/Zn.webp",
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
