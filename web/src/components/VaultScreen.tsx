'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lock } from 'lucide-react';

import { useSoundStore } from '@/store/useSoundStore';
import { CONST_ASSETS } from '@/lib/preloader';

import ItemPic from '@/components/ItemPic';
import ItemPopup from '@/components/ItemPopup';
import Inventory from '@/components/Inventory';

import { useAdventureStore, InventoryItem } from '@/store/useAdventureStore';

interface VaultScreenProps {
    onSwitchScreen: (screen: string) => void;
}

interface VaultScreenProps {
    onSwitchScreen: (screen: string) => void;
}

export default function VaultScreen({ onSwitchScreen }: VaultScreenProps) {
    const { playSound } = useSoundStore();
    const {
        vault,
        inventory,
        inventoryCapacity,
        addToVault,
        removeFromVault
    } = useAdventureStore();

    const [selectedItem, setSelectedItem] = useState<{
        item: InventoryItem,
        source: 'vault' | 'inventory'
    } | null>(null);

    const handleBack = () => {
        playSound(CONST_ASSETS.SOUNDS.CLICK);
        onSwitchScreen('lobby');
    };

    // VAULT ITEMS (Dynamic + Padded to 9 or more?)
    // Game design: Vault has infinite space? Or fixed? 
    // Requirement didn't specify vault size.
    // StuffScreen mock had 9 slots (3x3). Let's stick to 9 for now, or expand if more items.
    // If vault has > 9 items, we can show scrolling or more rows.
    // Let's assume 3x3 min, but grows.

    const vaultCapacity = Math.max(9, Math.ceil(vault.length / 3) * 3);
    const paddedVault = [
        ...vault,
        ...Array.from({ length: vaultCapacity - vault.length }).map((_, i) => ({
            id: -(i + 1),
            instanceId: `vault-empty-${i}`,
            name: "Empty",

            rarity: "Common" as const,
            // Helper fields to satisfy type but won't be used
            icon: "", type: "Gem" as const, attack: 0, critical: 0, health: 0, energy: 0,
            sound: "", color: "", heal: 0, cooldown: 0, usages: 0, description: "",
            locked: false
        }))
    ];

    // INVENTORY ITEMS (Dynamic + Padded to capacity)
    const paddedInventory = [
        ...inventory,
        ...Array.from({ length: Math.max(0, inventoryCapacity - inventory.length) }).map((_, i) => ({
            id: `inv-empty-${i}`,
            instanceId: `inv-empty-${i}`,
            name: "Empty",
            icon: "",
            rarity: "Common" as const,
            type: "Gem" as const,
            attack: 0, critical: 0, health: 0, energy: 0, sound: "", color: "", heal: 0, cooldown: 0, usages: 0, description: "",
        }))
    ];

    const inventoryProps = paddedInventory.map(item => ({
        id: item.instanceId,
        img: item.icon || null,
        rarity: item.rarity,
        label: item.name !== "Empty" ? item.name : undefined,
    }));


    const handleDeposit = () => {
        if (selectedItem && selectedItem.source === 'inventory') {
            addToVault(selectedItem.item);
            playSound(CONST_ASSETS.SOUNDS.CLICK); // Deposit sound
            setSelectedItem(null);
        }
    };

    const handleWithdraw = () => {
        if (selectedItem && selectedItem.source === 'vault') {
            const success = removeFromVault(selectedItem.item.instanceId);
            if (success) {
                playSound(CONST_ASSETS.SOUNDS.CLICK); // Withdraw sound
                setSelectedItem(null);
            } else {
                playSound(CONST_ASSETS.SOUNDS.DESACTIVATION); // Full inventory
            }
        }
    };


    return (
        <div className="flex flex-col h-full bg-neutral-950 text-white font-sans relative overflow-hidden">
            {/* AMBIENT BACKGROUND */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.1),transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

            {/* HEADER */}
            <header className="relative z-10 flex items-center justify-between mb-4 p-6 pb-2">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 group active:scale-95 transition-transform"
                >
                    <div className="w-10 h-10 rounded-sm border border-white/10 flex items-center justify-center bg-white/5">
                        <ArrowLeft size={20} className="text-gray-400" />
                    </div>
                </button>
                <div className="text-right pr-1">
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-linear-to-b from-amber-200 to-amber-600 pr-2">{"BANQUE"}</h1>
                    <p className="text-[10px] font-black text-amber-500/60 tracking-[0.3em] uppercase">STOCKAGE SÉCURISÉ</p>
                </div>
            </header>

            {/* VAULT SAFETY HINT */}
            <div className="w-full flex flex-col items-center justify-center pb-4 relative z-10">
                <div className="w-full bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.6)_0%,transparent_70%)] py-2 flex justify-center">
                    <p className="text-[10px] font-bold italic text-amber-200  tracking-[0.15em] drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] text-center px-4">
                        {"CONSEIL : les objets stockés dans la banque seront sécurisés même après la mort du personnage"}
                    </p>
                </div>
                <div className="w-1/3 h-px bg-linear-to-r from-transparent via-amber-200/30 to-transparent" />
            </div>

            <main className="relative z-10 flex-1 flex flex-col px-4 gap-2 overflow-hidden pb-4">

                {/* VAULT SECTION - 3x3 MATCHING STUFF SCREEN STYLE */}
                <section className="flex flex-col gap-2 items-center justify-start shrink-0 py-4">
                    <div className="relative inline-block">
                        {/* Chest Container */}
                        {/* Reduced border opacity to /60 */}
                        <div className="bg-neutral-900/80 border-4 border-double border-amber-300/60 rounded-xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative overflow-hidden transition-colors group z-10">
                            {/* Inner Light / Shadow Simulation - Paladin Style */}
                            {/* Ref: Particle effect removed per user request */}
                            <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(251,191,36,0.6)] pointer-events-none z-0 mix-blend-screen" />
                            <div className="absolute inset-0 bg-radial-gradient from-amber-200/20 to-transparent opacity-100 pointer-events-none z-0" />

                            {/* Grid */}
                            <div className="grid grid-cols-3 gap-2 relative z-10 place-content-center"> {/* 3x3 Grid with perfect spacing */}
                                {paddedVault.map((item: InventoryItem) => (
                                    <motion.button
                                        key={item.instanceId}
                                        whileTap={item.name !== 'Empty' ? { scale: 0.95 } : {}}
                                        onClick={() => item.name !== 'Empty' && setSelectedItem({ item: item as InventoryItem, source: 'vault' })}
                                        className={`
                                            relative rounded-sm overflow-hidden transition-all flex items-center justify-center group
                                            ${item.name === 'Empty' ? 'opacity-30 cursor-default' : 'cursor-pointer'}
                                        `}
                                    >
                                        <ItemPic
                                            src={item.icon}
                                            rarity={item.rarity}
                                            size={56} // Matching standard size
                                            className={item.name === "Empty" ? "opacity-30 bg-white/5 border-white/5 shadow-none" : ""}
                                        />

                                        {/* Lock Icon for empty/locked slots in Vault context - replaced "locked" logic with "Empty" logic for now */}
                                        {item.name === 'Empty' && (
                                            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                                                <Lock size={16} className="text-white" />
                                            </div>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>



                {/* INVENTORY SECTION */}
                <Inventory
                    items={inventoryProps}
                    onItemClick={(uiItem) => {
                        const original = paddedInventory.find(i => i.instanceId === uiItem.id);
                        if (original && original.name !== "Empty") {
                            setSelectedItem({ item: original as InventoryItem, source: 'inventory' });
                        }
                    }}
                    className="mb-4"
                />

            </main>
            {/* ITEM DETAILS POPUP */}
            <AnimatePresence>
                {selectedItem && (
                    <ItemPopup
                        item={selectedItem.item}
                        onClose={() => setSelectedItem(null)}
                        actions={
                            <button
                                onClick={selectedItem.source === 'vault' ? handleWithdraw : handleDeposit}
                                className={`w-full p-4 text-xs font-black uppercase transition-colors text-amber-400 hover:bg-amber-500/10 active:bg-amber-500/20`}
                            >
                                {selectedItem.source === 'vault' ? 'RÉCUPÉRER' : 'DÉPOSER'}
                            </button>
                        }
                    />
                )}
            </AnimatePresence>
        </div>
    );
}


