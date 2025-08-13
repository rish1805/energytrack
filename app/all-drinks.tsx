import React from 'react';
import { View, Text, FlatList, Pressable, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Trash2 } from 'lucide-react-native';
import { useDrinks } from "@/components/AppContext";
import {STRINGS, normalizeLanguage } from "@/components/language/Strings";
import {STRING} from "postcss-selector-parser";

interface DrinkEntry {
    id: string;
    name: string;
    caffeine: number;
    time: string | Date;
    category: 'energy' | 'coffee' | 'preworkout' | 'soda' | 'tea' | 'other';
}

export default function AllDrinksScreen() {
    const navigation = useNavigation();
    const { drinks, deleteDrink, refreshDrinks, dateFormat, timeFormat, unit, clearAllDrinks, language } = useDrinks();
    const langCode = normalizeLanguage(language);

    const handleDeleteDrink = (id: string) => {
        Alert.alert(
            STRINGS[langCode].deleteConfirm.title,
            STRINGS[langCode].deleteConfirm.text,
            [
                {
                    text: STRINGS[langCode].deleteConfirm.cancel,
                    style: "cancel"
                },
                {
                    text: STRINGS[langCode].deleteConfirm.delete,
                    style: "destructive",
                    onPress: () => {
                        deleteDrink(id); // Uses context
                    },
                },
            ]
        );
    };

    const categoryColors = {
        energy: 'bg-red-500/20',
        coffee: 'bg-amber-500/20',
        preworkout: 'bg-purple-500/20',
        soda: 'bg-blue-500/20',
        tea: 'bg-green-500/20',
        other: 'bg-slate-500/20',
    };

    const getDisplayName = (name: string) => {
        const amountMatch = name.match(/\((\d+)\s*ml\)/i);
        const baseName = name.replace(/\s*\(\d+\s*ml\)/i, '').trim();

        if (unit === 'oz' && amountMatch) {
            const ml = parseInt(amountMatch[1]);
            const oz = (ml * 0.033814).toFixed(1); // or however precise we want
            return `${baseName} (${oz} oz)`;
        }

        return name; // keep original if ml or can't parse
    };

    const handleDeleteAll = () => {
        Alert.alert(
            STRINGS[langCode].deleteConfirm.deleteAllDrinks,
            STRINGS[langCode].deleteConfirm.subText,
            [
                {
                    text: STRINGS[langCode].deleteConfirm.cancel,
                    style: "cancel"
                },
                {
                    text: STRINGS[langCode].deleteConfirm.deleteAll,
                    style: "destructive",
                    onPress: clearAllDrinks }
            ]
        );
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
                    <Text className="text-white text-base font-medium">{STRINGS[langCode].buttons.back}</Text>
                </Pressable>

                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-2xl font-bold text-white">{STRINGS[langCode].allDrinkspage.allDrinks}</Text>
                    {drinks.length > 0 && (
                        <Pressable onPress={handleDeleteAll} className="p-2">
                            <Trash2 size={22} color="#f87171" />
                        </Pressable>
                    )}
                </View>

                {/* Check if drinks logged = 0, if ture displays the "No drinks logged" message */}
                {drinks.length === 0 ? (
                    <View className="mb-3 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 flex-row justify-between items-center">
                        <View>
                            <Text className="text-white text-base font-medium">{STRINGS[langCode].allDrinkspage.emptyPagetext1}</Text>
                            <Text className="text-slate-400 text-xs mt-1">{STRINGS[langCode].allDrinkspage.emptyPagetext2}</Text>
                        </View>
                    </View>
                ) : (

                    <FlatList
                        data={[...drinks].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View
                                className={`mb-3 px-4 py-3 rounded-xl flex-row justify-between items-center ${
                                    categoryColors[item.category as keyof typeof categoryColors] ?? 'bg-slate-700'
                                }`}
                            >
                                <View>
                                    <Text className="text-white text-base font-medium">{getDisplayName(item.name)}</Text>
                                    <Text className="text-slate-400 text-xs">{STRINGS[langCode].categories[item.category]} • {item.caffeine}mg</Text>
                                    <Text className="text-slate-500 text-xs">
                                        {new Date(item.time).toLocaleString(dateFormat === "American" ? "en-US" : "en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                            hour12: timeFormat === "12h",
                                        })
                                            .replace(/\s(am|pm)/i, (match) => `${match.toUpperCase()}`)}
                                    </Text>
                                </View>

                                <View className="flex-row justify-end">
                                    <Pressable className="p-2" onPress={() => handleDeleteDrink(item.id)}>
                                        <Trash2 size={20} color="#f87171" />
                                    </Pressable>
                                </View>
                            </View>
                        )}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                )}
            </View>
        </>
    );
}
