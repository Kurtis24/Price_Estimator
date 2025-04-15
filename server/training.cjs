// index.cjs
const express = require('express');
const app = express();

// Middleware to parse JSON payloads.
app.use(express.json());

// Global variable to store the training result.
let trainedData = null;

// Flag to track whether training is already in progress.
let trainingInProgress = false;

/**
 * Simulated training function.
 * In a real application, replace this with your pokerbot training logic.
 * This function returns a promise that resolves with your training data.
 */
function trainModel() {
  return new Promise((resolve, reject) => {
    console.log("Training started...");
    // Simulate a long-running training process with setTimeout.
    setTimeout(() => {
      // Example: create dummy training data based on simulation or real training
      const data = {
        timestamp: new Date(),
        modelVersion: "v1.0.0",
        strategyMetrics: {
          fold: Math.random(),
          call: Math.random(),
          raise: Math.random()
        },
        winRate: Math.random().toFixed(2)
      };
      console.log("Training completed.");
      resolve(data);
    }, 5000); // Simulate a delay of 5 seconds.
  });
}

/**
 * POST /train
 * Endpoint to trigger the training process.
 * Returns the training data upon completion.
 */
app.post('/train', async (req, res) => {
  if (trainingInProgress) {
    return res.status(409).json({ message: "Training is already in progress." });
  }
  trainingInProgress = true;
  try {
    trainedData = await trainModel();
    trainingInProgress = false;
    // You can optionally also notify the frontend immediately here if needed.
    res.json({ message: "Training completed successfully.", data: trainedData });
  } catch (error) {
    trainingInProgress = false;
    res.status(500).json({ message: "An error occurred during training.", error });
  }
});

/**
 * GET /data
 * Endpoint to provide the latest training results to the frontend.
 */
app.get('/data', (req, res) => {
  if (!trainedData) {
    return res.status(404).json({ message: "No training data available yet." });
  }
  res.json(trainedData);
});

/**
 * Start the server.
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Pokerbot backend server is running on port ${PORT}`);
});
