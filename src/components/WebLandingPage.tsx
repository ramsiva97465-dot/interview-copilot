import React, { useState, useEffect } from 'react';
import { 
    Download, 
    Shield, 
    Sparkles, 
    Monitor, 
    Cpu, 
    Code, 
    CheckCircle2, 
    Lock, 
    Zap, 
    ArrowRight,
    Headphones,
    EyeOff,
    Terminal,
    Bot,
    Play
} from 'lucide-react';
import desktopUiPreview from '../assets/desktopui.webp';
import logoImg from '../assets/logo.png';

export const WebLandingPage: React.FC = () => {
    const [downloading, setDownloading] = useState(false);

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
    }, []);

    const downloadUrl = 'https://github.com/ramsiva97465-dot/interview-copilot/releases/latest/download/Xivora.Studio-Setup-2.9.0.exe';

    const handleDownload = () => {
        setDownloading(true);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'MeetFloo-Setup-2.9.0.exe';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(() => setDownloading(false), 5000);
    };

    return (
        <div className="w-full min-h-screen bg-[#07080D] text-white selection:bg-purple-500/30 font-sans relative overflow-x-hidden overflow-y-visible">
            <style>{`
                html, body, #root {
                    overflow-y: auto !important;
                    overflow-x: hidden !important;
                    height: auto !important;
                    min-height: 100% !important;
                }
            `}</style>
            {/* Background Tech Grid & Glow Orbs */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-gradient-to-b from-purple-600/25 via-indigo-600/15 to-transparent blur-[140px] pointer-events-none rounded-full" />
            <div className="absolute top-[600px] left-[-200px] w-[600px] h-[600px] bg-purple-900/15 blur-[160px] pointer-events-none rounded-full" />
            <div className="absolute top-[1200px] right-[-200px] w-[650px] h-[650px] bg-indigo-900/15 blur-[160px] pointer-events-none rounded-full" />

            {/* Top Navigation */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#07080D]/85 border-b border-white/[0.08] transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-purple-400 p-[1px] shadow-lg shadow-purple-500/20">
                            <div className="w-full h-full bg-[#0D0E15] rounded-[15px] flex items-center justify-center overflow-hidden">
                                <img src={logoImg} alt="MeetFloo" className="w-7 h-7 object-contain" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-zinc-200 to-purple-200 bg-clip-text text-transparent">
                                    MeetFloo
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                                    v2.9.0
                                </span>
                            </div>
                            <span className="text-[11px] text-zinc-400 font-medium block">AI Interview & Meeting Copilot</span>
                        </div>
                    </div>

                    <nav className="hidden lg:flex items-center gap-8 text-sm text-zinc-300 font-medium">
                        <a href="#features" className="hover:text-purple-300 transition-colors">Features</a>
                        <a href="#preview" className="hover:text-purple-300 transition-colors">Desktop HUD</a>
                        <a href="#steps" className="hover:text-purple-300 transition-colors">Installation</a>
                    </nav>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleDownload}
                            id="header-download-cta"
                            className="flex items-center gap-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-purple-600/30 border border-purple-400/40 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                        >
                            <Download className="w-4 h-4" />
                            <span>Download for Windows</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Hero Container */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
                {/* Hero Box Inspired by Modern Landing Layout */}
                <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#10121D]/90 via-[#0B0C15]/90 to-[#07080D]/90 backdrop-blur-2xl p-6 sm:p-10 lg:p-14 shadow-2xl shadow-purple-950/40 relative overflow-hidden">
                    {/* Corner Accent Glow */}
                    <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-bl from-purple-500/20 via-indigo-500/10 to-transparent blur-[100px] pointer-events-none rounded-full" />
                    <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-gradient-to-tr from-purple-800/15 via-transparent to-transparent blur-[80px] pointer-events-none rounded-full" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
                        {/* Left Column: Headlines & CTA */}
                        <div className="lg:col-span-7 flex flex-col items-start text-left">
                            {/* Promo Pill */}
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-6 shadow-inner">
                                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                                <span>10-Minute Free Trial Included</span>
                                <span className="w-1 h-1 rounded-full bg-purple-400" />
                                <span className="text-zinc-300">No Credit Card Needed</span>
                            </div>

                            {/* Main Headline */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
                                Ace Your Next <br className="hidden sm:inline" />
                                Interview With <br className="hidden sm:inline" />
                                <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                                    Real-Time AI Copilot
                                </span>
                            </h1>

                            {/* Subtitle */}
                            <p className="mt-6 text-base sm:text-lg text-zinc-300 leading-relaxed max-w-xl">
                                The stealth Windows desktop assistant for software engineers. Get instant DSA hints, algorithm code, system design answers, and audio transcription—100% invisible during screen shares.
                            </p>

                            {/* Download Action Section */}
                            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                                <button
                                    onClick={handleDownload}
                                    id="hero-primary-download-btn"
                                    className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-xl shadow-purple-600/35 border border-purple-400/40 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer group"
                                >
                                    <Download className="w-5 h-5 text-white group-hover:translate-y-0.5 transition-transform" />
                                    <span>{downloading ? 'Starting Download...' : 'Download for Windows (.exe)'}</span>
                                </button>
                            </div>

                            {/* System Spec Badges */}
                            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                                <span className="flex items-center gap-1.5">
                                    <Monitor className="w-3.5 h-3.5 text-purple-400" /> Windows 10 & 11 (64-bit)
                                </span>
                                <span>•</span>
                                <span>Single .exe Setup (~756 MB)</span>
                                <span>•</span>
                                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                                    <Shield className="w-3.5 h-3.5" /> Standalone Desktop App
                                </span>
                            </div>
                        </div>

                        {/* Right Column: App HUD Visual Preview */}
                        <div className="lg:col-span-5 relative w-full">
                            {/* Card Shell */}
                            <div className="relative rounded-2xl p-2 bg-gradient-to-b from-purple-500/30 via-indigo-500/20 to-white/5 border border-white/15 shadow-2xl shadow-purple-900/40">
                                <div className="bg-[#0B0C14] rounded-xl overflow-hidden border border-white/10 relative">
                                    {/* Mock Window Top Bar */}
                                    <div className="h-9 bg-[#121422] border-b border-white/10 px-3 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                                            <span className="ml-2 text-[11px] text-zinc-400 font-mono">MeetFloo — HUD</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                            <span>Stealth Mode ON</span>
                                        </div>
                                    </div>

                                    {/* Real UI Preview Image */}
                                    <div className="relative p-2 bg-black/60">
                                        <img 
                                            src={desktopUiPreview} 
                                            alt="MeetFloo Desktop Interface" 
                                            className="w-full h-auto rounded-lg object-cover shadow-inner border border-white/10"
                                        />

                                        {/* Floating Glass Pill 1: Coding Hint */}
                                        <div className="absolute top-6 left-5 right-5 p-3 rounded-xl bg-[#0F111E]/95 backdrop-blur-xl border border-purple-500/30 shadow-xl flex items-center gap-3 animate-fade-in">
                                            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center shrink-0">
                                                <Code className="w-4 h-4 text-purple-300" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-white">Two Sum & Graph Traversal</span>
                                                    <span className="text-[10px] text-purple-300 font-mono">O(N) Optimal</span>
                                                </div>
                                                <p className="text-[11px] text-zinc-400 truncate mt-0.5">Hash map approach: store compliments for instant lookup</p>
                                            </div>
                                        </div>

                                        {/* Floating Glass Pill 2: Audio STT */}
                                        <div className="absolute bottom-6 left-5 right-5 p-3 rounded-xl bg-[#0F111E]/95 backdrop-blur-xl border border-indigo-500/30 shadow-xl flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                                                <span className="text-xs font-semibold text-white">System Audio Transcribing</span>
                                            </div>
                                            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">
                                                sub-400ms latency
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Feature Strip (Inspired by the Reference Mockup bottom strip) */}
                    <div className="mt-12 pt-8 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Box 1 */}
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-purple-900/20 to-transparent border border-purple-500/20 flex flex-col justify-between">
                            <div>
                                <span className="text-2xl font-black text-purple-300 tracking-tight">10 MIN</span>
                                <h4 className="text-sm font-bold text-white mt-1">Free Trial Included</h4>
                                <p className="text-xs text-zinc-400 mt-1">Test live coding & voice transcription immediately on first launch.</p>
                            </div>
                            <div className="mt-3 flex items-center gap-1 text-[11px] text-purple-300 font-medium">
                                <span>Zero Card Required</span>
                            </div>
                        </div>

                        {/* Box 2 */}
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/10 transition-all flex flex-col justify-between">
                            <div>
                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                                    <EyeOff className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="text-sm font-bold text-white">100% Invisible Overlay</h4>
                                <p className="text-xs text-zinc-400 mt-1">Excluded from Zoom, Meet, Teams and interview recording windows.</p>
                            </div>
                            <div className="mt-3 flex items-center gap-1 text-[11px] text-zinc-400 font-medium">
                                <span>Stealth Hardware Layer</span>
                            </div>
                        </div>

                        {/* Box 3 */}
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/10 transition-all flex flex-col justify-between">
                            <div>
                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                                    <Terminal className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="text-sm font-bold text-white">Live DSA & System Design</h4>
                                <p className="text-xs text-zinc-400 mt-1">C++, Python, Java, JavaScript, architecture trade-offs and complexity.</p>
                            </div>
                            <div className="mt-3 flex items-center gap-1 text-[11px] text-zinc-400 font-medium">
                                <span>Instant Algorithm Hints</span>
                            </div>
                        </div>

                        {/* Box 4: CTA Tile */}
                        <div 
                            onClick={handleDownload}
                            className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-indigo-950/40 border border-indigo-500/30 flex flex-col justify-between cursor-pointer group hover:border-indigo-400/60 transition-all"
                        >
                            <div>
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center mb-2">
                                    <Download className="w-4 h-4 text-indigo-300 group-hover:scale-110 transition-transform" />
                                </div>
                                <h4 className="text-sm font-bold text-white">Download Setup Now</h4>
                                <p className="text-xs text-zinc-400 mt-1">Get MeetFloo v2.9.0 direct Windows installer.</p>
                            </div>
                            <div className="mt-3 flex items-center gap-1 text-[11px] text-indigo-300 font-bold group-hover:translate-x-1 transition-transform">
                                <span>Click to Download (.exe) →</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Core Features Grid */}
            <section id="features" className="py-20 border-t border-white/[0.06] relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-3.5 py-1.5 rounded-full border border-purple-500/20">
                            Features & Capabilities
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
                            Engineered For Technical Interview Success
                        </h2>
                        <p className="text-zinc-400 mt-3 text-sm sm:text-base">
                            Built by engineers for engineers. Stay calm, confident, and prepared during any high-stakes coding or architectural discussion.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
                        {[
                            {
                                icon: Terminal,
                                title: "LeetCode & DSA Problem Solver",
                                desc: "Understands coding challenges from live interview pads instantly. Provides optimal time & space complexity solutions in seconds."
                            },
                            {
                                icon: Cpu,
                                title: "System Design Copilot",
                                desc: "Generates high-level architectures, trade-off matrices, database choices, caching layers, and scalability patterns live."
                            },
                            {
                                icon: EyeOff,
                                title: "Screen-Share Invisible HUD",
                                desc: "Transparent glass HUD that stays on top of your screen, completely invisible to Zoom, Google Meet, Teams, or test proctors."
                            },
                            {
                                icon: Headphones,
                                title: "Direct System Audio STT",
                                desc: "Captures interviewer speech directly through internal system audio loopback with zero external wires or mic echoes."
                            },
                            {
                                icon: Zap,
                                title: "Ultra-Low Latency Inference",
                                desc: "Answers stream in under 500ms using Gemini 2.5 Flash and local neural models with zero lagging or stutter."
                            },
                            {
                                icon: Lock,
                                title: "Private & Secure Architecture",
                                desc: "Your interview notes and session data remain private on your computer. Built with enterprise privacy standards."
                            }
                        ].map((feature, idx) => {
                            const IconComp = feature.icon;
                            return (
                                <div 
                                    key={idx} 
                                    className="p-7 rounded-2xl bg-[#0D0F18]/80 border border-white/[0.06] hover:border-purple-500/40 hover:bg-[#111322] transition-all duration-300 hover:-translate-y-1 shadow-lg"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5">
                                        <IconComp className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <h3 className="text-base font-bold text-white">{feature.title}</h3>
                                    <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">{feature.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Quick 3-Step Setup */}
            <section id="steps" className="py-20 border-t border-white/[0.06] bg-gradient-to-b from-[#090A12] to-[#07080D]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3.5 py-1.5 rounded-full border border-indigo-500/20">
                        Get Started
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
                        Up and Running in 3 Minutes
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14 max-w-5xl mx-auto text-left">
                        <div className="p-7 rounded-2xl bg-zinc-900/40 border border-white/[0.06] relative">
                            <span className="text-4xl font-black text-purple-500/30">01</span>
                            <h4 className="text-base font-bold text-white mt-3">Download Windows Setup</h4>
                            <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
                                Click the download button to save <code className="text-purple-300 bg-purple-900/30 px-1.5 py-0.5 rounded">MeetFloo-Setup-2.9.0.exe</code> on your PC.
                            </p>
                        </div>

                        <div className="p-7 rounded-2xl bg-zinc-900/40 border border-white/[0.06] relative">
                            <span className="text-4xl font-black text-indigo-500/30">02</span>
                            <h4 className="text-base font-bold text-white mt-3">Launch 10-Min Free Trial</h4>
                            <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
                                Run the installer. Open MeetFloo and start your 10-Minute Free Trial with full features unlocked instantly.
                            </p>
                        </div>

                        <div className="p-7 rounded-2xl bg-zinc-900/40 border border-white/[0.06] relative">
                            <span className="text-4xl font-black text-emerald-500/30">03</span>
                            <h4 className="text-base font-bold text-white mt-3">Enter Stealth Mode</h4>
                            <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
                                Join your Google Meet, Teams, or Zoom interview. The invisible HUD displays answers without screen capture detection.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom Call To Action Banner */}
            <section className="py-20 border-t border-white/[0.08] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-indigo-900/20 to-purple-900/20 blur-3xl pointer-events-none" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                        Ready To Master Your Next Interview?
                    </h2>
                    <p className="text-zinc-300 mt-4 text-sm sm:text-base max-w-xl mx-auto">
                        Download the standalone desktop application now. Clean installation, zero configuration, and 10 minutes free trial included.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={handleDownload}
                            id="bottom-download-btn"
                            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-xl shadow-purple-600/35 border border-purple-400/40 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                        >
                            <Download className="w-5 h-5 text-white animate-bounce" />
                            <span>Download for Windows (.exe)</span>
                        </button>
                    </div>

                    <p className="text-xs text-zinc-500 mt-4">
                        Version 2.9.0 • Windows 10/11 64-bit • Standalone Desktop Application
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/[0.06] py-10 text-xs text-zinc-500 bg-[#06070B]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <img src={logoImg} alt="MeetFloo" className="w-5 h-5 object-contain" />
                        <span className="font-bold text-zinc-300">MeetFloo</span>
                        <span>•</span>
                        <span>© 2026 SnapServe-AI. All rights reserved.</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <a href="#features" className="hover:text-zinc-300 transition-colors">Features</a>
                        <a href="#steps" className="hover:text-zinc-300 transition-colors">Install Guide</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
