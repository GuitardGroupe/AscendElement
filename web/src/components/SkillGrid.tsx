"use client";

import SkillButton from "./SkillButton";
import { Stim } from "@/lib/stim";
import { Skill, Item } from "@/lib/skills";

export default function SkillGrid({
    skills,
    weapon,
    stims,
    stimUsages = {},
    cooldowns = {},
    currentEnergy = 0,
    onSkill,
    isCasting = false,
    currentCastSkillId = null,
}: {
    skills: Skill[];
    weapon: Item;
    stims: Stim[];
    stimUsages?: Record<number, number>;
    cooldowns?: Record<number, number>;
    currentEnergy?: number;
    onSkill: (type: number, id?: number) => void;
    isCasting?: boolean;
    currentCastSkillId?: number | null;
}) {

    const skillButton = (idx: number, type: number) => {
        const skill = skills[idx];
        if (!skill) return <div className="w-16 h-16 rounded-md bg-white/5 border border-white/5" />;
        return (
            <SkillButton
                img={skill.icon}
                cooldown={cooldowns[skill.id] || 0}
                maxCooldown={skill.cooldown}
                energyCost={skill.energyCost}
                currentEnergy={currentEnergy}
                isCasting={isCasting && currentCastSkillId === skill.id}
                onClick={() => onSkill(type)}
            />
        );
    };

    const weaponButton = (weapon: Item, type: number) => {
        if (!weapon) return <div className="w-16 h-16 rounded-md bg-white/5 border border-white/5" />;
        return (
            <SkillButton
                img={weapon.icon}
                cooldown={cooldowns[weapon.id] || 0}
                maxCooldown={weapon.cooldown}
                energyCost={weapon.energyCost}
                currentEnergy={currentEnergy}
                isCasting={isCasting && currentCastSkillId === weapon.id}
                onClick={() => onSkill(type)}
            />
        );
    };

    const stimButton = (idx: number, type: number) => {
        const stim = stims[idx];
        if (!stim) return <div className="w-16 h-16 rounded-md bg-white/5 border border-white/5" />;
        return (
            <SkillButton
                img={stim.img}
                cooldown={cooldowns[stim.id] || 0}
                maxCooldown={stim.cooldown}
                usages={stimUsages[stim.id]}
                showTimer={false}
                onClick={() => onSkill(type, stim.id)}
            />
        );
    };

    return (
        <div className="grid grid-cols-3 gap-2 relative w-fit pointer-events-auto">
            <div />
            <div />
            {weaponButton(weapon, 4)} {/* weapon */}
            <div />
            {skillButton(0, 0)} {/* simple */}
            {skillButton(2, 2)} {/* control */}
            {stimButton(0, 5)} {/* injector */}
            {skillButton(1, 1)} {/* heavy */}
            {skillButton(3, 3)} {/* ultimate */}
        </div>
    );
}
