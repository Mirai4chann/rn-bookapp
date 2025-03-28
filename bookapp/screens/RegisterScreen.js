import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import { FontAwesome } from '@expo/vector-icons';

const loadFonts = async () => {
  await Font.loadAsync({
    'FjallaOne-Regular': require('../assets/fonts/FjallaOne-Regular.ttf'),
  });
};

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

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
    try {
      await axios.post('http://192.168.100.16:3000/auth/register', { email, password, name, photo });
      alert('Registration Successful');
      navigation.navigate('Login');
    } catch (error) {
      alert('Registration failed: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      <Image source={require('../assets/images/wavy1.png')} style={styles.topWave} />
      <Text style={styles.title}>Register</Text>
      <Text style={styles.subtitle}>Create your account to get started.</Text>

      {/* Name Input */}
      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={20} color="#4E5D6C" />
        <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
      </View>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <FontAwesome name="envelope" size={20} color="#4E5D6C" />
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={20} color="#4E5D6C" />
        <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      </View>
      
      {photo && <Image source={{ uri: photo }} style={styles.image} />}
      
      {/* Pick or Take Photo Buttons */}
      <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
        <Text style={styles.photoButtonText}>Pick Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
        <Text style={styles.photoButtonText}>Take Photo</Text>
      </TouchableOpacity>

      {/* Register Button */}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>

      {/* Navigation to Login */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.signInText}>Already have an account? Sign In</Text>
      </TouchableOpacity>

      <Image source={require('../assets/images/wavy2.png')} style={styles.bottomWave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#FFF' },
  logo: { width: 70, height: 70, alignSelf: 'left', marginBottom: 20 },

  // Waves
  topWave: { width: '100%', height: 210, position: 'absolute', top: 0, marginLeft: 40 },
  bottomWave: { width: '110%', height: 200, position: 'absolute', bottom: 0 },

  // Font Application
  title: { fontSize: 28, textAlign: 'left', marginBottom: 5, fontFamily: 'FjallaOne-Regular' },
  subtitle: { fontSize: 16, color: '#555', textAlign: 'left', marginBottom: 20, fontFamily: 'FjallaOne-Regular' },

  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#CCC', borderRadius: 20, paddingHorizontal: 15, marginVertical: 5 },
  input: { flex: 1, paddingVertical: 12, marginLeft: 10, fontFamily: 'FjallaOne-Regular' },

  // Image Preview
  image: { width: 100, height: 100, marginVertical: 10, alignSelf: 'center', borderRadius: 50 },

  // Buttons
  photoButton: { backgroundColor: '#E0E0E0', padding: 12, borderRadius: 20, marginVertical: 5, alignItems: 'center' },
  photoButtonText: { color: '#000', fontSize: 16, fontFamily: 'FjallaOne-Regular' },

  registerButton: { backgroundColor: '#FBC4AB', padding: 15, borderRadius: 20, marginTop: 10, alignItems: 'center' },
  registerButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', fontFamily: 'FjallaOne-Regular' },

  // Sign In Navigation
  signInText: { color: '#4E5D6C', fontSize: 14, textAlign: 'center', marginTop: 20, fontFamily: 'FjallaOne-Regular' },
});
