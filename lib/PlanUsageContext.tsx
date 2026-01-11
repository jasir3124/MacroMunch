import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";

type GenerationLimitState = {
    reached: boolean;
    alertShown: boolean;
    date: string | null; // YYYY-MM-DD
};

type UsageContextType = {
    generationLimit: GenerationLimitState;
    markGenerationLimitReached: () => Promise<void>;
    clearGenerationLimit: () => Promise<void>;
    refreshGenerationLimit: () => Promise<void>;
};

const UsageContext = createContext<UsageContextType | undefined>(undefined);

const STORAGE_KEY = "generation-limit-reached";

const today = () => new Date().toISOString().slice(0, 10);

export const UsageProvider = ({ children }: { children: ReactNode }) => {
    const [generationLimit, setGenerationLimit] =
        useState<GenerationLimitState>({
            reached: false,
            alertShown: false,
            date: null,
        });

    /**
     * Load from AsyncStorage and validate date
     */
    const refreshGenerationLimit = async () => {
        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEY);
            if (!raw) {
                setGenerationLimit({ reached: false, alertShown: false, date: null });
                return;
            }

            const parsed: GenerationLimitState = JSON.parse(raw);

            if (parsed.date !== today()) {
                await AsyncStorage.removeItem(STORAGE_KEY);
                setGenerationLimit({ reached: false, alertShown: false, date: null });
                return;
            }

            setGenerationLimit(parsed);
        } catch {
            setGenerationLimit({ reached: false, alertShown: false, date: null });
        }
    };

    /**
     * Mark limit reached (called when API returns 429 / 403)
     */
    const markGenerationLimitReached = async () => {
        const value: GenerationLimitState = {
            reached: true,
            alertShown: false,
            date: today(),
        };

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
        setGenerationLimit(value);
    };

    /**
     * Clear manually (logout, midnight, plan upgrade, etc.)
     */
    const clearGenerationLimit = async () => {
        await AsyncStorage.removeItem(STORAGE_KEY);
        setGenerationLimit({ reached: false, alertShown: false, date: null });
    };

    /**
     * Initial load
     */
    useEffect(() => {
        refreshGenerationLimit();
    }, []);

    /**
     * Re-check when app comes to foreground
     */
    useEffect(() => {
        const sub = AppState.addEventListener("change", (state) => {
            if (state === "active") {
                refreshGenerationLimit();
            }
        });

        return () => sub.remove();
    }, []);

    /**
     * Safety net: auto-clear after midnight if app stays open
     */
    useEffect(() => {
        if (!generationLimit.date) return;

        const interval = setInterval(() => {
            if (generationLimit.date !== today()) {
                clearGenerationLimit();
            }
        }, 60_000); // once per minute

        return () => clearInterval(interval);
    }, [generationLimit.date]);

    return (
        <UsageContext.Provider
            value={{
        generationLimit,
            markGenerationLimitReached,
            clearGenerationLimit,
            refreshGenerationLimit,
    }}
>
    {children}
    </UsageContext.Provider>
);
};

export const useUsage = () => {
    const ctx = useContext(UsageContext);
    if (!ctx) {
        throw new Error("useUsage must be used inside UsageProvider");
    }
    return ctx;
};
