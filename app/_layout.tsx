import { Stack } from "expo-router";
import "./globals.css";
import { DrinksProvider } from "@/components/AppContext";
import { View } from "react-native";
import Toast from "react-native-toast-message";

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
            <Toast/>
        </DrinksProvider>
    );
}