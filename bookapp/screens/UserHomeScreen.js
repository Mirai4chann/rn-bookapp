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
    dispatch(fetchUserReviews(userId));
    if (books.length > 0) {
      setMaxPrice(Math.max(...books.map(book => book.price)));
      books.forEach(book => dispatch(fetchBookReviews(book.id)));
    }
    
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(fetchUserReviews(userId));
      books.forEach(book => dispatch(fetchBookReviews(book.id)));
    });
    
    return unsubscribe;
  }, [dispatch, navigation, userId, books.length]);

  const handleAddToCart = (book) => {
    dispatch(addToCart({ userId, book }))
      .then(() => Alert.alert('Added to Cart', `${book.title} was added to your cart`))
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

  const categories = ['All', ...new Set(books.map(book => book.category).filter(cat => cat && cat !== 'Uncategorized'))];

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
          
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#F39C12" />
            <Text style={styles.bookRating}>{getAverageRating(item.id)}</Text>
          </View>
          
          {userReview && (
            <Text style={styles.userReview} numberOfLines={1}>
              Your rating: {userReview.rating}/5
            </Text>
          )}
          
          <Text style={styles.bookStock}>{item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}</Text>
          
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
      {/* Header with Search */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
          <MaterialIcons name="menu" size={28} color="#2C3E50" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#95A5A6" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by title or author"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#95A5A6"
          />
          <TouchableOpacity 
            onPress={() => setShowFilters(true)} 
            style={styles.filterButton}
          >
            <Ionicons name="options-outline" size={24} color="#3498DB" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>
      </View>
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Options</Text>
              <TouchableOpacity 
                onPress={() => setShowFilters(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#7F8C8D" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollContent}>
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Price Range</Text>
                <View style={styles.priceRangeContainer}>
                  <View style={styles.priceRangeValue}>
                    <Text style={styles.priceText}>${minPrice.toFixed(2)}</Text>
                  </View>
                  <View style={styles.priceRangeDivider}>
                    <Text style={styles.priceRangeDividerText}>to</Text>
                  </View>
                  <View style={styles.priceRangeValue}>
                    <Text style={styles.priceText}>${maxPrice.toFixed(2)}</Text>
                  </View>
                </View>
                
                <Text style={styles.sliderLabel}>Minimum Price</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={maxBookPrice}
                  minimumTrackTintColor="#3498DB"
                  maximumTrackTintColor="#ECF0F1"
                  thumbTintColor="#3498DB"
                  value={minPrice}
                  onValueChange={(value) => setMinPrice(value)}
                  step={1}
                />
                
                <Text style={styles.sliderLabel}>Maximum Price</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={minPrice}
                  maximumValue={maxBookPrice}
                  minimumTrackTintColor="#3498DB"
                  maximumTrackTintColor="#ECF0F1"
                  thumbTintColor="#3498DB"
                  value={maxPrice}
                  onValueChange={(value) => setMaxPrice(value)}
                  step={1}
                />
              </View>
            </ScrollView>
            
            <View style={styles.filterActions}>
              <TouchableOpacity 
                style={styles.secondaryButton} 
                onPress={resetFilters}
              >
                <Text style={styles.secondaryButtonText}>Reset All</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.primaryButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} found
        </Text>
        {(activeCategory !== 'All' || minPrice > 0 || maxPrice < maxBookPrice || searchQuery) && (
          <TouchableOpacity onPress={resetFilters}>
            <Text style={styles.clearFiltersText}>Clear all</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Book List */}
      {filteredBooks.length > 0 ? (
        <FlatList
          data={filteredBooks}
          renderItem={renderBook}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.bookList}
          numColumns={2}
          columnWrapperStyle={styles.bookRow}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={60} color="#BDC3C7" />
          <Text style={styles.emptyStateTitle}>No books found</Text>
          <Text style={styles.emptyStateSubtitle}>
            Try adjusting your search or filter criteria
          </Text>
          <TouchableOpacity 
            style={styles.emptyStateButton}
            onPress={resetFilters}
          >
            <Text style={styles.emptyStateButtonText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  menuButton: {
    marginRight: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECF0F1',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 48,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#2C3E50',
    fontSize: 16,
    fontFamily: 'System',
  },
  filterButton: {
    marginLeft: 12,
  },
  
  // Categories
  categoriesHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ECF0F1',
    marginRight: 8,
    height: 36,
    justifyContent: 'center',
  },
  activeCategoryButton: {
    backgroundColor: '#f8c6a7',
  },
  categoryText: {
    color: '#7F8C8D',
    fontSize: 14,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  
  // Results Header
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8F9FA',
  },
  resultsText: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  clearFiltersText: {
    fontSize: 14,
    color: '#3498DB',
    fontWeight: '500',
  },
  
  // Book List
  bookList: {
    padding: 16,
    paddingBottom: 24,
  },
  bookRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  bookCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
  },
  bookImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  bookDetails: {
    padding: 12,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#2C3E50',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  bookPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8c6a7',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bookRating: {
    fontSize: 14,
    color: '#F39C12',
    marginLeft: 4,
  },
  userReview: {
    fontSize: 12,
    color: '#95A5A6',
    marginBottom: 8,
  },
  bookStock: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 12,
  },
  addToCartButton: {
    backgroundColor: '#f8c6a7',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStockButton: {
    backgroundColor: '#95A5A6',
  },
  addToCartButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  
  // Filter Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
  },
  closeButton: {
    padding: 4,
  },
  modalScrollContent: {
    paddingHorizontal: 24,
  },
  filterSection: {
    paddingVertical: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 16,
  },
  priceRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  priceRangeValue: {
    backgroundColor: '#ECF0F1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  priceRangeDivider: {
    paddingHorizontal: 8,
  },
  priceRangeDividerText: {
    color: '#7F8C8D',
  },
  priceText: {
    color: '#2C3E50',
    fontWeight: '600',
  },
  sliderLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 24,
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#ECF0F1',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#3498DB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#ECF0F1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 12,
  },
  secondaryButtonText: {
    color: '#7F8C8D',
    fontWeight: '600',
    fontSize: 16,
  },
  
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  emptyStateButton: {
    backgroundColor: '#3498DB',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});