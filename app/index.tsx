import { ScrollView, Pressable, Text, View } from "react-native";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Zap, TrendingUp, History } from 'lucide-react-native';
import CaffeineRing from '@/components/CaffeineRing';
import RecentDrinks from '@/components/RecentDrinks';
import { Settings as SettingsIcon } from "lucide-react-native";
import AddDrinkModal from "@/components/AddDrink";
import { useRouter, Stack } from "expo-router";
import { useDrinks } from "@/components/AppContext";

// Greeting logic
function getGreeting(locale: "en" | "da" = "en", name?: string) {
    const hour = new Date().getHours();

    const greetings = {
        en: {
            morning: "Good morning",
            afternoon: "Good afternoon",
            evening: "Good evening",
        },
        da: {
            morning: "Godmorgen",
            afternoon: "God eftermiddag",
            evening: "God aften",
        },
    };

    let baseGreeting = "";

    if (hour < 12) baseGreeting = greetings[locale].morning;
    else if (hour < 18) baseGreeting = greetings[locale].afternoon;
    else baseGreeting = greetings[locale].evening;

    // NEW logic added below:
    return name && name.trim() !== "" ? `${baseGreeting}, ${name}!` : `${baseGreeting}!`;
}

// DrinkEntry type
interface DrinkEntry {
    id: string;
    name: string;
    caffeine: number;
    time: Date;
    category: "energy" | "coffee" | "preworkout" | "soda" | "tea" | "other";
}

