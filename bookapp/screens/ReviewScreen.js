import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { createReview } from '../redux/reviews';

export default function ReviewScreen({ route, navigation }) {
  const { order } = route.params;
  const { userId } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [reviews, setReviews] = useState(
    order.order_items.map(item => ({
      bookId: Number(item.book.id), // Convert string to number
      rating: 0,
      comment: '',
    }))
  );

  // Log data for debugging
  useEffect(() => {
    console.log('[ReviewScreen] Order items:', JSON.stringify(order.order_items, null, 2));
    console.log('[ReviewScreen] Initial reviews:', JSON.stringify(reviews, null, 2));
  }, [order.order_items, reviews]);

  const handleRatingChange = (bookId, rating) => {
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.bookId === bookId ? { ...review, rating } : review
      )
    );
  };

  const handleCommentChange = (bookId, comment) => {
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.bookId === bookId ? { ...review, comment } : review
      )
    );
  };

  const handleSubmit = async () => {
    try {
      for (const review of reviews) {
        if (review.rating > 0) {
          await dispatch(
            createReview({
              orderId: order.id,
              userId,
              bookId: review.bookId,
              rating: review.rating,
              comment: review.comment || '',
            })
          ).unwrap();
        }
      }
      alert('Reviews submitted successfully!');
      navigation.goBack();
    } catch (err) {
      console.error('[ReviewScreen] Submit failed:', err);
      alert(`Failed to submit reviews: ${err.message || 'Unknown error'}`);
    }
  };

  const renderReviewItem = ({ item }) => {
    const bookId = Number(item.book.id);
    const review = reviews.find(r => r.bookId === bookId) || { rating: 0, comment: '' }; // Fallback if not found
    console.log(`[ReviewScreen] Rendering bookId=${bookId}, review=`, review);

    return (
      <View style={styles.reviewItem}>
        <Text>{item.book?.title || `Book ID: ${item.book.id}`}</Text>
        <Text>Rating (1-5):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={review.rating.toString()}
          onChangeText={(text) =>
            handleRatingChange(
              bookId,
              Math.min(5, Math.max(1, parseInt(text) || 0))
            )
          }
        />
        <Text>Comment:</Text>
        <TextInput
          style={styles.input}
          value={review.comment}
          onChangeText={(text) => handleCommentChange(bookId, text)}
          multiline
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review Order #{order.id}</Text>
      <FlatList
        data={order.order_items}
        renderItem={renderReviewItem}
        keyExtractor={(item) => item.book.id.toString()}
      />
      <Button title="Submit Reviews" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  reviewItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 5, marginVertical: 5 },
});