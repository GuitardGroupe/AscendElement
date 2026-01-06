"use client";

import SkillButton from "./SkillButton";
import { Stim } from "@/lib/stim";
import { Skill, Defense } from "@/lib/skills";

export default function SkillGrid({
    skills,
    defenses,
    stims,
    stimUsages = {},
    cooldowns = {},
    currentEnergy = 0,
    onSkill,
    isCasting = false,
    currentCastSkillId = null,
}: {
    skills: Skill[];
    defenses: Defense[];
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

    const defenseButton = (idx: number, type: number) => {
        const defense = defenses[idx];
        if (!defense) return <div className="w-16 h-16 rounded-md bg-white/5 border border-white/5" />;
        return (
            <SkillButton
                img={defense.icon}
                cooldown={cooldowns[defense.id] || 0}
                maxCooldown={defense.cooldown}
                energyCost={0}
                currentEnergy={currentEnergy}
                isCasting={false}
                onClick={() => onSkill(type, defense.id)}
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
                anySkillCasting={isCasting}
                onClick={() => onSkill(type, stim.id)}
            />
        );
    };

    return (
        <div className="grid grid-cols-3 gap-2 relative w-fit pointer-events-auto">
            <div />
            <div />
            {defenseButton(0, 4)} {/* defense */}
            <div />
            {skillButton(0, 0)} {/* simple */}
            {skillButton(2, 2)} {/* control */}
            {stimButton(0, 5)} {/* injector */}
            {skillButton(1, 1)} {/* heavy */}
            {skillButton(3, 3)} {/* ultimate */}
        </div>
    );
}
