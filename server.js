const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Enable CORS for React app
app.use(cors());

// Import the orders handler
const ordersHandler = require('./api/orders');

// Convert the Vercel serverless function to Express middleware
app.get('/api/orders', async (req, res) => {
  try {
    // Call the handler with modified req/res objects to match Vercel's format
    await ordersHandler(req, res);
  } catch (error) {
    console.error('Error in orders endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/orders`);
}); 