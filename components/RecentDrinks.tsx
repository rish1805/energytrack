import React from 'react';
import { View, Text } from 'react-native';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface DrinkEntry {
    id: string;
    name: string;
    caffeine: number;
    time: Date;
    category: 'energy' | 'coffee' | 'preworkout' | 'soda' | 'tea' | 'other';
}

interface RecentDrinksProps {
    drinks: DrinkEntry[];
}

const router = useRouter();

const RecentDrinks = ({ drinks }: RecentDrinksProps) => {
    const categoryColors = {
        energy: 'bg-red-500',
        coffee: 'bg-amber-500',
        preworkout: 'bg-purple-500',
        soda: 'bg-blue-500',
        tea: 'bg-green-500',
        other: 'bg-gray-500',
    };

    const sortedDrinks = [...drinks]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 3);


    {/* if (sortedDrinks.length === 0) {

    controls if "See drink history" is visible or not,
    currently set so that it is visible even if user has not had any drinks today.

        return (
            <Card className="bg-slate-800 border-slate-700 mt-6 w-full">
                <CardContent className="px-4 py-6">
                    <View className="flex-row items-center gap-2 mb-4">
                        <Clock size={20} color="white" className="mr-2" />
                        <Text className="text-white font-bold text-base">Recent Drinks</Text>
                    </View>
                    <View className="items-center justify-center min-h-[60px]">
                        <Text className="text-slate-400 text-sm">No drinks logged today</Text>
                    </View>
                </CardContent>
            </Card>
        );
    }
    */}
    return (
        <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
                <View className="flex-row items-center gap-2">
                    <Clock color="white" className="w-5 h-5" />
                    <Text className="text-white text-lg font-semibold">Recent Drinks</Text>
                </View>
            </CardHeader>

            <CardContent className="pt-0">
                {/* height fixed to reserve space for 3 entries */}
                <View style={{ minHeight : 200 }} className="justify-between">
                    <View className="space-y-2">
                        {sortedDrinks.length > 0 ? (
                            sortedDrinks.map((drink, index) => (
                                <View
                                    key={drink.id}
                                    className={index !== sortedDrinks.length - 1 ? 'mb-1' : ''}
                                >
                                    <View className="flex-row items-center justify-between px-4 py-3 bg-slate-700/50 rounded-xl border border-slate-600">
                                        <View className="flex-row items-center gap-3 flex-1 min-w-0">
                                            <View className={`w-3 h-3 rounded-full flex-shrink-0 ${categoryColors[drink.category]}`} />
                                            <View className="min-w-0 flex-1">
                                                <Text className="font-medium text-white text-sm" numberOfLines={1}>
                                                    {drink.name}
                                                </Text>
                                                <Text className="text-xs text-slate-400 capitalize">
                                                    {drink.category}
                                                </Text>
                                            </View>
                                        </View>

                                        <View className="text-right flex-shrink-0 ml-2">
                                            <Text className="text-sm font-medium text-blue-400">
                                                {drink.caffeine}mg
                                            </Text>
                                            <Text className="text-xs text-slate-500">
                                                {new Date(drink.time).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <View className="flex-1 items-center justify-center h-[170px]">
                                <Text className="text-slate-400 text-sm">No drinks logged today</Text>
                                <Text className="text-slate-400 text-sm">Start tracking your caffeine intake by adding a drink</Text>
                            </View>
                        )}
                    </View>

                    <View className="items-end mt-4 px-4">
                        <Text
                            onPress={() => router.push('/all-drinks')}
                            className="text-blue-400 text-sm font-medium"
                        >
                            See all →
                        </Text>
                    </View>
                </View>
            </CardContent>
        </Card>
    );
};

export default RecentDrinks;