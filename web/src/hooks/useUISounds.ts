import { useRef, useEffect } from "react";

export default function useUISound(
    path = "/sounds/uiClick01.mp3",
    volume = 0.7
) {
    const soundRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const audio = new Audio(path);
        audio.volume = volume;
        soundRef.current = audio;
    }, [path, volume]);

    const play = () => {
        if (!soundRef.current) return;
        soundRef.current.currentTime = 0;
        soundRef.current.playbackRate = 0.95 + Math.random() * 0.1;
        soundRef.current.play().catch(() => { });
    };

    return play;
}
