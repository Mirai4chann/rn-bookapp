import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { increaseQuantity, decreaseQuantity, removeFromCart, fetchCart } from '../redux/cart';
import { Ionicons } from '@expo/vector-icons';

export default function CartScreen({ navigation }) {
  const { cart, error, status } = useSelector((state) => state.cart);
  const { userId } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      dispatch(fetchCart(userId))
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    } else {
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
      .catch((err) => alert(`Failed to remove item: ${err.message || 'Unknown error'}`));
  };

  const handleCheckout = () => {
    navigation.navigate('Order');
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItemContainer}>
      <View style={styles.cartItem}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle} numberOfLines={1}>{item.book?.title || 'Unknown Book'}</Text>
          <Text style={styles.itemPrice}>${item.book?.price?.toFixed(2) || '0.00'}</Text>
        </View>
        
        <View style={styles.controlsContainer}>
          <View style={styles.quantityControls}>
            <TouchableOpacity 
              onPress={() => handleDecrease(item.book.id)} 
              disabled={item.quantity <= 1}
              style={[styles.controlButton, item.quantity <= 1 && styles.disabledButton]}
            >
              <Ionicons name="remove" size={18} color={item.quantity <= 1 ? "#ccc" : "#555"} />
            </TouchableOpacity>
            
            <Text style={styles.quantity}>{item.quantity}</Text>
            
            <TouchableOpacity 
              onPress={() => handleIncrease(item.book.id)} 
              disabled={item.quantity >= (item.book?.stock || Infinity)}
              style={[styles.controlButton, item.quantity >= (item.book?.stock || Infinity) && styles.disabledButton]}
            >
              <Ionicons name="add" size={18} color={item.quantity >= (item.book?.stock || Infinity) ? "#ccc" : "#555"} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            onPress={() => handleRemove(item.book.id)} 
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={18} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const totalPrice = cart.reduce((sum, item) => sum + (item.book?.price || 0) * item.quantity, 0);

  if (loading || status === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f8c6a7" />
        <Text style={styles.loadingText}>Loading your cart...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning-outline" size={40} color="#ff4444" />
        <Text style={styles.errorText}>Error loading cart</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => dispatch(fetchCart(userId))}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      
      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={50} color="#888" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <TouchableOpacity 
            style={styles.continueShoppingButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.continueShoppingText}>Browse Books</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.book.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
          
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>Checkout</Text>
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
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#f8c6a7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  continueShoppingButton: {
    backgroundColor: '#f8c6a7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  continueShoppingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 16,
  },
  cartItemContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cartItem: {
    padding: 16,
  },
  itemInfo: {
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemPrice: {
    fontSize: 15,
    color: '#f8c6a7',
    fontWeight: '600',
    marginTop: 4,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    borderColor: '#eee',
  },
  quantity: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    minWidth: 20,
    textAlign: 'center',
  },
  deleteButton: {
    padding: 6,
  },
  summaryContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#666',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#f8c6a7',
  },
  checkoutButton: {
    backgroundColor: '#f8c6a7',
    borderRadius: 6,
    padding: 14,
    marginTop: 16,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});