import { Stack } from "expo-router";
import "./globals.css";
import { DrinksProvider } from "@/components/DrinksProvider";
import { View } from "react-native";

export default function RootLayout() {
    return (
        <DrinksProvider>
            <View style={{flex: 1, backgroundColor: "#0f172a" }}>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: "#0f172a" },
                        animation: "slide_from_right",
                    }}
                />
            </View>
        </DrinksProvider>
    );
}