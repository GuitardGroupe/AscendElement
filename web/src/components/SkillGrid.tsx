"use client";

import SkillButton from "./SkillButton";
import { Skill } from "@/lib/skills";

export default function SkillGrid({
    skills,
    cooldowns = {},
    currentSkillId,
    onSkill,
}: {
    skills: Skill[];
    cooldowns?: Record<number, number>;
    currentSkillId?: number | null;
    onSkill: (type: number) => void;
}) {
    const getBtn = (idx: number, type: number) => {
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

    return (
        <div className="grid grid-cols-3 gap-2 relative w-fit pointer-events-auto">
            <div />
            <div />
            {getBtn(4, 4)} {/* weapon */}
            <div />
            {getBtn(0, 0)} {/* simple */}
            {getBtn(2, 2)} {/* control */}
            {getBtn(5, 5)} {/* injector */}
            {getBtn(1, 1)} {/* heavy */}
            {getBtn(3, 3)} {/* ultimate */}
        </div>
    );
}
