import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { useAuth } from '../App';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    console.log('Attempting login with:', { email, password });
    try {
      const response = await axios.post('http://192.168.100.16:3000/auth/login', { email, password });
      console.log('Login response:', response.data);
      await login(response.data.userId, response.data.isAdmin, response.data.token);
      alert(response.data.isAdmin ? 'Admin Login Successful' : 'User Login Successful');
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      alert('Login failed: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, marginVertical: 10, padding: 5 },
});