const express = require('express');
const {
  createBook,
  getAllBooks,
  updateBook,
  deleteBook,
} = require('../models/book');
const router = express.Router();

router.post('/', (req, res) => {
  const { title, author, price, stock, category, description, photo } = req.body;
  createBook(title, author, price, stock, category, description, photo, (err) => {
    if (err) return res.status(400).json({ error: 'Error creating book' });
    res.json({ message: 'Book created successfully' });
  });
});

router.get('/', (req, res) => {
  getAllBooks((err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, price, stock, category, description, photo } = req.body;
  updateBook(id, title, author, price, stock, category, description, photo, (err) => {
    if (err) return res.status(400).json({ error: 'Error updating book' });
    res.json({ message: 'Book updated successfully' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  deleteBook(id, (err) => {
    if (err) return res.status(400).json({ error: 'Error deleting book' });
    res.json({ message: 'Book deleted successfully' });
  });
});

module.exports = router;