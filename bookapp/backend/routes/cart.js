const express = require('express');
const router = express.Router();
const { addToCart, getCart, updateQuantity, removeFromCart, clearCart } = require('../models/cart');

router.post('/', (req, res) => {
  const { userId, bookId, quantity } = req.body;
  addToCart(userId, bookId, quantity, (err) => {
    if (err) return res.status(400).json({ error: 'Error adding to cart' });
    res.json({ message: 'Added to cart' });
  });
});

router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  getCart(userId, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

router.put('/:userId/:bookId', (req, res) => {
  const { userId, bookId } = req.params;
  const { quantity } = req.body;
  updateQuantity(userId, bookId, quantity, (err) => {
    if (err) return res.status(400).json({ error: 'Error updating quantity' });
    res.json({ message: 'Quantity updated' });
  });
});

router.delete('/:userId/:bookId', (req, res) => {
  const { userId, bookId } = req.params;
  removeFromCart(userId, bookId, (err) => {
    if (err) return res.status(400).json({ error: 'Error removing from cart' });
    res.json({ message: 'Removed from cart' });
  });
});

router.delete('/:userId', (req, res) => {
  const { userId } = req.params;
  clearCart(userId, (err) => {
    if (err) return res.status(400).json({ error: 'Error clearing cart' });
    res.json({ message: 'Cart cleared' });
  });
});

module.exports = router;