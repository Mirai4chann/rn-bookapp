import React, { useEffect } from 'react';
import { View, Text, FlatList, Button, Image, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../redux/books';
import { addToCart } from '../redux/cart';
import { logout } from '../redux/auth';

export default function UserHomeScreen({ navigation }) {
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
    <View style={styles.bookItem}>
      {item.photo && <Image source={{ uri: item.photo }} style={styles.bookImage} />}
      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item.title} by {item.author} - ${item.price}</Text>
        <Text>Stock: {item.stock}</Text>
        <View style={styles.buttonContainer}>
          <Button title="Add to Cart" onPress={() => handleAddToCart(item)} disabled={item.stock <= 0} />
          <Button title="View Details" onPress={() => navigation.navigate('BookDetails', { book: item })} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Your Bookstore</Text>
      <FlatList
        data={books}
        renderItem={renderBook}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
      />
      <Button title="Logout" onPress={() => dispatch(logout())} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  bookItem: { flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', alignItems: 'center' },
  bookImage: { width: 50, height: 50, marginRight: 10 },
  bookDetails: { flex: 1 },
  bookTitle: { fontSize: 16, fontWeight: 'bold' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  list: { marginBottom: 20 },
});