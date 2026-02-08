// noinspection D

import React, {useState} from "react";
import {View, Text, TouchableOpacity, ActivityIndicator} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {LinearGradient} from "expo-linear-gradient";

import GeneratedMeals from "../../components/Main/GeneratedMeals"
import SavedMeals from "../../components/Main/SavedMeals"

import {useUser} from "@/lib/UserContext";

export default function Home() {
    const {user, userLoading} = useUser();
    const [Page, setPage] = useState("generatedMeals");

    if (userLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#000"/>
            </View>
        );
    }

    const isFree = user?.planTier === "free";
    return (
        <>
            <SafeAreaView style={{flex: 1}} className="">
                {!isFree ? (
                    <View className="flex-row justify-evenly items-center px-4 py-4">
                        <TouchableOpacity
                            className={`px-4 py-2 rounded-lg ${Page === "generatedMeals" ? "bg-greenSoft" : "bg-white"}`}
                            onPress={() => setPage("generatedMeals")}>
                            <Text
                                className={`text-2xl font-semibold ${Page === "generatedMeals" ? "text-white" : "text-black"}`}>Todays
                                Meals</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className={`px-4 py-2 rounded-lg relative ${Page === "savedMeals" ? "bg-greenSoft" : "bg-white"}`}
                            onPress={() => {
                                setPage("savedMeals")
                            }}
                        >
                            <Text
                                className={`text-2xl font-semibold ${Page === "savedMeals" ? "text-white" : "text-black"}`}
                            >
                                Saved Meals
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Text className="text-4xl font-semibold self-center mt-4">Todays Meals</Text>
                )}

                <View className="flex-1 px-7">
                    {Page === "generatedMeals" && <GeneratedMeals/>}
                    {Page === "savedMeals" && <SavedMeals/>}
                </View>
            </SafeAreaView>

            <LinearGradient
                colors={["transparent", "#ffffff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.5 }}
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 70,
                }}
            />
        </>
    );
}