// noinspection D

import React, {useEffect, useState} from "react";
import {TouchableOpacity, View, StyleSheet, Platform, StatusBar, Modal} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Tabs} from "expo-router";
import * as NavigationBar from 'expo-navigation-bar';

import {Ionicons} from "@expo/vector-icons";

import {useUsage} from "@/lib/PlanUsageContext";

import GenerateMeal from "../../components/Main/generateMeal";
import {AlertMealGeneration} from "@/components/Main/AlertMealGeneration";
import {useGeneratedMeals} from "@/lib/GeneratedMealsContext";
import {AlertIsGeneratingMeal} from "@/components/Main/AlertIsGeneratingMeal";

export default function MainLayout() {
    const insets = useSafeAreaInsets();

    const {generationLimit, alertShownToUser} = useUsage();
    const {generatingMeal} = useGeneratedMeals()

    // generate meal modal
    const [isModalVisible, setIsModalVisible] = useState(false);

    // alert that meal generation limit reached
    const [ShowGenerationMealAlert, setShowGenerationMealAlert] = useState(false);
    useEffect(() => {
        if (generationLimit.reached && !generationLimit.alertShown) {
            setShowGenerationMealAlert(true);
            alertShownToUser();
        }
    }, [generationLimit.reached && !generationLimit.alertShown]);


    // alert that meal is generating
    const [ShowGeneratingMealAlert, setShowGeneratingMealAlert] = useState(false);
    useEffect(() => {
        console.log("generating? modal open?")
        console.log(generatingMeal, isModalVisible)
        setShowGeneratingMealAlert(generatingMeal && !isModalVisible)
    }, [generatingMeal, isModalVisible]);

    useEffect(() => {
        if (Platform.OS === 'android') {
            NavigationBar.setBackgroundColorAsync('#ffffff');
            NavigationBar.setButtonStyleAsync('dark');
        }
    }, []);

    return (
        <>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#ffffff"
            />
            <View style={{flex: 1, backgroundColor: "#ffffff"}}>
                <Tabs
                    screenOptions={{
                        headerShown: false,
                        tabBarActiveTintColor: "#93c572",
                        tabBarInactiveTintColor: "#6b7280",
                        tabBarStyle: {
                            backgroundColor: "#fff",
                            borderTopWidth: 0,
                            elevation: 0,
                            shadowColor: "transparent",
                            height: 60 + insets.bottom,
                            paddingBottom: insets.bottom + 8,
                            paddingTop: 8,
                        },
                        tabBarLabelStyle: {
                            fontSize: 12,
                            fontWeight: "600",
                        },
                    }}
                >
                    <Tabs.Screen
                        name="home"
                        options={{
                            title: "Home",
                            tabBarItemStyle: {
                                marginRight: 30,
                            },
                            tabBarIcon: ({color, size}) => (
                                <Ionicons name="home" color={color} size={size}/>
                            ),
                        }}
                    />

                    <Tabs.Screen
                        name="profile"
                        options={{
                            tabBarItemStyle: {
                                marginLeft: 30,
                            },
                            title: "Profile",
                            tabBarIcon: ({color, size}) => (
                                <Ionicons name="person" color={color} size={size}/>
                            ),
                        }}
                    />
                </Tabs>
            </View>

            <TouchableOpacity
                onPress={() => {
                    generationLimit.reached ? setShowGenerationMealAlert(true) : setIsModalVisible(true)
                }}
                className={generationLimit.reached ? "bg-[#CFE3C2]" : "bg-greenSoft"}
                style={[
                    styles.middleButton,
                    {
                        bottom: 60 + insets.bottom - 50,
                        left: "50%",
                        marginLeft: -50
                    },
                ]}
            >
                <Ionicons name="add" size={50} color="white"/>
            </TouchableOpacity>

            {/*alert that meal generation limit reached*/}
            <AlertMealGeneration visible={ShowGenerationMealAlert} onClose={() => setShowGenerationMealAlert(false)}/>

            {/*alert meal is generating*/}
            <AlertIsGeneratingMeal visible={ShowGeneratingMealAlert} onClose={() => setShowGeneratingMealAlert(false)}/>

            {/*generate meal modal*/}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={styles.overlayTouchable}
                        activeOpacity={1}
                        onPress={() => setIsModalVisible(false)}
                    />

                    <View style={[styles.modalContent, {paddingBottom: insets.bottom}]}>
                        <GenerateMeal onClose={() => setIsModalVisible(false)}/>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    middleButton: {
        position: 'absolute',
        justifyContent: "center",
        alignItems: "center",
        width: 100,
        height: 100,
        borderRadius: 50,
        elevation: 10,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowOffset: {width: 0, height: 3},
        shadowRadius: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    overlayTouchable: {
        flex: 1,
    },
    modalContent: {
        height: '70%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    tabBarShadow: {}
});