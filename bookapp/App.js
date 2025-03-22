import React, { useEffect, useState } from 'react'; // Added useState
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from './redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { initializeAuth } from './redux/auth';
import HomeNavigator from './navigators/HomeNavigator';
import UserNavigator from './navigators/UserNavigator';
import AdminNavigator from './navigators/AdminNavigator';

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

function AppContent() {
  const dispatch = useDispatch();
  const { isLoggedIn, isAdmin } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  useEffect(() => {
    dispatch(initializeAuth()).then(() => {
      setIsLoading(false); // Set loading to false after initialization
    });
  }, [dispatch]);

  if (isLoading) {
    return null; // Or a loading spinner: <View><Text>Loading...</Text></View>
  }

  return (
    <NavigationContainer>
      {!isLoggedIn ? (
        <HomeNavigator />
      ) : isAdmin ? (
        <AdminNavigator />
      ) : (
        <UserNavigator />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
});