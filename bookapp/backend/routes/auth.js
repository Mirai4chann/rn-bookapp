const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { login, register, updateProfile, getUser, getAllUsers, User } = require('../models/user');
const { saveToken, logout } = require('../models/token');
const router = express.Router();

console.log('User model imported in auth.js:', User ? 'Defined' : 'Undefined');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await login(email, password);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email }, 'secretkey', { expiresIn: '1h' });
    saveToken(user.id.toString(), token, (err) => {
      if (err) return res.status(500).json({ error: 'Token save error' });
      res.json({ token, userId: user.id.toString(), isAdmin: user.isAdmin });
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/register', async (req, res) => {
  const { email, password, name, photo } = req.body;
  console.log('Register request body:', { email, password, name, photo });
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (!User) {
    console.error('User model is undefined in register route');
    return res.status(500).json({ error: 'Server configuration error: User model not available' });
  }

  try {
    console.log(`Checking if email exists (case-insensitive): ${email}`);
    const existingUser = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    console.log('Existing user result:', existingUser ? existingUser.email : 'None found');

    if (existingUser) {
      console.log(`Email ${email} already exists in database`);
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = await register(email, password, name, photo);
    res.status(201).json({ message: 'Registration successful', userId: user.id.toString() });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      console.log(`Duplicate key error on field: ${field}, value: ${err.keyValue[field]}`);
      if (field === 'email') {
        return res.status(400).json({ error: 'Email already exists' });
      } else if (field === 'id') {
        return res.status(400).json({ error: 'ID conflict detected' });
      }
      return res.status(400).json({ error: `Duplicate key error on ${field}` });
    } else {
      console.error('Registration error:', err.message);
      res.status(400).json({ error: `Validation error: ${err.message}` });
    }
  }
});

router.put('/profile/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await updateProfile(parseInt(id), req.body);
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(400).json({ error: 'Error updating profile' });
  }
});

router.post('/logout', (req, res) => {
  const { userId } = req.body;
  logout(userId, (err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.json({ message: 'Logged out successfully' });
  });
});

router.get('/user/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await getUser(parseInt(id));
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ email: user.email, name: user.name, photo: user.photo });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;