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
const CONST_OPPONENT_NAME = "Arsenic";
const CONST_OPPONENT_MAX_ENERGY = 100;
const CONST_OPPONENT_MAX_HP = 100;
const CONST_LABEL_FLEE = "Fuir";

interface FightScreenProps {
    onSwitchScreen: (screen: string) => void;
}
export default function FightScreen({ onSwitchScreen }: FightScreenProps) {

    const { playSound } = useSoundStore();
    const [winner, setWinner] = useState<string | null>(null);

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
    const [playerEnergy, setPlayerEnergy] = useState(
        selectedCharacter?.stat_energy ?? 50
    );
    const [playerHitTime, setPlayerHitTime] = useState(0);
    const [playerDamageEvents, setPlayerDamageEvents] = useState<DamageEvent[]>(
        []
    );
    const [playerIsCasting, setPlayerIsCasting] = useState(false);
    const playerCastRef = useRef<NodeJS.Timeout | null>(null);
    const [playerCurrentCastSkill, setPlayerCurrentCastSkill] =
        useState<Skill | null>(null);
    const [playerCastProgress, setPlayerCastProgress] = useState(0);
    const [playerCooldowns, setPlayerCooldowns] = useState([]);

    // OPPONENT
    const opponentBackground = CONST_ASSETS.IMAGES.CHAR_AS;
    const opponentName = CONST_OPPONENT_NAME;
    const opponentColor = "#F54927";
    const [opponentHealth, setOpponentHealth] = useState(100);
    const [opponentEnergy, setOpponentEnergy] = useState(100);
    const [opponentHitTime, setOpponentHitTime] = useState(0);
    const [opponentDamageEvents, setOpponentDamageEvents] = useState<
        DamageEvent[]
    >([]);
    const [opponentIsCasting, setOpponentIsCasting] = useState(false);

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
        target: "player" | "enemy",
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
    const applyDamage = (target: "player" | "enemy", amount: number) => {
        const isCrit = Math.random() < 0.2; // exemple : 20% crit
        const finalAmount = isCrit ? Math.round(amount * 1.5) : amount;
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
                const newHP = Math.max(0, hp - amount);
                setOpponentHitTime(Date.now());
                pushDamageEvent("enemy", finalAmount, damageType);
                if (newHP <= 0) endCombat("Joueur vainqueur");
                return newHP;
            });
        }
    };

    // SKILL EFFECT
    const applySkillEffects = (skill: Skill) => {
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
        }
    };

    // INTERRUPT CAST
    const interruptCast = () => {
        if (playerCastRef.current) clearInterval(playerCastRef.current);

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

        const duration = skill.castTime; // en ms
        const step = 16; // ~60 FPS
        let elapsed = 0;

        playerCastRef.current = setInterval(() => {
            elapsed += step;
            const pct = Math.min(100, (elapsed / duration) * 100);
            setPlayerCastProgress(pct);

            // FIN DE CAST
            if (pct >= 100) {
                clearInterval(playerCastRef.current!);
                playerCastRef.current = null;
                setPlayerIsCasting(false);

                playSound(skill.impactSound);
                applySkillEffects(skill);
                // triggerCooldown(skill.id, skill.cooldown);
            }
        }, step);
    };

    // HANDLE SKILL LAUNCH
    const handleSkill = (skill: string) => {
        // -- Instrum : à effacer plus tard
        console.log(skill);

        const skills = selectedCharacter
            ? skillSets[selectedCharacter?.symbol as ElementKey]
            : [];

        console.log(skills);

        if (playerIsCasting) {
            interruptCast();
        }

        if (!playerEnergy) return;
        // 1. Vérif énergie
        //if (playerEnergy < skill.energyCost) return;

        // 2. Vérif cooldown
        //if (playerCooldowns[skill.id] > 0) return;

        // 3. Si cast instantané
        /*
        if (skill.castTime <= 0) {
          playSound(skill.impactSound);
          applySkillEffects(skill);
          //triggerCooldown(skill.id, skill.cooldown);
          return;
        }
    
        // 4. Sinon → CAST
        startCast(skill);
    
        // gestion énergie & dégâts très simple pour l’instant
        switch (id) {
          case 1: // attaque de base
            applyDamage("enemy", 10);
            break;
          case 2: // attaque lourde
            if (playerEnergy < 20) return;
            setPlayerEnergy((e) => e - 20);
            applyDamage("enemy", 20);
            break;
          case 3: // contrôle
            if (playerEnergy < 25) return;
            setPlayerEnergy((e) => e - 25);
            applyDamage("enemy", 5);
            break;
          case 4: // ultime
            if (playerEnergy < 40) return;
            setPlayerEnergy((e) => e - 40);
            applyDamage("enemy", 35);
            setPlayerHP((hp) => Math.min(MAX_HP, hp + 20));
            break;
          case 5: // ultime
            if (playerEnergy < 40) return;
            setPlayerEnergy((e) => e - 40);
            applyDamage("enemy", 35);
            setPlayerHP((hp) => Math.min(MAX_HP, hp + 20));
            break;
          case 6: // ultime
            if (playerEnergy < 40) return;
            setPlayerEnergy((e) => e - 40);
            applyDamage("enemy", 35);
            setPlayerHP((hp) => Math.min(MAX_HP, hp + 20));
            break;
        }
    
        // cooldown universel 1s
        setUniversalCd(true);
        setTimeout(() => setUniversalCd(false), 1000);
        */
    };



    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* BACKGROUND */}
            <div className="absolute inset-0 flex flex-col">
                {/* OPPONENT BACKGROUND */}
                <div className="relative flex-1">
                    <BattleZoneBackground
                        src={opponentBackground}
                        scale={1.5}
                        origin="origin-top-left"
                        objectPosition="object-[100%_0%]"
                        blur={0}
                    />
                    <DarkOverlay />
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
                        <div className="mr-5 flex justify-end text-l font-semibold">
                            {opponentName}
                        </div>
                        {/* OPPONENT CASTBAR  */}
                        <div className="flex items-center justify-center">
                            <div className="w-[30%] ">
                                <CastBar progress={85} />
                            </div>
                        </div>
                    </div>
                </div>
                {/* PLAYER BACKGROUND */}
                <div className="relative flex-1">
                    <BattleZoneBackground
                        src={playerBackground}
                        scale={1.5}
                        origin="origin-top-right"
                        objectPosition="object-[0%_0%]"
                        blur={0}
                    />
                    <DarkOverlay />
                    {/* PLAYER AREA */}
                    <div className="absolute inset-0 flex-1 flex flex-col justify-start pt-15 pl-5 pr-5 gap-2">
                        {/* PLAYER CASTBAR */}
                        <div className="flex items-center justify-center">
                            <div className="w-[30%] ">
                                <CastBar progress={50} />
                            </div>
                        </div>
                        {/* PLAYER NAME */}
                        <div className="flex items-center justify-center">
                            <div className="ml-5 flex-1 text-l font-semibold">
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
                {/* CRISTAL AREA */}
                <div className="absolute flex inset-0 items-center justify-center ">
                    <div className="relative flex items-center justify-center gap-2 pointer-events-none">
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
                            className="w-16 h-16 rounded-full border-4 border-cyan-400 flex items-center justify-center text-xl font-bold shadow-[0_0_14px_rgba(0,255,255,0.6)] bg-black/40"
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
                    <div className="absolute inset-0 flex flex-col px-5 py-5 pointer-events-none">
                        <Title label={CONST_TITLE} />
                    </div>
                    {/* SKILLS */}
                    <div className="absolute bottom-0 right-0 left-0 p-5 flex-1 flex items-end justify-between gap-3 pt-2">
                        {/* FLEE */}
                        <button
                            onClick={handleFlee}
                            className="pointer-events-auto w-16 h-16 rounded-xl bg-red-700/80 border border-red-400/80 flex items-center justify-center text-xl font-bold shadow-[0_0_15px_rgba(255,0,0,0.6)] active:scale-95"
                        >
                            {CONST_LABEL_FLEE}
                        </button>
                        <SkillGrid
                            skills={{
                                simple: CONST_ASSETS.IMAGES.SKILL_1,
                                control: CONST_ASSETS.IMAGES.SKILL_3,
                                weapon: CONST_ASSETS.IMAGES.SKILL_WEAPON,
                                heavy: CONST_ASSETS.IMAGES.SKILL_2,
                                injector: CONST_ASSETS.IMAGES.SKILL_INFUSOR,
                                ultimate: CONST_ASSETS.IMAGES.SKILL_4,
                            }}
                            onSkill={(type) => handleSkill(type)}
                        />
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
        <div className="absolute top-3 left-1/2 -translate-x-1/2 text-lg font-bold tracking-[0.3em] uppercase text-white">
            {label}
        </div>
    );
}


