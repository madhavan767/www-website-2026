import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function wwiStoragePlugin() {
  const storeFilePath = path.resolve(__dirname, 'src/data/liveStore.json');

  return {
    name: 'wwi-storage-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const urlStr = req.url || '';
        if (urlStr.startsWith('/api/wwi-store')) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.end();
            return;
          }

          if (req.method === 'GET') {
            try {
              if (fs.existsSync(storeFilePath)) {
                const data = fs.readFileSync(storeFilePath, 'utf-8');
                res.setHeader('Content-Type', 'application/json');
                res.end(data || '{}');
              } else {
                res.setHeader('Content-Type', 'application/json');
                res.end('{}');
              }
            } catch (err) {
              res.setHeader('Content-Type', 'application/json');
              res.end('{}');
            }
            return;
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                const payload = JSON.parse(body);
                let current = {};
                if (fs.existsSync(storeFilePath)) {
                  try {
                    current = JSON.parse(fs.readFileSync(storeFilePath, 'utf-8') || '{}');
                  } catch (e) {}
                }
                const updated = { ...current, ...payload };
                fs.writeFileSync(storeFilePath, JSON.stringify(updated, null, 2), 'utf-8');
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, timestamp: Date.now() }));
              } catch (err) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), wwiStoragePlugin()],
  server: {
    port: 3000,
    open: false
  }
});
