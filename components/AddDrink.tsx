import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    FlatList,
} from 'react-native';

interface DrinkEntry {
    name: string;
    caffeine: number;
    time: Date;
    category: 'energy' | 'coffee' | 'preworkout' | 'soda' | 'tea' | 'other';
}

interface AddDrinkModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: (drink: DrinkEntry) => void;
}

const presetDrinks = [
    { name: "Red Bull (8.4 oz)", caffeine: 80, category: 'energy' as const },
    { name: "Monster Energy (16 oz)", caffeine: 160, category: 'energy' as const },
    { name: "Bang Energy (16 oz)", caffeine: 300, category: 'energy' as const },
    { name: "Reign (16 oz)", caffeine: 300, category: 'energy' as const },
    { name: "Rockstar (16 oz)", caffeine: 160, category: 'energy' as const },
    { name: "Espresso Shot", caffeine: 63, category: 'coffee' as const },
    { name: "Coffee (8 oz)", caffeine: 95, category: 'coffee' as const },
    { name: "Starbucks Grande (16 oz)", caffeine: 330, category: 'coffee' as const },
    { name: "Cold Brew (12 oz)", caffeine: 200, category: 'coffee' as const },
    { name: "C4 Pre-Workout", caffeine: 150, category: 'preworkout' as const },
    { name: "Ghost Pre-Workout", caffeine: 202, category: 'preworkout' as const },
    { name: "Pre Kaged", caffeine: 274, category: 'preworkout' as const },
    { name: "Coca-Cola (12 oz)", caffeine: 34, category: 'soda' as const },
    { name: "Mountain Dew (12 oz)", caffeine: 54, category: 'soda' as const },
    { name: "Dr Pepper (12 oz)", caffeine: 41, category: 'soda' as const },
    { name: "Green Tea (8 oz)", caffeine: 25, category: 'tea' as const },
    { name: "Black Tea (8 oz)", caffeine: 47, category: 'tea' as const },
    { name: "Matcha (8 oz)", caffeine: 70, category: 'tea' as const },
];

