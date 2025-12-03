import React, {useState} from "react";
import {View, Text, TextInput, TouchableOpacity, Modal, ActivityIndicator} from "react-native";
import {useForm, Controller} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {supabase} from "@/lib/supabase";

import Entypo from '@expo/vector-icons/Entypo';
import {Ionicons} from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';

const signUpSchema = z
    .object({
        email: z.string().email("Invalid email"),
        password: z
            .string()
            .min(6, "Password must be at least 6 characters")
            .max(30, "Password must be at most 30 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
    const {control, handleSubmit, formState: {errors, isSubmitting}} = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [resending, setResending] = useState(false);

    const [emailForResend, setEmailForResend] = useState<string | null>(null);

    const onSubmit = async (data: SignUpFormData) => {
        setFormError(null);
        try {

            // const { data: existingUser } = await supabase
            //     .from("users")
            //     .select("*")
            //     .eq("email", data.email)
            //     .maybeSingle();
            //

            const { data: existingUser, error: existingUserError } = await supabase.functions.invoke('check-email-exists', {
                body: { email: data.email }
            });


            if (existingUser) {
                if(existingUser.confirmed == false) {
                    setEmailForResend(data.email);
                    await supabase.auth.resend({
                        type: "signup",
                        email: data.email,
                        options: {emailRedirectTo: "macromunch://layout"},
                    });
                    setModalVisible(true);
                }
                setFormError("This email is already registered. Please log in instead.");
                return;
            }

            const {data: userData, error} = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {emailRedirectTo: "macromunch://layout"},
            });

            if (error) {
                setFormError(error.message);
                return;
            }

            setEmailForResend(data.email);
            setModalVisible(true);

            console.log("Signed up successfully!");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setFormError(err.message);
            } else if (typeof err === "string") {
                setFormError(err);
            } else {
                setFormError("An unexpected error occurred");
            }
        }
    };

    const resendEmail = async () => {
        if (!emailForResend) return;

        setResending(true);

        const {error} = await supabase.auth.resend({
            type: "signup",
            email: emailForResend,
            options: {emailRedirectTo: "macromunch://layout"},
        });

        if (error) {
            alert("Error resending email: " + error.message);
            console.error(error);
        } else {
            alert("Confirmation email sent again! Check your inbox.");
        }

        setResending(false);
    };

    return (
        <View className="w-4/5 gap-7">
            {formError && <Text className="text-red-500 text-center mb-2 text-lg">{formError}</Text>}
            <Controller
                control={control}
                name="email"
                render={({field: {onChange, onBlur, value}}) => (
                    <View>
                        <View className="flex-row items-center bg-white px-4 h-16 rounded-xl border border-gray-300">
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
                        {errors.email && <Text className="text-red-500 mt-1 ml-1">{errors.email.message}</Text>}
                    </View>
                )}
            />

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
                                <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#555"/>
                            </TouchableOpacity>
                        </View>
                        {errors.password && <Text className="text-red-500 mt-1 ml-1">{errors.password.message}</Text>}
                    </View>
                )}
            />

            <Controller
                control={control}
                name="confirmPassword"
                render={({field: {onChange, onBlur, value}}) => (
                    <View>
                        <View
                            className="flex-row items-center bg-white h-16 px-4 rounded-xl border border-gray-300 relative">
                            <AntDesign name="lock" size={22} color="gray"/>
                            <TextInput
                                placeholder="Confirm Password"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                                className="flex-1 ml-3 text-md text-black"
                                placeholderTextColor="#9ca3af"
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={22} color="#555"/>
                            </TouchableOpacity>
                        </View>
                        {errors.confirmPassword &&
                            <Text className="text-red-500 mt-1 ml-1">{errors.confirmPassword.message}</Text>}
                    </View>
                )}
            />

            <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="bg-tealAccent py-3 rounded-lg items-center w-full self-center"
            >
                <Text className="text-white font-semibold text-lg">{isSubmitting ? "Signing up..." : "Sign Up"}</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="fade">
                <View className="flex-1 justify-center items-center bg-black/40 px-6">
                    <View className="bg-white p-6 rounded-xl w-full max-w-xs">
                        <Text className="text-lg font-bold mb-4 text-center">Confirm Your Email</Text>
                        <Text className="text-center text-gray-700 mb-6">
                            A confirmation email has been sent to {emailForResend}.{"\n"}Please check your inbox and
                            click the link to verify your account.
                        </Text>

                        <TouchableOpacity
                            onPress={resendEmail}
                            disabled={resending}
                            className="bg-gray-200 py-3 rounded-lg mb-3"
                        >
                            {resending ? (
                                <ActivityIndicator color="#555"/>
                            ) : (
                                <Text className="text-center text-gray-900 font-medium">Resend Confirmation Email</Text>
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
