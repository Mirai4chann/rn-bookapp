import React, { useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserOrders } from '../redux/orders';

export default function OrderDetailsScreen({ navigation }) {
  const { orders, error } = useSelector((state) => state.orders);
  const { userId } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userId) dispatch(fetchUserOrders(userId));
  }, [dispatch, userId]);

  const handleReview = (order) => {
    navigation.navigate('Review', { order });
  };

  const renderOrder = ({ item }) => (
    <View style={styles.order}>
      <Text>Order ID: {item.id}</Text>
      <Text>Total: ${item.totalPrice.toFixed(2)}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Date: {new Date(item.date).toLocaleDateString()}</Text>
      {item.status === 'Delivered' && (
        <Button title="Review" onPress={() => handleReview(item)} />
      )}
    </View>
  );

  if (error) return <View style={styles.container}><Text>Error: {error}</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Orders</Text>
      <FlatList data={orders} renderItem={renderOrder} keyExtractor={(item) => item.id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  order: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
});