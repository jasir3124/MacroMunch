import {View, FlatList, ActivityIndicator, Image, Text} from 'react-native';
import React, {useContext } from 'react';

import {GeneratedMealsContext} from "@/lib/GeneratedMealsContext";
import GeneratedMealCard from "@/components/Main/GeneratedMealCard";

import NoMealsImage from "../../assets/images/20260205_1556_Image Generation_remix_01kgq4re83e0nth033g767rgq1.png"
import LeafImage from "../../assets/images/leaf.png"

export default function MealsScreen() {
    const { generatedMeals, didFetchMeals } =  useContext(GeneratedMealsContext)

    if (!didFetchMeals) {
        return (
            <View className={"flex-1 pt-10"}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View className={"flex-1 pt-5 "}>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={generatedMeals}
                contentContainerStyle={{ flexGrow: 1 }}
                keyExtractor={(recipe) => recipe.id.toString()}
                renderItem={({ item: recipe }) => (
                    <GeneratedMealCard recipeData={recipe} />
                )}
                ListEmptyComponent={(
                    <View className={"flex-1 h-full justify-center align-center"}>
                        <Image
                            source={NoMealsImage}
                            style={{
                                width: 300,
                                height: 230,
                                resizeMode: "cover",
                                alignSelf: "center",
                            }}
                        />
                        <Text className={"font-bold text-5xl capitalize text-[#655555] text-center mt-5"}>
                            no meals yet
                        </Text>
                        <Text className={"text-xl capitalize text-[#655555] text-center mt-4"}>
                            You have not generated any meals yet.
                        </Text>
                        <Image source={LeafImage} style={{width: 150, height: 40, alignSelf: "center"}} className={"mt-7"} />
                    </View>
                )}
            />
        </View>
    );
}