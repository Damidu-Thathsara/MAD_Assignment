import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface Championship {
    id: number;
    name: string;
    country: string;
    league: string;
}

const CACHE_KEY = 'championships_cache';

const HomeScreen = ({ navigation }: { navigation: any }) => {
    const [championships, setChampionships] = useState<Championship[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChampionships = async () => {
            try {
                // Check for cached data
                const cachedData = await AsyncStorage.getItem(CACHE_KEY);
                const cachedTimestamp = await AsyncStorage.getItem(`${CACHE_KEY}_timestamp`);
                const currentTime = Date.now();

                // Use cached data if it's less than 24 hours old
                if (cachedData && cachedTimestamp && currentTime - parseInt(cachedTimestamp, 10) < 24 * 60 * 60 * 1000) {
                    setChampionships(JSON.parse(cachedData));
                } else {
                    // Fetch new data from API
                    const options = {
                        method: 'GET',
                        url: 'https://soccer-football-info.p.rapidapi.com/championships/list/',
                        params: {
                            p: '1',
                            c: 'all',
                            l: 'en_US',
                        },
                        headers: {
                            'x-rapidapi-key': 'bd5219687cmsh6f3bf1e2bdc7d5cp108e6cjsn36e9d81f7d78',
                            'x-rapidapi-host': 'soccer-football-info.p.rapidapi.com',
                        },
                    };

                    const response = await axios.request(options);
                    const result = response.data.result;

                    // Cache the data
                    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(result));
                    await AsyncStorage.setItem(`${CACHE_KEY}_timestamp`, currentTime.toString());

                    setChampionships(result);
                }
            } catch (error) {
                console.error('Error fetching championships:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChampionships();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (championships.length === 0) {
        return <Text>No championships found</Text>;
    }

    return (
        <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Championships List</Text>
            <FlatList
                data={championships}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Details', { championship: item })}
                    >
                        <View style={{ marginBottom: 10 }}>
                            <Text style={{ fontSize: 16 }}>{item.name}</Text>
                            <Text>Country: {item.country}</Text>
                            <Text>League: {item.league}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default HomeScreen;
