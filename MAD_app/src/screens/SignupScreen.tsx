import React, { useState } from 'react';
import { View, Text, TextInput, Alert, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    if (username.trim() === '') {
      setUsernameError('Username is required.');
      return;
    }

    if (!emailRegex.test(email)) {
      setEmailError('Invalid email address.');
      return;
    }

    if (!passwordConstraints.minLength.test(password) ||
      !passwordConstraints.uppercase.test(password) ||
      !passwordConstraints.lowercase.test(password) ||
      !passwordConstraints.number.test(password) ||
      !passwordConstraints.specialChar.test(password)) {
      setPasswordError('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://10.0.2.2:5000/api/signup', {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Account created successfully!', [
          {
            text: 'OK',
            onPress: () => {
              setTimeout(() => {
                navigation.navigate('Login');
              }, 500);
            },
          },
        ]);
      }
    } catch (error: any) {
      if (error.response) {
        setUsernameError('Username or email already exists.');
      } else {
        setUsernameError('Unable to connect to the server.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.background}>
      <View style={styles.overlay}>
        <Image source={require('../../assets/image.png')} style={styles.logo} />
        <Text style={styles.title}>Create an Account</Text>

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
          <Icon name="email" size={24} color="#888" style={styles.icon} />
          <TextInput
            style={[styles.input, emailError ? styles.inputError : null]}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#888"
          />
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

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

        <View style={styles.inputContainer}>
          <Icon name="lock" size={24} color="#888" style={styles.icon} />
          <TextInput
            style={[styles.input, confirmPasswordError ? styles.inputError : null]}
            placeholder="Confirm Password"
            value={confirmPassword}
            secureTextEntry={!showConfirmPassword}
            onChangeText={setConfirmPassword}
            placeholderTextColor="#888"
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Icon
              name={showConfirmPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color="#888"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

        {isLoading ? (
          <ActivityIndicator size="large" color="#6A1B9A" style={styles.loader} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.signupLink}>
          <Text style={styles.signupText}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  background: {
    flexGrow: 1,
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

export default SignupScreen;