import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DrinkEntry {
    id: string;
    name: string;
    caffeine: number;
    time: string | Date;
    category: 'energy' | 'coffee' | 'preworkout' | 'soda' | 'tea' | 'other';
}

interface DrinksContextProps {
    drinks: DrinkEntry[];
    addDrink: (drink: DrinkEntry) => void;
    deleteDrink: (id: string) => void;
    refreshDrinks: () => void;
}

const DrinksContext = createContext<DrinksContextProps | undefined>(undefined);

const STORAGE_KEY = 'caffeineTracker';

export const DrinksProvider = ({ children }: { children: React.ReactNode }) => {
    const [drinks, setDrinks] = useState<DrinkEntry[]>([]);

    const loadDrinks = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) setDrinks(JSON.parse(stored));
        } catch (e) {
            console.error('Failed to load drinks:', e);
        }
    };

    const saveDrinks = async (updated: DrinkEntry[]) => {
        setDrinks(updated);
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
            console.error('Failed to save drinks:', e);
        }
    };

    const addDrink = (drink: DrinkEntry) => {
        const updated = [...drinks, drink];
        saveDrinks(updated);
    };

    const deleteDrink = (id: string) => {
        const updated = drinks.filter((d) => d.id !== id);
        saveDrinks(updated);
    };

    const refreshDrinks = () => loadDrinks();

    useEffect(() => {
        loadDrinks();
    }, []);

    return (
        <DrinksContext.Provider value={{ drinks, addDrink, deleteDrink, refreshDrinks }}>
            {children}
        </DrinksContext.Provider>
    );
};

export const useDrinks = () => {
    const context = useContext(DrinksContext);
    if (!context) throw new Error("useDrinks must be used inside a DrinksProvider");
    return context;
};
