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
    onSkill: (type: string) => void;
}) {
    return (
        <div className="grid grid-cols-3 gap-2 relative w-fit pointer-events-auto">
            <div></div>
            <div></div>
            <SkillButton
                img={skills.weapon}
                keybind="A"
                onClick={() => onSkill("weapon")}
            />
            <div></div>
            <SkillButton
                img={skills.simple}
                keybind="S"
                onClick={() => onSkill("simple")}
            />
            <SkillButton
                img={skills.control}
                keybind="P"
                onClick={() => onSkill("control")}
            />
            <SkillButton
                img={skills.injector}
                keybind="I"
                onClick={() => onSkill("injector")}
            />
            <SkillButton
                img={skills.heavy}
                keybind="C"
                onClick={() => onSkill("heavy")}
            />
            <SkillButton
                img={skills.ultimate}
                keybind="U"
                onClick={() => onSkill("ultimate")}
            />
        </div>
    );
}
