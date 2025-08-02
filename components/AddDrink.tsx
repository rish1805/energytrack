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
import { useDrinks } from "@/components/AppContext";

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
    { name: "Red Bull (250 ml)", caffeine: 80, category: 'energy' },
    { name: "Monster Energy (500 ml)", caffeine: 160, category: 'energy' },
    { name: "Bang Energy (500 ml)", caffeine: 300, category: 'energy' },
    { name: "Reign (500 ml)", caffeine: 300, category: 'energy' },
    { name: "Rockstar (500 ml)", caffeine: 160, category: 'energy' },
    { name: "Espresso Shot", caffeine: 63, category: 'coffee' },
    { name: "Coffee (237 ml)", caffeine: 95, category: 'coffee' },
    { name: "Starbucks Grande (473 ml)", caffeine: 330, category: 'coffee' },
    { name: "Cold Brew (355 ml)", caffeine: 200, category: 'coffee' },
    { name: "C4 Pre-Workout", caffeine: 150, category: 'preworkout' },
    { name: "Ghost Pre-Workout", caffeine: 202, category: 'preworkout' },
    { name: "Pre Kaged", caffeine: 274, category: 'preworkout' },
    { name: "Coca-Cola (330 ml)", caffeine: 34, category: 'soda' },
    { name: "Mountain Dew (330 ml)", caffeine: 54, category: 'soda' },
    { name: "Dr Pepper (330 ml)", caffeine: 41, category: 'soda' },
    { name: "Green Tea (237 ml)", caffeine: 25, category: 'tea' },
    { name: "Black Tea (237 ml)", caffeine: 47, category: 'tea' },
    { name: "Matcha (237 ml)", caffeine: 70, category: 'tea' },
];

