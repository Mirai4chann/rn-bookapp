import React, { useEffect } from 'react';
import { View, Text, FlatList, Button, Image, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks, deleteBook } from '../../redux/books';

export default function BookListScreen({ navigation }) {
  const dispatch = useDispatch();
  const { books, error } = useSelector((state) => state.books);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteBook(id))
      .then(() => alert('Book deleted successfully'))
      .catch((err) => alert(`Failed to delete book: ${err.message || 'Unknown error'}`));
  };

  const renderBook = ({ item }) => (
    <View style={styles.bookItem}>
      {item.photo && <Image source={{ uri: item.photo }} style={styles.image} />}
      <Text>{item.title} by {item.author} - ${item.price} (Stock: {item.stock}, Category: {item.category})</Text>
      <Text>{item.description}</Text>
      <Button title="Edit" onPress={() => navigation.navigate('BookEdit', { book: item })} />
      <Button title="Delete" onPress={() => handleDelete(item.id)} />
    </View>
  );

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error: {error}</Text>
        <Button title="Retry" onPress={() => dispatch(fetchBooks())} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book List</Text>
      <Button title="Add New Book" onPress={() => navigation.navigate('BookCreate')} />
      <FlatList
        data={books}
        renderItem={renderBook}
        keyExtractor={(item) => item.id} // Use id as string directly
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  bookItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  list: { marginTop: 20 },
  image: { width: 50, height: 50, marginBottom: 10 },
});