import { Crystal, Currency } from "./types";
import { CONST_ASSETS } from "./preloader";

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

export const characters = [
    {
        id: 0,
        symbol: "Kn",
        name: "Knight",
        img: CONST_ASSETS.IMAGES.CHAR_KNIGHT_FULL,
        img_h: CONST_ASSETS.IMAGES.CHAR_KNIGHT_FULL,
        color: "#00ffff",
        stat_hp: 10000, // nombre d epoints de vie max
        stat_energy: 100, // nombre de points d'énergie max
        stat_hp_regen: 0, // coef de regen par seconde
        stat_energy_regen: 2, // coef de regen par seconde
        stat_attack: 1, // nombre de points de dégats infligés à chaque attaque
        stat_critical: 0.99, // % de chances de faire un coup critique à chaque attaque
        stat_haste: 1, // coefficient de rapidité qui vient multiplier les temps de recharge et de lancement
        stat_def: 0.1, // coefficient de défense qui détermine le % de dégats réduits
    },
];

export const activeCharacterId = "Kn";
