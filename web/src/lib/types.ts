export type Currency = {
    shards: number; // Éclats
    charges: number; // Charges (stock)
    electrons: number; // Électrons
    gold: number; // Golds
    bnb: number; // BNB
};

export type Crystal = {
    level: number;
    shards: number;
    shardsForNext: number;
    charges: number;
    chargesMax: number;
    chargesPerSec: number;
    slots: number; // slots personnages
};

export type StatBlock = {
    hp: number;
    energy: number;
    shield: number;
    atk: number;
    def: number;
    crit: number; // 0..1
    acc: number; // 0..1
    regen: number;
    haste: number;
};

export type Item = {
    id: string;
    name: string;
    slot:
    | "main"
    | "off"
    | "reinforcement"
    | "tactical"
    | "crypto"
    | "agent"
    | "drink";
    rarity: "C" | "U" | "R" | "E" | "L";
    score: number;
    stats?: Partial<StatBlock>;
    img: string;
};

export type Character = {
    id: number;
    symbol: string; // H, He, Li…
    name: string; // Hydrogène…
    width: number;
    height: number;
    family:
    | "metal"
    | "non-metal"
    | "metalloid"
    | "noble"
    | "halogen"
    | "alkali"
    | "alkaline-earth"
    | "other";
    level: number; // niveau perso (1..20)
    stats: StatBlock;
    img: string; // image du perso
    img_h: string; // portrait du perso

    equipped: Partial<Record<Item["slot"], Item>>;
    inventory: Item[]; // jusqu’à 30
};
