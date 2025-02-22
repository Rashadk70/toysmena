const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(express.json());

// Basic route to check if server is running
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'Server is running',
    time: new Date().toISOString(),
    message: 'Backend is accessible'
  });
});

// Start server
const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log('Try accessing:');
  console.log(`1. http://localhost:${PORT}/api/status`);
});
