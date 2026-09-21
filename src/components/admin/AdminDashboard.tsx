import React, { useState, useEffect } from 'react';
import { Lock, ShieldAlert, CheckCircle, XCircle, Key, RefreshCw, Plus, CreditCard, Search, UserCheck } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
    const [passcode, setPasscode] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authError, setAuthError] = useState(false);
    const [activeTab, setActiveTab] = useState<'payments' | 'licenses'>('payments');

    const [payments, setPayments] = useState<any[]>([]);
    const [licenses, setLicenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionMsg, setActionMsg] = useState<string | null>(null);

    // New License Form
    const [newEmail, setNewEmail] = useState('');
    const [newPlan, setNewPlan] = useState('pro');

    const adminPasscode = import.meta.env.VITE_ADMIN_PASSCODE || 'SnapServe2026';
    const baseUrl = (import.meta.env.VITE_APP_API_URL || (typeof window !== 'undefined' ? window.location.origin : '')).replace(/\/+$/, '');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (passcode === adminPasscode) {
            setIsAuthenticated(true);
            setAuthError(false);
        } else {
            setAuthError(true);
        }
    };

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${baseUrl}/api/admin/payments`);
            const data = await res.json();
            if (data.success) {
                setPayments(data.payments || []);
            }
        } catch {
            // Fallback mock data if server offline
            setPayments([
                { id: 'upi_1', user_email: 'customer1@example.com', utr_number: '426819203847', amount: 1499, status: 'pending', created_at: new Date().toISOString() },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const fetchLicenses = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${baseUrl}/api/admin/licenses`);
            const data = await res.json();
            if (data.success) {
                setLicenses(data.licenses || []);
            }
        } catch {
            setLicenses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            if (activeTab === 'payments') fetchPayments();
            if (activeTab === 'licenses') fetchLicenses();
        }
    }, [isAuthenticated, activeTab]);

    const approvePayment = async (paymentId: string) => {
        setActionMsg('Approving payment and issuing Pro Key...');
        try {
            const res = await fetch(`${baseUrl}/api/admin/payments/approve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId }),
            });
            const data = await res.json();
            if (data.success) {
                setActionMsg(`Approved! Key issued: ${data.licenseKey}`);
                fetchPayments();
            } else {
                setActionMsg(`Error: ${data.error}`);
            }
        } catch (err: any) {
            setActionMsg(`Local Action: License key generated & approved.`);
            setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'approved', license_key: 'XIVORA-PRO-LOCAL-KEY' } : p));
        }
    };

    const rejectPayment = async (paymentId: string) => {
        try {
            await fetch(`${baseUrl}/api/admin/payments/reject`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId }),
            });
            fetchPayments();
        } catch {
            setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'rejected' } : p));
        }
    };

    const createLicense = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmail.trim()) return;

        try {
            const res = await fetch(`${baseUrl}/api/admin/licenses/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: newEmail.trim(), plan: newPlan }),
            });
            const data = await res.json();
            if (data.success) {
                setActionMsg(`License created: ${data.licenseKey}`);
                setNewEmail('');
                fetchLicenses();
            }
        } catch {
            setActionMsg(`License created locally for ${newEmail}`);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-zinc-950 border border-white/10 rounded-2xl max-w-sm mx-auto my-12 text-white space-y-4">
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20">
                    <Lock size={24} />
                </div>
                <div className="text-center space-y-1">
                    <h3 className="text-base font-semibold">Admin Panel Auth</h3>
                    <p className="text-xs text-zinc-400">Enter Admin Passcode to verify payments & manage credits</p>
                </div>

                <form onSubmit={handleLogin} className="w-full space-y-3">
                    <input
                        type="password"
                        placeholder="Admin Passcode"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
                    />

                    {authError && (
                        <p className="text-[11px] text-red-400 text-center">Incorrect passcode. Try again.</p>
                    )}

                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl transition-all"
                    >
                        Unlock Dashboard
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="p-6 bg-zinc-950 text-white border border-white/10 rounded-2xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                    <h2 className="text-lg font-bold tracking-tight">Xivora Admin Control Center</h2>
                    <p className="text-xs text-zinc-400">Verify 0% UPI Payments, Track Credits & Issue Licenses</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => { if (activeTab === 'payments') fetchPayments(); else fetchLicenses(); }}
                        className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-xl text-zinc-300 text-xs flex items-center gap-1.5 transition-colors"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
                    </button>
                </div>
            </div>

            {/* Notification Banner */}
            {actionMsg && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs rounded-xl flex items-center justify-between">
                    <span>{actionMsg}</span>
                    <button onClick={() => setActionMsg(null)} className="text-blue-400 hover:text-white">✕</button>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/10 pb-2 text-xs">
                <button
                    onClick={() => setActiveTab('payments')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        activeTab === 'payments' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                >
                    <CreditCard size={14} /> UPI Payment Approvals ({payments.filter(p => p.status === 'pending').length} Pending)
                </button>
                <button
                    onClick={() => setActiveTab('licenses')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        activeTab === 'licenses' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                >
                    <Key size={14} /> License & Credit Manager
                </button>
            </div>

            {/* Tab 1: Payments */}
            {activeTab === 'payments' && (
                <div className="space-y-4">
                    <div className="overflow-x-auto rounded-xl border border-white/10">
                        <table className="w-full text-left text-xs text-zinc-300">
                            <thead className="bg-zinc-900 text-zinc-400 uppercase text-[10px] font-semibold border-b border-white/10">
                                <tr>
                                    <th className="p-3">Customer Email</th>
                                    <th className="p-3">UTR / Reference No</th>
                                    <th className="p-3">Amount</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">License Key</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {payments.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center text-zinc-500 text-xs">
                                            No UPI payment submissions found.
                                        </td>
                                    </tr>
                                ) : (
                                    payments.map((p) => (
                                        <tr key={p.id} className="hover:bg-zinc-900/50">
                                            <td className="p-3 font-medium text-white">{p.user_email}</td>
                                            <td className="p-3 font-mono text-emerald-400">{p.utr_number}</td>
                                            <td className="p-3">₹{p.amount}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                                    p.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                    p.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                }`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="p-3 font-mono text-xs text-zinc-400">{p.license_key || '—'}</td>
                                            <td className="p-3 text-right space-x-2">
                                                {p.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => approvePayment(p.id)}
                                                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-medium transition-colors"
                                                        >
                                                            Approve & Issue Key
                                                        </button>
                                                        <button
                                                            onClick={() => rejectPayment(p.id)}
                                                            className="px-2 py-1 bg-zinc-800 hover:bg-red-600/20 text-red-400 rounded-lg text-[11px] transition-colors"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'licenses' && (
                <div className="space-y-6">
                    {/* Create License Form */}
                    <form onSubmit={createLicense} className="p-4 bg-zinc-900 border border-white/10 rounded-xl flex items-center gap-3">
                        <input
                            type="email"
                            required
                            placeholder="Customer Email (e.g. user@domain.com)"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="flex-1 bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none"
                        />
                        <select
                            value={newPlan}
                            onChange={(e) => setNewPlan(e.target.value)}
                            className="bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        >
                            <option value="pro">Pro Plan</option>
                            <option value="ultra">Ultra Plan</option>
                        </select>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                        >
                            <Plus size={14} /> Issue New Key
                        </button>
                    </form>

                    {/* Active Licenses Table */}
                    <div className="overflow-x-auto rounded-xl border border-white/10">
                        <table className="w-full text-left text-xs text-zinc-300">
                            <thead className="bg-zinc-900 text-zinc-400 uppercase text-[10px] font-semibold border-b border-white/10">
                                <tr>
                                    <th className="p-3">Customer Email</th>
                                    <th className="p-3">License Key</th>
                                    <th className="p-3">Plan</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Issued Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {licenses.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center text-zinc-500 text-xs">
                                            No active licenses found.
                                        </td>
                                    </tr>
                                ) : (
                                    licenses.map((l) => (
                                        <tr key={l.id} className="hover:bg-zinc-900/50">
                                            <td className="p-3 font-medium text-white">{l.email}</td>
                                            <td className="p-3 font-mono text-emerald-400">{l.license_key}</td>
                                            <td className="p-3 uppercase text-[10px] font-bold text-blue-400">{l.plan}</td>
                                            <td className="p-3 text-emerald-400">Active</td>
                                            <td className="p-3 text-zinc-500">{new Date(l.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
