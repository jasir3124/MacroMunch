import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView, Platform
} from "react-native";
import React from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {LinearGradient} from "expo-linear-gradient";

import {router} from "expo-router";
import SignInForm from "@/components/Auth/SignInForm";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const {height} = Dimensions.get("window");

export default function SingIn() {
    return (
        <SafeAreaView className="flex-1 bg-greenSoft" edges={["left", "right", "bottom"]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{flex: 1}}
            >
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: "space-between",
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.headerContainer}>
                        <Image
                            source={require("../../assets/images/well-done-steak-homemade-potatoes.jpg")}
                            style={styles.image}
                            resizeMode="cover"
                        />

                        <View className="absolute w-full h-full bg-black/40"/>

                        <LinearGradient
                            colors={["transparent", "#93c572"]}
                            locations={[0, 0.6, 1]}
                            style={{
                                position: "absolute",
                                bottom: -100,
                                left: 0,
                                right: 0,
                                height: 300,
                            }}
                        />

                        <TouchableOpacity
                            onPress={() => router.replace("/")}
                            className="mt-7 ms-3 self-start p-2 rounded-full"
                        >
                            <MaterialIcons name="keyboard-arrow-left" size={55} color="white"/>
                        </TouchableOpacity>

                        <View style={styles.textContainer}>
                            <Text style={styles.title}>Welcome Back</Text>
                        </View>
                    </View>

                    <View className="flex-1 px-6 pt-7 justify-between items-center">
                        <SignInForm/>

                        <TouchableOpacity className={""} onPress={() => router.push("/(auth)/SignUp")}>
                            <Text className="text-white">
                                Dont have an account? <Text className="text-yellowAccent">Sign Up</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        height: height * 0.45,
        position: "relative",
        overflow: "hidden",
    },
    image: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    gradient: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    textContainer: {
        position: "absolute",
        bottom: "40%",
        left: "50%",
        transform: [{translateX: "-50%"}, {translateY: "-40%"}],
        zIndex: 10,
        alignItems: "center",
    },
    title: {
        fontSize: 45,
        fontWeight: "600",
        color: "#fff",
    }
});
