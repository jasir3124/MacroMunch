// noinspection D

// lib/DeepLinkHandler.ts
import { useEffect } from "react";
import { Linking } from "react-native";
import { supabase } from "@/lib/supabase";

export function DeepLinkHandler() {
    useEffect(() => {
        const handleLink = async (url: string | null) => {
            if (!url) return;

            try {
                // Handle deep link authentication
                if (url.includes("macromunch://")) {
                    console.log("Processing deep link:", url);

                    const { data, error } = await supabase.auth.exchangeCodeForSession(url);

                    if (error) {
                        console.error("Deep link auth error:", error.message);
                        return;
                    }

                    if (data?.session) {
                        console.log("✅ Successfully authenticated via deep link");
                        // UserContext will handle navigation via onAuthStateChange
                    }
                }
            } catch (err) {
                console.error("Deep link handling error:", err);
            }
        };

        // Listen for incoming links while app is open
        const linkingSub = Linking.addEventListener("url", (event) =>
            handleLink(event.url)
        );

        // Check if app was opened with a link
        (async () => {
            const initialUrl = await Linking.getInitialURL();
            await handleLink(initialUrl);
        })();

        return () => linkingSub.remove();
    }, []);

    return null; // This is a hook component, doesn't render anything
}