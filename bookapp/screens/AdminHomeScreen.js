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
      <Button title="Logout" onPress={() => dispatch(logout())} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' , backgroundColor: '#f8c6a7' },
  title: { fontSize: 24, marginBottom: 20, color: '#fff' },
  text: { fontSize: 16, marginVertical: 10, textAlign: 'center',  color: '#fff' },
});