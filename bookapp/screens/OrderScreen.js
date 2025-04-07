import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
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

  const totalPrice = cart.reduce((sum, item) => sum + (item.book?.price || 0) * item.quantity, 0);

  const handleFinalCheckout = async () => {
    if (cart.length === 0) {
      alert('Checkout failed: Cart is empty');
      return;
    }
    setLoading(true);
    try {
      const orderItems = cart.map(item => ({
        book: { id: item.book.id },
        quantity: item.quantity,
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
      });
      const errorMessage = err.response?.data?.error || err.message || 'Unknown error';
      alert(`Checkout failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.itemText}>
        {item.book?.title || 'Unknown Book'} - $
        {(item.book?.price ?? 0).toFixed(2)} x {item.quantity}
      </Text>
      <Text style={styles.itemSubtotal}>
        Subtotal: ${((item.book?.price ?? 0) * item.quantity).toFixed(2)}
      </Text>
    </View>
  );

  if (cart.length === 0 && !loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Order Summary</Text>
        <Text style={styles.emptyText}>Your cart is empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Processing your order...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.book?.id?.toString() || Math.random().toString()}
            contentContainerStyle={styles.listContainer}
          />
          
          <View style={styles.summaryContainer}>
            <Text style={styles.total}>Total: ${totalPrice.toFixed(2)}</Text>
            
            <View style={styles.paymentContainer}>
              <Text style={styles.label}>Payment Method:</Text>
              <Picker
                selectedValue={paymentMethod}
                style={styles.picker}
                onValueChange={(value) => setPaymentMethod(value)}
                enabled={!loading}
                dropdownIconColor="#666"
              >
                <Picker.Item label="Cash on Delivery" value="Cash on Delivery" />
                <Picker.Item label="Credit Card" value="Credit Card" />
                <Picker.Item label="PayPal" value="PayPal" />
              </Picker>
            </View>
            
            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={handleFinalCheckout}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Placing Order...' : 'Place Order'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  listContainer: {
    paddingBottom: 20,
  },
  orderItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
  },
  itemSubtotal: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  summaryContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  total: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 10,
    textAlign: 'center',
    color: '#333',
  },
  paymentContainer: {
    marginVertical: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#555',
  },
  picker: {
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
  },
  checkoutButton: {
    backgroundColor: '#f8c6a7',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginTop: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
});