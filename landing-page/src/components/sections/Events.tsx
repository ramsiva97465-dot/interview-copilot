import React from 'react';
import {
  Calendar,
  Clock,
  Video,
  ChevronLeft
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

interface EventsProps {
  onBack?: () => void;
}

export const Events: React.FC<EventsProps> = ({ onBack }) => {

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
          <button
            type="button"
            className="back-link"
            style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={() => onBack ? onBack() : window.location.hash = ''}
          >
            <ChevronLeft size={16} />
            <span>All events</span>
          </button>
        </div>

        {/* Top Hero: Poster Card (Left) + Event Meta (Right) */}
        <div className="event-hero-grid">
          {/* Blue Event Poster Card */}
          <div className="event-poster-card">
            <div className="poster-top-brand">
              <span className="brand-lowercase">meetfloo</span>
              <span style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#bfdbfe', marginTop: '4px' }}>
                BUILDER HACKATHON 2024
              </span>
            </div>

            <div className="poster-title-wrap">
              <h2 className="poster-event-title">
                Real-Time AI Copilot &amp;<br />Stealth Assistant Hackathon
              </h2>

              <div className="poster-badge-row">
                <span className="poster-pill">48-Hour Global Sprint</span>
                <span className="poster-pill">04 April 2025</span>
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
              MEETFLOO PRODUCT HACKATHON 2025
            </div>

            <h1 className="event-main-headline">
              MeetFloo Global AI Copilot &amp; Real-Time Assistant Hackathon
            </h1>

            <p className="event-main-lead">
              Over 450+ developers and AI engineers competed in a high-intensity 48-hour hackathon to build next-generation real-time voice assistants, sub-400ms audio loopback transcription pipelines, screen-invisible HUDs, and autonomous sales intelligence agents powered by MeetFloo.
            </p>

            <div className="event-meta-list">
              <div className="event-meta-row">
                <Calendar size={18} className="meta-icon-blue" />
                <span>04 April 2025 (48-Hour Virtual Hackathon)</span>
              </div>
              <div className="event-meta-row">
                <Clock size={18} className="meta-icon-blue" />
                <span>Grand Finale Demo Day • 4:00 PM IST</span>
              </div>
              <div className="event-meta-row">
                <Video size={18} className="meta-icon-blue" />
                <span>Virtual Pitch Showcase &amp; Winner Awards (Concluded)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Hackathon Tracks & Challenges */}
        <div className="event-content-section">
          <h3 className="section-title-clean">Hackathon Tracks &amp; Challenges</h3>

          <p className="content-paragraph">
            Teams were challenged to build high-performance AI tools that operate reliably during live enterprise conversations—pushing the boundaries of real-time audio streaming, LLM routing, and low-latency client architecture.
          </p>

          <p className="content-paragraph">
            Builders competed across core tracks designed around MeetFloo's stealth engine and real-time inference pipeline:
          </p>

          <div className="what-you-learn-block">
            <h4 className="subheading-bold">Key Submission Focus Areas</h4>
            <ul className="learn-bullet-list">
              <li><strong>Sub-400ms Audio STT:</strong> Direct system audio loopback capture with zero echo or microphone bleed during multi-speaker client calls.</li>
              <li><strong>100% Invisible Stealth Overlay:</strong> Transparent HUDs engineered to remain completely excluded from Zoom, Meet, Teams, and desktop screen-shares.</li>
              <li><strong>Live Objection &amp; Battlecard Synthesis:</strong> Instant retrieval and streaming of competitive counter-points, pricing metrics, and ROI calculation in real-time.</li>
              <li><strong>Enterprise Solution Architecture Synthesis:</strong> Generating real-time technical integration trade-offs, security compliance answers, and API workflows live during calls.</li>
              <li><strong>Multi-LLM Dynamic Routing:</strong> Smart dispatching across DeepSeek R1, Claude 3.5 Sonnet, and Gemini 2.5 Flash for optimal response speed.</li>
              <li><strong>Autonomous Meeting Intelligence:</strong> Automated action-item extraction, executive summaries, and CRM sync generated mid-conversation.</li>
              <li><strong>Zero-Cloud On-Device Security:</strong> End-to-end client encryption ensuring zero transcript logs or enterprise session data leakage.</li>
            </ul>
          </div>

          <p className="event-format-note">
            <strong>Hackathon Format:</strong> 48-Hour Rapid Build • 120+ Submissions • Live Pitch Day &amp; Jury Q&amp;A
          </p>
        </div>

        {/* Section: Judges Panel */}
        <div className="event-judges-section">
          <div className="judges-section-head">
            <div className="judges-pill">EVALUATION PANEL</div>
            <h3 className="section-title-clean">Hackathon Judges &amp; Industry Experts</h3>
            <p className="judges-sub">
              Hackathon finalist projects, latency benchmarks, and code accuracy were scrutinized and scored by leading AI researchers and systems architects.
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
                  <span className="focus-label">Evaluation Focus</span>
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
      </div>
    </section>
  );
};
