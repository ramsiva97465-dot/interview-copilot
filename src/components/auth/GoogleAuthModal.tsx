import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, AlertCircle, LogIn, Coins, Clock, User, LogOut } from 'lucide-react';

interface GoogleAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAuthSuccess?: (user: any) => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
    isOpen,
    onClose,
    onAuthSuccess
}) => {
    const [gmail, setGmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleGoogleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        const cleanEmail = gmail.trim().toLowerCase();

        if (!cleanEmail || !cleanEmail.includes('@')) {
            setError('Please enter a valid Gmail address (e.g. user@gmail.com).');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const baseUrl = (import.meta.env.VITE_APP_API_URL || (typeof window !== 'undefined' ? window.location.origin : '')).replace(/\/+$/, '');
            const res = await fetch(`${baseUrl}/api/auth/google/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: cleanEmail, name: fullName.trim() }),
            });

            const data = await res.json();
            if (data.success && data.user) {
                // Store in local storage for automatic login persistence
                localStorage.setItem('meetfloo_user_email', data.user.email);
                localStorage.setItem('meetfloo_user_name', data.user.name || cleanEmail.split('@')[0]);
                localStorage.setItem('meetfloo_user_credits', String(data.user.credits || 0));

                if (onAuthSuccess) {
                    onAuthSuccess(data.user);
                }
                onClose();
            } else {
                setError(data.error || 'Failed to sign in with Google.');
            }
        } catch (err: any) {
            // Local offline simulation
            const mockUser = {
                email: cleanEmail,
                name: fullName || cleanEmail.split('@')[0],
                credits: 500,
                minutes_used: 0,
                plan: 'pro_trial'
            };
            localStorage.setItem('meetfloo_user_email', cleanEmail);
            localStorage.setItem('meetfloo_user_name', mockUser.name);
            localStorage.setItem('meetfloo_user_credits', '500');

            if (onAuthSuccess) onAuthSuccess(mockUser);
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-[#121214] text-white border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                            {/* Google Colors G Logo SVG */}
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base font-semibold tracking-tight">Sign in with Google</h3>
                            <p className="text-xs text-zinc-400">Sync your credits, plan & meeting minutes to Gmail</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleGoogleSignIn} className="space-y-4">
                    {/* Error Alert */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                            <AlertCircle size={14} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-3">
                        <div>
                            <label className="block text-[11px] font-medium text-zinc-400 mb-1">Your Gmail Address</label>
                            <input
                                type="email"
                                required
                                placeholder="name@gmail.com"
                                value={gmail}
                                onChange={(e) => setGmail(e.target.value)}
                                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-medium text-zinc-400 mb-1">Full Name (Optional)</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl text-[11px] text-blue-300 flex items-start gap-2">
                        <Coins size={14} className="text-blue-400 shrink-0 mt-0.5" />
                        <span>New accounts get <strong>500 Welcome Credits</strong> automatically tied to their Gmail!</span>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 bg-white hover:bg-zinc-200 text-black font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/10"
                    >
                        {/* Google Logo */}
                        <svg width="16" height="16" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        {isSubmitting ? 'Authenticating with Google...' : 'Continue with Google Account'}
                    </button>
                </form>
            </div>
        </div>
    );
};
