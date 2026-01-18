'use client';

import { useSelectedCharacter } from "@/store/useSelectedCharacter";
import { useSoundStore } from "@/store/useSoundStore";
import { motion, AnimatePresence } from 'framer-motion';


import { useCallback, useEffect, useRef, useState } from "react";

import CombatCrystal from "@/components/CombatCrystal";
import LootAccordion, { LootItem } from "@/components/LootAccordion";
import Inventory from "@/components/Inventory";
import ItemPopup from "@/components/ItemPopup";
import BattleZoneBackground from "@/components/BattleZoneBackground";
import HealthBar from "@/components/HealthBar";
import EnergyBar from "@/components/EnergyBar";
import CastBar from "@/components/CastBar";
import type { DamageEvent } from "@/components/DamagePop";
import SkillGrid from "@/components/SkillGrid";
import { Skill, skillSets, ElementKey, defenses, Defense, combos } from "@/lib/skills";
import { monstersSkills, monsters, MonsterSkill } from "@/lib/monsters";
import { stims } from "@/lib/stim";

import { useAdventureStore, InventoryItem } from "@/store/useAdventureStore";
import { CONST_ASSETS } from '@/lib/preloader';
import { items as gameItems } from "@/lib/items";






interface FightScreenProps {
    onSwitchScreen: (screen: string) => void;
}

