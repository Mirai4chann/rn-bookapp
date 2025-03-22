const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, '../../db/bookstore.db'));

const initCart = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS carts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      bookId INTEGER,
      quantity INTEGER,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (bookId) REFERENCES books(id)
    )
  `, (err) => {
    if (err) console.error('Error creating carts table:', err);
    else console.log('Carts table ready');
  });
};

const addToCart = (userId, bookId, quantity, callback) => {
  db.get('SELECT * FROM carts WHERE userId = ? AND bookId = ?', [userId, bookId], (err, row) => {
    if (err) return callback(err);
    if (row) {
      db.run('UPDATE carts SET quantity = quantity + ? WHERE userId = ? AND bookId = ?', [quantity, userId, bookId], callback);
    } else {
      db.run('INSERT INTO carts (userId, bookId, quantity) VALUES (?, ?, ?)', [userId, bookId, quantity], callback);
    }
  });
};

const getCart = (userId, callback) => {
  db.all(`
    SELECT books.*, carts.quantity 
    FROM carts 
    JOIN books ON carts.bookId = books.id 
    WHERE carts.userId = ?
  `, [userId], callback);
};

const updateQuantity = (userId, bookId, quantity, callback) => {
  db.run('UPDATE carts SET quantity = ? WHERE userId = ? AND bookId = ?', [quantity, userId, bookId], callback);
};

const removeFromCart = (userId, bookId, callback) => {
  db.run('DELETE FROM carts WHERE userId = ? AND bookId = ?', [userId, bookId], callback);
};

const clearCart = (userId, callback) => {
  db.run('DELETE FROM carts WHERE userId = ?', [userId], callback);
};

module.exports = { initCart, addToCart, getCart, updateQuantity, removeFromCart, clearCart };