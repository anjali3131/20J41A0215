const express = require('express');
const axios = require('axios');

const app = express();
const port = 8008;

app.use(express.json());

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;

  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: 'Invalid input. Please provide valid URL(s).' });
  }

  const allNumbers = [];

  // Helper function to fetch numbers from a URL and handle timeouts
  async function fetchNumbersFromUrl(url) {
    try {
      const response = await axios.get(url, { timeout: 500 }); // Set timeout to 500 milliseconds
      if (response.status === 200) {
        const data = response.data.numbers;
        if (Array.isArray(data)) {
          allNumbers.push(...data);
        }
      }
    } catch (error) {
      // Ignore URLs that take too long to respond or have errors
      console.error(`Error while fetching numbers from ${url}: ${error.message}`);
    }
  }

  await Promise.all(urls.map(url => fetchNumbersFromUrl(url)));

  // Remove duplicates and sort in ascending order
  const uniqueNumbers = [...new Set(allNumbers)].sort((a, b) => a - b);

  res.json({ numbers: uniqueNumbers });
});

app.listen(port, () => {
  console.log(`Number Management Service is running on port ${port}`);
});