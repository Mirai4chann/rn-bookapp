import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from '../redux/orders';
import { Ionicons } from '@expo/vector-icons';

export default function AdminOrdersScreen() {
  const { allOrders, error, loading } = useSelector((state) => state.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusUpdate = (id, status) => {
    dispatch(updateOrderStatus({ id, status }))
      .catch((err) => alert(`Failed to update status: ${err.message || 'Unknown error'}`));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return '#F39C12';
      case 'To Ship': return '#3498DB';
      case 'To Receive': return '#9B59B6';
      case 'Delivered': return '#2ECC71';
      default: return '#95A5A6';
    }
  };

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>ORDER #{item.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="person" size={16} color="#7F8C8D" />
          <Text style={styles.detailText}>User ID: {item.userId}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="cash" size={16} color="#7F8C8D" />
          <Text style={styles.detailText}>Total: ${item.totalPrice.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, item.status !== 'Pending' && styles.disabledButton]}
          onPress={() => handleStatusUpdate(item.id, 'To Ship')}
          disabled={item.status !== 'Pending'}
        >
          <Text style={styles.actionButtonText}>Mark as Shipping</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, item.status !== 'To Ship' && styles.disabledButton]}
          onPress={() => handleStatusUpdate(item.id, 'To Receive')}
          disabled={item.status !== 'To Ship'}
        >
          <Text style={styles.actionButtonText}>Mark as In Transit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, item.status !== 'To Receive' && styles.disabledButton]}
          onPress={() => handleStatusUpdate(item.id, 'Delivered')}
          disabled={item.status !== 'To Receive'}
        >
          <Text style={styles.actionButtonText}>Mark as Delivered</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#E74C3C" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => dispatch(fetchAllOrders())}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order Management</Text>
        <Text style={styles.orderCount}>{allOrders.length} {allOrders.length === 1 ? 'order' : 'orders'}</Text>
      </View>

      <FlatList 
        data={allOrders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="cube" size={48} color="#BDC3C7" />
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
  },
  orderCount: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  orderDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#34495E',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#4A90E2',
    padding: 10,
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#BDC3C7',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 16,
    color: '#7F8C8D',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F8F9FA',
  },
  errorText: {
    marginTop: 20,
    color: '#E74C3C',
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#4A90E2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#95A5A6',
  },
});