// Main page component
export default function Index() {
    const router = useRouter();
    const { drinks, addDrink, resetSettings } = useDrinks();
    const [showAddModal, setShowAddModal] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const { userName, dailyLimit, timeFormat }  = useDrinks();


    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const today = new Date();
    const todaysDrinks = drinks.filter((drink) => {
        const drinkDate = new Date(drink.time);
        return drinkDate.toDateString() === today.toDateString();
    });

    const sortedDrinks = [...todaysDrinks].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    const lastDrink = sortedDrinks[0];

    const todaysCaffeine = todaysDrinks.reduce((sum, drink) => sum + drink.caffeine, 0);
    const caffeinePercentage = Math.min((todaysCaffeine / dailyLimit) * 100);
    const caffeineOverage = todaysCaffeine - dailyLimit;
    const remainingText = caffeineOverage <= 0
        ? `${Math.abs(caffeineOverage)}mg remaining`
        : `${caffeineOverage}mg over limit`;

    const getStatusText = () => {
        if (todaysCaffeine === 0) return "None";
        if (todaysCaffeine < dailyLimit * 0.5) return "Low";
        if (todaysCaffeine < dailyLimit * 0.8) return "Moderate";
        if (todaysCaffeine < dailyLimit) return "High";
        return "Excessive";
    };

    const getTimeSinceLastDrink = () => {
        if (!lastDrink) return "-";
        const timeDiff = Math.max(currentTime.getTime() - new Date(lastDrink.time).getTime(), 0);
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        return hours === 0 ? `${minutes}m` : `${hours}h ${minutes}m`;
    };

    const getStatusColor = () => {
        if (todaysCaffeine === 0) return "text-slate-500";
        if (todaysCaffeine < dailyLimit * 0.5) return "text-green-400";
        if (todaysCaffeine < dailyLimit * 0.8) return "text-yellow-400";
        if (todaysCaffeine < dailyLimit) return "text-orange-400";
        return "text-red-500";
    };

    const getLastDrinkTime = () => {
        if (!lastDrink) return "-";
        return new Date(lastDrink.time).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: timeFormat === "12h",
        });
    };

    return (
        <>
            <Stack.Screen
                options={{
                    animation: "slide_from_right",
                }}
            />

            <View className="flex-1 bg-slate-900">
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingTop: 64, paddingHorizontal: 16, paddingBottom: 80 }}
                >
                    {/* Header row */}
                    <View className="flex-row justify-between items-start">
                        <View>
                            <Text className="text-2xl font-bold text-white">
                                {getGreeting("en", userName)}
                            </Text>
                            <Text className="text-slate-400 text-sm mt-1">
                                Track your caffeine intake
                            </Text>
                        </View>

                        <View className="items-end">
                            <Text className={`text-sm font-medium ${getStatusColor()}`}>
                                {getStatusText()}
                            </Text>
                            <Text className="text-xs text-slate-500">
                                {todaysCaffeine}mg active
                            </Text>
                        </View>
                    </View>

                    {/* CaffeineRing */}
                    <View className="items-center mt-4 mb-4">
                        <CaffeineRing
                            percentage={caffeinePercentage}
                            current={todaysCaffeine}
                            limit={dailyLimit}
                        />
                    </View>

                    {/* Stats cards */}
                    <View className="flex-row flex-wrap justify-between gap-5">
                        <Card className="bg-slate-800 border-slate-700 w-[30%]">
                            <CardContent className="p-4">
                                <View className="w-6 h-6 bg-cyan-500 rounded-lg items-center justify-center mb-3">
                                    <Zap size={14} color="white" />
                                </View>
                                <Text className="text-slate-400 text-xs mb-1">Today's Intake</Text>
                                <Text className="text-xl font-bold text-white">{todaysCaffeine}mg</Text>
                                <Text className="text-xs text-slate-500">{todaysDrinks.length} drinks</Text>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-800 border-slate-700 w-[30%]">
                            <CardContent className="p-4">
                                <View className="w-6 h-6 bg-pink-500 rounded-lg items-center justify-center mb-3">
                                    <History size={14} color="white" />
                                </View>
                                <Text className="text-slate-400 text-xs mb-1">Last Drink</Text>
                                <Text className="text-xl font-bold text-white">{getTimeSinceLastDrink()}</Text>
                                <Text className="text-xs text-slate-500">ago at {getLastDrinkTime()}</Text>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-800 border-slate-700 w-[30%]">
                            <CardContent className="p-4">
                                <View className="w-6 h-6 bg-green-500 rounded-lg items-center justify-center mb-3">
                                    <TrendingUp size={14} color="white" />
                                </View>
                                <Text className="text-slate-400 text-xs mb-1">Daily Limit</Text>
                                <Text className="text-xl font-bold text-white">{Math.round(caffeinePercentage)}%</Text>
                                <Text className="text-xs text-slate-500">{remainingText}</Text>
                            </CardContent>
                        </Card>
                    </View>

                    {/* Add Drink button */}
                    <View className="items-center mt-7 mb-7">
                        <Pressable
                            onPress={() => setShowAddModal(true)}
                            className="bg-blue-600 px-8 py-3 rounded-full flex-row items-center"
                        >
                            <Plus size={20} color="#ffffff" />
                            <Text className="text-white font-medium text-base ml-2">Add Drink</Text>
                        </Pressable>
                    </View>

                    {/* Recent Drinks */}
                    <RecentDrinks
                        drinks={todaysDrinks.map((drink) => ({
                            ...drink,
                            time: new Date(drink.time),
                        }))}
                    />


                    {/* Settings Button */}
                    <View className="mt-7 mb-7 items-center">
                        <Pressable
                            onPress={() => router.push("/settings")}
                            className="bg-white px-6 py-2 rounded-xl shadow flex-row items-center gap-2"
                        >
                            <SettingsIcon className="text-slate-700" size={16} />
                            <Text className="text-slate-700 font-semibold">Settings</Text>
                        </Pressable>
                    </View>

                    <AddDrinkModal
                        open={showAddModal}
                        onClose={() => setShowAddModal(false)}
                        onAdd={(drink) => {
                            addDrink({ ...drink, id: Date.now().toString() });
                            setShowAddModal(false);
                        }}
                    />
                </ScrollView>
            </View>
        </>
    );
}