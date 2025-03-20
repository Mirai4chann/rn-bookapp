const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, '../../db/bookstore.db'));

const initUsers = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        name TEXT,
        photo TEXT,
        jwtToken TEXT,
        isAdmin INTEGER DEFAULT 0
      )
    `, (err) => {
      if (err) console.error('Error creating users table:', err);
      else console.log('Users table ready');
    });
    db.run(`INSERT OR IGNORE INTO users (email, password, name, isAdmin) VALUES ('admin@bookstore.com', 'admin123', 'Admin', 1)`, (err) => {
      if (err) console.error('Error inserting admin:', err);
      else console.log('Admin user inserted or already exists');
    });
  });
};

const login = (email, password, callback) => {
  db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], callback);
};

const register = (email, password, name, photo, callback) => {
  db.run(
    'INSERT INTO users (email, password, name, photo, isAdmin) VALUES (?, ?, ?, ?, 0)',
    [email, password, name, photo || null],
    function (err) {
      if (err) callback(err);
      else callback(null, this.lastID);
    }
  );
};

const updateProfile = (id, data, callback) => {
  const { email, password, name, photo } = data;
  db.run(
    'UPDATE users SET email = ?, password = ?, name = ?, photo = ? WHERE id = ?',
    [email, password, name, photo, id],
    callback
  );
};

const saveToken = (id, jwtToken, callback) => {
  db.run('UPDATE users SET jwtToken = ? WHERE id = ?', [jwtToken, id], callback);
};

const logout = (id, callback) => {
  db.run('UPDATE users SET jwtToken = NULL WHERE id = ?', [id], callback);
};

const getUser = (id, callback) => {
  db.get('SELECT * FROM users WHERE id = ?', [id], callback);
};

const cleanupStaleTokens = (callback) => {
  db.run('UPDATE users SET jwtToken = NULL WHERE jwtToken IS NOT NULL AND id NOT IN (SELECT id FROM users WHERE jwtToken IS NOT NULL LIMIT 1)', callback);
};

const getAllUsers = (callback) => {
  db.all('SELECT id, email, name, isAdmin FROM users', [], callback);
};

module.exports = {
  initUsers,
  login,
  register,
  updateProfile,
  saveToken,
  logout,
  getUser,
  cleanupStaleTokens,
  getAllUsers,
};