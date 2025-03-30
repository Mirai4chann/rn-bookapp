import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { increaseQuantity, decreaseQuantity, removeFromCart, checkout, fetchCart } from '../redux/cart';

export default function CartScreen() {
  const { cart, error } = useSelector((state) => state.cart);
  const { userId } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      console.log('CartScreen useEffect - Fetching cart for userId:', userId);
      setLoading(true);
      dispatch(fetchCart(userId))
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    } else {
      console.log('CartScreen useEffect - No userId found');
      setLoading(false);
    }
  }, [dispatch, userId]);

  const handleIncrease = (bookId) => {
    dispatch(increaseQuantity({ userId, bookId }))
      .catch((err) => alert(`Failed to increase quantity: ${err.message || 'Unknown error'}`));
  };

  const handleDecrease = (bookId) => {
    dispatch(decreaseQuantity({ userId, bookId }))
      .catch((err) => alert(`Failed to decrease quantity: ${err.message || 'Unknown error'}`));
  };

  const handleRemove = (bookId) => {
    dispatch(removeFromCart({ userId, bookId }))
      .then(() => console.log(`Removed bookId: ${bookId} from cart`))
      .catch((err) => alert(`Failed to remove item: ${err.message || 'Unknown error'}`));
  };

  const handleCheckout = () => {
    dispatch(checkout(userId))
      .then(() => alert('Checkout complete!'))
      .catch((err) => alert(`Checkout failed: ${err.message || 'Unknown error'}`));
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text>
        {item.book.title || 'Unknown Book'} - ${item.book.price?.toFixed(2) || 'N/A'} x {item.quantity}
      </Text>
      <View style={styles.controls}>
        <Button
          title="-"
          onPress={() => handleDecrease(item.book.id)}
          disabled={item.quantity <= 1}
        />
        <Text style={styles.quantity}>{item.quantity}</Text>
        <Button
          title="+"
          onPress={() => handleIncrease(item.book.id)}
          disabled={item.quantity >= (item.book.stock || Infinity)}
        />
        <Button title="Delete" onPress={() => handleRemove(item.book.id)} />
      </View>
    </View>
  );

  const totalPrice = cart.reduce((sum, item) => sum + (item.book.price || 0) * item.quantity, 0);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading cart...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error: {error}</Text>
        <Button title="Retry" onPress={() => dispatch(fetchCart(userId))} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      {cart.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.book.id.toString()}
            style={styles.list}
          />
          <Text style={styles.total}>Total: ${totalPrice.toFixed(2)}</Text>
          <Button title="Checkout" onPress={handleCheckout} disabled={cart.length === 0} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  cartItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controls: { flexDirection: 'row', alignItems: 'center' },
  quantity: { marginHorizontal: 10, fontSize: 16 },
  list: { marginTop: 20 },
  emptyText: { fontSize: 18, textAlign: 'center' },
  total: { fontSize: 20, marginVertical: 10, textAlign: 'center' },
  loadingText: { fontSize: 18, textAlign: 'center', marginTop: 10 },
});