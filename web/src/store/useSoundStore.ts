"use client";
import { create } from "zustand";
import { Howl } from "howler";

interface SoundStore {
    sounds: Record<string, Howl>;
    playSound: (path: string, volume?: number) => void;
}

export const useSoundStore = create<SoundStore>((set, get) => ({
    sounds: {},
    playSound: (path, volume = 0.7) => {
        const { sounds } = get();
        let sound = sounds[path];

        if (!sound) {
            sound = new Howl({
                src: [path],
                volume: volume,
                html5: false, // low latency for sfx
            });
            set((state) => ({
                sounds: { ...state.sounds, [path]: sound }
            }));
        }

        // Play the sound
        if (sound.playing()) {
            sound.stop(); // Allow re-triggering UI sounds instantly
        }

        sound.volume(volume);
        sound.play();
    },
}));
