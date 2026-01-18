import { create } from 'zustand';
import { Item, items as itemDb } from '@/lib/items';

// --- TYPES ---

export interface InventoryItem extends Item {
    instanceId: string;
}

export type EquipmentSlotId = 'weapon' | 'armor' | 'consumable' | 'ring' | 'book' | 'gem';

export interface EquipmentState {
    weapon: InventoryItem | null;
    armor: InventoryItem | null;
    consumable: InventoryItem | null;
    ring: InventoryItem | null;
    book: InventoryItem | null;
    gem: InventoryItem | null;
}

interface Link {
    from: string;
    to: string;
}

interface AdventureData {
    currentNodeId: string;
    visitedNodes: string[];
    defeatedNodes: string[];
    links: Link[];
}

interface Currencies {
    gold: number;
    soulShards: number;
    experience: number;
}

interface AdventureState {
    mode: 'solo' | 'coop';
    solo: AdventureData;
    coop: AdventureData;

    // GAME STATE
    currencies: Currencies;
    inventory: InventoryItem[];
    vault: InventoryItem[];
    equipment: EquipmentState;

    // Config
    inventoryCapacity: number;

    // Actions
    setMode: (mode: 'solo' | 'coop') => void;
    setCurrentNode: (id: string) => void;
    markAsVisited: (id: string) => void;
    markAsDefeated: (id: string) => void;
    addLink: (from: string, to: string) => void;
    resetAdventure: () => void;

    // Item / Currency Actions
    addCurrency: (type: 'gold' | 'soulShards' | 'experience', amount: number) => void;
    spendCurrency: (type: 'gold' | 'soulShards' | 'experience', amount: number) => boolean;

    addItemToInventory: (item: Item) => boolean; // returns false if full
    removeItemFromInventory: (instanceId: string) => void;

    equipItem: (item: InventoryItem) => void;
    unequipItem: (slot: EquipmentSlotId) => boolean; // returns false if inventory full

    addToVault: (item: InventoryItem) => void;
    removeFromVault: (instanceId: string) => boolean; // returns false if inventory full

    resetSession: () => void; // Death penalty
    checkStarterKit: () => void;
}

// --- HELPER ---
const generateInstanceId = () => Math.random().toString(36).substring(2, 9);

