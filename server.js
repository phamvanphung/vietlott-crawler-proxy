const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/vietlott', async (req, res) => {
  const id = req.query.id || '0115686';
  const url = `https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/view-detail-bingo18-result?nocatche=1&id=${id}`;

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // BẮT BUỘC trên Render.com
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });

    const html = await page.content();
    await browser.close();

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html); // Gửi lại toàn bộ trang HTML
  } catch (err) {
    console.error('Lỗi khi lấy trang Vietlott:', err);
    res.status(500).send('Lỗi server: không thể lấy dữ liệu Vietlott');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
