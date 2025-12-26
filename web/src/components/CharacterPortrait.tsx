"use client";

import Image from "next/image";
import { CONST_ASSETS } from '@/lib/preloader';

const CONST_PORTRAIT_FRAME = CONST_ASSETS.IMAGES.CHARACTER_FRAME;
const C_COEF = 0.5;
const C_WIDTH = 195 * C_COEF;
const C_HEIGHT = 195 * C_COEF;

interface CharacterPortraitProps {
    img: string;
    isActive: boolean;
    handleClick?: () => void;
}

export default function CharacterPortrait({
    img,
    isActive,
    handleClick
}: CharacterPortraitProps) {

    return (
        < button
            onClick={handleClick}
            className="relative flex items-center justify-center"
            style={{ width: C_WIDTH, height: C_HEIGHT }}
        >
            < div
                className=" absolute inset-x-2 inset-y-2 overflow-hidden"
            >
                {
                    isActive ? (
                        <Image
                            src={img}
                            alt={img}
                            fill
                            priority
                            className="object-cover object-[100%_0%] scale-200 origin-top"
                        />
                    ) : (
                        <div className=" absolute inset-0 bg-black/80 flex items-center justify-center" >
                            <div
                                className=" text-white text-5xl drop-shadow-[0_0_6px_rgba(120,180,255,0.9)]"
                                style={{
                                    zIndex: 25,
                                    textShadow: `
                  0 0 10px rgba(120,180,255,0.8),
                  0 0 20px rgba(150,100,255,0.5),
                  0 0 30px rgba(90,180,255,0.3)
                `,
                                }}
                            >
                                {"+"}
                            </div>
                        </div>
                    )}
            </div >

            < div
                className="absolute inset-0 flex pointer-events-none"
                style={{
                    filter: "drop-shadow(0 0px 3px rgba(0, 0, 0, 1))",
                }}
            >
                <Image
                    src={CONST_PORTRAIT_FRAME}
                    alt="Cadre du slot"
                    fill
                    priority
                    className="object-contain"
                />
            </div >
        </button >
    );
}