const AddDrinkModal = ({ open, onClose, onAdd }: AddDrinkModalProps) => {
    const [selectedPreset, setSelectedPreset] = useState<typeof presetDrinks[0] | null>(null);
    const [customName, setCustomName] = useState('');
    const [customCaffeine, setCustomCaffeine] = useState('');
    const [customCategory, setCustomCategory] = useState<DrinkEntry['category']>('other');
    const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
    const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');
    const [categoryOverlayVisible, setCategoryOverlayVisible] = useState(false);

    const handlePresetSelect = (drink: typeof presetDrinks[0]) => {
        setSelectedPreset(drink);
    };

    const handleSubmit = () => {
        const drinkTime = new Date();
        const [hours, minutes] = time.split(':');
        drinkTime.setHours(parseInt(hours), parseInt(minutes));

        if (activeTab === 'preset' && selectedPreset) {
            onAdd({
                name: selectedPreset.name,
                caffeine: selectedPreset.caffeine,
                category: selectedPreset.category as DrinkEntry['category'],
                time: drinkTime,
            });
        } else if (activeTab === 'custom' && customName && customCaffeine) {
            onAdd({
                name: customName,
                caffeine: parseInt(customCaffeine),
                category: customCategory,
                time: drinkTime,
            });
        }

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

    const { unit } = useDrinks()

    const getDisplayName = (name: string) => {
        const amountMatch = name.match(/\((\d+)\s*ml\)/i);
        const baseName = name.replace(/\s*\(\d+\s*ml\)/i, '').trim();

        if (unit === 'oz' && amountMatch) {
            const ml = parseInt(amountMatch[1]);
            const oz = (ml * 0.033814).toFixed(1); // or however precise you want
            return `${baseName} (${oz} oz)`;
        }

        return name; // keep original if ml or can't parse
    };

    return (
        <>
            {/* Main Modal */}
            <Modal visible={open} animationType="slide" transparent>
                <View className="flex-1 bg-black/60 justify-center items-center px-4">
                    <View className="bg-slate-800 p-6 rounded-2xl w-full max-w-xl h-[85%] border border-slate-700">
                        <View className="flex-1 justify-between space-y-4">
                            <Text className="text-white text-lg font-bold text-center">Add Drink</Text>

                            <View className="bg-slate-700/50 p-1.5 rounded-full flex-row">
                                <Pressable
                                    onPress={() => setActiveTab('preset')}
                                    className={`flex-1 h-10 rounded-full items-center justify-center ${
                                        activeTab === 'preset' ? 'bg-blue-600' : 'bg-transparent'
                                    }`}
                                >
                                    <Text className={`text-sm font-medium ${activeTab === 'preset' ? 'text-white' : 'text-slate-300'}`}>
                                        Preset Drinks
                                    </Text>
                                </Pressable>

                                <Pressable
                                    onPress={() => setActiveTab('custom')}
                                    className={`flex-1 h-10 rounded-full items-center justify-center ${
                                        activeTab === 'custom' ? 'bg-blue-600' : 'bg-transparent'
                                    }`}
                                >
                                    <Text className={`text-sm font-medium ${activeTab === 'custom' ? 'text-white' : 'text-slate-300'}`}>
                                        Custom Drink
                                    </Text>
                                </Pressable>
                            </View>

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

                            <View className="flex-1">
                                {activeTab === 'preset' ? (
                                    <FlatList
                                        data={presetDrinks}
                                        keyExtractor={(item) => item.name}
                                        className="flex-1"
                                        renderItem={({ item }) => {
                                            const isSelected = selectedPreset?.name === item.name;

                                            const highlightBorders = {
                                                energy: 'border-red-400',
                                                coffee: 'border-amber-400',
                                                preworkout: 'border-purple-400',
                                                soda: 'border-blue-400',
                                                tea: 'border-green-400',
                                                other: 'border-gray-400',
                                            };

                                            const defaultBorder = 'border-slate-600';

                                            const borderColorClass = isSelected
                                                ? highlightBorders[item.category as keyof typeof highlightBorders]
                                                : defaultBorder;

                                            return (
                                                <Pressable
                                                    onPress={() => handlePresetSelect(item)}
                                                    className={`rounded-lg border px-4 py-3 mb-2 ${borderColorClass} ${categoryColors[item.category as keyof typeof categoryColors]}`}
                                                >
                                                    <Text className="text-white font-medium">{getDisplayName(item.name)}</Text>
                                                    <Text className="text-slate-300 text-xs">{item.caffeine} mg caffeine</Text>
                                                    <Text className="text-slate-400 text-xs capitalize">{item.category}</Text>
                                                </Pressable>
                                            );
                                        }}
                                    />
                                ) : (
                                    <ScrollView className="space-y-3 flex-1">
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
                                            <Pressable
                                                onPress={() => setCategoryOverlayVisible(true)}
                                                className="bg-slate-700 rounded-lg px-3 py-3"
                                            >
                                                <Text className="text-white capitalize text-center">{customCategory}</Text>
                                            </Pressable>
                                        </View>
                                    </ScrollView>
                                )}
                            </View>

                            <View className="flex-row justify-between pt-2">
                                <Pressable onPress={onClose} className="px-4 py-2 rounded-full bg-red-600">
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
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Category Selector Modal - separate */}
            <Modal visible={categoryOverlayVisible} animationType="slide" transparent statusBarTranslucent>
                <Pressable
                    onPress={() => setCategoryOverlayVisible(false)}
                    className="flex-1 bg-black/50 justify-end"
                >
                    <Pressable
                        onPress={() => {}}
                        className="bg-slate-800 w-full rounded-t-2xl px-6 pt-5 pb-8 max-h-[75%]"
                    >
                        <Text className="text-white text-lg font-semibold mb-4">
                            Select a Category
                        </Text>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ gap: 8, paddingBottom: 10 }}
                        >
                            {['energy', 'coffee', 'preworkout', 'soda', 'tea', 'other'].map((cat) => (
                                <Pressable
                                    key={cat}
                                    onPress={() => {
                                        setCustomCategory(cat as DrinkEntry['category']);
                                        setCategoryOverlayVisible(false);
                                    }}
                                    className={`p-3 rounded-lg ${
                                        cat === 'energy'
                                            ? 'bg-red-600/20'
                                            : cat === 'coffee'
                                                ? 'bg-amber-600/20'
                                                : cat === 'preworkout'
                                                    ? 'bg-purple-600/20'
                                                    : cat === 'soda'
                                                        ? 'bg-blue-600/20'
                                                        : cat === 'tea'
                                                            ? 'bg-green-600/20'
                                                            : 'bg-slate-600/20'
                                    }`}
                                >
                                    <Text className="text-white capitalize text-center">{cat}</Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
};

export default AddDrinkModal;
