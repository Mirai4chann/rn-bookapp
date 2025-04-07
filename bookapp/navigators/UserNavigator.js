import React, { useState, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, Text, StyleSheet, Image, TextInput, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import UserHomeScreen from '../screens/UserHomeScreen';
import CartScreen from '../screens/CartScreen';
import BookDetailsScreen from '../screens/BookDetailsScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import ReviewScreen from '../screens/ReviewScreen';
import OrderScreen from '../screens/OrderScreen';
import { logout } from '../redux/auth';
import { fetchProfile, updateProfile } from '../redux/profile';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function UserHomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={UserHomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BookDetails" component={BookDetailsScreen} options={{ title: 'Book Details' }} />
      <Stack.Screen name="Orders" component={OrderDetailsScreen} options={{ title: 'My Orders' }} />
      <Stack.Screen name="Review" component={ReviewScreen} options={{ title: 'Review Order' }} />
    </Stack.Navigator>
  );
}

function CartStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Order" component={OrderScreen} options={{ title: 'Checkout' }} />
    </Stack.Navigator>
  );
}

function CustomDrawerContent({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile, loading, error } = useSelector((state) => state.profile);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [photo, setPhoto] = useState(profile?.photo || '');

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setEmail(profile.email || '');
      setPhoto(profile.photo || '');
    }
  }, [profile]);

  const handleUpdateProfile = async () => {
    try {
      await dispatch(updateProfile({ name, email, photo })).unwrap();
      setEditing(false);
      Alert.alert('Success', 'Profile Updated', [
        {
          text: 'OK',
          onPress: () => {
            dispatch(fetchProfile());
            navigation.closeDrawer();
          },
        },
      ]);
    } catch (err) {
      Alert.alert('Error', error || 'Failed to update profile');
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'Camera roll permission denied');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
      if (!editing) dispatch(updateProfile({ photo: result.assets[0].uri, name: profile?.name, email: profile?.email }));
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'Camera permission denied');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
      if (!editing) dispatch(updateProfile({ photo: result.assets[0].uri, name: profile?.name, email: profile?.email }));
    }
  };

  return (
    <View style={styles.drawerContentContainer}>
      <View style={styles.userProfileContainer}>
        <TouchableOpacity onPress={editing ? pickImage : null}>
          <Image
            source={{ uri: photo || 'https://randomuser.me/api/portraits/men/1.jpg' }}
            style={styles.userAvatar}
          />
          {editing && (
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={20} color="white" />
            </View>
          )}
        </TouchableOpacity>
        {editing ? (
          <>
            <TextInput
              style={styles.editInput}
              value={name}
              onChangeText={setName}
              placeholder="Full Name"
            />
            <TextInput
              style={styles.editInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
            />
            <View style={styles.photoButtons}>
              <TouchableOpacity
                style={[styles.profileButton, styles.photoButton]}
                onPress={pickImage}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Pick Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.profileButton, styles.photoButton]}
                onPress={takePhoto}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Take Photo</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.userName}>{name || 'John Doe'}</Text>
            <Text style={styles.userEmail}>{email || 'john.doe@example.com'}</Text>
          </>
        )}
        {editing ? (
          <View style={styles.profileActionButtons}>
            <TouchableOpacity
              style={[styles.profileButton, styles.saveButton, loading && styles.disabledButton]}
              onPress={handleUpdateProfile}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.profileButton, styles.cancelButton]}
              onPress={() => {
                setEditing(false);
                setName(profile?.name || '');
                setEmail(profile?.email || '');
                setPhoto(profile?.photo || '');
              }}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => setEditing(true)}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate('UserHomeStack', { screen: 'Home' })}
      >
        <Ionicons name="home" size={24} color="#f8c6a7" />
        <Text style={styles.drawerItemLabel}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate('CartStack', { screen: 'Cart' })}
      >
        <Ionicons name="cart" size={24} color="#f8c6a7" />
        <Text style={styles.drawerItemLabel}>My Cart</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate('Orders')}
      >
        <Ionicons name="list" size={24} color="#f8c6a7" />
        <Text style={styles.drawerItemLabel}>My Orders</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => dispatch(logout())}
      >
        <Ionicons name="log-out" size={24} color="#f8c6a7" />
        <Text style={styles.drawerItemLabel}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function UserNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="UserHomeStack"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        drawerStyle: { width: '80%' },
        drawerActiveTintColor: '#e91e63',
        drawerInactiveTintColor: '#333',
        headerShown: true,
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{ marginLeft: 15 }}
          >
            <Ionicons name="menu" size={24} color="#000" />
          </TouchableOpacity>
        ),
      })}
    >
      <Drawer.Screen
        name="UserHomeStack"
        component={UserHomeStack}
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
          title: 'Home',
          headerShown: false, // Let UserHomeStack manage its own header
        }}
      />
      <Drawer.Screen
        name="CartStack"
        component={CartStack}
        options={{
          drawerLabel: 'My Cart',
          drawerIcon: ({ color }) => <Ionicons name="cart" size={24} color={color} />,
          title: 'Cart',
          headerShown: false, // Let CartStack manage its own header
        }}
      />
      <Drawer.Screen
        name="Orders"
        component={OrderDetailsScreen}
        options={{
          drawerLabel: 'My Orders',
          drawerIcon: ({ color }) => <Ionicons name="list" size={24} color={color} />,
          title: 'My Orders',
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContentContainer: { flex: 1, paddingTop: 20 },
  userProfileContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  userAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#f8c6a7',
  },
  cameraIcon: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    backgroundColor: '#f8c6a7',
    borderRadius: 15,
    padding: 5,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  editInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  profileButton: {
    backgroundColor: '#f8c6a7',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  profileActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  saveButton: { backgroundColor: '#4CAF50', width: '48%' },
  cancelButton: { backgroundColor: '#f44336', width: '48%' },
  photoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  photoButton: { width: '48%', backgroundColor: '#2196F3' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  disabledButton: { backgroundColor: '#999' },
  errorText: { color: 'red', textAlign: 'center', marginTop: 10 },
  drawerItem: { flexDirection: 'row', alignItems: 'center', padding: 15, paddingLeft: 25 },
  drawerItemLabel: { fontSize: 16, fontWeight: '500', marginLeft: 15, color: '#333' },
});