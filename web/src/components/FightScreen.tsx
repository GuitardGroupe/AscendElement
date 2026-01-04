'use client';

import { useSelectedCharacter } from "@/store/useSelectedCharacter";
import { useSoundStore } from "@/store/useSoundStore";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import CombatCrystal from "@/components/CombatCrystal";
import BattleZoneBackground from "@/components/BattleZoneBackground";
import HealthBar from "@/components/HealthBar";
import EnergyBar from "@/components/EnergyBar";
import CastBar from "@/components/CastBar";
import type { DamageEvent } from "@/components/DamagePop";
import SkillGrid from "@/components/SkillGrid";
import { Skill, skillSets, ElementKey } from "@/lib/skills";

import { CONST_ASSETS } from '@/lib/preloader';
const CONST_TITLE = "BATTLE";
const CONST_OPPONENT_NAME = "Gobelin stupide";
const CONST_OPPONENT_MAX_ENERGY = 20;
const CONST_OPPONENT_MAX_HP = 55;
const CONST_LABEL_FLEE = "Fuir";

const weapon = {
    id: 8,
    name: "Evasion",
    icon: CONST_ASSETS.IMAGES.SKILL_DODGE,
    cooldown: 500,
    energyCost: 0,
    castTime: 500,
    castSound: "CONST_SOUND_SWORD_CAST",
    impactSound: "CONST_SOUND_SWORD_IMPACT",
    damage: 2,
    heal: 0,
    stun: 0,
    recover: 0,
    shield: 0,
    interrupt: 0,
};

const stim = {
    id: 9,
    name: "Attaque légère",
    icon: CONST_ASSETS.IMAGES.ITEM_01,
    cooldown: 500,
    energyCost: 0,
    castTime: 500,
    castSound: "CONST_SOUND_SWORD_CAST",
    impactSound: "CONST_SOUND_SWORD_IMPACT",
    damage: 2,
    heal: 0,
    stun: 0,
    recover: 0,
    shield: 0,
    interrupt: 0,
};




interface FightScreenProps {
    onSwitchScreen: (screen: string) => void;
}

