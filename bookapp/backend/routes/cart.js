const express = require('express');
const { addToCart, getCart, updateQuantity, removeFromCart, clearCart } = require('../models/cart');
const { getAllBooks } = require('../models/book');
const router = express.Router();

router.post('/', async (req, res) => {
  const { userId, bookId, quantity } = req.body;
  try {
    await addToCart(userId, bookId, quantity);
    console.log(`Added to cart: userId=${userId}, bookId=${bookId}, quantity=${quantity}`);
    res.json({ message: 'Added to cart' });
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(400).json({ error: 'Error adding to cart' });
  }
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const cartItems = await getCart(userId);
    console.log('SQLite cart items:', cartItems);

    if (!cartItems || cartItems.length === 0) {
      return res.json([]);
    }

    const books = await getAllBooks();
    console.log('MongoDB books:', books);

    const cartWithBooks = cartItems.map(item => {
      const book = books.find(b => b.id === item.bookId);
      return {
        book: book || { id: item.bookId, title: 'Unknown Book' },
        quantity: item.quantity,
      };
    });

    console.log('Enriched cart data:', cartWithBooks);
    res.json(cartWithBooks);
  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

router.put('/:userId/:bookId', async (req, res) => {
  const { userId, bookId } = req.params;
  const { quantity } = req.body;
  try {
    await updateQuantity(userId, bookId, quantity);
    res.json({ message: 'Quantity updated' });
  } catch (err) {
    console.error('Error updating quantity:', err);
    res.status(400).json({ error: 'Error updating quantity' });
  }
});

router.delete('/:userId/:bookId', async (req, res) => {
  const { userId, bookId } = req.params;
  try {
    await removeFromCart(userId, bookId);
    res.json({ message: 'Removed from cart' });
  } catch (err) {
    console.error('Error removing from cart:', err);
    res.status(400).json({ error: 'Error removing from cart' });
  }
});

router.delete('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    await clearCart(userId);
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error('Error clearing cart:', err);
    res.status(400).json({ error: 'Error clearing cart' });
  }
});

module.exports = router;