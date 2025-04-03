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
      const response = await axios.post('http://192.168.1.6:3000/auth/register', {
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
    <View style={styles.container}>
      {/* Top Wave Image */}
      <Image 
        source={require('../assets/images/wavy1.png')} 
        style={styles.topWave} 
        resizeMode="cover"
      />
      
      {/* Logo in top right corner */}
      <Image 
        source={require('../assets/images/logo.png')} 
        style={styles.logo} 
        resizeMode="contain"
      />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
          Already have an account? <Text style={{ color: '#FFA500' }}>Sign In</Text>
        </Text>
      
      </ScrollView>

      {/* Bottom Wave Image */}
      <Image 
        source={require('../assets/images/wavy2.png')} 
        style={styles.bottomWave} 
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: { 
    flexGrow: 1, 
    padding: 20, 
    justifyContent: 'center',
    marginTop: 50,
    marginBottom: 50,
  },
  topWave: {
    width: '100%',
    height: 210,
    position: 'absolute',
    top: -20,
    left: 0,
    zIndex: 1,
  },
  bottomWave: {
    width: '100%',
    height: 200,
    position: 'absolute',
    bottom: -20,
    left: 0,
    zIndex: 1,
  },
  logo: {
    width: 60,
    height: 60,
    position: 'absolute',
    top: 70,
    left: 22,
    zIndex: 2,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'left', 
    marginBottom: 1,
  },
  subtitle: { 
    fontSize: 16, 
    color: '#555', 
    textAlign: 'left', 
    marginBottom: 20 
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#CCC', 
    borderRadius: 20, // Adjusted for rounded edges
    paddingHorizontal: 10, 
    marginVertical: 5, // Reduced for closer spacing between inputs
  },
  icon: { 
    marginRight: 10 
  },
  input: { 
    flex: 1, 
    paddingVertical: 10 
  },
  image: { 
    width: 100, 
    height: 100, 
    marginVertical: 10, 
    alignSelf: 'center', 
    borderRadius: 50 
  },
  photoButton: { 
    backgroundColor: '#E0E0E0', 
    padding: 12, 
    borderRadius: 20, // Adjusted for rounded edges
    borderWidth: 1, // Added border
    borderColor: '#CCC', // Added border color
    marginVertical: 5, 
    alignItems: 'center' 
  },
  photoButtonText: { 
    color: '#000', 
    fontSize: 16 
  },
  registerButton: { 
    backgroundColor: '#FBC4AB', 
    padding: 15, 
    borderRadius: 20, // Adjusted for rounded edges
    borderWidth: 1, // Added border
    borderColor: '#F79D65', // Added border color
    marginTop: 20, 
    alignItems: 'center' 
  },
  registerButtonText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  signInText: { 
    color: '#4E5D6C', 
    fontSize: 14, 
    textAlign: 'center', 
    marginTop: 20 
  },
});
