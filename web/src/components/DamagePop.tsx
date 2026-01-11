"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

export type DamageType = "normal" | "crit" | "heal";

export interface DamageEvent {
    id: string;
    value: number;
    type: DamageType;
}

export default function DamagePop({
    event,
    onDone,
}: {
    event: DamageEvent;
    onDone: (id: string) => void;
}) {
    const { id, value, type } = event;

    useEffect(() => {
        const timeout = setTimeout(() => onDone(id), 600);
        return () => clearTimeout(timeout);
    }, [id]);

    const color =
        type === "crit" ? "#ff4d4d" : type === "heal" ? "#5cff87" : "#ffd76b";

    const shadow =
        type === "crit"
            ? "0 0 10px rgba(255,0,0,0.7)"
            : type === "heal"
                ? "0 0 10px rgba(92,255,135,0.7)"
                : "0 0 14px rgba(255,215,107,0.9)";

    const sizeClass = type === "crit" ? "text-2xl" : "text-xl";

    return (
        <motion.div
            initial={{ y: 80, opacity: 0, scale: 0.6 }}
            animate={{ y: 25, opacity: 1, scale: 1 }}
            exit={{ y: 15, opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className={`absolute left-1/2 -translate-x-1/2 ${sizeClass} font-extrabold pointer-events-none`}
            style={{
                top: "-10%",
                color,
                textShadow: shadow,
                letterSpacing: "0.04em",
            }}
        >
            {value}
        </motion.div>
    );
}
