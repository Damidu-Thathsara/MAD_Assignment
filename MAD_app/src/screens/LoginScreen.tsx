import React, { useState } from 'react';
import { View, Text, TextInput, ImageBackground, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../store'; // Import your Redux action
import axios from 'axios';

const LoginScreen = ({ navigation }: any) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleLogin = async () => {
        setUsernameError('');
        setPasswordError('');

        if (username.trim() === '') {
            setUsernameError('Username is required.');
        }

        if (password.trim() === '') {
            setPasswordError('Password is required.');
        }

        if (usernameError || passwordError) return;

        setLoading(true);

        try {
            const response = await axios.post('http://10.0.2.2:5000/api/login', {
                username,
                password,
            });

            if (response.status === 200) {
                const { token } = response.data;
                dispatch(login({ username, token }));
                Alert.alert('Success', 'Logged in successfully!', [
                    {
                        text: 'OK',
                        onPress: () => {
                            setTimeout(() => {
                                navigation.navigate('Home'); // Navigate to HomeScreen after 2 seconds
                            }, 500);
                        },
                    },
                ]);
            }
        } catch (error: any) {
            if (error.response) {
                setPasswordError('Invalid username or password.');
            } else {
                setPasswordError('Unable to connect to the server.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome</Text>

            <TextInput
                style={[styles.input, usernameError ? styles.inputError : null]}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                placeholderTextColor="#888"
            />
            {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

            <TextInput
                style={[styles.input, usernameError ? styles.inputError : null]}
                placeholder="Password"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
                placeholderTextColor="#888"
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            {loading ? (
                <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
            ) : (
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.signupLink}>
                <Text style={styles.signupText}>Don't have an account? Sign up</Text>
            </TouchableOpacity>
        </View>

    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f4f4f4',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 15,
        marginBottom: 15,
        borderRadius: 25,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    loader: {
        marginVertical: 20,
    },
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        borderRadius: 25,
        marginBottom: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    inputError: {
        borderColor: 'red',
    },
    errorText: {
        color: '#D32F2F',          // Darker red for better contrast and visibility
        fontSize: 16,              // Increased font size for better readability
        fontWeight: '500',         // Medium weight for clarity
        marginBottom: 8,          // Increase space below error
        flexDirection: 'row',      // To accommodate an error icon with text
        alignItems: 'center',      // Vertically center the icon with the text
        paddingHorizontal: 10,     // Horizontal padding
    },
    signupLink: {
        alignItems: 'center',
    },
    signupText: {
        color: '#007BFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