export default function FightScreen({ onSwitchScreen }: FightScreenProps) {

    const { playSound, playMusic, stopSound } = useSoundStore();
    const [winner, setWinner] = useState<string | null>(null);
    /*
        // MUSIC
        useEffect(() => {
            playMusic(CONST_ASSETS.SOUNDS.BATTLE_THEME_01, 0.1);
            return () => {
                stopSound(CONST_ASSETS.SOUNDS.BATTLE_THEME_01);
            };
        }, [playMusic, stopSound]);
    */

    // TIMER
    const [timer, setTimer] = useState(180);
    useEffect(() => {
        const i = setInterval(() => {
            setTimer((t) => (t > 0 ? t - 1 : 0));
        }, 1000);
        return () => clearInterval(i);
    }, []);

    // PLAYER
    const { selectedCharacter } = useSelectedCharacter();
    const playerBackground = selectedCharacter?.img ?? CONST_ASSETS.IMAGES.CHAR_LI;
    const playerName = selectedCharacter?.name ?? "Player";
    const playerColor = selectedCharacter?.color ?? "#00ffff";
    const [playerHealth, setPlayerHealth] = useState(
        selectedCharacter?.stat_hp ?? 50
    );
    const [playerEnergy, setPlayerEnergy] = useState(selectedCharacter?.stat_energy ?? 50);
    const [playerHitTime, setPlayerHitTime] = useState(0);
    const [playerDamageEvents, setPlayerDamageEvents] = useState<DamageEvent[]>(
        []
    );
    const [playerIsCasting, setPlayerIsCasting] = useState(false);
    const playerCastRef = useRef<NodeJS.Timeout | null>(null);
    const playerFinishTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [playerCurrentCastSkill, setPlayerCurrentCastSkill] =
        useState<Skill | null>(null);
    const [playerCastProgress, setPlayerCastProgress] = useState(0);
    const [playerCooldowns, setPlayerCooldowns] = useState<Record<number, number>>({});
    const skills = selectedCharacter
        ? skillSets[selectedCharacter?.symbol as ElementKey]
        : [];

    // OPPONENT
    const opponentBackground = CONST_ASSETS.IMAGES.MONSTER_GOBLIN;
    const opponentName = CONST_OPPONENT_NAME;
    const opponentColor = "#F54927";
    const [opponentHealth, setOpponentHealth] = useState(CONST_OPPONENT_MAX_HP);
    const [opponentEnergy, setOpponentEnergy] = useState(CONST_OPPONENT_MAX_ENERGY);
    const [opponentHitTime, setOpponentHitTime] = useState(0);
    const [opponentDamageEvents, setOpponentDamageEvents] = useState<
        DamageEvent[]
    >([]);
    const [opponentIsCasting, setOpponentIsCasting] = useState(false);
    const [opponentCastProgress, setOpponentCastProgress] = useState(0);

    // COOLDOWN & ENERGY REGEN
    useEffect(() => {
        const interval = setInterval(() => {
            // Cooldowns
            setPlayerCooldowns((prev) => {
                const next = { ...prev };
                let changed = false;
                for (const id in next) {
                    if (next[id] > 0) {
                        next[id] = Math.max(0, next[id] - 100);
                        changed = true;
                    }
                }
                return changed ? next : prev;
            });

            // Energy Regen (passive)
            setPlayerEnergy((e) => {
                const maxEnergy = selectedCharacter?.stat_energy ?? 100;
                const regenPerSec = selectedCharacter?.stat_energy_regen ?? 2;
                const regenPerTick = regenPerSec / 10; // 100ms interval

                if (e < maxEnergy) {
                    return Math.min(maxEnergy, e + regenPerTick);
                }
                return e;
            });
        }, 100);
        return () => clearInterval(interval);
    }, [selectedCharacter?.stat_energy, selectedCharacter?.stat_energy_regen]);

    const handleGameOver = () => {
        console.log("HANDLE GAME OVER")
        playSound(CONST_ASSETS.SOUNDS.ACCEPTATION, 0.6);
        onSwitchScreen("lobby");
    };

    // DAMAGE
    const handleDamageDone = (target: "player" | "opponent", id: string) => {
        if (target === "player") {
            setPlayerDamageEvents((prev) => prev.filter((d) => d.id !== id));
        } else {
            setOpponentDamageEvents((prev) => prev.filter((d) => d.id !== id));
        }
    };

    // GAME OVER
    const endCombat = (who: string) => {
        console.log("HANDLE END COMBAT")
        //if (winner) return;
        //setWinner(who);
        handleGameOver()
    };

    // FLEE
    const handleFlee = () => {
        console.log("HANDLE FLEE")
        endCombat("Fuite");
    };

    // TIME OVER
    useEffect(() => {
        if (timer === 0 && !winner) {
            flushSync(() => {
                setWinner("Temps écoulé");
            });
            setTimeout(() => handleGameOver, 3000);
        }
    }, [timer, winner]);

    // DAMAGE
    const pushDamageEvent = (
        target: "player" | "opponent",
        value: number,
        type: "normal" | "crit" | "heal" = "normal"
    ) => {
        const ev: DamageEvent = {
            id: Math.random().toString(36).slice(2),
            value,
            type,
        };

        if (target === "player") {
            setPlayerDamageEvents((prev) => [...prev, ev]);
        } else {
            setOpponentDamageEvents((prev) => [...prev, ev]);
        }
    };

    // DAMAGE
    const applyDamage = (target: "player" | "opponent", amount: number) => {
        const isCrit = Math.random() < 0.5;
        const finalAmount = isCrit ? Math.round(amount * 2) : amount;
        const damageType = isCrit ? "crit" : "normal";

        if (target === "player") {
            setPlayerHealth((hp) => {
                const newHP = Math.max(0, hp - amount);
                setPlayerHitTime(Date.now());
                pushDamageEvent("player", finalAmount, damageType);
                if (newHP <= 0) endCombat("Ennemi vainqueur");
                return newHP;
            });
        } else {
            setOpponentHealth((hp) => {
                const newHP = Math.max(0, hp - finalAmount);
                setOpponentHitTime(Date.now());
                pushDamageEvent("opponent", finalAmount, damageType);
                if (newHP <= 0) endCombat("Joueur vainqueur");
                return newHP;
            });
        }
    };

    // SKILL EFFECT
    const applySkillEffects = (skill: Skill) => {

        if (skill.damage > 0) {
            applyDamage("opponent", skill.damage);
        }



        /*
        if (skill.damage > 0) {
            applyDamage("enemy", skill.damage);
        }

        if (skill.heal > 0) {
            //healPlayer(skill.heal);
        }

        if (skill.stun > 0) {
            //applyStun("enemy", skill.stun);
        }

        if (skill.recover > 0) {
            //setEnergy((e) => Math.min(maxEnergy, e + skill.recover));
        }

        if (skill.shield > 0) {
            //applyShield("player", skill.shield);
        }

        if (skill.interrupt > 0) {
            //interruptCastOfEnemy();
        }*/
    };

    // INTERRUPT CAST
    const interruptCast = () => {
        if (playerCastRef.current) clearInterval(playerCastRef.current);
        if (playerFinishTimeoutRef.current) clearTimeout(playerFinishTimeoutRef.current);

        if (playerCurrentCastSkill?.castSound) {
            stopSound(playerCurrentCastSkill.castSound);
        }

        setPlayerIsCasting(false);
        setPlayerCurrentCastSkill(null);
        setPlayerCastProgress(0);
    };

    // CAST
    const startCast = (skill: Skill) => {
        if (playerCastRef.current) clearInterval(playerCastRef.current);

        setPlayerIsCasting(true);
        setPlayerCurrentCastSkill(skill);
        setPlayerCastProgress(0);

        playSound(skill.castSound);

        const duration = skill.castTime;
        const startTime = Date.now();
        const step = 16; // ~60 FPS

        playerCastRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const pct = Math.min(100, (elapsed / duration) * 100);
            setPlayerCastProgress(pct);

            if (pct >= 100) {
                clearInterval(playerCastRef.current!);
                playerCastRef.current = null;
                playerFinishTimeoutRef.current = setTimeout(() => {
                    if (skill.cooldown > 0) {
                        setPlayerCooldowns((prev) => ({
                            ...prev,
                            [skill.id]: skill.cooldown,
                        }));
                    }

                    setPlayerEnergy((e) => e - skill.energyCost);
                    setPlayerIsCasting(false);
                    playSound(skill.impactSound);
                    applySkillEffects(skill);
                    setPlayerCastProgress(0);
                    playerFinishTimeoutRef.current = null;
                }, 200);
            }
        }, step);
    };



    // HANDLE SKILL LAUNCH
    const handleSkill = (skill: number) => {
        if (skill == 4 || skill == 5) {
            /*
            const item = skill === 4 ? weapon : stim;
            if (playerCooldowns[item.id] > 0) return;
            if (playerEnergy < item.energyCost) return;

            if (item.cooldown > 0) {
                setPlayerCooldowns((prev) => ({
                    ...prev,
                    [item.id]: item.cooldown,
                }));
            }
            setPlayerEnergy((e) => e - item.energyCost);
            startCast(item as unknown as Skill);
            */
            return;

        }

        const skillToLaunch = skills[skill];
        if (!skillToLaunch) return;

        // CANCEL MECHANIC: If clicking the same skill while casting -> INTERRUPT and STOP
        if (playerIsCasting && playerCurrentCastSkill?.id === skillToLaunch.id) {
            interruptCast();
            playSound(CONST_ASSETS.SOUNDS.DESACTIVATION, 0.5);
            setPlayerCooldowns((prev) => ({
                ...prev,
                [skillToLaunch.id]: 1000,
            }));
            return;
        }

        if (playerCooldowns[skillToLaunch.id] > 0) {
            console.log("Skill is on cooldown");
            return;
        }

        if (playerEnergy < skillToLaunch.energyCost) {
            console.log("Not enough energy");
            return;
        }

        if (playerIsCasting) {
            interruptCast();
        }
        startCast(skillToLaunch);
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* BACKGROUND */}
            <div className="absolute inset-0 flex flex-col">
                {/* OPPONENT BACKGROUND */}
                <div className="relative flex-1">
                    <BattleZoneBackground
                        src={opponentBackground}
                        scale={1}
                        origin="origin-top-right"
                        objectPosition="object-[0%_0%]"
                        blur={0}
                    />
                    <DarkOverlay />
                    {/* OPPONNENT FRAME (LITHIUM RED) */}
                    <div className="absolute inset-0 pointer-events-none z-10"
                        style={{
                            boxShadow: 'inset 0 0 60px rgba(245, 73, 39, 0.2)',
                        }}
                    />
                    {/* OPPONENT AREA */}
                    <div className="absolute inset-0 flex-1 flex flex-col justify-end pb-15 pl-5 pr-5 gap-2">
                        {/* OPPONENT ENERGY */}
                        <div className="flex justify-end">
                            <div className="flex justify-start w-[40%]">
                                <EnergyBar
                                    current={opponentEnergy}
                                    max={CONST_OPPONENT_MAX_ENERGY}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            {/* OPPONENT BUFFS */}
                            <div className="flex flex-1 justify-start text-xs text-white/60">
                                {/* OPPONENT BUFFS */}
                            </div>
                            {/* OPPONENT HEALTH */}
                            <div className="flex-1 flex justify-end">
                                <HealthBar
                                    current={opponentHealth}
                                    max={CONST_OPPONENT_MAX_HP}
                                />
                            </div>
                        </div>
                        {/* OPPONENT NAME */}
                        <div className="mr-5 flex justify-end text-l font-semibold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                            {opponentName}
                        </div>
                        {/* OPPONENT CASTBAR */}
                        <div className="h-8 ">
                            <AnimatePresence>
                                {opponentIsCasting && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{
                                            opacity: 0,
                                            scaleX: 1,
                                            filter: "brightness(2)"
                                        }}
                                        className="flex items-center justify-center"
                                    >
                                        <div className="w-[35%]">
                                            <CastBar progress={opponentCastProgress} />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                    <div className="absolute inset-0 flex flex-col px-5 py-5">
                        <Title label={CONST_TITLE} />
                    </div>
                </div>
                {/* PLAYER BACKGROUND */}
                <div className="relative flex-2">
                    <BattleZoneBackground
                        src={playerBackground}
                        scale={1.5}
                        origin="origin-top-left"
                        objectPosition="object-[100%_0%]"
                        blur={0}
                    />
                    <DarkOverlay />
                    {/* PLAYER FRAME (HYDROGEN BLUE) */}
                    <div className="absolute inset-0 pointer-events-none z-10"
                        style={{
                            boxShadow: 'inset 0 0 60px rgba(0, 255, 255, 0.2)',
                        }}
                    />
                    {/* PLAYER AREA */}
                    <div className="absolute inset-0 flex-1 flex flex-col justify-start pt-10 pl-5 pr-5 gap-2">
                        {/* PLAYER CASTBAR */}
                        <div className="h-6 ">
                            <AnimatePresence>
                                {playerIsCasting && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{
                                            opacity: 0,
                                            scaleX: 1,
                                            filter: "brightness(2)"
                                        }}
                                        className="flex items-center justify-center"
                                    >
                                        <div className="w-[35%]">
                                            <CastBar
                                                progress={playerCastProgress}
                                                label={playerCurrentCastSkill?.name}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        {/* PLAYER NAME */}
                        <div className="flex items-center justify-center">
                            <div className="ml-5 flex-1 text-l font-semibold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                                {playerName}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            {/* PLAYER HEALTH */}
                            <div className="flex-1 flex justify-start">
                                <HealthBar
                                    current={playerHealth}
                                    max={selectedCharacter?.stat_hp ?? 100}
                                />
                            </div>
                            {/* PLAYER BUFFS */}
                            <div className="flex flex-1 justify-end text-xs text-white/60">
                                {/* PLAYER BUFFS */}
                            </div>
                        </div>
                        {/* PLAYER ENERGY */}
                        <div className="flex justify-start w-[40%]">
                            <EnergyBar
                                current={playerEnergy}
                                max={selectedCharacter?.stat_energy ?? 50}
                            />
                        </div>

                    </div>

                </div>
                {/* OVERLAY AREA (UI, Crystals, Skills) */}
                <div className="absolute inset-0 flex flex-col pointer-events-none">

                    {/* 1. MOCK OPPONENT SPACE (flex-1) */}
                    <div className="flex-1" />

                    {/* 2. CRYSTALS ON LINE */}
                    <div className="relative flex items-center justify-center gap-2 z-10 h-0">
                        <CombatCrystal
                            hp={playerHealth}
                            maxHp={100}
                            damageEvents={playerDamageEvents}
                            onDamageDone={(id) => handleDamageDone("player", id)}
                            lastHitTimestamp={playerHitTime}
                            color={playerColor}
                        />

                        <motion.button
                            onClick={() => endCombat("Temps stoppé")}
                            className="pointer-events-auto w-16 h-16 rounded-full border-4 border-cyan-400 flex items-center justify-center text-xl font-bold shadow-[0_0_14px_rgba(0,255,255,0.6)] bg-black/40"
                            whileTap={{ scale: 0.9 }}
                        >
                            {timer}
                        </motion.button>

                        <CombatCrystal
                            hp={opponentHealth}
                            maxHp={100}
                            damageEvents={opponentDamageEvents}
                            onDamageDone={(id) => handleDamageDone("opponent", id)}
                            lastHitTimestamp={opponentHitTime}
                            color={opponentColor}
                        />
                    </div>

                    {/* 3. MOCK PLAYER SPACE (flex-2) */}
                    <div className="flex-2 relative flex flex-col">


                        {/* SKILLS & FLEE at the bottom of the player zone */}
                        <div className="mt-auto p-5 flex items-end justify-between gap-3 pt-2">
                            {/* FLEE */}
                            <button
                                onClick={handleFlee}
                                className="pointer-events-auto w-16 h-16 rounded-xl bg-red-700/80 border border-red-400/80 flex items-center justify-center text-xl font-bold shadow-[0_0_15px_rgba(255,0,0,0.6)] active:scale-95"
                            >
                                {CONST_LABEL_FLEE}
                            </button>
                            <SkillGrid
                                skills={skills}
                                weapon={weapon}
                                stim={stim}
                                cooldowns={playerCooldowns}
                                currentEnergy={playerEnergy}
                                isCasting={playerIsCasting}
                                currentCastSkillId={playerCurrentCastSkill?.id}
                                onSkill={(type) => handleSkill(type)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DarkOverlay() {
    return <div className="absolute inset-0 bg-black/50" />;
}

function Title({ label = "label" }: { label?: string }) {
    return (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 text-lg font-bold tracking-[0.3em] uppercase text-white" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}>
            {label}
        </div>
    );
}


