const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');
const os = require('os');

const app = express();

const publicDir = path.join(__dirname);

// Статика для вашего HTML/JS проекта
app.use(express.static(path.join(__dirname)));

// Отдаём все статические файлы
app.use(express.static(publicDir));

// Гарантируем, что при заходе на '/' отдаётся index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});


// Сертификаты
const options = {
  key: fs.readFileSync(path.join(__dirname, 'cert/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert/cert.pem'))
};

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (let name of Object.keys(interfaces)) {
    for (let iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Запуск HTTPS сервера
const port = 3000;
https.createServer(options, app).listen(port, () => {
  const ip = getLocalIP();
  console.log(`Сервер запущен на https://${ip}:${port}`);
});
