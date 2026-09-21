import { adminStore, saveStore, parseJsonBody } from '../store.mjs';

export async function handlePaymentRoutes(req, res, pathname) {
    // Submit UPI Payment (User side)
    if ((pathname === '/api/payments/upi-submit' || pathname === '/api/payments/submit') && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { email, utrNumber, amount } = body;

        if (!email || !utrNumber) {
            res.writeHead(400);
            res.end(JSON.stringify({ success: false, error: 'Email and UTR number are required' }));
            return true;
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
        return true;
    }

    return false;
}
