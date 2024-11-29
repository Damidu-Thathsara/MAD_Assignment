import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const HomeScreen = ({ route }: any) => {
  const { username } = useSelector((state: RootState) => state.user);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {username}!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
