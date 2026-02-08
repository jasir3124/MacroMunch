import { View, Text, Pressable } from "react-native";
import React from "react";

export default function GeneratedMealCard({ recipeData, onPress }) {
    return (
        <Pressable
            onPress={onPress}
            className="bg-white shadow-md rounded-xl p-4 mb-6"
        >
            {/* Title */}
            <Text 
                className="text-xl font-semibold text-limeSoft mb-2"
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {recipeData.meal_name}
            </Text>

            {/* Meta info */}
            <View className="flex-row justify-between items-center mt-5">
                <Text className="text-sm text-yellowAccent">
                    {recipeData.calories} kcal
                </Text>

                <View className="bg-tealAccent px-3 py-1 rounded-full">
                    <Text className="text-xs font-medium text-blueGray">
                        {recipeData.ingredients.length} ingredients
                    </Text>
                </View>
            </View>
        </Pressable>
    );
}