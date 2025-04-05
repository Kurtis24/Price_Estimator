const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000; // you can use any port you prefer

// Middleware
app.use(cors());
app.use(express.json());

// Simple test route
app.get('/', (req, res) => {
  res.send({ message: 'Hello from the Express server!' });
});

// Example POST route
app.post('/api/data', (req, res) => {
  const data = req.body; // after app.use(express.json())
  // do something with data here (e.g., save to DB)
  res.send({ status: 'success', receivedData: data });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
