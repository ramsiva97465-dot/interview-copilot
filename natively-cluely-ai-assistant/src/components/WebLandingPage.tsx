import React, { useState, useEffect } from 'react';
import {
    Download,
    Sparkles,
    CheckCircle2,
    ArrowRight,
    EyeOff,
    Bot,
    Calendar,
    Clock,
    Video,
    ChevronLeft,
    Zap,
    BarChart3,
    Shield,
    Headphones,
    Users,
    TrendingUp,
    Star
} from 'lucide-react';
import desktopUiPreview from '../assets/desktopui.webp';
import logoFullDark from '../assets/logo-full-dark.png';
import heroDashboard from '../assets/hero-dashboard.jpg';
import workflowSteps from '../assets/workflow-steps.jpg';
import hackathonEvent from '../assets/hackathon-event.jpg';

export const WebLandingPage: React.FC = () => {
    const [downloading, setDownloading] = useState(false);
    const [currentView, setCurrentView] = useState<'home' | 'events'>('home');

    const judges = [
        {
            name: 'Dr. Elena Rostova',
            role: 'Principal AI Research Scientist',
            company: 'DeepCognition Labs',
            avatarText: 'ER',
            avatarColor: '#4338ca',
            expertise: 'Voice Agents & Low-Latency Neural STT',
            quote: 'Evaluated teams on real-time acoustic transcription stability, noise handling, and conversational voice responsiveness.',
            linkedin: 'https://linkedin.com'
        },
        {
            name: 'Marcus Vance',
            role: 'VP of Engineering',
            company: 'ScaleCloud Systems',
            avatarText: 'MV',
            avatarColor: '#1d4ed8',
            expertise: 'Telecom Infrastructure & Voice Streaming Pipelines',
            quote: 'Scored architectures on SIP trunking latency, packet loss resilience, and scalable multi-agent concurrency.',
            linkedin: 'https://linkedin.com'
        },
        {
            name: 'Sarah Lin',
            role: 'General Partner',
            company: 'Horizon AI Ventures',
            avatarText: 'SL',
            avatarColor: '#7c3aed',
            expertise: 'Enterprise Voice Workflows & Product Market Fit',
            quote: 'Looked for voice agent experiences that solve high-friction enterprise customer journeys seamlessly.',
            linkedin: 'https://linkedin.com'
        },
        {
            name: 'Devon Patel',
            role: 'Principal Systems Architect',
            company: 'HyperScale Labs (ex-FAANG Bar Raiser)',
            avatarText: 'DP',
            avatarColor: '#0f766e',
            expertise: 'Real-Time Prompt Engineering & Fallback Systems',
            quote: 'Assessed prompt reliability, edge-case recovery when callers deviate from scripts, and knowledge base lookups.',
            linkedin: 'https://linkedin.com'
        }
    ];

    const waveColumns = [
        4, 6, 8, 12, 16, 20, 14, 18, 22, 16, 11, 8, 12, 17, 21, 24, 18, 13, 9, 6, 10, 15, 19, 14, 8, 5
    ];

    useEffect(() => {
        document.documentElement.style.overflowY = 'auto';
        document.documentElement.style.overflowX = 'hidden';
        document.documentElement.style.height = 'auto';
        document.body.style.overflowY = 'auto';
        document.body.style.overflowX = 'hidden';
        document.body.style.height = 'auto';
        const root = document.getElementById('root');
        if (root) {
            root.style.overflowY = 'visible';
            root.style.overflowX = 'hidden';
            root.style.height = 'auto';
            root.style.minHeight = '100vh';
        }

        const checkHash = () => {
            if (window.location.hash === '#events') {
                setCurrentView('events');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setCurrentView('home');
            }
        };

        checkHash();
        window.addEventListener('hashchange', checkHash);
        return () => window.removeEventListener('hashchange', checkHash);
    }, []);

    const navigateTo = (view: 'home' | 'events', hash?: string) => {
        setCurrentView(view);
        if (view === 'events') {
            window.location.hash = '#events';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            if (hash) {
                window.location.hash = hash;
                setTimeout(() => {
                    const el = document.querySelector(hash);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 50);
            } else {
                if (window.location.hash) {
                    history.pushState(null, '', window.location.pathname);
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    const downloadUrl = 'https://github.com/ramsiva97465-dot/interview-copilot/releases/download/v2.9.2/MeetFloo-Setup-2.9.2.exe';

    const handleDownload = () => {
        setDownloading(true);
        window.location.href = downloadUrl;
        setTimeout(() => setDownloading(false), 4000);
    };

    return (
        <div className="w-full min-h-screen bg-[#06070B] text-white selection:bg-purple-500/30 relative overflow-x-hidden overflow-y-visible" style={{ fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
                html, body, #root {
                    overflow-y: auto !important;
                    overflow-x: hidden !important;
                    height: auto !important;
                    min-height: 100% !important;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.8; }
                }
            `}</style>

            {/* Subtle Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none" />
            {/* Central Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-purple-600/15 via-indigo-600/8 to-transparent blur-[140px] pointer-events-none rounded-full" />

            {/* ─── NAVIGATION ─── */}
            <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#06070B]/75 border-b border-white/[0.05]">
                <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => navigateTo('home')}
                        className="flex items-center gap-2.5 bg-transparent border-none p-0 cursor-pointer group"
                    >
                        <img src={logoFullDark} alt="MeetFloo" className="h-6 w-auto object-contain transition-transform group-hover:scale-105" />
                        <span className="text-[9px] font-semibold tracking-wide text-purple-300/70 bg-purple-500/8 border border-purple-500/15 px-1.5 py-0.5 rounded-md">
                            v2.9.2
                        </span>
                    </button>

                    <nav className="hidden md:flex items-center gap-0.5 bg-white/[0.03] border border-white/[0.05] p-0.5 rounded-full">
                        {[
                            { label: 'Features', action: () => navigateTo('home', '#features') },
                            { label: 'How It Works', action: () => navigateTo('home', '#how-it-works') },
                            { label: 'Customers', action: () => navigateTo('home', '#testimonials') },
                            { label: 'Events', action: () => navigateTo('events') },
                        ].map((item) => (
                            <button
                                key={item.label}
                                type="button"
                                onClick={item.action}
                                className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all cursor-pointer border-none ${
                                    currentView === 'events' && item.label === 'Events'
                                        ? 'bg-purple-500/20 text-purple-200 font-semibold'
                                        : 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <a
                        href={downloadUrl}
                        download="MeetFloo-Setup-2.9.2.exe"
                        onClick={handleDownload}
                        id="header-download-cta"
                        className="flex items-center gap-1.5 bg-white text-[#06070B] font-semibold text-[11px] px-3.5 py-1.5 rounded-lg hover:bg-zinc-100 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer no-underline shadow-sm"
                    >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                    </a>
                </div>
            </header>

            {/* ═══════════════════════ HOME VIEW ═══════════════════════ */}
            {currentView === 'home' && (
                <>
                    {/* ─── HERO SECTION ─── */}
                    <section className="pt-16 sm:pt-20 pb-12">
                        <div className="max-w-5xl mx-auto px-5">
                            {/* Centered Hero Content */}
                            <div className="text-center max-w-3xl mx-auto">
                                {/* Pill Badge */}
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-medium mb-6">
                                    <Sparkles className="w-3 h-3 text-purple-400" />
                                    <span>Powered by ARIA — Your AI Sales Manager</span>
                                </div>

                                {/* Main Headline */}
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.12]">
                                    Close More Deals With{' '}
                                    <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                                        AI-Powered Sales Intelligence
                                    </span>
                                </h1>

                                {/* Subtitle */}
                                <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl mx-auto">
                                    MeetFloo helps sales teams prepare, perform, and follow up on every customer call — with real-time AI guidance that stays invisible to prospects.
                                </p>

                                {/* CTA Row */}
                                <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                                    <a
                                        href={downloadUrl}
                                        download="MeetFloo-Setup-2.9.2.exe"
                                        onClick={handleDownload}
                                        id="hero-primary-download-btn"
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-purple-900/40 border border-purple-400/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer no-underline"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span>{downloading ? 'Starting Download...' : 'Download for Windows'}</span>
                                        <span className="text-[10px] font-mono bg-black/25 text-purple-200 px-1.5 py-0.5 rounded">.exe</span>
                                    </a>
                                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        <span>v2.9.2 • Windows 10 & 11 • Free Trial</span>
                                    </div>
                                </div>

                                {/* Social Proof Strip */}
                                <div className="mt-6 inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
                                    <div className="flex -space-x-1.5">
                                        <img className="h-5 w-5 rounded-full ring-1 ring-[#06070B] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="" />
                                        <img className="h-5 w-5 rounded-full ring-1 ring-[#06070B] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="" />
                                        <img className="h-5 w-5 rounded-full ring-1 ring-[#06070B] object-cover" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&q=80" alt="" />
                                        <img className="h-5 w-5 rounded-full ring-1 ring-[#06070B] object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80" alt="" />
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[11px]">
                                        <span className="text-amber-400">★★★★★</span>
                                        <span className="text-white font-semibold">4.9</span>
                                        <span className="text-zinc-600">•</span>
                                        <span className="text-zinc-400">Trusted by 1,200+ sales teams</span>
                                    </div>
                                </div>
                            </div>

                            {/* Hero Product Image */}
                            <div className="mt-12 relative max-w-4xl mx-auto">
                                <div className="absolute -inset-4 bg-gradient-to-b from-purple-500/10 via-indigo-500/5 to-transparent blur-3xl rounded-3xl pointer-events-none" />
                                <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-purple-950/30">
                                    <img
                                        src={heroDashboard}
                                        alt="MeetFloo AI Sales Dashboard — real-time meeting intelligence with CRM sidebar and live talking points"
                                        className="w-full h-auto object-cover"
                                    />
                                    {/* Gradient Overlay at Bottom */}
                                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#06070B] to-transparent pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ─── METRICS STRIP ─── */}
                    <section className="py-10 border-y border-white/[0.04]">
                        <div className="max-w-4xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                            {[
                                { value: '+34%', label: 'Higher Win Rate' },
                                { value: '6+ hrs', label: 'Saved Per Week' },
                                { value: '<400ms', label: 'Response Time' },
                                { value: '1,200+', label: 'Sales Teams' },
                            ].map((stat) => (
                                <div key={stat.label}>
                                    <div className="text-xl sm:text-2xl font-extrabold text-white">{stat.value}</div>
                                    <div className="text-[11px] text-zinc-500 mt-0.5 font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ─── HOW IT WORKS (Before → During → After) ─── */}
                    <section id="how-it-works" className="py-16">
                        <div className="max-w-5xl mx-auto px-5">
                            <div className="text-center mb-12">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/8 px-2.5 py-0.5 rounded-full border border-indigo-500/15">
                                    How It Works
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">
                                    ARIA works across every stage of your sales call
                                </h2>
                                <p className="text-sm text-zinc-400 mt-2 max-w-lg mx-auto">
                                    From pre-call research to post-call CRM updates — fully automated.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                {[
                                    {
                                        step: '01',
                                        phase: 'Before',
                                        title: 'Auto-Prep & Research',
                                        desc: 'ARIA pulls prospect data, deal history, and competitive intel so your reps walk into every call fully briefed.',
                                        color: 'purple',
                                        icon: BarChart3,
                                    },
                                    {
                                        step: '02',
                                        phase: 'During',
                                        title: 'Live In-Call Guidance',
                                        desc: 'Real-time battlecards, objection handling, and talking points appear on a stealth overlay — invisible to prospects.',
                                        color: 'indigo',
                                        icon: Zap,
                                    },
                                    {
                                        step: '03',
                                        phase: 'After',
                                        title: 'Automated Follow-Up',
                                        desc: 'Meeting notes, CRM updates, and personalized follow-up emails are drafted and synced automatically.',
                                        color: 'emerald',
                                        icon: CheckCircle2,
                                    },
                                ].map((item) => {
                                    const Icon = item.icon;
                                    const colorMap: Record<string, { border: string; bg: string; text: string; icon: string }> = {
                                        purple: { border: 'border-purple-500/20', bg: 'bg-purple-500/8', text: 'text-purple-400', icon: 'text-purple-400' },
                                        indigo: { border: 'border-indigo-500/20', bg: 'bg-indigo-500/8', text: 'text-indigo-400', icon: 'text-indigo-400' },
                                        emerald: { border: 'border-emerald-500/20', bg: 'bg-emerald-500/8', text: 'text-emerald-400', icon: 'text-emerald-400' },
                                    };
                                    const c = colorMap[item.color];
                                    return (
                                        <div key={item.step} className={`p-5 rounded-2xl bg-[#0A0B12] border ${c.border} hover:border-opacity-60 transition-all duration-300`}>
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center`}>
                                                    <Icon className={`w-4 h-4 ${c.icon}`} />
                                                </div>
                                                <div>
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${c.text}`}>{item.phase}</span>
                                                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                                                </div>
                                            </div>
                                            <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Workflow Illustration */}
                            <div className="mt-10 max-w-3xl mx-auto rounded-2xl overflow-hidden border border-white/[0.06] shadow-xl">
                                <img
                                    src={workflowSteps}
                                    alt="MeetFloo sales workflow — prepare, guide, and follow up"
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        </div>
                    </section>

                    {/* ─── FEATURES GRID ─── */}
                    <section id="features" className="py-16 border-t border-white/[0.04]">
                        <div className="max-w-5xl mx-auto px-5">
                            <div className="text-center mb-12">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400 bg-purple-500/8 px-2.5 py-0.5 rounded-full border border-purple-500/15">
                                    Core Capabilities
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">
                                    Everything your sales team needs to win
                                </h2>
                                <p className="text-sm text-zinc-400 mt-2 max-w-lg mx-auto">
                                    Built for account executives, SDRs, and revenue leaders who want to close faster with less manual work.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    {
                                        icon: Bot,
                                        title: 'ARIA AI Sales Manager',
                                        desc: 'Your always-on AI copilot that prepares, guides, and follows up on every customer conversation.',
                                    },
                                    {
                                        icon: Zap,
                                        title: 'Live Objection Handling',
                                        desc: 'Instant battlecards for pricing, competitor, and technical objections delivered in under 400ms.',
                                    },
                                    {
                                        icon: Users,
                                        title: 'Team Learning Engine',
                                        desc: 'Learns from your top closers and replicates winning patterns across the entire sales org.',
                                    },
                                    {
                                        icon: EyeOff,
                                        title: 'Stealth Overlay',
                                        desc: 'Completely invisible to Zoom, Meet, and Teams screen shares. Your secret competitive advantage.',
                                    },
                                    {
                                        icon: Headphones,
                                        title: 'Direct Audio Capture',
                                        desc: 'Crystal-clear voice transcription via system audio loopback — no microphone lag or echo.',
                                    },
                                    {
                                        icon: Shield,
                                        title: 'CRM & Tool Sync',
                                        desc: 'Bi-directional sync with Salesforce, HubSpot, Zoom, Meet, Teams, and your email — zero manual entry.',
                                    },
                                ].map((feature, idx) => {
                                    const Icon = feature.icon;
                                    return (
                                        <div
                                            key={idx}
                                            className="group p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-purple-500/25 hover:bg-white/[0.03] transition-all duration-300"
                                        >
                                            <div className="w-9 h-9 rounded-lg bg-purple-500/8 border border-purple-500/15 flex items-center justify-center mb-3 group-hover:bg-purple-500/12 transition-colors">
                                                <Icon className="w-4 h-4 text-purple-400" />
                                            </div>
                                            <h3 className="text-[13px] font-bold text-white">{feature.title}</h3>
                                            <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">{feature.desc}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* ─── CUSTOMER TESTIMONIALS ─── */}
                    <section id="testimonials" className="py-16 border-t border-white/[0.04] bg-gradient-to-b from-[#08091010] to-[#06070B]">
                        <div className="max-w-5xl mx-auto px-5">
                            <div className="text-center mb-12">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/8 px-2.5 py-0.5 rounded-full border border-emerald-500/15">
                                    Customer Stories
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">
                                    Trusted by high-performing sales teams
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    {
                                        quote: "Our demo-to-close rate jumped 34% in 60 days. Having live objection battlecards during pricing negotiations gave our reps instant confidence.",
                                        name: 'Sarah Jenkins',
                                        role: 'VP of Sales',
                                        company: 'HorizonTech',
                                        metric: '+34% Win Rate',
                                        img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
                                        ring: 'ring-purple-500/40',
                                    },
                                    {
                                        quote: "The automated CRM sync alone is worth 10x the price. Reps no longer spend an hour after calls logging notes into Salesforce.",
                                        name: 'David Chen',
                                        role: 'Head of RevOps',
                                        company: 'CloudScale',
                                        metric: '6+ hrs Saved / Week',
                                        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
                                        ring: 'ring-indigo-500/40',
                                    },
                                    {
                                        quote: "The stealth overlay is flawless. I share my screen on Zoom during demos, and MeetFloo stays completely hidden while giving me real-time talking points.",
                                        name: 'Elena Rodriguez',
                                        role: 'Enterprise AE',
                                        company: 'FinFlow',
                                        metric: '100% Invisible',
                                        img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
                                        ring: 'ring-purple-500/40',
                                    },
                                ].map((t, idx) => (
                                    <div key={idx} className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.08] transition-all flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-1.5 mb-3">
                                                <div className="flex text-amber-400 text-[11px] tracking-tight">★★★★★</div>
                                                <span className="text-[10px] text-zinc-500 font-medium">{t.metric}</span>
                                            </div>
                                            <p className="text-xs text-zinc-300 leading-relaxed">
                                                "{t.quote}"
                                            </p>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center gap-2.5">
                                            <img
                                                src={t.img}
                                                alt={t.name}
                                                className={`w-8 h-8 rounded-full object-cover ring-1 ${t.ring}`}
                                            />
                                            <div>
                                                <div className="text-xs font-semibold text-white">{t.name}</div>
                                                <div className="text-[10px] text-zinc-500">{t.role}, {t.company}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ─── QUICK SETUP ─── */}
                    <section id="steps" className="py-16 border-t border-white/[0.04]">
                        <div className="max-w-4xl mx-auto px-5 text-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/8 px-2.5 py-0.5 rounded-full border border-indigo-500/15">
                                Quick Setup
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">
                                Up and running in under 3 minutes
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10 text-left">
                                {[
                                    {
                                        num: '01',
                                        title: 'Download & Install',
                                        desc: 'Download MeetFloo for Windows. Lightweight local install, no cloud dependency.',
                                        numColor: 'text-purple-500/25',
                                    },
                                    {
                                        num: '02',
                                        title: 'Activate Free Trial',
                                        desc: 'Launch the app and start your free trial with full ARIA AI guidance unlocked.',
                                        numColor: 'text-indigo-500/25',
                                    },
                                    {
                                        num: '03',
                                        title: 'Start Winning Calls',
                                        desc: 'Join your next Zoom, Teams, or Meet call. ARIA guides you in real-time, invisibly.',
                                        numColor: 'text-emerald-500/25',
                                    },
                                ].map((step) => (
                                    <div key={step.num} className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                        <span className={`text-3xl font-black ${step.numColor}`}>{step.num}</span>
                                        <h4 className="text-sm font-bold text-white mt-1.5">{step.title}</h4>
                                        <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{step.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ─── BOTTOM CTA ─── */}
                    <section className="py-16 border-t border-white/[0.04] relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-purple-900/10 pointer-events-none" />
                        <div className="max-w-2xl mx-auto px-5 text-center relative z-10">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                Ready to transform your sales calls?
                            </h2>
                            <p className="text-zinc-400 mt-3 text-sm max-w-md mx-auto">
                                Join 1,200+ sales teams already using MeetFloo to close deals faster with AI-powered guidance.
                            </p>

                            <div className="mt-7">
                                <a
                                    href={downloadUrl}
                                    download="MeetFloo-Setup-2.9.2.exe"
                                    onClick={handleDownload}
                                    id="bottom-download-btn"
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm px-7 py-3 rounded-xl shadow-lg shadow-purple-900/40 border border-purple-400/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer no-underline"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>Download for Windows (.exe)</span>
                                </a>
                            </div>

                            <p className="text-[10px] text-zinc-600 mt-3">
                                v2.9.2 • Windows 10/11 (64-bit) • Free Trial Included
                            </p>
                        </div>
                    </section>
                </>
            )}

            {/* ═══════════════════════ EVENTS VIEW ═══════════════════════ */}
            {currentView === 'events' && (
                <section id="events" className="relative min-h-[80vh]">
                    {/* Full-Width Hero Banner with Image */}
                    <div className="relative w-full h-[420px] sm:h-[480px] overflow-hidden">
                        <img
                            src={hackathonEvent}
                            alt="MeetFloo Product Hackathon 2025"
                            className="w-full h-full object-cover"
                        />
                        {/* Dark Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#06070B] via-[#06070B]/70 to-[#06070B]/30" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#06070B]/50 to-transparent" />

                        {/* Back Button */}
                        <div className="absolute top-6 left-6 z-20">
                            <button
                                type="button"
                                onClick={() => navigateTo('home')}
                                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/80 hover:text-white transition-colors bg-black/30 hover:bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 cursor-pointer"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                <span>Back to Home</span>
                            </button>
                        </div>

                        {/* Hero Content Overlay */}
                        <div className="absolute bottom-0 inset-x-0 z-10 px-5 pb-10">
                            <div className="max-w-5xl mx-auto">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-[10px] font-bold tracking-widest uppercase mb-4">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    <span>Event Recap • April 2025</span>
                                </div>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1] max-w-2xl">
                                    MeetFloo Product<br />Hackathon 2025
                                </h1>
                                <p className="text-sm sm:text-base text-zinc-300/80 mt-3 max-w-lg leading-relaxed">
                                    450+ developers and AI engineers came together for a 48-hour sprint — building the future of real-time AI sales intelligence.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Event Stats Strip */}
                    <div className="relative z-20 -mt-8">
                        <div className="max-w-4xl mx-auto px-5">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { value: '450+', label: 'Participated', icon: Users },
                                    { value: '48hrs', label: 'Build Sprint', icon: Clock },
                                    { value: '120+', label: 'Submitted', icon: Zap },
                                    { value: '04 Apr', label: '2025', icon: Calendar },
                                ].map((stat) => {
                                    const StatIcon = stat.icon;
                                    return (
                                        <div key={stat.label} className="p-4 rounded-xl bg-[#0C0D15]/90 backdrop-blur-xl border border-white/[0.08] text-center shadow-lg">
                                            <StatIcon className="w-4 h-4 text-blue-400 mx-auto mb-1.5" />
                                            <div className="text-lg font-extrabold text-white">{stat.value}</div>
                                            <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">{stat.label}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Event Details */}
                    <div className="max-w-5xl mx-auto px-5 pt-14 pb-16">
                        {/* Event Info Row */}
                        <div className="flex flex-wrap items-center gap-3 mb-10">
                            {[
                                { icon: Calendar, text: 'Held on 04 April 2025 • 48-Hour Virtual Hackathon' },
                                { icon: Clock, text: 'Demo Day concluded at 4:00 PM IST' },
                                { icon: CheckCircle2, text: 'Completed — Winners Announced' },
                            ].map((info) => {
                                const InfoIcon = info.icon;
                                return (
                                    <div key={info.text} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs text-zinc-300">
                                        <InfoIcon className="w-3 h-3 text-purple-400" />
                                        <span>{info.text}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Hackathon Tracks — Premium Cards */}
                        <div>
                            <div className="mb-8">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/8 px-2.5 py-0.5 rounded-full border border-blue-500/15">
                                    Challenge Tracks
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">
                                    What our builders shipped
                                </h2>
                                <p className="text-sm text-zinc-400 mt-1.5 max-w-lg">
                                    High-performance AI tools for live enterprise conversations — real-time audio, LLM routing, and stealth architecture.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    {
                                        title: 'Sub-400ms Audio STT',
                                        desc: 'Direct system audio loopback with zero echo during multi-speaker enterprise calls.',
                                        gradient: 'from-blue-600/15 to-indigo-600/5',
                                        borderColor: 'border-blue-500/20',
                                        iconColor: 'text-blue-400',
                                        icon: Headphones,
                                    },
                                    {
                                        title: 'Invisible Stealth Overlay',
                                        desc: 'HUDs excluded from Zoom, Meet, Teams, and all desktop screen-sharing protocols.',
                                        gradient: 'from-purple-600/15 to-violet-600/5',
                                        borderColor: 'border-purple-500/20',
                                        iconColor: 'text-purple-400',
                                        icon: EyeOff,
                                    },
                                    {
                                        title: 'Live Objection Synthesis',
                                        desc: 'Real-time competitive counter-points, pricing metrics, and ROI calculations.',
                                        gradient: 'from-emerald-600/15 to-teal-600/5',
                                        borderColor: 'border-emerald-500/20',
                                        iconColor: 'text-emerald-400',
                                        icon: Zap,
                                    },
                                    {
                                        title: 'Multi-LLM Routing',
                                        desc: 'Smart dispatching across DeepSeek R1, Claude 3.5, and Gemini 2.5 Flash for optimal speed.',
                                        gradient: 'from-amber-600/15 to-orange-600/5',
                                        borderColor: 'border-amber-500/20',
                                        iconColor: 'text-amber-400',
                                        icon: TrendingUp,
                                    },
                                    {
                                        title: 'Autonomous Meeting Intel',
                                        desc: 'Auto action-items, executive summaries, and mid-conversation CRM sync.',
                                        gradient: 'from-indigo-600/15 to-blue-600/5',
                                        borderColor: 'border-indigo-500/20',
                                        iconColor: 'text-indigo-400',
                                        icon: Bot,
                                    },
                                    {
                                        title: 'Zero-Cloud Security',
                                        desc: 'End-to-end client encryption with zero transcript logs or data leakage.',
                                        gradient: 'from-rose-600/15 to-pink-600/5',
                                        borderColor: 'border-rose-500/20',
                                        iconColor: 'text-rose-400',
                                        icon: Shield,
                                    },
                                ].map((track) => {
                                    const TrackIcon = track.icon;
                                    return (
                                        <div
                                            key={track.title}
                                            className={`group p-5 rounded-xl bg-gradient-to-br ${track.gradient} border ${track.borderColor} hover:border-opacity-60 transition-all duration-300 hover:-translate-y-0.5`}
                                        >
                                            <div className={`w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                                <TrackIcon className={`w-4 h-4 ${track.iconColor}`} />
                                            </div>
                                            <h3 className="text-[13px] font-bold text-white">{track.title}</h3>
                                            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{track.desc}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Format Badge */}
                            <div className="mt-8 flex items-center justify-center">
                                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
                                    <span className="text-[11px] text-zinc-400">
                                        <strong className="text-zinc-200">Format:</strong> 48-Hour Rapid Build
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-zinc-600" />
                                    <span className="text-[11px] text-zinc-400">120+ Submissions</span>
                                    <span className="w-1 h-1 rounded-full bg-zinc-600" />
                                    <span className="text-[11px] text-zinc-400">Live Pitch Day & Jury Q&A</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ─── FOOTER ─── */}
            <footer className="border-t border-white/[0.04] py-8 text-[11px] text-zinc-600">
                <div className="max-w-5xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <img src={logoFullDark} alt="MeetFloo" className="h-5 w-auto object-contain opacity-60" />
                        <span>•</span>
                        <span>© 2025 MeetFloo AI. All rights reserved.</span>
                    </div>
                    <div className="flex items-center gap-5">
                        {[
                            { label: 'Features', action: () => navigateTo('home', '#features') },
                            { label: 'Customers', action: () => navigateTo('home', '#testimonials') },
                            { label: 'Events', action: () => navigateTo('events') },
                        ].map((link) => (
                            <button
                                key={link.label}
                                type="button"
                                onClick={link.action}
                                className="bg-transparent border-none p-0 cursor-pointer text-[11px] text-zinc-600 hover:text-zinc-300 transition-colors"
                            >
                                {link.label}
                            </button>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};