const AddDrinkModal = ({ open, onClose, onAdd }: AddDrinkModalProps) => {
    const [selectedPreset, setSelectedPreset] = useState<typeof presetDrinks[0] | null>(null);
    const [customName, setCustomName] = useState('');
    const [customCaffeine, setCustomCaffeine] = useState('');
    const [customCategory, setCustomCategory] = useState<DrinkEntry['category']>('other');
    const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
    const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');

    const handlePresetSelect = (drink: typeof presetDrinks[0]) => {
        setSelectedPreset(drink);
    };

    const handleSubmit = () => {
        if (activeTab === 'preset' && selectedPreset) {
            const drinkTime = new Date();
            const [hours, minutes] = time.split(':');
            drinkTime.setHours(parseInt(hours), parseInt(minutes));

            onAdd({
                name: selectedPreset.name,
                caffeine: selectedPreset.caffeine,
                category: selectedPreset.category,
                time: drinkTime,
            });
        } else if (activeTab === 'custom' && customName && customCaffeine) {
            const drinkTime = new Date();
            const [hours, minutes] = time.split(':');
            drinkTime.setHours(parseInt(hours), parseInt(minutes));

            onAdd({
                name: customName,
                caffeine: parseInt(customCaffeine),
                category: customCategory,
                time: drinkTime,
            });
        }

        // Reset form
        setSelectedPreset(null);
        setCustomName('');
        setCustomCaffeine('');
        setCustomCategory('other');
        setTime(new Date().toTimeString().slice(0, 5));
        onClose();
    };

    const categoryColors = {
        energy: 'border-red-500 bg-red-500/10',
        coffee: 'border-amber-500 bg-amber-500/10',
        preworkout: 'border-purple-500 bg-purple-500/10',
        soda: 'border-blue-500 bg-blue-500/10',
        tea: 'border-green-500 bg-green-500/10',
        other: 'border-gray-500 bg-gray-500/10',
    };

    return (
        <Modal visible={open} animationType="slide" transparent>
            {/* These 2 pressable's make it so we can tap outside the add drink overlay to exit it */}
            <Pressable onPress={onClose} className="flex-1 justify-center items-center bg-black/60 px-4">
                <Pressable
                    onPress={() => {}}
                    className="bg-slate-800 p-6 rounded-2xl w-full max-w-xl max-h-[90%] h-[80%] border border-slate-700 space-y-4"
                >
                    {/* Header */}
                    <Text className="text-white text-lg font-bold text-center">Add Drink</Text>

                    {/* Tabs */}
                    <View className="flex-row justify-center space-x-4">
                        <Pressable onPress={() => setActiveTab('preset')}>
                            <Text className={`text-sm font-medium ${activeTab === 'preset' ? 'text-white underline' : 'text-slate-400'}`}>Preset Drinks</Text>
                        </Pressable>
                        <Pressable onPress={() => setActiveTab('custom')}>
                            <Text className={`text-sm font-medium ${activeTab === 'custom' ? 'text-white underline' : 'text-slate-400'}`}>Custom Drink</Text>
                        </Pressable>
                    </View>

                    {/* Time Input */}
                    <View>
                        <Text className="text-slate-400 mb-1">Time</Text>
                        <TextInput
                            value={time}
                            onChangeText={setTime}
                            placeholder="HH:mm"
                            className="bg-slate-700 text-white px-3 py-2 rounded-lg"
                            placeholderTextColor="#94a3b8"
                        />
                    </View>

                    {/* Preset or Custom */}
                    {activeTab === 'preset' ? (
                        <FlatList
                            data={presetDrinks}
                            keyExtractor={(item) => item.name}
                            className="max-h-60"
                            renderItem={({ item }) => (
                                <Pressable
                                    onPress={() => handlePresetSelect(item)}
                                    className={`rounded-lg border px-4 py-3 mb-2 ${
                                        selectedPreset?.name === item.name
                                            ? 'border-purple-500 bg-purple-600/20'
                                            : 'border-slate-600'
                                    } ${categoryColors[item.category]}`}
                                >
                                    <Text className="text-white font-medium">{item.name}</Text>
                                    <Text className="text-slate-300 text-xs">{item.caffeine} mg caffeine</Text>
                                    <Text className="text-slate-400 text-xs capitalize">{item.category}</Text>
                                </Pressable>
                            )}
                        />
                    ) : (
                        <ScrollView className="space-y-3 max-h-60">
                            <View>
                                <Text className="text-slate-400 mb-1">Drink Name</Text>
                                <TextInput
                                    value={customName}
                                    onChangeText={setCustomName}
                                    placeholder="e.g., My Custom Energy Drink"
                                    className="bg-slate-700 text-white px-3 py-2 rounded-lg"
                                    placeholderTextColor="#94a3b8"
                                />
                            </View>
                            <View>
                                <Text className="text-slate-400 mb-1">Caffeine (mg)</Text>
                                <TextInput
                                    keyboardType="numeric"
                                    value={customCaffeine}
                                    onChangeText={setCustomCaffeine}
                                    placeholder="e.g., 150"
                                    className="bg-slate-700 text-white px-3 py-2 rounded-lg"
                                    placeholderTextColor="#94a3b8"
                                />
                            </View>
                            <View>
                                <Text className="text-slate-400 mb-1">Category</Text>
                                <TextInput
                                    value={customCategory}
                                    onChangeText={(val) => setCustomCategory(val as DrinkEntry['category'])}
                                    placeholder="e.g., energy, tea"
                                    className="bg-slate-700 text-white px-3 py-2 rounded-lg"
                                    placeholderTextColor="#94a3b8"
                                />
                            </View>
                        </ScrollView>
                    )}

                    {/* Action Buttons */}
                    <View className="flex-row justify-between pt-4">
                        <Pressable onPress={onClose} className="px-4 py-2 rounded-full bg-red-600" >
                            <Text className="text-white">Cancel</Text>
                        </Pressable>
                        <Pressable
                            onPress={handleSubmit}
                            className={`px-4 py-2 rounded-full ${
                                (activeTab === 'preset' && !selectedPreset) ||
                                (activeTab === 'custom' && (!customName || !customCaffeine))
                                    ? 'bg-slate-600'
                                    : 'bg-blue-600'
                            }`}
                            disabled={
                                (activeTab === 'preset' && !selectedPreset) ||
                                (activeTab === 'custom' && (!customName || !customCaffeine))
                            }
                        >
                            <Text className="text-white font-semibold">+ Add Drink</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default AddDrinkModal;
