const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, '../../db/bookstore.db'));

const initCart = () => {
  return new Promise((resolve, reject) => {
    db.run(`
      CREATE TABLE IF NOT EXISTS cart (
        userId TEXT,
        bookId INTEGER,
        quantity INTEGER,
        PRIMARY KEY (userId, bookId)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating cart table:', err);
        reject(err);
      } else {
        console.log('Cart table ready (SQLite)');
        resolve();
      }
    });
  });
};

const addToCart = (userId, bookId, quantity) => {
  return new Promise((resolve, reject) => {
    const numericBookId = parseInt(bookId); // Ensure bookId is a number
    db.get('SELECT quantity FROM cart WHERE userId = ? AND bookId = ?', [userId, numericBookId], (err, row) => {
      if (err) return reject(err);
      if (row) {
        const newQuantity = row.quantity + quantity;
        db.run('UPDATE cart SET quantity = ? WHERE userId = ? AND bookId = ?', [newQuantity, userId, numericBookId], (err) => {
          if (err) reject(err);
          else resolve();
        });
      } else {
        db.run('INSERT INTO cart (userId, bookId, quantity) VALUES (?, ?, ?)', [userId, numericBookId, quantity], (err) => {
          if (err) reject(err);
          else resolve();
        });
      }
    });
  });
};

const getCart = (userId) => {
  return new Promise((resolve, reject) => {
    db.all('SELECT bookId, quantity FROM cart WHERE userId = ?', [userId], (err, rows) => {
      if (err) reject(err);
      else {
        console.log('Raw cart data from SQLite:', rows);
        resolve(rows);
      }
    });
  });
};

const updateQuantity = (userId, bookId, quantity) => {
  return new Promise((resolve, reject) => {
    const numericBookId = parseInt(bookId);
    db.run('UPDATE cart SET quantity = ? WHERE userId = ? AND bookId = ?', [quantity, userId, numericBookId], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const removeFromCart = (userId, bookId) => {
  return new Promise((resolve, reject) => {
    const numericBookId = parseInt(bookId);
    db.run('DELETE FROM cart WHERE userId = ? AND bookId = ?', [userId, numericBookId], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const clearCart = (userId) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM cart WHERE userId = ?', [userId], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

module.exports = { initCart, addToCart, getCart, updateQuantity, removeFromCart, clearCart };