const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, '../../db/bookstore.db'));

const initCart = () => {
  return new Promise((resolve, reject) => {
    db.run(`
      CREATE TABLE IF NOT EXISTS cart (
        userId TEXT,
        bookId TEXT,
        quantity INTEGER,
        PRIMARY KEY (userId, bookId)
      )
    `, (err) => {
      if (err) {
        console.error('[initCart] Error creating table:', err);
        reject(err);
      } else {
        console.log('[initCart] Cart table initialized');
        resolve();
      }
    });
  });
};

const addToCart = (userId, bookId, quantity) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT quantity FROM cart WHERE userId = ? AND bookId = ?', [userId, bookId], (err, row) => {
      if (err) {
        console.error('[addToCart] Error checking existing item:', err);
        return reject(err);
      }
      if (row) {
        const newQuantity = row.quantity + quantity;
        db.run('UPDATE cart SET quantity = ? WHERE userId = ? AND bookId = ?', [newQuantity, userId, bookId], (err) => {
          if (err) {
            console.error('[addToCart] Error updating quantity:', err);
            reject(err);
          } else {
            console.log(`[addToCart] Updated quantity for userId=${userId}, bookId=${bookId} to ${newQuantity}`);
            resolve();
          }
        });
      } else {
        db.run('INSERT INTO cart (userId, bookId, quantity) VALUES (?, ?, ?)', [userId, bookId, quantity], (err) => {
          if (err) {
            console.error('[addToCart] Error inserting item:', err);
            reject(err);
          } else {
            console.log(`[addToCart] Inserted userId=${userId}, bookId=${bookId}, quantity=${quantity}`);
            resolve();
          }
        });
      }
    });
  });
};

const getCart = (userId) => {
  return new Promise((resolve, reject) => {
    db.all('SELECT bookId, quantity FROM cart WHERE userId = ?', [userId], (err, rows) => {
      if (err) {
        console.error(`[getCart] Error fetching cart for userId=${userId}:`, err);
        reject(err);
      } else {
        console.log(`[getCart] Retrieved cart for userId=${userId}:`, rows);
        resolve(rows);
      }
    });
  });
};

const updateQuantity = (userId, bookId, quantity) => {
  return new Promise((resolve, reject) => {
    db.run('UPDATE cart SET quantity = ? WHERE userId = ? AND bookId = ?', [quantity, userId, bookId], (err) => {
      if (err) {
        console.error(`[updateQuantity] Error updating userId=${userId}, bookId=${bookId}:`, err);
        reject(err);
      } else {
        console.log(`[updateQuantity] Updated userId=${userId}, bookId=${bookId} to quantity=${quantity}`);
        resolve();
      }
    });
  });
};

const removeFromCart = (userId, bookId) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM cart WHERE userId = ? AND bookId = ?', [userId, bookId], (err) => {
      if (err) {
        console.error(`[removeFromCart] Error removing userId=${userId}, bookId=${bookId}:`, err);
        reject(err);
      } else {
        console.log(`[removeFromCart] Removed userId=${userId}, bookId=${bookId}`);
        resolve();
      }
    });
  });
};

const clearCart = (userId) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM cart WHERE userId = ?', [userId], (err) => {
      if (err) {
        console.error(`[clearCart] Failed to clear cart for userId=${userId}:`, err);
        reject(err);
      } else {
        console.log(`[clearCart] Cleared cart for userId=${userId}`);
        resolve();
      }
    });
  });
};

module.exports = { initCart, addToCart, getCart, updateQuantity, removeFromCart, clearCart };