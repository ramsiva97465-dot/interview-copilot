import { adminStore, saveStore, parseJsonBody } from '../store.mjs';

export async function handleAuthRoutes(req, res, pathname) {
    // Google Auth Sign-In Endpoint
    if (pathname === '/api/auth/google/login' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { email, name } = body;

        if (!email || !email.includes('@')) {
            res.writeHead(400);
            res.end(JSON.stringify({ success: false, error: 'Valid Gmail address is required' }));
            return true;
        }

        let user = adminStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        let isNewUser = false;

        if (!user) {
            isNewUser = true;
            user = {
                id: `usr_${Date.now()}`,
                email: email.toLowerCase(),
                name: name || email.split('@')[0],
                minutes_used: 0,
                credits: 500, // 500 Welcome Credits for Google Signup
                plan: 'pro_trial',
                status: 'active',
                created_at: new Date().toISOString(),
                last_active: new Date().toISOString()
            };
            adminStore.users.push(user);
            saveStore();
        } else {
            user.last_active = new Date().toISOString();
            if (name) user.name = name;
            saveStore();
        }

        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            isNewUser,
            message: isNewUser ? 'Account created! 500 Welcome credits added.' : 'Signed in successfully',
            user
        }));
        return true;
    }

    return false;
}
