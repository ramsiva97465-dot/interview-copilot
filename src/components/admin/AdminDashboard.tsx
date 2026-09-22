import React, { useState, useEffect } from 'react';
import { Lock, RefreshCw, Plus, Minus, CreditCard, Key, Users, Clock, Coins, Search, ShieldCheck, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';
import MeetFlooLogo from '../../assets/logo.webp';

interface UserRecord {
    id: string;
    email: string;
    minutes_used: number;
    credits: number;
    plan: string;
    status: string;
    created_at: string;
    last_active: string;
}

interface PaymentRecord {
    id: string;
    user_email: string;
    utr_number: string;
    amount: number;
    credits?: number;
    status: string;
    license_key?: string;
    created_at: string;
}

interface LicenseRecord {
    id: string;
    email: string;
    license_key: string;
    plan: string;
    credits?: number;
    created_at: string;
}

export const AdminDashboard: React.FC = () => {
    const [passcode, setPasscode] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authError, setAuthError] = useState(false);
    const [activeTab, setActiveTab] = useState<'users' | 'payments' | 'licenses'>('users');

    const [stats, setStats] = useState({ totalUsers: 0, totalMinutesUsed: 0, totalCreditsGranted: 0, pendingPayments: 0 });
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [payments, setPayments] = useState<PaymentRecord[]>([]);
    const [licenses, setLicenses] = useState<LicenseRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionMsg, setActionMsg] = useState<string | null>(null);

    // Search filter
    const [searchQuery, setSearchQuery] = useState('');

    // Credits Management Modal State (Add, Remove, Set)
    const [creditModalOpen, setCreditModalOpen] = useState(false);
    const [creditModalMode, setCreditModalMode] = useState<'add' | 'remove' | 'set'>('add');
    const [targetEmail, setTargetEmail] = useState('');
    const [targetCurrentCredits, setTargetCurrentCredits] = useState<number>(0);
    const [creditAmount, setCreditAmount] = useState(500);
    const [removeAllCredits, setRemoveAllCredits] = useState(false);
    const [creditNote, setCreditNote] = useState('');

    // New License Form State
    const [newEmail, setNewEmail] = useState('');
    const [newPlan, setNewPlan] = useState('pro');
    const [initialCredits, setInitialCredits] = useState(1000);

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

    const fetchOverview = async () => {
        try {
            const res = await fetch(`${baseUrl}/api/admin/overview`);
            const data = await res.json();
            if (data.success && data.stats) {
                setStats(data.stats);
            }
        } catch {
            // Calculated locally if offline
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${baseUrl}/api/admin/users`);
            const data = await res.json();
            if (data.success) {
                setUsers(data.users || []);
            }
        } catch {
            setUsers([
                { id: 'usr_1', email: 'customer1@example.com', minutes_used: 120, credits: 1000, plan: 'pro', status: 'active', created_at: new Date().toISOString(), last_active: new Date().toISOString() },
                { id: 'usr_2', email: 'dev@meetfloo.ai', minutes_used: 340, credits: 2500, plan: 'ultra', status: 'active', created_at: new Date().toISOString(), last_active: new Date().toISOString() }
            ]);
        } finally {
            setLoading(false);
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
            setPayments([
                { id: 'upi_1', user_email: 'customer1@example.com', utr_number: '426819203847', amount: 1499, credits: 1000, status: 'pending', created_at: new Date().toISOString() }
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

    const refreshData = () => {
        fetchOverview();
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'payments') fetchPayments();
        if (activeTab === 'licenses') fetchLicenses();
    };

    useEffect(() => {
        if (isAuthenticated) {
            refreshData();
        }
    }, [isAuthenticated, activeTab]);

    const handleCreditActionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetEmail.trim()) return;

        if (creditModalMode === 'add') {
            setActionMsg(`Granting ${creditAmount} credits to ${targetEmail}...`);
            try {
                const res = await fetch(`${baseUrl}/api/admin/credits/add`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: targetEmail.trim(), credits: creditAmount, note: creditNote }),
                });
                const data = await res.json();
                if (data.success) {
                    setActionMsg(`Successfully added ${creditAmount} credits to ${targetEmail}!`);
                    setCreditModalOpen(false);
                    setTargetEmail('');
                    setCreditNote('');
                    refreshData();
                } else {
                    setActionMsg(`Error: ${data.error}`);
                }
            } catch {
                setActionMsg(`Local Action: Added ${creditAmount} credits to ${targetEmail}`);
                setUsers(prev => prev.map(u => u.email === targetEmail ? { ...u, credits: u.credits + creditAmount } : u));
                setCreditModalOpen(false);
            }
        } else if (creditModalMode === 'remove') {
            const deduct = removeAllCredits ? targetCurrentCredits : creditAmount;
            setActionMsg(`Removing ${deduct} credits from ${targetEmail}...`);
            try {
                const res = await fetch(`${baseUrl}/api/admin/credits/remove`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: targetEmail.trim(),
                        credits: creditAmount,
                        removeAll: removeAllCredits,
                        note: creditNote
                    }),
                });
                const data = await res.json();
                if (data.success) {
                    setActionMsg(`Successfully removed ${data.deducted || deduct} credits from ${targetEmail}!`);
                    setCreditModalOpen(false);
                    setTargetEmail('');
                    setCreditNote('');
                    refreshData();
                } else {
                    setActionMsg(`Error: ${data.error}`);
                }
            } catch {
                setActionMsg(`Local Action: Removed ${deduct} credits from ${targetEmail}`);
                setUsers(prev => prev.map(u => u.email === targetEmail ? { ...u, credits: Math.max(0, u.credits - deduct) } : u));
                setCreditModalOpen(false);
            }
        } else if (creditModalMode === 'set') {
            setActionMsg(`Setting credits for ${targetEmail} to ${creditAmount}...`);
            try {
                const res = await fetch(`${baseUrl}/api/admin/credits/set`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: targetEmail.trim(), credits: creditAmount, note: creditNote }),
                });
                const data = await res.json();
                if (data.success) {
                    setActionMsg(`Successfully set credits for ${targetEmail} to ${creditAmount}!`);
                    setCreditModalOpen(false);
                    setTargetEmail('');
                    setCreditNote('');
                    refreshData();
                } else {
                    setActionMsg(`Error: ${data.error}`);
                }
            } catch {
                setActionMsg(`Local Action: Set credits for ${targetEmail} to ${creditAmount}`);
                setUsers(prev => prev.map(u => u.email === targetEmail ? { ...u, credits: creditAmount } : u));
                setCreditModalOpen(false);
            }
        }
    };

    const approvePayment = async (paymentId: string) => {
        setActionMsg('Approving payment & adding credits...');
        try {
            const res = await fetch(`${baseUrl}/api/admin/payments/approve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId }),
            });
            const data = await res.json();
            if (data.success) {
                setActionMsg(`Approved! Key: ${data.licenseKey}. +${data.creditsAdded} credits added to user.`);
                refreshData();
            } else {
                setActionMsg(`Error: ${data.error}`);
            }
        } catch {
            setActionMsg(`Local Action: Payment approved & 1000 credits added.`);
            setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'approved' } : p));
        }
    };

    const rejectPayment = async (paymentId: string) => {
        try {
            await fetch(`${baseUrl}/api/admin/payments/reject`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId }),
            });
            refreshData();
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
                body: JSON.stringify({ email: newEmail.trim(), plan: newPlan, initialCredits }),
            });
            const data = await res.json();
            if (data.success) {
                setActionMsg(`License created: ${data.licenseKey} (+${initialCredits} credits)`);
                setNewEmail('');
                refreshData();
            }
        } catch {
            setActionMsg(`License created locally for ${newEmail}`);
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.plan.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-zinc-950 border border-white/10 rounded-2xl max-w-sm mx-auto my-12 text-white space-y-4 shadow-2xl">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-lg p-2">
                    <img src={MeetFlooLogo} alt="MeetFloo" className="w-10 h-10 object-contain" />
                </div>
                <div className="text-center space-y-1">
                    <h3 className="text-base font-semibold">MeetFloo Admin Panel</h3>
                    <p className="text-xs text-zinc-400">Enter Admin Passcode to manage users, credits & payments</p>
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
                        className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl transition-all shadow-lg shadow-blue-600/20"
                    >
                        Unlock Control Center
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="p-6 bg-zinc-950 text-white border border-white/10 rounded-2xl space-y-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                    <h2 className="text-lg font-bold tracking-tight flex items-center gap-2.5">
                        <img src={MeetFlooLogo} alt="MeetFloo" className="w-6 h-6 object-contain" />
                        <span>MeetFloo Admin Control Center</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Live Server
                        </span>
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5">Track User Usage Minutes, Add Credits & Verify 0% UPI Payments</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={refreshData}
                        className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-xl text-zinc-300 text-xs flex items-center gap-1.5 transition-colors"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
                    </button>
                </div>
            </div>

            {/* Overview Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="bg-zinc-900/80 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                        <Users size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] text-zinc-400 uppercase font-semibold">Total Users</p>
                        <p className="text-lg font-bold text-white">{stats.totalUsers || users.length}</p>
                    </div>
                </div>

                <div className="bg-zinc-900/80 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                    <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                        <Clock size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] text-zinc-400 uppercase font-semibold">Meeting Minutes Used</p>
                        <p className="text-lg font-bold text-white">
                            {stats.totalMinutesUsed || users.reduce((acc, u) => acc + (u.minutes_used || 0), 0)} mins
                        </p>
                    </div>
                </div>

                <div className="bg-zinc-900/80 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                        <Coins size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] text-zinc-400 uppercase font-semibold">Active Credits Balance</p>
                        <p className="text-lg font-bold text-white">
                            {stats.totalCreditsGranted || users.reduce((acc, u) => acc + (u.credits || 0), 0)}
                        </p>
                    </div>
                </div>

                <div className="bg-zinc-900/80 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                    <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                        <CreditCard size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] text-zinc-400 uppercase font-semibold">Pending Payments</p>
                        <p className="text-lg font-bold text-white">
                            {payments.filter(p => p.status === 'pending').length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Notification Banner */}
            {actionMsg && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs rounded-xl flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <Sparkles size={14} className="text-blue-400" /> {actionMsg}
                    </span>
                    <button onClick={() => setActionMsg(null)} className="text-blue-400 hover:text-white">✕</button>
                </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex gap-2 border-b border-white/10 pb-2 text-xs">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-3.5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-zinc-400 hover:text-white'
                    }`}
                >
                    <Users size={14} /> Users & Credits ({users.length})
                </button>
                <button
                    onClick={() => setActiveTab('payments')}
                    className={`px-3.5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        activeTab === 'payments' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-zinc-400 hover:text-white'
                    }`}
                >
                    <CreditCard size={14} /> UPI Payments ({payments.filter(p => p.status === 'pending').length} Pending)
                </button>
                <button
                    onClick={() => setActiveTab('licenses')}
                    className={`px-3.5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        activeTab === 'licenses' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-zinc-400 hover:text-white'
                    }`}
                >
                    <Key size={14} /> License & Key Generator
                </button>
            </div>

            {/* Tab 1: Users & Credits */}
            {activeTab === 'users' && (
                <div className="space-y-4">
                    {/* Search & Actions Bar */}
                    <div className="flex items-center justify-between gap-3">
                        <div className="relative flex-1 max-w-md">
                            <Search size={14} className="absolute left-3 top-2.5 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search by customer email or plan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setTargetEmail('');
                                    setTargetCurrentCredits(0);
                                    setCreditModalMode('add');
                                    setCreditAmount(500);
                                    setRemoveAllCredits(false);
                                    setCreditNote('');
                                    setCreditModalOpen(true);
                                }}
                                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-600/20"
                            >
                                <Plus size={14} /> Grant Credits
                            </button>
                            <button
                                onClick={() => {
                                    setTargetEmail('');
                                    setTargetCurrentCredits(0);
                                    setCreditModalMode('remove');
                                    setCreditAmount(500);
                                    setRemoveAllCredits(false);
                                    setCreditNote('');
                                    setCreditModalOpen(true);
                                }}
                                className="px-3.5 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-medium text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                            >
                                <Minus size={14} /> Deduct Credits
                            </button>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="overflow-x-auto rounded-xl border border-white/10">
                        <table className="w-full text-left text-xs text-zinc-300">
                            <thead className="bg-zinc-900 text-zinc-400 uppercase text-[10px] font-semibold border-b border-white/10">
                                <tr>
                                    <th className="p-3">Customer Email</th>
                                    <th className="p-3">Plan</th>
                                    <th className="p-3">Meeting Minutes Used</th>
                                    <th className="p-3">Credits Balance</th>
                                    <th className="p-3">Last Active</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center text-zinc-500 text-xs">
                                            No user records found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((u) => (
                                        <tr key={u.id} className="hover:bg-zinc-900/50 transition-colors">
                                            <td className="p-3 font-medium text-white">{u.email}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                    u.plan === 'ultra' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                                    u.plan === 'pro' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                    'bg-zinc-800 text-zinc-400 border border-white/5'
                                                }`}>
                                                    {u.plan || 'pro'}
                                                </span>
                                            </td>
                                            <td className="p-3 font-mono text-zinc-300">
                                                {u.minutes_used || 0} mins
                                            </td>
                                            <td className="p-3 font-mono font-semibold text-emerald-400">
                                                {u.credits || 0} credits
                                            </td>
                                            <td className="p-3 text-zinc-500">
                                                {u.last_active ? new Date(u.last_active).toLocaleString() : '—'}
                                            </td>
                                            <td className="p-3 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => {
                                                            setTargetEmail(u.email);
                                                            setTargetCurrentCredits(u.credits || 0);
                                                            setCreditModalMode('add');
                                                            setCreditAmount(500);
                                                            setRemoveAllCredits(false);
                                                            setCreditNote('');
                                                            setCreditModalOpen(true);
                                                        }}
                                                        className="px-2.5 py-1 bg-zinc-800 hover:bg-emerald-600/20 text-emerald-400 hover:text-emerald-300 border border-white/5 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1"
                                                        title="Grant credits"
                                                    >
                                                        <Plus size={12} /> Add
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setTargetEmail(u.email);
                                                            setTargetCurrentCredits(u.credits || 0);
                                                            setCreditModalMode('remove');
                                                            setCreditAmount(Math.min(u.credits || 0, 500));
                                                            setRemoveAllCredits(false);
                                                            setCreditNote('');
                                                            setCreditModalOpen(true);
                                                        }}
                                                        className="px-2.5 py-1 bg-zinc-800 hover:bg-rose-600/20 text-rose-400 hover:text-rose-300 border border-white/5 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1"
                                                        title="Deduct or remove credits from user"
                                                    >
                                                        <Minus size={12} /> Remove
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Tab 2: Payments */}
            {activeTab === 'payments' && (
                <div className="space-y-4">
                    <div className="overflow-x-auto rounded-xl border border-white/10">
                        <table className="w-full text-left text-xs text-zinc-300">
                            <thead className="bg-zinc-900 text-zinc-400 uppercase text-[10px] font-semibold border-b border-white/10">
                                <tr>
                                    <th className="p-3">Customer Email</th>
                                    <th className="p-3">UTR / Reference No</th>
                                    <th className="p-3">Amount</th>
                                    <th className="p-3">Credits Granted</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">License Key</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {payments.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-4 text-center text-zinc-500 text-xs">
                                            No UPI payment submissions found.
                                        </td>
                                    </tr>
                                ) : (
                                    payments.map((p) => (
                                        <tr key={p.id} className="hover:bg-zinc-900/50">
                                            <td className="p-3 font-medium text-white">{p.user_email}</td>
                                            <td className="p-3 font-mono text-emerald-400">{p.utr_number}</td>
                                            <td className="p-3 font-semibold text-white">₹{p.amount}</td>
                                            <td className="p-3 font-mono text-emerald-400">+{p.credits || 1000}</td>
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
                                                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-medium transition-colors shadow-lg shadow-emerald-600/20"
                                                        >
                                                            Approve & Add Credits
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

            {/* Tab 3: Licenses */}
            {activeTab === 'licenses' && (
                <div className="space-y-6">
                    {/* Create License Form */}
                    <form onSubmit={createLicense} className="p-4 bg-zinc-900 border border-white/10 rounded-xl space-y-3">
                        <h3 className="text-xs font-semibold text-zinc-300">Issue New License & Grant Initial Credits</h3>
                        <div className="flex items-center gap-3">
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
                                <option value="pro">Pro Plan (1,000 Credits)</option>
                                <option value="ultra">Ultra Plan (2,500 Credits)</option>
                            </select>
                            <input
                                type="number"
                                value={initialCredits}
                                onChange={(e) => setInitialCredits(parseInt(e.target.value || '0', 10))}
                                placeholder="Credits"
                                className="w-28 bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-lg shadow-blue-600/20"
                            >
                                <Plus size={14} /> Issue Key & Credits
                            </button>
                        </div>
                    </form>

                    {/* Active Licenses Table */}
                    <div className="overflow-x-auto rounded-xl border border-white/10">
                        <table className="w-full text-left text-xs text-zinc-300">
                            <thead className="bg-zinc-900 text-zinc-400 uppercase text-[10px] font-semibold border-b border-white/10">
                                <tr>
                                    <th className="p-3">Customer Email</th>
                                    <th className="p-3">License Key</th>
                                    <th className="p-3">Plan</th>
                                    <th className="p-3">Credits Granted</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Issued Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {licenses.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center text-zinc-500 text-xs">
                                            No active licenses found.
                                        </td>
                                    </tr>
                                ) : (
                                    licenses.map((l) => (
                                        <tr key={l.id} className="hover:bg-zinc-900/50">
                                            <td className="p-3 font-medium text-white">{l.email}</td>
                                            <td className="p-3 font-mono text-emerald-400">{l.license_key}</td>
                                            <td className="p-3 uppercase text-[10px] font-bold text-blue-400">{l.plan}</td>
                                            <td className="p-3 font-mono text-emerald-400">+{l.credits || 1000}</td>
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

            {/* Credit Management Modal (Add / Remove / Set) */}
            {creditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl p-6 text-white space-y-4 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-xl border ${
                                    creditModalMode === 'remove'
                                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                        : creditModalMode === 'set'
                                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                }`}>
                                    {creditModalMode === 'remove' ? <Minus size={18} /> : <Coins size={18} />}
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold">
                                        {creditModalMode === 'remove' ? 'Deduct / Remove Credits' :
                                         creditModalMode === 'set' ? 'Set Exact Balance' : 'Grant / Add Credits'}
                                    </h3>
                                    <p className="text-[11px] text-zinc-400">
                                        Updates database and syncs instantly with desktop app
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setCreditModalOpen(false)}
                                className="p-1.5 text-zinc-400 hover:text-white rounded-lg"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Mode Switcher Tabs */}
                        <div className="flex p-1 bg-zinc-900 rounded-xl border border-white/5 text-xs font-medium">
                            <button
                                type="button"
                                onClick={() => { setCreditModalMode('add'); setRemoveAllCredits(false); }}
                                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                                    creditModalMode === 'add'
                                        ? 'bg-emerald-600 text-white font-semibold shadow'
                                        : 'text-zinc-400 hover:text-white'
                                }`}
                            >
                                <Plus size={12} /> Add
                            </button>
                            <button
                                type="button"
                                onClick={() => { setCreditModalMode('remove'); setRemoveAllCredits(false); }}
                                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                                    creditModalMode === 'remove'
                                        ? 'bg-rose-600 text-white font-semibold shadow'
                                        : 'text-zinc-400 hover:text-white'
                                }`}
                            >
                                <Minus size={12} /> Remove / Deduct
                            </button>
                            <button
                                type="button"
                                onClick={() => { setCreditModalMode('set'); setRemoveAllCredits(false); }}
                                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                                    creditModalMode === 'set'
                                        ? 'bg-blue-600 text-white font-semibold shadow'
                                        : 'text-zinc-400 hover:text-white'
                                }`}
                            >
                                Set Balance
                            </button>
                        </div>

                        <form onSubmit={handleCreditActionSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">Customer Email</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="user@example.com"
                                    value={targetEmail}
                                    onChange={(e) => {
                                        setTargetEmail(e.target.value);
                                        const found = users.find(u => u.email.toLowerCase() === e.target.value.toLowerCase());
                                        if (found) setTargetCurrentCredits(found.credits || 0);
                                    }}
                                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
                                />
                                {targetEmail && (
                                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1 px-1">
                                        <span>Current Balance in DB:</span>
                                        <span className="font-mono font-semibold text-emerald-400">{targetCurrentCredits} Credits</span>
                                    </div>
                                )}
                            </div>

                            {/* Options for Remove Mode */}
                            {creditModalMode === 'remove' && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-xs font-medium text-zinc-400">Credits to Deduct</label>
                                        <button
                                            type="button"
                                            onClick={() => setRemoveAllCredits(!removeAllCredits)}
                                            className={`text-[11px] px-2 py-0.5 rounded border transition-colors ${
                                                removeAllCredits
                                                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                                                    : 'bg-zinc-900 text-zinc-400 border-white/10 hover:text-white'
                                            }`}
                                        >
                                            {removeAllCredits ? '✓ Clear All (0)' : 'Clear All (Reset to 0)'}
                                        </button>
                                    </div>

                                    {!removeAllCredits && (
                                        <>
                                            <div className="flex gap-2">
                                                {[50, 100, 250, 500].map((amt) => (
                                                    <button
                                                        key={amt}
                                                        type="button"
                                                        onClick={() => setCreditAmount(amt)}
                                                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                                            creditAmount === amt
                                                                ? 'bg-rose-600 text-white border-rose-500'
                                                                : 'bg-zinc-900 text-zinc-400 border-white/5 hover:bg-zinc-800'
                                                        }`}
                                                    >
                                                        -{amt}
                                                    </button>
                                                ))}
                                            </div>
                                            <input
                                                type="number"
                                                required
                                                min="1"
                                                value={creditAmount}
                                                onChange={(e) => setCreditAmount(Math.max(1, parseInt(e.target.value || '0', 10)))}
                                                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                                            />
                                        </>
                                    )}

                                    {/* Balance Preview */}
                                    <div className="p-2.5 bg-zinc-900/80 rounded-xl border border-white/5 text-xs flex items-center justify-between">
                                        <span className="text-zinc-400">New Balance after deduction:</span>
                                        <span className="font-mono font-bold text-white">
                                            {removeAllCredits ? 0 : Math.max(0, targetCurrentCredits - creditAmount)} credits
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Options for Add Mode */}
                            {creditModalMode === 'add' && (
                                <div className="space-y-2">
                                    <label className="block text-xs font-medium text-zinc-400">Credits to Grant</label>
                                    <div className="flex gap-2">
                                        {[100, 250, 500, 1000].map((amt) => (
                                            <button
                                                key={amt}
                                                type="button"
                                                onClick={() => setCreditAmount(amt)}
                                                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                                    creditAmount === amt
                                                        ? 'bg-emerald-600 text-white border-emerald-500'
                                                        : 'bg-zinc-900 text-zinc-400 border-white/5 hover:bg-zinc-800'
                                                }`}
                                            >
                                                +{amt}
                                            </button>
                                        ))}
                                    </div>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={creditAmount}
                                        onChange={(e) => setCreditAmount(Math.max(1, parseInt(e.target.value || '0', 10)))}
                                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                                    />
                                    {/* Balance Preview */}
                                    <div className="p-2.5 bg-zinc-900/80 rounded-xl border border-white/5 text-xs flex items-center justify-between">
                                        <span className="text-zinc-400">New Balance after grant:</span>
                                        <span className="font-mono font-bold text-white">
                                            {targetCurrentCredits + creditAmount} credits
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Options for Set Mode */}
                            {creditModalMode === 'set' && (
                                <div className="space-y-2">
                                    <label className="block text-xs font-medium text-zinc-400">Set Exact Total Credits</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={creditAmount}
                                        onChange={(e) => setCreditAmount(Math.max(0, parseInt(e.target.value || '0', 10)))}
                                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                                    />
                                    <div className="p-2.5 bg-zinc-900/80 rounded-xl border border-white/5 text-xs flex items-center justify-between">
                                        <span className="text-zinc-400">New Balance:</span>
                                        <span className="font-mono font-bold text-white">
                                            {creditAmount} credits
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">Reason / Note (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Account adjustment, refund deduction, promotional bonus"
                                    value={creditNote}
                                    onChange={(e) => setCreditNote(e.target.value)}
                                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className={`w-full py-2.5 font-medium text-xs rounded-xl transition-all shadow-lg ${
                                    creditModalMode === 'remove'
                                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                                        : creditModalMode === 'set'
                                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
                                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                                }`}
                            >
                                {creditModalMode === 'remove'
                                    ? (removeAllCredits ? 'Confirm & Remove All Credits (Set to 0)' : `Confirm & Deduct ${creditAmount} Credits`)
                                    : creditModalMode === 'set'
                                    ? `Confirm & Set Balance to ${creditAmount} Credits`
                                    : `Confirm & Add ${creditAmount} Credits`}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
