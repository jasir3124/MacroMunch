import React, {useEffect, useState} from "react";
import {TouchableOpacity, View, StyleSheet, Platform, StatusBar, Modal} from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as NavigationBar from 'expo-navigation-bar';
import GenerateMeal from "../../components/Main/generateMeal";

export default function MainLayout() {
    const insets = useSafeAreaInsets();
    const [isModalVisible, setIsModalVisible] = useState(false);

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
            <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
                <Tabs
                    screenOptions={{
                        headerShown: false,
                        tabBarActiveTintColor: "#10b981",
                        tabBarInactiveTintColor: "#6b7280",
                        tabBarStyle: {
                            backgroundColor: "#fff",
                            borderTopWidth: 1,
                            borderTopColor: "#e5e7eb",
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
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="home" color={color} size={size} />
                            ),
                        }}
                    />

                    <Tabs.Screen
                        name="profile"
                        options={{
                            title: "Profile",
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="person" color={color} size={size} />
                            ),
                        }}
                    />
                </Tabs>

                {/* Floating Plus Button */}
                <TouchableOpacity
                    onPress={() => setIsModalVisible(true)}
                    style={[
                        styles.middleButton,
                        {
                            bottom: 60 + insets.bottom - 50,
                            left: "50%",
                            marginLeft: -50
                        },
                    ]}
                >
                    <Ionicons name="add" size={50} color="white" />
                </TouchableOpacity>
            </View>

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

                    <View style={[styles.modalContent, { paddingBottom: insets.bottom }]}>
                        <GenerateMeal onClose={() => setIsModalVisible(false)} />
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
        backgroundColor: "#10b981",
        width: 100,
        height: 100,
        borderRadius: 50,
        elevation: 10,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 3 },
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
});