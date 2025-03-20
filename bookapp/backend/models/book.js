const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, '../../db/bookstore.db'));

const initBooks = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      category TEXT NOT NULL,
      description TEXT,
      photo TEXT  -- New photo column
    )
  `, (err) => {
    if (err) console.error('Error creating books table:', err);
    else console.log('Books table ready');
  });
};

const createBook = (title, author, price, stock, category, description, photo, callback) => {
  db.run(
    'INSERT INTO books (title, author, price, stock, category, description, photo) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title, author, price, stock || 0, category || 'Uncategorized', description, photo || null],
    callback
  );
};

const getAllBooks = (callback) => {
  db.all('SELECT * FROM books', [], callback);
};

const updateBook = (id, title, author, price, stock, category, description, photo, callback) => {
  db.run(
    'UPDATE books SET title = ?, author = ?, price = ?, stock = ?, category = ?, description = ?, photo = ? WHERE id = ?',
    [title, author, price, stock, category, description, photo, id],
    callback
  );
};

const deleteBook = (id, callback) => {
  db.run('DELETE FROM books WHERE id = ?', [id], callback);
};

module.exports = {
  initBooks,
  createBook,
  getAllBooks,
  updateBook,
  deleteBook,
};