'use client';

import { useSelectedCharacter } from "@/store/useSelectedCharacter";
import { useSoundStore } from "@/store/useSoundStore";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import CombatCrystal from "@/components/CombatCrystal";
import BattleZoneBackground from "@/components/BattleZoneBackground";
import HealthBar from "@/components/HealthBar";
import EnergyBar from "@/components/EnergyBar";
import CastBar from "@/components/CastBar";
import type { DamageEvent } from "@/components/DamagePop";
import SkillGrid from "@/components/SkillGrid";
import { Skill, skillSets, ElementKey, defenses, Defense, combos } from "@/lib/skills";
import { monstersSkills, monsters, MonsterSkill } from "@/lib/monsters";
import { stims } from "@/lib/stim";

import { CONST_ASSETS } from '@/lib/preloader';
const CONST_TITLE = "BATTLE";
const CONST_LABEL_FLEE = "Fuir";


interface FightScreenProps {
    onSwitchScreen: (screen: string) => void;
}

export default function FightScreen({ onSwitchScreen }: FightScreenProps) {

    const { playSound, stopSound } = useSoundStore();
    const [winner, setWinner] = useState<string | null>(null);
    const [combatResult, setCombatResult] = useState<'victory' | 'defeat' | null>(null);
    const opponent = monsters[0];

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

    // STIMS
    const [stimUsages, setStimUsages] = useState<Record<number, number>>(() => {
        const initial: Record<number, number> = {};
        stims.forEach(s => initial[s.id] = s.usages);
        return initial;
    });
    const [isHealing, setIsHealing] = useState(false);

    // DEFENSES
    const [activeDefense, setActiveDefense] = useState<{ defense: Defense, remaining: number } | null>(null);

    // OPPONENT
    const opponentBackground = CONST_ASSETS.IMAGES.MONSTER_GOBLIN;
    const opponentName = opponent.name;
    //const opponentColor = "#F54927";
    const [opponentHealth, setOpponentHealth] = useState(opponent.stat_hp);
    const [opponentEnergy, setOpponentEnergy] = useState(opponent.stat_energy);
    const [opponentHitTime, setOpponentHitTime] = useState(0);
    const [opponentDamageEvents, setOpponentDamageEvents] = useState<
        DamageEvent[]
    >([]);
    const [opponentIsCasting, setOpponentIsCasting] = useState(false);
    const opponentCastRef = useRef<NodeJS.Timeout | null>(null);
    const opponentFinishTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [opponentCurrentCastSkill, setOpponentCurrentCastSkill] =
        useState<MonsterSkill | null>(null);
    const [opponentCastProgress, setOpponentCastProgress] = useState(0);
    const [opponentCooldowns, setOpponentCooldowns] = useState<Record<number, number>>({});
    const monsterDecisionRef = useRef<{ skill: MonsterSkill; executeAt: number } | null>(null);
    const opponentIsCastingRef = useRef(false);

    const activeDefenseRef = useRef<{ defense: Defense; remaining: number } | null>(null);

    // COMBOS
    const [comboTriggerActive, setComboTriggerActive] = useState(false);
    const [isComboMode, setIsComboMode] = useState(false);
    const [comboHitsCount, setComboHitsCount] = useState(0);
    const [hitPosition, setHitPosition] = useState({ x: 50, y: 50 });
    const comboTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // AI Refs to avoid interval resets
    const opponentStateRef = useRef({
        energy: opponentEnergy,
        cooldowns: opponentCooldowns,
        isCasting: opponentIsCasting,
        winner: winner,
    });

    const playerIsCastingRef = useRef(playerIsCasting);
    const opponentHealthRef = useRef(opponentHealth);

    useEffect(() => {
        opponentStateRef.current = {
            energy: opponentEnergy,
            cooldowns: opponentCooldowns,
            isCasting: opponentIsCasting,
            winner: winner,
        };
        playerIsCastingRef.current = playerIsCasting;
        opponentHealthRef.current = opponentHealth;
    }, [opponentEnergy, opponentCooldowns, opponentIsCasting, winner, playerIsCasting, opponentHealth]);


    const handleGameOver = useCallback(() => {
        console.log("HANDLE GAME OVER")
        monsterDecisionRef.current = null;
        opponentIsCastingRef.current = false;
        playSound(CONST_ASSETS.SOUNDS.ACCEPTATION, 0.6);
        onSwitchScreen("lobby");
    }, [onSwitchScreen, playSound]);

    // DAMAGE
    const handleDamageDone = useCallback((target: "player" | "opponent", id: string) => {
        if (target === "player") {
            setPlayerDamageEvents((prev) => prev.filter((d) => d.id !== id));
        } else {
            setOpponentDamageEvents((prev) => prev.filter((d) => d.id !== id));
        }
    }, []);

    // GAME OVER
    const endCombat = useCallback((who: string) => {
        console.log("HANDLE END COMBAT", who)
        setWinner(who);

        if (who === "Fuite") {
            handleGameOver();
            return;
        }

        // Determine result based on health
        setTimeout(() => {
            if (opponentHealthRef.current <= 0) {
                setCombatResult('victory');
                playSound(CONST_ASSETS.SOUNDS.ACCEPTATION);
            } else {
                setCombatResult('defeat');
            }
        }, 1500);
    }, [playSound, handleGameOver]);

    // FLEE
    const handleFlee = useCallback(() => {
        if (isComboMode) return;
        console.log("HANDLE FLEE")
        endCombat("Fuite");
    }, [endCombat, isComboMode]);

    // DAMAGE EVENT
    const pushDamageEvent = useCallback((
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
    }, []);

    // APPLY DAMAGE
    const applyDamage = useCallback((target: "player" | "opponent", amount: number, canCrit: boolean = true) => {
        const critChance = target === "opponent" ? (selectedCharacter?.stat_critical ?? 0.1) : 0.05;
        const isCrit = canCrit ? Math.random() < critChance : false;
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
        return isCrit;
    }, [endCombat, pushDamageEvent, selectedCharacter?.stat_critical]);

    const interruptCast = useCallback(() => {
        if (playerCastRef.current) clearInterval(playerCastRef.current);
        if (playerFinishTimeoutRef.current) clearTimeout(playerFinishTimeoutRef.current);

        if (playerCurrentCastSkill) {
            if (playerCurrentCastSkill.castSound) {
                stopSound(playerCurrentCastSkill.castSound);
            }
            // Apply recovery cooldown penalty to the interrupted skill
            setPlayerCooldowns((prev) => ({
                ...prev,
                [playerCurrentCastSkill.id]: 1000,
            }));
        }

        setPlayerIsCasting(false);
        setPlayerCurrentCastSkill(null);
        setPlayerCastProgress(0);
    }, [playerCurrentCastSkill, stopSound]);

    // COMBO LOGIC
    const startComboTrigger = useCallback(() => {
        if (isComboMode) return;
        setComboTriggerActive(true);
        if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);
        comboTimeoutRef.current = setTimeout(() => {
            setComboTriggerActive(false);
        }, 1000);
    }, [isComboMode]);

    const startComboMode = useCallback(() => {
        setComboTriggerActive(false);
        setIsComboMode(true);
        setComboHitsCount(0);
        setHitPosition({ x: 30 + Math.random() * 40, y: 30 + Math.random() * 40 });
        if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);
        comboTimeoutRef.current = setTimeout(() => {
            setIsComboMode(false);
            setComboHitsCount(0);
        }, 1000);
    }, []);

    const handleComboHit = useCallback(() => {
        if (!isComboMode || comboHitsCount >= 3) return;
        const combo = combos[0];
        const nextCount = comboHitsCount + 1;

        // 3rd hit deals double damage as an impactful finisher
        const finalDamage = nextCount === 3 ? combo.damage * 2 : combo.damage;
        applyDamage("opponent", finalDamage, false);

        playSound(combo.impactSound);

        // Restore energy
        setPlayerEnergy(e => {
            const maxEnergy = selectedCharacter?.stat_energy ?? 100;
            return Math.max(0, Math.min(maxEnergy, e + combo.energyRestored));
        });

        setComboHitsCount(nextCount);

        if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);

        if (nextCount >= 3) {
            // Small delay to let the animation of the 3rd pip show up
            setTimeout(() => {
                setIsComboMode(false);
                setComboHitsCount(0);
            }, 600);
        } else {
            setHitPosition({ x: 20 + Math.random() * 60, y: 20 + Math.random() * 60 });
            comboTimeoutRef.current = setTimeout(() => {
                setIsComboMode(false);
                setComboHitsCount(0);
            }, 1000);
        }
    }, [isComboMode, comboHitsCount, applyDamage, playSound, selectedCharacter?.stat_energy]);

    // SKILL EFFECT
    const applySkillEffects = useCallback((skill: Skill) => {
        let wasCrit = false;
        if (skill.damage > 0) {
            wasCrit = applyDamage("opponent", skill.damage);
        }
        if (skill.heal > 0) {
            setPlayerHealth(hp => Math.min(selectedCharacter?.stat_hp ?? 100, hp + skill.heal));
            pushDamageEvent("player", skill.heal, "heal");
        }
        // Interrupt logic: if skill has interrupt, stop opponent cast
        if (skill.interrupt > 0 && opponentIsCastingRef.current) {
            if (opponentCastRef.current) clearInterval(opponentCastRef.current);
            if (opponentFinishTimeoutRef.current) clearTimeout(opponentFinishTimeoutRef.current);

            setOpponentIsCasting(false);
            opponentIsCastingRef.current = false;
            setOpponentCurrentCastSkill(null);
            setOpponentCastProgress(0);
        }
        return wasCrit;
    }, [applyDamage, selectedCharacter?.stat_hp, pushDamageEvent]);

    // OPPONENT SKILL EFFECT
    const applyOpponentSkillEffects = useCallback((skill: MonsterSkill) => {
        // DODGE CHECK
        const currentDefense = activeDefenseRef.current;
        if (currentDefense?.defense && currentDefense.defense.dodge > 0) {
            console.log("Dodged!");
            return;
        }

        if (skill.damage > 0) {
            applyDamage("player", skill.damage);
        }
        if (skill.heal > 0) {
            setOpponentHealth(hp => Math.min(opponent.stat_hp, hp + skill.heal));
            pushDamageEvent("opponent", skill.heal, "heal");
        }
        // Interrupt logic: if monster skill has interrupt, stop player cast
        if (skill.interrupt > 0 && playerIsCastingRef.current) {
            interruptCast();
        }
    }, [applyDamage, opponent.stat_hp, interruptCast, pushDamageEvent]);

    // START CAST
    const startCast = useCallback((skill: Skill) => {
        if (playerCastRef.current) clearInterval(playerCastRef.current);

        setPlayerIsCasting(true);
        setPlayerCurrentCastSkill(skill);
        setPlayerCastProgress(0);

        playSound(skill.castSound);

        const duration = skill.castTime;
        const startTime = Date.now();
        const step = 16;

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

                    setPlayerEnergy((e) => Math.max(0, e - skill.energyCost));
                    setPlayerIsCasting(false);
                    playSound(skill.impactSound);
                    const wasCrit = applySkillEffects(skill);
                    if (wasCrit) startComboTrigger();
                    setPlayerCastProgress(0);
                    playerFinishTimeoutRef.current = null;
                }, 200);
            }
        }, step);
    }, [playSound, applySkillEffects, startComboTrigger]);

    // START OPPONENT CAST
    const startOpponentCast = useCallback((skill: MonsterSkill) => {
        // ENERGY CHECK AT START
        if (opponentEnergy < skill.energyCost) {
            console.log("Opponent lacks energy to START cast");
            return;
        }

        if (opponentCastRef.current) clearInterval(opponentCastRef.current);

        setOpponentIsCasting(true);
        opponentIsCastingRef.current = true;
        setOpponentCurrentCastSkill(skill);
        setOpponentCastProgress(0);

        if (skill.castSound) playSound(skill.castSound);

        const duration = skill.castTime;
        const startTime = Date.now();
        const step = 16;

        opponentCastRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const pct = Math.min(100, (elapsed / duration) * 100);
            setOpponentCastProgress(pct);

            if (pct >= 100) {
                clearInterval(opponentCastRef.current!);
                opponentCastRef.current = null;
                opponentFinishTimeoutRef.current = setTimeout(() => {
                    if (skill.cooldown > 0) {
                        setOpponentCooldowns((prev) => ({
                            ...prev,
                            [skill.id]: skill.cooldown,
                        }));
                    }

                    setOpponentEnergy((e) => Math.max(0, e - skill.energyCost));
                    setOpponentIsCasting(false);
                    opponentIsCastingRef.current = false;

                    // DODGE CHECK
                    const currentDefense = activeDefenseRef.current;
                    const isDodging = currentDefense?.defense && currentDefense.defense.dodge > 0;
                    if (!isDodging) {
                        if (skill.impactSound) playSound(skill.impactSound);
                        applyOpponentSkillEffects(skill);
                    } else {
                        console.log("Dodged!");
                    }

                    setOpponentCastProgress(0);
                    opponentFinishTimeoutRef.current = null;
                }, 200);
            }
        }, step);
    }, [playSound, applyOpponentSkillEffects, opponentEnergy]);

    // --- EFFECTS ---

    // REGEN & COOLDOWN LOOP
    useEffect(() => {
        const interval = setInterval(() => {
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

            setOpponentCooldowns((prev) => {
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

            setPlayerEnergy((e) => {
                const maxEnergy = selectedCharacter?.stat_energy ?? 100;
                const regenPerSec = selectedCharacter?.stat_energy_regen ?? 2;
                const regenPerTick = regenPerSec / 10;
                if (e < maxEnergy) return Math.min(maxEnergy, e + regenPerTick);
                return e;
            });

            setOpponentEnergy((e) => {
                const maxEnergy = opponent.stat_energy;
                const regenPerSec = opponent.stat_energy_regen;
                const regenPerTick = regenPerSec / 10;
                if (e < maxEnergy) return Math.min(maxEnergy, e + regenPerTick);
                return e;
            });

            setOpponentHealth((hp) => {
                const maxHp = opponent.stat_hp;
                const regenPerSec = opponent.stat_hp_regen;
                const regenPerTick = regenPerSec / 10;
                if (hp > 0 && hp < maxHp) return Math.min(maxHp, hp + regenPerTick);
                return hp;
            });

            // DEFENSE DURATION
            setActiveDefense(prev => {
                if (!prev) {
                    activeDefenseRef.current = null;
                    return null;
                }
                const nextRemaining = prev.remaining - 100;
                if (nextRemaining <= 0) {
                    activeDefenseRef.current = null;
                    return null;
                }
                const next = { ...prev, remaining: nextRemaining };
                activeDefenseRef.current = next;
                return next;
            });
        }, 100);
        return () => clearInterval(interval);
    }, [selectedCharacter?.stat_energy, selectedCharacter?.stat_energy_regen, opponent.stat_energy, opponent.stat_energy_regen, opponent.stat_hp, opponent.stat_hp_regen]);

    // AI DECISION LOOP - Stable Single Instance
    useEffect(() => {
        const interval = setInterval(() => {
            const { energy, cooldowns, winner: hasWinner } = opponentStateRef.current;
            const isCasting = opponentIsCastingRef.current;

            if (hasWinner || isCasting) return;

            // 1. If we have a pending decision
            if (monsterDecisionRef.current) {
                if (Date.now() >= monsterDecisionRef.current.executeAt) {
                    const skill = monsterDecisionRef.current.skill;
                    monsterDecisionRef.current = null;

                    // Re-verify energy just before starting to avoid race conditions
                    if (opponentEnergy >= skill.energyCost) {
                        startOpponentCast(skill);
                    }
                }
                return;
            }

            // 2. Pick a skill
            const availableSkills = opponent.skills
                .map(id => monstersSkills.find(s => s.id === id))
                .filter(s => s !== undefined)
                .filter(s => (cooldowns[s!.id] || 0) <= 0)
                .filter(s => energy >= s!.energyCost);

            if (availableSkills.length > 0) {
                const bestSkill = availableSkills.sort((a, b) =>
                    ((b?.damage ?? 0) + (b?.shield ?? 0)) - ((a?.damage ?? 0) + (a?.shield ?? 0))
                )[0];

                if (bestSkill) {
                    monsterDecisionRef.current = {
                        skill: bestSkill,
                        executeAt: Date.now() + (opponent.stat_celerity || 2000)
                    };
                }
            }
        }, 100);

        return () => clearInterval(interval);
    }, [startOpponentCast, opponent.skills, opponent.stat_celerity, opponentEnergy]);

    // TIME OVER
    useEffect(() => {
        if (timer === 0 && !winner) {
            flushSync(() => {
                setWinner("Temps écoulé");
            });
            setTimeout(handleGameOver, 3000);
        }
    }, [timer, winner, handleGameOver]);





    // HANDLE SKILL LAUNCH
    const handleSkill = (skill: number) => {
        if (isComboMode) return; // Restriction
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

    // HANDLE STIM USE
    const handleStim = (type: number, id?: number) => {
        if (isComboMode) return; // Restriction
        if (type !== 5 || id === undefined) return;

        const stim = stims.find(s => s.id === id);
        if (!stim) return;

        if ((playerCooldowns[stim.id] || 0) > 0) return;
        if ((stimUsages[stim.id] || 0) <= 0) return;

        // Instant use
        playSound(stim.sound);

        // Healing
        setPlayerHealth(hp => Math.min(selectedCharacter?.stat_hp ?? 100, hp + stim.heal));
        pushDamageEvent("player", stim.heal, "heal");

        // Usages
        setStimUsages(prev => ({ ...prev, [stim.id]: prev[stim.id] - 1 }));

        // Cooldown
        setPlayerCooldowns(prev => ({ ...prev, [stim.id]: stim.cooldown }));

        // Visual Effect (2s green perfusion)
        setIsHealing(true);
        setTimeout(() => setIsHealing(false), 500);
    };

    // HANDLE DEFENSE USE
    const handleDefense = (id: number) => {
        if (isComboMode) return; // Restriction
        const defense = defenses.find(d => d.id === id);
        if (!defense) return;

        if (playerCooldowns[defense.id] > 0) return;

        // INTERRUPT CURRENT CAST ON DODGE
        if (playerIsCasting && defense.dodge > 0) {
            interruptCast();
        }

        // Instant effect
        if (defense.sound) playSound(defense.sound);

        // Cooldown starts immediately
        setPlayerCooldowns(prev => ({ ...prev, [defense.id]: defense.cooldown }));

        // Activate defense
        const newDefense = { defense, remaining: defense.duration };
        setActiveDefense(newDefense);
        activeDefenseRef.current = newDefense;
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
                                    max={opponent.stat_energy}
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
                                    max={opponent.stat_hp}
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
                                            <CastBar
                                                progress={opponentCastProgress}
                                                label={opponentCurrentCastSkill?.name}
                                            />
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
                    <div className="absolute inset-0 pointer-events-none z-10 transition-shadow duration-500"
                        style={{
                            boxShadow: isHealing
                                ? 'inset 0 0 60px rgba(0, 255, 0, 0.6)' // Green perfusion
                                : 'inset 0 0 60px rgba(0, 255, 255, 0.2)', // Default blue
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

                        {/* COMBO TRIGGER BUTTON - AAA REDESIGN */}
                        <AnimatePresence>
                            {comboTriggerActive && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.5 }}
                                    className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
                                >
                                    <motion.button
                                        onClick={startComboMode}
                                        className="pointer-events-auto relative w-24 h-24 rounded-full flex items-center justify-center border border-cyan-400/50 bg-cyan-950/60"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {/* AAA Circular Glow - Replaces drop-shadow to avoid square artifacts on Telegram */}
                                        <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl -z-10" />

                                        <div className="absolute inset-0 bg-linear-to-t from-cyan-500/20 to-transparent rounded-full" />
                                        <span className="text-lg font-bold tracking-[0.2em] text-white drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] z-10">COMBO</span>

                                        {/* Simple subtle pulse ring */}
                                        <motion.div
                                            className="absolute inset-0 rounded-full border border-cyan-400"
                                            animate={{ scale: [1, 1.25], opacity: [0.4, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                                        />
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>

                </div>
                {/* OVERLAY AREA (UI, Crystals, Skills) */}
                <div className="absolute inset-0 flex flex-col pointer-events-none">

                    {/* 1. MOCK OPPONENT SPACE (flex-1) */}
                    <div className="flex-1" />

                    {/* 2. CRYSTALS ON LINE */}
                    <div className="relative flex items-center justify-center gap-2 z-10 h-0">
                        <div className="relative">
                            <CombatCrystal
                                hp={playerHealth}
                                maxHp={100}
                                damageEvents={playerDamageEvents}
                                onDamageDone={(id) => handleDamageDone("player", id)}
                                lastHitTimestamp={playerHitTime}
                                color={playerColor}
                                opponent={true}
                            />
                            {/* SHIELD OVERLAY */}
                            <AnimatePresence>
                                {activeDefense && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1.1 }}
                                        exit={{ opacity: 0, scale: 1.5 }}
                                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                    >
                                        <div className="w-24 h-24 rounded-full border-2 border-cyan-400/50 bg-cyan-400/10 backdrop-blur-[1px] shadow-[0_0_20px_rgba(0,255,255,0.3)]" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

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
                            color={"#F54927"}
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
                                defenses={defenses}
                                stims={stims}
                                stimUsages={stimUsages}
                                cooldowns={playerCooldowns}
                                currentEnergy={playerEnergy}
                                isCasting={playerIsCasting}
                                currentCastSkillId={playerCurrentCastSkill?.id}
                                onSkill={(type, id) => {
                                    if (type === 5) handleStim(type, id);
                                    else if (type === 4) handleDefense(id!);
                                    else handleSkill(type);
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* COMBO MODE OVERLAY - AAA REDESIGN */}
                <AnimatePresence>
                    {isComboMode && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-100 flex items-center justify-center pointer-events-none bg-black/85"
                        >
                            {/* THE MAGICAL CONCENTRATION VIEW-FINDER */}
                            <motion.div
                                className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-cyan-500/30"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            >
                                <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/20" />
                            </motion.div>

                            {comboHitsCount < 3 && (
                                <motion.button
                                    key={comboHitsCount}
                                    initial={{ scale: 0, opacity: 0, rotate: -45 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    exit={{ scale: 1.5, opacity: 0 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleComboHit}
                                    className="pointer-events-auto absolute w-26 h-26 flex items-center justify-center p-2"
                                    style={{
                                        left: `${hitPosition.x}%`,
                                        top: `${hitPosition.y}%`,
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                >
                                    {/* Impact Shockwave (Appears on spawn) */}
                                    <motion.div
                                        className="absolute inset-0 rounded-full border-2 border-cyan-400/50"
                                        initial={{ scale: 0.5, opacity: 1 }}
                                        animate={{ scale: 2, opacity: 0 }}
                                        transition={{ duration: 0.6 }}
                                    />

                                    {/* Premium Nested Core */}
                                    <div className="relative w-full h-full rounded-full border-2 border-cyan-200/40 bg-linear-to-br from-cyan-400/80 via-azure-600/90 to-blue-900 overflow-hidden shadow-[0_0_20px_rgba(0,255,255,0.4)] flex items-center justify-center">
                                        {/* Internal Glass Reflection */}
                                        <div className="absolute top-[5%] left-[20%] w-[60%] h-[30%] bg-white/20 rounded-full blur-[2px]" />

                                        {/* Text with high-end glow - perfectly centered */}
                                        <span className="relative z-10 text-white font-black text-2xl tracking-tighter italic drop-shadow-[0_0_10px_rgba(0,255,255,1)] leading-none">HIT</span>

                                        {/* Flowing Plasma Internal */}
                                        <motion.div
                                            className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent"
                                            animate={{ left: ['-100%', '200%'] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                        />

                                        {/* Core Pulse */}
                                        <motion.div
                                            className="absolute inset-0 bg-cyan-400/20"
                                            animate={{ opacity: [0, 0.4, 0] }}
                                            transition={{ duration: 0.8, repeat: Infinity }}
                                        />
                                    </div>

                                    {/* Dual Magical Rings (Premium AAA Layering) */}
                                    <motion.div
                                        className="absolute -inset-1 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 border-b-cyan-400 mt-0"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    />
                                    <motion.div
                                        className="absolute -inset-3 rounded-full border border-dashed border-cyan-200/20"
                                        animate={{ rotate: -360 }}
                                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    />
                                </motion.button>
                            )}

                            {/* PREMIUM AAA DIAMOND CHARGE PIPS - AT TOP */}
                            <div className="absolute top-12 flex gap-6">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="relative w-8 h-8 flex items-center justify-center">
                                        {/* Diamond Frame (Losange) */}
                                        <div className="absolute inset-0 rotate-45 border border-cyan-500/40 bg-black/60 shadow-[0_0_10px_rgba(0,0,0,0.5)]" />

                                        {/* Active State with Energy Crystal Flow */}
                                        <AnimatePresence mode="wait">
                                            {i < comboHitsCount && (
                                                <motion.div
                                                    initial={{ scale: 0, opacity: 0, rotate: 45 }}
                                                    animate={{ scale: 1, opacity: 1, rotate: 45 }}
                                                    exit={{ scale: 0, opacity: 0, rotate: 45 }}
                                                    className="absolute w-[80%] h-[80%] bg-linear-to-br from-cyan-300 via-cyan-500 to-azure-700 shadow-[0_0_15px_rgba(0,255,255,0.8)]"
                                                >
                                                    {/* Internal Fluid/Plasma detail - Plays once on fill */}
                                                    <motion.div
                                                        className="absolute inset-0 bg-[linear-gradient(45deg,transparent,rgba(255,255,255,0.5),transparent)]"
                                                        animate={{ left: ['-100%', '100%'] }}
                                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Glass Reflection on Diamond */}
                                        <div className="absolute inset-[2px] rotate-45 bg-linear-to-b from-white/10 to-transparent pointer-events-none" />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* COMBAT RESULTS OVERLAYS */}
                <AnimatePresence>
                    {combatResult && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleGameOver}
                            className="absolute inset-0 z-150 flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl cursor-pointer"
                        >
                            {combatResult === 'victory' ? (
                                <motion.div
                                    initial={{ scale: 0.8, y: 50 }}
                                    animate={{ scale: 1, y: 0 }}
                                    className="w-full max-w-sm flex flex-col items-center gap-8"
                                >
                                    <div className="text-center">
                                        <motion.h2
                                            initial={{ letterSpacing: "1em", opacity: 0 }}
                                            animate={{ letterSpacing: "0.4em", opacity: 1 }}
                                            className="text-5xl font-black italic text-transparent bg-clip-text bg-linear-to-b from-yellow-300 to-yellow-600 uppercase"
                                        >
                                            VICTOIRE
                                        </motion.h2>
                                        <p className="text-cyan-400 font-bold tracking-widest text-[10px] mt-2 opacity-60">MISSION ACCOMPLIE</p>
                                    </div>

                                    <div className="w-full space-y-4">
                                        {/* Character XP */}
                                        <div className="bg-white/5 border border-white/10 rounded-lg p-4 relative overflow-hidden">
                                            <div className="flex justify-between items-end mb-2">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">XP PERSONNAGE</p>
                                                <p className="text-sm font-mono text-cyan-400">+125 XP</p>
                                            </div>
                                            <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: "30%" }}
                                                    animate={{ width: "65%" }}
                                                    transition={{ duration: 2, delay: 0.5 }}
                                                    className="h-full bg-linear-to-r from-cyan-600 to-cyan-400"
                                                />
                                            </div>
                                        </div>

                                        {/* Loot & Currency */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col items-center">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">BUTIN</p>
                                                <div className="w-12 h-12 rounded-md bg-neutral-900 border border-yellow-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.2)] relative overflow-hidden">
                                                    <Image
                                                        src={CONST_ASSETS.IMAGES.SKILL_04}
                                                        fill
                                                        style={{ objectFit: 'cover' }}
                                                        className="rounded-md"
                                                        alt="loot"
                                                    />
                                                </div>
                                            </div>
                                            <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col items-center justify-center">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">CREDITS</p>
                                                <p className="text-2xl font-mono font-black text-yellow-500">+850</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center gap-2 animate-pulse mt-4">
                                        <span className="text-[10px] font-black text-white/40 tracking-[0.3em] uppercase">Toucher pour continuer</span>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ scale: 0.8, y: 50 }}
                                    animate={{ scale: 1, y: 0 }}
                                    className="w-full max-w-sm flex flex-col items-center gap-8"
                                >
                                    <div className="text-center">
                                        <motion.h2
                                            initial={{ letterSpacing: "1em", opacity: 0 }}
                                            animate={{ letterSpacing: "0.4em", opacity: 1 }}
                                            className="text-5xl font-black italic text-transparent bg-clip-text bg-linear-to-b from-red-500 to-red-900 uppercase"
                                        >
                                            ÉCHEC
                                        </motion.h2>
                                        <p className="text-red-400 font-bold tracking-widest text-[10px] mt-2 opacity-60">SIGNAL PERDU</p>
                                    </div>

                                    <div className="p-6 bg-red-950/20 border border-red-500/20 rounded-xl text-center">
                                        <p className="text-sm text-red-100/70 italic leading-relaxed">
                                            Votre cristal a subi des dommages critiques. {playerName} est hors de combat.
                                        </p>
                                    </div>

                                    <div className="w-full bg-white/5 border border-white/10 rounded-lg p-4">
                                        <div className="flex justify-between items-end mb-2">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PROGRESSION CRISTAL LOBBY</p>
                                            <p className="text-sm font-mono text-purple-400">+15 XP</p>
                                        </div>
                                        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: "10%" }}
                                                animate={{ width: "15%" }}
                                                transition={{ duration: 1.5, delay: 0.5 }}
                                                className="h-full bg-linear-to-r from-purple-800 to-purple-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center gap-2 animate-pulse mt-4">
                                        <span className="text-[10px] font-black text-white/40 tracking-[0.3em] uppercase">Toucher pour continuer</span>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
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


