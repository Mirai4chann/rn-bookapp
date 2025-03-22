import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cart';

export default function BookDetailsScreen({ route, navigation }) {
  const { book } = route.params; // Get book from navigation params
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.auth);

  const handleAddToCart = () => {
    dispatch(addToCart({ userId, book }));
    alert(`${book.title} added to cart`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{book.title}</Text>
      {book.photo && <Image source={{ uri: book.photo }} style={styles.bookImage} />}
      <Text style={styles.detail}>Author: {book.author}</Text>
      <Text style={styles.detail}>Price: ${book.price}</Text>
      <Text style={styles.detail}>Stock: {book.stock}</Text>
      <Text style={styles.detail}>Category: {book.category}</Text>
      <Text style={styles.detail}>Description: {book.description || 'No description available'}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Add to Cart"
          onPress={handleAddToCart}
          disabled={book.stock <= 0}
        />
        <Button
          title="Back"
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  bookImage: { width: 150, height: 150, marginBottom: 20 },
  detail: { fontSize: 16, marginVertical: 5 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '60%', marginTop: 20 },
});