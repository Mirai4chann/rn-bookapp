import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { updateBook } from '../../redux/books';

export default function BookEditScreen({ route, navigation }) {
  const { book } = route.params;
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [price, setPrice] = useState(book.price.toString());
  const [stock, setStock] = useState(book.stock.toString());
  const [category, setCategory] = useState(book.category);
  const [description, setDescription] = useState(book.description || '');
  const [photo, setPhoto] = useState(book.photo || null);
  const dispatch = useDispatch();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return alert('Gallery permission denied');
    const result = await ImagePicker.launchImageLibraryAsync({ base64: true });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return alert('Camera permission denied');
    const result = await ImagePicker.launchCameraAsync({ base64: true });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const handleUpdate = () => {
    if (!title || !author || !price || !stock || !category) {
      alert('Please fill in all required fields (title, author, price, stock, category)');
      return;
    }
    dispatch(updateBook({
      id: book.id,
      bookData: {
        title,
        author,
        price: parseFloat(price),
        stock: parseInt(stock),
        category,
        description,
        photo,
      },
    }));
    alert('Book updated successfully');
    navigation.navigate('BookList');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Book</Text>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Author" value={author} onChangeText={setAuthor} style={styles.input} />
      <TextInput placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Stock" value={stock} onChangeText={setStock} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Category" value={category} onChangeText={setCategory} style={styles.input} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
      {photo && <Image source={{ uri: photo }} style={styles.image} />}
      <Button title="Pick Photo" onPress={pickImage} />
      <Button title="Take Photo" onPress={takePhoto} />
      <Button title="Update Book" onPress={handleUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, marginVertical: 10, padding: 5 },
  image: { width: 100, height: 100, marginVertical: 10 },
});