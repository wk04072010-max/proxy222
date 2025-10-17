const express = require('express');
const axios = require('axios');
const puppeteer = require('puppeteer');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.static('public'));

app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  try {
    const response = await axios.post('https://google.serper.dev/search', {
      q: query
    }, {
      headers: {
        'X-API-KEY': process.env.SERPER_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).send('検索失敗: ' + err.message);
  }
});

app.get('/proxy', async (req, res) => {
  const rawUrl = req.query.u;
  const url = Buffer.from(rawUrl, 'base64').toString('utf-8');

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    const content = await page.content();
    await browser.close();
    res.send(content);
  } catch (err) {
    res.status(500).send('取得失敗: ' + err.message);
  }
});

app.listen(3000, () => console.log('🚀 Server running on port 3000'));
