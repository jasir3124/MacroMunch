import React, {useState} from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Modal
} from "react-native";
import {useForm, Controller} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {supabase} from "../../lib/supabase";
import Entypo from "@expo/vector-icons/Entypo";
import {Ionicons} from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import {router} from "expo-router";

// Validation schema
const signInSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(30, "Password must be at most 30 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInForm() {
    const {
        control,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
    });

    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [emailForResend, setEmailForResend] = useState<string | null>(null);
    const [resending, setResending] = useState(false);

    const onSubmit = async (data: SignInFormData) => {
        setFormError(null);
        try {
            const {error} = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (error) {
                if (error.message.includes("Email not confirmed")) {
                    setEmailForResend(data.email);
                    setModalVisible(true);

                    await supabase.auth.resend({
                        type: "signup",
                        email: data.email,
                        options: {
                            emailRedirectTo: "macromunch://layout",
                        },
                    });

                    return;
                }

                setFormError(error.message);
                return;
            }

            console.log("✅ Signed in successfully!");
            router.replace("/(main)/home"); // redirect where you want
        } catch (err) {
            console.error(err);
            setFormError("Something went wrong. Try again later.");
        }
    };

    const resendEmail = async () => {
        if (!emailForResend) return;
        setResending(true);
        const {error} = await supabase.auth.resend({
            type: "signup",
            email: emailForResend,
            options: {
                emailRedirectTo: "macromunch://layout",
            },
        });
        if (error) {
            setFormError(error.message);
        } else {
            alert("A new confirmation email has been sent!");
        }
        setResending(false);
    };

    return (
        <View className="w-4/5 gap-7">
            {formError && (
                <Text className="text-red-500 text-center mb-2 text-lg">
                    {formError}
                </Text>
            )}

            {/* EMAIL FIELD */}
            <Controller
                control={control}
                name="email"
                render={({field: {onChange, onBlur, value}}) => (
                    <View>
                        <View
                            className="flex-row items-center bg-white px-4 h-16 rounded-xl border border-gray-300">
                            <Entypo name="email" size={20} color="gray"/>
                            <TextInput
                                placeholder="Email"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                className="flex-1 ml-3 text-md text-black"
                                placeholderTextColor="#9ca3af"
                            />
                        </View>

                        {errors.email && (
                            <Text className="text-red-500 mt-1 ml-1">
                                {errors.email.message}
                            </Text>
                        )}
                    </View>
                )}
            />

            {/* PASSWORD FIELD */}
            <Controller
                control={control}
                name="password"
                render={({field: {onChange, onBlur, value}}) => (
                    <View>
                        <View
                            className="flex-row items-center bg-white h-16 px-4 rounded-xl border border-gray-300 relative">
                            <AntDesign name="lock" size={22} color="gray"/>
                            <TextInput
                                placeholder="Password"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                className="flex-1 ml-3 text-md text-black"
                                placeholderTextColor="#9ca3af"
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                    name={showPassword ? "eye-off" : "eye"}
                                    size={22}
                                    color="#555"
                                />
                            </TouchableOpacity>
                        </View>

                        {errors.password && (
                            <Text className="text-red-500 mt-1 ml-1">
                                {errors.password.message}
                            </Text>
                        )}
                    </View>
                )}
            />

            {/* SIGN IN BUTTON */}
            <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="bg-tealAccent py-3 rounded-lg items-center w-full self-center"
            >
                {isSubmitting ? (
                    <ActivityIndicator color="white"/>
                ) : (
                    <Text className="text-white font-semibold text-lg">Sign In</Text>
                )}
            </TouchableOpacity>

            {/* FORGOT PASSWORD LINK */}
            <TouchableOpacity
                className="mt-4 self-center"
                onPress={() => router.push("/(auth)/ForgotPassword")}
            >
                <Text className="text-blueGray font-semibold">Forgot your password?</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="fade">
                <View className="flex-1 justify-center items-center bg-black/40 px-6">
                    <View className="bg-white p-6 rounded-xl w-full max-w-xs">
                        <Text className="text-lg font-bold mb-4 text-center">
                            Confirm Your Email
                        </Text>
                        <Text className="text-center text-gray-700 mb-6">
                            A confirmation email has been sent to{" "}
                            <Text className="font-semibold">{emailForResend}</Text>.{"\n"}Please
                            check your inbox and click the link to verify your account.
                        </Text>

                        <TouchableOpacity
                            onPress={resendEmail}
                            disabled={resending}
                            className="bg-gray-200 py-3 rounded-lg mb-3"
                        >
                            {resending ? (
                                <ActivityIndicator color="#555"/>
                            ) : (
                                <Text className="text-center text-gray-900 font-medium">
                                    Resend Confirmation Email
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            className="bg-tealAccent py-3 rounded-lg"
                        >
                            <Text className="text-center text-white font-semibold">OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
