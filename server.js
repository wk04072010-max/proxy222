const express = require('express');
const axios = require('axios');
const puppeteer = require('puppeteer');
const app = express();

app.get('/proxy', async (req, res) => {
  const rawUrl = req.query.u;
  const url = Buffer.from(rawUrl, 'base64').toString('utf-8');

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
    await page.goto(url, { waitUntil: 'networkidle2' });
    const content = await page.content();
    await browser.close();
    res.send(content);
  } catch (err) {
    res.status(500).send('取得失敗: ' + err.message);
  }
});
