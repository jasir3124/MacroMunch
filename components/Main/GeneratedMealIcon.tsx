import {View, Text} from 'react-native'
import React from 'react'

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';

export default function GeneratedMealIcon( mealType: string ) {
    const icons = [
        {
            mealType: "breakfast",
            from: "MaterialIcons",
            icon: "breakfast-dining"
        },
        {
            mealType: "lunch",
            from: "MaterialIcons",
            icon: "lunch-dining"
        },
        {
            mealType: "dinner",
            from: "MaterialIcons",
            icon: "dinner-dining"
        },
        // TODO: find icon for main type
        {
            mealType: "main",
            from: "",
            icon: ""
        },
        // TODO: find icon for side type
        {
            mealType: "side",
            from: "",
            icon: ""
        },
        // TODO: find icon for appetizer type
        {
            mealType: "appetizer",
            from: "",
            icon: ""
        },
        {
            mealType: "soup",
            from: "MaterialIcons",
            icon: "<MaterialIcons name=\"soup-kitchen\" size={24} color=\"black\" />"
        },
        // TODO: find icon for salad type
        {
            mealType: "salad",
            from: "",
            icon: ""
        },
        // TODO: find icon for sandwich type
        {
            mealType: "sandwich",
            from: "",
            icon: ""
        },
        // TODO: find icon for wrap type
        {
            mealType: "wrap",
            from: "",
            icon: ""
        },
        {
            mealType: "bowl",
            from: "Entypo",
            icon: "<Entypo name=\"bowl\" size={24} color=\"black\" />"
        },
        {
            mealType: "pizza",
            from: "MaterialIcons",
            icon: "<MaterialIcons name=\"local-pizza\" size={24} color=\"black\" />"
        },
        {
            mealType: "pasta",
            from: "MaterialCommunityIcons",
            icon: "<MaterialCommunityIcons name=\"pasta\" size={24} color=\"black\" />"
        },
        {
            // TODO: find icon for dessert type
            mealType: "dessert",
            from: "",
            icon: ""
        },
        {
            mealType: "baked",
            from: "MaterialIcons",
            icon: "<MaterialIcons name=\"bakery-dining\" size={24} color=\"black\" />"
        },
        // TODO: find icon for snack type
        {
            mealType: "snack",
            from: "",
            icon: ""
        },
        {
            mealType: "drink",
            from: "MaterialIcons",
            icon: "<MaterialIcons name=\"local-drink\" size={24} color=\"black\" />"
        },
        // TODO: find icon for smoothie type
        {
            mealType: "smoothie",
            from: "",
            icon: ""
        },
    ]

    const matchingIcon = icons.find((icon) => icon.mealType === mealType);

    if (!matchingIcon) {
        return null;
    }

    return (
        <View>

        </View>
    )
}