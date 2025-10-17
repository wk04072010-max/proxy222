const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.static('public'));

app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  const response = await axios.post('https://google.serper.dev/search', {
    q: query
  }, {
    headers: {
      'X-API-KEY': process.env.SERPER_API_KEY,
      'Content-Type': 'application/json'
    }
  });
  res.json(response.data);
});

app.listen(3000, () => console.log('Serper Search running on port 3000'));
