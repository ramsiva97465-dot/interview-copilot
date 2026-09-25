import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  FileText,
  Clock,
  Users,
  Square,
  Sparkles,
  ArrowDown,
  RefreshCw,
  AlertCircle,
  Copy,
  Check,
  CheckCircle2,
  Calendar,
  ListTodo,
} from 'lucide-react';
import { useT } from '../i18n';
import {
  getStoredUserEmail,
  fetchUserProfile,
  getStoredSummarizeDailyRemaining,
  getStoredSummarizeDailyLimit,
  UserAccountData
} from '../lib/userUsageService';

interface TranscriptEntry {
  id: string;
  speaker: string; // 'You' | 'Speaker 1' | 'Speaker 2' etc.
  speakerRaw: string;
  speakerId?: string;
  text: string;
  timestamp: number;
  final: boolean;
}

interface SummarizeMeetingInterfaceProps {
  onEndMeeting: (rendererTranscript?: TranscriptEntry[]) => void;
  overlayOpacity?: number;
  interfaceTheme?: string;
}

export const SummarizeMeetingInterface: React.FC<SummarizeMeetingInterfaceProps> = ({
  onEndMeeting,
  overlayOpacity = 0.95,
  interfaceTheme = 'modern',
}) => {
  const t = useT();

  // Active view: 'transcript' or 'summary'
  const [activeTab, setActiveTab] = useState<'transcript' | 'summary'>('transcript');

  // Elapsed meeting duration
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Daily Allowance (in minutes)
  const [dailyRemainingMinutes, setDailyRemainingMinutes] = useState<number>(() => getStoredSummarizeDailyRemaining());
  const [dailyLimitMinutes, setDailyLimitMinutes] = useState<number>(() => getStoredSummarizeDailyLimit());
  const [isDailyAllowanceExhausted, setIsDailyAllowanceExhausted] = useState(false);

  // Live Transcripts
  const [transcriptEntries, setTranscriptEntries] = useState<TranscriptEntry[]>([]);
  const [currentPartial, setCurrentPartial] = useState<{ speaker: string; text: string } | null>(null);

  // Speaker mapping: maps speaker IDs (e.g. 'speaker_0') to sequential "Speaker 1", "Speaker 2", etc.
  const speakerMapRef = useRef<Map<string, string>>(new Map());

  // Reset all session state cleanly
  const resetSessionState = useCallback(() => {
    setTranscriptEntries([]);
    setCurrentPartial(null);
    setElapsedSeconds(0);
    setSummaryData(null);
    setActiveTab('transcript');
    speakerMapRef.current.clear();
  }, []);

  // Listen to session-reset IPC event from main process
  useEffect(() => {
    if (!window.electronAPI?.onSessionReset) return;
    const unsub = window.electronAPI.onSessionReset(() => {
      resetSessionState();
    });
    return () => {
      if (unsub) unsub();
    };
  }, [resetSessionState]);

  // Meeting Summary State
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryData, setSummaryData] = useState<{
    overview?: string;
    keyPoints?: string[];
    decisions?: string[];
    actionItems?: Array<{ text: string; owner?: string; completed?: boolean }>;
  } | null>(null);

  // UI helpers
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const isAutoScrollEnabled = useRef(true);

  // Distinct speakers count
  const distinctSpeakers = useMemo(() => {
    const set = new Set<string>();
    transcriptEntries.forEach((e) => set.add(e.speaker));
    if (currentPartial) set.add(currentPartial.speaker);
    return Math.max(1, set.size);
  }, [transcriptEntries, currentPartial]);

  // Sync user profile & daily allowance on mount
  useEffect(() => {
    let isMounted = true;
    const email = getStoredUserEmail();

    fetchUserProfile(email).then((user) => {
      if (!isMounted || !user) return;
      if (typeof user.summarize_daily_remaining === 'number') {
        setDailyRemainingMinutes(user.summarize_daily_remaining);
        if (user.summarize_daily_remaining <= 0) {
          setIsDailyAllowanceExhausted(true);
        }
      }
      if (typeof user.summarize_daily_limit === 'number') {
        setDailyLimitMinutes(user.summarize_daily_limit);
      }
    });

    const handleAllowanceEvent = (e: any) => {
      const user = e.detail as Partial<UserAccountData>;
      if (user?.summarize_daily_remaining !== undefined) {
        setDailyRemainingMinutes(user.summarize_daily_remaining);
        if (user.summarize_daily_remaining <= 0) {
          setIsDailyAllowanceExhausted(true);
        }
      }
    };
    window.addEventListener('meetfloo_user_credits_updated', handleAllowanceEvent);

    // Listen for IPC signal from backend when daily allowance runs out
    const cleanupExhausted = (window.electronAPI as any)?.onSummarizeDailyAllowanceExhausted?.(() => {
      setIsDailyAllowanceExhausted(true);
    });

    return () => {
      isMounted = false;
      window.removeEventListener('meetfloo_user_credits_updated', handleAllowanceEvent);
      if (cleanupExhausted) cleanupExhausted();
    };
  }, []);

  // Meeting duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Resolve display speaker label:
  // Current user's voice (mic) = "You"
  // Remote system voices = "Speaker 1", "Speaker 2", etc.
  const resolveSpeakerLabel = (rawSpeaker: string, speakerId?: string): string => {
    const norm = (rawSpeaker || '').toLowerCase().trim();
    if (norm === 'user' || norm === 'me' || norm === 'you') {
      return 'You';
    }

    // Remote audio participant
    const key = speakerId || norm || 'remote';
    if (!speakerMapRef.current.has(key)) {
      const nextIndex = speakerMapRef.current.size + 1;
      speakerMapRef.current.set(key, `Speaker ${nextIndex}`);
    }
    return speakerMapRef.current.get(key)!;
  };

  // Listen to incoming live audio transcripts
  useEffect(() => {
    if (!window.electronAPI?.onNativeAudioTranscript) return;

    const cleanup = window.electronAPI.onNativeAudioTranscript((segment: any) => {
      const speakerName = resolveSpeakerLabel(segment.speaker, segment.speakerId);
      const text = (segment.text || '').trim();
      if (!text) return;

      if (!segment.final) {
        setCurrentPartial({ speaker: speakerName, text });
      } else {
        setCurrentPartial(null);
        setTranscriptEntries((prev) => {
          // If the last entry is by the same speaker within 15 seconds, append text smoothly
          const last = prev[prev.length - 1];
          if (
            last &&
            last.speaker === speakerName &&
            segment.timestamp - last.timestamp < 15000
          ) {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...last,
              text: `${last.text} ${text}`,
              timestamp: segment.timestamp,
            };
            return updated;
          }

          return [
            ...prev,
            {
              id: `tr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
              speaker: speakerName,
              speakerRaw: segment.speaker,
              speakerId: segment.speakerId,
              text,
              timestamp: segment.timestamp || Date.now(),
              final: true,
            },
          ];
        });
      }
    });

    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, []);

  // Auto-scroll transcript container
  useEffect(() => {
    if (isAutoScrollEnabled.current && transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [transcriptEntries, currentPartial]);

  const handleScroll = () => {
    if (!transcriptContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = transcriptContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 60;
    isAutoScrollEnabled.current = isAtBottom;
    setShowScrollBottom(!isAtBottom);
  };

  const scrollToBottom = () => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTo({
        top: transcriptContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
      isAutoScrollEnabled.current = true;
      setShowScrollBottom(false);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTurnTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const handleCopyTranscript = () => {
    const fullText = transcriptEntries
      .map((e) => `[${formatTurnTime(e.timestamp)}] ${e.speaker}:\n${e.text}\n`)
      .join('\n');
    navigator.clipboard.writeText(fullText);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2000);
  };

  // Generate live interim summary from the collected transcript
  const handleGenerateInterimSummary = async () => {
    if (transcriptEntries.length === 0) return;
    setIsGeneratingSummary(true);
    try {
      const fullText = transcriptEntries.map((e) => `${e.speaker}: ${e.text}`).join('\n');
      const res = await (window.electronAPI as any)?.generateMeetingSummary?.(fullText);
      if (res) {
        setSummaryData({
          overview: res.overview || (Array.isArray(res.tldr) ? res.tldr.join(' ') : 'Discussion summary.'),
          keyPoints: Array.isArray(res.tldr) ? res.tldr : res.keyPoints || [],
          decisions: Array.isArray(res.decisions)
            ? res.decisions.map((d: any) => (typeof d === 'string' ? d : d.text))
            : [],
          actionItems: Array.isArray(res.actionItems)
            ? res.actionItems.map((a: any) => ({
                text: typeof a === 'string' ? a : a.text,
                owner: typeof a === 'object' ? a.owner : undefined,
                completed: false,
              }))
            : [],
        });
        setActiveTab('summary');
      }
    } catch (e) {
      console.warn('[SummarizeMeeting] Interim summary error:', e);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleEndAndSave = () => {
    const finalEntries = [...transcriptEntries];
    if (currentPartial && currentPartial.text.trim()) {
      finalEntries.push({
        id: `tr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        speaker: currentPartial.speaker,
        speakerRaw: 'user',
        text: currentPartial.text.trim(),
        timestamp: Date.now(),
        final: true,
      });
    }
    onEndMeeting(finalEntries);
    resetSessionState();
  };

  return (
    <div
      data-interface-theme={interfaceTheme}
      className="w-full h-full flex flex-col select-none text-zinc-100 overflow-hidden font-sans"
      style={{
        backgroundColor: `rgba(18, 18, 22, ${overlayOpacity})`,
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-black/20 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <FileText size={15} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-white tracking-tight">
                {t('Summarize Meeting')}
              </span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                {t('Free Daily')}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-zinc-400 mt-0.5">
              <span className="flex items-center gap-1">
                <Clock size={11} className="text-zinc-500" />
                {formatTimer(elapsedSeconds)}
              </span>
              <span className="flex items-center gap-1">
                <Users size={11} className="text-zinc-500" />
                {distinctSpeakers} {distinctSpeakers === 1 ? t('Speaker') : t('Speakers')}
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400/90 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {Math.max(0, dailyRemainingMinutes)}m {t('left today')}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Navigation Tabs */}
          <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/10 text-[11px]">
            <button
              onClick={() => setActiveTab('transcript')}
              className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 ${
                activeTab === 'transcript'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Mic size={12} />
              {t('Transcript')}
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 ${
                activeTab === 'summary'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles size={12} className={summaryData ? 'text-amber-400' : ''} />
              {t('Summary')}
            </button>
          </div>

          {/* End & Auto-Save Meeting Button */}
          <button
            onClick={handleEndAndSave}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-[11px] font-semibold transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <Square size={12} className="fill-red-400 text-red-400" />
            {t('End & Save')}
          </button>
        </div>
      </header>

      {/* ── DAILY ALLOWANCE EXHAUSTED WARNING BANNER ─────────────────── */}
      {isDailyAllowanceExhausted && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-[11px] text-amber-200 shrink-0">
          <div className="flex items-center gap-2">
            <AlertCircle size={14} className="text-amber-400 shrink-0" />
            <span>
              {t("You've used today's 10-minute free Summarize Meeting allowance. It resets tomorrow!")}
            </span>
          </div>
          <button
            onClick={handleEndAndSave}
            className="px-2 py-0.5 rounded bg-amber-500/30 hover:bg-amber-500/40 text-amber-100 font-medium text-[10px]"
          >
            {t('Save & Exit')}
          </button>
        </div>
      )}

      {/* ── MAIN CONTENT AREA ────────────────────────────────────────── */}
      <main className="flex-1 overflow-hidden relative flex flex-col">
        {activeTab === 'transcript' ? (
          <div className="flex-1 flex flex-col h-full relative">
            {/* Transcript Toolbar */}
            <div className="flex items-center justify-between px-4 py-1.5 border-b border-white/5 bg-white/[0.02] text-[10px] text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {t('Live Speaker Diarization Active')}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyTranscript}
                  disabled={transcriptEntries.length === 0}
                  className="flex items-center gap-1 hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
                >
                  {copiedTranscript ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                  {copiedTranscript ? t('Copied') : t('Copy All')}
                </button>
                <button
                  onClick={handleGenerateInterimSummary}
                  disabled={transcriptEntries.length === 0 || isGeneratingSummary}
                  className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium disabled:opacity-30 cursor-pointer"
                >
                  {isGeneratingSummary ? (
                    <RefreshCw size={11} className="animate-spin" />
                  ) : (
                    <Sparkles size={11} />
                  )}
                  {t('Summarize Now')}
                </button>
              </div>
            </div>

            {/* Transcript Scroll Container */}
            <div
              ref={transcriptContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3 custom-scrollbar"
            >
              {transcriptEntries.length === 0 && !currentPartial ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 mb-1">
                    <Mic size={20} className="animate-pulse" />
                  </div>
                  <p className="text-[13px] font-medium text-zinc-300">
                    {t('Listening to meeting audio...')}
                  </p>
                  <p className="text-[11px] max-w-sm text-zinc-500 leading-relaxed">
                    {t('Speak into your microphone or play meeting audio. The system will separate speakers into "You" and "Speaker N" in real-time.')}
                  </p>
                </div>
              ) : (
                <>
                  {transcriptEntries.map((entry) => {
                    const isYou = entry.speaker === 'You';
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex flex-col gap-1 p-2.5 rounded-xl border transition-colors ${
                          isYou
                            ? 'bg-blue-500/10 border-blue-500/25 ml-4'
                            : 'bg-zinc-900/60 border-white/10 mr-4'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                                isYou
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              }`}
                            >
                              {entry.speaker}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-500">
                            {formatTurnTime(entry.timestamp)}
                          </span>
                        </div>
                        <p className="text-[12.5px] leading-relaxed text-zinc-200 mt-1 pl-0.5 select-text">
                          {entry.text}
                        </p>
                      </motion.div>
                    );
                  })}

                  {/* Live Partial Preview */}
                  {currentPartial && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`flex flex-col gap-1 p-2.5 rounded-xl border border-dashed transition-colors ${
                        currentPartial.speaker === 'You'
                          ? 'bg-blue-500/5 border-blue-500/30 ml-4'
                          : 'bg-zinc-900/40 border-white/15 mr-4'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider opacity-80 ${
                            currentPartial.speaker === 'You'
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-purple-500/20 text-purple-300'
                          }`}
                        >
                          {currentPartial.speaker}
                        </span>
                        <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                          {t('speaking...')}
                        </span>
                      </div>
                      <p className="text-[12.5px] leading-relaxed text-zinc-300 italic pl-0.5">
                        {currentPartial.text}
                      </p>
                    </motion.div>
                  )}
                </>
              )}
            </div>

            {/* Jump to bottom button */}
            <AnimatePresence>
              {showScrollBottom && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={scrollToBottom}
                  className="absolute bottom-4 right-5 p-2 rounded-full bg-zinc-800/90 text-white border border-white/20 shadow-lg hover:bg-zinc-700 transition-all cursor-pointer"
                >
                  <ArrowDown size={14} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* ── SUMMARY VIEW ────────────────────────────────────────────── */
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 custom-scrollbar">
            {summaryData ? (
              <div className="space-y-4">
                {/* Overview Card */}
                {summaryData.overview && (
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                    <h3 className="text-[12px] font-semibold text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <Sparkles size={13} />
                      {t('Executive Summary')}
                    </h3>
                    <p className="text-[12px] text-zinc-200 leading-relaxed select-text">
                      {summaryData.overview}
                    </p>
                  </div>
                )}

                {/* Key Points */}
                {summaryData.keyPoints && summaryData.keyPoints.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                    <h3 className="text-[12px] font-semibold text-blue-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <CheckCircle2 size={13} />
                      {t('Key Discussion Points')}
                    </h3>
                    <ul className="space-y-1.5 pl-1">
                      {summaryData.keyPoints.map((kp, idx) => (
                        <li key={idx} className="text-[12px] text-zinc-300 flex items-start gap-2 select-text">
                          <span className="text-blue-400 mt-1 text-[9px]">•</span>
                          <span className="flex-1">{kp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Decisions */}
                {summaryData.decisions && summaryData.decisions.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                    <h3 className="text-[12px] font-semibold text-purple-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <CheckCircle2 size={13} />
                      {t('Decisions Made')}
                    </h3>
                    <ul className="space-y-1.5 pl-1">
                      {summaryData.decisions.map((dec, idx) => (
                        <li key={idx} className="text-[12px] text-zinc-300 flex items-start gap-2 select-text">
                          <span className="text-purple-400 mt-1 text-[9px]">✔</span>
                          <span className="flex-1">{dec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Items */}
                {summaryData.actionItems && summaryData.actionItems.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                    <h3 className="text-[12px] font-semibold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <ListTodo size={13} />
                      {t('Action Items')}
                    </h3>
                    <ul className="space-y-2 pl-1">
                      {summaryData.actionItems.map((act, idx) => (
                        <li key={idx} className="text-[12px] text-zinc-200 flex items-center gap-2 select-text">
                          <input
                            type="checkbox"
                            checked={act.completed || false}
                            onChange={() => {
                              const updated = [...summaryData.actionItems!];
                              updated[idx].completed = !updated[idx].completed;
                              setSummaryData({ ...summaryData, actionItems: updated });
                            }}
                            className="rounded border-zinc-600 text-emerald-500 focus:ring-0 cursor-pointer"
                          />
                          <span className={act.completed ? 'line-through text-zinc-500' : ''}>
                            {act.text}
                          </span>
                          {act.owner && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 ml-auto font-mono">
                              @{act.owner}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500 space-y-3">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400">
                  <Sparkles size={20} />
                </div>
                <p className="text-[13px] font-medium text-zinc-300">
                  {t('No summary generated yet')}
                </p>
                <p className="text-[11px] max-w-sm text-zinc-500">
                  {t('As the conversation unfolds, you can generate real-time takeaways or end the meeting to generate and save the complete summary automatically.')}
                </p>
                <button
                  onClick={handleGenerateInterimSummary}
                  disabled={transcriptEntries.length === 0 || isGeneratingSummary}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium transition-all active:scale-95 disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                >
                  {isGeneratingSummary ? (
                    <RefreshCw size={12} className="animate-spin" />
                  ) : (
                    <Sparkles size={12} />
                  )}
                  {t('Generate Interim Summary')}
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── FOOTER BAR ────────────────────────────────────────────────── */}
      <footer className="px-4 py-2 border-t border-white/10 bg-black/30 flex items-center justify-between text-[11px] text-zinc-400 shrink-0">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-zinc-400 font-mono text-[10px]">
            <Calendar size={11} className="text-zinc-500" />
            {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-[10px] text-zinc-400">
            {t('Auto-save on session stop')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-500">
            {t('Daily Free Allowance')}:
          </span>
          <span className="font-semibold text-emerald-400 text-[11px]">
            {Math.max(0, dailyRemainingMinutes)} / {dailyLimitMinutes} {t('min remaining')}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default SummarizeMeetingInterface;
