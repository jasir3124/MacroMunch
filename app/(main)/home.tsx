import React, {useState} from "react";
import {View, Text, TouchableOpacity, ActivityIndicator} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

import GeneratedMeals from "../../components/Main/GeneratedMeals"
import SavedMeals from "../../components/Main/SavedMeals"

import {useUser} from "@/lib/UserContext";
import { supabase } from "@/lib/supabase";

export default function Home() {
    const {user, userLoading} = useUser();
    const [Page, setPage] = useState("generatedMeals");

    if (userLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    const isFree = user?.tier === "free";
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}} className="flex-1 bg-white">
            {!isFree ? (
                <View className="flex-row justify-evenly items-center px-4 py-4">
                    <TouchableOpacity className="bg-gray-100 px-4 py-2 rounded-lg" onPress={() => setPage("generatedMeals")}>
                        <Text className="text-2xl font-semibold">Todays Meals</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        disabled={isFree}
                        className={`px-4 py-2 rounded-lg relative bg-gray-100`}
                        onPress={() => {setPage("savedMeals")}}
                    >
                        <Text
                            className={`text-2xl font-semibold text-black`}
                        >
                            Saved Meals
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <Text className="text-4xl font-semibold self-center mt-4">Todays Meals</Text>
            )}

            <View className="flex-1 px-10">
                {Page === "generatedMeals" && <GeneratedMeals/>}
                {Page === "savedMeals" && <SavedMeals/>}
            </View>
        </SafeAreaView>
    );
}