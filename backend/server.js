const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const config = require('./config/env');
const { handleWeatherRequest } = require('./routes/weatherRoute');

const publicDir = path.resolve(__dirname, '../frontend/public');
const contentTypes = { '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.html': 'text/html; charset=utf-8' };

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  if (request.method === 'GET' && requestUrl.pathname === '/api/weather') {
    return handleWeatherRequest(requestUrl, response);
  }
  if (request.method !== 'GET') {
    response.writeHead(405).end('Method not allowed');
    return;
  }

  const relativePath = requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname;
  const filePath = path.resolve(publicDir, `.${relativePath}`);
  if (!filePath.startsWith(publicDir) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    response.writeHead(404).end('Not found');
    return;
  }
  response.writeHead(200, { 'Content-Type': contentTypes[path.extname(filePath)] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(response);
});

server.listen(config.port, () => console.log(`Weather app running at http://localhost:${config.port}`));
