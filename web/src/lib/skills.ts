import { CONST_ASSETS } from '@/lib/preloader';

const CONST_SKILL01_IMG = CONST_ASSETS.IMAGES.SKILL_01;
const CONST_SKILL02_IMG = CONST_ASSETS.IMAGES.SKILL_02;
const CONST_SKILL03_IMG = CONST_ASSETS.IMAGES.SKILL_03;
const CONST_SKILL04_IMG = CONST_ASSETS.IMAGES.SKILL_04;
const CONST_SOUND_SPELL_CAST = CONST_ASSETS.SOUNDS.SPELL_CAST;
const CONST_SOUND_SPELL_IMPACT = CONST_ASSETS.SOUNDS.SPELL_IMPACT;
const CONST_SOUND_SWORD_CAST = CONST_ASSETS.SOUNDS.SWORD_CAST;
const CONST_SOUND_SWORD_IMPACT = CONST_ASSETS.SOUNDS.SWORD_IMPACT;

export type Skill = {
    id: number;
    name: string;
    icon: string;

    cooldown: number;
    energyCost: number;
    castTime: number;

    castSound: string;
    impactSound: string;

    damage: number;
    heal: number;
    stun: number;
    recover: number;
    shield: number;
    interrupt: number;
    description: string;
};

export type Combo = {
    id: number;
    name: string;

    energyRestored: number;

    impactSound: string;
    comboSound: string;

    damage: number;

};

export type Item = {
    id: number;
    name: string;
    icon: string;

    cooldown: number;
    energyCost: number;
    castTime: number;

    castSound: string;
    impactSound: string;

    damage: number;
    heal: number;
    stun: number;
    recover: number;
    shield: number;
    interrupt: number;
    description: string;
};

export type Defense = {
    id: number;
    name: string;
    icon: string;

    cooldown: number;
    duration: number;

    sound: string;

    shield: number;
    interrupt: number;
    absorb: number;
    dodge: number;
    reflect: number;
    stun: number;
    description: string;
};

export type ElementKey = "Kn" | "Li" | "As";

