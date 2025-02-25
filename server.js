const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Set default admin key if not in environment
process.env.ADMIN_KEY = process.env.ADMIN_KEY || 'toysmena_admin_2025';

const app = express();

// Middleware
app.use(cors({
  origin: ['https://toysmena.netlify.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const homeContentRoutes = require('./routes/admin/homeContent');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', homeContentRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Serve static files from the React app
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  // Handle React routing
  app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.url.startsWith('/api/')) {
      return res.status(404).json({ message: 'API endpoint not found' });
    }
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Server is running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Static files will be served from:', path.resolve(__dirname, 'client', 'build'));
});
