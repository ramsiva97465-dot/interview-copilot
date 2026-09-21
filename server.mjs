import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '8080', 10);
const HOST = '0.0.0.0';
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.mjs': 'application/javascript; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.wasm': 'application/wasm',
};

function handleRequest(req, res) {
    try {
        const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        let pathname = decodeURIComponent(parsedUrl.pathname);

        // Direct installer download redirect
        if (pathname === '/download' || pathname === '/download/windows' || pathname.endsWith('.exe')) {
            res.writeHead(302, {
                'Location': 'https://github.com/ramsiva97465-dot/interview-copilot/releases/latest/download/MeetFloo-Setup-2.9.0.exe'
            });
            res.end();
            return;
        }

        // Security: prevent directory traversal
        let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
        let filePath = path.join(DIST_DIR, safePath);

        // If directory or root, serve index.html
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }

        // SPA fallback: if file does not exist, serve index.html
        if (!fs.existsSync(filePath)) {
            filePath = path.join(DIST_DIR, 'index.html');
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');
                return;
            }

            res.writeHead(200, {
                'Content-Type': contentType,
                'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
            });
            res.end(data);
        });
    } catch (err) {
        console.error('Server error:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
    }
}

// Bind to PORT, and also 5180 and 8080 so that whichever port Railway routes traffic to, it responds instantly!
const candidatePorts = Array.from(new Set([PORT, 5180, 8080, 3000].filter(p => !isNaN(p) && p > 0)));

for (const p of candidatePorts) {
    try {
        const s = http.createServer(handleRequest);
        s.listen(p, HOST, () => {
            console.log(`🚀 Production server listening on http://${HOST}:${p}`);
        });
        s.on('error', (e) => {
            if (e.code !== 'EADDRINUSE') {
                console.warn(`Port ${p} warning:`, e.message);
            }
        });
    } catch (err) {
        console.warn(`Could not bind to port ${p}:`, err.message);
    }
}