export default function FightScreen({ onSwitchScreen }: FightScreenProps) {

    const { playSound, stopSound, stopAllSounds } = useSoundStore();
    const [winner, setWinner] = useState<string | null>(null);
    const [combatResult, setCombatResult] = useState<'victory' | 'defeat' | null>(null);
    const [generatedLoot, setGeneratedLoot] = useState<LootItem[]>([]);
    const opponent = monsters[0];

    // TIMER REMOVED


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
    const [playerCastId, setPlayerCastId] = useState(0);
    const playerCastRef = useRef<NodeJS.Timeout | null>(null);
    const playerFinishTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [playerCurrentCastSkill, setPlayerCurrentCastSkill] =
        useState<Skill | null>(null);
    const [playerCastProgress, setPlayerCastProgress] = useState(0);
    const [playerCastDuration, setPlayerCastDuration] = useState(0);
    const skills = selectedCharacter
        ? skillSets[selectedCharacter?.symbol as ElementKey]
        : [];

    const [playerCooldowns, setPlayerCooldowns] = useState<Record<number, number>>(() => {
        const initial: Record<number, number> = {};
        skills.forEach(skill => {
            if (skill && skill.cooldown > 0) {
                initial[skill.id] = skill.cooldown;
            }
        });
        return initial;
    });

    // STIMS
    const [stimUsages, setStimUsages] = useState<Record<number, number>>(() => {
        const initial: Record<number, number> = {};
        stims.forEach(s => initial[s.id] = s.usages);
        return initial;
    });


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
    const [opponentCastDuration, setOpponentCastDuration] = useState(0);
    const [opponentCooldowns, setOpponentCooldowns] = useState<Record<number, number>>({});
    const monsterDecisionRef = useRef<{ skill: MonsterSkill; executeAt: number } | null>(null);
    const opponentIsCastingRef = useRef(false);

    const activeDefenseRef = useRef<{ defense: Defense; remaining: number } | null>(null);

    // COMBOS
    const [comboTriggerActive, setComboTriggerActive] = useState(false);
    const [isComboMode, setIsComboMode] = useState(false);
    const [comboHitsCount, setComboHitsCount] = useState(0);
    const [hitPosition, setHitPosition] = useState({ x: 50, y: 50 });

    // VISUAL EFFECTS
    const [healEffectActive, setHealEffectActive] = useState(false);
    const [comboGlowActive, setComboGlowActive] = useState(false);
    const comboTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // AI Refs to avoid interval resets
    const opponentStateRef = useRef({
        energy: opponentEnergy,
        cooldowns: opponentCooldowns,
        isCasting: opponentIsCasting,
        winner: winner,
    });

    // SHOCKWAVE STATE
    const [shockwaveActive, setShockwaveActive] = useState(false);

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


    const { mode, solo, coop, markAsDefeated, resetAdventure, resetSession, equipment } = useAdventureStore();
    const { currentNodeId } = mode === 'solo' ? solo : coop;
    const { clearSelectedCharacter } = useSelectedCharacter();

    const handleGameOver = useCallback(() => {
        console.log("HANDLE GAME OVER", combatResult)
        monsterDecisionRef.current = null;
        opponentIsCastingRef.current = false;

        if (combatResult === 'victory') {
            markAsDefeated(currentNodeId);
            onSwitchScreen("map");
        } else if (combatResult === 'defeat') {
            resetSession(); // Death Penalty: Clear Inventory/Equip/Currencies, Keep Vault
            clearSelectedCharacter();
            onSwitchScreen("lobby");
        } else {
            // Fuite or unknown
            onSwitchScreen("lobby");
        }

    }, [onSwitchScreen, combatResult, currentNodeId, markAsDefeated, resetAdventure, clearSelectedCharacter, resetSession]);

    // DAMAGE
    const handleDamageDone = useCallback((target: "player" | "opponent", id: string) => {
        if (target === "player") {
            setPlayerDamageEvents((prev) => prev.filter((d) => d.id !== id));
        } else {
            setOpponentDamageEvents((prev) => prev.filter((d) => d.id !== id));
        }
    }, []);

    // GAME OVER
    const endCombat = useCallback((who: string, exceptSound?: string) => {
        console.log("HANDLE END COMBAT", who)
        if (winner) return; // Prevent double trigger

        // LOOT GENERATION (If Player Won)
        if (who === "Joueur vainqueur") {
            const loot: LootItem[] = [];
            let lootId = 0;

            // 1. Fixed Gold/XP/Shards from Loot Table
            opponent.loot_table.forEach(drop => {
                const roll = Math.random();
                if (roll <= drop.chance) {
                    const qty = Math.floor(Math.random() * (drop.max_qty - drop.min_qty + 1)) + drop.min_qty;
                    if (qty <= 0) return;

                    if (drop.type === 'currency_gold') {
                        loot.push({
                            id: lootId++,
                            name: "Or",
                            rarity: "Common",
                            color: "text-amber-400",
                            border: "border-amber-500",
                            icon: CONST_ASSETS.IMAGES.CURRENCY_GOLDCOIN,
                            payload: { type: 'currency_gold', amount: qty }
                        });
                    } else if (drop.type === 'currency_soulshard') {
                        loot.push({
                            id: lootId++,
                            name: "Éclat d'Âme",
                            rarity: "Rare",
                            color: "text-purple-400",
                            border: "border-purple-500",
                            icon: CONST_ASSETS.IMAGES.CURRENCY_SOULSHARD,
                            payload: { type: 'currency_soulshard', amount: qty }
                        });
                    } else if (drop.type === 'currency_xp') {
                        loot.push({
                            id: lootId++,
                            name: "Expérience",
                            rarity: "Common",
                            color: "text-cyan-400",
                            border: "border-cyan-500",
                            icon: CONST_ASSETS.IMAGES.CURRENCY_EXPERIENCE,
                            payload: { type: 'currency_xp', amount: qty }
                        });
                    } else if (drop.type === 'item' && drop.item_id !== undefined) {
                        const itemDef = gameItems.find(i => i.id === drop.item_id);
                        if (itemDef) {
                            let rarityColor = "text-gray-400";
                            let rarityBorder = "border-gray-500";
                            if (itemDef.rarity === 'Rare') { rarityColor = "text-blue-400"; rarityBorder = "border-blue-500"; }
                            if (itemDef.rarity === 'Epic') { rarityColor = "text-purple-400"; rarityBorder = "border-purple-500"; }
                            if (itemDef.rarity === 'Legendary') { rarityColor = "text-orange-400"; rarityBorder = "border-orange-500"; }

                            for (let i = 0; i < qty; i++) {
                                loot.push({
                                    id: lootId++,
                                    name: itemDef.name,
                                    rarity: itemDef.rarity || "Common",
                                    color: rarityColor,
                                    border: rarityBorder,
                                    icon: itemDef.icon,
                                    payload: { type: 'item', item: { ...itemDef, instanceId: Math.random().toString(36).slice(2) } as InventoryItem }
                                });
                            }
                        }
                    }
                }
            });
            setGeneratedLoot(loot);
        }

        setWinner(who);

        // INTERRUPT EVERYTHING (Except the killing blow sound)
        console.log("STOP ALL SOUNDS EXCEPT", exceptSound);
        stopAllSounds(exceptSound);

        if (playerCastRef.current) clearTimeout(playerCastRef.current);
        if (opponentCastRef.current) clearInterval(opponentCastRef.current);
        if (playerFinishTimeoutRef.current) clearTimeout(playerFinishTimeoutRef.current);
        if (opponentFinishTimeoutRef.current) clearTimeout(opponentFinishTimeoutRef.current);
        if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);

        monsterDecisionRef.current = null;
        opponentIsCastingRef.current = false;
        opponentIsCastingRef.current = false;
        playerIsCastingRef.current = false;

        setPlayerIsCasting(false);
        setOpponentIsCasting(false);
        setPlayerCastProgress(0);
        setOpponentCastProgress(0);
        setPlayerCastDuration(0);
        setOpponentCastDuration(0);
        setPlayerCurrentCastSkill(null);
        setOpponentCurrentCastSkill(null);

        // Stop any active combo visuals
        setIsComboMode(false);
        setComboTriggerActive(false);

        if (who === "Fuite") {
            handleGameOver();
            return;
        }

        // Trigger Shockwave IMMEDIATELY with the silence
        setShockwaveActive(true);
        setTimeout(() => setShockwaveActive(false), 1000);

        // DELAYED RESULT (1s later)
        setTimeout(() => {
            if (opponentHealthRef.current <= 0) {
                setCombatResult('victory');
                playSound(CONST_ASSETS.SOUNDS.ACCEPTATION);
            } else {
                setCombatResult('defeat');
            }
        }, 1000); // 1 second delay
    }, [playSound, handleGameOver, stopAllSounds, winner]);

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
    const applyDamage = useCallback((target: "player" | "opponent", amount: number, canCrit: boolean = true, impactSound?: string) => {
        const critChance = target === "opponent" ? (selectedCharacter?.stat_critical ?? 0.1) : 0.05;
        const isCrit = canCrit ? Math.random() < critChance : false;
        const finalAmount = isCrit ? Math.round(amount * 2) : amount;
        const damageType = isCrit ? "crit" : "normal";

        if (target === "player") {
            setPlayerHealth((hp) => {
                const newHP = Math.max(0, hp - amount);
                setPlayerHitTime(Date.now());
                pushDamageEvent("player", finalAmount, damageType);
                if (newHP <= 0) endCombat("Ennemi vainqueur", impactSound);
                return newHP;
            });
        } else {
            setOpponentHealth((hp) => {
                const newHP = Math.max(0, hp - finalAmount);
                setOpponentHitTime(Date.now());
                pushDamageEvent("opponent", finalAmount, damageType);
                if (newHP <= 0) endCombat("Joueur vainqueur", impactSound);
                return newHP;
            });
        }
        return isCrit;
    }, [endCombat, pushDamageEvent, selectedCharacter?.stat_critical, opponent.loot_table]);

    const interruptCast = useCallback(() => {
        if (playerCastRef.current) clearTimeout(playerCastRef.current);
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
        setPlayerCastDuration(0);
        console.log("Player cast interrupted!");
    }, [playerCurrentCastSkill, stopSound]);

    // COMBO LOGIC
    const startComboTrigger = useCallback(() => {
        if (isComboMode) return;
        setComboTriggerActive(true);
        if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);
        comboTimeoutRef.current = setTimeout(() => {
            setComboTriggerActive(false);
            setComboTriggerActive(false);
            comboTimeoutRef.current = null;
        }, 1000);
    }, [isComboMode]);

    const cancelComboTrigger = useCallback(() => {
        if (comboTriggerActive) {
            setComboTriggerActive(false);
            if (comboTimeoutRef.current) {
                clearTimeout(comboTimeoutRef.current);
                comboTimeoutRef.current = null;
            }
        }
    }, [comboTriggerActive]);

    const startComboMode = useCallback(() => {
        setComboTriggerActive(false);
        setIsComboMode(true);
        setComboHitsCount(0);
        setHitPosition({ x: 30 + Math.random() * 40, y: 30 + Math.random() * 40 });

        if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);
        comboTimeoutRef.current = setTimeout(() => {
            comboTimeoutRef.current = null; // MARK AS FIRED
            setIsComboMode(false);
            setComboHitsCount(0);
        }, 1000);
    }, []);

    const handleComboHit = useCallback(() => {
        // Critical: Check if timeout already fired (race condition fix)
        // If comboTimeoutRef.current is null (and we are not just starting), it means timeout won
        // But for the very first hit, we rely on isComboMode
        if (!isComboMode || comboHitsCount >= 3) return;

        // If the timeout has already fired (ref is null), ignore this late click
        if (comboHitsCount > 0 && !comboTimeoutRef.current) return;

        const combo = combos[0];
        const nextCount = comboHitsCount + 1;

        // Play the buildup sound on each hit
        playSound(combo.comboSound);

        // Restore energy per hit
        setPlayerEnergy(e => {
            const maxEnergy = selectedCharacter?.stat_energy ?? 100;
            return Math.max(0, Math.min(maxEnergy, e + combo.energyRestored));
        });

        setComboHitsCount(nextCount);

        if (comboTimeoutRef.current) {
            clearTimeout(comboTimeoutRef.current);
            comboTimeoutRef.current = null; // Clear it so we don't re-use it
        }

        if (nextCount >= 3) {
            // SUCCESS
            // 1. Wait to let the 3rd pip animation finish (600ms)
            setTimeout(() => {
                setIsComboMode(false); // Start exit animation

                // 2. Wait for the exit animation (approx 300ms) before applying damage
                setTimeout(() => {
                    const totalDamage = combo.damage * 3;
                    playSound(combo.impactSound);
                    applyDamage("opponent", totalDamage, false, combo.impactSound);
                    setComboHitsCount(0);
                }, 300);
            }, 600);
        } else {
            setHitPosition({ x: 20 + Math.random() * 60, y: 20 + Math.random() * 60 });
            comboTimeoutRef.current = setTimeout(() => {
                comboTimeoutRef.current = null; // MARK AS FIRED
                // TIMEOUT
                setIsComboMode(false); // Start exit animation

                // Wait for exit animation
                setTimeout(() => {
                    const finalDamage = combo.damage * nextCount;
                    if (finalDamage > 0) {
                        playSound(combo.impactSound);
                        applyDamage("opponent", finalDamage, false, combo.impactSound);
                    }
                    setComboHitsCount(0);
                }, 300);
            }, 1000);
        }
    }, [isComboMode, comboHitsCount, applyDamage, playSound, selectedCharacter?.stat_energy]);

    // SKILL EFFECT
    const applySkillEffects = useCallback((skill: Skill) => {
        let wasCrit = false;
        if (skill.damage > 0) {
            wasCrit = applyDamage("opponent", skill.damage, true, skill.impactSound);
        }
        if (skill.heal > 0) {
            setPlayerHealth(hp => Math.min(selectedCharacter?.stat_hp ?? 100, hp + skill.heal));
            pushDamageEvent("player", skill.heal, "heal");
        }
        // Interrupt logic: if skill has interrupt, stop opponent cast
        if (skill.interrupt > 0 && opponentIsCastingRef.current) {
            if (opponentCastRef.current) clearTimeout(opponentCastRef.current);
            if (opponentFinishTimeoutRef.current) clearTimeout(opponentFinishTimeoutRef.current);

            setOpponentIsCasting(false);
            opponentIsCastingRef.current = false;
            setOpponentCurrentCastSkill(null);
            setOpponentCastProgress(0);
            setOpponentCastDuration(0);
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
            applyDamage("player", skill.damage, true, skill.impactSound);
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
        if (playerCastRef.current) clearTimeout(playerCastRef.current);

        setPlayerIsCasting(true);
        setPlayerCastId(prev => prev + 1);
        setPlayerCurrentCastSkill(skill);
        setPlayerCastProgress(0);

        playSound(skill.castSound);

        const duration = skill.castTime;

        // Trigger golden glow for ultimate (skill 4)
        if (skill.id === 4) {
            setComboGlowActive(true);
            setTimeout(() => setComboGlowActive(false), duration + 800);
        }

        // Reset state for new cast
        setPlayerCastProgress(0);
        setPlayerCastDuration(0);

        // Trigger animation in next tick to ensure 0 -> 100 transition
        setTimeout(() => {
            setPlayerCastDuration(duration);
            setPlayerCastProgress(100);
        }, 10);

        // Set Timeout for Completion
        playerFinishTimeoutRef.current = setTimeout(() => {
            playerFinishTimeoutRef.current = null;

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
            setPlayerCastDuration(0);
        }, duration);

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

        // Reset state
        setOpponentCastProgress(0);
        setOpponentCastDuration(0);

        // Trigger animation
        setTimeout(() => {
            setOpponentCastDuration(duration);
            setOpponentCastProgress(100);
        }, 10);

        // Set Timeout for Completion
        opponentFinishTimeoutRef.current = setTimeout(() => {
            opponentFinishTimeoutRef.current = null;

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
            setOpponentCastDuration(0);
        }, duration);

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

    // TIME OVER REMOVED






    // HANDLE SKILL LAUNCH
    const handleSkill = (skill: number) => {
        if (winner || combatResult) return;
        if (isComboMode) return; // Restriction
        cancelComboTrigger(); // NEW: Stop trigger if ignoring it

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
        if (winner || combatResult) return;
        if (isComboMode) return; // Restriction
        cancelComboTrigger(); // NEW: Stop trigger if ignoring it

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

        // Trigger green heal effect
        setHealEffectActive(true);
        setTimeout(() => setHealEffectActive(false), 800);

        // Usages
        setStimUsages(prev => ({ ...prev, [stim.id]: prev[stim.id] - 1 }));

        // Cooldown
        setPlayerCooldowns(prev => ({ ...prev, [stim.id]: stim.cooldown }));


    };

    // HANDLE DEFENSE USE
    const handleDefense = (id: number) => {
        if (winner || combatResult) return;
        if (isComboMode) return; // Restriction
        cancelComboTrigger(); // NEW: Stop trigger if ignoring it

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
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
            {/* BACKGROUND LAYER - SPLIT TOP/BOTTOM */}
            <div className="absolute inset-0 flex flex-col z-0">
                {/* TOP: OPPONENT (40%) */}
                <div className="relative w-full h-[40%] border-b border-white/5">
                    <BattleZoneBackground
                        src={opponentBackground}
                        scale={1.2}
                        origin="origin-top"
                        objectPosition="object-[50%_20%]"
                        blur={0}
                    />
                    <DarkOverlay />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black via-transparent to-transparent pointer-events-none" />
                </div>

                {/* BOTTOM: PLAYER (60%) */}
                <div className="relative w-full h-[60%]">
                    <BattleZoneBackground
                        src={playerBackground}
                        scale={1.5}
                        origin="origin-top-left"
                        objectPosition="object-top"
                        blur={0}
                    />
                    <DarkOverlay />
                    <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black via-transparent to-transparent pointer-events-none" />
                </div>
            </div>



            {/* MAIN HUD LAYER */}
            <div className="absolute inset-0 z-40 flex flex-col pointer-events-none">

                {/* --- TOP SECTION: OPPONENT (40% H) --- */}
                <div className="relative w-full h-[40%] flex items-start justify-end p-4">
                    {/* CENTERED CAST BAR (OPPONENT) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] z-30 pointer-events-none">
                        <AnimatePresence>
                            {opponentIsCasting && (
                                <motion.div
                                    key="opponent-cast"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="w-full"
                                >
                                    <CastBar
                                        progress={opponentCastProgress}
                                        duration={opponentCastDuration}
                                        label={opponentCurrentCastSkill?.name}
                                        height={24}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* FLEE BUTTON - Bottom Right of Opponent Zone */}
                    <div className="absolute bottom-4 right-4 pointer-events-auto z-40">
                        <button
                            onClick={handleFlee}
                            className="py-3 px-6 bg-gradient-to-br from-black/30 to-black/20 backdrop-blur-md border border-white/10 active:scale-95 transition-transform rounded-sm flex items-center justify-center gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
                        >
                            <span className="font-bold italic tracking-wide text-xs text-gray-300">S&apos;ENFUIR</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-6 pointer-events-auto">

                        {/* OPPONENT CRYSTAL */}
                        <div className="absolute top-[-10px] right-[-30px] scale-100 origin-center">
                            <CombatCrystal
                                hp={opponentHealth}
                                maxHp={100}
                                damageEvents={opponentDamageEvents}
                                onDamageDone={(id) => handleDamageDone("opponent", id)}
                                lastHitTimestamp={opponentHitTime}
                                color={"#F54927"}
                            />
                        </div>

                        {/* OPPONENT HUD FRAME (RIGHT ALIGNED) */}
                        <div className="relative w-[160px] flex flex-col items-end mr-[90px]">
                            <div className="flex items-center gap-3 mb-1 flex-row-reverse">

                                <span className="text-2xl font-black italic text-white tracking-tighter uppercase drop-shadow-md">{opponentName}</span>
                                <span className="px-1.5 py-0.5 rounded-sm bg-red-500/20 text-[9px] font-black text-red-300 border border-red-500/30 tracking-widest">
                                    #MangeTmorts
                                </span>
                            </div>
                            <div className="space-y-2 w-full flex flex-col items-end">

                                <HealthBar
                                    current={opponentHealth}
                                    max={opponent.stat_hp}
                                    height={32}
                                />
                                <div className="w-[85%]">
                                    <EnergyBar
                                        current={opponentEnergy}
                                        max={opponent.stat_energy}
                                        height={24}
                                    />
                                </div>

                            </div>


                        </div>


                    </div>
                </div>

                {/* --- BOTTOM SECTION: PLAYER (60% H) --- */}
                {/* VISUAL EFFECT OVERLAYS */}
                <AnimatePresence>
                    {healEffectActive && (
                        <motion.div
                            key="heal-effect"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute bottom-0 left-0 right-0 h-[60%] pointer-events-none z-20"
                            style={{
                                boxShadow: 'inset 0 0 50px 20px rgba(34, 197, 94, 0.25)'
                            }}
                        />
                    )}
                    {comboGlowActive && (
                        <motion.div
                            key="combo-glow"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute bottom-0 left-0 right-0 h-[60%] pointer-events-none z-20"
                            style={{
                                boxShadow: 'inset 0 0 60px 25px rgba(251, 191, 36, 0.3)'
                            }}
                        />
                    )}
                </AnimatePresence>
                <div className="relative w-full h-[60%] flex items-start p-4">
                    {/* CENTERED CAST BAR (PLAYER) */}
                    <div className="absolute top-[150px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-8 z-30 pointer-events-none">
                        <AnimatePresence>
                            {playerIsCasting && (
                                <motion.div
                                    key={`player-cast-${playerCastId}`}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="absolute top-0 left-0 w-full"
                                >
                                    <CastBar
                                        progress={playerCastProgress}
                                        duration={playerCastDuration}
                                        label={playerCurrentCastSkill?.name}
                                        height={24}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="flex flex-col gap-6 pointer-events-auto">

                        {/* ROW 1: MAIN PLAYER */}
                        <div className="flex items-center gap-6">
                            {/* PLAYER CRYSTAL */}
                            <div className="absolute top-[-10px] left-[-30px] scale-100 origin-center">
                                <CombatCrystal
                                    hp={playerHealth}
                                    maxHp={100}
                                    damageEvents={playerDamageEvents}
                                    onDamageDone={(id) => handleDamageDone("player", id)}
                                    lastHitTimestamp={playerHitTime}
                                    color={playerColor}
                                    opponent={true}
                                />

                                <AnimatePresence>
                                    {activeDefense && (
                                        <motion.div
                                            key="defense-shield"
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

                            {/* PLAYER HUD FRAME (LEFT ALIGNED) */}
                            <div className="relative w-[160px] ml-[90px]">


                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-2xl font-black italic text-white tracking-tighter uppercase drop-shadow-md">
                                        {playerName}</span>
                                    <span className="px-1.5 py-0.5 rounded-sm bg-cyan-500/20 text-[9px] font-black text-cyan-300 border border-cyan-500/30 tracking-widest">
                                        #LeroyJenkins
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <HealthBar
                                        current={playerHealth}
                                        max={selectedCharacter?.stat_hp ?? 100}
                                        height={32}
                                    />
                                    <div className="w-[85%]">
                                        <EnergyBar
                                            current={playerEnergy}
                                            max={selectedCharacter?.stat_energy ?? 50}
                                            height={24}
                                        />
                                    </div>
                                </div>



                            </div>
                        </div>

                        {/* ROW 2: COOP ALLY  */}
                        {mode === 'coop' && (
                            <div className="absolute top-[180px] left-4 flex items-center gap-6">


                                {/* ALLY HUD */}
                                <div className="relative w-[140px]">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-xl font-black italic text-emerald-100 tracking-tighter uppercase drop-shadow-md">
                                            KNIGHT</span>
                                        <span className="px-1.5 py-0.5 rounded-sm bg-emerald-500/20 text-[9px] font-black text-emerald-300 border border-emerald-500/30 tracking-widest">
                                            #SauceAlOignon
                                        </span>
                                    </div>
                                    <div className="space-y-1.5">
                                        {/* Mock Ally HP (Using Player HP for demo visual) */}
                                        <HealthBar
                                            current={playerHealth} // Mock
                                            max={100}
                                            height={28}
                                        />
                                        <div className="w-[85%]">
                                            <EnergyBar
                                                current={playerEnergy} // Mock
                                                max={50}
                                                height={21}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* COMBO TRIGGER (CENTER) - NEW LIMIT BREAK STYLE */}
            <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                <AnimatePresence>
                    {comboTriggerActive && (
                        <motion.div
                            key="combo-trigger"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
                            className="pointer-events-auto relative"
                        >
                            {/* Rotating Tech Rings */}
                            <motion.div
                                className="absolute inset-[-40px] border border-cyan-500/30 rounded-full border-dashed"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.div
                                className="absolute inset-[-20px] border-2 border-cyan-400/40 rounded-full border-t-transparent border-b-transparent"
                                animate={{ rotate: -360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />

                            <motion.button
                                onClick={startComboMode}
                                className="relative w-36 h-36 rounded-full flex items-center justify-center overflow-hidden group"
                                whileTap={{ scale: 0.95 }}
                            >
                                {/* Core Background - Deep Energy */}
                                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm border-2 border-cyan-400/50 rounded-full shadow-[0_0_30px_rgba(34,211,238,0.3)]" />

                                {/* Inner Pulse */}
                                <motion.div
                                    className="absolute inset-0 bg-linear-to-b from-cyan-900/60 to-blue-900/60 rounded-full"
                                    animate={{
                                        opacity: [0.6, 0.9, 0.6],
                                        scale: [1, 1.05, 1]
                                    }}
                                    transition={{ duration: 1.2, repeat: Infinity }}
                                />

                                {/* Text */}
                                <div className="relative z-10 flex flex-col items-center">

                                    <span className="text-xl font-black italic text-white  drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                                        COMBO
                                    </span>
                                </div>

                                {/* Shine Effect */}
                                <div className="absolute inset-0 bg-linear-to-t from-transparent via-white/20 to-transparent -skew-y-12 translate-y-full group-hover:translate-y-[-200%] transition-transform duration-700 ease-in-out" />
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* BOTTOM LAYER: SKILLS */}
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-end gap-3 z-50 pointer-events-none">

                <div className="pointer-events-auto pb-4 pr-4">
                    <SkillGrid
                        skills={skills}
                        defenses={defenses}
                        stims={equipment.consumable ? stims.filter(s => s.id === equipment.consumable?.id) : []}
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


            {/* COMBO MODE OVERLAY & RESULTS */}
            <AnimatePresence>
                {isComboMode && (
                    <motion.div
                        key="combo-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-100 flex items-center justify-center pointer-events-none bg-black/80 backdrop-blur-[2px]"
                    >
                        {/* Removed Pentagon Overlay - Just use Vignette */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,black_100%)] opacity-80" />

                        {comboHitsCount < 3 && (
                            <motion.button
                                key={comboHitsCount}
                                initial={{ scale: 2, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                onClick={handleComboHit}
                                whileTap={{ scale: 0.9 }}
                                className="pointer-events-auto absolute w-32 h-32 flex items-center justify-center"
                                style={{
                                    left: `${hitPosition.x}%`,
                                    top: `${hitPosition.y}%`,
                                    transform: 'translate(-50%, -50%)' // Ensure accurate centering
                                }}
                            >
                                {/* Rotating Tactical Brackets */}
                                <motion.div
                                    className="absolute inset-[-10px] border-2 border-amber-500/60 rounded-full border-t-transparent border-b-transparent"
                                    animate={{ rotate: 180 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                                <motion.div
                                    className="absolute inset-0 border border-red-500/40 rounded-full border-l-transparent border-r-transparent"
                                    animate={{ rotate: -180 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                />

                                {/* Core Button */}
                                <div className="relative w-24 h-24 bg-black/60 backdrop-blur-sm border-2 border-amber-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.6)] overflow-hidden">
                                    {/* Hot Core Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-red-600 opacity-80" />

                                    {/* Pulse */}
                                    <motion.div
                                        className="absolute inset-0 bg-white/30"
                                        animate={{ opacity: [0, 0.5, 0] }}
                                        transition={{ duration: 0.5, repeat: Infinity }}
                                    />

                                    <span className="relative z-10 text-3xl font-black italic text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide">HIT</span>
                                </div>

                                {/* Impact Ripples (Visual only, behind) */}
                                <div className="absolute inset-[-20px] rounded-full border border-amber-500/30 animate-ping opacity-20 pointer-events-none" />
                            </motion.button>
                        )}

                        {/* Combo Counter Indicators - AMBER DIAMOND STYLE */}
                        <div className="absolute top-24 flex gap-8">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="relative w-8 h-8 rotate-45">
                                    {/* Empty Slot */}
                                    <div className="absolute inset-0 bg-black/60 border border-white/20 backdrop-blur-sm shadow-[inset_0_0_5px_rgba(0,0,0,0.8)]" />

                                    {/* Active Fill */}
                                    <AnimatePresence>
                                        {i < comboHitsCount && (
                                            <motion.div
                                                key={`pip-${i}`}
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 1.5, filter: "blur(4px)" }}
                                                className="absolute inset-0 bg-linear-to-br from-amber-300 via-orange-500 to-red-600 border border-white/40 shadow-[0_0_20px_rgba(251,191,36,0.8)]"
                                            >
                                                {/* Inner Pulse */}
                                                <motion.div
                                                    className="absolute inset-0 bg-white/40"
                                                    animate={{ opacity: [0, 0.6, 0] }}
                                                    transition={{ duration: 1.5, repeat: Infinity }}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SHOCKWAVE OVERLAY */}
            <AnimatePresence>
                {shockwaveActive && (
                    <motion.div
                        key="shockwave"
                        className="absolute inset-0 z-200 pointer-events-none flex items-center justify-center overflow-hidden"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {/* White flash */}
                        <div className="absolute inset-0 bg-white/20" />

                        {/* Distortion Ring */}
                        <motion.div
                            className="absolute rounded-full border-20 border-white/80 blur-md"
                            initial={{ width: 0, height: 0, opacity: 1 }}
                            animate={{ width: "200vmax", height: "200vmax", opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* RESULTS SCREEN (Keep existing logic) */}
            <AnimatePresence>
                {combatResult && (
                    <motion.div
                        key="result-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        // Only handle click for defeat to close, victory handles it internally
                        onClick={combatResult === 'defeat' ? handleGameOver : undefined}
                        className={`absolute inset-0 z-150 flex items-center justify-center bg-black/90 backdrop-blur-xl ${combatResult === 'defeat' ? 'cursor-pointer' : ''}`}
                    >
                        {combatResult === 'victory' ? (
                            <ResultVictory playerName={playerName} onBack={handleGameOver} lootItems={generatedLoot} />
                        ) : (
                            <ResultDefeat playerName={playerName} />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

}

function DarkOverlay() {
    return <div className="absolute inset-0 bg-black/50" />;
}



// Subcomponents for Results to keep main render clean
// Subcomponents for Results to keep main render clean
// Reusing RARITY_COLORS for consistency
const RARITY_COLORS: Record<string, { text: string, bg: string, border: string, gradient: string }> = {
    Common: { text: "text-gray-400", bg: "bg-gray-400", border: "border-gray-400", gradient: "from-gray-400" },
    Uncommon: { text: "text-green-400", bg: "bg-green-400", border: "border-green-400", gradient: "from-green-400" },
    Rare: { text: "text-blue-400", bg: "bg-blue-400", border: "border-blue-400", gradient: "from-blue-400" },
    Epic: { text: "text-purple-400", bg: "bg-purple-400", border: "border-purple-400", gradient: "from-purple-400" },
    Legendary: { text: "text-orange-400", bg: "bg-orange-400", border: "border-orange-400", gradient: "from-orange-400" }
};

function ResultVictory({ playerName, onBack, lootItems }: { playerName: string, onBack: () => void, lootItems: LootItem[] }) {
    const { inventory, inventoryCapacity, equipment, removeItemFromInventory, equipItem } = useAdventureStore();
    const { playSound } = useSoundStore();

    // Selection state for popup
    const [selectedItem, setSelectedItem] = useState<{ item: any, instanceId: string } | null>(null);

    // Create padded inventory grid (5x4 = 20 slots typically)
    const paddedInventory = [
        ...inventory,
        ...Array.from({ length: Math.max(0, inventoryCapacity - inventory.length) }).map((_, i) => ({
            instanceId: `empty-${i}`,
            icon: null,
            rarity: undefined,
            name: "Empty"
        }))
    ];

    // Mapping for inventory component (needs id, img, rarity)
    const inventoryProps = paddedInventory.map(item => ({
        id: item.instanceId,
        img: item.icon || null,
        rarity: item.rarity,
        label: item.name !== "Empty" ? item.name : undefined
    }));

    // Helper for stats
    const renderItemStats = (item: any) => {
        const stats = [];
        if (['Weapon', 'Ring', 'Book', 'Gem'].includes(item.type)) {
            stats.push({ label: 'Dégâts', value: item.attack });
            stats.push({ label: 'Critique', value: item.critical + "%" });
        }
        if (['Armor', 'Ring', 'Book', 'Gem'].includes(item.type)) {
            stats.push({ label: 'Santé', value: item.health });
            stats.push({ label: 'Énergie', value: item.energy });
        }
        if (item.type === 'Consumable') {
            stats.push({ label: 'Soin', value: item.heal });
            stats.push({ label: 'Usages', value: item.usages }); // Or charges
        }

        return (
            <div className="grid grid-cols-2 gap-2 mt-4 bg-white/5 p-2 rounded-sm">
                {stats.filter(s => s.value).map((stat, i) => (
                    <div key={i} className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider">
                        <span className="text-white/40">{stat.label}</span>
                        <span className="text-white">{stat.value}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="w-full h-full flex flex-col justify-between items-center relative overflow-hidden bg-[#050505] p-6 pb-20">
            {/* TOP Title */}
            <div className="w-full flex flex-col items-center pt-8 z-10 flex-none gap-2">
                <div className="w-[50%] text-center">
                    <h2 className="text-xl md:text-3xl lg:text-4xl font-black italic text-transparent bg-clip-text bg-linear-to-b from-amber-300 via-orange-400 to-amber-600 uppercase drop-shadow-[0_0_15px_rgba(251,191,36,0.3)] w-full break-words">
                        VICTOIRE
                    </h2>
                    <div className="h-px w-full bg-linear-to-r from-transparent via-amber-500/50 to-transparent mt-2" />
                </div>
            </div>

            {/* LOOT ACCORDION - Positioned just below title, Overlays everything */}
            <div className="flex-1 flex flex-col items-center w-full relative z-20 pointer-events-none mt-4">
                {/* Pointer events auto on children only to allow clicking through empty space if needed */}
                <div className="pointer-events-auto">
                    <LootAccordion items={lootItems} onContinue={onBack} />
                </div>
            </div>

            {/* BOTTOM Inventory */}
            <div className="w-full max-w-md z-10 flex-none">
                <Inventory
                    items={inventoryProps}
                    capacity={inventoryCapacity}
                    onItemClick={(item: { id: string | number }) => {
                        const original = inventory.find(i => i.instanceId === String(item.id));
                        if (original) {
                            playSound(CONST_ASSETS.SOUNDS.CLICK);
                            setSelectedItem({ item: original, instanceId: original.instanceId });
                        }
                    }}
                />
            </div>

            {/* ITEM DETAILS POPUP */}
            <AnimatePresence>
                {selectedItem && (
                    <ItemPopup
                        item={selectedItem.item}
                        onClose={() => setSelectedItem(null)}
                        actions={
                            <button
                                onClick={() => {
                                    playSound(CONST_ASSETS.SOUNDS.CLICK);
                                    removeItemFromInventory(selectedItem.instanceId);
                                    setSelectedItem(null);
                                }}
                                className="p-4 text-xs font-black text-red-400 uppercase active:bg-white/5 transition-colors hover:bg-red-500/10 w-full"
                            >
                                JETER
                            </button>
                        }
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function ResultDefeat({ playerName }: { playerName: string }) {
    return (
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
    );
}



