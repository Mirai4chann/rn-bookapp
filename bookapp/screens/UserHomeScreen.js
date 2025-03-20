import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { useAuth } from '../App';

export default function UserHomeScreen() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      await axios.post('http://192.168.100.16:3000/auth/logout', { userId });
      await logout();
    } catch (error) {
      alert('Logout failed: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Home Screen</Text>
      <Text style={styles.text}>Welcome to your user dashboard!</Text>
      <Text style={styles.text}>Use the tabs below to update your profile.</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  text: { fontSize: 16, marginVertical: 10, textAlign: 'center' },
});