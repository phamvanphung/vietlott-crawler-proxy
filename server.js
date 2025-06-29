const express = require('express');
const fetch = require('node-fetch'); // Nếu Node 18- dùng `global.fetch`
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors()); // ✅ Cho phép tất cả origin truy cập

app.get('/vietlott', async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).send('Missing id');

  const targetUrl = `https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/view-detail-bingo18-result?nocatche=1&id=${id}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'text/html',
        'Referer': 'https://vietlott.vn/'
      }
    });

    const html = await response.text();
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch Vietlott page');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
