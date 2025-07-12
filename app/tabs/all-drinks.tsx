import React from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';


interface DrinkEntry {
    id: string;
    name: string;
    caffeine: number;
    time: Date;
    category: 'energy' | 'coffee' | 'preworkout' | 'soda' | 'tea' | 'other';
}


const AllDrinksScreen = () => {
    // In real use, you'd pull this from context or global state
    const router = useRouter();
    const drinks: DrinkEntry[] = []; // Replace this with your real data source

    return (
        <View className="flex-1 bg-slate-900 px-4 pt-6">

            <Pressable onPress={() => router.back()} className="mb-4 flex-row items-center gap-2">
                <ArrowLeft size={20} color="white" />
                <Text className="text-white text-base font-medium">Back</Text>
            </Pressable>



            <Text className="text-white text-xl font-bold mb-4">All Drinks</Text>

            <FlatList
                data={[...drinks].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View className="mb-3 px-4 py-3 bg-slate-800 rounded-xl">
                        <Text className="text-white text-base font-medium">{item.name}</Text>
                        <Text className="text-slate-400 text-xs">{item.category} • {item.caffeine}mg</Text>
                        <Text className="text-slate-500 text-xs">
                            {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
};

export default AllDrinksScreen;
