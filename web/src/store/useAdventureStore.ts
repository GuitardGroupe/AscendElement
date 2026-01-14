import { create } from 'zustand';

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

interface AdventureState {
    mode: 'solo' | 'coop';
    solo: AdventureData;
    coop: AdventureData;

    // Actions
    setMode: (mode: 'solo' | 'coop') => void;
    setCurrentNode: (id: string) => void;
    markAsVisited: (id: string) => void;
    markAsDefeated: (id: string) => void;
    addLink: (from: string, to: string) => void;
    resetAdventure: () => void;
}

export const useAdventureStore = create<AdventureState>((set) => ({
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
    }))
}));
