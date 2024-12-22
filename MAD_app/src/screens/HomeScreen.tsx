import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Animated,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {  RootState } from '../store';
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
    const scaleAnimation = useState(new Animated.Value(1))[0];

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

    const animateButton = () => {
        Animated.sequence([
            Animated.timing(scaleAnimation, {
                toValue: 1.8,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnimation, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleCardClick = () => {
        setClickCount(clickCount + 1);
        animateButton();
    };

    if (loading) {
        return (
            <View style={styles.centeredContainer}>
                <ActivityIndicator size="large" color="#6A1B9A" />
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

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>DunkView</Text>
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
            <Animated.View style={[styles.floatingButtonContainer, { transform: [{ scale: scaleAnimation }] }]}>
                <Text style={styles.floatingButtonText}>{clickCount}</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#E1BEE7',
        height: '100%',
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#4A148C',
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
        color: '#4A148C',
    },
    errorText: {
        fontSize: 18,
        color: '#E53935',
    },
    noDataText: {
        fontSize: 18,
        color: '#616161',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
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
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: 10,
    },
    teamName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 5,
    },
    teamDetails: {
        fontSize: 16,
        color: '#E0E0E0',
    },
    floatingButtonContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#6A1B9A',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    floatingButtonText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default HomeScreen;
