import { adminStore, saveStore, parseJsonBody } from '../store.mjs';

export async function handleUserRoutes(req, res, pathname, parsedUrl) {
    // User Profile (by Email)
    if (pathname === '/api/user/profile' && req.method === 'GET') {
        const email = parsedUrl.searchParams.get('email');
        if (!email) {
            res.writeHead(400);
            res.end(JSON.stringify({ success: false, error: 'Email parameter required' }));
            return true;
        }

        let user = adminStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
            user = {
                id: `usr_${Date.now()}`,
                email: email.toLowerCase(),
                minutes_used: 0,
                credits: 500,
                plan: 'pro_trial',
                status: 'active',
                created_at: new Date().toISOString(),
                last_active: new Date().toISOString()
            };
            adminStore.users.push(user);
            saveStore();
        } else {
            user.last_active = new Date().toISOString();
            saveStore();
        }

        res.writeHead(200);
        res.end(JSON.stringify({ success: true, user }));
        return true;
    }

    // Record Usage (Minutes used by desktop client)
    if (pathname === '/api/user/record-usage' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { email, minutesUsed } = body;

        if (!email) {
            res.writeHead(400);
            res.end(JSON.stringify({ success: false, error: 'Email parameter required' }));
            return true;
        }

        const mins = parseInt(minutesUsed || '0', 10);
        let user = adminStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            user = {
                id: `usr_${Date.now()}`,
                email: email.toLowerCase(),
                minutes_used: Math.max(0, mins),
                credits: Math.max(0, 500 - mins),
                plan: 'pro_trial',
                status: 'active',
                created_at: new Date().toISOString(),
                last_active: new Date().toISOString()
            };
            adminStore.users.push(user);
            saveStore();
        } else {
            user.minutes_used = (user.minutes_used || 0) + mins;
            user.credits = Math.max(0, (user.credits || 0) - mins);
            user.last_active = new Date().toISOString();
            saveStore();
        }

        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                minutes_used: user.minutes_used,
                credits: user.credits,
                plan: user.plan
            }
        }));
        return true;
    }

    return false;
}
