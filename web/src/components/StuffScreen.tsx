'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sword, Zap, Shield, Gem, BookOpen, Circle, Heart, Crosshair, Flame, Droplets, Clock, Repeat } from 'lucide-react';
import { Item } from '@/lib/items';

const RARITY_COLORS: Record<string, { text: string, bg: string, border: string, from: string, via: string, to: string }> = {
    Common: { text: 'text-gray-400', bg: 'bg-gray-400', border: 'border-gray-400', from: 'from-gray-500', via: 'via-gray-400', to: 'to-gray-500' },
    Uncommon: { text: 'text-green-400', bg: 'bg-green-400', border: 'border-green-400', from: 'from-green-500', via: 'via-green-400', to: 'to-green-500' },
    Rare: { text: 'text-blue-400', bg: 'bg-blue-400', border: 'border-blue-400', from: 'from-blue-500', via: 'via-blue-400', to: 'to-blue-500' },
    Epic: { text: 'text-purple-400', bg: 'bg-purple-400', border: 'border-purple-400', from: 'from-purple-500', via: 'via-purple-400', to: 'to-purple-500' },
    Legendary: { text: 'text-orange-400', bg: 'bg-orange-400', border: 'border-orange-400', from: 'from-orange-500', via: 'via-orange-400', to: 'to-orange-500' }
};

