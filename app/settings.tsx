import { View, Text } from "react-native";
import { Stack } from "expo-router";

export default function SettingsScreen() {
    return (
        <>
            <Stack.Screen
                options={{
                    title: "Settings",
                    animation: "slide_from_right",
                }}
            />
            <View className="flex-1 bg-slate-900 items-center justify-center">
                <Text className="text-white text-2xl font-bold">Settings Page</Text>
            </View>
        </>
    );
}