import { adminStore, saveStore, parseJsonBody } from '../store.mjs';

function getTodayString() {
    return new Date().toISOString().slice(0, 10);
}

function ensureDailyAllowance(user, today = getTodayString()) {
    if (typeof user.summarize_daily_limit !== 'number') {
        user.summarize_daily_limit = 10;
    }
    if (user.summarize_daily_last_date !== today) {
        user.summarize_daily_used = 0;
        user.summarize_daily_last_date = today;
    }
    user.summarize_daily_remaining = Math.max(0, (user.summarize_daily_limit || 10) - (user.summarize_daily_used || 0));
}

export async function handleUserRoutes(req, res, pathname, parsedUrl) {
    const today = getTodayString();

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
                last_active: new Date().toISOString(),
                summarize_daily_limit: 10,
                summarize_daily_used: 0,
                summarize_daily_last_date: today,
            };
            adminStore.users.push(user);
            ensureDailyAllowance(user, today);
            saveStore();
        } else {
            user.last_active = new Date().toISOString();
            ensureDailyAllowance(user, today);
            saveStore();
        }

        res.writeHead(200);
        res.end(JSON.stringify({ success: true, user }));
        return true;
    }

    // Record Usage (Minutes used by desktop client)
    if (pathname === '/api/user/record-usage' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { email, minutesUsed, mode } = body;

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
                minutes_used: 0,
                credits: 500,
                plan: 'pro_trial',
                status: 'active',
                created_at: new Date().toISOString(),
                last_active: new Date().toISOString(),
                summarize_daily_limit: 10,
                summarize_daily_used: 0,
                summarize_daily_last_date: today,
            };
            adminStore.users.push(user);
        }

        ensureDailyAllowance(user, today);

        const isSummarizeMode = mode === 'team-meet' || mode === 'summarize_meeting' || mode === 'summarize';

        if (isSummarizeMode) {
            // Deduct from 10-minute daily allowance, NEVER from Interview Copilot credits
            if (user.summarize_daily_remaining <= 0) {
                res.writeHead(403);
                res.end(JSON.stringify({
                    success: false,
                    out_of_daily_allowance: true,
                    error: 'Daily 10-minute free allowance for Summarize Meeting exhausted for today.',
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        minutes_used: user.minutes_used,
                        credits: user.credits,
                        plan: user.plan,
                        summarize_daily_limit: user.summarize_daily_limit,
                        summarize_daily_used: user.summarize_daily_used,
                        summarize_daily_remaining: 0,
                    }
                }));
                return true;
            }

            const deduct = Math.min(mins, user.summarize_daily_remaining);
            user.summarize_daily_used = (user.summarize_daily_used || 0) + deduct;
            user.summarize_daily_remaining = Math.max(0, user.summarize_daily_limit - user.summarize_daily_used);
            user.last_active = new Date().toISOString();
            saveStore();

            res.writeHead(200);
            res.end(JSON.stringify({
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    minutes_used: user.minutes_used,
                    credits: user.credits,
                    plan: user.plan,
                    summarize_daily_limit: user.summarize_daily_limit,
                    summarize_daily_used: user.summarize_daily_used,
                    summarize_daily_remaining: user.summarize_daily_remaining,
                }
            }));
            return true;
        }

        // Interview Copilot / general usage: deduct from user credits
        user.minutes_used = (user.minutes_used || 0) + mins;
        user.credits = Math.max(0, (user.credits || 0) - mins);
        user.last_active = new Date().toISOString();
        saveStore();

        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                minutes_used: user.minutes_used,
                credits: user.credits,
                plan: user.plan,
                summarize_daily_limit: user.summarize_daily_limit,
                summarize_daily_used: user.summarize_daily_used,
                summarize_daily_remaining: user.summarize_daily_remaining,
            }
        }));
        return true;
    }

    return false;
}