const renderItemStats = (item: Item) => {
    const stats = [];

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
import { useSoundStore } from '@/store/useSoundStore';
import { useSelectedCharacter } from "@/store/useSelectedCharacter";
import { CONST_ASSETS } from '@/lib/preloader';
import { useState } from 'react';

import ItemPic from '@/components/ItemPic';
import ItemPopup from '@/components/ItemPopup';
import Inventory from '@/components/Inventory';
import { useAdventureStore, EquipmentSlotId, InventoryItem } from '@/store/useAdventureStore';

interface StuffScreenProps {
    onSwitchScreen: (screen: string) => void;
}

export default function StuffScreen({ onSwitchScreen }: StuffScreenProps) {
    const { playSound } = useSoundStore();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { selectedCharacter } = useSelectedCharacter();
    const {
        inventory,
        equipment,
        inventoryCapacity,
        equipItem,
        unequipItem,
        removeItemFromInventory
    } = useAdventureStore();

    // Track selected item. We need to know if it comes from inventory or equipment.
    // Enhanced state to track source
    const [selectedItem, setSelectedItem] = useState<{
        item: InventoryItem,
        source: 'inventory' | 'equipment',
        slotId?: EquipmentSlotId
    } | null>(null);

    const handleBack = () => {
        playSound(CONST_ASSETS.SOUNDS.CLICK);
        onSwitchScreen('lobby');
    };

    // ACTIVE EQUIPMENT CONFIG
    // Use the slot keys to map to UI
    const equipmentUiConfig: { id: EquipmentSlotId, label: string, icon: any, color: string }[] = [
        { id: 'weapon', label: 'ARME', icon: Sword, color: 'text-amber-400' },
        { id: 'armor', label: 'ARMURE', icon: Shield, color: 'text-purple-400' },
        { id: 'consumable', label: 'SOIN', icon: Zap, color: 'text-cyan-400' },
        { id: 'ring', label: 'ANNEAU', icon: Circle, color: 'text-blue-400' },
        { id: 'book', label: 'GRIMOIRE', icon: BookOpen, color: 'text-orange-400' },
        { id: 'gem', label: 'GEMME', icon: Gem, color: 'text-emerald-400' },
    ];

    // INVENTORY DISPLAY
    // We need to fill remaining slots with "empty" placeholders for visual grid consistency if desired,
    // or just pass the items to Inventory component which handles grid.
    // Inventory component expects InventoryItem[] but maybe we should map to its interface?
    // Inventory component interface: { id: string|number, img: string|null, rarity?: string ... }
    // Let's pass the real items. If we want empty slots we can pad it.

    const paddedInventory = [
        ...inventory,
        ...Array.from({ length: Math.max(0, inventoryCapacity - inventory.length) }).map((_, i) => ({
            id: -(i + 1),
            instanceId: `empty-${i}`,
            name: "Empty",
            icon: "",
            rarity: "Common" as const,
            type: "Gem" as const,
            attack: 0, critical: 0, health: 0, energy: 0, sound: "", color: "", heal: 0, cooldown: 0, usages: 0, description: ""
        }))
    ];

    const inventoryProps = paddedInventory.map(item => ({
        id: item.instanceId,
        img: item.icon || null, // Empty slots have ""
        rarity: item.rarity,
        label: item.name !== "Empty" ? item.name : undefined,
        original: item // Keep reference
    }));


    const handleEquip = () => {
        if (selectedItem && selectedItem.source === 'inventory') {
            equipItem(selectedItem.item);
            playSound(CONST_ASSETS.SOUNDS.CLICK); // Should ideally be an equip sound
            setSelectedItem(null);
        }
    };

    const handleUnequip = () => {
        if (selectedItem && selectedItem.source === 'equipment' && selectedItem.slotId) {
            const success = unequipItem(selectedItem.slotId);
            if (success) {
                playSound(CONST_ASSETS.SOUNDS.CLICK);
                setSelectedItem(null);
            } else {
                // Inventory full feedback?
                playSound(CONST_ASSETS.SOUNDS.DESACTIVATION); // Assuming ERROR sound exists or fallback
            }
        }
    };

    const handleDiscard = () => {
        if (selectedItem && selectedItem.source === 'inventory') {
            removeItemFromInventory(selectedItem.item.instanceId);
            playSound(CONST_ASSETS.SOUNDS.CLICK); // Trash sound?
            setSelectedItem(null);
        }
    };


    return (
        <div className="flex flex-col h-full bg-neutral-950 text-white font-sans relative overflow-hidden">
            {/* AMBIENT BACKGROUND */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.1),transparent_70%)] pointer-events-none" />

            {/* HEADER */}
            <header className="relative z-10 flex items-center justify-between mb-2 p-4">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 group active:scale-95 transition-transform"
                >
                    <div className="w-10 h-10 rounded-sm border border-white/10 flex items-center justify-center bg-white/5">
                        <ArrowLeft size={20} className="text-gray-400" />
                    </div>
                </button>
                <div className="text-right pr-1">
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-linear-to-b from-white to-gray-500 pr-2">{"ÉQUIPEMENT"}</h1>
                    <p className="text-[10px] font-black text-cyan-500/60 tracking-[0.3em] uppercase">GESTION DE L&apos;ARSENAL</p>
                </div>
            </header>

            {/* DEATH PENALTY HINT */}
            <div className="w-full flex flex-col items-center justify-center pb-4 relative z-10">
                <div className="w-full bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.6)_0%,transparent_70%)] py-2 flex justify-center">
                    <p className="text-[10px] font-bold italic text-amber-200 tracking-[0.15em] drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] text-center px-4">
                        {"ATTENTION : l'équipement actif et le contenu de l'inventaire seront détruits à la mort du personnage"}
                    </p>
                </div>
                <div className="w-1/3 h-px bg-linear-to-r from-transparent via-amber-200/30 to-transparent" />
            </div>

            <main className="relative z-10 flex-1 flex flex-col px-4 gap-2 overflow-hidden">

                {/* ACTIVE EQUIPMENT - CUSTOM LAYOUT */}
                <section className="relative w-full py-2 flex items-center justify-center shrink-0">
                    {/* Flex Column Layout - No Container */}
                    <div className="flex flex-col gap-2 items-center">

                        {/* TOP ROW: 2 Items (Weapon, Stim) */}
                        <div className="flex gap-2">
                            {equipmentUiConfig.slice(0, 2).map((conf) => {
                                const item = equipment[conf.id];
                                return (
                                    <div key={conf.id} className="flex flex-col gap-2 items-center">
                                        <span className="text-[9px] font-black text-white/70 uppercase tracking-widest drop-shadow-md z-20">{conf.label}</span>
                                        <EquipmentSlot
                                            slot={{ ...conf, img: item?.icon || null, rarity: item?.rarity || 'common' }}
                                            onClick={() => item && setSelectedItem({ item, source: 'equipment', slotId: conf.id })}
                                        />
                                    </div>
                                )
                            })}
                        </div>

                        {/* BOTTOM ROW: 4 Items */}
                        <div className="flex gap-2">
                            {equipmentUiConfig.slice(2, 6).map((conf) => {
                                const item = equipment[conf.id];
                                return (
                                    <div key={conf.id} className="flex flex-col gap-2 items-center">
                                        <EquipmentSlot
                                            slot={{ ...conf, img: item?.icon || null, rarity: item?.rarity || 'common' }}
                                            onClick={() => item && setSelectedItem({ item, source: 'equipment', slotId: conf.id })}
                                        />
                                        <span className="text-[9px] font-black text-white/70 uppercase tracking-widest drop-shadow-md z-20">{conf.label}</span>
                                    </div>
                                )
                            })}
                        </div>

                    </div>
                </section>

                {/* LoL Wild Rift Style Separator */}
                <div className="flex items-center justify-center gap-4 py-2 w-full opacity-80 px-8">
                    {/* Left Tapering Line */}
                    <div className="h-[1px] flex-1 bg-linear-to-r from-transparent via-amber-400/50 to-amber-200/80" />

                    {/* Central Hextech/Gold Element */}
                    <div className="relative flex items-center justify-center">
                        <div className="w-2 h-2 rotate-45 bg-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.8)] z-10" />
                        <div className="absolute w-6 h-[1px] bg-amber-200/60" /> {/* Horizontal cross line */}
                        <div className="absolute w-[1px] h-6 bg-amber-200/60" /> {/* Vertical cross line */}
                        <div className="absolute w-8 h-8 bg-amber-500/10 blur-xl rounded-full" /> {/* Glow */}
                    </div>

                    {/* Right Tapering Line */}
                    <div className="h-[1px] flex-1 bg-linear-to-l from-transparent via-amber-400/50 to-amber-200/80" />
                </div>

                {/* INVENTORY GRID */}
                <Inventory
                    items={inventoryProps}
                    onItemClick={(uiItem) => {
                        // Find original item
                        const original = paddedInventory.find(i => i.instanceId === uiItem.id);
                        if (original && original.name !== "Empty") {
                            setSelectedItem({ item: original as InventoryItem, source: 'inventory' });
                        }
                    }}
                    capacity={inventoryCapacity}
                />
            </main>

            {/* ITEM DETAILS POPUP */}
            <AnimatePresence>
                {selectedItem && (
                    <ItemPopup
                        item={selectedItem.item}
                        onClose={() => setSelectedItem(null)}
                        actions={
                            selectedItem.source === 'inventory' ? (
                                <>
                                    <button onClick={handleEquip} className="p-4 text-xs font-black uppercase w-2/3 active:bg-white/5 transition-colors hover:bg-white/5 text-amber-400">ÉQUIPER</button>
                                    <button onClick={handleDiscard} className="p-4 text-xs font-black text-red-400 uppercase w-1/3 active:bg-white/5 transition-colors hover:bg-red-500/10">JETER</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={handleUnequip} className="p-4 text-xs font-black text-amber-400 uppercase w-2/3 active:bg-white/5 transition-colors">DÉSÉQUIPER</button>
                                    <button className="p-4 text-xs font-black text-gray-600 uppercase w-1/3 cursor-not-allowed">JETER</button>
                                </>
                            )
                        }
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// --- HELPER COMPONENT ---

interface EquipmentSlotProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    slot: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick: (slot: any) => void;
}

function EquipmentSlot({ slot, onClick }: EquipmentSlotProps) {
    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onClick(slot)}
            className="relative group"
        >
            <div className="relative flex items-center justify-center">
                <ItemPic
                    src={slot.img}
                    rarity={slot.rarity}
                    size={56}
                    className={!slot.img ? "opacity-30 bg-white/5 border-white/5 shadow-none" : ""}
                />

                {/* Fallback Icon */}
                {!slot.img && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                        <slot.icon size={20} className={`${slot.color}`} />
                    </div>
                )}
            </div>
        </motion.button>
    );
}
