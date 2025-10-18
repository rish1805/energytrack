import { DrinksProvider, useDrinks } from "@/components/AppContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import "./globals.css";

// Auth protection wrapper
function AuthWrapper({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useDrinks();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === "auth";

        if (!user && !inAuthGroup) {
            // Redirect to auth screen if not logged in
            router.replace("/auth");
        } else if (user && inAuthGroup) {
            // Redirect to home if logged in and trying to access auth screen
            router.replace("/");
        }
    }, [user, segments, isLoading]);

    // Show nothing while loading
    if (isLoading) return null;

    return <>{children}</>;
}

export default function RootLayout() {
    return (
        <DrinksProvider>
            <AuthWrapper>
                <View style={{flex: 1, backgroundColor: "#000" }}>
                    <Stack
                        screenOptions={{
                            headerShown: false,
                            contentStyle: { backgroundColor: "#0f172a" },
                            animation: "slide_from_right",
                        }}
                    />
                </View>
                <Toast/>
            </AuthWrapper>
        </DrinksProvider>
    );
}