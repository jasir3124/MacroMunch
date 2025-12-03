import {View, Text, TouchableOpacity, ScrollView, TextInput, Switch} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import {useState} from 'react';

export default function GenerateMeal({onClose}) {
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
        // Your generation logic here
        setTimeout(() => {
            setIsGenerating(false);
            // Handle generated meal
        }, 2000);
    };

    const isFormValid = mealDescription.trim().length > 0;

    return (
        <View style={{flex: 1}}>
            {/* Handle bar */}
            <View style={{alignItems: 'center', marginBottom: 10}}>
                <View style={{
                    width: 40,
                    height: 5,
                    backgroundColor: '#569099',
                    borderRadius: 3,
                    opacity: 0.3
                }}/>
            </View>

            {/* Close button */}
            <TouchableOpacity
                onPress={onClose}
                style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    padding: 10,
                    zIndex: 1
                }}
            >
                <Ionicons name="close" size={28} color="#569099"/>
            </TouchableOpacity>

            {/* Content */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{flex: 1}}
                contentContainerStyle={{paddingBottom: 100}}
                nestedScrollEnabled={true}
            >
                <View>
                    <Text style={{
                        fontSize: 24,
                        fontWeight: 'bold',
                        marginBottom: 8,
                        marginTop: 10,
                        color: '#569099'
                    }}>
                        Generate Meal
                    </Text>

                    <Text style={{
                        fontSize: 14,
                        color: '#569099',
                        opacity: 0.7,
                        marginBottom: 24
                    }}>
                        Describe what you'd like to eat and we'll create a meal plan for you
                    </Text>

                    {/* Meal Description */}
                    <View style={{marginBottom: 24}}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: '600',
                            marginBottom: 8,
                            color: '#569099'
                        }}>
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
                            style={{
                                borderWidth: 2,
                                borderColor: '#a4dad2',
                                borderRadius: 12,
                                padding: 12,
                                fontSize: 15,
                                color: '#569099',
                                backgroundColor: '#a4dad220',
                                minHeight: 100
                            }}
                        />
                        <Text style={{
                            fontSize: 12,
                            color: '#569099',
                            opacity: 0.6,
                            marginTop: 6
                        }}>
                            Be as specific or general as you'd like
                        </Text>
                    </View>

                    {/* Custom Macros Toggle */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 16,
                        padding: 16,
                        backgroundColor: '#bce08a30',
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: '#bce08a'
                    }}>
                        <View style={{flex: 1, marginRight: 12}}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: '#569099',
                                marginBottom: 4
                            }}>
                                Custom Macros
                            </Text>
                            <Text style={{
                                fontSize: 13,
                                color: '#569099',
                                opacity: 0.7
                            }}>
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

                    {/* Macro Inputs */}
                    {includeCustomMacros && (
                        <View style={{
                            backgroundColor: '#a4dad220',
                            padding: 16,
                            borderRadius: 12,
                            marginBottom: 24,
                            borderWidth: 1,
                            borderColor: '#a4dad2'
                        }}>
                            <Text style={{
                                fontSize: 15,
                                fontWeight: '600',
                                color: '#569099',
                                marginBottom: 12
                            }}>
                                Target Macros (optional)
                            </Text>

                            <View style={{gap: 12}}>
                                {/* Protein & Carbs */}
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <View style={{flex: 1}}>
                                        <Text style={{
                                            fontSize: 14,
                                            color: '#569099',
                                            marginBottom: 6,
                                            opacity: 0.8
                                        }}>
                                            Protein (g)
                                        </Text>
                                        <TextInput
                                            value={macros.protein}
                                            onChangeText={(text) => setMacros({...macros, protein: text})}
                                            placeholder="30"
                                            placeholderTextColor="#56909950"
                                            keyboardType="numeric"
                                            style={{
                                                borderWidth: 1.5,
                                                borderColor: '#93c572',
                                                borderRadius: 8,
                                                padding: 10,
                                                fontSize: 15,
                                                backgroundColor: '#ffffff',
                                                color: '#569099'
                                            }}
                                        />
                                    </View>
                                    <View style={{width: 12}}/>
                                    <View style={{flex: 1}}>
                                        <Text style={{
                                            fontSize: 14,
                                            color: '#569099',
                                            marginBottom: 6,
                                            opacity: 0.8
                                        }}>
                                            Carbs (g)
                                        </Text>
                                        <TextInput
                                            value={macros.carbs}
                                            onChangeText={(text) => setMacros({...macros, carbs: text})}
                                            placeholder="50"
                                            placeholderTextColor="#56909950"
                                            keyboardType="numeric"
                                            style={{
                                                borderWidth: 1.5,
                                                borderColor: '#93c572',
                                                borderRadius: 8,
                                                padding: 10,
                                                fontSize: 15,
                                                backgroundColor: '#ffffff',
                                                color: '#569099'
                                            }}
                                        />
                                    </View>
                                </View>

                                {/* Fats & Calories */}
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <View style={{flex: 1}}>
                                        <Text style={{
                                            fontSize: 14,
                                            color: '#569099',
                                            marginBottom: 6,
                                            opacity: 0.8
                                        }}>
                                            Fats (g)
                                        </Text>
                                        <TextInput
                                            value={macros.fats}
                                            onChangeText={(text) => setMacros({...macros, fats: text})}
                                            placeholder="15"
                                            placeholderTextColor="#56909950"
                                            keyboardType="numeric"
                                            style={{
                                                borderWidth: 1.5,
                                                borderColor: '#93c572',
                                                borderRadius: 8,
                                                padding: 10,
                                                fontSize: 15,
                                                backgroundColor: '#ffffff',
                                                color: '#569099'
                                            }}
                                        />
                                    </View>
                                    <View style={{width: 12}}/>
                                    <View style={{flex: 1}}>
                                        <Text style={{
                                            fontSize: 14,
                                            color: '#569099',
                                            marginBottom: 6,
                                            opacity: 0.8
                                        }}>
                                            Calories
                                        </Text>
                                        <TextInput
                                            value={macros.calories}
                                            onChangeText={(text) => setMacros({...macros, calories: text})}
                                            placeholder="500"
                                            placeholderTextColor="#56909950"
                                            keyboardType="numeric"
                                            style={{
                                                borderWidth: 1.5,
                                                borderColor: '#93c572',
                                                borderRadius: 8,
                                                padding: 10,
                                                fontSize: 15,
                                                backgroundColor: '#ffffff',
                                                color: '#569099'
                                            }}
                                        />
                                    </View>
                                </View>
                            </View>

                            <Text style={{
                                fontSize: 12,
                                color: '#569099',
                                opacity: 0.6,
                                marginTop: 8
                            }}>
                                Leave empty to let AI decide the portions
                            </Text>
                        </View>
                    )}

                    {/* Quick Suggestions */}
                    <View style={{marginBottom: 24}}>
                        <Text style={{
                            fontSize: 15,
                            fontWeight: '600',
                            color: '#569099',
                            marginBottom: 10
                        }}>
                            Quick Suggestions
                        </Text>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
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
                                        style={{
                                            paddingHorizontal: 14,
                                            paddingVertical: 8,
                                            backgroundColor: isSelected ? '#f6d809' : '#f6d80930',
                                            borderWidth: 1.5,
                                            borderColor: isSelected ? '#f6d809' : '#f6d80980',
                                            borderRadius: 20
                                        }}
                                    >
                                        <Text style={{
                                            fontSize: 13,
                                            color: '#569099',
                                            fontWeight: isSelected ? '600' : '500'
                                        }}>
                                            {suggestion}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Generate Button - Compact */}
            <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderTopWidth: 1,
                borderTopColor: '#a4dad250',
                backgroundColor: '#ffffff'
            }}>
                <TouchableOpacity
                    onPress={handleGenerate}
                    disabled={!isFormValid || isGenerating}
                    style={{
                        backgroundColor: isFormValid && !isGenerating ? '#93c572' : '#56909940',
                        paddingVertical: 14,
                        borderRadius: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        shadowColor: '#93c572',
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 3
                    }}
                >
                    {isGenerating ? (
                        <Text style={{
                            color: '#ffffff',
                            fontSize: 16,
                            fontWeight: '600'
                        }}>
                            Generating...
                        </Text>
                    ) : (
                        <>
                            <Ionicons name="sparkles" size={18} color="#ffffff" style={{marginRight: 8}}/>
                            <Text style={{
                                color: '#ffffff',
                                fontSize: 16,
                                fontWeight: '600'
                            }}>
                                Generate Meal
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}