const express = require('express');
const { addToCart, getCart, updateQuantity, removeFromCart, clearCart } = require('../models/cart');
const { getAllBooks } = require('../models/book');
const router = express.Router();

router.post('/', async (req, res) => {
  const { userId, bookId, quantity } = req.body;
  try {
    await addToCart(userId, bookId, quantity);
    console.log(`[POST /cart] Added to cart: userId=${userId}, bookId=${bookId}, quantity=${quantity}`);
    res.json({ message: 'Added to cart' });
  } catch (err) {
    console.error('[POST /cart] Error adding to cart:', err);
    res.status(400).json({ error: 'Error adding to cart' });
  }
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const cartItems = await getCart(userId);
    console.log(`[GET /cart/${userId}] Cart items from DB:`, cartItems);
    if (!cartItems || cartItems.length === 0) {
      console.log(`[GET /cart/${userId}] No items found, returning empty array`);
      return res.json([]);
    }
    const books = await getAllBooks();
    console.log(`[GET /cart/${userId}] Books from DB:`, books);
    const cartWithBooks = cartItems.map(item => {
      const book = books.find(b => b.id.toString() === item.bookId.toString());
      return { book: book || { id: item.bookId, title: 'Unknown Book' }, quantity: item.quantity };
    });
    console.log(`[GET /cart/${userId}] Response:`, cartWithBooks);
    res.json(cartWithBooks);
  } catch (err) {
    console.error(`[GET /cart/${userId}] Error fetching cart:`, err);
    res.status(500).json({ error: 'Database error' });
  }
});

router.put('/:userId/:bookId', async (req, res) => {
  const { userId, bookId } = req.params;
  const { quantity } = req.body;
  try {
    await updateQuantity(userId, bookId, quantity);
    console.log(`[PUT /cart/${userId}/${bookId}] Quantity updated to ${quantity}`);
    res.json({ message: 'Quantity updated' });
  } catch (err) {
    console.error(`[PUT /cart/${userId}/${bookId}] Error updating quantity:`, err);
    res.status(400).json({ error: 'Error updating quantity' });
  }
});

router.delete('/:userId/:bookId', async (req, res) => {
  const { userId, bookId } = req.params;
  try {
    await removeFromCart(userId, bookId);
    console.log(`[DELETE /cart/${userId}/${bookId}] Removed from cart`);
    res.json({ message: 'Removed from cart' });
  } catch (err) {
    console.error(`[DELETE /cart/${userId}/${bookId}] Error removing from cart:`, err);
    res.status(400).json({ error: 'Error removing from cart' });
  }
});

router.delete('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    await clearCart(userId);
    console.log(`[DELETE /cart/${userId}] Cart cleared for user ${userId}`);
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error(`[DELETE /cart/${userId}] Error clearing cart:`, err);
    res.status(400).json({ error: 'Error clearing cart' });
  }
});

module.exports = router;