import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/auth';
import { FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      'FjallaOne-Regular': require('../assets/fonts/FjallaOne-Regular.ttf'),
    });
  };

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleLogin = () => {
    dispatch(login({ email, password }));
  };

  return (
    <View style={styles.container}>
      {/* Top Wave and Logo */}
      <Image source={require('../assets/images/wavy1.png')} style={styles.topWave} />
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />

      {/* Login Form */}
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Please sign in to continue.</Text>

      {/* Email Field with Icon */}
      <View style={styles.inputContainer}>
        <FontAwesome name="envelope" size={20} color="#999" style={styles.icon} />
        <TextInput
          placeholder="Enter your email or username"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
      </View>

      {/* Password Field with Icon */}
      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={20} color="#999" style={styles.icon} />
        <TextInput
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      {/* Signup and Google Login */}
      <Text style={styles.signupText}>
        Don't have an account? <Text style={styles.signupLink}>Sign Up</Text>
      </Text>
      <Text style={styles.orText}>OR</Text>

      {/* Google Login with FontAwesome Icon */}
      <TouchableOpacity style={styles.googleButton}>
        <FontAwesome name="google" size={20} color="#FFF" style={styles.googleIcon} />
        <Text style={styles.googleText}>Login with Google</Text>
      </TouchableOpacity>

      <Text style={styles.termsText}>
        By continuing you agree to <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>.
      </Text>

      {/* Bottom Wave */}
      <Image source={require('../assets/images/wavy2.png')} style={styles.bottomWave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#FFF' },
  topWave: { width: '100%', height: 250, position: 'absolute', top: -50 },
  logo: { width: 70, height: 70, alignSelf: 'left', marginBottom: 10, marginLeft: 20 },
  
  // Apply FjallaOne-Regular Font
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'left', marginTop: 5, marginLeft: 20, fontFamily: 'FjallaOne-Regular' },
  subtitle: { textAlign: 'left', color: '#666', marginBottom: 20, marginLeft: 20, fontFamily: 'FjallaOne-Regular' },

  // Input Container with Icon
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 30,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginVertical: 5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: 'FjallaOne-Regular',
  },

  loginButton: { backgroundColor: '#FBC4AB', padding: 15, borderRadius: 30, marginHorizontal: 20, alignItems: 'center', marginTop: 10 },
  loginText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', fontFamily: 'FjallaOne-Regular' },
  signupText: { textAlign: 'center', marginVertical: 10, color: '#666', fontFamily: 'FjallaOne-Regular' },
  signupLink: { color: '#FBC4AB', fontWeight: 'bold', fontFamily: 'FjallaOne-Regular' },
  orText: { textAlign: 'center', marginVertical: 10, color: '#999', fontFamily: 'FjallaOne-Regular' },

  // Google Button with FontAwesome
  googleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', padding: 15, borderRadius: 30, marginHorizontal: 20 },
  googleIcon: { marginRight: 10 },
  googleText: { color: '#FFF', fontSize: 16, fontFamily: 'FjallaOne-Regular' },

  termsText: { textAlign: 'center', color: '#999', marginVertical: 20, fontFamily: 'FjallaOne-Regular' },
  termsLink: { color: '#FBC4AB', fontWeight: 'bold', fontFamily: 'FjallaOne-Regular' },
  bottomWave: { width: '100%', height: 220, position: 'absolute', bottom: 0 },
});
