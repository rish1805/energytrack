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
    userName: string;
    setUserName: (name: string) => void;
    dailyLimit: number;
    setDailyLimit: (limit: number) => void;
}

const DrinksContext = createContext<DrinksContextProps | undefined>(undefined);

const STORAGE_KEY = 'caffeineTracker';
const LIMIT_KEY = 'dailyLimit';

export const DrinksProvider = ({ children }: { children: React.ReactNode }) => {
    const [drinks, setDrinks] = useState<DrinkEntry[]>([]);
    const [userName, setUserName] = useState("");
    const [dailyLimit, setDailyLimit] = useState(400);

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

    useEffect(() => {
        const loadName = async () => {
            try {
                const storedName = await AsyncStorage.getItem("userName");
                if (storedName) {
                    setUserName(storedName);
                    // console.log("Name saved:", userName);
                }
            } catch (e) {
                console.error("Failed to load userName:", e);
            }
        };
        loadName();
    }, []);

    useEffect(() => {
        const loadLimit = async () => {
            try {
                const storedLimit = await AsyncStorage.getItem(LIMIT_KEY);
                if (storedLimit) setDailyLimit(Number(storedLimit));
            } catch (e) {
                console.error("Failed to caffeine limit:", e);
            }
        };
        loadLimit();
    }, []);

    useEffect(() => {
        const saveLimit = async () => {
            try {
                await AsyncStorage.setItem(LIMIT_KEY, dailyLimit.toString());
            } catch (e) {
                console.error("Failed to save caffeine limit:", e);
            }
        };
        saveLimit();
    }, [dailyLimit]);

    return (
        <DrinksContext.Provider value={{
            drinks,
            addDrink,
            deleteDrink,
            refreshDrinks,
            userName,
            setUserName,
            dailyLimit,
            setDailyLimit,
            }}>
            {children}
        </DrinksContext.Provider>
    );
};

export const useDrinks = () => {
    const context = useContext(DrinksContext);
    if (!context) throw new Error("useDrinks must be used inside a DrinksProvider");
    return context;
};
