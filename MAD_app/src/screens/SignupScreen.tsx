import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';

// Regex patterns for password and email validation
const passwordConstraints = {
  minLength: /.{8,}/,
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /\d/,
  specialChar: /[!@#$%^&*(),.?":{}|<>]/,
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignupScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    // Reset errors
    setUsernameError('');
    setEmailError('');
    setPasswordError('');

    // Basic validation
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    // Username validation
    if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters long.');
      return;
    }

    // Email validation
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    // Password match check
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }

    // Password strength validation
    if (!passwordConstraints.minLength.test(password)) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    } else if (!passwordConstraints.uppercase.test(password)) {
      setPasswordError('Password must contain at least one uppercase letter.');
      return;
    } else if (!passwordConstraints.lowercase.test(password)) {
      setPasswordError('Password must contain at least one lowercase letter.');
      return;
    } else if (!passwordConstraints.number.test(password)) {
      setPasswordError('Password must contain at least one number.');
      return;
    } else if (!passwordConstraints.specialChar.test(password)) {
      setPasswordError('Password must contain at least one special character.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://10.0.2.2:5000/api/signup', {
        username,
        email,
        password,
      });

      Alert.alert('Success', response.data.message);
      navigation.navigate('Login');

    } catch (error: any) {
      if (error.response) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'Unable to connect to the server.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create an Account</Text>

      <TextInput
        style={[styles.input, usernameError ? styles.inputError : null]}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      {usernameError && <Text style={styles.error}>{usernameError}</Text>}

      <TextInput
        style={[styles.input, emailError ? styles.inputError : null]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      {emailError && <Text style={styles.error}>{emailError}</Text>}

      <TextInput
        style={[styles.input, passwordError ? styles.inputError : null]}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {passwordError && <Text style={styles.error}>{passwordError}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.loadingIndicator} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
  },
  footerText: {
    fontSize: 16,
    color: '#333',
  },
  link: {
    color: '#007BFF',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default SignupScreen;
