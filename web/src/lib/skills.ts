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
};

export type ElementKey = "As" | "Br" | "Ga" | "Kr" | "Kn" | "Zn";

export const skillSets: Record<ElementKey, Skill[]> = {
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
        },
        {
            id: 2,
            name: "Flèche magique",
            icon: CONST_SKILL02_IMG,
            cooldown: 2000,
            energyCost: 10,
            castTime: 1500,
            castSound: CONST_SOUND_SPELL_CAST,
            impactSound: CONST_SOUND_SPELL_IMPACT,
            damage: 5,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 0,
        },
        {
            id: 3,
            name: "Choc",
            icon: CONST_SKILL03_IMG,
            cooldown: 4000,
            energyCost: 20,
            castTime: 0,
            castSound: "",
            impactSound: CONST_ASSETS.SOUNDS.CONTROL_IMPACT,
            damage: 10,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 1,
        },
        {
            id: 4,
            name: "Frappe divine",
            icon: CONST_SKILL04_IMG,
            cooldown: 8000,
            energyCost: 30,
            castTime: 4500,
            castSound: CONST_ASSETS.SOUNDS.ULTIMATE_CAST,
            impactSound: CONST_ASSETS.SOUNDS.ULTIMATE_IMPACT,
            damage: 30,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 0,
        },
    ],
    Br: [
        {
            id: 1,
            name: "Légère",
            icon: CONST_SKILL01_IMG,
            cooldown: 0.25,
            energyCost: 0,
            castTime: 0,
            castSound: CONST_SOUND_SWORD_CAST,
            impactSound: CONST_SOUND_SWORD_IMPACT,
            damage: 2,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 0,
        },
        {
            id: 2,
            name: "Lourde",
            icon: CONST_SKILL02_IMG,
            cooldown: 0.25,
            energyCost: 10,
            castTime: 1,
            castSound: CONST_SOUND_SWORD_CAST,
            impactSound: CONST_SOUND_SWORD_IMPACT,
            damage: 5,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 0,
        },
        {
            id: 3,
            name: "Contrôle",
            icon: CONST_SKILL03_IMG,
            cooldown: 0.25,
            energyCost: 20,
            castTime: 2,
            castSound: CONST_SOUND_SPELL_CAST,
            impactSound: CONST_SOUND_SPELL_IMPACT,
            damage: 10,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 0,
        },
        {
            id: 4,
            name: "Ultime",
            icon: CONST_SKILL04_IMG,
            cooldown: 0.25,
            energyCost: 30,
            castTime: 3,
            castSound: CONST_SOUND_SPELL_CAST,
            impactSound: CONST_SOUND_SPELL_IMPACT,
            damage: 15,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 0,
        },
    ],
    Ga: [
        {
            id: 1,
            name: "Légère",
            icon: CONST_SKILL01_IMG,
            cooldown: 0.25,
            energyCost: 0,
            castTime: 0,
            castSound: CONST_SOUND_SWORD_CAST,
            impactSound: CONST_SOUND_SWORD_IMPACT,
            damage: 1,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 0,
        },
        {
            id: 2,
            name: "Lourde",
            icon: CONST_SKILL02_IMG,
            cooldown: 0.25,
            energyCost: 10,
            castTime: 1,
            castSound: CONST_SOUND_SWORD_CAST,
            impactSound: CONST_SOUND_SWORD_IMPACT,
            damage: 2,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 0,
        },
        {
            id: 3,
            name: "Contrôle",
            icon: CONST_SKILL03_IMG,
            cooldown: 0.25,
            energyCost: 20,
            castTime: 2,
            castSound: CONST_SOUND_SPELL_CAST,
            impactSound: CONST_SOUND_SPELL_IMPACT,
            damage: 1,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 0,
        },
        {
            id: 4,
            name: "Ultime",
            icon: CONST_SKILL04_IMG,
            cooldown: 0.25,
            energyCost: 30,
            castTime: 3,
            castSound: CONST_SOUND_SPELL_CAST,
            impactSound: CONST_SOUND_SPELL_IMPACT,
            damage: 10,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 0,
        },
    ],
    Kr: [
        {
            id: 1,
            name: "Légère",
            icon: CONST_SKILL01_IMG,
            cooldown: 0.25,
            energyCost: 0,
            castTime: 0,
            castSound: CONST_SOUND_SWORD_CAST,
            impactSound: CONST_SOUND_SWORD_IMPACT,
            damage: 2,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 0,
        },
        {
            id: 2,
            name: "Lourde",
            icon: CONST_SKILL02_IMG,
            cooldown: 0.25,
            energyCost: 10,
            castTime: 1,
            castSound: CONST_SOUND_SWORD_CAST,
            impactSound: CONST_SOUND_SWORD_IMPACT,
            damage: 5,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 0,
        },
        {
            id: 3,
            name: "Contrôle",
            icon: CONST_SKILL03_IMG,
            cooldown: 0.25,
            energyCost: 20,
            castTime: 2,
            castSound: CONST_SOUND_SPELL_CAST,
            impactSound: CONST_SOUND_SPELL_IMPACT,
            damage: 10,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 0,
        },
        {
            id: 4,
            name: "Ultime",
            icon: CONST_SKILL04_IMG,
            cooldown: 0.25,
            energyCost: 30,
            castTime: 3,
            castSound: CONST_SOUND_SPELL_CAST,
            impactSound: CONST_SOUND_SPELL_IMPACT,
            damage: 15,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 0,
        },
    ],
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
            damage: 5,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 0,
        },
        {
            id: 3,
            name: "Choc",
            icon: CONST_SKILL03_IMG,
            cooldown: 4000,
            energyCost: 50,
            castTime: 0,
            castSound: "",
            impactSound: CONST_ASSETS.SOUNDS.CONTROL_IMPACT,
            damage: 10,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 1,
        },
        {
            id: 4,
            name: "Frappe divine",
            icon: CONST_SKILL04_IMG,
            cooldown: 8000,
            energyCost: 90,
            castTime: 4500,
            castSound: CONST_ASSETS.SOUNDS.ULTIMATE_CAST,
            impactSound: CONST_ASSETS.SOUNDS.ULTIMATE_IMPACT,
            damage: 30,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 0,
        },
    ],
    Zn: [
        {
            id: 1,
            name: "Légère",
            icon: CONST_SKILL01_IMG,
            cooldown: 0.25,
            energyCost: 0,
            castTime: 0,
            castSound: CONST_SOUND_SWORD_CAST,
            impactSound: CONST_SOUND_SWORD_IMPACT,
            damage: 2,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 0,
        },
        {
            id: 2,
            name: "Lourde",
            icon: CONST_SKILL02_IMG,
            cooldown: 0.25,
            energyCost: 10,
            castTime: 1,
            castSound: CONST_SOUND_SWORD_CAST,
            impactSound: CONST_SOUND_SWORD_IMPACT,
            damage: 5,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 0,
        },
        {
            id: 3,
            name: "Contrôle",
            icon: CONST_SKILL03_IMG,
            cooldown: 0.25,
            energyCost: 20,
            castTime: 2,
            castSound: CONST_SOUND_SPELL_CAST,
            impactSound: CONST_SOUND_SPELL_IMPACT,
            damage: 10,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 0,
        },
        {
            id: 4,
            name: "Ultime",
            icon: CONST_SKILL04_IMG,
            cooldown: 0.25,
            energyCost: 30,
            castTime: 3,
            castSound: CONST_SOUND_SPELL_CAST,
            impactSound: CONST_SOUND_SPELL_IMPACT,
            damage: 15,
            heal: 0,
            stun: 0,
            recover: 0,
            shield: 0,
            interrupt: 0,
        },
    ],
};

export const defenses = [
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
    }
]