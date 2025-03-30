const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true }, // Custom ID field
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  photo: String,
  isAdmin: { type: Number, default: 0 }, // 0 for users, 1 for admin
});

const User = mongoose.model('User', userSchema);

const initUsers = async () => {
  try {
    console.log('Initializing users...');
    const adminExists = await User.findOne({ email: 'admin@bookstore.com' });
    if (!adminExists) {
      await User.create({
        id: 1, // Admin gets ID 1
        email: 'admin@bookstore.com',
        password: 'admin123',
        name: 'Admin',
        photo: null,
        isAdmin: 1,
      });
      console.log('Admin user inserted with id: 1, email: admin@bookstore.com');
    } else {
      console.log('Admin already exists in database');
    }
  } catch (err) {
    console.error('Error initializing users:', err);
  }
};

const login = (email, password) => User.findOne({ email, password });

const register = async (email, password, name, photo) => {
  try {
    // Find the highest existing id and increment it
    const lastUser = await User.findOne().sort({ id: -1 }); // Get user with highest id
    const nextId = lastUser && lastUser.id ? lastUser.id + 1 : 1; // Start at 1 if no users, 2 after admin

    // If this is not the admin and id: 1 exists, ensure we start at 2
    if (nextId === 1) {
      const adminExists = await User.findOne({ id: 1 });
      if (adminExists) {
        console.log('Admin exists with id: 1, setting nextId to 2');
        nextId = 2;
      }
    }

    console.log(`Assigning id: ${nextId} to new user: ${email}`);
    const user = await User.create({
      id: nextId,
      email,
      password,
      name,
      photo,
      isAdmin: 0, // All new registrations are regular users
    });
    console.log(`User registered: ${email}, id: ${nextId}, isAdmin: ${user.isAdmin}`);
    return user;
  } catch (err) {
    console.error('Register error:', err);
    throw err;
  }
};

const updateProfile = (id, data) => User.findOneAndUpdate({ id }, data, { new: true });

const getUser = (id) => User.findOne({ id });

const getAllUsers = () => 
  User.find({}, 'id email name isAdmin').then(users => 
    users.map(user => ({ id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin }))
  );

module.exports = { initUsers, login, register, updateProfile, getUser, getAllUsers, User };