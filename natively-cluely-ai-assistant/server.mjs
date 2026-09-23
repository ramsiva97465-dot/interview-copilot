import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

try {
    if (process.loadEnvFile) {
        process.loadEnvFile();
    }
} catch (e) {
    // .env might be missing in some environments, ignore
}

import { handleAuthRoutes } from './server/routes/auth.mjs';
import { handleUserRoutes } from './server/routes/user.mjs';
import { handlePaymentRoutes } from './server/routes/payments.mjs';
import { handleAdminRoutes } from './server/routes/admin.mjs';
import { handleDesktopLoginRoutes } from './server/routes/desktopLogin.mjs';

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

async function handleRequest(req, res) {
    try {
        const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        let pathname = decodeURIComponent(parsedUrl.pathname);

        // Direct installer download redirect
        if (pathname === '/download' || pathname === '/download/windows' || pathname.endsWith('.exe')) {
            res.writeHead(302, {
                'Location': 'https://github.com/ramsiva97465-dot/interview-copilot/releases/download/v2.9.2/MeetFloo-Setup-2.9.2.exe'
            });
            res.end();
            return;
        }

        // Enable CORS for API routes
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');

        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }

        // Desktop Login Route
        if (await handleDesktopLoginRoutes(req, res, pathname)) return;

        // ── API ROUTES ──
        if (pathname.startsWith('/api/')) {
            res.setHeader('Content-Type', 'application/json');

            // Dispatch to modular route handlers
            if (await handleAuthRoutes(req, res, pathname)) return;
            if (await handleUserRoutes(req, res, pathname, parsedUrl)) return;
            if (await handlePaymentRoutes(req, res, pathname)) return;
            if (await handleAdminRoutes(req, res, pathname)) return;

            // Unknown API endpoint
            res.writeHead(404);
            res.end(JSON.stringify({ success: false, error: 'API route not found' }));
            return;
        }

        // Static file & SPA fallback handler
        let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
        let filePath = path.join(DIST_DIR, safePath);

        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }

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

// Bind to PORT, and candidate fallback ports
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
