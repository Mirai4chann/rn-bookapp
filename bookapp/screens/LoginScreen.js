import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
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
    loadFonts().then(() => {
      console.log('Fonts loaded for LoginScreen');
      setFontsLoaded(true);
    });
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleLogin = () => {
    console.log('Login button pressed');
    dispatch(login({ email, password }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/images/wavy1.png')} style={styles.topWave} />
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />

      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Please sign in to continue.</Text>

      <View style={styles.inputContainer}>
        <FontAwesome name="envelope" size={20} color="#999" style={styles.icon} />
        <TextInput
          placeholder="Enter your email or username"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
      </View>

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

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        activeOpacity={0.7}
      >
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.signupText}>
        Don't have an account? <Text style={styles.signupLink}>Sign Up</Text>
      </Text>
      <Text style={styles.orText}>OR</Text>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={() => console.log('Google login pressed')}
        activeOpacity={0.7}
      >
        <FontAwesome name="google" size={20} color="#FFF" style={styles.googleIcon} />
        <Text style={styles.googleText}>Login with Google</Text>
      </TouchableOpacity>

      <Text style={styles.termsText}>
        By continuing you agree to <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
        <Text style={styles.termsLink}>Privacy Policy</Text>.
      </Text>

      <Image source={require('../assets/images/wavy2.png')} style={styles.bottomWave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFF',
    paddingVertical: 20,
  },
  topWave: {
    width: '100%',
    height: 250,
    position: 'absolute',
    top: -50,
    zIndex: 0,
  },
  logo: {
    width: 70,
    height: 70,
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginLeft: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 5,
    marginLeft: 20,
    fontFamily: 'FjallaOne-Regular',
    zIndex: 1,
  },
  subtitle: {
    textAlign: 'left',
    color: '#666',
    marginBottom: 20,
    marginLeft: 20,
    fontFamily: 'FjallaOne-Regular',
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 30,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginVertical: 5,
    zIndex: 1,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: 'FjallaOne-Regular',
  },
  loginButton: {
    backgroundColor: '#FBC4AB',
    padding: 15,
    borderRadius: 30,
    marginHorizontal: 20,
    alignItems: 'center',
    marginTop: 10,
    zIndex: 1,
  },
  loginText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'FjallaOne-Regular',
  },
  signupText: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#666',
    fontFamily: 'FjallaOne-Regular',
    zIndex: 1,
  },
  signupLink: {
    color: '#FBC4AB',
    fontWeight: 'bold',
    fontFamily: 'FjallaOne-Regular',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#999',
    fontFamily: 'FjallaOne-Regular',
    zIndex: 1,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 30,
    marginHorizontal: 20,
    zIndex: 1,
  },
  googleIcon: {
    marginRight: 10,
  },
  googleText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'FjallaOne-Regular',
  },
  termsText: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 20,
    fontFamily: 'FjallaOne-Regular',
    zIndex: 1,
  },
  termsLink: {
    color: '#FBC4AB',
    fontWeight: 'bold',
    fontFamily: 'FjallaOne-Regular',
  },
  bottomWave: {
    width: '100%',
    height: 220,
    position: 'absolute',
    bottom: 0,
    zIndex: 0,
  },
});