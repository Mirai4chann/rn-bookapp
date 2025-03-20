import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

export default function BookEditScreen({ route, navigation }) {
  const { book } = route.params;
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [price, setPrice] = useState(book.price.toString());
  const [stock, setStock] = useState(book.stock.toString());
  const [category, setCategory] = useState(book.category);
  const [description, setDescription] = useState(book.description || '');
  const [photo, setPhoto] = useState(book.photo || null);

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

  const handleUpdate = async () => {
    if (!title || !author || !price || !stock || !category) {
      alert('Please fill in all required fields (title, author, price, stock, category)');
      return;
    }
    try {
      await axios.put(`http://192.168.100.16:3000/books/${book.id}`, {
        title,
        author,
        price: parseFloat(price),
        stock: parseInt(stock),
        category,
        description,
        photo,
      });
      alert('Book updated successfully');
      navigation.navigate('BookList');
    } catch (error) {
      alert('Update failed: ' + error.message);
    }
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