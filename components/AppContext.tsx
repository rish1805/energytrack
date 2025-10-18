import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';

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
    dateFormat:
        | 'European' | 'American'
        | 'Europæisk' | 'Amerikansk'
        | 'Europäisch' | 'Amerikanisch';
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
    // Auth related props
    user: User | null;
    session: Session | null;
    signUp: (email: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    isLoading: boolean;
    // Existing drink tracking props
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
    dateFormat: Settings['dateFormat'];
    setDateFormat: (date: Settings['dateFormat']) => void;
    timeFormat: '24h' | '12h';
    setTimeFormat: (timeFormat: '24h' | '12h') => void;
    language: 'English' | 'Dansk' | 'Deutsch';
    setLanguage: (language: 'English' | 'Dansk' | 'Deutsch') => void;
    darkTheme: boolean;
    setDarkTheme: (enabled: boolean) => void;
    resetSettings: () => void;
    clearAllDrinks: () => void;
}

const DrinksContext = createContext<DrinksContextProps | undefined>(undefined);

const STORAGE_KEY = 'caffeineTracker';
const SETTINGS_KEY = 'appSettings';

export const DrinksProvider = ({ children }: { children: React.ReactNode }) => {
    const [drinks, setDrinks] = useState<DrinkEntry[]>([]);
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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

    // Auth methods
    const signUp = async (email: string, password: string) => {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
    };

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    // Listen for auth changes
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        loadDrinks();
        loadSettings();
    }, []);

    const resetSettings = async () => {
        try {
            setSettings(defaultSettings);
            await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
        } catch (e) {
            console.error('Failed to reset settings:', e);
        }
    };

    const clearAllDrinks = async () => {
        try {
            setDrinks([]);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        } catch (e) {
            console.error('Failed to clear all drinks:', e);
        }
    };

    return (
        <DrinksContext.Provider
            value={{
                // Auth
                user,
                session,
                signUp,
                signIn,
                signOut,
                isLoading,
                // Drinks
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
                resetSettings,
                clearAllDrinks,
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