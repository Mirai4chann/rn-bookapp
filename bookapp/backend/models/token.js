const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, '../../db/bookstore.db'));

const initTokens = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tokens (
      userId TEXT PRIMARY KEY,
      jwtToken TEXT
    )
  `, (err) => {
    if (err) console.error('Error creating tokens table:', err);
    else console.log('Tokens table ready (SQLite)');
  });
};

const saveToken = (userId, jwtToken, callback) => {
  db.run('INSERT OR REPLACE INTO tokens (userId, jwtToken) VALUES (?, ?)', [userId, jwtToken], callback);
};

const getToken = (userId, callback) => {
  db.get('SELECT jwtToken FROM tokens WHERE userId = ?', [userId], callback);
};

const logout = (userId, callback) => {
  db.run('DELETE FROM tokens WHERE userId = ?', [userId], callback);
};

module.exports = { initTokens, saveToken, getToken, logout };