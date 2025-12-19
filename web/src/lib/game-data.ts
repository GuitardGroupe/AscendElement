export interface Element {
    id: string;
    name: string;
    symbol: string;
    atomicNumber: number;
    description: string;
    color: string;
}

export const CHARACTERS: Element[] = [
    {
        id: 'h',
        name: 'Hydrogen',
        symbol: 'H',
        atomicNumber: 1,
        description: 'The primal fuel. Volatile and abundant energy.',
        color: 'from-blue-400 to-cyan-300',
    },
    {
        id: 'he',
        name: 'Helium',
        symbol: 'He',
        atomicNumber: 2,
        description: 'Noble and stable. High frequency resonance.',
        color: 'from-yellow-200 to-orange-300',
    },
    {
        id: 'li',
        name: 'Lithium',
        symbol: 'Li',
        atomicNumber: 3,
        description: 'Reactive store of power. Unstable potential.',
        color: 'from-red-400 to-pink-500',
    },
    {
        id: 'c',
        name: 'Carbon',
        symbol: 'C',
        atomicNumber: 6,
        description: 'The foundation of life. Adaptable and resilient.',
        color: 'from-gray-600 to-gray-400',
    },
];
