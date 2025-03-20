const express = require('express');
const jwt = require('jsonwebtoken');
const { login, register, updateProfile, saveToken, logout, getUser, cleanupStaleTokens, getAllUsers } = require('../models/user');
const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  login(email, password, (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: row.id, email }, 'secretkey', { expiresIn: '1h' });
    saveToken(row.id, token, (err) => {
      if (err) return res.status(500).json({ error: 'Token save error' });
      res.json({ token, userId: row.id, isAdmin: row.isAdmin });
    });
  });
});

router.post('/register', (req, res) => {
  const { email, password, name } = req.body;
  register(email, password, name, (err) => {
    if (err) return res.status(400).json({ error: 'Email already exists' });
    res.json({ message: 'Registration successful' });
  });
});

router.put('/profile/:id', (req, res) => {
  const { id } = req.params;
  updateProfile(id, req.body, (err) => {
    if (err) return res.status(400).json({ error: 'Error updating profile' });
    res.json({ message: 'Profile updated' });
  });
});

router.post('/logout', (req, res) => {
  const { userId } = req.body;
  logout(userId, (err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.json({ message: 'Logged out successfully' });
  });
});

router.get('/user/:id', (req, res) => {
  const { id } = req.params;
  getUser(id, (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.status(404).json({ error: 'User not found' });
    res.json({ email: row.email, name: row.name, photo: row.photo });
  });
});

router.post('/cleanup-tokens', (req, res) => {
  cleanupStaleTokens((err) => {
    if (err) return res.status(500).json({ error: 'Cleanup failed' });
    res.json({ message: 'Stale tokens cleaned up' });
  });
});

router.get('/users', (req, res) => {
  getAllUsers((err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

module.exports = router;