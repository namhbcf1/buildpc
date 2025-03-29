const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Liệt kê tất cả các file trong thư mục gốc
console.log('Các file trong thư mục gốc:');
try {
  const files = fs.readdirSync(__dirname);
  files.forEach(file => {
    const stats = fs.statSync(path.join(__dirname, file));
    console.log(`- ${file} (${stats.isDirectory() ? 'thư mục' : 'file'}, ${stats.size} bytes)`);
  });
} catch (err) {
  console.error('Lỗi khi đọc thư mục:', err);
}

// Serve static files
app.use(express.static(__dirname));

// Kiểm tra xem file cauhinhsan.html có tồn tại không
const htmlPath = path.join(__dirname, 'cauhinhsan.html');
const exists = fs.existsSync(htmlPath);
console.log(`File cauhinhsan.html ${exists ? 'TỒN TẠI' : 'KHÔNG TỒN TẠI'} tại ${htmlPath}`);
if (exists) {
  try {
    const stats = fs.statSync(htmlPath);
    console.log(`- Kích thước: ${stats.size} bytes`);
    console.log(`- Thời gian sửa đổi: ${stats.mtime}`);
  } catch (err) {
    console.error('Lỗi khi đọc thông tin file cauhinhsan.html:', err);
  }
}

// Kiểm tra xem file components-data.js có tồn tại không
const dataPath = path.join(__dirname, 'components-data.js');
const dataExists = fs.existsSync(dataPath);
console.log(`File components-data.js ${dataExists ? 'TỒN TẠI' : 'KHÔNG TỒN TẠI'} tại ${dataPath}`);
if (dataExists) {
  try {
    const stats = fs.statSync(dataPath);
    console.log(`- Kích thước: ${stats.size} bytes`);
    console.log(`- Thời gian sửa đổi: ${stats.mtime}`);
  } catch (err) {
    console.error('Lỗi khi đọc thông tin file components-data.js:', err);
  }
}

// Kiểm tra xem file buildsan.js có tồn tại không
const jsPath = path.join(__dirname, 'buildsan.js');
const jsExists = fs.existsSync(jsPath);
console.log(`File buildsan.js ${jsExists ? 'TỒN TẠI' : 'KHÔNG TỒN TẠI'} tại ${jsPath}`);
if (jsExists) {
  try {
    const stats = fs.statSync(jsPath);
    console.log(`- Kích thước: ${stats.size} bytes`);
    console.log(`- Thời gian sửa đổi: ${stats.mtime}`);
  } catch (err) {
    console.error('Lỗi khi đọc thông tin file buildsan.js:', err);
  }
}

// All routes should serve cauhinhsan.html
app.get('/', (req, res) => {
  console.log('Truy cập vào đường dẫn /');
  if (!exists) {
    console.error('File cauhinhsan.html không tồn tại - trả về lỗi 404');
    return res.status(404).send('File cauhinhsan.html không tồn tại');
  }
  
  console.log('Gửi file cauhinhsan.html đến client');
  res.sendFile(htmlPath);
});

// Fallback route
app.get('*', (req, res) => {
  console.log(`Truy cập vào đường dẫn: ${req.path}`);
  if (!exists) {
    console.error('File cauhinhsan.html không tồn tại - trả về lỗi 404');
    return res.status(404).send('File cauhinhsan.html không tồn tại');
  }
  
  console.log('Gửi file cauhinhsan.html đến client');
  res.sendFile(htmlPath);
});

app.listen(port, () => {
  console.log(`-------------------------------------------------`);
  console.log(`Server đang chạy tại http://localhost:${port}`);
  console.log(`Thư mục gốc: ${__dirname}`);
  console.log(`-------------------------------------------------`);
  console.log('Mở trình duyệt và truy cập vào địa chỉ:');
  console.log(`http://localhost:${port}`);
});