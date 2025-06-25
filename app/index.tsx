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
    <View className="flex-1 justify-start items-start px-4 pt-10">
        <Text className="text-2xl font-bold mb-1">{getGreeting("en")}</Text>
        <Text className="text-gray-400">Track your caffeine intake</Text>
        <Link href="/onboarding">Onboarding</Link>
    </View>
  );
}
