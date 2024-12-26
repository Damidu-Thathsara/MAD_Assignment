import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Button, Text, View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './src/store'; // Make sure this path is correct
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import SignupScreen from './src/screens/SignupScreen';
import { logout } from './src/store';
import { RootState } from './src/store';

const Stack = createStackNavigator();

// Logout button component
function LogoutButton() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            dispatch(logout());
            navigation.navigate('Login' as never);
          },
        },
      ],
    );
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogout}>
      <Text style={styles.text}>Logout</Text>
    </TouchableOpacity>
  );
}


// Welcome message component
function WelcomeMessage() {
  const username = useSelector((state: RootState) => state.user.username);
  console.log('Current username:', username); // Debug line

  return (
    <View style={styles.welcomeContainer}>
      <Text style={styles.welcomeText}>Welcome, {username}!</Text>
    </View>
  );
}

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#6A1B9A',
            },
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} options={{
            headerLeft: () => null,
            headerTitle: "",
          }} />
          <Stack.Screen name="Signup" component={SignupScreen} options={{
            headerLeft: () => null,
            headerTitle: "",
          }} />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerLeft: () => <WelcomeMessage />, // Welcome message
              headerRight: () => <LogoutButton />, // Logout button
              headerTitle: "",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

// Styles
const styles = StyleSheet.create({
  welcomeContainer: {
    marginLeft: 20,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  welcomeText: {
    color: '#E1BEE7',
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#E1BEE7',
    width: "50%",
    height: "80%",
    padding: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  text: {
    color: '#6A1B9A',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default App;
