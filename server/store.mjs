import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_FILE = path.join(__dirname, '..', 'meetfloo_admin_store.json');

export let adminStore = {
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

export function saveStore() {
    try {
        fs.writeFileSync(STORE_FILE, JSON.stringify(adminStore, null, 2), 'utf8');
    } catch (e) {
        console.warn('Could not save admin store file:', e.message);
    }
}

export function parseJsonBody(req) {
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
