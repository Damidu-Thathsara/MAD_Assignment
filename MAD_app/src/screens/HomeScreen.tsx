import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout, RootState } from '../store';
import { BalldontlieAPI } from "@balldontlie/sdk";

interface Team {
    id: number;
    conference: string;
    division: string;
    city: string;
    name: string;
    full_name: string;
    abbreviation: string;
}

const teamBackgrounds: { [key: string]: string } = {
    "Atlanta Hawks": "https://i.pinimg.com/originals/16/1a/27/161a270558f44eccb65a5c7b56f1cda7.jpg",
    "Boston Celtics": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiR6JO8FNgfVLSdmPDPjr0LRq_R_IXa3soduB9R3UC4GHXLKZre6cb4_BoOGrkLuRvTbU&usqp=CAU",
    "Brooklyn Nets": "https://1000logos.net/wp-content/uploads/2018/05/Brooklyn-Nets-Logo.png",
    "Charlotte Hornets": "https://c4.wallpaperflare.com/wallpaper/1001/215/682/charlotte-hornets-nba-sports-basketball-wallpaper-preview.jpg",
    "Chicago Bulls": "https://wallpapers.com/images/featured/chicago-bulls-u40a79pcvprb4rrg.jpg",
    "Cleveland Cavaliers": "https://images5.alphacoders.com/971/971232.jpg",
    "Dallas Mavericks": "https://1000logos.net/wp-content/uploads/2018/06/Dallas-Mavericks-Logo.png",
    "Denver Nuggets": "https://i.pinimg.com/originals/d0/8d/de/d08ddecd2c8fa972378186ad78c48f51.png",
};

const HomeScreen = ({ navigation }: { navigation: any }) => {
    const dispatch = useDispatch();
    const username = useSelector((state: RootState) => state.user.username);
    const [loading, setLoading] = useState(true);
    const [teams, setTeams] = useState<Team[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [clickCount, setClickCount] = useState(0);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const api = new BalldontlieAPI({ apiKey: "95105a44-4758-4f0e-a636-7a0efc720b03" });
                const response = await api.nba.getTeams();
                setTeams(response.data.slice(0, 8));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching teams:", error);
                setError("Failed to load teams.");
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    if (loading) {
        return (
            <View style={styles.centeredContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading teams...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centeredContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (teams.length === 0) {
        return (
            <View style={styles.centeredContainer}>
                <Text style={styles.noDataText}>No teams found</Text>
            </View>
        );
    }

    const handleCardClick = () => {
        setClickCount(clickCount + 1);
    };


    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.usernameText}>Hello, {username}!</Text>
                
            </View>

            <Text style={styles.headerText}>NBA Teams</Text>
            <FlatList
                data={teams}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={handleCardClick}
                    >
                        <ImageBackground
                            source={{ uri: teamBackgrounds[item.full_name] || "https://via.placeholder.com/150" }}
                            resizeMode="cover"
                            style={styles.imageBackground}
                            imageStyle={{ borderRadius: 15 }}
                        >
                            <View style={styles.overlay}>
                                <Text style={styles.teamName}>{item.full_name}</Text>
                                <Text style={styles.teamDetails}>City: {item.city}</Text>
                                <Text style={styles.teamDetails}>Conference: {item.conference}</Text>
                                <Text style={styles.teamDetails}>Division: {item.division}</Text>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                )}
            />
            <View style={styles.floatingButtonContainer}>
                <Text style={styles.floatingButtonText}>{clickCount} item clicks</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    usernameText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    logoutButton: {
        backgroundColor: '#FF3B30',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
    noDataText: {
        fontSize: 18,
        color: '#666',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 0,
        marginBottom: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        overflow: 'hidden',
        height: 250,
    },
    imageBackground: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
    },
    teamName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    teamDetails: {
        fontSize: 16,
        color: '#ddd',
    },
    floatingButtonContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    floatingButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default HomeScreen;

