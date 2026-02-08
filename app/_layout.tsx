// app/_layout.tsx
import {useState, useEffect, useCallback} from "react";
import {View} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import {Asset} from "expo-asset";
import {Stack} from "expo-router";

import {DeepLinkHandler} from "@/lib/DeepLinkHandler";
import {UserProvider} from "@/lib/UserContext";
import {UsageProvider} from "../lib/PlanUsageContext"
import {GeneratedMealsProvider} from "@/lib/GeneratedMealsContext";

import "../global.css";
import {supabase} from "@/lib/supabase";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [appReady, setAppReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                const images = [
                    require("../assets/images/food-board-onboard-page-2.jpg"),
                    require("../assets/images/well-done-steak-homemade-potatoes.jpg"),
                ];
                await Promise.all(images.map((img) => Asset.fromModule(img).downloadAsync()));
            } catch (e) {
                console.warn("Image preload error:", e);
            } finally {
                setAppReady(true);
            }
        }

        prepare();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (appReady) {
            await SplashScreen.hideAsync();
        }
    }, [appReady]);

    if (!appReady) return null;

    return (
        <UserProvider>
            <UsageProvider>
                <GeneratedMealsProvider>
                    <DeepLinkHandler/>
                    <View style={{flex: 1, backgroundColor: "#fff"}} onLayout={onLayoutRootView}>
                        <Stack screenOptions={{headerShown: false}}/>
                    </View>
                </GeneratedMealsProvider>
            </UsageProvider>
        </UserProvider>
    );
}