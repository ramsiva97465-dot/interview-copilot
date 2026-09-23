import React from 'react';
import { useT } from '../i18n';
import {
    Shield, Cpu, Database,
    MicOff, Sparkles, Zap, Activity, ListOrdered, Boxes, WifiOff
} from 'lucide-react';
import { APP_FEATURE_VERSION } from '../utils/appVersion';

interface AboutSectionProps { }

export const AboutSection: React.FC<AboutSectionProps> = () => {
    const t = useT();
    const appVersion = import.meta.env.VITE_APP_VERSION || 'unknown';
    const buildCommit = import.meta.env.VITE_BUILD_COMMIT || 'unknown';

    return (
        <div className="space-y-6 animated fadeIn pb-10" data-settings-stagger>
            {/* Header */}
            <div>
                <h3 className="text-lg font-bold text-text-primary mb-1">{t('About MeetFloo')}</h3>
                <p className="text-sm text-text-secondary">{t('Designed to be invisible, intelligent, and trusted.')}</p>
            </div>

            {/* What's New Section */}
            <div>
                <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2 px-1">{`${t("What's New in")} v${APP_FEATURE_VERSION}`}</h4>
                <div className="bg-bg-item-surface rounded-xl border border-border-subtle overflow-hidden">
                    {/* 1. Direct Assist */}
                    <div className="p-3 border-b border-border-subtle bg-bg-card/50">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                                <Zap size={20} />
                            </div>
                            <div>
                                <h5 className="text-sm font-bold text-text-primary mb-1">Direct Assist</h5>
                                <p className="text-xs text-text-secondary leading-relaxed">
                                    The model sees your last three minutes of conversation and your reference files verbatim — no retrieval, no summarising in between. Off by default; enable it in AI Providers.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 2. Bring Your Own Reranker */}
                    <div className="p-3 border-b border-border-subtle bg-bg-card/50">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                                <ListOrdered size={20} />
                            </div>
                            <div>
                                <h5 className="text-sm font-bold text-text-primary mb-1">Bring Your Own Reranker</h5>
                                <p className="text-xs text-text-secondary leading-relaxed">
                                    Choose what picks the material behind your answers — hosted through Jina AI or OpenRouter, or run locally. Installs from Hugging Face in Settings › Reranker.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 3. Providers That Fail Over */}
                    <div className="p-3 border-b border-border-subtle bg-bg-card/50">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                                <Activity size={20} />
                            </div>
                            <div>
                                <h5 className="text-sm font-bold text-text-primary mb-1">Providers That Fail Over</h5>
                                <p className="text-xs text-text-secondary leading-relaxed">
                                    A stalled provider no longer costs you the answer. OpenAI, Claude, DeepSeek, LiteLLM, NVIDIA NIM and custom endpoints now switch to a spare, or retry in parallel. Local models are untouched.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 4. Lighter and Faster */}
                    <div className="p-3 border-b border-border-subtle bg-bg-card/50">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                                <Cpu size={20} />
                            </div>
                            <div>
                                <h5 className="text-sm font-bold text-text-primary mb-1">Lighter and Faster</h5>
                                <p className="text-xs text-text-secondary leading-relaxed">
                                    Around a quarter less memory, and windows open faster. Each used to load the entire app — the tiny overlay toggle booted the Markdown and maths renderers just to draw a button.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 5. Choose Your Embedding Model */}
                    <div className="p-3 bg-bg-card/50">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                                <Boxes size={20} />
                            </div>
                            <div>
                                <h5 className="text-sm font-bold text-text-primary mb-1">Choose Your Embedding Model</h5>
                                <p className="text-xs text-text-secondary leading-relaxed">
                                    Set what finds your material: Gemini, OpenAI, Voyage AI, OpenRouter, Ollama or any OpenAI-compatible endpoint, each with a live Test. In Settings › Embeddings.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Architecture Section */}
            <div>
                <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2 px-1">{t('How MeetFloo Works')}</h4>
                <div className="bg-bg-item-surface rounded-xl border border-border-subtle overflow-hidden">
                    <div className="p-3 border-b border-border-subtle bg-bg-card/50">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                                <Cpu size={20} />
                            </div>
                            <div>
                                <h5 className="text-sm font-bold text-text-primary mb-1">Stateful Intelligence OS</h5>
                                <p className="text-xs text-text-secondary leading-relaxed">
                                    Acts as a persistent control plane using mode-aware priors (Sales, Technical, Lecture) to dynamically filter context and direct queries to the optimal reasoning engine.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-3 bg-bg-card/50">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                                <Database size={20} />
                            </div>
                            <div>
                                <h5 className="text-sm font-bold text-text-primary mb-1">Hindsight LTM & Session Memory</h5>
                                <p className="text-xs text-text-secondary leading-relaxed">
                                    Combines a secure local sidecar vector database for document indexing with a time-decayed sliding transcript memory to retrieve relevant semantic context on-demand.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Privacy Section */}
            <div>
                <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2 px-1">{t('Privacy & Data Protection')}</h4>
                <div className="bg-bg-item-surface rounded-xl border border-border-subtle p-5 space-y-4">
                    <div className="flex items-start gap-3">
                        <Shield size={16} className="text-green-400 mt-0.5" />
                        <div>
                            <h5 className="text-sm font-medium text-text-primary">{t('Stealth & Undetectable Operation')}</h5>
                            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                                Features "Undetectable Mode" engineered with native OS window display affinity to remain completely invisible to Zoom, Microsoft Teams, Google Meet, and screen recording software.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <WifiOff size={16} className="text-emerald-400 mt-0.5" />
                        <div>
                            <h5 className="text-sm font-medium text-text-primary">{t('Zero Telemetry & 100% Local')}</h5>
                            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                                All telemetry, phone-home metrics, and background pings are completely disabled. MeetFloo communicates only with your configured AI providers directly.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <MicOff size={16} className="text-red-500 mt-0.5" />
                        <div>
                            <h5 className="text-sm font-medium text-text-primary">{t('No Ambient Recording')}</h5>
                            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                                MeetFloo captures audio loopback only when explicitly active. It does not record video, store persistent mic tracks, or perform background surveillance.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* App Overview Section */}
            <div>
                <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2 px-1">{t('Edition Details')}</h4>
                <div className="bg-bg-item-surface rounded-xl border border-border-subtle p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-accent-subtle flex items-center justify-center text-accent-primary shadow-sm shadow-[var(--accent-shadow-20)]">
                            <Sparkles size={18} className="opacity-80" />
                        </div>
                        <div>
                            <h5 className="text-sm font-bold text-text-primary">MeetFloo Copilot</h5>
                            <p className="text-xs text-text-secondary mt-0.5">High-performance AI copilot for live interviews, meetings, and contextual assistance.</p>
                        </div>
                    </div>
                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
                        Standalone Build
                    </span>
                </div>
            </div>

            {/* Credits */}
            <div className="pt-4 border-t border-border-subtle">
                <div>
                    <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-3">{t('Core Technology')}</h4>
                    <div className="flex flex-wrap gap-2">
                        {['Groq', 'Gemini', 'OpenAI', 'Deepgram', 'ElevenLabs', 'Electron', 'React', 'Rust', 'Sharp', 'TypeScript', 'Tailwind CSS', 'Vite', 'Google Cloud', 'SQLite'].map(tech => (
                            <span key={tech} className="px-2.5 py-1 rounded-md bg-bg-input border border-border-subtle text-[11px] font-medium text-text-secondary">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
                <p className="mt-4 text-[11px] text-text-tertiary font-mono">
                    {`Version ${appVersion} · Build ${buildCommit}`}
                </p>
            </div>
        </div >
    );
};