export const useAdventureStore = create<AdventureState>((set, get) => ({
    mode: 'solo',

    solo: {
        currentNodeId: "10-10",
        visitedNodes: ["10-10"],
        defeatedNodes: [],
        links: []
    },

    coop: {
        currentNodeId: "10-10",
        visitedNodes: ["10-10"],
        defeatedNodes: [],
        links: []
    },

    currencies: {
        gold: 0,
        soulShards: 0,
        experience: 0
    },
    inventory: [], // Start empty
    vault: [], // Persistent
    equipment: {
        weapon: null,
        armor: null,
        consumable: null,
        ring: null,
        book: null,
        gem: null
    },
    inventoryCapacity: 20,

    setMode: (mode) => set({ mode }),

    setCurrentNode: (id) => set((state) => ({
        [state.mode]: { ...state[state.mode], currentNodeId: id }
    })),

    markAsVisited: (id) => set((state) => {
        const currentModeState = state[state.mode];
        if (currentModeState.visitedNodes.includes(id)) return state;
        return {
            [state.mode]: {
                ...currentModeState,
                visitedNodes: [...currentModeState.visitedNodes, id]
            }
        };
    }),

    markAsDefeated: (id) => set((state) => {
        const currentModeState = state[state.mode];
        if (currentModeState.defeatedNodes.includes(id)) return state;
        return {
            [state.mode]: {
                ...currentModeState,
                defeatedNodes: [...currentModeState.defeatedNodes, id]
            }
        };
    }),

    addLink: (from, to) => set((state) => {
        const currentModeState = state[state.mode];
        return {
            [state.mode]: {
                ...currentModeState,
                links: [...currentModeState.links, { from, to }]
            }
        };
    }),

    resetAdventure: () => set((state) => ({
        [state.mode]: {
            currentNodeId: "10-10",
            visitedNodes: ["10-10"],
            defeatedNodes: [],
            links: []
        }
    })),

    // --- CURRENCY ACTIONS ---
    addCurrency: (type, amount) => set((state) => ({
        currencies: {
            ...state.currencies,
            [type]: state.currencies[type] + amount
        }
    })),

    spendCurrency: (type, amount) => {
        const state = get();
        if (state.currencies[type] < amount) return false;
        set({
            currencies: {
                ...state.currencies,
                [type]: state.currencies[type] - amount
            }
        });
        return true;
    },

    // --- INVENTORY ACTIONS ---
    addItemToInventory: (item) => {
        const state = get();
        if (state.inventory.length >= state.inventoryCapacity) return false;

        const newItem: InventoryItem = { ...item, instanceId: generateInstanceId() };
        set({ inventory: [...state.inventory, newItem] });
        return true;
    },

    removeItemFromInventory: (instanceId) => set((state) => ({
        inventory: state.inventory.filter(i => i.instanceId !== instanceId)
    })),

    // --- EQUIPMENT ACTIONS ---
    equipItem: (item) => {
        const state = get();
        // Determine slot based on Item Type
        let slot: EquipmentSlotId | null = null;
        switch (item.type) {
            case 'Weapon': slot = 'weapon'; break;
            case 'Armor': slot = 'armor'; break;
            case 'Consumable': slot = 'consumable'; break;
            case 'Ring': slot = 'ring'; break;
            case 'Book': slot = 'book'; break;
            case 'Gem': slot = 'gem'; break;
        }

        if (!slot) return; // Unknown type

        const currentEquipped = state.equipment[slot];

        // 1. Remove item from inventory
        const newInventory = state.inventory.filter(i => i.instanceId !== item.instanceId);

        // 2. If something equipped, move it back to inventory
        if (currentEquipped) {
            newInventory.push(currentEquipped);
        }

        // 3. Update state
        set({
            inventory: newInventory,
            equipment: {
                ...state.equipment,
                [slot]: item
            }
        });
    },

    unequipItem: (slot) => {
        const state = get();
        const item = state.equipment[slot];
        if (!item) return true;

        if (state.inventory.length >= state.inventoryCapacity) return false;

        set({
            equipment: { ...state.equipment, [slot]: null },
            inventory: [...state.inventory, item]
        });
        return true;
    },

    // --- VAULT ACTIONS ---
    addToVault: (item) => {
        const state = get();
        set({
            inventory: state.inventory.filter(i => i.instanceId !== item.instanceId),
            vault: [...state.vault, item]
        });
    },

    removeFromVault: (instanceId) => {
        const state = get();
        if (state.inventory.length >= state.inventoryCapacity) return false;

        const item = state.vault.find(i => i.instanceId === instanceId);
        if (!item) return true;

        set({
            vault: state.vault.filter(i => i.instanceId !== instanceId),
            inventory: [...state.inventory, item]
        });
        return true;
    },

    // --- DEATH PENALTY ---
    resetSession: () => set((state) => ({
        // Reset Currencies
        currencies: { gold: 0, soulShards: 0, experience: 0 },
        // Clear Inventory
        inventory: [],
        equipment: {
            weapon: null,
            armor: null,
            consumable: null,
            ring: null,
            book: null,
            gem: null
        },
        // Vault is PRESERVED (inherited from current state)

        // Reset Adventure progress?
        // User said: "le faire de relancer l'appli efface tout" (Reload wipes all).
        // "Quand le personnage meurt, tout l'inventaire et l'équipement actif disparait. les currencies sont remis à zero. le coffre conserve les items."
        // So we keep vault.
        // We also need to reset adventure nodes? User didn't explicitly say to reset nodes on death, but "Quand le personnage meurt...". Usually roguelike -> restart.
        // Let's assume restart adventure too.
        [state.mode]: {
            currentNodeId: "10-10",
            visitedNodes: ["10-10"],
            defeatedNodes: [],
            links: []
        }
    })),

    checkStarterKit: () => {
        const state = get();
        const stimId = 0; // "Cartouche de soin"

        // Check ALL sources
        const hasInInventory = state.inventory.some(i => i.id === stimId);
        const hasInVault = state.vault.some(i => i.id === stimId);
        const hasEquipped = state.equipment.consumable?.id === stimId;

        if (!hasInInventory && !hasInVault && !hasEquipped) {
            const stimItem = itemDb.find(i => i.id === stimId);
            if (stimItem) {
                state.addItemToInventory(stimItem);
            }
        }
    }
}));
