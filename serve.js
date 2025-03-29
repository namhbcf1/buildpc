const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files
app.use(express.static(__dirname));

// All routes should serve cauhinhsan.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'cauhinhsan.html'));
});

// Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'cauhinhsan.html'));
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});