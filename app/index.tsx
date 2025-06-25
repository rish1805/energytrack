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

export default function Index() {
    return (
        <View className="flex-1">
            {/* Top 1/3 - dark navy */}
            <View className="flex-[0.45] bg-[#1c2333] px-6 pt-10">
                <Text className="text-2xl font-bold text-white mb-1">Good morning!</Text>
                <Text className="text-gray-400">Track your caffeine intake</Text>
            </View>

            {/* Bottom 2/3 - darker navy */}
            <View className="flex-[0.7] bg-[#0b0f19] px-6 py-4">
            </View>
        </View>
    );
}
