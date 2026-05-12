import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST_DIR = '/workspace/projects/dist/client';
const PORT = 5001;
const MAGIC_API = 'http://localhost:5000';

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json',
};

function serveFile(res, filePath) {
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

function proxyRequest(res, targetHost, targetPort, targetPath, req) {
  const options = {
    hostname: targetHost,
    port: targetPort,
    path: targetPath,
    method: req.method,
    headers: {
      ...req.headers,
      host: `${targetHost}:${targetPort}`,
    },
  };
  
  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  
  proxyReq.on('error', (err) => {
    console.error('Proxy error:', err.message);
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Backend error', message: err.message }));
  });
  
  req.pipe(proxyReq);
}

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key, x-hermes-token');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  // Proxy /api/magic/* to go-magic
  if (url.startsWith('/api/magic')) {
    const targetPath = url.replace(/^\/api\/magic/, '/api');
    proxyRequest(res, 'localhost', 5000, targetPath, req);
    return;
  }
  
  // Proxy /api/* to go-magic
  if (url.startsWith('/api/')) {
    proxyRequest(res, 'localhost', 5000, url, req);
    return;
  }
  
  // Serve static files
  let filePath = path.join(DIST_DIR, url === '/' ? 'index.html' : url);
  
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, 'index.html');
  }
  
  serveFile(res, filePath);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
  console.log(`Static files: ${DIST_DIR}`);
  console.log(`API Proxy: /api/* -> localhost:5000`);
});
