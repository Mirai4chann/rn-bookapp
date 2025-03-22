const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const cartRoutes = require('./routes/cart');
const { initUsers } = require('./models/user');
const { initBooks } = require('./models/book');
const { initCart } = require('./models/cart');

const app = express();

// Detailed CORS configuration
app.use(cors({
  origin: [
    'http://localhost:8081',          // Expo web
    'http://localhost:19006',         // Expo web preview
    'exp://192.168.100.16:19000',     // Expo mobile
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include OPTIONS for preflight
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} from ${req.headers.origin}`);
  next();
});

initUsers();
initBooks();
initCart();

app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/cart', cartRoutes);

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));