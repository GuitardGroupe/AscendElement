"use client";
import { create } from "zustand";

interface Character {
    id: number;
    name: string;
    symbol: string;
    img: string;
    img_h: string;
    color: string;
    stat_hp: number;
    stat_energy: number;
    stat_hp_regen: number;
    stat_energy_regen: number;
    stat_attack: number;
    stat_critical: number;
    stat_haste: number;
    stat_def: number;
}

interface CharacterStore {
    selectedCharacter: Character | null;
    setSelectedCharacter: (char: Character) => void;
    clearSelectedCharacter: () => void;
}

export const useSelectedCharacter = create<CharacterStore>((set) => ({
    selectedCharacter: null,
    setSelectedCharacter: (char) => set({ selectedCharacter: char }),
    clearSelectedCharacter: () => set({ selectedCharacter: null }),
}));