export const skillSets: Record<ElementKey, Skill[]> = {
    Kn: [
        {
            id: 1,
            name: "Frappe",
            icon: CONST_SKILL01_IMG,
            cooldown: 800,
            energyCost: 0,
            castTime: 750,
            castSound: CONST_SOUND_SWORD_CAST,
            impactSound: CONST_SOUND_SWORD_IMPACT,
            damage: 5,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 0,
            description: "Une attaque rapide et basique infligeant des dégâts modérés."
        },
        {
            id: 2,
            name: "Flèche magique",
            icon: CONST_SKILL02_IMG,
            cooldown: 2000,
            energyCost: 25,
            castTime: 1500,
            castSound: CONST_SOUND_SPELL_CAST,
            impactSound: CONST_SOUND_SPELL_IMPACT,
            damage: 15,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 0,
            description: "Lance un projectile d'énergie pure sur l'ennemi."
        },
        {
            id: 3,
            name: "Choc",
            icon: CONST_SKILL03_IMG,
            cooldown: 4000,
            energyCost: 40,
            castTime: 0,
            castSound: "",
            impactSound: CONST_ASSETS.SOUNDS.CONTROL_IMPACT,
            damage: 10,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 1,
            description: "Une explosion d'énergie instantanée qui interrompt l'adversaire."
        },
        {
            id: 4,
            name: "Frappe divine",
            icon: CONST_SKILL04_IMG,
            cooldown: 8000,
            energyCost: 80,
            castTime: 4500,
            castSound: CONST_ASSETS.SOUNDS.ULTIMATE_CAST,
            impactSound: CONST_ASSETS.SOUNDS.ULTIMATE_IMPACT,
            damage: 25,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 0,
            description: "Une attaque dévastatrice invoquant la puissance des cieux."
        },

    ],
    Li: [
        {
            id: 1,
            name: "Frappe",
            icon: CONST_SKILL01_IMG,
            cooldown: 800,
            energyCost: 0,
            castTime: 750,
            castSound: CONST_SOUND_SWORD_CAST,
            impactSound: CONST_SOUND_SWORD_IMPACT,
            damage: 5,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 0,
            description: "Une attaque rapide et basique infligeant des dégâts modérés."
        },
        {
            id: 2,
            name: "Flèche magique",
            icon: CONST_SKILL02_IMG,
            cooldown: 2000,
            energyCost: 25,
            castTime: 1500,
            castSound: CONST_SOUND_SPELL_CAST,
            impactSound: CONST_SOUND_SPELL_IMPACT,
            damage: 15,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 0,
            description: "Lance un projectile d'énergie pure sur l'ennemi."
        },
        {
            id: 3,
            name: "Choc",
            icon: CONST_SKILL03_IMG,
            cooldown: 4000,
            energyCost: 40,
            castTime: 0,
            castSound: "",
            impactSound: CONST_ASSETS.SOUNDS.CONTROL_IMPACT,
            damage: 10,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 1,
            description: "Une explosion d'énergie instantanée qui interrompt l'adversaire."
        },
        {
            id: 4,
            name: "Frappe divine",
            icon: CONST_SKILL04_IMG,
            cooldown: 8000,
            energyCost: 80,
            castTime: 4500,
            castSound: CONST_ASSETS.SOUNDS.ULTIMATE_CAST,
            impactSound: CONST_ASSETS.SOUNDS.ULTIMATE_IMPACT,
            damage: 25,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 0,
            description: "Une attaque dévastatrice invoquant la puissance des cieux."
        },

    ],
    As: [
        {
            id: 1,
            name: "Frappe",
            icon: CONST_SKILL01_IMG,
            cooldown: 800,
            energyCost: 0,
            castTime: 750,
            castSound: CONST_SOUND_SWORD_CAST,
            impactSound: CONST_SOUND_SWORD_IMPACT,
            damage: 5,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 0,
            description: "Une attaque rapide et basique infligeant des dégâts modérés."
        },
        {
            id: 2,
            name: "Flèche magique",
            icon: CONST_SKILL02_IMG,
            cooldown: 2000,
            energyCost: 25,
            castTime: 1500,
            castSound: CONST_SOUND_SPELL_CAST,
            impactSound: CONST_SOUND_SPELL_IMPACT,
            damage: 15,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 0,
            description: "Lance un projectile d'énergie pure sur l'ennemi."
        },
        {
            id: 3,
            name: "Choc",
            icon: CONST_SKILL03_IMG,
            cooldown: 4000,
            energyCost: 40,
            castTime: 0,
            castSound: "",
            impactSound: CONST_ASSETS.SOUNDS.CONTROL_IMPACT,
            damage: 10,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 1,
            description: "Une explosion d'énergie instantanée qui interrompt l'adversaire."
        },
        {
            id: 4,
            name: "Frappe divine",
            icon: CONST_SKILL04_IMG,
            cooldown: 8000,
            energyCost: 80,
            castTime: 4500,
            castSound: CONST_ASSETS.SOUNDS.ULTIMATE_CAST,
            impactSound: CONST_ASSETS.SOUNDS.ULTIMATE_IMPACT,
            damage: 25,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 0,
            description: "Une attaque dévastatrice invoquant la puissance des cieux."
        },

    ],

};

export const defenses: Defense[] = [
    {
        id: 20,
        name: "Esquive",
        icon: CONST_ASSETS.IMAGES.SKILL_DODGE,

        cooldown: 5000,
        duration: 500,

        sound: CONST_ASSETS.SOUNDS.AVOID,

        shield: 0,
        interrupt: 0,
        absorb: 0,
        dodge: 1,
        reflect: 0,
        stun: 0,
        description: "Une manoeuvre défensive rapide pour éviter les attaques ennemies."
    }
]

export const combos: Combo[] = [
    {
        id: 1,
        name: "combo",
        energyRestored: 10,
        comboSound: CONST_ASSETS.SOUNDS.COMBO,
        impactSound: CONST_SOUND_SWORD_IMPACT,
        damage: 5,
    }
]