import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { createBook } from '../../redux/books';

export default function BookCreateScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const dispatch = useDispatch();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return alert('Gallery permission denied');
    const result = await ImagePicker.launchImageLibraryAsync({ base64: true });
    if (!result.canceled) {
      setPhoto(`data:image/jpeg;base64,${result.assets[0].base64}`); // Convert to base64
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return alert('Camera permission denied');
    const result = await ImagePicker.launchCameraAsync({ base64: true });
    if (!result.canceled) {
      setPhoto(`data:image/jpeg;base64,${result.assets[0].base64}`); // Convert to base64
    }
  };

  const handleCreate = async () => {
    if (!title || !author || !price || !stock || !category) {
      alert('Please fill in all required fields (title, author, price, stock, category)');
      return;
    }
    const bookData = {
      title,
      author,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      description,
      photo,
    };
    console.log('Creating book with:', bookData);
    try {
      await dispatch(createBook(bookData)).unwrap(); // Use unwrap to catch errors
      alert('Book created successfully');
      navigation.navigate('BookList');
    } catch (err) {
      console.error('Book creation error:', err);
      alert(`Failed to create book: ${err.message || 'Unknown error'}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Book</Text>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Author" value={author} onChangeText={setAuthor} style={styles.input} />
      <TextInput placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Stock" value={stock} onChangeText={setStock} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Category" value={category} onChangeText={setCategory} style={styles.input} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
      {photo && <Image source={{ uri: photo }} style={styles.image} />}
      <Button title="Pick Photo" onPress={pickImage} />
      <Button title="Take Photo" onPress={takePhoto} />
      <Button title="Add Book" onPress={handleCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, marginVertical: 10, padding: 5 },
  image: { width: 100, height: 100, marginVertical: 10 },
});