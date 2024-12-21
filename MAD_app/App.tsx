import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Button, Text, View, StyleSheet } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './src/store'; // Make sure this path is correct
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import SignupScreen from './src/screens/SignupScreen';
import { logout } from './src/store';

const Stack = createStackNavigator();

// Logout button component
function LogoutButton() {
  const dispatch = useDispatch();

  return (
    <Button
      // Add onPress event handler to dispatch the logout action THEN navigate to the Login screen
      onPress={() => {
        dispatch(logout());
      }
      }
      title="Logout"
      color="#f44336"
    />
  );
}

// Welcome message component
function WelcomeMessage() {
  const username = useSelector((state: { user: { username: string } }) => state.user.username);

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
            headerTitle: '',
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} options={{
          }} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerLeft: () => <WelcomeMessage />, // Welcome message
              headerRight: () => <LogoutButton />, // Logout button
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
  },
  welcomeText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default App;
