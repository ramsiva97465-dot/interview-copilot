import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '8080', 10);
const HOST = '0.0.0.0';
const DIST_DIR = path.join(__dirname, 'dist');
const STORE_FILE = path.join(__dirname, 'meetfloo_admin_store.json');

// Persistent Admin & User Credits Store
let adminStore = {
    users: [
        { id: 'usr_1', email: 'customer1@example.com', minutes_used: 120, credits: 1000, plan: 'pro', status: 'active', created_at: new Date(Date.now() - 86400000 * 3).toISOString(), last_active: new Date().toISOString() },
        { id: 'usr_2', email: 'dev@meetfloo.ai', minutes_used: 340, credits: 2500, plan: 'ultra', status: 'active', created_at: new Date(Date.now() - 86400000 * 7).toISOString(), last_active: new Date().toISOString() },
    ],
    payments: [
        { id: 'upi_1', user_email: 'customer1@example.com', utr_number: '426819203847', amount: 1499, credits: 1000, status: 'approved', license_key: 'MEETFLOO-PRO-9812-A3K9', created_at: new Date(Date.now() - 3600000 * 4).toISOString() },
    ],
    licenses: [
        { id: 'lic_1', email: 'customer1@example.com', license_key: 'MEETFLOO-PRO-9812-A3K9', plan: 'pro', credits: 1000, created_at: new Date(Date.now() - 3600000 * 4).toISOString() },
    ]
};

// Load persistent data if exists
try {
    if (fs.existsSync(STORE_FILE)) {
        const raw = fs.readFileSync(STORE_FILE, 'utf8');
        adminStore = JSON.parse(raw);
    }
} catch (e) {
    console.warn('Could not read admin store file:', e.message);
}

function saveStore() {
    try {
        fs.writeFileSync(STORE_FILE, JSON.stringify(adminStore, null, 2), 'utf8');
    } catch (e) {
        console.warn('Could not save admin store file:', e.message);
    }
}

function parseJsonBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                resolve(JSON.parse(body || '{}'));
            } catch {
                resolve({});
            }
        });
    });
}

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
                'Location': 'https://github.com/ramsiva97465-dot/interview-copilot/releases/download/v2.9.0/MeetFloo-Setup-2.9.0.exe'
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

        // ── API ROUTES ──
        if (pathname.startsWith('/api/')) {
            res.setHeader('Content-Type', 'application/json');

            // Overview Stats
            if (pathname === '/api/admin/overview' && req.method === 'GET') {
                const totalUsers = adminStore.users.length;
                const totalMinutesUsed = adminStore.users.reduce((acc, u) => acc + (u.minutes_used || 0), 0);
                const totalCreditsGranted = adminStore.users.reduce((acc, u) => acc + (u.credits || 0), 0);
                const pendingPayments = adminStore.payments.filter(p => p.status === 'pending').length;

                res.writeHead(200);
                res.end(JSON.stringify({
                    success: true,
                    stats: { totalUsers, totalMinutesUsed, totalCreditsGranted, pendingPayments }
                }));
                return;
            }

            // Get Users & Credits
            if (pathname === '/api/admin/users' && req.method === 'GET') {
                res.writeHead(200);
                res.end(JSON.stringify({ success: true, users: adminStore.users }));
                return;
            }

            // Add/Edit Credits for User
            if (pathname === '/api/admin/credits/add' && req.method === 'POST') {
                const body = await parseJsonBody(req);
                const { email, credits, note } = body;

                if (!email) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ success: false, error: 'Email is required' }));
                    return;
                }

                const creditAmount = parseInt(credits || '0', 10);
                let user = adminStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());

                if (!user) {
                    user = {
                        id: `usr_${Date.now()}`,
                        email: email.toLowerCase(),
                        minutes_used: 0,
                        credits: 0,
                        plan: 'pro',
                        status: 'active',
                        created_at: new Date().toISOString(),
                        last_active: new Date().toISOString()
                    };
                    adminStore.users.push(user);
                }

                user.credits = Math.max(0, (user.credits || 0) + creditAmount);
                user.last_active = new Date().toISOString();
                saveStore();

                res.writeHead(200);
                res.end(JSON.stringify({
                    success: true,
                    message: `Added ${creditAmount} credits to ${email}`,
                    user
                }));
                return;
            }

            // Get UPI Payments
            if (pathname === '/api/admin/payments' && req.method === 'GET') {
                res.writeHead(200);
                res.end(JSON.stringify({ success: true, payments: adminStore.payments }));
                return;
            }

            // Submit UPI Payment (User side)
            if ((pathname === '/api/payments/upi-submit' || pathname === '/api/payments/submit') && req.method === 'POST') {
                const body = await parseJsonBody(req);
                const { email, utrNumber, amount } = body;

                if (!email || !utrNumber) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ success: false, error: 'Email and UTR number are required' }));
                    return;
                }

                const newPayment = {
                    id: `upi_${Date.now()}`,
                    user_email: email.trim().toLowerCase(),
                    utr_number: utrNumber.trim(),
                    amount: amount || 1499,
                    credits: amount >= 2999 ? 2500 : 1000,
                    status: 'pending',
                    created_at: new Date().toISOString()
                };

                adminStore.payments.unshift(newPayment);
                saveStore();

                res.writeHead(200);
                res.end(JSON.stringify({ success: true, payment: newPayment }));
                return;
            }

            // Approve UPI Payment (Admin side)
            if (pathname === '/api/admin/payments/approve' && req.method === 'POST') {
                const body = await parseJsonBody(req);
                const { paymentId } = body;

                const payment = adminStore.payments.find(p => p.id === paymentId);
                if (!payment) {
                    res.writeHead(404);
                    res.end(JSON.stringify({ success: false, error: 'Payment record not found' }));
                    return;
                }

                payment.status = 'approved';
                const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
                const licenseKey = `MEETFLOO-PRO-${Date.now().toString().slice(-4)}-${randomHex}`;
                payment.license_key = licenseKey;

                // Create license record
                const newLicense = {
                    id: `lic_${Date.now()}`,
                    email: payment.user_email,
                    license_key: licenseKey,
                    plan: payment.amount >= 2999 ? 'ultra' : 'pro',
                    credits: payment.credits || 1000,
                    created_at: new Date().toISOString()
                };
                adminStore.licenses.unshift(newLicense);

                // Add credits & update user
                let user = adminStore.users.find(u => u.email.toLowerCase() === payment.user_email.toLowerCase());
                if (!user) {
                    user = {
                        id: `usr_${Date.now()}`,
                        email: payment.user_email,
                        minutes_used: 0,
                        credits: 0,
                        plan: newLicense.plan,
                        status: 'active',
                        created_at: new Date().toISOString(),
                        last_active: new Date().toISOString()
                    };
                    adminStore.users.push(user);
                }

                user.credits = (user.credits || 0) + (payment.credits || 1000);
                user.plan = newLicense.plan;
                user.last_active = new Date().toISOString();

                saveStore();

                res.writeHead(200);
                res.end(JSON.stringify({
                    success: true,
                    licenseKey,
                    creditsAdded: payment.credits || 1000,
                    user
                }));
                return;
            }

            // Reject UPI Payment
            if (pathname === '/api/admin/payments/reject' && req.method === 'POST') {
                const body = await parseJsonBody(req);
                const { paymentId } = body;

                const payment = adminStore.payments.find(p => p.id === paymentId);
                if (payment) {
                    payment.status = 'rejected';
                    saveStore();
                }

                res.writeHead(200);
                res.end(JSON.stringify({ success: true }));
                return;
            }

            // Get Licenses
            if (pathname === '/api/admin/licenses' && req.method === 'GET') {
                res.writeHead(200);
                res.end(JSON.stringify({ success: true, licenses: adminStore.licenses }));
                return;
            }

            // Issue License & Grant Credits
            if (pathname === '/api/admin/licenses/create' && req.method === 'POST') {
                const body = await parseJsonBody(req);
                const { email, plan, initialCredits } = body;

                if (!email) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ success: false, error: 'Email is required' }));
                    return;
                }

                const creditsToGrant = parseInt(initialCredits || (plan === 'ultra' ? '2500' : '1000'), 10);
                const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
                const licenseKey = `MEETFLOO-${(plan || 'pro').toUpperCase()}-${Date.now().toString().slice(-4)}-${randomHex}`;

                const newLicense = {
                    id: `lic_${Date.now()}`,
                    email: email.trim().toLowerCase(),
                    license_key: licenseKey,
                    plan: plan || 'pro',
                    credits: creditsToGrant,
                    created_at: new Date().toISOString()
                };
                adminStore.licenses.unshift(newLicense);

                let user = adminStore.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
                if (!user) {
                    user = {
                        id: `usr_${Date.now()}`,
                        email: email.trim().toLowerCase(),
                        minutes_used: 0,
                        credits: 0,
                        plan: plan || 'pro',
                        status: 'active',
                        created_at: new Date().toISOString(),
                        last_active: new Date().toISOString()
                    };
                    adminStore.users.push(user);
                }

                user.credits = (user.credits || 0) + creditsToGrant;
                user.plan = plan || 'pro';
                user.last_active = new Date().toISOString();

                saveStore();

                res.writeHead(200);
                res.end(JSON.stringify({ success: true, licenseKey, user }));
                return;
            }

            // Record Usage (Minutes used by desktop client)
            if (pathname === '/api/user/record-usage' && req.method === 'POST') {
                const body = await parseJsonBody(req);
                const { email, minutesUsed } = body;

                if (email) {
                    let user = adminStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
                    const mins = parseInt(minutesUsed || '0', 10);
                    if (user) {
                        user.minutes_used = (user.minutes_used || 0) + mins;
                        user.credits = Math.max(0, (user.credits || 0) - mins);
                        user.last_active = new Date().toISOString();
                        saveStore();
                    }
                }

                res.writeHead(200);
                res.end(JSON.stringify({ success: true }));
                return;
            }

            // Unknown API endpoint
            res.writeHead(404);
            res.end(JSON.stringify({ success: false, error: 'API route not found' }));
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
