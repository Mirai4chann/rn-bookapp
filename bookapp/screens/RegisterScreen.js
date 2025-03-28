import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
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
    loadFonts().then(() => {
      console.log('Fonts loaded for RegisterScreen');
      setFontsLoaded(true);
    });
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return alert('Camera roll permission denied');
    const result = await ImagePicker.launchImageLibraryAsync({ base64: true });
    if (!result.canceled) {
      console.log('Photo picked');
      setPhoto(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return alert('Camera permission denied');
    const result = await ImagePicker.launchCameraAsync({ base64: true });
    if (!result.canceled) {
      console.log('Photo taken');
      setPhoto(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    console.log('Register button pressed');
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
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/images/wavy1.png')} style={styles.topWave} />
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Register</Text>
      <Text style={styles.subtitle}>Create your account to get started.</Text>

      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={20} color="#4E5D6C" style={styles.icon} />
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="envelope" size={20} color="#4E5D6C" style={styles.icon} />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={20} color="#4E5D6C" style={styles.icon} />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>

      {photo && <Image source={{ uri: photo }} style={styles.image} />}

      <TouchableOpacity
        style={styles.photoButton}
        onPress={pickImage}
        activeOpacity={0.7}
      >
        <Text style={styles.photoButtonText}>Pick Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.photoButton}
        onPress={takePhoto}
        activeOpacity={0.7}
      >
        <Text style={styles.photoButtonText}>Take Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegister}
        activeOpacity={0.7}
      >
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.signInText}>Already have an account? Sign In</Text>
      </TouchableOpacity>

      <Image source={require('../assets/images/wavy2.png')} style={styles.bottomWave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  logo: {
    width: 70,
    height: 70,
    alignSelf: 'flex-start',
    marginBottom: 20,
    zIndex: 1,
  },
  topWave: {
    width: '100%',
    height: 210,
    position: 'absolute',
    top: 0,
    marginLeft: 40,
    zIndex: 0,
  },
  bottomWave: {
    width: '110%',
    height: 200,
    position: 'absolute',
    bottom: 0,
    zIndex: 0,
  },
  title: {
    fontSize: 28,
    textAlign: 'left',
    marginBottom: 5,
    fontFamily: 'FjallaOne-Regular',
    zIndex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'left',
    marginBottom: 20,
    fontFamily: 'FjallaOne-Regular',
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginVertical: 5,
    zIndex: 1,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    fontFamily: 'FjallaOne-Regular',
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
    alignSelf: 'center',
    borderRadius: 50,
    zIndex: 1,
  },
  photoButton: {
    backgroundColor: '#E0E0E0',
    padding: 12,
    borderRadius: 20,
    marginVertical: 5,
    alignItems: 'center',
    zIndex: 1,
  },
  photoButtonText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'FjallaOne-Regular',
  },
  registerButton: {
    backgroundColor: '#FBC4AB',
    padding: 15,
    borderRadius: 20,
    marginTop: 10,
    alignItems: 'center',
    zIndex: 1,
  },
  registerButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'FjallaOne-Regular',
  },
  signInText: {
    color: '#4E5D6C',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'FjallaOne-Regular',
    zIndex: 1,
  },
});