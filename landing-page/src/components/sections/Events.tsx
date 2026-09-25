import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  Play,
  ChevronLeft,
  X,
  Volume2
} from 'lucide-react';

interface Judge {
  name: string;
  role: string;
  company: string;
  avatarText: string;
  avatarColor: string;
  expertise: string;
  quote: string;
  linkedin?: string;
}

export const Events: React.FC = () => {
  const [isPlayingRecap, setIsPlayingRecap] = useState(false);

  const judges: Judge[] = [
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

  // Soundwave dot columns generator for the blue poster
  const waveColumns = [
    4, 6, 8, 12, 16, 20, 14, 18, 22, 16, 11, 8, 12, 17, 21, 24, 18, 13, 9, 6, 10, 15, 19, 14, 8, 5
  ];

  return (
    <section id="events" className="sarvam-event-wrapper">
      <div className="sarvam-event-container">
        {/* Navigation Breadcrumb */}
        <div className="event-breadcrumb">
          <a href="#features" className="back-link">
            <ChevronLeft size={16} />
            <span>All events</span>
          </a>
        </div>

        {/* Top Hero: Poster Card (Left) + Event Meta (Right) */}
        <div className="event-hero-grid">
          {/* Blue Event Poster Card */}
          <div className="event-poster-card">
            <div className="poster-top-brand">
              <span className="brand-lowercase">meetfloo</span>
            </div>

            <div className="poster-title-wrap">
              <h2 className="poster-event-title">
                Build Voice Agents that<br />scale with MeetFloo
              </h2>

              <div className="poster-badge-row">
                <span className="poster-pill">Thursday, 20 August, 2024</span>
                <span className="poster-pill">4 PM IST</span>
              </div>
            </div>

            {/* Dotted Soundwave Graphic */}
            <div className="poster-soundwave" aria-hidden="true">
              {waveColumns.map((dotCount, colIdx) => (
                <div key={colIdx} className="wave-col">
                  {Array.from({ length: dotCount }).map((_, dotIdx) => (
                    <span
                      key={dotIdx}
                      className="wave-dot"
                      style={{
                        opacity: 0.35 + (dotIdx / dotCount) * 0.65
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Title, Description, Meta & View Recap Button */}
          <div className="event-overview-details">
            <div className="event-session-pill">
              MEETFLOO IN SESSION
            </div>

            <h1 className="event-main-headline">
              Build Voice Agents that scale with MeetFloo
            </h1>

            <p className="event-main-lead">
              Join us for a live walkthrough of how to build and run voice agents for real customer conversations,
              from shaping an agent around a use case to launching calls and improving performance over time.
            </p>

            <div className="event-meta-list">
              <div className="event-meta-row">
                <Calendar size={18} className="meta-icon-blue" />
                <span>Thursday, 20 August, 2024</span>
              </div>
              <div className="event-meta-row">
                <Clock size={18} className="meta-icon-blue" />
                <span>4:00 PM IST</span>
              </div>
              <div className="event-meta-row">
                <Video size={18} className="meta-icon-blue" />
                <span>Zoom (Concluded & Recorded)</span>
              </div>
            </div>

            <div className="event-cta-wrap">
              <button
                type="button"
                className="btn-view-recap"
                onClick={() => setIsPlayingRecap(true)}
              >
                <Play size={16} fill="currentColor" />
                <span>View recap</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section: Event Content */}
        <div className="event-content-section">
          <h3 className="section-title-clean">Event content</h3>

          <p className="content-paragraph">
            The session will cover the decisions behind agents that need to keep working across real conversations:
            the call flow, the customer information they need, the systems they connect to, and what to change when calls do not go as planned.
          </p>

          <p className="content-paragraph">
            By the end, you should have a clear view of how to build, launch, and operate voice agents on MeetFloo from start to finish.
          </p>

          <div className="what-you-learn-block">
            <h4 className="subheading-bold">What you'll learn</h4>
            <ul className="learn-bullet-list">
              <li>Set up and configure a voice agent around a real use case</li>
              <li>Define the right goals, behaviour, and conversation flow</li>
              <li>Write and improve prompts for live customer calls</li>
              <li>Test the paths that matter before going live</li>
              <li>Connect customer data, APIs, and knowledge bases</li>
              <li>Rent a phone number and launch live calls</li>
              <li>Track campaign outcomes and conversation drop-offs</li>
              <li>Learn from real calls and improve agent performance over time</li>
            </ul>
          </div>

          <p className="event-format-note">
            <strong>Format:</strong> Live platform demo + Q&amp;A
          </p>
        </div>

        {/* Section: Recording Player Card */}
        <div className="event-recording-section">
          <h3 className="section-title-clean">Recording</h3>

          <div className="recording-player-card">
            <div className="recording-thumbnail">
              <div className="recording-overlay">
                <button
                  type="button"
                  className="recording-play-btn"
                  onClick={() => setIsPlayingRecap(true)}
                  aria-label="Play recording"
                >
                  <Play size={28} fill="white" className="play-icon-offset" />
                </button>
                <span className="recording-duration">54:12 • Full Session</span>
              </div>
              <div className="recording-info-strip">
                <div className="strip-title">Build Voice Agents that scale with MeetFloo (Live Recording)</div>
                <div className="strip-sub">Hosted on Zoom • Recorded August 20, 2024</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Judges Panel */}
        <div className="event-judges-section">
          <div className="judges-section-head">
            <div className="judges-pill">EVALUATION PANEL</div>
            <h3 className="section-title-clean">Event Judges &amp; Industry Experts</h3>
            <p className="judges-sub">
              Our live agent demonstrations, voice latency benchmarks, and scenario test paths were reviewed by leading AI and systems leaders.
            </p>
          </div>

          <div className="sarvam-judges-grid">
            {judges.map((j, idx) => (
              <div key={idx} className="sarvam-judge-card">
                <div className="judge-top-bar">
                  <div
                    className="judge-circle-avatar"
                    style={{ backgroundColor: j.avatarColor }}
                  >
                    <span>{j.avatarText}</span>
                  </div>
                  <div>
                    <h4 className="judge-person-name">{j.name}</h4>
                    <div className="judge-person-role">{j.role}</div>
                    <div className="judge-person-company">{j.company}</div>
                  </div>
                </div>

                <div className="judge-focus-box">
                  <span className="focus-label">Focus Area</span>
                  <span className="focus-val">{j.expertise}</span>
                </div>

                <p className="judge-quote-text">
                  "{j.quote}"
                </p>

                {j.linkedin && (
                  <div className="judge-footer-link">
                    <a
                      href={j.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="linkedin-link"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.85 6.46a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                      </svg>
                      <span>LinkedIn Profile</span>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Interactive Video Recap Player */}
        {isPlayingRecap && (
          <div className="recap-modal-backdrop" onClick={() => setIsPlayingRecap(false)}>
            <div className="recap-modal-window" onClick={(e) => e.stopPropagation()}>
              <div className="recap-modal-header">
                <div className="flex-center gap-2">
                  <Volume2 size={18} className="text-primary" />
                  <span className="font-bold">Session Recording: Build Voice Agents with MeetFloo</span>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setIsPlayingRecap(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="recap-video-mock">
                <div className="mock-video-screen">
                  <div className="poster-top-brand mb-4">
                    <span className="brand-lowercase" style={{ fontSize: '1.25rem' }}>meetfloo</span>
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                    Live Walkthrough: Scaling Voice Agents
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
                    Stream audio recorded from live session • August 20, 2024
                  </p>
                  <div className="mock-audio-bars">
                    <span className="bar animate-bar-1"></span>
                    <span className="bar animate-bar-2"></span>
                    <span className="bar animate-bar-3"></span>
                    <span className="bar animate-bar-4"></span>
                    <span className="bar animate-bar-5"></span>
                  </div>
                </div>

                <div className="mock-video-controls">
                  <div className="timeline-bar">
                    <div className="timeline-progress" style={{ width: '42%' }}></div>
                  </div>
                  <div className="controls-row">
                    <span>22:45 / 54:12</span>
                    <span className="quality-pill">1080p HD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
