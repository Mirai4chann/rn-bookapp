import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Image, StyleSheet } from 'react-native';
import axios from 'axios';

export default function BookListScreen({ navigation }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://192.168.100.16:3000/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://192.168.100.16:3000/books/${id}`);
      alert('Book deleted successfully');
      fetchBooks();
    } catch (error) {
      alert('Delete failed: ' + error.message);
    }
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book List</Text>
      <Button title="Add New Book" onPress={() => navigation.navigate('BookCreate')} />
      <FlatList
        data={books}
        renderItem={renderBook}
        keyExtractor={(item) => item.id.toString()}
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