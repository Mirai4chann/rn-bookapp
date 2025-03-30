import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return alert('Camera roll permission denied');
    const result = await ImagePicker.launchImageLibraryAsync({ base64: true });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return alert('Camera permission denied');
    const result = await ImagePicker.launchCameraAsync({ base64: true });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const handleRegister = async () => {
    if (!email || !password || !name) {
      alert('Please fill in all required fields (email, password, name)');
      return;
    }
    console.log('Register payload:', { email, password, name, photo });
    try {
      const response = await axios.post('http://192.168.100.16:3000/auth/register', { 
        email, 
        password, 
        name, 
        photo 
      });
      console.log('Registration response:', response.data);
      alert('Registration Successful');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      alert(`Registration failed: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>
      <Text style={styles.subtitle}>Create your account to get started.</Text>
      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={20} color="#999" style={styles.icon} />
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome name="envelope" size={20} color="#999" style={styles.icon} />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={20} color="#999" style={styles.icon} />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>
      {photo && <Image source={{ uri: photo }} style={styles.image} />}
      <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
        <Text style={styles.photoButtonText}>Pick Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
        <Text style={styles.photoButtonText}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
      <Text style={styles.signInText} onPress={() => navigation.navigate('Login')}>
        Already have an account? Sign In
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#CCC', borderRadius: 5, paddingHorizontal: 10, marginVertical: 10 },
  icon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 10 },
  image: { width: 100, height: 100, marginVertical: 10, alignSelf: 'center', borderRadius: 50 },
  photoButton: { backgroundColor: '#E0E0E0', padding: 12, borderRadius: 5, marginVertical: 5, alignItems: 'center' },
  photoButtonText: { color: '#000', fontSize: 16 },
  registerButton: { backgroundColor: '#FBC4AB', padding: 15, borderRadius: 5, marginTop: 20, alignItems: 'center' },
  registerButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  signInText: { color: '#4E5D6C', fontSize: 14, textAlign: 'center', marginTop: 20 },
});