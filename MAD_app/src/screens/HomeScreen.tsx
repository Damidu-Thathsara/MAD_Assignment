import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';

interface TeamData {
    team: {
        id: number;
        name: string;
        country: string;
    };
    league: {
        name: string;
    };
}

const HomeScreen = () => {
    const [teamData, setTeamData] = useState<TeamData | null>(null);
    const [loading, setLoading] = useState(true);
    const teamId = 33; // Replace with the team ID you want to fetch

    useEffect(() => {
        // Fetch the team data when the component mounts
        fetch(`https://v3.football.api-sports.io/teams?id=${teamId}`, {
            method: "GET",
            headers: {
                "x-rapidapi-host": "v3.football.api-sports.io",
                "x-rapidapi-key": "050501f76fmsh86145b66a61651bp17e589jsndfd02c894719", // Replace with your API key
            }
        })
        .then((response) => response.json())
        .then((data) => {
            setTeamData(data.response[0]); // Assuming the team data is in the response array
            setLoading(false);
        })
        .catch((err) => {
            console.error("Error fetching team data: ", err);
            setLoading(false);
        });
    }, [teamId]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!teamData) {
        return <Text>No team data found</Text>;
    }

    return (
        <View>
            <Text>{teamData.team.name}</Text>
            <Image
                source={{ uri: `https://media.api-sports.io/football/teams/${teamData.team.id}.png` }}
                style={{ width: 100, height: 100 }}
            />
            <Text>{teamData.league.name}</Text>
            <Text>{teamData.team.country}</Text>
        </View>
    );
};

export default HomeScreen;
