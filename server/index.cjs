// index.cjs
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const clothingSheet = require('./clothingSheet.json');

const app = express();
const PORT = process.env.PORT || 5000;

// More permissive CORS configuration for development
app.use(cors());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

app.use(express.json());

// Middleware to check API key
app.use((req, res, next) => {
  const providedKey = req.headers['x-api-key'];
  console.log('Received API key:', providedKey);
  console.log('Expected API key:', process.env.MY_API_KEY);
  
  if (!providedKey) {
    console.log('No API key provided');
    return res.status(401).json({ error: 'API key is required' });
  }
  
  if (providedKey !== process.env.MY_API_KEY) {
    console.log('Invalid API key');
    return res.status(403).json({ error: 'Forbidden: Invalid API key' });
  }
  next();
});

// New endpoint: Natural language search using clothingSheet.json
app.post('/api/clothing-search', (req, res) => {
  console.log('Received search request:', req.body);
  const { query } = req.body;
  if (!query) {
    console.log('No query provided');
    return res.status(400).json({ error: 'Query parameter is required' });
  }
  
  // Convert query to lowercase for matching
  const lowerQuery = query.toLowerCase();
  console.log('Processing query:', lowerQuery);

  // Define known colors and item types to help with keyword extraction
  const knownColors = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'pink', 'orange', 'purple'];
  const knownItemTypes = ['shirt', 'jeans', 'jacket', 'trousers', 'sneakers', 'hat', 'skirt', 'sweater', 'blazer', 'coat', 'dress', 'shorts'];

  // Extract a color keyword from the query
  let extractedColor = null;
  for (const color of knownColors) {
    if (lowerQuery.includes(color)) {
      extractedColor = color;
      break;
    }
  }
  console.log('Extracted color:', extractedColor);
  
  // Extract an item type keyword from the query
  let extractedType = null;
  for (const type of knownItemTypes) {
    if (lowerQuery.includes(type)) {
      extractedType = type;
      break;
    }
  }
  console.log('Extracted type:', extractedType);
  
  // Extract a target price from the query using a regex
  const priceMatch = lowerQuery.match(/(\d+(?:\.\d+)?)/);
  let targetPrice = null;
  if (priceMatch) {
    targetPrice = parseFloat(priceMatch[1]);
  }
  console.log('Extracted price:', targetPrice);
  
  // Filter the clothing sheet for matching results
  let results = clothingSheet;
  if (extractedColor) {
    results = results.filter(item => item.name.toLowerCase().includes(extractedColor));
  }
  if (extractedType) {
    results = results.filter(item => item.name.toLowerCase().includes(extractedType));
  }
  if (targetPrice !== null) {
    // Allow a ±20% tolerance for price matching
    const tolerance = targetPrice * 0.2;
    results = results.filter(item => Math.abs(item.price - targetPrice) <= tolerance);
  }
  
  console.log('Found results:', results.length);
  res.json(results);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('API Key:', process.env.MY_API_KEY);
  console.log('CORS enabled for all origins');
});
