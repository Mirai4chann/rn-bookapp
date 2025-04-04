import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, StatusBar, TextInput, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../redux/books';
import { addToCart } from '../redux/cart';
import { logout, updateProfile } from '../redux/auth';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const Drawer = createDrawerNavigator();

function CustomDrawerContent({ navigation, dispatch }) {
  const { user } = useSelector((state) => state.auth);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdateProfile = () => {
    if (newPassword && newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    
    dispatch(updateProfile({
      name,
      email,
      currentPassword: password,
      newPassword: newPassword || undefined,
      photo: user?.photo
    }));
    setEditing(false);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      dispatch(updateProfile({
        photo: result.assets[0].uri,
        name: user?.name,
        email: user?.email
      }));
    }
  };

  return (
    <DrawerContentScrollView style={styles.drawerContainer}>
      {/* User Profile Section */}
      <View style={styles.userProfileContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image 
            source={{ uri: user?.photo || 'https://randomuser.me/api/portraits/men/1.jpg' }} 
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
            <TextInput
              style={styles.editInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Current Password"
              secureTextEntry
            />
            <TextInput
              style={styles.editInput}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="New Password (optional)"
              secureTextEntry
            />
          </>
        ) : (
          <>
            <Text style={styles.userName}>{user?.name || 'John Doe'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'john.doe@example.com'}</Text>
          </>
        )}

        {editing ? (
          <View style={styles.profileActionButtons}>
            <TouchableOpacity 
              style={[styles.profileButton, styles.saveButton]}
              onPress={handleUpdateProfile}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.profileButton, styles.cancelButton]}
              onPress={() => setEditing(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => setEditing(true)}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Drawer Items */}
      <DrawerItem
        label="Home"
        icon={({color, size}) => <Ionicons name="home" color={color} size={size} />}
        onPress={() => navigation.navigate('UserHome')}
        labelStyle={styles.drawerItemLabel}
      />
      <DrawerItem
        label="My Cart"
        icon={({color, size}) => <Ionicons name="cart" color={color} size={size} />}
        onPress={() => navigation.navigate('Cart')}
        labelStyle={styles.drawerItemLabel}
      />
      <DrawerItem
        label="Logout"
        icon={({color, size}) => <Ionicons name="log-out" color={color} size={size} />}
        onPress={() => dispatch(logout())}
        labelStyle={styles.drawerItemLabel}
      />
    </DrawerContentScrollView>
  );
}

function HomeScreenContent({ navigation }) {
  const dispatch = useDispatch();
  const { books } = useSelector((state) => state.books);
  const { userId } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleAddToCart = (book) => {
    dispatch(addToCart({ userId, book }));
    alert(`${book.title} added to cart`);
  };

  const renderBook = ({ item }) => (
    <TouchableOpacity 
      style={styles.bookCard}
      onPress={() => navigation.navigate('BookDetails', { book: item })}
    >
      <Image source={{ uri: item.photo }} style={styles.bookImage} />
      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>by {item.author}</Text>
        <Text style={styles.bookPrice}>${item.price}</Text>
        <TouchableOpacity 
          style={[
            styles.addToCartButton,
            item.stock <= 0 && styles.outOfStockButton
          ]}
          onPress={() => handleAddToCart(item)}
          disabled={item.stock <= 0}
        >
          <Text style={styles.addToCartButtonText}>
            {item.stock <= 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Custom Header with Menu Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.openDrawer()}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={28} color="#6200ee" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bookstore</Text>
        <View style={styles.headerIconPlaceholder} />
      </View>

      <FlatList
        data={books}
        renderItem={renderBook}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.bookList}
        numColumns={2}
        columnWrapperStyle={styles.bookRow}
      />
    </View>
  );
}

export default function UserHomeScreen() {
  const dispatch = useDispatch();

  return (
    <>
      <StatusBar backgroundColor="#6200ee" barStyle="light-content" />
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} dispatch={dispatch} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: 280,
            backgroundColor: '#fff',
          },
          drawerActiveTintColor: '#6200ee',
          drawerInactiveTintColor: '#333',
          swipeEdgeWidth: 50,
          swipeEnabled: true,
        }}
      >
        <Drawer.Screen name="UserHome" component={HomeScreenContent} />
      </Drawer.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  userProfileContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
    marginTop: 20,
  },
  userAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#6200ee',
  },
  cameraIcon: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    backgroundColor: '#6200ee',
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
    backgroundColor: '#6200ee',
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
  saveButton: {
    backgroundColor: '#4CAF50',
    width: '48%',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    width: '48%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  drawerItemLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: -15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  headerIconPlaceholder: {
    width: 28,
  },
  bookList: {
    padding: 10,
    paddingBottom: 20,
  },
  bookRow: {
    justifyContent: 'space-between',
  },
  bookCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  bookImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  bookDetails: {
    padding: 12,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bookPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 8,
  },
  addToCartButton: {
    backgroundColor: '#6200ee',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  outOfStockButton: {
    backgroundColor: '#ccc',
  },
  addToCartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});