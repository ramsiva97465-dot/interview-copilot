import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Trophy,
  Users,
  CheckCircle2,
  Award,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Quote
} from 'lucide-react';

interface Judge {
  name: string;
  role: string;
  company: string;
  avatarText: string;
  avatarGradient: string;
  expertise: string;
  quote: string;
  linkedin?: string;
  github?: string;
}

export const Events: React.FC = () => {
  const [showRecap, setShowRecap] = useState(false);

  const judges: Judge[] = [
    {
      name: 'Dr. Elena Rostova',
      role: 'Principal AI Research Scientist',
      company: 'DeepCognition Labs',
      avatarText: 'ER',
      avatarGradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
      expertise: 'Neural Speech & Ultra-Low STT Latency',
      quote: 'I evaluated entries on real-time stream stability, whisper acoustic quantization, and sub-400ms inference pipelines under jitter.',
      linkedin: 'https://linkedin.com',
      github: 'https://github.com'
    },
    {
      name: 'Marcus Vance',
      role: 'VP of Engineering',
      company: 'ScaleCloud Systems',
      avatarText: 'MV',
      avatarGradient: 'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)',
      expertise: 'Stealth Architecture & Native Memory Footprint',
      quote: 'My focus was on zero-detection desktop compositing hooks and minimizing CPU load while screen-share layers were running.',
      linkedin: 'https://linkedin.com',
      github: 'https://github.com'
    },
    {
      name: 'Sarah Lin',
      role: 'General Partner',
      company: 'Horizon AI Ventures',
      avatarText: 'SL',
      avatarGradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
      expertise: 'Product-Market Fit & Stealth Ergonomics',
      quote: 'We looked for seamless developer assistance that blends naturally into high-stakes interviews without cognitive overload.',
      linkedin: 'https://linkedin.com'
    },
    {
      name: 'Devon Patel',
      role: 'Principal Systems Architect',
      company: 'HyperScale Labs (ex-FAANG Bar Raiser)',
      avatarText: 'DP',
      avatarGradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
      expertise: 'DSA Solvers & Multi-Turn Context',
      quote: 'Scored projects on algorithmic accuracy, time/space optimality proofs, and instant code refactoring reliability.',
      linkedin: 'https://linkedin.com',
      github: 'https://github.com'
    }
  ];

  const winners = [
    {
      place: '1st Place • Grand Prize ($12,000)',
      team: 'Team NeuroStealth',
      project: 'Zero-Lag Adaptive Whisper Hook',
      description: 'Engineered an in-memory ring buffer that achieves 290ms audio-to-text token latency with zero disk writes.'
    },
    {
      place: '2nd Place • Runner-Up ($8,000)',
      team: 'Team Algorhythm',
      project: 'Instant Graph & DP Solver Engine',
      description: 'A contextual code parser providing optimal dynamic programming space transitions in under 350ms.'
    },
    {
      place: '3rd Place • Innovation Prize ($5,000)',
      team: 'Team GlassHUD',
      project: 'DirectX Hardware Invisible Compositor',
      description: 'A custom native driver shim bypassing OS capture pipelines across all modern virtual conference apps.'
    }
  ];

  return (
    <section id="events" className="events-section">
      <div className="section-header">
        <div className="event-badge-concluded">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>Official Event • Concluded</span>
        </div>
        <h2>MeetFloo AI Events & Hackathons</h2>
        <p>
          Showcasing groundbreaking community innovations in real-time desktop AI, speech recognition, and stealth engineering.
        </p>
      </div>

      {/* Main Finished Event Invitation Card */}
      <div className="event-invitation-card">
        {/* Hologram Ribbon */}
        <div className="event-card-header">
          <div className="event-status-pill">
            <span className="pulse-dot"></span>
            <span>Concluded • November 15–17, 2024</span>
          </div>
          <div className="ticket-number">INVITATION #MFL-2024-HACK-GLOBAL</div>
        </div>

        <div className="event-invitation-body">
          <div className="event-info-main">
            <span className="event-category">48-Hour Virtual Hackathon & Demo Day</span>
            <h3 className="event-title">MeetFloo AI Global Copilot Hackathon 2024</h3>
            <p className="event-description">
              The premier global challenge for AI developers and systems engineers. Participants competed to design,
              test, and deploy high-performance real-time meeting intelligence algorithms and invisible desktop workflows.
            </p>

            <div className="event-meta-grid">
              <div className="event-meta-item">
                <Calendar size={18} className="meta-icon" />
                <div>
                  <span className="meta-label">Event Date</span>
                  <span className="meta-value">Nov 15–17, 2024</span>
                </div>
              </div>

              <div className="event-meta-item">
                <MapPin size={18} className="meta-icon" />
                <div>
                  <span className="meta-label">Venue</span>
                  <span className="meta-value">Global Discord & Virtual Stage</span>
                </div>
              </div>

              <div className="event-meta-item">
                <Trophy size={18} className="meta-icon" />
                <div>
                  <span className="meta-label">Total Prize Pool</span>
                  <span className="meta-value">$25,000 USD Awarded</span>
                </div>
              </div>

              <div className="event-meta-item">
                <Users size={18} className="meta-icon" />
                <div>
                  <span className="meta-label">Turnout</span>
                  <span className="meta-value">1,280+ Builders (340 Teams)</span>
                </div>
              </div>
            </div>

            <div className="event-actions">
              <button
                type="button"
                className="btn-event-recap"
                onClick={() => setShowRecap(!showRecap)}
                aria-expanded={showRecap}
              >
                <Award size={18} />
                <span>{showRecap ? 'Hide Winning Projects' : 'View Winning Projects & Highlights'}</span>
                {showRecap ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <div className="invitation-tag">
                <Sparkles size={14} className="text-primary" />
                <span>Event Concluded • Winning Projects Deployed</span>
              </div>
            </div>
          </div>

          {/* Ticket Stub Graphic */}
          <div className="event-ticket-stub">
            <div className="stub-notch-top"></div>
            <div className="stub-content">
              <div className="stub-badge">OFFICIAL PASS</div>
              <div className="stub-logo">MeetFloo</div>
              <div className="stub-name">Global AI Hackathon 2024</div>
              <div className="stub-dates">NOV 15 - 17, 2024</div>
              <div className="stub-divider"></div>
              <div className="stub-status">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>ARCHIVED & VERIFIED</span>
              </div>
              <div className="barcode-mock">
                <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
              </div>
            </div>
            <div className="stub-notch-bottom"></div>
          </div>
        </div>

        {/* Collapsible Winners Showcase */}
        {showRecap && (
          <div className="event-winners-drawer">
            <div className="winners-header">
              <Trophy size={20} className="text-yellow-400" />
              <h4>2024 Hackathon Award Recipients</h4>
            </div>
            <div className="winners-grid">
              {winners.map((w, idx) => (
                <div key={idx} className="winner-card">
                  <div className="winner-place">{w.place}</div>
                  <h5 className="winner-team">{w.team}</h5>
                  <div className="winner-project">{w.project}</div>
                  <p className="winner-desc">{w.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Judges Section */}
      <div className="judges-container">
        <div className="judges-header">
          <div className="judges-badge">Distinguished Panel</div>
          <h3>Meet the Hackathon Judges</h3>
          <p>
            Our submissions were scrutinized by industry leaders in AI systems, speech science, venture capital, and engineering leadership.
          </p>
        </div>

        <div className="judges-grid">
          {judges.map((j, i) => (
            <div key={i} className="judge-card">
              <div className="judge-card-top">
                <div
                  className="judge-avatar"
                  style={{ background: j.avatarGradient }}
                >
                  <span>{j.avatarText}</span>
                </div>
                <div className="judge-info">
                  <h4 className="judge-name">{j.name}</h4>
                  <div className="judge-role">{j.role}</div>
                  <div className="judge-company">{j.company}</div>
                </div>
              </div>

              <div className="judge-expertise">
                <span className="expertise-label">Judging Focus:</span>
                <span className="expertise-tag">{j.expertise}</span>
              </div>

              <div className="judge-quote">
                <Quote size={14} className="quote-icon" />
                <p>"{j.quote}"</p>
              </div>

              <div className="judge-links">
                {j.linkedin && (
                  <a
                    href={j.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="judge-social-link"
                    title={`Connect with ${j.name} on LinkedIn`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.85 6.46a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                )}
                {j.github && (
                  <a
                    href={j.github}
                    target="_blank"
                    rel="noreferrer"
                    className="judge-social-link"
                    title={`View ${j.name}'s GitHub`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                    </svg>
                    <span>GitHub</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
