import React, { useEffect } from 'react'; // Added useEffect
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { increaseQuantity, decreaseQuantity, removeFromCart, checkout, fetchCart } from '../redux/cart';

export default function CartScreen() {
  const { cart } = useSelector((state) => state.cart);
  const { userId } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userId && cart.length === 0) {
      dispatch(fetchCart(userId)); // Fetch cart if empty on mount
    }
  }, [dispatch, userId, cart.length]);

  const handleIncrease = (bookId) => {
    dispatch(increaseQuantity({ userId, bookId }));
  };

  const handleDecrease = (bookId) => {
    dispatch(decreaseQuantity({ userId, bookId }));
  };

  const handleRemove = (bookId) => {
    dispatch(removeFromCart({ userId, bookId }));
  };

  const handleCheckout = () => {
    dispatch(checkout(userId));
    alert('Checkout complete!');
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text>{item.book.title} - ${item.book.price} x {item.quantity}</Text>
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
          disabled={item.quantity >= item.book.stock}
        />
        <Button title="Delete" onPress={() => handleRemove(item.book.id)} />
      </View>
    </View>
  );

  const totalPrice = cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

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
          <Button title="Checkout" onPress={handleCheckout} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
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
});