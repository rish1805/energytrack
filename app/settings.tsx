import { View, Text, Pressable, Switch, TextInput } from "react-native";
import { Stack } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
    const navigation = useNavigation();

    // Placeholder states (you’ll later connect these to context or AsyncStorage)
    const [name, setName] = useState("");
    const [unit, setUnit] = useState("mg");
    const [limit, setLimit] = useState("400");
    const [darkMode, setDarkMode] = useState(true);
    const [language, setLanguage] = useState("English");
    const [dateFormat, setDateFormat] = useState("American");

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
                        onChangeText={setName}
                        placeholder="Enter your name"
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
                        placeholder="e.g., 400"
                        placeholderTextColor="#94a3b8"
                        keyboardType="numeric"
                        className="bg-slate-800 text-white rounded px-4 py-2"
                    />
                </View>

                {/* Units */}
                <View className="mb-6">
                    <Text className="text-white font-semibold mb-1">Unit of Measurement</Text>
                    <View className="flex-row gap-2 mt-2">
                        {["mg", "oz", "ml"].map((u) => (
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
                        value={darkMode}
                        onValueChange={setDarkMode}
                        thumbColor={darkMode ? "#2563eb" : "#e2e8f0"}
                        trackColor={{ false: "#64748b", true: "#334155" }}
                    />
                </View>

                {/* Date Format Selector */}
                <View className="mb-6">
                    <Text className="text-white font-semibold mb-1">Date Format</Text>
                    <View className="flex-row gap-2 mt-2">
                        {["European", "American"].map((format) => (
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

                {/* Language Selector */}
                <View className="mb-6">
                    <Text className="text-white font-semibold mb-1">App Language</Text>
                    <View className="flex-row gap-2 mt-2">
                        {["English", "Dansk", "Deutsch"].map((lang) => (
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

            </View>
        </>
    );
}