const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getAllOrders, updateOrderStatus } = require('../models/orders');
const { v4: uuidv4 } = require('uuid');

router.post('/', async (req, res) => {
  try {
    const orderData = { id: uuidv4(), ...req.body };
    console.log('Received order data:', orderData);
    const order = await createOrder(orderData);
    res.status(201).json(order);
  } catch (err) {
    console.error('Error creating order:', err.message);
    res.status(400).json({ error: err.message || 'Failed to create order' });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const orders = await getUserOrders(req.params.userId);
    res.json(orders);
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (err) {
    console.error('Error fetching all orders:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await updateOrderStatus(req.params.id, status);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(400).json({ error: 'Error updating order status' });
  }
});

module.exports = router;