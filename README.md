# Clothing Search Backend API

This backend API allows a frontend to perform a natural language search for clothing items. It extracts keywords (such as color, item type, and price) from a user’s query and then searches a pre-populated JSON "sheet" of clothing data to return the best matching results.

## Features

- **Natural Language Query Parsing:** Extracts keywords like color, item type, and price from a user's search query.
- **JSON Data Search:** Searches a locally stored `clothingSheet.json` file for clothing items that match the query.
- **API Key Authentication:** Uses a custom `x-api-key` header to restrict access.
- **CORS Configured:** Allows requests from a specified frontend (e.g., `http://localhost:3000`).

## Prerequisites

- Node.js (version 14 or later recommended)
- npm (Node Package Manager)
- A text editor or IDE

## Setup Instructions

### 1. Clone the Repository

Clone the repository and navigate into the project folder:

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install Dependencies

Install the required packages:

```bash
npm install express cors dotenv
```

If you are using CommonJS (for example, with an `index.cjs` file), these dependencies will be installed automatically.

### 3. Configure Environment Variables

Create a `.env` file in the root of your backend project (the same folder as your server file). Add the following lines:

```ini
PORT=5000
MY_API_KEY=your_secret_key_here
```

- **PORT:** The port number the server will run on.
- **MY_API_KEY:** A secret API key that the backend expects to receive in every request's `x-api-key` header.

### 4. Create or Prepare the Clothing Data

Ensure you have a `clothingSheet.json` file in your backend project. This file should contain an array of clothing items, for example:

```json
[
  {
    "id": 1,
    "name": "Classic White Shirt",
    "description": "A timeless white shirt made from soft cotton.",
    "price": 25.99,
    "image": "https://via.placeholder.com/150?text=Classic+White+Shirt"
  },
  {
    "id": 2,
    "name": "Blue Denim Jeans",
    "description": "Comfortable blue jeans with a modern fit.",
    "price": 45.50,
    "image": "https://via.placeholder.com/150?text=Blue+Denim+Jeans"
  }
  // Add more items here or generate 1000+ entries as needed.
]
```

### 5. Backend Code

Below is an example `index.cjs` file (using CommonJS). If you prefer ES modules, adjust the import syntax and file extension accordingly.

```js
// index.cjs
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const clothingSheet = require('./clothingSheet.json');

const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests only from your trusted frontend (update as needed)
app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(express.json());

// Middleware to check API key
app.use((req, res, next) => {
  const providedKey = req.headers['x-api-key'];
  console.log('Provided key:', providedKey);
  console.log('Expected key:', process.env.MY_API_KEY);
  if (providedKey !== process.env.MY_API_KEY) {
    return res.status(403).json({ error: 'Forbidden: Invalid API key' });
  }
  next();
});

// Endpoint: Natural language search using clothingSheet.json
app.post('/api/clothing-search', (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }
  
  // Convert query to lowercase for matching
  const lowerQuery = query.toLowerCase();

  // Define known colors and item types to help with keyword extraction
  const knownColors = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'pink', 'orange', 'purple'];
  const knownItemTypes = ['shirt', 'jeans', 'jacket', 'trousers', 'sneakers', 'hat', 'skirt', 'sweater', 'blazer', 'coat', 'dress'];

  // Extract a color keyword from the query
  let extractedColor = null;
  for (const color of knownColors) {
    if (lowerQuery.includes(color)) {
      extractedColor = color;
      break;
    }
  }
  
  // Extract an item type keyword from the query
  let extractedType = null;
  for (const type of knownItemTypes) {
    if (lowerQuery.includes(type)) {
      extractedType = type;
      break;
    }
  }
  
  // Extract a target price from the query using a regex
  const priceMatch = lowerQuery.match(/(\d+(?:\.\d+)?)/);
  let targetPrice = null;
  if (priceMatch) {
    targetPrice = parseFloat(priceMatch[1]);
  }
  
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
  
  res.json(results);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 6. Running the Backend

If you are using the CommonJS version (with the `.cjs` extension):

```bash
node index.cjs
```

If you're using ES modules (with `"type": "module"` in package.json and your file named `index.js`), then run:

```bash
node index.js
```

You should see a message in the terminal indicating that the server is running.

### 7. Testing the API

Using a tool like Postman or cURL, send a POST request to:

```
http://localhost:5000/api/clothing-search
```

Include these headers:
- `Content-Type: application/json`
- `x-api-key: your_secret_key_here`

And a JSON body, for example:

```json
{
  "query": "I want to buy a white shirt for around 10 bucks"
}
```

The server should parse your query, filter the clothing sheet, and return matching results as JSON.

### 8. Frontend Integration

Your frontend should send the API key (from an environment variable with the prefix `REACT_APP_`, if desired) in the request headers and then display the returned data. Make sure your frontend is running on `http://localhost:3000` (or update the CORS settings accordingly).

---

## Troubleshooting

- **403 Error:**  
  If you get a 403 error, check that the header `x-api-key` in your request matches `MY_API_KEY` in your `.env` file.
- **Environment Variables:**  
  Verify that your `.env` file is in the correct location and that you restarted your server after any changes.
- **JSON File:**  
  Ensure that `clothingSheet.json` is present, correctly formatted, and in the expected directory.
- **API Testing:**  
  Use Postman or cURL to test your API endpoint separately from your frontend.

---

## License

This project is provided as-is. Feel free to modify and extend it to fit your requirements.

---
