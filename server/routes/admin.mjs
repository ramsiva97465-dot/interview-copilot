import { adminStore, saveStore, parseJsonBody } from '../store.mjs';

export async function handleAdminRoutes(req, res, pathname) {
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
        return true;
    }

    // Get Users & Credits
    if (pathname === '/api/admin/users' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, users: adminStore.users }));
        return true;
    }

    // Add/Edit Credits for User
    if (pathname === '/api/admin/credits/add' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { email, credits, note } = body;

        if (!email) {
            res.writeHead(400);
            res.end(JSON.stringify({ success: false, error: 'Email is required' }));
            return true;
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
        return true;
    }

    // Get UPI Payments
    if (pathname === '/api/admin/payments' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, payments: adminStore.payments }));
        return true;
    }

    // Approve UPI Payment (Admin side)
    if (pathname === '/api/admin/payments/approve' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { paymentId } = body;

        const payment = adminStore.payments.find(p => p.id === paymentId);
        if (!payment) {
            res.writeHead(404);
            res.end(JSON.stringify({ success: false, error: 'Payment record not found' }));
            return true;
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
        return true;
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
        return true;
    }

    // Get Licenses
    if (pathname === '/api/admin/licenses' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, licenses: adminStore.licenses }));
        return true;
    }

    // Issue License & Grant Credits
    if (pathname === '/api/admin/licenses/create' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { email, plan, initialCredits } = body;

        if (!email) {
            res.writeHead(400);
            res.end(JSON.stringify({ success: false, error: 'Email is required' }));
            return true;
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
        return true;
    }

    return false;
}
