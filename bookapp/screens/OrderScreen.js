import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import { checkout } from '../redux/cart';
import { createOrder } from '../redux/orders';

export default function OrderScreen({ navigation }) {
  const { cart } = useSelector((state) => state.cart);
  const { userId } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);

  if (!userId) {
    alert('Please log in to place an order');
    navigation.navigate('Login');
    return null;
  }

  const totalPrice = cart.reduce((sum, item) => sum + (item.book.price || 0) * item.quantity, 0);

  const handleFinalCheckout = async () => {
    if (cart.length === 0) {
      alert('Checkout failed: Cart is empty');
      return;
    }
    setLoading(true);
    try {
      const orderItems = cart.map(item => ({
        book: { id: item.book._id }, // Simplified book object with just id
        quantity: item.quantity
      }));
      const orderData = { userId, order_items: orderItems, totalPrice, payment_method: paymentMethod };
      console.log('Order data being sent:', JSON.stringify(orderData, null, 2));
      const orderResult = await dispatch(createOrder(orderData)).unwrap();
      console.log('Order created:', orderResult);
      const checkoutResult = await dispatch(checkout(userId)).unwrap();
      console.log('Checkout completed:', checkoutResult);
      alert('Order placed successfully!');
      navigation.navigate('UserHomeStack', { screen: 'Orders' });
    } catch (err) {
      console.error('Checkout error details:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        request: err.request ? 'Request sent, no response' : 'No request sent'
      });
      const errorMessage = err.response?.data?.error || err.message || 'Unknown error';
      alert(`Checkout failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text>{item.book.title} - ${item.book.price.toFixed(2)} x {item.quantity}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>
      <FlatList data={cart} renderItem={renderOrderItem} keyExtractor={(item) => item.book._id.toString()} />
      <Text style={styles.total}>Total: ${totalPrice.toFixed(2)}</Text>
      <Text style={styles.label}>Payment Method:</Text>
      <Picker
        selectedValue={paymentMethod}
        style={styles.picker}
        onValueChange={(value) => setPaymentMethod(value)}
        enabled={!loading}
      >
        <Picker.Item label="Cash on Delivery" value="Cash on Delivery" />
        <Picker.Item label="Credit Card" value="Credit Card" />
        <Picker.Item label="PayPal" value="PayPal" />
      </Picker>
      <Button title={loading ? 'Placing Order...' : 'Place Order'} onPress={handleFinalCheckout} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  orderItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  total: { fontSize: 20, marginVertical: 10, textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 5 },
  picker: { height: 200, width: '100%', marginBottom: 40 },
});