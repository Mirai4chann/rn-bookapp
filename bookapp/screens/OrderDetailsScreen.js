import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserOrders } from '../redux/orders';

export default function OrderDetailsScreen({ navigation }) {
  const { orders, error, status } = useSelector((state) => state.orders);
  const { userId } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false); // Start as false, only true during fetch

  const fetchOrders = useCallback(async () => {
    if (userId) {
      setLoading(true);
      try {
        await dispatch(fetchUserOrders(userId)).unwrap();
      } catch (err) {
        console.error('[OrderDetailsScreen] Fetch orders failed:', err);
      } finally {
        setLoading(false);
      }
    }
  }, [dispatch, userId]);

  useEffect(() => {
    fetchOrders();
    // Listen for navigation focus to refresh orders
    const unsubscribe = navigation.addListener('focus', fetchOrders);
    return unsubscribe; // Cleanup listener
  }, [fetchOrders, navigation]);

  const handleReview = (order) => {
    navigation.navigate('UserHomeStack', { screen: 'Review', params: { order } });
  };

  const renderOrder = ({ item }) => (
    <View style={styles.order}>
      <Text>Order ID: {item.id}</Text>
      <Text>Total: ${(item.totalPrice || 0).toFixed(2)}</Text>
      <Text>Status: {item.status || 'Unknown'}</Text>
      <Text>Date: {new Date(item.date).toLocaleDateString()}</Text>
      {item.status === 'Delivered' && (
        <Button title="Review" onPress={() => handleReview(item)} />
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading orders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
        <Button title="Retry" onPress={fetchOrders} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Orders</Text>
      {orders.length === 0 ? (
        <Text style={styles.emptyText}>No orders found</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  order: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 10 },
  emptyText: { fontSize: 18, textAlign: 'center' },
});