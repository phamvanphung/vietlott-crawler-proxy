// server.js
const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Cho phép CORS để gọi từ FE (localhost hoặc frontend host)
app.use(cors());


app.get('/vietlott', async (req, res) => {
  const vietlottId = req.query.id;

  if (!vietlottId) {
    return res.status(400).send('Thiếu tham số id');
  }

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    const targetUrl = `https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/view-detail-bingo18-result?nocatche=1&id=${vietlottId}`;
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

    await page.waitForTimeout(3000); // đợi nếu bị Cloudflare chặn

    const html = await page.content();

    await browser.close();

    // Trả về raw HTML như một trang web bình thường
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    console.error('Lỗi khi lấy trang Vietlott:', err);
    res.status(500).send('Lỗi server: ' + err.message);
  }
});

app.get('/', (req, res) => {
  res.send('🟢 Vietlott Puppeteer Proxy is running!');
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
