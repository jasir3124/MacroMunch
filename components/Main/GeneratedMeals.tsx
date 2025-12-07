import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import GeneratedMeals from './GeneratedMeals';

export default function MealsScreen() {
    const [userMealsData, setUserMealsData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMeals = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('generated_meals')
            .select('id, meal_name')
            .order('created_at', { ascending: false });

        if (!error && data) {
            // @ts-ignore
            setUserMealsData(data);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchMeals();
    }, [])

    console.log(userMealsData);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <FlatList
                data={userMealsData}
                // @ts-ignore
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    // @ts-ignore
                    <Text>{item.meal_name}</Text>
                )}
                ListEmptyComponent={<Text>No meals found</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
});