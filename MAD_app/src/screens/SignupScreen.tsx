import React, { useState } from 'react';
import { View, Text, TextInput, Alert, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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
    // Reset error states
    setUsernameError('');
    setEmailError('');
    setPasswordError('');

    let hasError = false;

    // Basic validation
    if (!username.trim()) {
      setUsernameError('Username is required.');
      hasError = true;
    }

    if (!email.trim()) {
      setEmailError('Email is required.');
      hasError = true;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError('Password is required.');
      hasError = true;
    }

    if (!confirmPassword.trim()) {
      setPasswordError('Confirm password is required.');
      hasError = true;
    }

    // Password match check
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match!');
      hasError = true;
    }

    // Password strength validation
    if (!passwordConstraints.minLength.test(password)) {
      setPasswordError('Password must be at least 8 characters long.');
      hasError = true;
    } else if (!passwordConstraints.uppercase.test(password)) {
      setPasswordError('Password must contain at least one uppercase letter.');
      hasError = true;
    } else if (!passwordConstraints.lowercase.test(password)) {
      setPasswordError('Password must contain at least one lowercase letter.');
      hasError = true;
    } else if (!passwordConstraints.number.test(password)) {
      setPasswordError('Password must contain at least one number.');
      hasError = true;
    } else if (!passwordConstraints.specialChar.test(password)) {
      setPasswordError('Password must contain at least one special character.');
      hasError = true;
    }

    if (hasError) {
      return; // Stop further execution if there are errors
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
    color: '#D32F2F',          // Darker red for better contrast and visibility
    fontSize: 16,              // Increased font size for better readability
    fontWeight: '500',         // Medium weight for clarity
    marginBottom: 8,          // Increase space below error
    flexDirection: 'row',      // To accommodate an error icon with text
    alignItems: 'center',      // Vertically center the icon with the text
    paddingHorizontal: 10,     // Horizontal padding
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
