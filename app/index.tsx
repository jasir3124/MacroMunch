// noinspection D

import {Image, Text, TouchableOpacity, View} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {useRouter} from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import {supabase} from "../lib/supabase";

import GoogleLogo from "../assets/images/Google__G__logo.svg";

WebBrowser.maybeCompleteAuthSession();

export default function Index() {
    const router = useRouter();

    async function signInWithGoogle() {
        const redirectUrl = AuthSession.makeRedirectUri({useProxy: true});

        const {data, error} = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {redirectTo: redirectUrl},
        });

        if (error) {
            console.error("Google sign in error:", error.message);
            return;
        }

        if (data?.url) {
            const result = await WebBrowser.openAuthSessionAsync(
                data.url,
                redirectUrl
            );

            if (result.type === "success" && result.url) {
                const url = new URL(result.url);
                const hash = url.hash.substring(1);
                const params = new URLSearchParams(hash);

                const access_token = params.get("access_token");
                const refresh_token = params.get("refresh_token");

                if (access_token && refresh_token) {
                    const {data: sessionData, error: sessionError} =
                        await supabase.auth.setSession({
                            access_token,
                            refresh_token,
                        });

                    if (sessionError) {
                        console.error("Session error:", sessionError.message);
                        return;
                    }

                    console.log("✅ Logged in!", sessionData.session?.user.email);
                    router.push("/home");
                }
            }
        }
    }

    return (
        <View className="flex-1 flex-col">
            <View className="h-[50%] relative">
                <Image
                    source={require("../assets/images/food-board-onboard-page-2.jpg")}
                    className="w-full h-full"
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={["transparent", "#93c572"]}
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 300,
                    }}
                />
                <View className={"z-10 absolute top-1/4 left-1/2 -translate-x-1/2"}>
                    {/*<Text*/}
                    {/*    className={"text-5xl mb-2 font-semibold text-tealAccent text-center"}>Welcome </Text>*/}
                    {/*<Text className={"text-6xl font-bold text-tealAccent text-center font-serif mb-4"}>Welcome</Text>*/}
                    {/*<Text*/}
                    {/*    className={"text-2xl font-semibold text-white text-center font-serif px-10"}>Simple,*/}
                    {/*    balanced meals built around your goals.</Text>*/}
                </View>
            </View>

            <View className="h-[50%] bg-greenSoft items-center justify-center p-4 pt-10">
                <TouchableOpacity
                    className="bg-black p-4 rounded-xl w-[90%] items-center"
                    onPress={() => router.push("/SignUp")}
                >
                    <Text className="text-white text-2xl font-semibold">
                        Sign up with email
                    </Text>
                </TouchableOpacity>

                <View className="flex-row items-center justify-center w-full my-10">
                    <View className="w-20 h-[1px] bg-white"/>
                    <Text className="mx-4 text-xl text-white">or use social sign up</Text>
                    <View className="w-20 h-[1px] bg-white"/>
                </View>

                <TouchableOpacity
                    className="bg-white p-4 mb-20 rounded-xl w-[90%] items-center flex-row justify-center gap-4"
                    onPress={signInWithGoogle}
                >
                    <GoogleLogo/>
                    <Text className="text-black text-2xl font-semibold">
                        Continue with Google
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity className={"mb-5"} onPress={() => router.push("/SignIn")}>
                    <Text className="text-white">
                        Already have an account? <Text className="text-yellowAccent">Sign In</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
