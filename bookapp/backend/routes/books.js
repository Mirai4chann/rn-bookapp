const express = require('express');
const {
  createBook,
  getAllBooks,
  updateBook,
  deleteBook,
} = require('../models/book');
const router = express.Router();

router.post('/', async (req, res) => {
  const { title, author, price, stock, category, description, photo } = req.body;
  console.log('Received book data:', { title, author, price, stock, category, description, photo });

  if (!title || !author || !price || !stock || !category) {
    return res.status(400).json({ error: 'Title, author, price, stock, and category are required' });
  }

  if (typeof price !== 'number' || isNaN(price)) {
    return res.status(400).json({ error: 'Price must be a valid number' });
  }

  if (!Number.isInteger(stock)) {
    return res.status(400).json({ error: 'Stock must be an integer' });
  }

  try {
    const book = await createBook(title, author, price, stock, category, description, photo);
    console.log('Book created:', book);
    res.status(201).json({ message: 'Book created successfully', book });
  } catch (err) {
    console.error('Book creation error:', err);
    res.status(400).json({ error: `Validation error: ${err.message}` });
  }
});

router.get('/', async (req, res) => {
  try {
    const books = await getAllBooks();
    res.json(books);
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, author, price, stock, category, description, photo } = req.body;
  try {
    const book = await updateBook(parseInt(id), title, author, price, stock, category, description, photo);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book updated successfully', book });
  } catch (err) {
    console.error('Book update error:', err);
    res.status(400).json({ error: 'Error updating book' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const book = await deleteBook(parseInt(id));
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error('Book deletion error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;