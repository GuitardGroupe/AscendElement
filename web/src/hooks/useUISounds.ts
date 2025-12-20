import { useRef, useEffect } from "react";
import { Howl } from "howler";

export default function useUISound(
    path = "/sounds/ui/click.mp3",
    volume = 0.7
) {
    const soundRef = useRef<Howl | null>(null);

    useEffect(() => {
        soundRef.current = new Howl({
            src: [path],
            volume: volume,
            html5: true, // Forces HTML5 Audio, good for large files/mobile compatibility sometimes, but for UI sfx keep false usually. Let's try false (default) for low latency.
        });

        return () => {
            soundRef.current?.unload();
        };
    }, [path, volume]);

    const play = () => {
        if (!soundRef.current) return;
        // Randomize pitch slightly for variation
        soundRef.current.rate(0.95 + Math.random() * 0.1);
        soundRef.current.play();
    };

    return play;
}
