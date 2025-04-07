import React, { useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cart';
import { fetchBookReviews, fetchUserReviews } from '../redux/reviews';

export default function BookDetailsScreen({ route, navigation }) {
  const { book } = route.params;
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.auth);
  const { bookReviews, reviews: userReviews } = useSelector((state) => state.reviews);

  useEffect(() => {
    dispatch(fetchBookReviews(book.id));
    if (userId) dispatch(fetchUserReviews(userId));
  }, [dispatch, book.id, userId]);

  const handleAddToCart = () => {
    dispatch(addToCart({ userId, book }));
    alert(`${book.title} added to cart`);
  };

  const getAverageRating = () => {
    const reviews = bookReviews.filter(r => r.bookId === book.id);
    return reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 'N/A';
  };

  const getUserReview = () => {
    return userReviews.find(r => r.bookId === book.id) || null;
  };

  const renderReview = ({ item }) => (
    <View style={styles.reviewItem}>
      <Text style={styles.reviewRating}>Rating: {item.rating}/5</Text>
      <Text style={styles.reviewComment}>"{item.comment || 'No comment'}"</Text>
      <Text style={styles.reviewUser}>By User {item.userId} on {new Date(item.date).toLocaleDateString()}</Text>
      {item.userId === userId && <Text style={styles.yourReview}>(Your Review)</Text>}
    </View>
  );

  const userReview = getUserReview();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{book.title}</Text>
      {book.photo && <Image source={{ uri: book.photo }} style={styles.bookImage} />}
      <Text style={styles.detail}>Author: {book.author}</Text>
      <Text style={styles.detail}>Price: ${book.price}</Text>
      <Text style={styles.detail}>Stock: {book.stock}</Text>
      <Text style={styles.detail}>Category: {book.category}</Text>
      <Text style={styles.detail}>Description: {book.description || 'No description available'}</Text>
      <Text style={styles.rating}>Average Rating: {getAverageRating()}</Text>
      {userReview && (
        <View style={styles.userReviewContainer}>
          <Text style={styles.userReviewTitle}>Your Review:</Text>
          <Text style={styles.userReviewText}>{userReview.rating}/5 - "{userReview.comment || 'No comment'}"</Text>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <Button title="Add to Cart" onPress={handleAddToCart} disabled={book.stock <= 0} />
      </View>
      <Text style={styles.reviewsTitle}>All Reviews:</Text>
      {bookReviews.length > 0 ? (
        <FlatList
          data={bookReviews.filter(r => r.bookId === book.id)}
          renderItem={renderReview}
          keyExtractor={(item) => item._id || item.date.toString()}
          style={styles.reviewsList}
        />
      ) : (
        <Text style={styles.noReviews}>No reviews yet</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  bookImage: { width: 150, height: 150, marginBottom: 20 },
  detail: { fontSize: 16, marginVertical: 5 },
  rating: { fontSize: 16, fontWeight: 'bold', marginVertical: 10 },
  userReviewContainer: { marginVertical: 10, alignItems: 'center' },
  userReviewTitle: { fontSize: 16, fontWeight: 'bold', color: '#6200ee' },
  userReviewText: { fontSize: 14, color: '#333', fontStyle: 'italic' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'center', width: '60%', marginVertical: 20 },
  reviewsTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  reviewsList: { width: '100%' },
  reviewItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  reviewRating: { fontSize: 14, fontWeight: 'bold' },
  reviewComment: { fontSize: 14, color: '#666', fontStyle: 'italic' },
  reviewUser: { fontSize: 12, color: '#888' },
  yourReview: { fontSize: 12, color: '#6200ee', fontWeight: 'bold' },
  noReviews: { fontSize: 14, color: '#666', textAlign: 'center' },
});