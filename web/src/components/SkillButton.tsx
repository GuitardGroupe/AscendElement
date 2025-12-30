"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function SkillButton({
    img,
    size = 64,
    onClick,
}: {
    img: string;
    size?: number;
    onClick?: () => void;
}) {

    return (
        <motion.div
            className={`relative rounded-md overflow-hidden bg-[#0c0f14] border transition-all`}
            style={{ width: size, height: size }}
            onClick={() => onClick?.()}
        >
            <Image
                src={img}
                fill
                alt="skill"
                className="object-cover pointer-events-none"
            />
        </motion.div>
    );
}
