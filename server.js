import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from the project folder
app.use(express.static(path.join(__dirname)));

// Endpoint for executing code
app.post('/execute', async (req, res) => {
  try {
    // Retrieve code and language from the request body
    const { code, language } = req.body;

    // JDoodle API credentials from environment variables
    const clientId = process.env.JD_CLIENT_ID;
    const clientSecret = process.env.JD_CLIENT_SECRET;

    // Make a request to the JDoodle API
    const response = await fetch('https://api.jdoodle.com/v1/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientId,
        clientSecret,
        script: code,
        language,
      }),
    });

    // Check if the request was successful
    if (response.ok) {
      const data = await response.json();
      console.log('JDoodle API Response:', data); // Log API response
      res.json(data);
    } else {
      // Log the error response
      const errorResponse = await response.json();
      console.error('Failed to execute code:', response.status, response.statusText, errorResponse);
      res.status(response.status).json({ error: 'Failed to execute code' });
    }
  } catch (error) {
    // Log the error
    console.error('Error executing code:', error);
    res.status(500).json({ error: 'An error occurred while executing the code' });
  }
});

// Define route handler for the root URL
app.get('/', (req, res) => {
  // If the index.html is served statically, it should be accessible at the root URL
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
