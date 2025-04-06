require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('../db/mongodb');
const { initSQLite } = require('../db/sqliteDB');
const { initBooks } = require('./models/book');
const { initUsers } = require('./models/user');
const bookRoutes = require('./routes/books');
const cartRoutes = require('./routes/cart');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:8081',
    'http://localhost:19006',
    'exp://192.168.100.16:19000',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Body:`, req.body);
  next();
});

// Root route to verify server is running
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Connect to MongoDB and initialize
connectDB().then(() => {
  console.log('MongoDB connected, initializing models...');
  initBooks();
  initUsers();
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

// Initialize SQLite
initSQLite();

app.use('/books', bookRoutes);
app.use('/cart', cartRoutes);
app.use('/auth', authRoutes);
app.use('/orders', orderRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));