"use client";

import SkillButton from "./SkillButton";

export default function SkillGrid({
    skills,
    onSkill,
}: {
    skills: {
        simple: string;
        control: string;
        heavy: string;
        weapon: string;
        injector: string;
        ultimate: string;
    };
    onSkill: (type: number) => void;
}) {
    return (
        <div className="grid grid-cols-3 gap-2 relative w-fit pointer-events-auto">
            <div></div>
            <div></div>
            <SkillButton
                img={skills.weapon}
                onClick={() => onSkill(4)}
            />
            <div></div>
            <SkillButton
                img={skills.simple}
                onClick={() => onSkill(0)}
            />
            <SkillButton
                img={skills.control}
                onClick={() => onSkill(2)}
            />
            <SkillButton
                img={skills.injector}
                onClick={() => onSkill(5)}
            />
            <SkillButton
                img={skills.heavy}
                onClick={() => onSkill(1)}
            />
            <SkillButton
                img={skills.ultimate}
                onClick={() => onSkill(3)}
            />
        </div>
    );
}
