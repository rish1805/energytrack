import { Text, View } from "react-native";
import {Link} from "expo-router";

function getGreeting(locale: "en"|"da" = "en") {
    const hour = new Date().getHours();
    const greetings = {
        en : {
            morning: "Good morning!",
            afternoon: "Good afternoon!",
            evening: "Good evening!",
        },
        da : {
            morning: "Godmorgen!",
            afternoon: "God eftermiddag!",
            evening: "God aften!",
        },
    };
    const lang = greetings[locale] || greetings.en;
    if (hour < 12) return lang.morning;
    if (hour < 18) return lang.afternoon;
    return lang.evening;
}

const DAILY_LIMIT = 400 // mg of caffeine per day (FDA recommendation)
const currentCaffeine = 0

const getCaffeineStatus = () => {
    if (currentCaffeine > DAILY_LIMIT) return { text: 'Over Limit', color: 'text-red-400' };
    if (currentCaffeine > DAILY_LIMIT * 0.8) return { text: 'High', color: 'text-yellow-400' };
    if (currentCaffeine > DAILY_LIMIT * 0.5) return { text: 'Moderate', color: 'text-blue-400' };
    return { text: 'Low', color: 'text-green-400' };
};


export default function Index() {
    return (
        <View className="flex-1">

            {/* Top 1/3 - darker navy */}
            <View className="flex-[0.45] bg-[#1c2333] px-6 pt-10">
                {/* First Row: Greeting + Status */}
                <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-2xl font-bold text-white">{getGreeting()}</Text>
                    <Text className={`text-lg font-semibold ${getCaffeineStatus().color}`}>
                        {getCaffeineStatus().text}
                    </Text>
                </View>

                {/* Second Row: Subtitle + mg info */}
                <View className="flex-row justify-between items-center">
                    <Text className="text-gray-400">Track your caffeine intake</Text>
                    <Text className="text-sm text-gray-400">{currentCaffeine} mg active</Text>
                </View>

                {/*Caffeine ring*/}
                <View className="flex items-center justify-center py-8">
                    {/* Outer ring (simulated) */}
                    <View className="w-36 h-36 rounded-full border-4 border-yellow-400 items-center justify-center">
                        {/* Inner text */}
                        <Text className="text-3xl font-bold text-white">{currentCaffeine}</Text>
                        <Text className="text-xs text-gray-400 mt-1">mg caffeine</Text>
                        <Text className="text-xs text-gray-500">of 400mg daily</Text>
                    </View>
                </View>

            </View>

            {/* Bottom 2/3 - darker navy */}
            <View className="flex-[0.7] bg-[#0b0f19] px-6 py-4"></View>

        </View>

    );
}

