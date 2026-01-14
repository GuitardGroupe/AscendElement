import { create } from 'zustand';

interface Link {
    from: string;
    to: string;
}

interface AdventureState {
    currentNodeId: string;
    visitedNodes: string[]; // Store as array for serialization if needed, though Set is better for lookups
    defeatedNodes: string[];
    links: Link[];

    // Actions
    setCurrentNode: (id: string) => void;
    markAsVisited: (id: string) => void;
    markAsDefeated: (id: string) => void;
    addLink: (from: string, to: string) => void;
    resetAdventure: () => void;
}

export const useAdventureStore = create<AdventureState>((set) => ({
    currentNodeId: "10-10",
    visitedNodes: ["10-10"],
    defeatedNodes: [],
    links: [],

    setCurrentNode: (id) => set({ currentNodeId: id }),

    markAsVisited: (id) => set((state) => ({
        visitedNodes: state.visitedNodes.includes(id)
            ? state.visitedNodes
            : [...state.visitedNodes, id]
    })),

    markAsDefeated: (id) => set((state) => ({
        defeatedNodes: state.defeatedNodes.includes(id)
            ? state.defeatedNodes
            : [...state.defeatedNodes, id]
    })),

    addLink: (from, to) => set((state) => ({
        links: [...state.links, { from, to }]
    })),

    resetAdventure: () => set({
        currentNodeId: "10-10",
        visitedNodes: ["10-10"],
        defeatedNodes: [],
        links: []
    })
}));
