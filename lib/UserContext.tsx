// lib/UserContext.tsx
// noinspection D

import {createContext, useContext, useState, useEffect, ReactNode, useRef} from "react";
import {supabase} from "@/lib/supabase";
import {router} from "expo-router";

type User = {
    id: string;
    email: string;
    [key: string]: any;
};

type UserContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
    userLoading: boolean;
    refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({children}: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userLoading, setUserLoading] = useState(true);
    const initialNavigationDone = useRef(false);

    const fetchUser = async (userId: string): Promise<User | null> => {
        try {
            const {data, error} = await supabase
                .from("users")
                .select("*")
                .eq("id", userId)
                .single();

            if (error) {
                console.error("Error fetching user:", error.message);
                return null;
            }

            const {
                data: userPlan,
                error: planError
            } = await supabase
                .from("subscriptions")
                .select("plan_id, status, expires_at")
                .eq("user_id", userId)
                .single();

            if (planError) {
                console.error("Error fetching user plan:", planError.message);
                return null;
            }

            data.planTier = userPlan;

            return data;
        } catch (err) {
            console.error("Unexpected error fetching user:", err);
            return null;
        }
    };

    const refreshUser = async () => {
        const {data: {session}} = await supabase.auth.getSession();
        if (session?.user) {
            const userData = await fetchUser(session.user.id);
            setUser(userData);
        }
    };

    useEffect(() => {
        const init = async () => {
            try {
                const {data: {session}, error} = await supabase.auth.getSession();

                if (error) {
                    console.error("Session error:", error.message);
                    setUserLoading(false);
                    return;
                }

                if(!session?.user){
                    if (!initialNavigationDone.current) {
                        initialNavigationDone.current = true;
                    }
                }

                // @ts-ignore
                const userData = await fetchUser(session.user.id);
                setUser(userData);

                if (!initialNavigationDone.current && userData) {
                    initialNavigationDone.current = true;
                    router.replace("/(main)/home");
                }
            } catch (err) {
                console.error("Init error:", err);
            } finally {
                setUserLoading(false);
            }
        };

        init();

        // Listen for auth state changes
        const {data: {subscription}} = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log("Auth event:", event);

                if (event === "SIGNED_IN" && session?.user) {
                    const userData = await fetchUser(session.user.id);
                    setUser(userData);

                    // Navigate to home after sign in
                    if (userData) {
                        router.replace("/(main)/home");
                    }
                }

                if (event === "SIGNED_OUT") {
                    setUser(null);
                    router.replace("/");
                }

                // Handle token refresh silently
                if (event === "TOKEN_REFRESHED") {
                    await refreshUser();
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{user, setUser, userLoading, refreshUser}}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used inside a UserProvider");
    }
    return context;
};