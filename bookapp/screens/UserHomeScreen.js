import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, TextInput, Alert, Modal, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../redux/books';
import { addToCart } from '../redux/cart';
import { fetchBookReviews, fetchUserReviews } from '../redux/reviews';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

export default function UserHomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { books } = useSelector((state) => state.books);
  const { bookReviews, reviews: userReviews } = useSelector((state) => state.reviews);
  const { userId } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [showFilters, setShowFilters] = useState(false);

  const maxBookPrice = Math.max(...books.map(book => book.price), 10) || 100;

  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(fetchUserReviews(userId)); // Fetch user's reviews
    if (books.length > 0) {
      setMaxPrice(Math.max(...books.map(book => book.price)));
      books.forEach(book => dispatch(fetchBookReviews(book.id))); // Fetch reviews for all books
    }
    // Refresh reviews when screen is focused (e.g., after submitting a review)
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(fetchUserReviews(userId));
      books.forEach(book => dispatch(fetchBookReviews(book.id)));
    });
    return unsubscribe;
  }, [dispatch, navigation, userId, books.length]);

  const handleAddToCart = (book) => {
    dispatch(addToCart({ userId, book }))
      .then(() => Alert.alert('Success', `${book.title} added to cart`))
      .catch((err) => Alert.alert('Error', `Failed to add ${book.title} to cart: ${err.message || 'Unknown error'}`));
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || book.category === activeCategory;
    const matchesPrice = book.price >= minPrice && book.price <= maxPrice;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const categories = ['All', ...new Set(books.map(book => book.category).filter(cat => cat !== 'Uncategorized'))];

  const resetFilters = () => {
    setActiveCategory('All');
    setMinPrice(0);
    setMaxPrice(maxBookPrice);
    setSearchQuery('');
    setShowFilters(false);
  };

  const getAverageRating = (bookId) => {
    const reviews = bookReviews.filter(r => r.bookId === bookId);
    return reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 'N/A';
  };

  const getUserReview = (bookId) => {
    return userReviews.find(r => r.bookId === bookId) || null;
  };

  const renderBook = ({ item }) => {
    const userReview = getUserReview(item.id);
    return (
      <TouchableOpacity
        style={styles.bookCard}
        onPress={() => {
          dispatch(fetchBookReviews(item.id));
          navigation.navigate('BookDetails', { book: item });
        }}
      >
        <Image
          source={{ uri: item.photo || 'https://via.placeholder.com/150' }}
          style={styles.bookImage}
        />
        <View style={styles.bookDetails}>
          <Text style={styles.bookTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.bookAuthor} numberOfLines={1}>by {item.author}</Text>
          <Text style={styles.bookPrice}>${item.price.toFixed(2)}</Text>
          <Text style={styles.bookRating}>Avg Rating: {getAverageRating(item.id)}</Text>
          {userReview && (
            <Text style={styles.userReview}>
              Your Review: {userReview.rating}/5 - "{userReview.comment || 'No comment'}"
            </Text>
          )}
          <Text style={styles.bookStock}>Stock: {item.stock}</Text>
          <TouchableOpacity
            style={[styles.addToCartButton, item.stock <= 0 && styles.outOfStockButton]}
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
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
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
          <TouchableOpacity onPress={() => setShowFilters(true)} style={styles.filterButton}>
            <Ionicons name="filter" size={20} color="#6200ee" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, activeCategory === category && styles.activeCategoryButton]}
            onPress={() => setActiveCategory(category)}
          >
            <Text
              style={[styles.categoryText, activeCategory === category && styles.activeCategoryText]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Modal visible={showFilters} animationType="slide" transparent={true} onRequestClose={() => setShowFilters(false)}>
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
                maximumValue={maxPrice}
                minimumTrackTintColor="#6200ee"
                maximumTrackTintColor="#ccc"
                thumbTintColor="#6200ee"
                value={minPrice}
                onValueChange={(value) => setMinPrice(value)}
                step={1}
              />
            </View>
            <View style={styles.filterButtons}>
              <TouchableOpacity style={[styles.filterButton, styles.resetButton]} onPress={resetFilters}>
                <Text style={styles.buttonText}>Reset Filters</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.filterButton, styles.applyButton]} onPress={() => setShowFilters(false)}>
                <Text style={styles.buttonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
          <TouchableOpacity style={styles.resetFiltersButton} onPress={resetFilters}>
            <Text style={styles.resetFiltersButtonText}>Reset All Filters</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  menuButton: { marginRight: 15 },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 10, paddingHorizontal: 15, height: 40 },
  searchIcon: { marginRight: 15 },
  filterButton: { marginLeft: 10 },
  searchInput: { flex: 1, height: '100%', color: '#333', fontSize: 16 },
  categoriesContainer: { paddingHorizontal: 15, paddingVertical: 10 },
  categoryButton: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 15, backgroundColor: '#f5f5f5', marginRight: 1, minWidth: 40, maxHeight: 35, alignItems: 'center' },
  activeCategoryButton: { backgroundColor: '#6200ee' },
  categoryText: { color: '#666', fontSize: 14 },
  activeCategoryText: { color: '#fff' },
  bookList: { padding: 15, paddingBottom: 20 },
  bookRow: { justifyContent: 'space-between', marginBottom: 15 },
  bookCard: { width: '48%', backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, marginBottom: 15, marginTop: -10 },
  bookImage: { width: '100%', height: 200, resizeMode: 'cover' },
  bookDetails: { padding: 12 },
  bookTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' },
  bookAuthor: { fontSize: 14, color: '#666', marginBottom: 4 },
  bookPrice: { fontSize: 16, fontWeight: 'bold', color: '#6200ee', marginBottom: 4 },
  bookRating: { fontSize: 14, color: '#666', marginBottom: 4 },
  userReview: { fontSize: 12, color: '#888', marginBottom: 4, fontStyle: 'italic' },
  bookStock: { fontSize: 14, color: '#666', marginBottom: 8 },
  addToCartButton: { backgroundColor: '#6200ee', padding: 8, borderRadius: 4, alignItems: 'center' },
  outOfStockButton: { backgroundColor: '#ccc' },
  addToCartButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 30 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  filterSection: { marginBottom: 20 },
  filterLabel: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#333' },
  sliderLabel: { fontSize: 14, color: '#666', marginBottom: 5 },
  priceRangeDisplay: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  slider: { width: '100%', height: 40, marginBottom: 20 },
  filterButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  filterButton: { padding: 12, borderRadius: 8, alignItems: 'center', width: '48%' },
  resetButton: { backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#ddd' },
  applyButton: { backgroundColor: '#6200ee' },
  resultsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10, alignItems: 'center' },
  resultsText: { fontSize: 14, color: '#666' },
  clearFiltersText: { fontSize: 14, color: '#6200ee', textDecorationLine: 'underline' },
  noResultsContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  noResultsText: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 10 },
  noResultsSubText: { fontSize: 14, color: '#666', marginTop: 5, textAlign: 'center' },
  resetFiltersButton: { marginTop: 20, padding: 12, backgroundColor: '#6200ee', borderRadius: 8 },
  resetFiltersButtonText: { color: '#fff', fontWeight: 'bold' },
});