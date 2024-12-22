import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../store'; 
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LoginScreen = ({ navigation }: any) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();

    const handleLogin = async () => {
        setUsernameError('');
        setPasswordError('');

        if (username.trim() === '') {
            setUsernameError('Username is required.');
            return;
        }

        if (password.trim() === '') {
            setPasswordError('Password is required.');
            return;
        }

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
                                navigation.navigate('Home');
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
        <View style={styles.background}>
            <View style={styles.overlay}>
                <Image source={require('../../assets/image.png')} style={styles.logo} />
                <Text style={styles.title}>Welcome!</Text>

                <View style={styles.inputContainer}>
                    <Icon name="person" size={24} color="#888" style={styles.icon} />
                    <TextInput
                        style={[styles.input, usernameError ? styles.inputError : null]}
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                        placeholderTextColor="#888"
                    />
                </View>
                {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

                <View style={styles.inputContainer}>
                    <Icon name="lock" size={24} color="#888" style={styles.icon} />
                    <TextInput
                        style={[styles.input, passwordError ? styles.inputError : null]}
                        placeholder="Password"
                        value={password}
                        secureTextEntry={!showPassword}
                        onChangeText={setPassword}
                        placeholderTextColor="#888"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Icon
                            name={showPassword ? 'visibility' : 'visibility-off'}
                            size={24}
                            color="#888"
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                </View>
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                {loading ? (
                    <ActivityIndicator size="large" color="#6A1B9A" style={styles.loader} />
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.signupLink}>
                    <Text style={styles.signupText}>Don't have an account? Sign up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#E1BEE7',
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
        color: '#4A148C',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 25,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        marginBottom: 15,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        paddingHorizontal: 10,
    },
    icon: {
        marginRight: 10,
    },
    loader: {
        marginVertical: 20,
    },
    button: {
        backgroundColor: '#6A1B9A',
        paddingVertical: 12,
        borderRadius: 25,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
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
        color: '#D32F2F',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    signupLink: {
        alignItems: 'center',
    },
    signupText: {
        color: '#6A1B9A',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
