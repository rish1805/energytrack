import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DrinkEntry {
    id: string;
    name: string;
    caffeine: number;
    time: string | Date;
    category: 'energy' | 'coffee' | 'preworkout' | 'soda' | 'tea' | 'other';
}

interface Settings {
    userName: string;
    dailyLimit: number;
    unit: 'ml' | 'oz';
    dateFormat: 'European' | 'American';
    timeFormat: '24h' | '12h';
    language: 'English' | 'Dansk' | 'Deutsch';
    darkTheme: boolean;
}

const defaultSettings: Settings = {
    userName: '',
    dailyLimit: 400,
    unit: 'ml',
    dateFormat: 'European',
    timeFormat: '24h',
    language: 'English',
    darkTheme: true,
};

interface DrinksContextProps {
    drinks: DrinkEntry[];
    addDrink: (drink: DrinkEntry) => void;
    deleteDrink: (id: string) => void;
    refreshDrinks: () => void;
    userName: string;
    setUserName: (name: string) => void;
    dailyLimit: number;
    setDailyLimit: (limit: number) => void;
    unit: 'ml' | 'oz';
    setUnit: (unit: 'ml' | 'oz') => void;
    dateFormat: 'European' | 'American';
    setDateFormat: (date: 'European' | 'American') => void;
    timeFormat: '24h' | '12h';
    setTimeFormat: (timeFormat: '24h' | '12h') => void;
    language: 'English' | 'Dansk' | 'Deutsch';
    setLanguage: (language: 'English' | 'Dansk' | 'Deutsch') => void;
    darkTheme: boolean;
    setDarkTheme: (enabled: boolean) => void;
}

const DrinksContext = createContext<DrinksContextProps | undefined>(undefined);

const STORAGE_KEY = 'caffeineTracker';
const SETTINGS_KEY = 'appSettings';

export const DrinksProvider = ({ children }: { children: React.ReactNode }) => {
    const [drinks, setDrinks] = useState<DrinkEntry[]>([]);
    const [settings, setSettings] = useState<Settings>(defaultSettings);

    // Load drinks
    const loadDrinks = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) setDrinks(JSON.parse(stored));
        } catch (e) {
            console.error('Failed to load drinks:', e);
        }
    };

    // Save drinks
    const saveDrinks = async (updated: DrinkEntry[]) => {
        setDrinks(updated);
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
            console.error('Failed to save drinks:', e);
        }
    };

    // Update a single or multiple settings
    const updateSettings = (updates: Partial<Settings>) => {
        const newSettings = { ...settings, ...updates };
        setSettings(newSettings);
        AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings)).catch((e) =>
            console.error('Failed to save settings:', e)
        );
    };

    // Load settings
    const loadSettings = async () => {
        try {
            const stored = await AsyncStorage.getItem(SETTINGS_KEY);
            if (stored) {
                const parsed: Settings = JSON.parse(stored);
                setSettings({ ...defaultSettings, ...parsed });
            }
        } catch (e) {
            console.error('Failed to load settings:', e);
        }
    };

    // Drink actions
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
        loadSettings();
    }, []);

    return (
        <DrinksContext.Provider
            value={{
                drinks,
                addDrink,
                deleteDrink,
                refreshDrinks,
                userName: settings.userName,
                setUserName: (name) => updateSettings({ userName: name }),
                dailyLimit: settings.dailyLimit,
                setDailyLimit: (limit) => updateSettings({ dailyLimit: limit }),
                unit: settings.unit,
                setUnit: (unit) => updateSettings({ unit }),
                dateFormat: settings.dateFormat,
                setDateFormat: (date) => updateSettings({ dateFormat: date }),
                timeFormat: settings.timeFormat,
                setTimeFormat: (timeFormat) => updateSettings({ timeFormat }),
                language: settings.language,
                setLanguage: (language) => updateSettings({ language }),
                darkTheme: settings.darkTheme,
                setDarkTheme: (enabled: boolean) => updateSettings({ darkTheme: enabled }),
            }}
        >
            {children}
        </DrinksContext.Provider>
    );
};

export const useDrinks = () => {
    const context = useContext(DrinksContext);
    if (!context) throw new Error('useDrinks must be used inside a DrinksProvider');
    return context;
};