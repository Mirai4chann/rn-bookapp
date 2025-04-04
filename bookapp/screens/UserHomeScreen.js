import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  StatusBar, 
  TextInput, 
  Alert,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  Modal
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../redux/books';
import { addToCart } from '../redux/cart';
import { logout, updateProfile } from '../redux/auth';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.8;

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
    <View style={styles.drawerContentContainer}>
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
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          navigation.navigate('UserHome');
          navigation.closeDrawer();
        }}
      >
        <Ionicons name="home" size={24} color="#6200ee" />
        <Text style={styles.drawerItemLabel}>Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          navigation.navigate('Cart');
          navigation.closeDrawer();
        }}
      >
        <Ionicons name="cart" size={24} color="#6200ee" />
        <Text style={styles.drawerItemLabel}>My Cart</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => dispatch(logout())}
      >
        <Ionicons name="log-out" size={24} color="#6200ee" />
        <Text style={styles.drawerItemLabel}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

function HomeScreenContent({ navigation }) {
  const dispatch = useDispatch();
  const { books } = useSelector((state) => state.books);
  const { userId } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [showFilters, setShowFilters] = useState(false);
  
  // Get max price from books to set slider range
  const maxBookPrice = Math.max(...books.map(book => book.price), 10) || 100;

  useEffect(() => {
    dispatch(fetchBooks());
    // Initialize max price with actual book data
    if (books.length > 0) {
      setMaxPrice(Math.max(...books.map(book => book.price)));
    }
  }, [dispatch]);

  const handleAddToCart = (book) => {
    dispatch(addToCart({ userId, book }));
    Alert.alert('Success', `${book.title} added to cart`);
  };

  const filteredBooks = books.filter(book => {
    // Search by title or author
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = activeCategory === 'All' || 
                           book.category === activeCategory || 
                           book.author === activeCategory;
    
    // Filter by price range
    const matchesPrice = book.price >= minPrice && book.price <= maxPrice;
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const categories = ['All', 'Action', 'Adventure', 'Romance', 'Comedy'];

  const resetFilters = () => {
    setActiveCategory('All');
    setMinPrice(0);
    setMaxPrice(maxBookPrice);
    setSearchQuery('');
    setShowFilters(false);
  };

  const renderBook = ({ item }) => (
    <TouchableOpacity 
      style={styles.bookCard}
      onPress={() => navigation.navigate('BookDetails', { book: item })}
    >
      <Image source={{ uri: item.photo }} style={styles.bookImage} />
      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>by {item.author}</Text>
        <Text style={styles.bookPrice}>${item.price.toFixed(2)}</Text>
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
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.openDrawer()}
          style={styles.menuButton}
        >
          <MaterialIcons name="menu" size={28} color="#000" />
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Books"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#888"
          />
          <TouchableOpacity 
            onPress={() => setShowFilters(true)}
            style={styles.filterButton}
          >
            <Ionicons name="filter" size={20} color="#6200ee" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              activeCategory === category && styles.activeCategoryButton
            ]}
            onPress={() => setActiveCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              activeCategory === category && styles.activeCategoryText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Options</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={24} color="#6200ee" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Price Range</Text>
              <View style={styles.priceRangeDisplay}>
                <Text>${minPrice.toFixed(2)}</Text>
                <Text> to </Text>
                <Text>${maxPrice.toFixed(2)}</Text>
              </View>
              <Text style={styles.sliderLabel}>Max Price</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={maxBookPrice}
                minimumTrackTintColor="#6200ee"
                maximumTrackTintColor="#ccc"
                thumbTintColor="#6200ee"
                value={maxPrice}
                onValueChange={(value) => setMaxPrice(value)}
                step={1}
              />
              <Text style={styles.sliderLabel}>Min Price</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={maxPrice} // Don't allow min above max
                minimumTrackTintColor="#6200ee"
                maximumTrackTintColor="#ccc"
                thumbTintColor="#6200ee"
                value={minPrice}
                onValueChange={(value) => setMinPrice(value)}
                step={1}
              />
            </View>
            
            <View style={styles.filterButtons}>
              <TouchableOpacity 
                style={[styles.filterButton, styles.resetButton]}
                onPress={resetFilters}
              >
                <Text style={styles.buttonText}>Reset Filters</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, styles.applyButton]}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.buttonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredBooks.length} {filteredBooks.length === 1 ? 'result' : 'results'} found
        </Text>
        {(activeCategory !== 'All' || minPrice > 0 || maxPrice < maxBookPrice || searchQuery) && (
          <TouchableOpacity onPress={resetFilters}>
            <Text style={styles.clearFiltersText}>Clear filters</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <FlatList
          data={filteredBooks}
          renderItem={renderBook}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.bookList}
          numColumns={2}
          columnWrapperStyle={styles.bookRow}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Ionicons name="search" size={50} color="#ccc" />
          <Text style={styles.noResultsText}>No books found</Text>
          <Text style={styles.noResultsSubText}>Try adjusting your search or filters</Text>
          <TouchableOpacity 
            style={styles.resetFiltersButton}
            onPress={resetFilters}
          >
            <Text style={styles.resetFiltersButtonText}>Reset All Filters</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default function UserHomeScreen({ navigation }) {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const toggleDrawer = () => {
    if (drawerVisible) {
      closeDrawer();
    } else {
      openDrawer();
    }
  };

  const openDrawer = () => {
    setDrawerVisible(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      setDrawerVisible(false);
    });
  };

  // Enhanced navigation with drawer methods
  const enhancedNavigation = {
    ...navigation,
    openDrawer: toggleDrawer,
    closeDrawer: toggleDrawer
  };

  return (
    <>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      
      {/* Main Content */}
      <HomeScreenContent navigation={enhancedNavigation} />
      
      {/* Overlay */}
      {drawerVisible && (
        <TouchableWithoutFeedback onPress={closeDrawer}>
          <Animated.View 
            style={[
              styles.overlay, 
              { opacity: fadeAnim }
            ]}
          />
        </TouchableWithoutFeedback>
      )}
      
      {/* Drawer */}
      <Animated.View 
        style={[
          styles.drawerContainer, 
          { 
            transform: [{ translateX: slideAnim }],
            width: DRAWER_WIDTH
          }
        ]}
      >
        <CustomDrawerContent 
          navigation={enhancedNavigation} 
          dispatch={useDispatch()} 
        />
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor: '#fff',},
  drawerContentContainer: {flex: 1,paddingTop: 20,},
  drawerContainer: {position: 'absolute',top: 0,left: 0,bottom: 0,backgroundColor: '#fff',zIndex: 1000,elevation: 1000,shadowColor: '#000',shadowOffset: { width: 2, height: 0 },shadowOpacity: 0.2,shadowRadius: 5,},
  overlay: {position: 'absolute',top: 0,left: 0,right: 0,bottom: 0,backgroundColor: '#000',zIndex: 999,elevation: 999,},
  userProfileContainer: {padding: 20,borderBottomWidth: 1,borderBottomColor: '#eee',alignItems: 'center',},
  userAvatar: {width: 100,height: 100,borderRadius: 50,marginBottom: 15,borderWidth: 2,borderColor: '#6200ee',},
  cameraIcon: {position: 'absolute',right: 5,bottom: 5,backgroundColor: '#6200ee',borderRadius: 15,padding: 5,},
  userName: {fontSize: 18,fontWeight: 'bold',marginBottom: 5,color: '#333',textAlign: 'center',},
  userEmail: {fontSize: 14,color: '#666',textAlign: 'center',marginBottom: 15,},
  editInput: {width: '100%',borderWidth: 1,borderColor: '#ddd',borderRadius: 5,padding: 10,marginBottom: 10,backgroundColor: '#fff',},
  profileButton: {backgroundColor: '#6200ee',padding: 10,borderRadius: 5,width: '100%',alignItems: 'center',marginTop: 10,},
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
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingLeft: 25,
  },
  drawerItemLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 15,
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuButton: {
    marginRight: 15,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 40,
  },
  searchIcon: {
    marginRight: 15,
  },
  filterButton: {
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#333',
    fontSize: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  categoryButton: {
    paddingHorizontal: 10, 
    paddingVertical: 6,    
    borderRadius: 15,     
    backgroundColor: '#f5f5f5',
    marginRight: 1,        
    minWidth: 40,     
    maxHeight: 35,     
    alignItems: 'center',  
  },
  activeCategoryButton: {
    backgroundColor: '#6200ee',
  },
  categoryText: {
    color: '#666',
    fontSize: 14,
  },
  activeCategoryText: {
    color: '#fff',
  },
  bookList: {
    padding: 15,
    paddingBottom: 20,
  },
  bookRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  bookCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 15,
    marginTop: -10,
  },
  bookImage: {
    width: '100%',
    height: 200,
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
  // New styles for search and filters
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  sliderLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  priceRangeDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 20,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  filterButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
  },
  resetButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  applyButton: {
    backgroundColor: '#6200ee',
  },
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
  },
  clearFiltersText: {
    fontSize: 14,
    color: '#6200ee',
    textDecorationLine: 'underline',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  noResultsSubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  resetFiltersButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#6200ee',
    borderRadius: 8,
  },
  resetFiltersButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});