import React, { useState, useEffect, createContext, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeNavigator from './navigators/HomeNavigator';
import UserNavigator from './navigators/UserNavigator';
import AdminNavigator from './navigators/AdminNavigator';

// Create Auth Context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [userState, setUserState] = useState({ isLoggedIn: false, isAdmin: false });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const isAdmin = await AsyncStorage.getItem('isAdmin');
        const jwtToken = await AsyncStorage.getItem('jwtToken');

        if (userId && jwtToken) {
          setUserState({ isLoggedIn: true, isAdmin: isAdmin === '1' });
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };
    checkAuth();
  }, []);

  const login = async (userId, isAdmin, token) => {
    await AsyncStorage.setItem('userId', userId.toString());
    await AsyncStorage.setItem('isAdmin', isAdmin.toString());
    await AsyncStorage.setItem('jwtToken', token);
    setUserState({ isLoggedIn: true, isAdmin: isAdmin === 1 });
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['userId', 'isAdmin', 'jwtToken']);
    setUserState({ isLoggedIn: false, isAdmin: false });
  };

  return (
    <AuthContext.Provider value={{ login, logout, userState }}>
      <NavigationContainer>
        {!userState.isLoggedIn ? (
          <HomeNavigator />
        ) : userState.isAdmin ? (
          <AdminNavigator />
        ) : (
          <UserNavigator />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});