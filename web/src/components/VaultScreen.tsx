'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lock, Sword, Circle, Heart, Crosshair, Flame, Clock, Repeat } from 'lucide-react';
import { Item } from '@/lib/items'; // Added Item type

import { useSoundStore } from '@/store/useSoundStore';
import { CONST_ASSETS } from '@/lib/preloader';

import ItemPic from '@/components/ItemPic';


import Inventory from '@/components/Inventory';

import { useAdventureStore, InventoryItem } from '@/store/useAdventureStore';

const RARITY_COLORS: Record<string, { text: string, bg: string, border: string, from: string, via: string, to: string }> = {
    Common: { text: 'text-gray-400', bg: 'bg-gray-400', border: 'border-gray-400', from: 'from-gray-500', via: 'via-gray-400', to: 'to-gray-500' },
    Uncommon: { text: 'text-green-400', bg: 'bg-green-400', border: 'border-green-400', from: 'from-green-500', via: 'via-green-400', to: 'to-green-500' },
    Rare: { text: 'text-blue-400', bg: 'bg-blue-400', border: 'border-blue-400', from: 'from-blue-500', via: 'via-blue-400', to: 'to-blue-500' },
    Epic: { text: 'text-purple-400', bg: 'bg-purple-400', border: 'border-purple-400', from: 'from-purple-500', via: 'via-purple-400', to: 'to-purple-500' },
    Legendary: { text: 'text-orange-400', bg: 'bg-orange-400', border: 'border-orange-400', from: 'from-orange-500', via: 'via-orange-400', to: 'to-orange-500' }
};

const renderItemStats = (item: Item) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stats: any[] = [];

    // Weapon: Dmg, Crit
    if (item.type === 'Weapon') {
        if (item.attack) stats.push({ label: 'Dégâts', value: `+${item.attack}`, icon: Sword });
        if (item.critical) stats.push({ label: 'Critique', value: `+${item.critical}%`, icon: Crosshair });
    }
    // Armor: HP, Energy
    if (item.type === 'Armor') {
        if (item.health) stats.push({ label: 'Santé', value: `+${item.health}`, icon: Heart });
        if (item.energy) stats.push({ label: 'Énergie', value: `+${item.energy}`, icon: Flame });
    }
    // Book/Ring/Gem: HP, Energy, Dmg, Crit
    if (['Book', 'Ring', 'Gem'].includes(item.type)) {
        if (item.health) stats.push({ label: 'Santé', value: `+${item.health}`, icon: Heart });
        if (item.energy) stats.push({ label: 'Énergie', value: `+${item.energy}`, icon: Flame });
        if (item.attack) stats.push({ label: 'Dégâts', value: `+${item.attack}`, icon: Sword });
        if (item.critical) stats.push({ label: 'Critique', value: `+${item.critical}%`, icon: Crosshair });
    }
    // Consumable: Heal, CD, Usages
    if (item.type === 'Consumable') {
        if (item.heal) stats.push({ label: 'Soin', value: `${item.heal} HP`, icon: Heart });
        if (item.cooldown) stats.push({ label: 'Recharge', value: `${item.cooldown / 1000}s`, icon: Clock });
        if (item.usages) stats.push({ label: 'Charges', value: `${item.usages}`, icon: Repeat });
    }

    if (stats.length === 0) return null;

    return (
        <div className="grid grid-cols-2 gap-2 mt-4 bg-black/20 p-3 rounded-lg">
            {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-2">
                    <stat.icon size={14} className="text-white/60" />
                    <span className="text-sm font-medium text-white/90">{stat.value}</span>
                    <span className="text-[10px] uppercase tracking-wider text-white/50">{stat.label}</span>
                </div>
            ))}
        </div>
    );
};

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
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedItem(null)}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-pointer"
                    >
                        <motion.div
                            initial={{ y: 200 }}
                            animate={{ y: 0 }}
                            exit={{ y: 200 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-sm bg-neutral-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                        >
                            <div className={`p-1 h-1 bg-linear-to-r ${RARITY_COLORS[selectedItem.item.rarity || 'Common'].from} ${RARITY_COLORS[selectedItem.item.rarity || 'Common'].via} ${RARITY_COLORS[selectedItem.item.rarity || 'Common'].to}`} />
                            <div className="p-6">
                                <div className="flex gap-4">
                                    <div className="shrink-0">
                                        <ItemPic
                                            src={selectedItem.item.icon}
                                            rarity={selectedItem.item.rarity}
                                            size={80}
                                            className={!selectedItem.item.icon ? "opacity-30 border-white/10" : ""}
                                        />
                                        {!selectedItem.item.icon && (
                                            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                                                <Circle className="text-white/20" size={32} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`text-lg font-black italic uppercase tracking-tight ${RARITY_COLORS[selectedItem.item.rarity || 'Common'].text}`}>{selectedItem.item.name}</h3>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 block ${RARITY_COLORS[selectedItem.item.rarity || 'Common'].text} opacity-80`}>
                                            {selectedItem.source === 'vault' ? 'STOCKÉ' : 'DANS LE SAC'} • {selectedItem.item.rarity}
                                        </span>
                                        <p className="text-xs text-gray-400 leading-relaxed italic border-l-2 border-white/10 pl-2">
                                            &quot;{selectedItem.item.description || "Un objet mystérieux."}&quot;
                                        </p>
                                    </div>
                                </div>
                                {renderItemStats(selectedItem.item)}
                            </div>
                            <button
                                onClick={selectedItem.source === 'vault' ? handleWithdraw : handleDeposit}
                                className={`w-full p-4 text-xs font-black uppercase transition-colors border-t border-white/10 ${selectedItem.source === 'vault' ? 'text-cyan-400 active:bg-cyan-900/20' : 'text-amber-400 active:bg-amber-900/20'}`}
                            >
                                {selectedItem.source === 'vault' ? 'RÉCUPÉRER' : 'DÉPOSER'}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}


