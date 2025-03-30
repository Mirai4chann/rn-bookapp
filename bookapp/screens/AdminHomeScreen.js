import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/auth';

export default function AdminHomeScreen() {
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.text}>Welcome to your admin dashboard!</Text>
      <Text style={styles.text}>Use the tabs below to manage books, users, or update your profile.</Text>
      <Button title="Logout" onPress={() => dispatch(logout())} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  text: { fontSize: 16, marginVertical: 10, textAlign: 'center' },
});