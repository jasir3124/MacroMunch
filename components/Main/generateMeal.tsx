import {View, Text, TouchableOpacity, ScrollView, TextInput, Switch} from 'react-native';
import {useState} from 'react';

import {supabase} from "../../lib/supabase";
import {useUsage} from "@/lib/PlanUsageContext";

import {Ionicons} from "@expo/vector-icons";


export default function GenerateMeal({onClose}) {
    const { markGenerationLimitReached } = useUsage();

    const [mealDescription, setMealDescription] = useState<string>('');
    const [includeCustomMacros, setIncludeCustomMacros] = useState<boolean>(false);
    const [quickSuggestions, setQuickSuggestions] = useState<string[]>([]);
    const [macros, setMacros] = useState<{
        protein: string;
        carbs: string;
        fats: string;
        calories: string;
    }>({
        protein: '',
        carbs: '',
        fats: '',
        calories: ''
    });
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!mealDescription.trim()) return;

        setIsGenerating(true);

        const session = await supabase.auth.getSession();
        const accessToken = session.data.session?.access_token;

        const res = await fetch(
            "https://ibmutlcdehhlzxjnovna.supabase.co/functions/v1/gemini-food-generator",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    prompt: mealDescription,
                    includeCustomMacros,
                    quickSuggestions,
                    macros
                }),
            }
        );
        const meal = await res.json();

        if (res.status === 403) {
            markGenerationLimitReached();
        }
        setIsGenerating(false);
        onClose();
        console.log(meal);
    };

    const isFormValid = mealDescription.trim().length > 0;

    return (
        <View className="flex-1">
            <TouchableOpacity
                onPress={onClose}
                className="absolute right-0 top-0 p-2.5 z-10"
            >
                <Ionicons name="close" size={28} color="#569099"/>
            </TouchableOpacity>

            <ScrollView
                showsVerticalScrollIndicator={false}
                className="flex-1"
            >
                <View>
                    <Text className="text-2xl font-bold mb-2 mt-2.5 text-blueGray">
                        Generate Meal
                    </Text>

                    <Text className="text-sm opacity-70 mb-6">
                        Describe what you&#39;d like to eat and we&#39;ll create a meal plan for you
                    </Text>

                    <View className="mb-6">
                        <Text className="text-base font-semibold mb-2 text-blueGray">
                            What would you like to eat?
                        </Text>
                        <TextInput
                            value={mealDescription}
                            onChangeText={setMealDescription}
                            placeholder="e.g., Grilled chicken with rice and vegetables"
                            placeholderTextColor="#56909960"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            className="border-2 border-tealAccent rounded-xl p-3 text-[15px] text-blueGray bg-tealAccent/[0.13] min-h-[100px]"
                        />
                        <Text className="text-xs text-blueGray opacity-60 mt-1.5">11
                            Be as specific or general as you&#39;d like
                        </Text>
                    </View>

                    <View className="mb-6">
                        <Text className="text-[15px] font-semibold text-blueGray mb-2.5">
                            Quick Suggestions
                        </Text>
                        <View className="flex-row flex-wrap gap-2">
                            {['High Protein', 'Low Carb', 'Vegetarian', 'Quick & Easy'].map((suggestion) => {
                                const isSelected = quickSuggestions.includes(suggestion);
                                return (
                                    <TouchableOpacity
                                        key={suggestion}
                                        onPress={() => {
                                            if (isSelected) {
                                                setQuickSuggestions(prev => prev.filter(s => s !== suggestion));
                                            } else {
                                                setQuickSuggestions(prev => [...prev, suggestion]);
                                            }
                                        }}
                                        className={`px-3.5 py-2 border-[1.5px] rounded-full ${
                                            isSelected
                                                ? 'bg-yellowAccent border-yellowAccent'
                                                : 'bg-yellowAccent/[0.19] border-yellowAccent/50'
                                        }`}
                                    >
                                        <Text className={`text-[13px] text-blueGray ${
                                            isSelected ? 'font-semibold' : 'font-medium'
                                        }`}>
                                            {suggestion}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <View className="flex-row justify-between items-center mb-4 p-4 bg-limeSoft/[0.19] rounded-xl border border-limeSoft">
                        <View className="flex-1 mr-3">
                            <Text className="text-base font-semibold text-blueGray mb-1">
                                Custom Macros
                            </Text>
                            <Text className="text-[13px] text-blueGray opacity-70">
                                Specify target macros for this meal
                            </Text>
                        </View>
                        <Switch
                            value={includeCustomMacros}
                            onValueChange={setIncludeCustomMacros}
                            trackColor={{false: '#56909940', true: '#93c572'}}
                            thumbColor={includeCustomMacros ? '#bce08a' : '#f4f3f4'}
                        />
                    </View>

                    {includeCustomMacros && (
                        <View className="bg-tealAccent/[0.13] p-4 rounded-xl mb-6 border border-tealAccent">
                            <Text className="text-[15px] font-semibold text-blueGray mb-3">
                                Target Macros (optional)
                            </Text>

                            <View className="gap-3">
                                <View className="flex-row items-center">
                                    <View className="flex-1">
                                        <Text className="text-sm text-blueGray mb-1.5 opacity-80">
                                            Protein (g)
                                        </Text>
                                        <TextInput
                                            value={macros.protein}
                                            onChangeText={(text) => setMacros({...macros, protein: text})}
                                            placeholder="30"
                                            placeholderTextColor="#56909950"
                                            keyboardType="numeric"
                                            className="border-[1.5px] border-greenSoft rounded-lg p-2.5 text-[15px] bg-white text-blueGray"
                                        />
                                    </View>
                                    <View className="w-3" />
                                    <View className="flex-1">
                                        <Text className="text-sm text-blueGray mb-1.5 opacity-80">
                                            Carbs (g)
                                        </Text>
                                        <TextInput
                                            value={macros.carbs}
                                            onChangeText={(text) => setMacros({...macros, carbs: text})}
                                            placeholder="50"
                                            placeholderTextColor="#56909950"
                                            keyboardType="numeric"
                                            className="border-[1.5px] border-greenSoft rounded-lg p-2.5 text-[15px] bg-white text-blueGray"
                                        />
                                    </View>
                                </View>

                                <View className="flex-row items-center">
                                    <View className="flex-1">
                                        <Text className="text-sm text-blueGray mb-1.5 opacity-80">
                                            Fats (g)
                                        </Text>
                                        <TextInput
                                            value={macros.fats}
                                            onChangeText={(text) => setMacros({...macros, fats: text})}
                                            placeholder="15"
                                            placeholderTextColor="#56909950"
                                            keyboardType="numeric"
                                            className="border-[1.5px] border-greenSoft rounded-lg p-2.5 text-[15px] bg-white text-blueGray"
                                        />
                                    </View>
                                    <View className="w-3" />
                                    <View className="flex-1">
                                        <Text className="text-sm text-blueGray mb-1.5 opacity-80">
                                            Calories
                                        </Text>
                                        <TextInput
                                            value={macros.calories}
                                            onChangeText={(text) => setMacros({...macros, calories: text})}
                                            placeholder="500"
                                            placeholderTextColor="#56909950"
                                            keyboardType="numeric"
                                            className="border-[1.5px] border-greenSoft rounded-lg p-2.5 text-[15px] bg-white text-blueGray"
                                        />
                                    </View>
                                </View>
                            </View>

                            <Text className="text-xs text-blueGray opacity-60 mt-2">
                                Leave empty to let AI decide the portions
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            <View className="bottom-0 left-0 right-0 px-4 py-3 border-t border-tealAccent/[0.31] bg-white">
                <TouchableOpacity
                    onPress={handleGenerate}
                    disabled={!isFormValid || isGenerating}
                    className={`py-3.5 rounded-xl flex-row items-center justify-center ${
                        isFormValid && !isGenerating ? 'bg-greenSoft' : 'bg-blueGray/25'
                    }`}
                    style={isFormValid && !isGenerating ? {
                        shadowColor: '#93c572',
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 3
                    } : {}}
                >
                    {isGenerating ? (
                        <Text className="text-white text-base font-semibold">
                            Generating...
                        </Text>
                    ) : (
                        <>
                            <Ionicons name="sparkles" size={18} color="#ffffff" style={{marginRight: 8}}/>
                            <Text className="text-white text-base font-semibold">
                                Generate Meal
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}