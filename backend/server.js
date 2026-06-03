require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes_bt5/auth.routes');
const productRoutes = require('./routes_bt5/product.routes');

// Import Sequelize
const sequelize = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/baitap6', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Connect to MySQL via Sequelize
sequelize.authenticate()
  .then(() => {
    console.log('MySQL connected via Sequelize');
    // Sync models
    return sequelize.sync();
  })
  .then(() => {
    console.log('MySQL models synchronized');
  })
  .catch((err) => {
    console.error('MySQL connection error:', err);
  });

// Routes
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
