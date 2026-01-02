"use client";

import SkillButton from "./SkillButton";
import { Skill, Item } from "@/lib/skills";

export default function SkillGrid({
    skills,
    weapon,
    stim,
    cooldowns = {},
    onSkill,
}: {
    skills: Skill[];
    weapon: Item;
    stim: Item;
    cooldowns?: Record<number, number>;
    onSkill: (type: number) => void;
}) {

    const skillButton = (idx: number, type: number) => {
        const skill = skills[idx];
        if (!skill) return <div className="w-16 h-16 rounded-md bg-white/5 border border-white/5" />;
        return (
            <SkillButton
                img={skill.icon}
                cooldown={cooldowns[skill.id] || 0}
                maxCooldown={skill.cooldown}
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
                onClick={() => onSkill(type)}
            />
        );
    };

    const stimButton = (stim: Item, type: number) => {
        if (!stim) return <div className="w-16 h-16 rounded-md bg-white/5 border border-white/5" />;
        return (
            <SkillButton
                img={stim.icon}
                cooldown={cooldowns[stim.id] || 0}
                maxCooldown={stim.cooldown}
                onClick={() => onSkill(type)}
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
            {stimButton(stim, 5)} {/* injector */}
            {skillButton(1, 1)} {/* heavy */}
            {skillButton(3, 3)} {/* ultimate */}
        </div>
    );
}
