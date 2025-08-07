import { View, Text, Pressable, Switch, TextInput, Alert } from "react-native";
import { Stack } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, {useEffect, useState} from "react";
import { useNavigation } from '@react-navigation/native';
import { useDrinks } from "@/components/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export default function SettingsScreen() {
    const navigation = useNavigation();

    // Placeholder states (you’ll later connect these to context or AsyncStorage)
    const [name, setName] = useState("");
    const { dailyLimit, setDailyLimit, resetSettings } = useDrinks();
    const [limit, setLimit] = useState(dailyLimit.toString());

    const { unit,
            setUnit,
            language,
            setLanguage,
            dateFormat,
            setDateFormat,
            timeFormat,
            setTimeFormat,
            userName,
            setUserName,
                            } = useDrinks();

    const { darkTheme, setDarkTheme } = useDrinks();

    useEffect(() => {
        if (userName) {
            setName(userName);
        }
    }, [userName]);

    useEffect(() => {
        setLimit(dailyLimit.toString());
    }, [dailyLimit]);

    return (
        <>
            <Stack.Screen
                options={{
                    animation: "slide_from_right",
                }}
            />
            <View className="flex-1 bg-slate-900 px-4 pt-6">
                {/* Back Button */}
                <Pressable onPress={() => navigation.goBack()} className="mt-6 mb-4 flex-row items-center gap-2">
                    <ArrowLeft size={20} color="white" />
                    <Text className="text-white text-base font-medium">Back</Text>
                </Pressable>

                {/* Title */}
                <Text className="text-2xl font-bold text-white mb-6">Settings</Text>

                {/* Name Setting */}
                <View className="mb-6">
                    <Text className="text-white font-semibold mb-1">Your Name</Text>
                    <TextInput
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                        }}
                        onEndEditing={() => {
                            const trimmed = name.trim();

                            // accepts and saves an empty input (clears name)
                            if (trimmed === "") {
                                setUserName("");
                                AsyncStorage.setItem("userName", "");
                                Toast.show({
                                    type: "success",
                                    text1: "Name cleared!",
                                    position: "bottom",
                                });
                                return;
                            }

                            // checks that non-empty input has only valid characters
                            if (!/^[a-zA-Z ]+$/.test(trimmed)) {
                                Toast.show({
                                    type: "error",
                                    text1: "Invalid input",
                                    text2: "Use only letters (A–Z) and spaces.",
                                    position: "bottom",
                                });
                                return;
                            }

                            // saves if valid
                            setUserName(trimmed);
                            AsyncStorage.setItem("userName", trimmed);
                            Toast.show({
                                type: "success",
                                text1: "Name saved!",
                                position: "bottom",
                            });
                        }}
                        placeholder={userName ? "" : "Enter your name"}
                        placeholderTextColor="#94a3b8"
                        className="bg-slate-800 text-white rounded px-4 py-2"
                    />
                </View>

                {/* Caffeine Limit */}
                <View className="mb-6">
                    <Text className="text-white font-semibold mb-1">Daily Caffeine Limit (mg)</Text>
                    <TextInput
                        value={limit}
                        onChangeText={setLimit}
                        onEndEditing={() => {
                            const parsed = parseInt(limit);
                            if (isNaN(parsed) || parsed < 1 || parsed > 1000) {
                                Toast.show({
                                    type: "error",
                                    text1: "Invalid limit",
                                    text2: "Enter a number between 1-1000.",
                                    position: "bottom",
                                });
                                return;
                            }
                            setDailyLimit(parsed);
                            Toast.show({
                                type: "success",
                                text1: "Limit saved!",
                                position: "bottom",
                            });
                        }}
                        placeholder="e.g., 400mg is the recommended amount"
                        placeholderTextColor="#94a3b8"
                        keyboardType="numeric"
                        className="bg-slate-800 text-white rounded px-4 py-2"
                    />
                </View>

                {/* Unit of Measurement */}
                <View className="mb-6">
                    <Text className="text-white font-semibold mb-1">Unit of Measurement</Text>
                    <View className="flex-row gap-2 mt-2">
                        {(["ml", "oz"] as const).map((u) => (
                            <Pressable
                                key={u}
                                onPress={() => setUnit(u)}
                                className={`px-4 py-2 rounded ${
                                    unit === u ? "bg-blue-600" : "bg-slate-800"
                                }`}
                            >
                                <Text className="text-white font-medium">{u}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Theme */}
                <View className="mb-6 flex-row justify-between items-center">
                    <Text className="text-white font-semibold">Dark Theme</Text>
                    <Switch
                        value={darkTheme}
                        onValueChange={setDarkTheme}
                        thumbColor={darkTheme ? "#2563eb" : "#e2e8f0"}
                        trackColor={{ false: "#64748b", true: "#334155" }}
                    />
                </View>

                {/* Date Format Selector */}
                <View className="mb-6">
                    <Text className="text-white font-semibold mb-1">Date Format</Text>
                    <View className="flex-row gap-2 mt-2">
                        {(["European", "American"]as const).map((format) => (
                            <Pressable
                                key={format}
                                onPress={() => setDateFormat(format)}
                                className={`px-4 py-2 rounded ${
                                    dateFormat === format ? "bg-blue-600" : "bg-slate-800"
                                }`}
                            >
                                <Text className="text-white font-medium">{format}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Time Format Selector */}
                <View className="mb-6">
                    <Text className="text-white font-semibold mb-1">Time Format</Text>
                    <View className="flex-row gap-2 mt-2">
                        {(["24h", "12h"] as const).map((format) => (
                            <Pressable
                                key={format}
                                onPress={() => setTimeFormat(format)}
                                className={`px-4 py-2 rounded ${
                                    timeFormat === format ? "bg-blue-600" : "bg-slate-800"
                                }`}
                            >
                                <Text className="text-white font-medium">{format}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Language Selector */}
                <View className="mb-6">
                    <Text className="text-white font-semibold mb-1">App Language</Text>
                    <View className="flex-row gap-2 mt-2">
                        {(["English", "Dansk", "Deutsch"] as const).map((lang) => (
                            <Pressable
                                key={lang}
                                onPress={() => setLanguage(lang)}
                                className={`px-4 py-2 rounded ${
                                    language === lang ? "bg-blue-600" : "bg-slate-800"
                                }`}
                            >
                                <Text className="text-white font-medium">{lang}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="text-white font-semibold mb-1">Reset All Settings</Text>
                    <Pressable
                        onPress={() => {
                            Alert.alert(
                                "Reset All Settings?",
                                "This will reset all your preferences to default values. Continue?",
                                [
                                    { text: "Cancel", style: "cancel" },
                                    { text: "Reset", style: "destructive", onPress: () => {
                                            resetSettings();
                                            Toast.show({
                                                type: "success",
                                                text1: "Settings reset to default.",
                                                position: "bottom",
                                            });
                                    }
                                    }
                                ]
                            );
                        }}
                        className="mt-2 bg-red-700 px-4 py-2 rounded"
                    >
                        <Text className="text-white font-medium text-center">Reset to Default</Text>
                    </Pressable>
                </View>

            </View>
        </>
    );
}