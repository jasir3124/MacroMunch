import React, {createContext, useEffect, useCallback, useContext} from "react";
import { useState } from "react";
import { supabase } from '@/lib/supabase';

type GeneratedMeal = {
    id: number;
    meal_name: string;
    is_saved: boolean;
    ingredients: string[];
    steps: string[];
    calories: number;
};

type GeneratedMealsContextType = {
    generatedMeals: GeneratedMeal[];
    didFetchMeals: boolean;
    generatingMeal: boolean;
    fetchMeals: () => Promise<void>;
    isMealGeneratingFunc: (action: true | false) => void;
};


export const GeneratedMealsContext =
    createContext<GeneratedMealsContextType | undefined>(undefined);


export const GeneratedMealsProvider = ({ children }: { children: React.ReactNode }) => {
    const [generatedMeals, setGeneratedMeals] = useState<GeneratedMeal[]>([]);
    const [didFetchMeals, setDidFetchMeals] = useState(false);
    const [generatingMeal, setGeneratingMeal] = useState(false);

    const fetchMeals = useCallback(async () => {
        setDidFetchMeals(false);

        const { data, error } = await supabase
            .from("generated_meals")
            .select("id, meal_name, is_saved, ingredients, steps, calories")
            .order("created_at", { ascending: false });

        if (!error && data) {
            setGeneratedMeals(data);
        }

        setDidFetchMeals(true);
    }, []);

    useEffect(() => {
        console.log("ran fetch meals")
        fetchMeals();
    }, []);

    function isMealGeneratingFunc(action: true | false) {
        console.log("ran isMealGeneratingFunc")
        console.log(action)
        setGeneratingMeal(action);
    }


    return (
        <GeneratedMealsContext.Provider
            value={{
                generatedMeals,
                generatingMeal,
                didFetchMeals,
                fetchMeals,
                isMealGeneratingFunc,
            }}
        >
            {children}
        </GeneratedMealsContext.Provider>
    );
};


export const useGeneratedMeals = () => {
    const context = useContext(GeneratedMealsContext);
    if (!context) {
        throw new Error("useGeneratedmeals must be used inside a GeneratedMealsProvider");
    }
    return context;
};