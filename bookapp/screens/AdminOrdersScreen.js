import React, { useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from '../redux/orders';

export default function AdminOrdersScreen() {
  const { allOrders, error } = useSelector((state) => state.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusUpdate = (id, status) => {
    dispatch(updateOrderStatus({ id, status })).catch((err) => alert(`Failed to update status: ${err.message || 'Unknown error'}`));
  };

  const renderOrder = ({ item }) => (
    <View style={styles.order}>
      <Text>Order ID: {item.id}</Text>
      <Text>User ID: {item.userId}</Text>
      <Text>Total: ${item.totalPrice.toFixed(2)}</Text>
      <Text>Status: {item.status}</Text>
      <View style={styles.controls}>
        <Button title="To Ship" onPress={() => handleStatusUpdate(item.id, 'To Ship')} disabled={item.status !== 'Pending'} />
        <Button title="To Receive" onPress={() => handleStatusUpdate(item.id, 'To Receive')} disabled={item.status !== 'To Ship'} />
        <Button title="Delivered" onPress={() => handleStatusUpdate(item.id, 'Delivered')} disabled={item.status !== 'To Receive'} />
      </View>
    </View>
  );

  if (error) return <View style={styles.container}><Text>Error: {error}</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Orders</Text>
      <FlatList data={allOrders} renderItem={renderOrder} keyExtractor={(item) => item.id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  order: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  controls: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
});