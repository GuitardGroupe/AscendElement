"use client";

import Image from "next/image";
import { motion } from 'framer-motion';

import { CONST_ASSETS } from '@/lib/preloader';
const CONST_CRYSTAL_ACTIVE = CONST_ASSETS.IMAGES.CRYSTAL_ACTIVE_ALPHA;
const CONST_CRYSTAL_INACTIVE = CONST_ASSETS.IMAGES.CRYSTAL_INACTIVE;

const C_WIDTH = 400;
const C_HEIGHT = 400;

interface ElementCrystalProps {
    img: string;
    isActive: boolean;
    onClick?: () => void;
}

export default function ElementCrystal({
    img,
    isActive,
    onClick
}: ElementCrystalProps) {

    return (
        < button
            onClick={onClick}
            className="relative flex items-center justify-center"
            style={{ width: C_WIDTH, height: C_HEIGHT }}
        >
            <div className="relative w-full h-full">
                <div className=" absolute inset-0 flex items-center mt-[-120px] justify-center">
                    {
                        isActive ? (
                            <div className="relative w-30 h-30 overflow-hidden" >
                                <Image
                                    src={img}
                                    alt={img}
                                    fill
                                    priority
                                    className="mt-5 object-cover object-[100%_0%] scale-150 origin-top"
                                />

                            </div>
                        ) : (
                            <div className=" absolute inset-0 flex items-center justify-center" >
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
                <motion.img
                    src={CONST_CRYSTAL_ACTIVE}
                    alt="Active Crystal"
                    className="absolute inset-0 w-full h-full object-contain"
                    animate={{
                        opacity: isActive ? 1 : 0,
                    }}
                    style={{ willChange: "opacity" }}
                    transition={{ duration: 0.3 }}
                />

                <motion.img
                    src={CONST_CRYSTAL_INACTIVE}
                    alt="Inactive Crystal"
                    className="absolute inset-0 w-full h-full object-contain opacity-80"
                    animate={{
                        opacity: isActive ? 0 : 1,
                    }}
                    style={{ willChange: "opacity" }}
                    transition={{ duration: 0.3 }}
                />
            </div>
        </button >
    );
}

/*
<div
                    className="relative z-10 text-center flex flex-col items-center justify-center"
                >
                    <div className="relative w-100 h-100 flex items-center justify-center">
                        <motion.div
                            className="absolute inset-0 rounded-full bg-cyan-500/20 blur-[20px]" // Reduced blur radius and opacity
                            animate={{
                                opacity: isCrystalActive ? 1 : 0, // Animate opacity instead of scale for better perf
                            }}
                            style={{
                                willChange: "opacity", // Hint to browser
                                transform: "translateZ(0)" // Force hardware acceleration
                            }}
                            transition={{ duration: 0.3 }}
                        />

                        
                        <div className="absolute mt-[-112px]">
                            <CharacterPortrait
                                img={selectedCharacter?.img ?? ""}
                                isActive={isCrystalActive}
                                handleClick={handleCrystalClick}
                            />
                        </div>

                    </div>
                </div>







                < button
            onClick={onClick}
            className="relative flex items-center justify-center"
            style={{ width: C_WIDTH, height: C_HEIGHT }}
        >
            
        </button >

                */