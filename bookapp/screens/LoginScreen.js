import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/auth';
import { FontAwesome } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { error, isLoggedIn, isAdmin } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      navigation.reset({
        index: 0,
        routes: [{ name: isAdmin ? 'Admin' : 'User' }],
      });
    }
  }, [isLoggedIn, isAdmin, navigation]);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        throw new Error("Email and password are required.");
      }

      console.log("Attempting login with:", { email });

      const result = await dispatch(login({ email, password }));

      if (result.error) {
        console.error("Login failed:", result.payload);
        throw new Error(result.payload || "Invalid credentials. Please try again.");
      }

      console.log("Login successful:", result.payload);
    } catch (error) {
      console.error("Login error:", {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      alert(error.message);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login initiated");
    alert("Google login feature is not implemented yet.");
  };

  return (
    <View style={styles.container}>
      {/* Top Wave Image */}
      <Image 
        source={require('../assets/images/wavy1.png')} 
        style={styles.topWave} 
        resizeMode="cover"
      />

      {/* Logo */}
      <Image 
        source={require('../assets/images/logo.png')} 
        style={styles.logo} 
        resizeMode="contain"
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Please sign in to continue.</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.inputContainer}>
          <FontAwesome name="envelope" size={20} color="#999" style={styles.icon} />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
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

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {/* Separator */}
        <Text style={styles.separator}>--- or ---</Text>

        {/* Google Login Button */}
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
          <View style={styles.googleContent}>
            <FontAwesome name="google" size={20} color="#f8c6a7" style={styles.googleIcon} />
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.signUpText}>
          Don't have an account?{' '}
          <Text style={styles.signUpLink} onPress={() => navigation.navigate('Register')}>
            Sign Up
          </Text>
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
  errorText: { 
    color: 'red', 
    textAlign: 'center', 
    marginBottom: 10 
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#CCC', 
    borderRadius: 20, 
    paddingHorizontal: 10, 
    marginVertical: 5 
  },
  icon: { 
    marginRight: 10 
  },
  input: { 
    flex: 1, 
    paddingVertical: 10 
  },
  loginButton: { 
    backgroundColor: '#FBC4AB', 
    padding: 15, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#F79D65', 
    alignItems: 'center', 
    marginTop: 20 
  },
  loginButtonText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  separator: { 
    textAlign: 'center', 
    marginVertical: 15, 
    fontSize: 14, 
    color: '#AAA' 
  },
  googleButton: { 
    backgroundColor: '#231f1f', 
    padding: 15, 
    borderRadius: 20, 
    borderWidth: 1, 
    alignItems: 'center', 
    marginTop: 10, 
    flexDirection: 'row', 
    justifyContent: 'center',
  },
  googleContent: { 
    flexDirection: 'row', 
    alignItems: 'center',
  },
  googleIcon: { 
    marginRight: 10,
  },
  googleButtonText: { 
    color: '#f8c6a7', 
    fontSize: 16, 
    fontWeight: 'bold',
  },
  signUpText: { 
    color: '#4E5D6C', 
    fontSize: 14, 
    textAlign: 'center', 
    marginTop: 20 
  },
  signUpLink: { 
    color: '#FBC4AB', 
    fontWeight: 'bold' 
  },
});
