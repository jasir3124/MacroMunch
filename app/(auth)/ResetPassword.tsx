import React, {useState} from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import {supabase} from "../../lib/supabase";
import {router} from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleUpdatePassword = async () => {
        if (!password.trim() || !confirmPassword.trim()) {
            setMessage("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setMessage("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        setMessage(null);

        // Update the password
        const {error} = await supabase.auth.updateUser({
            password: password,
        });

        if (error) {
            setMessage(error.message);
            setLoading(false);
        } else {
            setMessage("Password updated successfully! Redirecting...");

            setTimeout(() => {
                router.replace("/(auth)/SignIn");
            }, 2000);
        }

        setLoading(false);
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <Text className="text-4xl font-semibold text-blueGray self-center mt-7">
                MacroMunch
            </Text>
            <View className="px-6 flex-1 justify-center">
                <Text className="text-3xl font-bold text-greenSoft mb-4 text-center">
                    Reset Password
                </Text>
                <Text className="text-gray-600 text-center mb-8">
                    Enter your new password below.
                </Text>

                <View className="mb-4">
                    <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3">
                        <TextInput
                            placeholder="New password"
                            placeholderTextColor="#9ca3af"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            className="flex-1 text-base text-black"
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <MaterialIcons
                                name={showPassword ? "visibility" : "visibility-off"}
                                size={24}
                                color="#9ca3af"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="mb-6">
                    <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3">
                        <TextInput
                            placeholder="Confirm new password"
                            placeholderTextColor="#9ca3af"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                            className="flex-1 text-base text-black"
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <MaterialIcons
                                name={showConfirmPassword ? "visibility" : "visibility-off"}
                                size={24}
                                color="#9ca3af"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    disabled={loading}
                    onPress={handleUpdatePassword}
                    className={`w-full py-3 rounded-xl ${
                        loading ? "bg-gray-400" : "bg-greenSoft"
                    } items-center`}
                >
                    {loading ? (
                        <ActivityIndicator color="white"/>
                    ) : (
                        <Text className="text-white font-semibold text-lg">
                            Update Password
                        </Text>
                    )}
                </TouchableOpacity>

                {message && (
                    <Text className={`text-center mt-4 ${
                        message.includes("successfully") ? "text-green-600" : "text-red-500"
                    }`}>
                        {message}
                    </Text>
                )}
            </View>

        </SafeAreaView>
    );
}