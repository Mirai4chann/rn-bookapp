const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const { initUsers } = require('./models/user');

const app = express();
app.use(express.json());
app.use(cors());

initUsers();
app.use('/auth', authRoutes);

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));