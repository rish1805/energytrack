import {Pressable, Text, View} from "react-native";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Zap, Clock, TrendingUp, Settings, History } from 'lucide-react-native';
import CaffeineRing from '@/components/CaffeineRing';
import RecentDrinks from '@/components/RecentDrinks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings as SettingsIcon } from "lucide-react-native";

import { Link } from "expo-router";

// Greeting logic
function getGreeting(locale: "en" | "da" = "en") {
    const hour = new Date().getHours();
    const greetings = {
        en: {
            morning: "Good morning!",
            afternoon: "Good afternoon!",
            evening: "Good evening!",
        },
        da: {
            morning: "Godmorgen!",
            afternoon: "God eftermiddag!",
            evening: "God aften!",
        },
    };

    if (hour < 12) return greetings[locale].morning;
    else if (hour < 17) return greetings[locale].afternoon;
    else return greetings[locale].evening;
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
    const [drinks, setDrinks] = useState<DrinkEntry[]>([]);

    const [dailyLimit, setDailyLimit] = useState(400);
    const [showAddModal, setShowAddModal] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const loadDrinks = async () => {
            try {
                const saved = await AsyncStorage.getItem("caffeineTracker");
                if (saved) setDrinks(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load drinks", e);
            }
        };
        loadDrinks();
    }, []);

    useEffect(() => {
        const saveDrinks = async () => {
            try {
                await AsyncStorage.setItem("caffeineTracker", JSON.stringify(drinks));
            } catch (e) {
                console.error("Failed to save drinks", e);
            }
        };
        saveDrinks();
    }, [drinks]);


    const today = new Date();
    const todaysDrinks = drinks.filter((drink) => {
        const drinkDate = new Date(drink.time);
        return drinkDate.toDateString() === today.toDateString();
    });

    const todaysCaffeine = todaysDrinks.reduce(
        (sum, drink) => sum + drink.caffeine,
        0
    );
    const caffeinePercentage = Math.min((todaysCaffeine / dailyLimit) * 100, 100);

    const getStatusText = () => {
        if (todaysCaffeine === 0) return "None";
        if (todaysCaffeine < dailyLimit * 0.5) return "Low";
        if (todaysCaffeine < dailyLimit * 0.8) return "Moderate";
        if (todaysCaffeine < dailyLimit) return "High";
        return "Excessive";
    };

    const getTimeSinceLastDrink = () => {
        if (todaysDrinks.length === 0) return "-";

        const lastDrink = todaysDrinks.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())[0];
        const timeDiff = currentTime.getTime() - new Date(lastDrink.time).getTime();
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours === 0) {
            return `${minutes}m`;
        } else {
            return `${hours}h ${minutes}m`;
        }
    };

    const getStatusColor = () => {
        if (todaysCaffeine === 0) return "text-slate-500";
        if (todaysCaffeine < dailyLimit * 0.5) return "text-green-400";
        if (todaysCaffeine < dailyLimit * 0.8) return "text-yellow-400";
        if (todaysCaffeine < dailyLimit) return "text-orange-400";
        return "text-red-500";
    };

    return (
        <View className="flex-1 bg-slate-900 px-4 pt-16 space-y-12">

            {/* Header row */}
            <View className="flex-row justify-between items-start">
                {/* Left: Greeting */}
                <View>
                    <Text className="text-2xl font-bold text-white">
                        {getGreeting("en")}
                    </Text>
                    <Text className="text-slate-400 text-sm mt-1">
                        Track your caffeine intake
                    </Text>
                </View>

                {/* Right: Status */}
                <View className="items-end">
                    <Text className={`text-sm font-medium ${getStatusColor()}`}>
                        {getStatusText()}
                    </Text>
                    <Text className="text-xs text-slate-500">
                        {todaysCaffeine}mg active
                    </Text>
                </View>
            </View>

            {/* CaffeineRing centered below */}
            <View className="items-center mt-9 mb-9">
                <CaffeineRing
                    percentage={caffeinePercentage}
                    current={todaysCaffeine}
                    limit={dailyLimit}
                />
            </View>

            {/* Stats grid */}
            <View className="flex-row flex-wrap justify-between gap-5">
                {/* Card 1 */}
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

                {/* Card 2 */}
                <Card className="bg-slate-800 border-slate-700 w-[30%]">
                    <CardContent className="p-4">
                        <View className="w-6 h-6 bg-pink-500 rounded-lg items-center justify-center mb-3">
                            <History size={14} color="white" />
                        </View>
                        <Text className="text-slate-400 text-xs mb-1">Last Drink</Text>
                        <Text className="text-xl font-bold text-white">{getTimeSinceLastDrink()}</Text>
                        <Text className="text-xs text-slate-500">ago</Text>
                    </CardContent>
                </Card>

                {/* Card 3 */}
                <Card className="bg-slate-800 border-slate-700 w-[30%]">
                    <CardContent className="p-4">
                        <View className="w-6 h-6 bg-green-500 rounded-lg items-center justify-center mb-3">
                            <TrendingUp size={14} color="white" />
                        </View>
                        <Text className="text-slate-400 text-xs mb-1">Daily Limit</Text>
                        <Text className="text-xl font-bold text-white">{Math.round(caffeinePercentage)}%</Text>
                        <Text className="text-xs text-slate-500">{dailyLimit - todaysCaffeine}mg remaining</Text>
                    </CardContent>
                </Card>
            </View>

            {/* Add Drink button */}
            <View className="items-center mt-10 mb-4">
                <Pressable
                    onPress={() => setShowAddModal(true)}
                    className="bg-blue-600 px-8 py-3 rounded-full flex-row items-center"
                >
                    <Plus size={20} color="#ffffff" className="mr-2" />
                    <Text className="text-white font-medium text-base">Add Drink</Text>
                </Pressable>
            </View>

            {/* Recent Drinks card */}
            <RecentDrinks drinks={todaysDrinks} />

            {/* Settings Button */}
            <View className="mt-12 mb-10 items-center">
                <Pressable className="bg-white px-6 py-2 rounded-xl shadow flex-row items-center gap-2">
                    <SettingsIcon className="text-slate-700" size={16} />
                    <Text className="text-slate-700 font-semibold">Settings</Text>
                </Pressable>
            </View>


        </View>
    );


}

// Optional: Constant for shared limit
const DAILY_LIMIT = 400;
