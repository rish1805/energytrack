import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DrinkEntry {
    id: string;
    name: string;
    caffeine: number;
    time: string | Date;
    category: 'energy' | 'coffee' | 'preworkout' | 'soda' | 'tea' | 'other';
}

export default function AllDrinksScreen() {
    const navigation = useNavigation();
    const [drinks, setDrinks] = useState<DrinkEntry[]>([]);

    useEffect(() => {
        const loadDrinks = async () => {
            try {
                const stored = await AsyncStorage.getItem("caffeineTracker");
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setDrinks(parsed);
                }
            } catch (e) {
                console.error("Failed to load drinks:", e);
            }
        };

        loadDrinks();
    }, []);

    const categoryColors = {
        energy: 'bg-red-500/20',
        coffee: 'bg-amber-500/20',
        preworkout: 'bg-purple-500/20',
        soda: 'bg-blue-500/20',
        tea: 'bg-green-500/20',
        other: 'bg-slate-500/20',
    };

    return (
        <>
            {/* Configure the transition animation for this screen */}
            <Stack.Screen
                options={{
                    animation: "slide_from_right",
                }}
            />

            <View className="flex-1 bg-slate-900 px-4 pt-6">
                <Pressable onPress={() => navigation.goBack()} className="mt-6 mb-4 flex-row items-center gap-2">
                    <ArrowLeft size={20} color="white" />
                    <Text className="text-white text-base font-medium">Back</Text>
                </Pressable>

                <Text className="text-2xl font-bold text-white mb-4">All Drinks</Text>

                <FlatList
                    data={[...drinks].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        return (
                            <View
                                className={`mb-3 px-4 py-3 rounded-xl ${
                                    categoryColors[item.category as keyof typeof categoryColors] ?? 'bg-slate-700'
                                }`}
                            >
                                <Text className="text-white text-base font-medium">{item.name}</Text>
                                <Text className="text-slate-400 text-xs">{item.category} • {item.caffeine}mg</Text>
                                <Text className="text-slate-500 text-xs">
                                    {new Date(item.time).toLocaleString()}
                                </Text>
                            </View>
                        );
                    }}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            </View>
        </>
    );
}