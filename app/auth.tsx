import { useDrinks } from '@/components/AppContext';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';

export default function AuthScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signIn, signUp } = useDrinks();

    const handleSubmit = async () => {
        try {
            setLoading(true);
            if (isRegistering) {
                await signUp(email, password);
                // Show success message for registration
                alert('Please check your email to confirm your account');
            } else {
                await signIn(email, password);
            }
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <View className="flex-1 bg-slate-900 p-6 justify-center">
                <View className="space-y-6">
                    <View className="space-y-2">
                        <Text className="text-2xl font-bold text-white mb-2">
                            {isRegistering ? 'Create Account' : 'Welcome Back'}
                        </Text>
                        <Text className="text-slate-400">
                            {isRegistering 
                                ? 'Sign up to track your caffeine intake'
                                : 'Sign in to continue tracking your drinks'}
                        </Text>
                    </View>

                    <View className="space-y-4">
                        <TextInput
                            className="bg-slate-800 text-white px-4 py-3 rounded-lg"
                            placeholder="Email"
                            placeholderTextColor="#64748b"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        <TextInput
                            className="bg-slate-800 text-white px-4 py-3 rounded-lg"
                            placeholder="Password"
                            placeholderTextColor="#64748b"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <View className="space-y-4">
                        <Pressable
                            onPress={handleSubmit}
                            disabled={loading}
                            className="bg-blue-600 p-4 rounded-lg items-center"
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-semibold">
                                    {isRegistering ? 'Sign Up' : 'Sign In'}
                                </Text>
                            )}
                        </Pressable>

                        <Pressable
                            onPress={() => setIsRegistering(!isRegistering)}
                            className="items-center"
                        >
                            <Text className="text-blue-400">
                                {isRegistering
                                    ? 'Already have an account? Sign in'
                                    : 'Need an account? Sign up'}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </>
    );
}